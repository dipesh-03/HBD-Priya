import { spawnSync } from "node:child_process";

const owner = process.env.GITHUB_OWNER || "dipesh-03";
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

  if (!response.ok && response.status !== 404) {
    const text = await response.text();
    throw new Error(`${options.method || "GET"} ${path} failed with ${response.status}: ${text}`);
  }

  return response;
}

const token = getCredential();
const repos = [];

for (let page = 1; ; page += 1) {
  const response = await github(`/user/repos?per_page=100&page=${page}&affiliation=owner`);
  const batch = await response.json();
  if (!Array.isArray(batch) || batch.length === 0) break;
  repos.push(...batch.filter((repo) => repo.owner?.login === owner));
  if (batch.length < 100) break;
}

let disabled = 0;

for (const repo of repos) {
  const pagesResponse = await github(`/repos/${owner}/${repo.name}/pages`);
  if (pagesResponse.status === 404) continue;

  await github(`/repos/${owner}/${repo.name}/pages`, { method: "DELETE" });
  console.log(`Disabled Pages: ${owner}/${repo.name}`);
  disabled += 1;
}

if (disabled === 0) {
  console.log(`No configured GitHub Pages sites found for repos owned by ${owner}.`);
} else {
  console.log(`Disabled ${disabled} GitHub Pages site${disabled === 1 ? "" : "s"}.`);
}
