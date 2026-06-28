import { spawnSync } from "node:child_process";

const owner = process.env.GITHUB_OWNER || "dipesh-03";
const repo = process.env.GITHUB_REPO || "HBD-Priya";
const apiHeaders = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28"
};

function getCredential() {
  const result = spawnSync("git", ["credential", "fill"], {
    input: "protocol=https\nhost=github.com\n\n",
    encoding: "utf8"
  });

  if (result.status !== 0) {
    throw new Error(result.stderr || "Unable to read GitHub credentials from git credential manager.");
  }

  const credential = Object.fromEntries(
    result.stdout
      .trim()
      .split("\n")
      .filter(Boolean)
      .map((line) => {
        const index = line.indexOf("=");
        return [line.slice(0, index), line.slice(index + 1)];
      })
  );

  if (!credential.username || !credential.password) {
    throw new Error("No stored GitHub credential found. Authenticate with GitHub first, then retry.");
  }

  return Buffer.from(`${credential.username}:${credential.password}`).toString("base64");
}

async function github(path, options = {}) {
  const response = await fetch(`https://api.github.com${path}`, {
    ...options,
    headers: {
      ...apiHeaders,
      Authorization: `Basic ${token}`,
      ...options.headers
    }
  });

  if (!response.ok && response.status !== 404 && response.status !== 409) {
    const text = await response.text();
    throw new Error(`${options.method || "GET"} ${path} failed with ${response.status}: ${text}`);
  }

  return response;
}

const token = getCredential();
const body = JSON.stringify({ source: { branch: "gh-pages", path: "/" } });
const pagesPath = `/repos/${owner}/${repo}/pages`;
const createResponse = await github(pagesPath, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body
});

if (createResponse.status === 409) {
  await github(pagesPath, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body
  });
}

const pagesResponse = await github(pagesPath);
const pages = await pagesResponse.json();
console.log(`GitHub Pages enabled: ${pages.html_url}`);
