import { Logger } from '../../commons/logger/logger';
import { ProcessCIConfigEvent } from '../../commons/runners/events';
import { processCiConfig } from '../ci-config/process-ci-config';

const logger = new Logger('metroline.server:processCiConfig');

export function processCIConfigEventHandler(data: ProcessCIConfigEvent) {
  logger.debug(`Process ci config for job ${data.jobId}`);
  processCiConfig(data.jobId)
    .catch(err => logger.error('Could not process CI config', err));
}
