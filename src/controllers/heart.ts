import * as express from 'express';
import { getRepository } from 'typeorm';
import { Heart } from '../entity/Heart';
import { User } from '../entity/User';

const router = express.Router();
const heartRepository = getRepository(Heart);

router.post('/', async (req, res) => {
  const existingHeart = await heartRepository.findOne({
    user: req.body.userId,
    photo: req.body.photoId,
  });

  if (existingHeart) {
  } else {
    let heart = new Heart();
    heart.photo = req.body.photoId;
    heart.user = req.body.userId;

    await heartRepository.save(heart);
  }
  res.redirect('/photos');
});

module.exports = router;
