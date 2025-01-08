import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { MovieService } from '../src/modules/movie/movie.service';
import { AppModule } from '../src/app.module';
import { ProducerService } from '../src/modules/producer/producer.service';
import { ProducerEntity } from 'src/modules/producer/producer.entity/producer.entity';

describe('App E2E Tests', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(MovieService)
      .useValue({
        getAllMovies: jest.fn().mockResolvedValue([]),
        createMovie: jest.fn().mockImplementation(() => ({
          id: 1,
          title: 'The Godfather',
          year: 1972,
          studios: [
            {
              id: 1,
              name: 'Paramount Pictures',
            },
          ],
          producers: [
            {
              id: 1,
              name: 'Albert S. Ruddy',
            },
          ],
          winner: true,
        })),
        onModuleInit: jest.fn(),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  // ProducerController Tests
  describe('ProducerController', () => {
    it('/producers (GET) - deve retornar uma lista vazia inicialmente', async () => {
      const response = await request(app.getHttpServer())
        .get('/producers')
        .expect(200);
      expect(response.body).toEqual([]);
    });
    it('/producers/interval (GET) - deve retornar um intervalo vazio', async () => {
      const response = await request(app.getHttpServer())
        .get('/producers/interval')
        .expect(200);

      expect(response.body).toHaveProperty('min');
      expect(response.body).toHaveProperty('max');
    });
  });

  // StudioController Tests
  describe('StudioController', () => {
    it('/studios (GET) - deve retornar uma lista vazia inicialmente', async () => {
      const response = await request(app.getHttpServer())
        .get('/studios')
        .expect(200);
      expect(response.body).toEqual([]);
    });
  });

  // MovieController Tests
  describe('MovieController', () => {
    it('/movies (GET) - deve retornar uma lista vazia inicialmente', async () => {
      const response = await request(app.getHttpServer())
        .get('/movies')
        .expect(200);
      expect(response.body).toEqual([]);
    });
  });

  describe('MovieController - Inserção de dados', () => {
    let app: INestApplication;

    beforeAll(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

      app = moduleFixture.createNestApplication();
      await app.init();
    });

    it('/movies (POST) - deve criar um novo filme com sucesso', async () => {
      const movieDto = {
        title: 'The Lord of the Rings',
        year: 2001,
        studios: ['New Line Cinema'],
        producers: ['Peter Jackson'],
        winner: false,
      };

      const response = await request(app.getHttpServer())
        .post('/movies')
        .send(movieDto)
        .expect(201);

      expect(response.body.title).toBe(movieDto.title);
      expect(response.body.year).toBe(movieDto.year);
      expect(response.body.studios[0].name).toBe(movieDto.studios[0]);
      expect(response.body.producers[0].name).toBe(movieDto.producers[0]);
      expect(response.body.winner).toBe(movieDto.winner);
    });

    it('/movies (POST) - deve retornar erro ao tentar criar um filme duplicado', async () => {
      const movieDto = {
        title: 'The Godfather',
        year: 1972,
        studios: ['Paramount Pictures'],
        producers: ['Albert S. Ruddy'],
        winner: true,
      };

      // Criar o filme pela primeira vez
      await request(app.getHttpServer())
        .post('/movies')
        .send(movieDto)
        .expect(201);

      // Tentativa de criar o mesmo filme novamente
      const response = await request(app.getHttpServer())
        .post('/movies')
        .send(movieDto)
        .expect(409); // Código HTTP 409: Conflict

      expect(response.body.message).toBe('Filme já existe');
      expect(response.body.statusCode).toBe(409);
    });
  });

  describe('ProducerController com dados mockados', () => {
    const mockProducers: ProducerEntity[] = [
      {
        id: 1,
        name: 'Allan Carr',
        movies: [
          {
            id: 1,
            title: "Can't Stop the Music I",
            year: 1988,
            winner: true,
          },
          {
            id: 30,
            title: "Can't Stop the Music II",
            year: 1989,
            winner: true,
          },
        ],
      },
      {
        id: 2,
        name: 'Albert S. Ruddy',
        movies: [
          {
            id: 19,
            title: 'Megaforce',
            year: 1982,
            winner: true,
          },
          {
            id: 27,
            title: 'Cannonball Run II',
            year: 1983,
            winner: true,
          },
        ],
      },
      {
        id: 3,
        name: 'Yoram Globus and Menahem Golan',
        movies: [
          {
            id: 22,
            title: 'Hercules',
            year: 1980,
            winner: true,
          },
          {
            id: 39,
            title: 'Cobra',
            year: 2000,
            winner: true,
          },
        ],
      },
      {
        id: 4,
        name: 'Jerry Weintraub',
        movies: [
          {
            id: 2,
            title: 'Cruising',
            year: 2000,
            winner: true,
          },
          {
            id: 52,
            title: 'The Karate Kid Part III',
            year: 2020,
            winner: true,
          },
        ],
      },
    ];

    beforeAll(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      })
        .overrideProvider(MovieService)
        .useValue({
          onModuleInit: jest.fn(),
        })
        .compile();

      const producerService =
        moduleFixture.get<ProducerService>(ProducerService);
      jest
        .spyOn(producerService, 'getAllProducers')
        .mockResolvedValue(mockProducers);

      app = moduleFixture.createNestApplication();
      await app.init();
    });

    it('/producers (GET) - deve retornar uma lista de produtores', async () => {
      const response = await request(app.getHttpServer())
        .get('/producers')
        .expect(200);

      // Valida que todos os produtores da base mockada foram retornados
      expect(response.body).toEqual([
        {
          id: 1,
          name: 'Allan Carr',
          movies: [
            {
              id: 1,
              title: "Can't Stop the Music I",
              year: 1988,
              winner: true,
            },
            {
              id: 30,
              title: "Can't Stop the Music II",
              year: 1989,
              winner: true,
            },
          ],
        },
        {
          id: 2,
          name: 'Albert S. Ruddy',
          movies: [
            {
              id: 19,
              title: 'Megaforce',
              year: 1982,
              winner: true,
            },
            {
              id: 27,
              title: 'Cannonball Run II',
              year: 1983,
              winner: true,
            },
          ],
        },
        {
          id: 3,
          name: 'Yoram Globus and Menahem Golan',
          movies: [
            {
              id: 22,
              title: 'Hercules',
              year: 1980,
              winner: true,
            },
            {
              id: 39,
              title: 'Cobra',
              year: 2000,
              winner: true,
            },
          ],
        },
        {
          id: 4,
          name: 'Jerry Weintraub',
          movies: [
            {
              id: 2,
              title: 'Cruising',
              year: 2000,
              winner: true,
            },
            {
              id: 52,
              title: 'The Karate Kid Part III',
              year: 2020,
              winner: true,
            },
          ],
        },
      ]);
    });

    it('/producers/interval (GET) - deve retornar o intervalo de produtores premiados', async () => {
      const response = await request(app.getHttpServer())
        .get('/producers/interval')
        .expect(200);

      // Valida as propriedades min e max
      expect(response.body).toHaveProperty('min');
      expect(response.body).toHaveProperty('max');

      // Valida o intervalo esperado com base na base mockada
      expect(response.body.min).toEqual([
        {
          producer: 'Allan Carr',
          previousWin: 1988,
          followingWin: 1989,
          interval: 1,
        },
        {
          producer: 'Albert S. Ruddy',
          previousWin: 1982,
          followingWin: 1983,
          interval: 1,
        },
      ]);
      expect(response.body.max).toEqual([
        {
          producer: 'Yoram Globus and Menahem Golan',
          previousWin: 1980,
          followingWin: 2000,
          interval: 20,
        },
        {
          producer: 'Jerry Weintraub',
          previousWin: 2000,
          followingWin: 2020,
          interval: 20,
        },
      ]);
    });
  });
});
