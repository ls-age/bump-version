import { basename } from 'path';
import { readdir } from 'fs-extra';

const monorepoFiles = new Set(['pnpm-workspace.yaml', 'lerna.json']);

export async function findMonorepoFile({ cwd = process.cwd() }) {
  const files = await readdir(cwd);

  return files.find(file => monorepoFiles.has(file));
}

export function tagPrefix({ dir }) {
  return `${basename(dir)}-`;
}

export async function isMonorepo({ cwd }) {
  const monorepoFile = await findMonorepoFile({ cwd });

  return !!monorepoFile;
}
