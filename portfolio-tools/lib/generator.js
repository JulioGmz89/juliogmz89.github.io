import path from 'path';
import fs from 'fs-extra';
import slugify from 'slugify';
import { format } from 'date-fns';

/**
 * Creates a new devlog entry
 */
export async function createDevlogEntry({ title, body, date, images, repoPath, draft }) {
  // Parse date - use midnight to avoid future date issues
  const entryDate = date ? new Date(date + 'T00:00:00-06:00') : new Date();
  // Format date for Hugo (use format with local timezone)
  const dateStr = format(entryDate, "yyyy-MM-dd'T'00:00:00'-06:00'");
  
  // Create slug and folder name
  const slug = slugify(title, { lower: true, strict: true });
  const folderName = `${format(entryDate, 'yyyy-MM-dd')}-${slug}`;
  const devlogPath = path.join(repoPath, 'content', 'devlog');
  const entryPath = path.join(devlogPath, folderName);
  
  // Ensure folder exists
  await fs.ensureDir(entryPath);
  
  // Copy images and generate markdown for them
  let imageMarkdown = '';
  
  if (images && images.length > 0) {
    imageMarkdown = '\n## Images\n';
    
    for (const img of images) {
      // Use original filename
      const originalName = img.originalname;
      const destPath = path.join(entryPath, originalName);
      
      // Copy image from uploads to entry folder
      await fs.copy(img.path, destPath);
      
      // Generate alt text from filename
      const altText = path.parse(originalName).name.replace(/[-_]/g, ' ');
      imageMarkdown += `\n![${altText}](${originalName})\n`;
    }
  }
  
  // Generate file content
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
  
  // Write index.md file
  const indexPath = path.join(entryPath, 'index.md');
  await fs.writeFile(indexPath, content, 'utf-8');
  
  return entryPath;
}

/**
 * Escapes special characters for TOML
 */
function escapeTomlString(str) {
  return str.replace(/'/g, "\\'").replace(/"/g, '\\"');
}
