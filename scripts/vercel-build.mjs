import { execFileSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  rmSync,
} from "node:fs";
import { basename, dirname, join } from "node:path";

const token = process.env.GITHUB_SUBMODULE_TOKEN;

if (!token) {
  console.error("GITHUB_SUBMODULE_TOKEN is not configured.");
  process.exit(1);
}

const authenticatedGitHubUrl =
  `url.https://x-access-token:${token}@github.com/.insteadOf=https://github.com/`;

try {
  execFileSync(
    "git",
    [
      "-c",
      authenticatedGitHubUrl,
      "submodule",
      "update",
      "--init",
      "--recursive",
      "--force",
    ],
    { stdio: "inherit" },
  );
} catch {
  console.error("Failed to initialize one or more Git submodules.");
  process.exit(1);
}

const projectRoot = process.cwd();
const outputDirectory = join(projectRoot, "vercel-output");

if (dirname(outputDirectory) !== projectRoot) {
  throw new Error("Invalid Vercel output directory.");
}

rmSync(outputDirectory, { force: true, recursive: true });
mkdirSync(outputDirectory, { recursive: true });

const deploymentEntries = [
  "articles",
  "assets",
  "css",
  "js",
  "projects",
  "servicos",
  "ads.txt",
  "index.html",
  "robots.txt",
  "sitemap.xml",
];

const requiredProjectPages = [
  "projects/background-remover/index.html",
  "projects/chess-study/index.html",
  "projects/net-salary-calculator/index.html",
  "projects/uuid-generator/index.html",
];

for (const projectPage of requiredProjectPages) {
  if (!existsSync(join(projectRoot, projectPage))) {
    throw new Error(`Required project page is missing: ${projectPage}`);
  }
}

for (const entry of deploymentEntries) {
  const source = join(projectRoot, entry);

  if (!existsSync(source)) {
    throw new Error(`Required deployment entry is missing: ${entry}`);
  }

  cpSync(source, join(outputDirectory, basename(entry)), {
    filter: (sourcePath) => basename(sourcePath) !== ".git",
    recursive: true,
  });
}

for (const projectPage of requiredProjectPages) {
  const outputPage = join(outputDirectory, projectPage);

  if (!existsSync(outputPage)) {
    throw new Error(`Project page was not copied to the output: ${projectPage}`);
  }

  console.log(`Included ${projectPage}`);
}

console.log("Static deployment output prepared in vercel-output.");
