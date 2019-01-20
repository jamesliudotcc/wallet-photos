import * as express from 'express';
import * as passport from '../config/passportConfig';
import * as validator from 'validator';

import { getRepository, getManager } from 'typeorm';
import { User } from '../entity/User';

const router = express.Router();
const userRepository = getRepository(User);
const manager = getManager();

router.get('/signup', (req, res) => {
  res.render('auth/signup', { previousData: null, alerts: req.flash() });
});

router.get('/login', (req, res) => {
  res.render('auth/login', { alerts: req.flash() });
});

router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'You logged out. Bye!');
  res.redirect('/');
});

router.get('/pending', (req, res) => {
  res.render('auth/pending', { previousData: null, alerts: req.flash() });
});

router.post('/signup', async (req, res, next) => {
  if (req.body.password != req.body.password2) {
    req.flash('error', 'Passwords must match');
    res.redirect('/');
    return;
  }
  const existingUser = await userRepository.findOne({
    email: req.body.email,
  });
  if (existingUser) {
    req.flash('error', 'Email already in use');
    res.redirect('/');
    return;
  }

  let numberOfAdmins = await userRepository.count({
    where: { admin: true },
  });
  let numberOfContrib = await userRepository.count({
    where: { contrib: true },
  });
  let numberOfApproved = await userRepository.count({
    where: { approved: true },
  });

  const user = await manager.create(User, {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    admin: numberOfAdmins ? false : true,
    contrib: numberOfContrib >= 2 ? false : true,
    family: false,
    approved: numberOfApproved >= 2 ? false : true,
    getEmails: false,
  });
  await manager.save(user);

  req.flash('success', 'Yay good job, you signed up!');

  req.logIn(user, err => {
    if (err) {
      req.flash('error', 'Something went wrong with signup, please try again.');
      res.redirect('/');
    } else {
      //@ts-ignore
      passport.authenticate('local', {
        successRedirect: '/photos',
        successFlash: 'Yay, login successful!',
        failureRedirect: '/',
        failureFlash: 'Invalid Credentials',
      })(req, res, next);
    }
  });
});

router.post(
  '/login',
  //@ts-ignore
  passport.authenticate('local', {
    successRedirect: '/photos',
    successFlash: 'Yay, login successful!',
    failureRedirect: '/',
    failureFlash: 'Invalid Credentials',
  })
);
module.exports = router;
