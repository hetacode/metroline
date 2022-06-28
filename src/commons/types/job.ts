import { ObjectId } from 'mongodb';
import { Env, WhenConditions } from '../../server/ci-config/ci-config';
import { Duration } from './duration';
import { PipelineStatus } from './pipeline';

export type JobStatus =
  'created'
  | 'running'
  | 'success'
  | 'failure'
  | 'skipped'
  | 'cancelled';

export interface Job {
  _id?: ObjectId;
  isPreparationJob: boolean;
  createdAt?: Date;
  pipelineId: string;
  allowFailure?: boolean;
  name: string;
  bin?: string;
  env?: Env;
  when?: WhenConditions;
  if?: string;
  hideFromLogs?: string[];
  index?: number;
  image: string;
  dockerAuth?: string;
  script: string[];
  workspace?: string;
  status: JobStatus;
  upstreamStatus?: PipelineStatus;
  start?: Date;
  end?: Date;
  duration?: Duration;
  dependencies?: string[];
  extractFileFromContainer?: string[];
  extractDirectoryFromContainer?: string[];
  runnerId?: string;
  cancelledAt?: Date;
}
