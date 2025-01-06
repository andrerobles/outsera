import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { MovieEntity } from '../../movie/movie.entity/movie.entity';

@Entity({ name: 'studios' })
export class StudioEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => MovieEntity, (movie) => movie.studios)
  movies: MovieEntity[];
}
