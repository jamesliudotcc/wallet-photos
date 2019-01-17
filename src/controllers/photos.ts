import * as express from 'express';
import { getRepository } from 'typeorm';
import { Photo } from '../entity/Photo';

const router = express.Router();
let photoRepository = getRepository(Photo); // use const?

const STATIC_PHOTOS = '/photos/';

router.get('/', async (req, res) => {
  let allPhotos = await photoRepository.find();

  res.render('photos/photos', {
    // This should live in a function ?
    photos: [...allPhotos] // destructuring required for immutable
      .reverse()
      .filter(photo => {
        if (photo.smUrl) {
          return photo.smUrl;
        }
      })
      .map(photo => ({
        smUrl: STATIC_PHOTOS + photo.smUrl,
        mdUrl: STATIC_PHOTOS + photo.mdUrl,
        lgUrl: STATIC_PHOTOS + photo.lgUrl,
      })),
    alerts: req.flash(),
  });
});

router.get('/:idx', (req, res) => {
  res.send(`Got to photo number ${req.params.idx}`);
});

module.exports = router;
