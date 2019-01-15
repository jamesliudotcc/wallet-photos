import * as express from 'express';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { Photo } from './entity/Photo';
import * as multer from 'multer';
import * as sharp from 'sharp';

const upload = multer({ dest: 'uploads/' });
createConnection({
  type: 'sqlite',
  database: './mydb.sqlite3',
  entities: [Photo],
  synchronize: true,
  logging: false,
})
  .then(async connection => {
    let photoRepository = connection.getRepository(Photo);

    const app = express();
    app.set('view engine', 'pug');
    app.use(express.static('static'));

    app.get('/', (req, res) => {
      res.render('home');
    });

    app.post('/upload', upload.single('file'), async (req, res) => {
      if (!req.file.mimetype.startsWith('image/jpeg')) {
        return res.status(422).json({ error: 'Jpegs only plz' });
      }

      let photo = new Photo();
      photo.origUrl = req.file.path;

      await photoRepository.save(photo);

      let savedPhotos = await photoRepository.find();
      console.log('All photos from the db:', savedPhotos);

      createSizes(req.file.path, String(photo.id));

      return res.status(200).send(photo);
    });
    app.listen(3000, () => {
      console.log('Listening on Port 3000');
    });
  })
  .catch(error => {
    console.log(error);
  });

// Helper functions

function createSizes(imagePath: string, imageNumber: string) {
  const SIZES = [
    { name: 'sm', width: 512, quality: 80 },
    { name: 'md', width: 1024, quality: 80 },
    { name: 'lg', width: 2048, quality: 60 },
  ];
  SIZES.forEach(size => {
    sharp(imagePath)
      .jpeg({ quality: size.quality })
      .rotate()
      .resize(size.width)
      .toFile(`static/photos/${imageNumber}-${size.name}.jpg`, err => {
        if (err) {
          console.log(err);
        }
      });
  });
}
