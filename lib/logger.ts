import { createLogger, format, transports } from 'winston'

const logger = createLogger({
  level: 'info',
  format: format.json(),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'logs/nexus-error.log', level: 'error' }),
    new transports.File({ filename: 'logs/nexus-combined.log' })
  ]
})

export default logger
