export interface Commit {
  sha: string;
  url: string;
  message: string;
  author: string;
  branch: string;
  tag: string;
  pathsChanged: string[];
  protectedBranch: boolean;
  repoId: string;
  gitSshUrl: string;
}
