import chalk from 'chalk';
import { Jobs } from './jobs';
import { Job } from '../../commons/types/job';
import { computePipelineStatus } from '../pipelines/compute-pipeline-status';
import { getUpstreamJobs } from './get-upstream-jobs';
import { setJobStatus } from './set-job-status';
import { isFinalStatus } from './is-final-status';
import { canExecWhenStatus } from '../ci-config/conditions/can-exec-when-status';
import { Logger } from '../../commons/logger/logger';
import { canExecWhenBranch } from '../ci-config/conditions/can-exec-when-branch';
import { Pipeline } from '../../commons/types/pipeline';
import { canExecWhenTag } from '../ci-config/conditions/can-exec-when-tag';
import { canExecWhenPath } from '../ci-config/conditions/can-exec-when-path';

const logger = new Logger('metroline.server:updateDownstreamJob');

export async function updateDownstreamJob(job: Job, jobs: Job[], pipeline: Pipeline): Promise<void> {
  const upstreamJobs = await getUpstreamJobs(job, jobs);
  const upstreamStatus = computePipelineStatus(upstreamJobs);

  logger.debug(`Job ${chalk.blue(job.name)} has upstream jobs ${upstreamJobs.map(j => `${chalk.blue(j.name)}:${chalk.yellow(j.status)}`)}`);

  if (!isFinalStatus(upstreamStatus)) {
    logger.debug(`Job ${chalk.blue(job.name)} has upstream status ${chalk.blue(upstreamStatus)} which is not final, it won't be updated`);
    return;
  }

  logger.debug(`Updating job ${chalk.blue(job.name)} with upstream status ${chalk.blue(upstreamStatus)}`);

  // Check two separated conditions:
  // - for branch
  // - for tag
  // - for path
  //
  // If branch is set to skip, try check tag condition
  const skips: { ignore: boolean, skip: boolean }[] = [
    { ignore: false, skip: !canExecWhenStatus(upstreamStatus, job.when?.status) }, // status should be check always
    { ignore: !job.when?.branch, skip: !canExecWhenBranch(pipeline.commit.branch, job.when?.branch) },
    { ignore: !job.when?.tag, skip: !canExecWhenTag(pipeline.commit.tag, job.when?.tag) },
    { ignore: !job.when?.path, skip: !canExecWhenPath(pipeline.commit.pathsChanged, job.when?.path) },
  ];
  logger.debug(`skips for job ${job.name}: ${JSON.stringify(skips)}`);

  const notIgnored = skips.filter(f => !f.ignore);
  const skip = notIgnored.length === 0 ? false : !notIgnored.some(s => !s.skip);

  if (skip) {
    logger.debug(`Skipping job ${chalk.blue(job.name)} as its upstream status ${chalk.blue(upstreamStatus)}`);
  }

  await Jobs().updateOne({ _id: job._id }, {
    $set: {
      upstreamStatus,
      env: {
        ...job.env,
        METROLINE_UPSTREAM_STATUS: upstreamStatus,
      },
      /*
       * Must be set here because this determines if the job can be started
       */
      ...(skip ? { status: 'skipped' } : {}),
    },
  });

  if (skip) {
    // redundant with above $set, but necessary to trigger downstream update logic
    setJobStatus(job._id.toHexString(), 'skipped')
      .catch(err => logger.error(err));
  }
}
