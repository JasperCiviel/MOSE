# MOSE Interactive ODL

A Next.js 14 + TypeScript + Tailwind web studio that walks learners through the open, glass-box design workflow for the MOSE movable barrier system in Venice. It includes interactive stakeholder modeling, design sliders, preference curves, scenario exploration, GA optimization, and a portable export bundle.

## Getting Started

### Downloading the project

Use one of these approaches to grab **all** of the source files (there are more than 40 and they rely on their folder layout):

- **Git (recommended):** `git clone <repo-url>` brings down the complete working tree with history so you can track changes and push back to GitHub.
- **Download ZIP:** on the GitHub page choose **Code ▸ Download ZIP**, then unzip locally. This produces the same directory structure as cloning.

Avoid copying individual files through the browser interface—GitHub will refuse large batches and show errors such as “Binary files are not supported.” Cloning or downloading the archive ensures every asset (images, GeoJSON, config, etc.) arrives exactly where the app expects it.

### Running the site locally (after downloading the ZIP)

1. Ensure you have **Node.js 18 or newer** installed. If you do not already have a package manager, the stock `npm` that ships with Node works perfectly—`pnpm` is optional.
2. Unzip the archive you downloaded from GitHub and open a terminal in the extracted project folder (the one that contains `package.json`).
3. Install dependencies and start the dev server:

   ```bash
   npm install      # installs dependencies declared in package.json
   npm run dev      # launches Next.js on http://localhost:3001
   ```

   > Prefer `pnpm`? Replace the commands above with `pnpm install` and `pnpm dev`.

4. Visit **http://localhost:3001** in your browser to explore the MOSE app. Whenever you edit files the page reloads automatically.

When you are ready to create an optimized build or run the interpolation unit tests, use these scripts (swap `npm run` with `pnpm` if you prefer pnpm):

- `npm run build` — build for production
- `npm run start` — serve the production build
- `npm run test` — run the Vitest suite (PCHIP interpolation)

## Project Structure

- `app/` — Next.js App Router pages for each ODL step
- `components/` — shared UI components, charts, map, and feature panels
- `lib/` — Zustand store, math utilities, interpolation, GA helpers
- `public/data/` — editable configuration and geographic layers
- `public/images/` — default imagery used by the hero and gallery

## Data Model

The site reads `public/data/model-config.json` for constants, bounds, stakeholder weights, knots, and GA options. Use the Import/Export controls within the app to adjust the model and share snapshots with collaborators.

## Accessibility & Styling

The UI uses an airy card-based layout with Tailwind, focus-visible outlines, descriptive alt text, and full keyboard control for sliders and buttons. Charts include on-screen captions and "How is this computed?" accordions that expose formulas and inputs.

## Tests

Vitest validates the monotone PCHIP interpolation utility to guarantee the preference curves match expectations and stay within the knot domain.

## Publishing to GitHub / making a PR

1. Create a new GitHub repository (or fork the original one) and add the project folder as a git remote, e.g. `git remote add origin <your-repo-url>`.
2. Commit your local work: `git add . && git commit -m "feat: initial MOSE app"`.
3. Push to GitHub: `git push -u origin main` (replace `main` with your branch name).
4. On GitHub, open the repository and click **Compare & pull request** to draft a PR.

> If you try to upload the project via the GitHub UI and see “Binary files are not supported,” it means the browser uploader hit a size/type limit. Use git push or the ZIP upload on the repository homepage instead.

### Troubleshooting the “Binary files are not supported” message

That warning appears when GitHub’s in-browser editor or “Create new file” dialog encounters non-text assets (images, GeoJSON, compiled bundles, etc.). Because this project ships many binary files, rely on one of the following workflows instead of pasting file contents into the web editor:

1. **GitHub Desktop (no terminal required)**
   - Install [GitHub Desktop](https://desktop.github.com/) and sign in.
   - Choose **File ▸ Clone Repository ▸ URL** and paste the repo link to download all sources.
   - After making changes locally, click **Commit to main** (or your branch) and then **Push origin**. Desktop handles the binary files automatically.
   - Open the repository in your browser and click **Compare & pull request**.

2. **Upload ZIP via repository homepage**
   - On GitHub, open your repo and press **Add file ▸ Upload files**.
   - Drag the entire project folder from your machine (GitHub converts it into individual files) **or** upload a `.zip` that contains the root folders (`app/`, `components/`, `public/`, etc.).
   - Scroll down, provide a commit message, and click **Commit changes**. GitHub will extract the archive without triggering the binary warning.

3. **Command line git (fastest for repeated updates)**
   - `git clone <repo-url>`
   - `git add . && git commit -m "your message"`
   - `git push origin <branch>`

Any of these approaches ensures binary assets are uploaded safely and keeps you clear of the browser editor’s limitations.

### Working from the Codex workspace

If you are reviewing this project inside the Codex interface, the **PR maken** button you see there does **not** push code to
GitHub. That control only prepares a message for reviewers inside Codex and cannot talk to your GitHub account, which is why it
shows the “Binaire bestanden worden niet ondersteund” warning.

To move the code into your own GitHub repository:

1. **Download the full project from Codex.**
   - **Using the workspace menu:** Click the **⋮** (three dots) icon in the upper-right of the file browser and choose **Download Workspace**. Codex bundles every folder into a single `.zip` file that your browser saves locally.
   - **Using the terminal:** Run `zip -r mose.zip .` (or `git archive --format=zip HEAD -o mose.zip` if git is initialized). The
     archive appears in the workspace tree; click it to trigger the download.
2. **Extract the ZIP locally** and open a terminal in the extracted folder.
3. **Initialize git and connect your repo:** `git init`, `git remote add origin <your-repo-url>`.
4. **Commit and push:** `git add .`, `git commit -m "feat: import MOSE app"`, then `git push -u origin main` (or any branch).
5. Open your repository on GitHub and click **Compare & pull request** to publish the changes.

Following these steps keeps all binary assets intact and gives you full control over the pull-request flow directly on GitHub.
