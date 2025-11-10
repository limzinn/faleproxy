const express = require('express');
const axios = require('axios');
const path = require('path');
const { transformHtml } = require('./lib/transform');

function createApp() {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(path.join(__dirname, 'public')));

  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });

  app.post('/fetch', async (req, res) => {
    try {
      const { url } = req.body;

      if (!url) {
        return res.status(400).json({ error: 'URL is required' });
      }

      const response = await axios.get(url);
      const html = response.data;
      const { content, title } = transformHtml(html);

      return res.json({
        success: true,
        content,
        title,
        originalUrl: url
      });
    } catch (error) {
      console.error('Error fetching URL:', error.message);

      const status = error.response?.status;
      const normalizedStatus = status && status >= 400 && status < 600 ? status : 500;

      return res.status(normalizedStatus).json({
        error: `Failed to fetch content: ${error.message}`
      });
    }
  });

  return app;
}

const app = createApp();

function startServer(port = process.env.PORT || 3001) {
  return app.listen(port, () => {
    console.log(`Faleproxy server running at http://localhost:${port}`);
  });
}

if (require.main === module) {
  startServer();
}

module.exports = app;
module.exports.createApp = createApp;
module.exports.startServer = startServer;
