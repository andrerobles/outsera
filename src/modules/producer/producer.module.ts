import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProducerEntity } from './producer.entity/producer.entity';
import { ProducerService } from './producer.service';
import { ProducerController } from './producer.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProducerEntity], 'sqliteConnection')],
  providers: [ProducerService],
  exports: [ProducerService],
  controllers: [ProducerController],
})
export class ProducerModule {}
