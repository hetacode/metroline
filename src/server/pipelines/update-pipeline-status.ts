import chalk from 'chalk';
import { setPipelineEnd } from './set-pipeline-end';
import { Jobs } from '../jobs/jobs';
import { computePipelineStatus } from './compute-pipeline-status';
import { Logger } from '../../commons/logger/logger';
import { setPipelineStatus } from './set-pipeline-status';
import { CLONE_JOB_NAME } from '../constants';

const logger = new Logger('metroline.server:updatePipelineStatus');

export async function updatePipelineStatus(pipelineId: string): Promise<void> {
  const jobs = await Jobs().find({ pipelineId }).toArray();

  let status = computePipelineStatus(jobs);

  const onlyHasSucceededCloneJob = jobs.length === 1 && status === 'success';

  if (
    status !== 'running'
    && status !== 'created'
    // don't set status when there's only a single job
    && !onlyHasSucceededCloneJob
  ) {
    const jobStatuses = jobs.map(j => `${chalk.blue(j.name)}:${chalk.bold.blue(j.status)}`).join(',');
    logger.debug(`Setting end of pipeline ${chalk.blue(pipelineId)} with status ${chalk.blue(status)}; job statuses are ${jobStatuses}`);
    setPipelineEnd(pipelineId, new Date());

    // Check if exists any job with non-skipped status - if false it's means that all jobs are skipped
    const onlyHasSkippedJobs = !jobs.filter(f => f.name !== CLONE_JOB_NAME).some(s => s.status !== 'skipped');
    if (onlyHasSkippedJobs) {
      // Set pipeline as 'skipped'
      status = 'skipped';
    }
  }

  if (onlyHasSucceededCloneJob) {
    /*
     * This is a workaround to avoid seeing status "success" then "running" when
     * we add user defined jobs to the pipeline. In theory, the "success" status is
     * correct as there's a single job which has status "success", but in practice
     * we know that the pipeline is still "running" as we're expecting more jobs to
     * come. This workaround only works if we force users to define at least one job,
     * which IMO is a reasonable constraint.
     */
    logger.debug(`Skipping status update of pipeline ${pipelineId} to avoid bad transition`);
    return;
  }

  await setPipelineStatus(pipelineId, status);
}
