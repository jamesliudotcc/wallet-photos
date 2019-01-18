import * as express from 'express';

import { getRepository } from 'typeorm';
import { User } from '../entity/User';

const router = express.Router();
const userRepository = getRepository(User);

router.get('/', async (req, res) => {
  let allUsers = await userRepository.find({ order: { id: 'ASC' } });
  res.render('admin/admin', { users: allUsers, alerts: req.flash() });
});

router.post('/', async (req, res) => {
  let user = await userRepository.findOne(req.body.userId);
  if (req.body.admin) {
    // Nice to have: Only allow deleting admin if
    user.admin = true;
  } else {
    user.admin = false;
  }
  if (req.body.contrib) {
    user.contrib = true;
  } else {
    user.contrib = false;
  }
  if (req.body.approved) {
    user.approved = true;
  } else {
    user.approved = false;
  }
  if (req.body.getEmails) {
    user.getEmails = true;
  } else {
    user.getEmails = false;
  }
  await userRepository.save(user);
  res.redirect('/admin');
});
module.exports = router;
