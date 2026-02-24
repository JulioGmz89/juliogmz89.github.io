# Plan de Implementación: Sistema de Devlog con Herramienta Externa

## Resumen Ejecutivo

Este documento describe la implementación de un sistema de devlog integrado en el portafolio Hugo, con una herramienta CLI externa para crear entradas de forma sencilla que automáticamente hace push al repositorio.

---

## 1. Arquitectura Propuesta

### 1.1 Estrategia de Ramas Git

**Problema Actual:** Solo usas `master` para todo, lo cual no es ideal para:
- Separar desarrollo de producción
- Evitar publicaciones accidentales
- Permitir revisión antes de publicar

**Solución Recomendada: Git Flow Simplificado**

```
master (producción) ← Solo contenido revisado y listo para publicar
    ↑
develop (desarrollo) ← Desarrollo de features del sitio
    ↑
feature/* ← Branches para cambios del sitio
    
content/devlog ← Branch para nuevas entradas de devlog (creado automáticamente por la herramienta)
```

**Flujo para Devlog:**
1. La herramienta CLI crea la entrada en `master` directamente (publicación inmediata)
2. O alternativamente: crea un PR para revisión antes de publicar

**Recomendación:** Para devlog personal, **push directo a master** es aceptable porque:
- El contenido es personal y no requiere revisión de terceros
- Acelera la publicación
- Simplifica el flujo de trabajo

---

## 2. Estructura de Contenido Hugo

### 2.1 Carpeta de Devlog

```
content/
└── devlog/
    ├── _index.md          # Página listado del devlog
    ├── _index.es.md       # Versión español
    └── 2025-12-20-mi-primera-entrada/
        ├── index.md       # Contenido en inglés
        ├── index.es.md    # Contenido en español (opcional)
        ├── image1.png     # Imágenes adjuntas
        └── demo.gif       # GIFs adjuntos
```

### 2.2 Front Matter de Entradas

```yaml
+++
date = '2025-12-20T14:30:00-06:00'
title = 'Mi Primera Entrada de Devlog'
draft = false
summary = 'Una breve descripción de lo que hice hoy'
tags = ['Unity', 'C#', 'Progress']
showTableOfContents = false
showReadingTime = false
showAuthor = false
+++
```

### 2.3 Actualizar hugo.toml

Añadir al menú:
```toml
[[languages.en.menu.main]]
  identifier = "devlog"
  name = "Devlog"
  url = "/devlog/"
  weight = 25

[[languages.es.menu.main]]
  identifier = "devlog"
  name = "Devlog"
  url = "/es/devlog/"
  weight = 25
```

---

## 3. Herramienta Gráfica: portfolio-tools

### 3.1 Tecnología Seleccionada

**Web App Local** con Express + HTML/CSS/JS

| Librería | Propósito |
|----------|-----------|
| `express` | Servidor web local |
| `multer` | Manejo de uploads de imágenes |
| `simple-git` | Operaciones Git |
| `slugify` | Generación de slugs URL-friendly |
| `fs-extra` | Operaciones de archivos mejoradas |
| `open` | Abrir navegador automáticamente |
| `date-fns` | Manejo de fechas |

**Ventajas:**
- Interfaz gráfica amigable en el navegador
- Drag & drop para imágenes/GIFs
- Preview en tiempo real del contenido
- Tema visual consistente con el portafolio (noir/dark)
- Ligero y rápido de desarrollar

### 3.2 Funcionalidades de la Herramienta

**Interfaz gráfica con:**
- Campo de título
- Editor de contenido Markdown con preview
- Selector de fecha (default: hoy)
- Zona de drag & drop para imágenes/GIFs
- Vista previa de imágenes adjuntas
- Botón "Guardar Borrador" (sin push)
- Botón "Publicar" (con git push automático)
- Indicador de estado de publicación

**Tema visual:**
- Modo oscuro (noir) consistente con el portafolio
- Colores: fondo oscuro, acentos en tonos neutros
- Tipografía limpia y moderna

### 3.3 Flujo de la Herramienta

```
1. Usuario ejecuta: npm start (en carpeta portfolio-tools)
2. Se abre automáticamente http://localhost:3000 en el navegador
3. Usuario llena el formulario:
   - Título de la entrada
   - Contenido en Markdown (con preview en vivo)
   - Fecha (default: hoy)
   - Arrastra imágenes/GIFs a la zona de drop
4. Usuario hace click en "Publicar":
   a. Backend crea carpeta: content/devlog/YYYY-MM-DD-{slug}/
   b. Genera index.md con front matter
   c. Copia imágenes a la carpeta
   d. Ejecuta git add, commit, push
   e. Muestra notificación de éxito
5. GitHub Actions despliega automáticamente
```

### 3.4 Estructura del Proyecto

```
portfolio-tools/
├── server.js              # Express server + API endpoints
├── public/
│   ├── index.html         # Interfaz principal
│   ├── css/
│   │   └── style.css      # Estilos (tema noir/dark)
│   └── js/
│       └── app.js         # Lógica frontend
├── lib/
│   ├── generator.js       # Generación de archivos MD
│   └── git.js             # Operaciones Git
├── uploads/               # Carpeta temporal para imágenes
├── package.json
└── README.md
```

---

## 4. Diseño del Frontend (Hugo)

### 4.1 Página de Listado Devlog

La página `/devlog/` mostrará:
- Lista de entradas ordenadas por fecha (más reciente primero)
- Cada entrada muestra:
  - Fecha
  - Título
  - Extracto del cuerpo
  - Miniaturas de imágenes (si las hay)

### 4.2 Layout Personalizado (Opcional)

Si Blowfish no satisface el diseño, crear:

```
layouts/
└── devlog/
    ├── list.html    # Lista de entradas
    └── single.html  # Entrada individual
```

### 4.3 Ejemplo de Página de Entrada

```markdown
+++
date = '2025-12-20T14:30:00-06:00'
title = 'Implementando Sistema de Climbing'
draft = false
+++

Hoy avancé significativamente en el sistema de climbing para Zero Gravity.

## Lo que hice

- Implementé detección de bordes mediante raycasts múltiples
- Añadí transiciones suaves entre superficies
- Corregí bug de jitter en mallas complejas

## Capturas

![Climbing en acción](climbing-progress.gif)

![Debug gizmos](debug-view.png)

## Siguiente paso

Mañana trabajaré en la detección de superficies curvas.
```

---

## 5. Pasos de Implementación

### Fase 1: Configuración Hugo (30 min)

1. ✅ Crear estructura `content/devlog/`
2. ✅ Crear `_index.md` y `_index.es.md`
3. ✅ Actualizar `hugo.toml` con menú de devlog
4. ✅ Crear entrada de ejemplo para testing

### Fase 2: Herramienta Gráfica portfolio-tools (2-3 horas)

1. Crear proyecto Node.js con `npm init`
2. Instalar dependencias (`express`, `multer`, `simple-git`, etc.)
3. Implementar servidor Express con API endpoints
4. Crear interfaz HTML con tema noir/dark
5. Implementar drag & drop para imágenes
6. Implementar lógica de generación de archivos Markdown
7. Implementar operaciones Git (add, commit, push)
8. Testing local

### Fase 3: Documentación y Refinamiento (30 min)

1. Crear README para la herramienta
2. Documentar instalación y uso
3. Agregar alias/scripts de conveniencia

---

## 6. Código de la Herramienta (portfolio-tools)

### 6.1 package.json

```json
{
  "name": "portfolio-tools",
  "version": "1.0.0",
  "description": "Herramienta gráfica para gestionar el portafolio y devlog",
  "type": "module",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "node --watch server.js"
  },
  "dependencies": {
    "date-fns": "^3.0.0",
    "express": "^4.18.0",
    "fs-extra": "^11.2.0",
    "multer": "^1.4.5-lts.1",
    "open": "^10.0.0",
    "simple-git": "^3.22.0",
    "slugify": "^1.6.6"
  }
}
```

### 6.2 server.js

```javascript
import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import open from 'open';
import { createDevlogEntry } from './lib/generator.js';
import { publishToGit } from './lib/git.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3000;

// Configuración
const REPO_PATH = 'c:/Users/julio/Documents/GitHub/juliogmz89.github.io';

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Configurar multer para uploads
const storage = multer.diskStorage({
  destination: path.join(__dirname, 'uploads'),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// API: Crear entrada de devlog
app.post('/api/devlog', upload.array('images'), async (req, res) => {
  try {
    const { title, body, date, publish } = req.body;
    const images = req.files || [];
    
    const entryPath = await createDevlogEntry({
      title,
      body,
      date,
      images,
      repoPath: REPO_PATH,
      draft: publish !== 'true'
    });
    
    if (publish === 'true') {
      await publishToGit(REPO_PATH, entryPath, title);
    }
    
    res.json({ 
      success: true, 
      message: publish === 'true' ? '¡Publicado!' : 'Guardado como borrador',
      path: entryPath 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Portfolio Tools corriendo en http://localhost:${PORT}`);
  open(`http://localhost:${PORT}`);
});
```

### 6.3 lib/generator.js

```javascript
import path from 'path';
import fs from 'fs-extra';
import slugify from 'slugify';
import { format } from 'date-fns';

export async function createDevlogEntry({ title, body, date, images, repoPath, draft }) {
  const entryDate = date ? new Date(date) : new Date();
  const slug = slugify(title, { lower: true, strict: true });
  const folderName = `${format(entryDate, 'yyyy-MM-dd')}-${slug}`;
  const devlogPath = path.join(repoPath, 'content', 'devlog');
  const entryPath = path.join(devlogPath, folderName);
  
  await fs.ensureDir(entryPath);
  
  // Copiar imágenes y generar markdown
  let imageMarkdown = '';
  for (const img of images) {
    const destName = img.originalname;
    const dest = path.join(entryPath, destName);
    await fs.move(img.path, dest, { overwrite: true });
    const imgStem = path.parse(destName).name;
    imageMarkdown += `\n![${imgStem}](${destName})\n`;
  }
  
  // Generar front matter
  const content = `+++
date = '${entryDate.toISOString()}'
title = '${title}'
draft = ${draft}
showTableOfContents = false
showReadingTime = true
showAuthor = false
+++

${body}
${imageMarkdown}`;
  
  await fs.writeFile(path.join(entryPath, 'index.md'), content, 'utf-8');
  
  return entryPath;
}
```

### 6.4 lib/git.js

```javascript
import { simpleGit } from 'simple-git';
import path from 'path';

export async function publishToGit(repoPath, entryPath, title) {
  const git = simpleGit(repoPath);
  const relativePath = path.relative(repoPath, entryPath);
  
  await git.add(relativePath);
  await git.commit(`devlog: ${title}`);
  await git.push('origin', 'develop'); // Cambiar a 'master' para producción
}
```

### 6.5 public/index.html (Estructura básica)

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Portfolio Tools - Devlog</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <div class="container">
    <header>
      <h1>📝 Portfolio Tools</h1>
      <p>Gestor de Devlog</p>
    </header>
    
    <main>
      <form id="devlog-form">
        <div class="form-group">
          <label for="title">Título</label>
          <input type="text" id="title" name="title" required>
        </div>
        
        <div class="form-group">
          <label for="date">Fecha</label>
          <input type="date" id="date" name="date">
        </div>
        
        <div class="form-group">
          <label for="body">Contenido (Markdown)</label>
          <textarea id="body" name="body" rows="10" required></textarea>
        </div>
        
        <div class="form-group">
          <label>Imágenes / GIFs</label>
          <div id="drop-zone" class="drop-zone">
            <p>Arrastra imágenes aquí o haz click para seleccionar</p>
            <input type="file" id="images" name="images" multiple accept="image/*,.gif">
          </div>
          <div id="preview" class="image-preview"></div>
        </div>
        
        <div class="actions">
          <button type="button" id="btn-draft" class="btn secondary">Guardar Borrador</button>
          <button type="submit" id="btn-publish" class="btn primary">Publicar</button>
        </div>
      </form>
    </main>
    
    <div id="notification" class="notification hidden"></div>
  </div>
  
  <script src="js/app.js"></script>
</body>
</html>
```

### 6.6 Instalación y Uso

```bash
# Desde la carpeta portfolio-tools
npm install

# Iniciar la herramienta
npm start

# Se abrirá automáticamente en http://localhost:3000
```

---

## 7. Workflow de GitHub Actions (Sin Cambios)

El workflow actual ya soporta el devlog:
- Push a `master` → Build y Deploy automático
- No se requieren cambios adicionales

---

## 8. Consideraciones de Seguridad

### 8.1 Autenticación Git

La herramienta necesita autenticación para hacer push. Opciones:

1. **SSH Key** (Recomendado): Configurar clave SSH para GitHub
2. **GitHub CLI** (`gh`): Usar `gh auth login`
3. **Personal Access Token**: Configurar en credential manager

### 8.2 Configuración Recomendada

```bash
# Verificar configuración SSH
ssh -T git@github.com

# O configurar credential helper
git config --global credential.helper manager
```

---

## 9. Alternativas Consideradas

### 9.1 CMS Headless (Decap CMS, Forestry)

**Pros:** Interfaz web, no requiere CLI
**Contras:** Más complejo de configurar, dependencia externa

### 9.2 GitHub Web Editor

**Pros:** Sin herramienta adicional
**Contras:** No maneja imágenes fácilmente, experiencia pobre

### 9.3 Obsidian + Git Sync

**Pros:** Excelente editor Markdown
**Contras:** Configuración adicional, posibles conflictos

---

## 10. Próximos Pasos

1. **Aprobar este plan** ✅
2. **Implementar estructura Hugo** (Fase 1)
3. **Desarrollar herramienta CLI** (Fase 2)
4. **Testing end-to-end**
5. **Documentar y refinar**

---

## Checklist de Implementación

- [x] Crear `content/devlog/_index.md`
- [x] Crear `content/devlog/_index.es.md`
- [x] Actualizar `hugo.toml` con menú devlog
- [x] Crear entrada de ejemplo
- [x] Probar build local con `hugo server`
- [ ] Crear proyecto Node.js portfolio-tools (`npm init`)
- [ ] Instalar dependencias (`npm install`)
- [ ] Implementar servidor Express con API
- [ ] Crear interfaz HTML con tema noir/dark
- [ ] Implementar drag & drop para imágenes
- [ ] Testing de publicación
- [ ] Documentar uso en README en README

---

*Plan creado: 2025-12-20*
*Autor: GitHub Copilot*
