require('dotenv').config();

const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const cors = require('cors');
const axios = require('axios');
const app = express();
const PORT = 3001;

const BASE_DIR = path.join(__dirname, 'api', 'releases');

app.use(cors({origin: 'http://localhost:8080'}));

let cachedReleases = [];

async function fetchAllReleases() {
  try {
    // Step 1: Get all repos for user
    const reposRes = await axios.get(
      'https://api.github.com/user/repos',
      {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          'User-Agent': 'version-release-scribe'
        }
      }
    );

    const repos = reposRes.data;

    // Step 2: For each repo, get its releases
    for (const repo of repos) {
      const projectName = repo.name;

      try {
        const releasesRes = await axios.get(
          `https://api.github.com/repos/AllenY687/${projectName}/releases`,
          {
            headers: {
              Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
              'User-Agent': 'version-release-scribe'
            }
          }
        );

        const releases = releasesRes.data;

        // Step 3: Save JSON to /api/releases/<project>.json
        const outputPath = path.join(BASE_DIR, `${projectName}.json`);
        await fs.mkdir(BASE_DIR, { recursive: true });
        await fs.writeFile(outputPath, JSON.stringify(releases, null, 2));

        console.log(`Fetched releases for ${projectName}`);
      } catch (repoErr) {
        console.warn(`Could not fetch releases for ${projectName}:`, repoErr.message);
      }
    }
  } catch (err) {
    console.error('Failed to fetch repositories:', err.message);
  }
}


app.get('/api/releases', async (req, res) => {
  try {
    const files = await fs.readdir(BASE_DIR);
    const allReleases = [];

    for (const file of files) {
      if (!file.endsWith('.json')) continue;

      const filePath = path.join(BASE_DIR, file);
      const content = await fs.readFile(filePath, 'utf-8');
      const releases = JSON.parse(content);
      const repoName = file.replace('.json', '');

      releases.forEach(release => {
        allReleases.push({
          ...release,
          repository: {
            id: `${repoName}-id`, // Optional: make unique with GitHub repo ID if you have it
            name: repoName,
            description: release.body?.split('\n')[0] || 'No description'
          }
        });
      });
    }

    res.json(allReleases);
  } catch (err) {
    console.error('Failed to aggregate releases:', err);
    res.status(500).json({ error: 'Failed to fetch releases' });
  }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    fetchAllReleases();
    setInterval(fetchAllReleases, 30000); // fetch every 30 seconds
});
