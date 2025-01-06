import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StudioEntity } from './studio.entity/studio.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StudioService {
  constructor(
    @InjectRepository(StudioEntity, 'sqliteConnection')
    private readonly repository: Repository<StudioEntity>,
  ) {}

  public async getAllStudios(): Promise<StudioEntity[]> {
    return this.repository.find({
      relations: ['movies'],
    });
  }
}
