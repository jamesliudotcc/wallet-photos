import * as express from 'express';
import * as multer from 'multer';
import * as sharp from 'sharp';

import { getRepository } from 'typeorm';
import { Photo } from '../entity/Photo';
import { User } from '../entity/User';

const router = express.Router();
const photoRepository = getRepository(Photo);
const userRepository = getRepository(User);
const upload = multer({ dest: 'uploads/' });

router.get('/', async (req, res) => {
  if (req.session) {
    let user = await userRepository.findOne(req.session.passport.user);
    if (user.contrib) {
      res.render('upload/upload', {
        alerts: req.flash(),
        user: { password: '', ...user },
      });
    } else {
      req.flash('error', 'Not approved to add photos');
      res.redirect('/photos');
    }
  }
});

router.post('/', upload.single('file'), async (req, res) => {
  if (!req.file.mimetype.startsWith('image/jpeg')) {
    return res.status(422).json({ error: 'Jpegs only plz' });
  }
  if (req.session) {
    let user = await userRepository.findOneOrFail(req.session.passport.user);
    await updateModelWithPhoto(req, user);
  }

  return await res.status(200).redirect('/upload');
  // Goes to upload instead of photos to give image processing a chance
});

async function updateModelWithPhoto(req, user) {
  let photo = new Photo();
  photo.origUrl = req.file.path;
  let newSavedPhoto = await photoRepository.save(photo);
  let photoToUpdate = await photoRepository.findOne(newSavedPhoto.id);
  if (photoToUpdate) {
    photoToUpdate.user = user.id;
    photoToUpdate.smUrl = `${newSavedPhoto.id}-sm.jpg`;
    photoToUpdate.mdUrl = `${newSavedPhoto.id}-md.jpg`;
    photoToUpdate.lgUrl = `${newSavedPhoto.id}-lg.jpg`;
    await photoRepository.save(photoToUpdate);
  } // See if this can be re-written using try-catch?
  // Fix async behavior where return happens before update.
  await createSizes(req.file.path, String(photo.id));
}

async function createSizes(imagePath: string, imageNumber: string) {
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
module.exports = router;
