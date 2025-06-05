const { spawn } = require("child_process");

function summarizeCommits(commitText) {
  return new Promise((resolve, reject) => {
    const py = spawn("python", ["summarizeCommits.py"]);
    let result = "", error = "";

    py.stdout.on("data", (data) => {
      result += data.toString();
    });

    py.stderr.on("data", (data) => {
      console.error("Python error:", data.toString());
    });

    py.on("close", (code) => {
      if (code === 0) {
        resolve(result.trim());
      } else {
        reject(new Error(`Python script exited with code ${code}: ${error}`));
      }
    });

    py.stdin.write(JSON.stringify(commitText));
    py.stdin.end();
  });
}

module.exports = summarizeCommits;