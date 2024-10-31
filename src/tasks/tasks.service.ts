import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class TasksService {
//   @Cron('*/10 * * * * *')
  handleCron() {
    this.sendNotification();
  }

  sendNotification() {
    // Giả sử bạn có một hàm gửi thông báo đến người dùng
    console.log('Gửi thông báo cho người dùng...');
    // Bạn có thể thay thế bằng logic gửi thông báo thực tế, như qua email hoặc websocket
  }
}
