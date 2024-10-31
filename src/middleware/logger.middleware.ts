import { Injectable, NestMiddleware } from '@nestjs/common';
import * as morgan from 'morgan';
import { Request, Response, NextFunction } from 'express';
import * as fs from 'fs';
import * as path from 'path';

// Tạo thư mục logs nếu chưa có
const logDirectory = path.join(__dirname, 'logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logStream = fs.createWriteStream(path.join(logDirectory, 'access.log'), { flags: 'a' });

  private logger = morgan('combined', {
    stream: {
      write: (message) => {
        // Ghi vào console
        console.log(message.trim());

        // Ghi vào file
        this.logStream.write(message);
      },
    },
  });

  use(req: Request, res: Response, next: NextFunction) {
    // Lấy địa chỉ IP
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    // Tạo message log với địa chỉ IP
    const logMessage = `\nRequest from IP: ${ip} - ${req.method} ${req.originalUrl}`;

    // In ra console
    console.log(logMessage);

    // Ghi log vào file
    this.logStream.write(`${logMessage}\n`);

    // Gọi logger để ghi log chuẩn
    this.logger(req, res, next);
  }

}
