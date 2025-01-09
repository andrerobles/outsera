import { ConflictException, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MovieEntity } from './movie.entity/movie.entity';
import { StudioEntity } from '../studio/studio.entity/studio.entity';
import { ProducerEntity } from '../producer/producer.entity/producer.entity';
import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'csv-parser';

@Injectable()
export class MovieService implements OnModuleInit {
  constructor(
    @InjectRepository(MovieEntity, 'sqliteConnection')
    private readonly movieRepository: Repository<MovieEntity>,

    @InjectRepository(StudioEntity, 'sqliteConnection')
    private readonly studioRepository: Repository<StudioEntity>,

    @InjectRepository(ProducerEntity, 'sqliteConnection')
    private readonly producerRepository: Repository<ProducerEntity>,
  ) {}

  async onModuleInit() {
    await this.insertFromFile();
  }

  public async getAllMovies(): Promise<MovieEntity[]> {
    return this.movieRepository.find({
      relations: ['producers', 'studios'],
    });
  }

  async createMovie(
    title: string,
    year: number,
    studios: string[],
    producers: string[],
    winner: boolean,
  ) {
    const existingMovie = await this.movieRepository.findOneBy({ title });
    if (existingMovie) {
      throw new ConflictException('Filme já existe');
    }

    const producersEntities = await Promise.all(
      producers.map(async (producerName) => {
        let producer = await this.producerRepository.findOneBy({
          name: producerName,
        });
        if (!producer) {
          producer = this.producerRepository.create({ name: producerName });
        } else {
          producer.name = producerName;
        }
        return this.producerRepository.save(producer);
      }),
    );

    const studiosEntities = await Promise.all(
      studios.map(async (studioName) => {
        let studio = await this.studioRepository.findOneBy({
          name: studioName,
        });
        if (!studio) {
          studio = this.studioRepository.create({ name: studioName });
        } else {
          studio.name = studioName;
        }
        return this.studioRepository.save(studio);
      }),
    );

    const movie = this.movieRepository.create({
      title,
      year,
      winner,
      producers: producersEntities,
      studios: studiosEntities,
    });

    return this.movieRepository.save(movie);
  }

  private async insertFromFile() {
    const filePath = path.resolve('src', 'data', 'Movielist.csv');
    const movies = await this.parseCSV(filePath);

    for (const movie of movies) {
      const producers = await Promise.all(
        movie.producers.map(async (producerName: string) => {
          let producer = await this.producerRepository.findOneBy({
            name: producerName,
          });
          if (!producer) {
            producer = this.producerRepository.create({ name: producerName });
            producer = await this.producerRepository.save(producer);
          }
          return producer;
        }),
      );

      const studios = await Promise.all(
        movie.studios.map(async (studioName: string) => {
          let studio = await this.studioRepository.findOneBy({
            name: studioName,
          });
          if (!studio) {
            studio = this.studioRepository.create({ name: studioName });
            studio = await this.studioRepository.save(studio);
          }
          return studio;
        }),
      );

      const movieEntity = this.movieRepository.create({
        title: movie.title,
        year: movie.year,
        winner: movie.winner,
        producers,
        studios,
      });

      await this.movieRepository.save(movieEntity);
    }

    console.log('Filmes importados com sucesso!');
  }

  private async parseCSV(filePath: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const results: any[] = [];
      fs.createReadStream(filePath)
        .pipe(csv({ separator: ';' }))
        .on('data', (data) => {
          results.push({
            year: parseInt(data.year, 10),
            title: data.title,
            studios: data.studios.split(/,|and/).map((s) => s.trim()),
            producers: data.producers.split(/,|and/).map((p) => p.trim()),
            winner: data.winner.toLowerCase().trim() === 'yes',
          });
        })
        .on('end', () => resolve(results))
        .on('error', (err) => reject(err));
    });
  }
}
