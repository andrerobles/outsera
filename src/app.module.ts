import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeOrmSqlite } from './config/typeorm.config';
import { MovieModule } from './modules/movie/movie.module';
import { ProducerModule } from './modules/producer/producer.module';
import { StudioModule } from './modules/studio/studio.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmSqlite),
    MovieModule,
    StudioModule,
    ProducerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
