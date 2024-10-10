import pino, { Logger } from 'pino'

const PinoLevelToSeverityLookup: { [key: string]: string } = {
    trace: 'DEBUG',
    debug: 'DEBUG',
    info: 'INFO',
    warn: 'WARNING',
    error: 'ERROR',
    fatal: 'CRITICAL',
}

const defaultPinoConf = {
    messageKey: 'message',
    formatters: {
        level(label: string, number: number) {
            return {
                severity:
                    PinoLevelToSeverityLookup[label] ||
                    PinoLevelToSeverityLookup['info'],
                level: number,
            }
        },
    },
}

export const logger: Logger =
    process.env.COMMON_ENV === 'prd' || process.env.COMMON_ENV === 'dev'
        ? pino({ level: 'warn', ...defaultPinoConf })
        : pino({
              transport: {
                  target: 'pino-pretty',
                  options: {
                      colorize: true,
                  },
              },
              level: 'debug',
              ...defaultPinoConf,
          })
