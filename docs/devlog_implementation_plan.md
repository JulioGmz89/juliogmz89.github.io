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

## 3. Herramienta CLI Externa

### 3.1 Tecnología Seleccionada

**Node.js CLI** con las siguientes librerías:

| Librería | Propósito |
|----------|-----------|
| `commander` | Framework CLI para comandos y opciones |
| `inquirer` | Prompts interactivos |
| `simple-git` | Operaciones Git |
| `slugify` | Generación de slugs URL-friendly |
| `fs-extra` | Operaciones de archivos mejoradas |
| `chalk` | Colores en terminal |
| `date-fns` | Manejo de fechas |

**Ventajas de Node.js:**
- NPM ecosystem robusto
- Multiplataforma (Windows, Mac, Linux)
- Fácil distribución via `npm install -g`
- Mismo lenguaje que muchos proyectos web

### 3.2 Funcionalidades de la Herramienta

```bash
# Crear nueva entrada
devlog new --title "Mi Entrada" --body "Hoy trabajé en..." --date "2025-12-20"

# Crear con imágenes
devlog new --title "Progreso" --body "content.md" --images ./screenshot1.png ./demo.gif

# Modo interactivo
devlog new --interactive
```

### 3.3 Flujo de la Herramienta

```
1. Usuario ejecuta: npx devlog-tool new
2. Herramienta pregunta (modo interactivo):
   - Título
   - Cuerpo (texto directo o archivo .md)
   - Fecha (default: hoy)
   - Imágenes/GIFs a adjuntar
3. Herramienta:
   a. Crea carpeta: content/devlog/YYYY-MM-DD-{slug}/
   b. Genera index.md con front matter
   c. Copia imágenes a la carpeta
   d. Ejecuta git add, commit, push
4. GitHub Actions despliega automáticamente
```

### 3.4 Estructura del Proyecto CLI

```
devlog-tool/
├── src/
│   ├── index.js         # Entry point CLI
│   ├── commands/
│   │   └── new.js       # Comando "new"
│   ├── lib/
│   │   ├── generator.js # Generación de archivos MD
│   │   ├── git.js       # Operaciones Git
│   │   └── prompts.js   # Prompts interactivos
│   └── utils/
│       └── helpers.js   # Utilidades
├── package.json
├── .gitignore
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

### Fase 2: Herramienta CLI Node.js (2-3 horas)

1. Crear proyecto Node.js con `npm init`
2. Instalar dependencias (`commander`, `inquirer`, `simple-git`, etc.)
3. Implementar estructura de comandos
4. Implementar generación de archivos Markdown
5. Implementar copia de imágenes
6. Implementar operaciones Git (add, commit, push)
7. Crear modo interactivo con `inquirer`
8. Testing local

### Fase 3: Documentación y Refinamiento (30 min)

1. Crear README para la herramienta
2. Documentar instalación y uso
3. Agregar alias/scripts de conveniencia

---

## 6. Código de la Herramienta CLI (Node.js)

### 6.1 package.json

```json
{
  "name": "devlog-tool",
  "version": "1.0.0",
  "description": "CLI tool para gestionar entradas del devlog",
  "type": "module",
  "bin": {
    "devlog": "./src/index.js"
  },
  "scripts": {
    "start": "node src/index.js"
  },
  "dependencies": {
    "chalk": "^5.3.0",
    "commander": "^12.0.0",
    "date-fns": "^3.0.0",
    "fs-extra": "^11.2.0",
    "inquirer": "^9.2.0",
    "simple-git": "^3.22.0",
    "slugify": "^1.6.6"
  }
}
```

### 6.2 src/index.js (Entry Point)

```javascript
#!/usr/bin/env node
import { Command } from 'commander';
import { newEntry } from './commands/new.js';

const program = new Command();

program
  .name('devlog')
  .description('Herramienta para gestionar entradas del devlog')
  .version('1.0.0');

program
  .command('new')
  .description('Crea una nueva entrada de devlog')
  .option('-t, --title <title>', 'Título de la entrada')
  .option('-b, --body <body>', 'Cuerpo del post o ruta a archivo .md')
  .option('-d, --date <date>', 'Fecha (YYYY-MM-DD), default: hoy')
  .option('-i, --images <images...>', 'Imágenes a adjuntar')
  .option('--draft', 'Guardar como borrador (no publicar)')
  .option('--no-push', 'No hacer push automático')
  .action(newEntry);

program.parse();
```

### 6.3 src/commands/new.js

```javascript
import inquirer from 'inquirer';
import chalk from 'chalk';
import { format } from 'date-fns';
import slugify from 'slugify';
import path from 'path';
import fs from 'fs-extra';
import { simpleGit } from 'simple-git';

const REPO_PATH = 'c:/Users/julio/Documents/GitHub/juliogmz89.github.io';
const DEVLOG_PATH = path.join(REPO_PATH, 'content', 'devlog');

export async function newEntry(options) {
  try {
    // Modo interactivo si faltan opciones
    const answers = await promptMissingOptions(options);
    
    // Crear entrada
    const entryPath = await createEntry(answers);
    console.log(chalk.green(`✅ Entrada creada: ${entryPath}`));
    
    // Git operations
    if (!answers.draft && answers.push !== false) {
      await publishEntry(entryPath, answers.title);
      console.log(chalk.blue('🚀 Publicado y desplegado!'));
    } else if (answers.draft) {
      console.log(chalk.yellow('📝 Guardado como borrador (no publicado)'));
    }
  } catch (error) {
    console.error(chalk.red('Error:', error.message));
    process.exit(1);
  }
}

async function promptMissingOptions(options) {
  const questions = [];
  
  if (!options.title) {
    questions.push({
      type: 'input',
      name: 'title',
      message: 'Título de la entrada:',
      validate: (input) => input.length > 0 || 'El título es requerido'
    });
  }
  
  if (!options.body) {
    questions.push({
      type: 'editor',
      name: 'body',
      message: 'Contenido de la entrada (se abrirá editor):',
    });
  }
  
  if (!options.date) {
    questions.push({
      type: 'input',
      name: 'date',
      message: 'Fecha (YYYY-MM-DD):',
      default: format(new Date(), 'yyyy-MM-dd')
    });
  }
  
  if (!options.images) {
    questions.push({
      type: 'input',
      name: 'imagesInput',
      message: 'Rutas de imágenes (separadas por coma, o vacío):',
    });
  }
  
  const answers = await inquirer.prompt(questions);
  
  // Procesar imágenes del input
  if (answers.imagesInput) {
    answers.images = answers.imagesInput
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);
  }
  
  return { ...options, ...answers };
}

async function createEntry(options) {
  const { title, body, date, images = [], draft } = options;
  
  // Parsear fecha
  const entryDate = date ? new Date(date) : new Date();
  
  // Crear slug y carpeta
  const slug = slugify(title, { lower: true, strict: true });
  const folderName = `${format(entryDate, 'yyyy-MM-dd')}-${slug}`;
  const entryPath = path.join(DEVLOG_PATH, folderName);
  
  await fs.ensureDir(entryPath);
  
  // Procesar cuerpo
  let bodyContent = body;
  if (body && await fs.pathExists(body) && body.endsWith('.md')) {
    bodyContent = await fs.readFile(body, 'utf-8');
  }
  
  // Procesar imágenes
  let imageMarkdown = '';
  for (const imgPath of images) {
    if (await fs.pathExists(imgPath)) {
      const imgName = path.basename(imgPath);
      const dest = path.join(entryPath, imgName);
      await fs.copy(imgPath, dest);
      const imgStem = path.parse(imgName).name;
      imageMarkdown += `\n![${imgStem}](${imgName})\n`;
    }
  }
  
  // Generar contenido
  const frontMatter = `+++
date = '${entryDate.toISOString()}'
title = '${title}'
draft = ${draft ? 'true' : 'false'}
showTableOfContents = false
showReadingTime = true
showAuthor = false
+++

${bodyContent}
${imageMarkdown}`;
  
  // Escribir archivo
  const indexFile = path.join(entryPath, 'index.md');
  await fs.writeFile(indexFile, frontMatter, 'utf-8');
  
  return entryPath;
}

async function publishEntry(entryPath, title) {
  const git = simpleGit(REPO_PATH);
  
  // Obtener ruta relativa
  const relativePath = path.relative(REPO_PATH, entryPath);
  
  await git.add(relativePath);
  await git.commit(`devlog: ${title}`);
  await git.push('origin', 'master');
}
```

### 6.4 Instalación y Uso

```bash
# Desde la carpeta devlog-tool
npm install

# Instalar globalmente (opcional)
npm link

# Uso
devlog new                           # Modo interactivo
devlog new -t "Mi Título" -b "Contenido aquí"
devlog new -t "Con imágenes" -b "Texto" -i ./foto1.png ./demo.gif
devlog new --draft                   # Solo guardar, no publicar
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

- [ ] Crear `content/devlog/_index.md`
- [ ] Crear `content/devlog/_index.es.md`
- [ ] Actualizar `hugo.toml` con menú devlog
- [ ] Crear entrada de ejemplo
- [ ] Probar build local con `hugo server`
- [ ] Crear proyecto Node.js para CLI (`npm init`)
- [ ] Instalar dependencias (`npm install`)
- [ ] Implementar comando `new`
- [ ] Testing de publicación
- [ ] Documentar uso en README

---

*Plan creado: 2025-12-20*
*Autor: GitHub Copilot*
