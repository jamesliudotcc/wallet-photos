import * as express from 'express';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { Photo } from './entity/Photo';

const app = express();
app.set('view engine', 'pug');

createConnection({
  type: 'sqlite',
  database: 'test',
  entities: [Photo],
  synchronize: true,
  logging: false,
})
  .then(connection => {
    // work with entities

    app.get('/', (req, res) => {
      res.send('OK');
    });

    app.listen(3000, () => {
      console.log('Listening on Port 3000');
    });
  })
  .catch(error => {
    console.log(error);
  });
