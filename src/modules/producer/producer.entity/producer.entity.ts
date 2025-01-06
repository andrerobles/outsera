import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { MovieEntity } from '../../movie/movie.entity/movie.entity';

@Entity({ name: 'producers' })
export class ProducerEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => MovieEntity, (movie) => movie.producers)
  movies: MovieEntity[];
}
