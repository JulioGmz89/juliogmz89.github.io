import { simpleGit } from 'simple-git';
import path from 'path';

/**
 * Gets the current Git repository status
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
 * Publishes the entry to the Git repository
 */
export async function publishToGit(repoPath, entryPath, title) {
  const git = simpleGit(repoPath);
  
  // Get current branch
  const branch = await git.revparse(['--abbrev-ref', 'HEAD']);
  
  // Get relative path for commit
  const relativePath = path.relative(repoPath, entryPath);
  
  // Add files
  await git.add(relativePath);
  
  // Commit with descriptive message
  const commitMessage = `devlog: ${title}`;
  await git.commit(commitMessage);
  
  // Push to current branch
  await git.push('origin', branch.trim());
  
  return {
    branch: branch.trim(),
    message: commitMessage
  };
}

/**
 * Deletes an entry from the repository and pushes
 */
export async function deleteFromGit(repoPath, relativePath, title) {
  const git = simpleGit(repoPath);
  
  // Get current branch
  const branch = await git.revparse(['--abbrev-ref', 'HEAD']);
  
  // Remove files from git index
  await git.rm(['-r', relativePath]);
  
  // Commit with descriptive message
  const commitMessage = `devlog: delete "${title}"`;
  await git.commit(commitMessage);
  
  // Push to current branch
  await git.push('origin', branch.trim());
  
  return {
    branch: branch.trim(),
    message: commitMessage
  };
}
