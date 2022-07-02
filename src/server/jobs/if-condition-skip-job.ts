import { Job } from '../../commons/types/job';
import { safeEval } from '../utils/safe-eval';
import chalk from 'chalk';
import { Logger } from '../../commons/logger/logger';
import { hideSecretsFromLog } from '../../commons/jobs/hide-secrets-from-log';

const logger = new Logger('metroline.server:ifConditonSkipJob');

export function ifConditionSkipJob(job: Job): boolean | IfConditionSkipError {
  const result = safeEval(`return ${job.if}`, job.env);
  if (typeof result === 'boolean') {
    const skip = !(result as boolean);
    if (skip) {
      logger.debug(`Job ${chalk.blue(job.name)} skip by 'if' condition ${chalk.blue(job.if)}`);
    }
    return skip;
  }
  const errorMessage = `Job ${chalk.blue(job.name)} 'if' condition ${chalk.blue(job.if)} generate wrong result ${typeof result} - should be boolean`;
  const safeErrorMessage = hideSecretsFromLog(errorMessage, job.hideFromLogs);
  logger.error(safeErrorMessage);
  return new IfConditionSkipError();
}

export class IfConditionSkipError {
}
