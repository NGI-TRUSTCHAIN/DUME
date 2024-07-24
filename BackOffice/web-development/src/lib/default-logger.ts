import { config } from '@/src/config';
import { createLogger } from '@/src/lib/logger';

export const logger = createLogger({ level: config.logLevel });