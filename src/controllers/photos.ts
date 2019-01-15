import * as express from 'express';
import { getRepository } from 'typeorm';
import { Photo } from '../entity/Photo';

const router = express.Router();

router.get('/', (req, res) => {
  getRepository(Photo).then(async repository) =>{
  const photos = photoRepository.find({ select: ['smUrl'] });
  res.send(getRepository(Photo).count());}
});

router.get('/:idx', (req, res) => {
  res.send(`Got to photo number ${req.params.idx}`);
});

module.exports = router;
