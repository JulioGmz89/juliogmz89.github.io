import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';
import open from 'open';
import { createDevlogEntry } from './lib/generator.js';
import { publishToGit, getGitStatus, deleteFromGit } from './lib/git.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3000;

// Configuración - Ruta al repositorio del portafolio
const REPO_PATH = path.resolve(__dirname, '..');

// Asegurar que existe la carpeta uploads
const uploadsDir = path.join(__dirname, 'uploads');
fs.ensureDirSync(uploadsDir);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Configurar multer para uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Mantener nombre original pero hacer único
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    // Aceptar imágenes y GIFs
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Solo se permiten imágenes (jpg, png, gif, webp)'));
  }
});

// API: Obtener estado de git
app.get('/api/status', async (req, res) => {
  try {
    const status = await getGitStatus(REPO_PATH);
    res.json({ success: true, ...status });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API: Crear entrada de devlog
app.post('/api/devlog', upload.array('images', 10), async (req, res) => {
  try {
    const { title, body, date, publish } = req.body;
    const images = req.files || [];
    
    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, error: 'El título es requerido' });
    }
    
    if (!body || !body.trim()) {
      return res.status(400).json({ success: false, error: 'El contenido es requerido' });
    }
    
    const shouldPublish = publish === 'true';
    
    const entryPath = await createDevlogEntry({
      title: title.trim(),
      body: body.trim(),
      date: date || new Date().toISOString().split('T')[0],
      images,
      repoPath: REPO_PATH,
      draft: !shouldPublish
    });
    
    let message = 'Guardado como borrador';
    
    if (shouldPublish) {
      await publishToGit(REPO_PATH, entryPath, title.trim());
      message = '¡Publicado exitosamente!';
    }
    
    // Limpiar archivos temporales de uploads
    for (const img of images) {
      try {
        await fs.remove(img.path);
      } catch (e) {
        // Ignorar errores de limpieza
      }
    }
    
    res.json({ 
      success: true, 
      message,
      published: shouldPublish,
      path: entryPath 
    });
  } catch (error) {
    console.error('Error creating devlog entry:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// API: Listar entradas existentes
app.get('/api/devlog', async (req, res) => {
  try {
    const devlogPath = path.join(REPO_PATH, 'content', 'devlog');
    const entries = [];
    
    if (await fs.pathExists(devlogPath)) {
      const dirs = await fs.readdir(devlogPath);
      
      for (const dir of dirs) {
        const dirPath = path.join(devlogPath, dir);
        const stat = await fs.stat(dirPath);
        
        if (stat.isDirectory() && !dir.startsWith('_')) {
          const indexPath = path.join(dirPath, 'index.md');
          if (await fs.pathExists(indexPath)) {
            const content = await fs.readFile(indexPath, 'utf-8');
            const titleMatch = content.match(/title\s*=\s*['"](.+?)['"]/);
            const dateMatch = content.match(/date\s*=\s*['"](.+?)['"]/);
            const draftMatch = content.match(/draft\s*=\s*(true|false)/);
            
            entries.push({
              folder: dir,
              title: titleMatch ? titleMatch[1] : dir,
              date: dateMatch ? dateMatch[1] : null,
              draft: draftMatch ? draftMatch[1] === 'true' : false
            });
          }
        }
      }
      
      // Ordenar por fecha descendente
      entries.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    
    res.json({ success: true, entries });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API: Eliminar entrada de devlog
app.delete('/api/devlog/:folder', async (req, res) => {
  try {
    const { folder } = req.params;
    
    // Validar que el folder no tenga caracteres peligrosos
    if (!folder || folder.includes('..') || folder.includes('/') || folder.includes('\\')) {
      return res.status(400).json({ success: false, error: 'Nombre de carpeta inválido' });
    }
    
    const devlogPath = path.join(REPO_PATH, 'content', 'devlog');
    const entryPath = path.join(devlogPath, folder);
    const relativePath = path.join('content', 'devlog', folder);
    
    // Verificar que existe
    if (!await fs.pathExists(entryPath)) {
      return res.status(404).json({ success: false, error: 'Entrada no encontrada' });
    }
    
    // Obtener título para el mensaje de commit
    const indexPath = path.join(entryPath, 'index.md');
    let title = folder;
    if (await fs.pathExists(indexPath)) {
      const content = await fs.readFile(indexPath, 'utf-8');
      const titleMatch = content.match(/title\s*=\s*['"](.+?)['"]/);
      if (titleMatch) title = titleMatch[1];
    }
    
    // Eliminar del git y hacer push
    await deleteFromGit(REPO_PATH, relativePath, title);
    
    res.json({ 
      success: true, 
      message: `Entrada "${title}" eliminada exitosamente`
    });
  } catch (error) {
    console.error('Error deleting devlog entry:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Iniciar servidor
app.listen(PORT, async () => {
  console.log('');
  console.log('╔════════════════════════════════════════╗');
  console.log('║       📝 Portfolio Tools v1.0.0        ║');
  console.log('╠════════════════════════════════════════╣');
  console.log(`║  Server: http://localhost:${PORT}          ║`);
  console.log('║  Repo:   ' + REPO_PATH.substring(0, 28).padEnd(28) + '  ║');
  console.log('╚════════════════════════════════════════╝');
  console.log('');
  
  // Abrir navegador automáticamente
  try {
    await open(`http://localhost:${PORT}`);
  } catch (e) {
    console.log(`Abre tu navegador en: http://localhost:${PORT}`);
  }
});
