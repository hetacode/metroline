/* eslint-disable camelcase */
import { Author, Committer } from './gitea-branch';

export interface CommitDetails {
  author: Author;
  committer: Committer;
  message: string;
  tree: {sha: string; url: string;};
  url: string;
}

export interface GiteaCommit {
  sha: string;
  url: string;
  html_url: string;
  commit: CommitDetails;
}
