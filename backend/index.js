require('dotenv').config();

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const PORT = 3001;

app.use(cors({origin: 'http://localhost:8080'}));

let cachedReleases = [];

async function fetchReleases() {
    try {
      const response = await axios.get(
        'https://api.github.com/repos/AllenY687/DietTracker/releases',
        {
          headers: {
            'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
            'User-Agent': 'version-release-scribe'
          }
        }
      );
      cachedReleases = response.data;  // update cache
      console.log('Releases updated:', new Date().toLocaleTimeString());
    } catch (err) {
      console.error('Failed to fetch releases:', err.message);
    }
  }

app.get('/api/releases', async (req, res) => {
  res.json(cachedReleases);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    fetchReleases();
    setInterval(fetchReleases, 30000); // fetch every 30 seconds
});
