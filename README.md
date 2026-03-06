# SocialMind AI 🚀

An intelligent social media agent that links your platforms and automates content creation, scheduling, and engagement.

## Features
- **AI Content Agent**: Generate platform-optimized posts using Gemini 3.1 Pro.
- **Daily Automation**: Set a theme and schedule multiple posts across platforms with one click.
- **Multi-Platform Support**: Connect X (Twitter), LinkedIn, Facebook, Instagram, Reddit, and Threads.
- **Smart Scheduling**: AI-suggested posting times for maximum engagement.

## Deployment Guide (Recommended: Vercel)

Vercel is the best way to host this app because it supports the **Full-Stack** features (like social media connections) that GitHub Pages cannot handle.

### 1. Get your Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Create and copy your free API key.

### 2. Upload to GitHub
1. Create a new repository on [GitHub](https://github.com/new).
2. Upload all files from your project folder **EXCEPT** `node_modules` and `dist`.
   - **Important**: Make sure the `src`, `api`, and `.github` folders are included.

### 3. Deploy to Vercel (Free)
1. Sign in to [Vercel](https://vercel.com) with your GitHub account.
2. Click **"Add New"** > **"Project"**.
3. Import your `socialmind-ai` repository.
4. **Environment Variables**:
   - Before clicking "Deploy", add:
     - **Key**: `GEMINI_API_KEY`
     - **Value**: (Your API key from Step 1)
5. Click **Deploy**.

### 4. Why Vercel?
- **Active Backend**: Vercel runs the `server.ts` file, allowing real social media connection logic.
- **Automatic SSL**: Your site will be secure (`https://`) automatically.
- **Fast**: Vercel is optimized for React and Vite apps.

## Alternative: GitHub Pages

### 1. Get your Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Create and copy your free API key.

### 2. Upload to GitHub (No Git installed?)
If you don't have Git installed on your computer, you can use the GitHub website directly:
1. Create a new repository on [GitHub](https://github.com/new).
2. On the setup page, click the link that says **"uploading an existing file"**.
3. **CRITICAL**: You must maintain the folder structure. 
   - Upload `index.html`, `package.json`, `vite.config.ts`, `server.ts`, and `tsconfig.json` to the **root** folder.
   - Create a folder named **`src`** on GitHub and upload all files from your local `src` folder into it.
   - **DO NOT** upload `node_modules` or `dist`.
4. Click **"Commit changes"**.

### 3. Deploy to GitHub Pages (The "GitHub Website" way)
I have added a special "Action" to your code that will build and publish your site automatically.
1. Go to your repository on GitHub.
2. Click **Settings** (top tab).
3. On the left sidebar, click **Pages**.
4. Under **Build and deployment** > **Source**, change it to **"GitHub Actions"**.
5. **Add your API Key**:
   - Click **Settings** > **Secrets and variables** > **Actions**.
   - Click **New repository secret**.
   - Name: `GEMINI_API_KEY`
   - Value: (Your API key from Google)
6. **Trigger the build**:
   - Go to the **Actions** tab at the top.
   - You should see a "Deploy to GitHub Pages" workflow running. If not, make a small change to any file and commit it.
7. Once it finishes (turns green), your site will be live at `https://YOUR_USERNAME.github.io/socialmind-ai/`!

### 4. Deploy to Vercel (Alternative)

## Local Development
1. Clone the repo.
2. Run `npm install`.
3. Create a `.env` file with your `GEMINI_API_KEY`.
4. Run `npm run dev`.
