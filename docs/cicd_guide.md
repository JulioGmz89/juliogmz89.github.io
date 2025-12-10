# CI/CD Pipeline Guide

This document explains the Continuous Integration and Continuous Deployment (CI/CD) pipeline set up for this portfolio using GitHub Actions.

## Overview

The pipeline is defined in `.github/workflows/hugo.yaml`. It automates the process of building the Hugo site and deploying it to GitHub Pages whenever changes are pushed to the repository.

## Workflow Steps

1.  **Trigger**: The workflow starts automatically on every `push` to the `main` or `master` branch. It can also be triggered manually from the "Actions" tab in GitHub.
2.  **Build Job**:
    *   **Install Hugo**: Downloads and installs the "Extended" version of Hugo (required for the Blowfish theme).
    *   **Checkout**: Retrieves the latest code, including submodules (the theme).
    *   **Build**: Runs `hugo --minify` to generate the static site in the `public/` directory.
3.  **Deploy Job**:
    *   **Upload**: Uploads the `public/` directory as an artifact.
    *   **Deploy**: Deploys the artifact to GitHub Pages.

## How to Use

### 1. Enable GitHub Pages
You must configure the repository to serve the site from GitHub Actions:
1.  Go to your repository on GitHub.
2.  Navigate to **Settings** > **Pages**.
3.  Under **Build and deployment** > **Source**, select **GitHub Actions**.

### 2. Deploying Changes
Simply push your changes to the `main` branch:
```bash
git add .
git commit -m "Update portfolio content"
git push origin main
```
The Action will pick up the changes, build the site, and deploy it. You can monitor the progress in the **Actions** tab of your repository.

## Troubleshooting

*   **Action Failed**: Click on the failed run in the Actions tab to see the logs. Common errors include:
    *   Markdown syntax errors.
    *   Missing files (e.g., images referenced but not committed).
    *   Submodule issues (ensure `.gitmodules` is correct).
*   **Site not updating**: Ensure the "Deploy" job completed successfully. Browser caching might also delay updates; try a hard refresh (Ctrl+F5).
