import chalk from 'chalk';
import { Job } from '../../commons/types/job';
import { Pipeline } from '../../commons/types/pipeline';
import { canExecWhenBranch } from './conditions/can-exec-when-branch';
import { Logger } from '../../commons/logger/logger';
import { canExecWhenTag } from './conditions/can-exec-when-tag';
import { canExecWhenPath } from './conditions/can-exec-when-path';

const logger = new Logger('metroline.server:skipJobsBasedOnConditions');

function getDownstreamJobs(job: Job, jobs: Job[]): Job[] {
  const downstream = new Set<Job>();
  jobs
    .filter(j => j.dependencies?.some(name => name === job.name))
    .forEach(child => {
      downstream.add(child);
      getDownstreamJobs(child, jobs).forEach(j => {
        downstream.add(j);
      });
    });
  return Array.from(downstream);
}

export function skipJobsBasedOnConditions(pipeline: Pipeline, jobs: Job[]) {
  jobs.forEach(job => {
    const skips: { ignore: boolean, skip: boolean }[] = [
      { ignore: !job.when?.branch, skip: !canExecWhenBranch(pipeline.commit.branch, job.when?.branch) },
      { ignore: !job.when?.tag, skip: !canExecWhenTag(pipeline.commit.tag, job.when?.tag) },
      { ignore: !job.when?.path, skip: !canExecWhenPath(pipeline.commit.pathsChanged, job.when?.path) },
    ];

    const notIgnored = skips.filter(f => !f.ignore);
    const skip = notIgnored.length === 0 ? false : !notIgnored.some(s => !s.skip);
    if (skip) {
      job.status = 'skipped';
      if (job.when?.propagate) {
        const downstreamJobs = getDownstreamJobs(job, jobs);
        logger.debug(`Downstream jobs of ${chalk.blue(job.name)} are [${downstreamJobs.map(j => chalk.blue(j.name)).join(',')}]`);
        downstreamJobs.forEach(downstreamJob => {
          downstreamJob.status = 'skipped';
        });
      }
    }
  });
}
