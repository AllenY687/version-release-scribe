require('dotenv').config();
const axios = require('axios');

const owner = 'pillexa-dev';     // GitHub org or user
const repo = 'pillexa';        // Repo name
const branch = 'main';           // Or 'master'

async function fetchCommits() {
  try {
    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/commits?sha=${branch}&per_page=20`,
      {
        headers: {
          Authorization: `token ${process.env.COMPANY_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

    return response.data.map(commit => ({
      sha: commit.sha,
      message: commit.commit.message,
      author: commit.commit.author.name,
      date: commit.commit.author.date,
    }));
  } catch (err) {
    console.error('Failed to fetch commits:', err.response?.status, err.response?.data?.message);
    throw err;
  }
}

module.exports = fetchCommits;
