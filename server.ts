import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Mock OAuth URL generation
  app.get("/api/auth/url/:platform", (req, res) => {
    const { platform } = req.params;
    const protocol = req.headers["x-forwarded-proto"] || "http";
    const host = req.headers.host;
    const origin = `${protocol}://${host}`;
    const redirectUri = `${origin}/auth/callback/${platform}`;
    
    console.log(`[Auth] Generating URL for ${platform}. Origin: ${origin}`);

    // For the sake of the demo, return an absolute URL to avoid any iframe/base-url issues
    const absoluteAuthUrl = `${origin}/auth/callback/${platform}?code=mock_code`;
    res.json({ url: absoluteAuthUrl });
  });

  // OAuth Callback Handler
  app.get("/auth/callback/:platform", (req, res) => {
    const { platform } = req.params;
    const { code } = req.query;
    console.log(`[Auth] Callback received for ${platform} with code: ${code}`);

    // Here you would exchange the code for tokens
    // const tokens = await exchangeCodeForTokens(platform, code);

    res.send(`
      <html>
        <body>
          <script>
            if (window.opener) {
              window.opener.postMessage({ 
                type: 'OAUTH_AUTH_SUCCESS', 
                platform: '${platform}',
                data: { profileName: 'Demo User', profileImage: 'https://picsum.photos/seed/user/100/100' }
              }, '*');
              window.close();
            } else {
              window.location.href = '/';
            }
          </script>
          <p>Authentication successful for ${platform}. This window should close automatically.</p>
        </body>
      </html>
    `);
  });

  // Vite middleware for development
  const isProd = process.env.NODE_ENV === "production";
  
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
