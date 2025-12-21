import { simpleGit } from 'simple-git';
import path from 'path';

/**
 * Obtiene el estado actual del repositorio Git
 */
export async function getGitStatus(repoPath) {
  const git = simpleGit(repoPath);
  
  const status = await git.status();
  const branch = await git.revparse(['--abbrev-ref', 'HEAD']);
  
  return {
    branch: branch.trim(),
    isClean: status.isClean(),
    modified: status.modified.length,
    staged: status.staged.length,
    untracked: status.not_added.length
  };
}

/**
 * Publica la entrada al repositorio Git
 */
export async function publishToGit(repoPath, entryPath, title) {
  const git = simpleGit(repoPath);
  
  // Obtener rama actual
  const branch = await git.revparse(['--abbrev-ref', 'HEAD']);
  
  // Obtener ruta relativa para el commit
  const relativePath = path.relative(repoPath, entryPath);
  
  // Agregar archivos
  await git.add(relativePath);
  
  // Commit con mensaje descriptivo
  const commitMessage = `devlog: ${title}`;
  await git.commit(commitMessage);
  
  // Push a la rama actual
  await git.push('origin', branch.trim());
  
  return {
    branch: branch.trim(),
    message: commitMessage
  };
}

/**
 * Elimina una entrada del repositorio y hace push
 */
export async function deleteFromGit(repoPath, relativePath, title) {
  const git = simpleGit(repoPath);
  
  // Obtener rama actual
  const branch = await git.revparse(['--abbrev-ref', 'HEAD']);
  
  // Eliminar archivos del índice de git
  await git.rm(['-r', relativePath]);
  
  // Commit con mensaje descriptivo
  const commitMessage = `devlog: eliminar "${title}"`;
  await git.commit(commitMessage);
  
  // Push a la rama actual
  await git.push('origin', branch.trim());
  
  return {
    branch: branch.trim(),
    message: commitMessage
  };
}
