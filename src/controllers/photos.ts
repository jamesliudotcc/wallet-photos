import * as express from 'express';
import { getRepository, getConnection } from 'typeorm';
import { Photo } from '../entity/Photo';
import { User } from '../entity/User';

const router = express.Router();
const photoRepository = getRepository(Photo);
const userRepository = getRepository(User);

const STATIC_PHOTOS = '/photos/';

router.get('/', async (req, res) => {
  // res.send('Ok, you logged in');

  let allPhotos = await photoRepository.find({ order: { id: 'DESC' } });

  if (req.session) {
    const user = await userRepository.findOne(req.session.passport.user);
    res.render('photos/photos', {
      // This should live in a function ?
      photos: allPhotos
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
          comments: photo.comments,
          hideHeartButton: photo.hearts
            .map(heart => heart.user.id)
            .filter(a => a === user.id)
            .map(a => {
              // Give a literal true to Pug
              if (a === user.id) {
                return true;
              } else {
                return false;
              }
            }),
          hearts: photo.hearts.length,
        })),
      alerts: req.flash(),

      user: { password: '', ...user },
    });
  } else {
    // throw error;
  }
});

router.delete('/:idx', async (req, res) => {
  try {
    await getConnection()
      .createQueryBuilder()
      .delete()
      .from(Photo)
      .where('id = :id', { id: req.params.idx })
      .execute();

    await res.redirect('/photos');
  } catch {
    req.flash(
      'error',
      "Can't delete a photo someone commented on or hearted. This feature is coming soon. Sorry."
    );
    res.redirect('/photos');
  }

  res.send(`Delete photo number ${req.params.idx}`);
});

module.exports = router;
