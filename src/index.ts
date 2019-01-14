import * as express from 'express';

const app = express();

app.set('view engine', 'pug');

app.get('/', (req, res) => {
  res.send('OK');
});

app.listen(3000, () => {
  console.log('Listening on Port 3000');
});
