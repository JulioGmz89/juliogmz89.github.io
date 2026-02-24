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

// Configuration - Path to portfolio repository
const REPO_PATH = path.resolve(__dirname, '..');

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
fs.ensureDirSync(uploadsDir);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Configure multer for uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Keep original name but make unique
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    // Accept images and GIFs
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only images allowed (jpg, png, gif, webp)'));
  }
});

// API: Get git status
app.get('/api/status', async (req, res) => {
  try {
    const status = await getGitStatus(REPO_PATH);
    res.json({ success: true, ...status });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API: Create devlog entry
app.post('/api/devlog', upload.array('images', 10), async (req, res) => {
  try {
    const { title, body, date, publish } = req.body;
    const images = req.files || [];
    
    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, error: 'Title is required' });
    }
    
    if (!body || !body.trim()) {
      return res.status(400).json({ success: false, error: 'Content is required' });
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
    
    let message = 'Saved as draft';
    
    if (shouldPublish) {
      await publishToGit(REPO_PATH, entryPath, title.trim());
      message = 'Published successfully!';
    }
    
    // Clean up temporary upload files
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

// API: List existing entries
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
      
      // Sort by date descending
      entries.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    
    res.json({ success: true, entries });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API: Delete devlog entry
app.delete('/api/devlog/:folder', async (req, res) => {
  try {
    const { folder } = req.params;
    
    // Validate folder has no dangerous characters
    if (!folder || folder.includes('..') || folder.includes('/') || folder.includes('\\')) {
      return res.status(400).json({ success: false, error: 'Invalid folder name' });
    }
    
    const devlogPath = path.join(REPO_PATH, 'content', 'devlog');
    const entryPath = path.join(devlogPath, folder);
    const relativePath = path.join('content', 'devlog', folder);
    
    // Verify it exists
    if (!await fs.pathExists(entryPath)) {
      return res.status(404).json({ success: false, error: 'Entry not found' });
    }
    
    // Get title for commit message
    const indexPath = path.join(entryPath, 'index.md');
    let title = folder;
    if (await fs.pathExists(indexPath)) {
      const content = await fs.readFile(indexPath, 'utf-8');
      const titleMatch = content.match(/title\s*=\s*['"](.+?)['"]/);
      if (titleMatch) title = titleMatch[1];
    }
    
    // Delete from git and push
    await deleteFromGit(REPO_PATH, relativePath, title);
    
    res.json({ 
      success: true, 
      message: `Entry "${title}" deleted successfully`
    });
  } catch (error) {
    console.error('Error deleting devlog entry:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start server
app.listen(PORT, async () => {
  console.log('');
  console.log('╔════════════════════════════════════════╗');
  console.log('║       📝 Portfolio Tools v1.0.0        ║');
  console.log('╠════════════════════════════════════════╣');
  console.log(`║  Server: http://localhost:${PORT}          ║`);
  console.log('║  Repo:   ' + REPO_PATH.substring(0, 28).padEnd(28) + '  ║');
  console.log('╚════════════════════════════════════════╝');
  console.log('');
  
  // Open browser automatically
  try {
    await open(`http://localhost:${PORT}`);
  } catch (e) {
    console.log(`Open your browser at: http://localhost:${PORT}`);
  }
});
