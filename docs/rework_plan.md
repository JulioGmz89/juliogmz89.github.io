# Portfolio Rework Plan: Engineering & Game Development

Based on the "Integral Portfolio Architecture Strategy" and the "Master Resume", this document outlines the step-by-step plan to rebuild the portfolio using **Hugo** and the **Blowfish** theme.

## 1. Cleanup Phase
The current repository contains legacy HTML/CSS files that are no longer needed. We will start with a clean slate while preserving documentation.

*   **Action**: Delete legacy files:
    *   `*.html` (index.html, golfclubapp.html, etc.)
    *   `assets/` (old css/js/img)
    *   `forms/`
    *   `changelog.txt`
*   **Preserve**:
    *   `docs/` (Contains strategy and resume)
    *   `.git/` (Version control)
    *   `README.md` (if exists, or create new)

## 2. Technical Setup (Hugo + Blowfish)
We will initialize a new Hugo site in the root directory and configure the Blowfish theme.

*   **Initialize Hugo**: Run `hugo new site . --force` (force needed because directory is not empty).
*   **Install Theme**: Add Blowfish as a git submodule.
    *   `git submodule add https://github.com/nunocoracao/blowfish.git themes/blowfish`
*   **Configuration**:
    *   Create/Update `hugo.toml`.
    *   Configure base settings: Title, Language (English), BaseURL.
    *   Configure Blowfish specifics:
        *   **Homepage**: "Hero" layout with the "Gameplay & Network Engineer" persona.
        *   **Color Scheme**: "Terminal" or "Dracula" (Dark mode preference for engineers).
        *   **Footer**: Social links (LinkedIn, GitHub, Email).

## 3. Content Architecture
Mapping the strategy document's requirements to Hugo's content structure.

### 3.1 Sections (Content Types)
*   `content/projects/`: For the main portfolio pieces.
*   `content/posts/` (or `devlog/`): For technical deep-dives and "STAR" method articles.
*   `content/about/`: Professional biography and "Service-Oriented" pivot narrative.

### 3.2 Key Projects (The "Anchors")
We will create specific content files for the high-priority projects identified in the strategy:
1.  **I Want My Toys** (`projects/i-want-my-toys.md`)
    *   *Focus*: Networking, P2P, Commercial Success.
2.  **Zero Gravity 6-DOF** (`projects/zero-gravity.md`)
    *   *Focus*: Physics, Math, Vector Projection.
3.  **Mayhem Superstars** (`projects/mayhem-superstars.md`)
    *   *Focus*: Netcode for GameObjects, Scalability.
4.  **Tools & Engine Utilities** (`projects/tools-toolkit.md`)
    *   *Focus*: Red Nacho (MVVM), Chatterbox (AI Integration).

## 4. Asset Strategy
*   **Images/Video**: Create `static/images/projects/` structure.
*   **Resume**: Place the PDF version in `static/resume/` and create a dedicated HTML page or menu link.

## 5. CI/CD Pipeline
Implement the GitHub Actions workflow for automated deployment to GitHub Pages.

*   Create `.github/workflows/hugo.yaml`.
*   Configure for Hugo Extended (needed for Blowfish SCSS).

## 6. Execution Steps
1.  **Clean**: Remove old files.
2.  **Init**: Setup Hugo and Theme.
3.  **Config**: Set up `hugo.toml` with user details.
4.  **Skeleton**: Create the content folders and placeholder markdown files.
5.  **Pipeline**: Commit the workflow file to ensure builds pass.
6.  **Populate**: Fill in the markdown files with content from the Strategy/Resume.

---
**Next Step**: Approve this plan to begin the "Cleanup Phase".
