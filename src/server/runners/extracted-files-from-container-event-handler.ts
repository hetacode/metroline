import { ExtractedFilesFromContainerEvent } from '../../commons/runners/events';
import { CI_CONFIG_PATH } from '../../commons/constants';
import { preparePipelineCloneJobs } from '../ci-config/process-ci-config';
import { Logger } from '../../commons/logger/logger';

const logger = new Logger('metroline.server:extractedFilesFromContainer');

export function extractedFilesFromContainerEventHandler(data: ExtractedFilesFromContainerEvent) {
  logger.debug(`Received files from runner for job ${data.jobId}: ${Object.keys(data.files).join(',')}`);
  const ciFiles = Object.keys(data.files).filter(f => f.startsWith(CI_CONFIG_PATH));
  if (ciFiles.length !== 0) {
    preparePipelineCloneJobs(data.jobId, ciFiles.map(m => data.files[m]))
      .catch(err => logger.error('Could not prepare clone jobs', err));
  }
}
