import * as express from 'express';
import { getRepository } from 'typeorm';
import { Comment } from '../entity/Comment';

const router = express.Router();
const commentRepository = getRepository(Comment);

router.post('/', async (req, res) => {
  let comment = new Comment();
  comment.photo = req.body.photoId;
  comment.user = req.body.userId;
  comment.comment = req.body.comment;

  await commentRepository.save(comment);
  res.redirect('/photos');
});

module.exports = router;
