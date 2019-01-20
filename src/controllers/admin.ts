import * as express from 'express';

import { getRepository, getConnection } from 'typeorm';
import { User } from '../entity/User';

const router = express.Router();
const userRepository = getRepository(User);

router.get('/', async (req, res) => {
  const user = await userRepository.findOne(req.session.passport.user);
  const allUsers = await userRepository.find({ order: { id: 'ASC' } });

  const currentUser = await userRepository.findOne({
    where: { id: req.session.passport.user },
  });

  if (currentUser.admin) {
    res.render('admin/admin', {
      users: allUsers,
      user: { password: '', ...user },
      alerts: req.flash(),
    });
  } else {
    req.flash('error', 'Admin page is for admins only');
    res.redirect('/photos');
  }
});

router.post('/', async (req, res) => {
  let user = await userRepository.findOne(req.body.userId);
  let numberOfAdmins = await userRepository.count({ where: { admin: true } });
  if (req.body.admin) {
    user.admin = true;
  } else {
    if (numberOfAdmins > 1) {
      user.admin = false;
    } else {
      req.flash('error', "Can't unmake the only admin.");
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

router.delete('/:idx', async (req, res) => {
  try {
    await getConnection()
      .createQueryBuilder()
      .delete()
      .from(User)
      .where('id = :id', { id: req.params.idx })
      .execute();

    await res.redirect('/admin');
  } catch {
    req.flash('error', "Can't delete that user. Sorry");
    res.redirect('/admin');
  }
});

module.exports = router;
