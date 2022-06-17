import { ObjectId } from 'mongodb';
import { CiConfig } from '../../server/ci-config/ci-config';
import { Commit } from './commit';
import { Duration } from './duration';

export type PipelineStatus =
  'created'
  | 'running'
  | 'success'
  | 'failure'
  | 'partial'
  | 'skipped'
  | 'cancelled'
  | 'unknown';

export interface Pipeline {
  _id?: ObjectId;
  name?: string;
  repoId: string;
  createdAt: Date;
  status: PipelineStatus;
  start?: Date;
  end?: Date;
  duration?: Duration;
  commit: Commit;
  ciConfig?: CiConfig;
  ciPlainConfig?: string;
  error?: string;
  cancelledAt?: Date;
}
