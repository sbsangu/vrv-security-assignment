import winston from 'winston';
import path from 'path';

export class Logger {
    private logger: winston.Logger;
    private context: string;

    constructor(context: string) {
        this.context = context;
        
       
        const customFormat = winston.format.combine(
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            winston.format.errors({ stack: true }),
            winston.format.printf(({ level, message, timestamp, stack, context }) => {
                const contextPrefix = context ? `[${context}] ` : '';
                const stackTrace = stack ? `\n${stack}` : '';
                return `${timestamp} ${level.toUpperCase()} ${contextPrefix}${message}${stackTrace}`;
            })
        );

        
        this.logger = winston.createLogger({
            level: process.env.LOG_LEVEL || 'info',
            format: customFormat,
            transports: [
                
                new winston.transports.Console({
                    format: winston.format.combine(
                        customFormat,
                        winston.format.colorize({ all: true })
                    )
                }),
                
                new winston.transports.File({
                    filename: path.join(process.cwd(), 'logs', 'error.log'),
                    level: 'error'
                }),
                
                new winston.transports.File({
                    filename: path.join(process.cwd(), 'logs', 'combined.log')
                })
            ]
        });
    }

    
    info(message: string, metadata?: any): void {
        this.logger.info({
            message,
            context: this.context,
            ...metadata
        });
    }

    
    error(message: string, error?: any): void {
        this.logger.error({
            message,
            context: this.context,
            ...(error instanceof Error ? { stack: error.stack } : { error })
        });
    }

    
    warn(message: string, metadata?: any): void {
        this.logger.warn({
            message,
            context: this.context,
            ...metadata
        });
    }

    
    debug(message: string, metadata?: any): void {
        this.logger.debug({
            message,
            context: this.context,
            ...metadata
        });
    }
}