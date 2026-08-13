#!/usr/bin/env node
// WARNING: Works only on Linux and MacOS.
if (process.platform === "win32") {
  console.error("Windows is not supported.");
  process.exit(1);
}

const child_process = require("child_process");

const typesToChangelog = {
  feat: "Added",
  fix: "Fixed",
  perf: "Performance Improvements",
  docs: "Documentation",
  security: "Security",
  "!": "Breaking Changes",
};

if (!process.env.VERSION) throw new Error("VERSION is required");

const currentTag = `v${process.env.VERSION}`;
const prevTag = child_process
  .execSync(`git describe --tags --abbrev=0 --match "v[0-9]*" ${currentTag}^`)
  .toString()
  .trim();

const categorizedCommits = child_process
  .execSync(`git log ${prevTag}..${currentTag} --oneline`)
  .toString()
  .split("\n")
  .reduce(
    (categorizedCommits, commit) => {
      // Remove commit hash.
      commit = commit.substring(commit.indexOf(" ") + 1);
      let type = commit.split(":")[0].toLocaleLowerCase();

      if (type.endsWith("!")) type = "!";
      if (type === "feat") commit = commit.replace(/feat/i, "New");
      if (type === "docs") commit = commit.replace(/docs/i, "Docs");
      if (
        type === "perf" ||
        type === "fix" ||
        type === "security" ||
        type === "!"
      )
        commit = commit.substring(commit.indexOf(":") + 1).trim();
      if (categorizedCommits[type]) categorizedCommits[type].push(commit);

      return categorizedCommits;
    },
    { feat: [], fix: [], perf: [], docs: [], "!": [], security: [] },
  );

categorizedCommits["feat"] = categorizedCommits["feat"].concat(
  categorizedCommits["docs"],
);
delete categorizedCommits["docs"];

const changelog = Object.keys(categorizedCommits)
  .filter((type) => categorizedCommits[type].length)
  .map(
    (type) =>
      `- ${typesToChangelog[type]}\n${categorizedCommits[type].map((commit) => `  - ${commit}`).join("\n")}`,
  );

require("fs").writeFileSync("CHANGELOG.md", changelog.join("\n"));
console.log("CHANGELOG:\n" + changelog.join("\n"));
