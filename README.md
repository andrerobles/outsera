# Projeto API Nestjs Outsera

### 💻 Configurações

Esse projeto utiliza as seguintes versões

- Node v20.11.1
- NestJS v10.4.15

Esse projeto segue a especificação informada pela outsera.

### 🚀 Instalação / Configuração

Instalação do nestjs (Caso necessário)

```
npm install -g @nestjs/cli
```

Instalação das libs do projeto

```
npm install
```

### 📝 Detalhes

Utilizar o comando para subir o ambiente

```
nest start
```

Ou

```
npm run start
```

Ao subir o projeto é carregado automaticamente em memória os arquivos contidos no `.csv`.

Esse projeto contém testes automatizados de integração utilizando jest. Para executar é necessário rodar o comando:

```
npm run test:e2e
```

Por padrão o endereço da API é `localhost:3000`.

## As principais rotas são:

### Lista intervalo de produtores vencedores com intervalo de ano mínimo e maximo

GET /producers/interval

### Lista todos os filmes cadastrados

GET /movies

### Insere novos filmes, produtores e estudios

POST /movies --data {title, year, studios, producers, winner}

### Lista todos os produtores cadastrados

GET /producers

### Lista todos os estudios cadastrados

GET / studios
