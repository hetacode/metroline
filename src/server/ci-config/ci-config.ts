export interface Env {
  [envVarName: string]: string;
}

export type IncludeCondition = { include: string[] };
export type ExcludeCondition = { exclude: string[] };
export type PathCondition =
  string[]
  | IncludeCondition
  | ExcludeCondition;
export type TagCondition =
  string[]
  | IncludeCondition
  | ExcludeCondition;
export type BranchCondition =
  string[]
  | IncludeCondition
  | ExcludeCondition;
export type StatusCondition =
  string[]
  | IncludeCondition
  | ExcludeCondition;

export interface WhenConditions {
  propagate?: boolean;
  branch?: BranchCondition;
  tag?: TagCondition;
  path?: PathCondition;
  status?: StatusCondition;
}

export interface Job {
  image?: string;
  bin?: string;
  allowFailure?: boolean;
  env?: Env;
  script: string[];
  dependencies?: string[];
  when?: WhenConditions;
  if?: string;
}

export interface CiConfigJobs {
  [key: string]: Job
}

export interface DockerSettings {
  auth?: string;
}

export interface CiConfig {
  version: string;
  name: string;
  env?: Env;
  docker?: DockerSettings;
  image?: string;
  beforeScript?: string[];
  afterScript?: string[];
  jobs: CiConfigJobs;
}
