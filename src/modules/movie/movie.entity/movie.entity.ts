import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { StudioEntity } from '../../studio/studio.entity/studio.entity';
import { ProducerEntity } from '../../producer/producer.entity/producer.entity';

@Entity({ name: 'movies' })
export class MovieEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  year: number;

  @Column({ default: false })
  winner: boolean;

  @ManyToMany(() => StudioEntity, (studio) => studio.movies)
  @JoinTable()
  studios?: StudioEntity[];

  @ManyToMany(() => ProducerEntity, (producer) => producer.movies)
  @JoinTable()
  producers?: ProducerEntity[];
}
