import { Module } from '@nestjs/common';
import { StudioService } from './studio.service';
import { StudioController } from './studio.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudioEntity } from './studio.entity/studio.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StudioEntity], 'sqliteConnection')],
  providers: [StudioService],
  exports: [StudioService],
  controllers: [StudioController],
})
export class StudioModule {}
