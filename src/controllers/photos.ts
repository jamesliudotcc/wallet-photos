import * as express from 'express';
import { getRepository } from 'typeorm';
import { Photo } from '../entity/Photo';
import { User } from '../entity/User';

const router = express.Router();
const photoRepository = getRepository(Photo);
const userRepository = getRepository(User);

const STATIC_PHOTOS = '/photos/';

router.get('/', async (req, res) => {
  let allPhotos = await photoRepository.find();
  if (req.session) {
    let user = await userRepository.findOne(req.session.passport.user);
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
          id: photo.id,
          comment: photo.comments,
        })),
      alerts: req.flash(),
      //@ts-ignore
      user: { name: user.name, id: user.id },
    });
  } else {
    // throw error;
  }
});

router.get('/:idx', (req, res) => {
  res.send(`Got to photo number ${req.params.idx}`);
});

module.exports = router;
