import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { MovieEntity } from '../modules/movie/movie.entity/movie.entity';
import { StudioEntity } from '../modules/studio/studio.entity/studio.entity';
import { ProducerEntity } from '../modules/producer/producer.entity/producer.entity';

export const typeOrmSqlite: TypeOrmModuleOptions = {
  name: 'sqliteConnection',
  type: 'sqlite',
  database: ':memory:',
  synchronize: true,
  autoLoadEntities: true,
  logging: false,
  entities: [MovieEntity, StudioEntity, ProducerEntity],
};
