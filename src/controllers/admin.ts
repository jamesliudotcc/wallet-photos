import * as express from 'express';

import { getRepository } from 'typeorm';
import { User } from '../entity/User';

const router = express.Router();
const userRepository = getRepository(User);

router.get('/', async (req, res) => {
  let allUsers = await userRepository.find({ order: { id: 'ASC' } });
  // console.log(req.session.passport.user);

  const currentUser = await userRepository.findOne({
    where: { id: req.session.passport.user },
  });

  if (currentUser.admin) {
    res.render('admin/admin', { users: allUsers, alerts: req.flash() });
  } else {
    req.flash('failure', 'Admin page is for admins only');
    res.redirect('/photos');
  }
});

router.post('/', async (req, res) => {
  let user = await userRepository.findOne(req.body.userId);
  let numberOfAdmins = await userRepository.count({ where: { admin: true } });
  if (req.body.admin) {
    user.admin = true;
  } else {
    // Nice to have: Only allow deleting admin if > 1 admin
    if (numberOfAdmins > 1) {
      user.admin = false;
    } else {
      req.flash('failure', "Can't unmake the only admin.");
    }
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
