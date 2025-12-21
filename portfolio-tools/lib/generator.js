import path from 'path';
import fs from 'fs-extra';
import slugify from 'slugify';
import { format } from 'date-fns';

/**
 * Crea una nueva entrada de devlog
 */
export async function createDevlogEntry({ title, body, date, images, repoPath, draft }) {
  // Parsear fecha - usar medianoche para evitar problemas de fecha futura
  const entryDate = date ? new Date(date + 'T00:00:00-06:00') : new Date();
  // Formatear fecha para Hugo (usar formato con timezone local)
  const dateStr = format(entryDate, "yyyy-MM-dd'T'00:00:00'-06:00'");
  
  // Crear slug y nombre de carpeta
  const slug = slugify(title, { lower: true, strict: true });
  const folderName = `${format(entryDate, 'yyyy-MM-dd')}-${slug}`;
  const devlogPath = path.join(repoPath, 'content', 'devlog');
  const entryPath = path.join(devlogPath, folderName);
  
  // Asegurar que existe la carpeta
  await fs.ensureDir(entryPath);
  
  // Copiar imágenes y generar markdown para ellas
  let imageMarkdown = '';
  
  if (images && images.length > 0) {
    imageMarkdown = '\n## Imágenes\n';
    
    for (const img of images) {
      // Usar el nombre original del archivo
      const originalName = img.originalname;
      const destPath = path.join(entryPath, originalName);
      
      // Copiar imagen desde uploads a la carpeta de la entrada
      await fs.copy(img.path, destPath);
      
      // Generar alt text del nombre del archivo
      const altText = path.parse(originalName).name.replace(/[-_]/g, ' ');
      imageMarkdown += `\n![${altText}](${originalName})\n`;
    }
  }
  
  // Generar contenido del archivo
  const content = `+++
date = '${dateStr}'
title = '${escapeTomlString(title)}'
draft = ${draft}
showTableOfContents = false
showReadingTime = true
showAuthor = false
+++

${body}
${imageMarkdown}`;
  
  // Escribir archivo index.md
  const indexPath = path.join(entryPath, 'index.md');
  await fs.writeFile(indexPath, content, 'utf-8');
  
  return entryPath;
}

/**
 * Escapa caracteres especiales para TOML
 */
function escapeTomlString(str) {
  return str.replace(/'/g, "\\'").replace(/"/g, '\\"');
}
