import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ColorsService } from './colors.service';
import { ColorsController } from './colors.controller';
import { Color, ColorSchema } from './models/color.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Color.name, schema: ColorSchema }])],
  controllers: [ColorsController],
  providers: [ColorsService],
})
export class ColorsModule {}
