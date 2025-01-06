import { Controller, Get } from '@nestjs/common';
import { StudioService } from './studio.service';
import { StudioEntity } from './studio.entity/studio.entity';

@Controller('studios')
export class StudioController {
  constructor(private readonly studioService: StudioService) {}

  @Get()
  public async findAllStudios(): Promise<StudioEntity[]> {
    return this.studioService.getAllStudios();
  }
}
