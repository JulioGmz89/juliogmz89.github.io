# Portfolio Testing Guide

This document outlines how to test the portfolio website locally to ensure content renders correctly and the theme is configured properly.

## Prerequisites

*   **Hugo Extended**: Ensure you have the extended version of Hugo installed (required for SCSS processing).
    *   Check version: `hugo version`
*   **Git**: For submodule management.

## Local Development Server

To run the site locally and see changes in real-time:

1.  Open a terminal in the project root.
2.  Run the following command:
    ```powershell
    hugo server --buildDrafts --disableFastRender
    ```
    *   `--buildDrafts` (-D): Renders content marked as `draft = true`.
    *   `--disableFastRender`: Forces a full rebuild on change (useful if you encounter caching issues).

3.  Open your browser and navigate to: `http://localhost:1313/`

## Verification Checklist

### 1. Homepage
*   [ ] **Hero Section**: Check if the "Gameplay & Network Engineer" title and description appear.
*   [ ] **Social Links**: Verify LinkedIn, GitHub, and Email links in the footer or sidebar.
*   [ ] **Recent Projects**: Ensure the "Anchor" projects are listed (if `showRecent = true` is set).

### 2. Projects
*   [ ] **List View**: Navigate to `/projects/`. Are all 4 anchor projects visible?
*   [ ] **Detail View**: Click on a project (e.g., "I Want My Toys").
    *   Check Title, Date, and Tags.
    *   Verify the "Overview" and "Key Technical Achievements" sections render correctly.

### 3. About Page
*   [ ] Navigate to `/about/`.
*   [ ] Verify the biography and skills section.

### 4. Theme & Styling
*   [ ] **Dark Mode**: Toggle the theme (if a toggle is available) or check if it defaults to the "Terminal" color scheme.
*   [ ] **Responsive Design**: Resize the browser window to mobile width. Does the menu collapse? Is the text readable?

## Troubleshooting

*   **"Page not found"**: Ensure the content file exists in `content/<section>/` and does not have `draft = true` (unless using `-D`).
*   **Styles missing**: Ensure you are using `hugo-extended`. The Blowfish theme relies on SCSS.
*   **Submodule errors**: If the theme is missing, run `git submodule update --init --recursive`.
