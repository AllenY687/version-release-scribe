require('dotenv').config();

const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3001;

app.get('/api/releases', async (req, res) => {
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
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch releases' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
