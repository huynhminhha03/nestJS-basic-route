import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';

import { LoggerMiddleware } from './middleware/logger.middleware';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        
      
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: Number(process.env.EMAIL_PORT) || 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_ID || 'hadep7a@gmail.com', // generated ethereal user
          pass: process.env.EMAIL_PASS|| 'xvyhjsdyzmhhoulj' // generated ethereal password
        },
      },
      defaults: {
        from: `"No Reply" <${process.env.EMAIL_ID || 'hadep7a@gmail.com'}>`,
      },
    }),
    ConfigModule.forRoot(), 
    AuthModule,
    UsersModule,
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost/nest'),
  ],
  
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
