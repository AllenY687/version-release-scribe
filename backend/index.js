require('dotenv').config();

const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const axios = require('axios');
const app = express();
const fetchCommits = require('./generateReleaseNotes');
const summarizeCommits = require('./summarizer');
const PORT = 3001;

const BASE_DIR = path.join(__dirname, 'api', 'releases');

app.use(express.json({ limit: '5mb' }));



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

        //console.log(`Fetched releases for ${projectName}`);
      } catch (repoErr) {
        //console.warn(`Could not fetch releases for ${projectName}:`, repoErr.message);
      }
    }
  } catch (err) {
    //console.error('Failed to fetch repositories:', err.message);
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
            id: `${repoName}-id`, 
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

app.get('/api/commits', async (req, res) => {
  try {
    const commits = await fetchCommits();
    res.json(commits);
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch commits' });
  }
});

app.post("/summarize", async (req, res) => {
  try {
    const commitText = req.body.commits;

    console.log("=== Commit Text ===");
    console.log(JSON.stringify({commitText}, null, 2));
    console.log("===========================");


    const summary = await summarizeCommits(commitText);

    res.send({ summary });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

app.get("/api/generated-release-notes", async (req, res) => {
  try {
    const rawCommits = await fetchCommits();

    const summaryResponse = await axios.post("http://localhost:3001/summarize", {
      commits: rawCommits
    });

    console.log("=== Generated Notes ===");
    console.log(JSON.stringify(summaryResponse));
    console.log("===========================")
   
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});


app.get('/api/disk-release-notes', async (req, res) => {
  try {
    const RELEASE_DIR = path.join(__dirname, 'releases');

    let files = (await fs.readdir(RELEASE_DIR)).filter(f => f.endsWith('.txt'));

    // Sort files by the number in the filename (e.g., releaseNotes2.txt -> 2)
    files.sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)?.[0] ?? '0', 10);
      const numB = parseInt(b.match(/\d+/)?.[0] ?? '0', 10);
      return numA - numB;
    });

    const total = files.length;
    const releases = await Promise.all(
      files.map(async (filename, idx) => {
        const filePath = path.join(RELEASE_DIR, filename);
        const body = await fs.readFile(filePath, 'utf-8');

        const reverseIdx = total - 1 - idx;
        const versionNum = reverseIdx.toString();

        return {
          id: versionNum,
          tag_name: `v1.0.${versionNum}`,
          name: `Release ${versionNum}`,
          created_at: new Date().toISOString(),
          published_at: new Date().toISOString(),
          body: body,
          assets: [],
          repository: {
            id: '1',
            name: 'Pillexa',
            description: 'Release notes generated for codebase',
          },
        };
      })
    );

    res.json(releases);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to read releases' });
  }
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    fetchAllReleases();
    setInterval(fetchAllReleases, 30000); // fetch every 30 seconds
});
