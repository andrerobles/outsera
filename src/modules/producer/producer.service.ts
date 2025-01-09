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
      const { min, max } = this.sortInterval(producer);

      this.updateInterval(max, maxInterval, 'max');
      this.updateInterval(min, minInterval, 'min');
    }

    return {
      min: minInterval,
      max: maxInterval,
    };
  }

  private updateInterval(
    element: ProducerInterval[],
    interval: ProducerInterval[],
    direction: 'min' | 'max',
  ): void {
    if (element.length === 0) return;

    if (direction === 'min') {
      if (
        interval.length === 0 ||
        element[0].interval < interval[element.length - 1].interval
      ) {
        interval.length = 0;
        interval.push(...element);
      } else if (
        element[0].interval === interval[element.length - 1].interval
      ) {
        interval.push(...element);
      }
    } else {
      if (
        interval.length === 0 ||
        element[0].interval > interval[element.length - 1].interval
      ) {
        interval.length = 0;
        interval.push(...element);
      } else if (
        element[0].interval === interval[element.length - 1].interval
      ) {
        interval.push(...element);
      }
    }
  }

  private sortInterval(producer: ProducerEntity): {
    min: ProducerInterval[];
    max: ProducerInterval[];
  } {
    const producerByInterval: ProducerInterval[] = [];

    //Ordena por maior ano
    const moviesByYear = producer.movies
      .filter((movie) => movie.winner)
      .sort((a, b) => b.year - a.year);

    if (moviesByYear.length < 2) {
      // Retorna valores padrão se não houver filmes suficientes
      return { min: [], max: [] };
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

    let min: ProducerInterval[] = [];
    let max: ProducerInterval[] = [];

    for (let i = 0; i < producerByInterval.length; i++) {
      const producer = producerByInterval[i];

      if (min.length === 0) {
        min = [producer];
      } else {
        if (producer.interval === min[0].interval) {
          min.push(producer);
        } else {
          min = [producer];
        }
      }

      if (max.length === 0) {
        max = [producer];
      } else {
        if (producer.interval >= max[0].interval) {
          if (producer.interval === min[0].interval) {
            max.push(producer);
          } else {
            max = [producer];
          }
        }
      }
    }

    return { min, max };
  }

  public async getAllProducers(): Promise<ProducerEntity[]> {
    return this.repository.find({
      relations: ['movies'],
    });
  }
}
