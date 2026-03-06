# SocialMind AI 🚀

An intelligent social media agent that links your platforms and automates content creation, scheduling, and engagement.

## Features
- **AI Content Agent**: Generate platform-optimized posts using Gemini 3.1 Pro.
- **Daily Automation**: Set a theme and schedule multiple posts across platforms with one click.
- **Multi-Platform Support**: Connect X (Twitter), LinkedIn, Facebook, Instagram, Reddit, and Threads.
- **Smart Scheduling**: AI-suggested posting times for maximum engagement.

## Deployment Guide (Free)

### 1. Get your Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Create and copy your free API key.

### 2. Upload to GitHub (No Git installed?)
If you don't have Git installed on your computer, you can use the GitHub website directly:
1. Create a new repository on [GitHub](https://github.com/new).
2. On the setup page, click the link that says **"uploading an existing file"**.
3. Drag and drop all the files from your project folder **EXCEPT** `node_modules` and `dist`.
4. Click **"Commit changes"**.

### 3. Deploy to Vercel
1. Sign in to [Vercel](https://vercel.com) with your GitHub account.
2. Import your `socialmind-ai` repository.
3. In the **Environment Variables** section, add:
   - **Key**: `GEMINI_API_KEY`
   - **Value**: (Your API key from Step 1)
4. Click **Deploy**.

## Local Development
1. Clone the repo.
2. Run `npm install`.
3. Create a `.env` file with your `GEMINI_API_KEY`.
4. Run `npm run dev`.
