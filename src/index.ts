import * as express from 'express';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { Photo } from './entity/Photo';
import * as multer from 'multer';
import * as sharp from 'sharp';

const upload = multer({ dest: 'uploads/' });

// Constants:

const STATIC_PHOTOS = '/static/photos/';

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
      res.send('OK');
    });

    app.get('/upload', (req, res) => {
      res.render('upload');
    });

    app.post('/upload', upload.single('file'), async (req, res) => {
      if (!req.file.mimetype.startsWith('image/jpeg')) {
        return res.status(422).json({ error: 'Jpegs only plz' });
      }

      let photo = new Photo();
      photo.origUrl = req.file.path;

      let newSavedPhoto = await photoRepository.save(photo);

      let photoToUpdate = await photoRepository.findOne(newSavedPhoto.id);
      if (photoToUpdate) {
        photoToUpdate.smUrl = `${newSavedPhoto.id}-sm.jpg`;
        photoToUpdate.mdUrl = `${newSavedPhoto.id}-md.jpg`;
        photoToUpdate.lgUrl = `${newSavedPhoto.id}-lg.jpg`;
        await photoRepository.save(photoToUpdate);
      } // See if this can be re-written using try-catch?
      // Fix async behavior where return happens before update.

      /*
      let savedPhotos = await photoRepository.find(); 
      This await goes iwth the async in the app.post, use
      similar logic to poll db before showing all the uploaded photos
      */

      createSizes(req.file.path, String(photo.id));

      return await res.status(200).send(photo);
    });

    app.get('/photos', async (req, res) => {
      let allPhotos = await photoRepository.find();
      console.log(allPhotos);
      res.json(
        allPhotos
          .filter(photo => {
            if (photo.smUrl) {
              return photo.smUrl;
            }
          })
          .map(photo => ({
            smUrl: STATIC_PHOTOS + photo.smUrl,
            mdUrl: STATIC_PHOTOS + photo.mdUrl,
            lgUrl: STATIC_PHOTOS + photo.lgUrl,
          }))
      );
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
