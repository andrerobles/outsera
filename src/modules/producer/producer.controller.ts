import { Controller, Get } from '@nestjs/common';
import { ProducerService } from './producer.service';
import { ProducerEntity } from './producer.entity/producer.entity';
import { ProducerRange } from 'src/types/producer.type';

@Controller('producers')
export class ProducerController {
  constructor(private readonly producerService: ProducerService) {}

  @Get()
  public async findAllProducers(): Promise<ProducerEntity[]> {
    return this.producerService.getAllProducers();
  }

  @Get('interval')
  public async findProducerInterval(): Promise<ProducerRange> {
    return this.producerService.getProducerInterval();
  }
}
