import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieEntity } from './movie.entity/movie.entity';
import { MovieService } from './movie.service';
import { ProducerEntity } from '../producer/producer.entity/producer.entity';
import { StudioEntity } from '../studio/studio.entity/studio.entity';
import { MovieController } from './movie.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [MovieEntity, ProducerEntity, StudioEntity],
      'sqliteConnection',
    ),
  ],
  providers: [MovieService],
  exports: [MovieService],
  controllers: [MovieController],
})
export class MovieModule {}
