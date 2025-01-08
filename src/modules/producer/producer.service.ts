import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ProducerEntity } from './producer.entity/producer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MovieEntity } from '../movie/movie.entity/movie.entity';
import { ProducerInterval, ProducerRange } from 'src/types/producer.type';

@Injectable()
export class ProducerService {
  constructor(
    @InjectRepository(ProducerEntity, 'sqliteConnection')
    private readonly repository: Repository<ProducerEntity>,
  ) {}

  public async getProducerInterval(): Promise<ProducerRange> {
    const producers = await this.getAllProducers();

    const minInterval: ProducerInterval[] = [];
    const maxInterval: ProducerInterval[] = [];

    for (let i = 0; i < producers.length; i++) {
      const producer = producers[i];
      const { min, max } = this.organizeInterval(producer);

      this.compareInterval(max, maxInterval, 'max');
      this.compareInterval(min, minInterval, 'min');
    }

    return {
      min: minInterval,
      max: maxInterval,
    };
  }

  private compareInterval(
    element: ProducerInterval,
    interval: ProducerInterval[],
    direction: 'min' | 'max',
  ): void {
    if (!element) return;

    interval.push(element);

    if (direction === 'min') {
      interval.sort((a, b) => a.interval - b.interval);
    } else {
      interval.sort((a, b) => b.interval - a.interval);
    }

    if (interval.length > 2) {
      interval.length = 2;
    }
  }

  private organizeInterval(producer: ProducerEntity): {
    min: ProducerInterval;
    max: ProducerInterval;
  } {
    let producerByInterval: ProducerInterval[] = [];

    //Ordena por maior ano
    const moviesByYear = producer.movies
      .filter((movie) => movie.winner)
      .sort((a, b) => b.year - a.year);

    if (moviesByYear.length < 2) {
      // Retorna valores padrão se não houver filmes suficientes
      return { min: null, max: null };
    }

    //organiza por intervalo
    let last: MovieEntity | null;
    for (let i = 0; i < moviesByYear.length; i++) {
      const current = moviesByYear[i];
      if (!last) {
        last = current;
        continue;
      }
      producerByInterval.push({
        producer: producer.name,
        previousWin: current.year,
        followingWin: last.year,
        interval: last.year - current.year,
      });
    }

    //Ordena por maior intervalo
    producerByInterval = producerByInterval.sort(
      (a, b) => b.interval - a.interval,
    );

    let min: ProducerInterval;
    let max: ProducerInterval;

    //Obtem o primeiro e ultimo intervalo
    if (producerByInterval.length > 0) {
      max = producerByInterval[0];
      min = producerByInterval[producerByInterval.length - 1];
    }

    return { min, max };
  }

  public async getAllProducers(): Promise<ProducerEntity[]> {
    return this.repository.find({
      relations: ['movies'],
    });
  }
}
