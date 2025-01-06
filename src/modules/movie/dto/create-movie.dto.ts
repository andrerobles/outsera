import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsString,
  IsNumber,
} from 'class-validator';

export class CreateMovieDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @IsNotEmpty()
  year: number;

  @IsArray()
  @IsString({ each: true })
  studios: string[];

  @IsArray()
  @IsString({ each: true })
  producers: string[];

  @IsBoolean()
  winner: boolean;
}
