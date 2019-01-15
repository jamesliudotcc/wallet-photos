import * as express from 'express';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { Photo } from './entity/Photo';
import * as multer from 'multer';

const app = express();
app.set('view engine', 'pug');
app.use(express.static('static'));

const upload = multer({ dest: 'uploads/' });

createConnection({
  type: 'sqlite',
  database: './mydb.sqlite3',
  entities: [Photo],
  synchronize: true,
  logging: false,
})
  .then(async connection => {
    // work with entities

    // let photo = new Photo();
    // photo.name = 'Me and Bears';
    // photo.origUrl = 'photo-with-bears.jpg';

    // await connection.manager.save(photo);
    // console.log('Photo has been saved');

    let savedPhotos = await connection.manager.find(Photo);

    app.get('/', (req, res) => {
      res.render('home');
    });

    app.post('/upload', upload.single('file'), (req, res) => {
      if (!req.file.mimetype.startsWith('image/jpeg')) {
        return res.status(422).json({ error: 'Jpegs only plz' });
      }
      let photo = new Photo();
      photo.origUrl = req.file.path;
      return res.status(200).send(req.file);
    });

    app.listen(3000, () => {
      console.log('Listening on Port 3000');
    });
  })
  .catch(error => {
    console.log(error);
  });
