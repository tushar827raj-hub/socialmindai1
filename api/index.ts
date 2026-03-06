import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
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
  
  console.log(`[Auth] Generating URL for ${platform}. Origin: ${origin}`);

  // For the sake of the demo, return an absolute URL
  const absoluteAuthUrl = `${origin}/auth/callback/${platform}?code=mock_code`;
  res.json({ url: absoluteAuthUrl });
});

// OAuth Callback Handler
app.get("/auth/callback/:platform", (req, res) => {
  const { platform } = req.params;
  const { code } = req.query;
  console.log(`[Auth] Callback received for ${platform} with code: ${code}`);

  res.send(`
    <html>
      <body style="font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #f9fafb;">
        <div style="text-align: center; padding: 2rem; background: white; border-radius: 1rem; shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
          <h2 style="color: #111827; margin-bottom: 0.5rem;">Connection Successful!</h2>
          <p style="color: #6b7280; margin-bottom: 1.5rem;">You can now close this window.</p>
          <script>
            if (window.opener) {
              window.opener.postMessage({ 
                type: 'OAUTH_AUTH_SUCCESS', 
                platform: '${platform}',
                data: { 
                  profileName: 'Demo User', 
                  profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=${platform}' 
                }
              }, '*');
              setTimeout(() => window.close(), 1000);
            }
          </script>
        </div>
      </body>
    </html>
  `);
});

export default app;
