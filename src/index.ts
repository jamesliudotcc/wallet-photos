// Express required Imports
import * as express from 'express';
import * as bodyParser from 'body-parser';
const flash = require('connect-flash');
const passport = require('./config/passportConfig');
import * as session from 'express-session';
require('dotenv').config();

// DB requried imports
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { Photo } from './entity/Photo';

// Upload requriements. These can go once upload
// is refactored out
import * as multer from 'multer';
import * as sharp from 'sharp';

const upload = multer({ dest: 'uploads/' });
// End of upload required packages

// Constants:

const STATIC_PHOTOS = '/photos/';

// Connect Database through TypeORM

createConnection({
  type: 'sqlite',
  database: './mydb.sqlite3',
  entities: [Photo],
  synchronize: true,
  logging: false,
})
  .then(async connection => {
    let photoRepository = connection.getRepository(Photo);

    /* ****************************************
    //              Initialize App
    ******************************************/

    const app = express();
    app.set('view engine', 'pug');

    /* ****************************************
    //              Middlewares
    ******************************************/

    app.use(express.static('static'));
    app.use(
      bodyParser.urlencoded({
        extended: false,
      })
    );
    app.use(
      session({ secret: 'Secret', resave: false, saveUninitialized: true })
    );
    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());

    /* ****************************************
    //              Routes
    ******************************************/

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

      createSizes(req.file.path, String(photo.id));

      return await res.status(200).send(photo);
    });

    // Include Controllers
    app.use('/photos', require('./controllers/photos'));
    app.use('/auth', require('./controllers/auth'));

    /* ****************************************
    //              Listen
    ******************************************/

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
