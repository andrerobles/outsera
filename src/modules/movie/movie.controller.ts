import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieEntity } from './movie.entity/movie.entity';
import { CreateMovieDto } from './dto/create-movie.dto';

@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get()
  public async findAllMovies(): Promise<MovieEntity[]> {
    return this.movieService.getAllMovies();
  }

  // Rota POST para criar ou atualizar um filme
  @Post()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async createMovie(@Body() createMovieDto: CreateMovieDto) {
    const { title, year, studios, producers, winner } = createMovieDto;
    return this.movieService.createMovie(
      title,
      year,
      studios,
      producers,
      winner,
    );
  }
}
