import * as express from 'express';
import * as passport from '../config/passportConfig';

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

router.post('/signup', async (req, res) => {
  if (req.body.password != req.body.password2) {
    req.flash('error', 'Passwords must match');
    res.render('auth/signup', { previousData: req.body, alerts: req.flash() });
  } else {
    const existingUser = await userRepository.findOne({
      email: req.body.email,
    });
    if (existingUser) {
      req.flash('error', 'Username already in use');
      res.render('auth/signup', {
        previousData: req.body,
        alerts: req.flash(),
      });
    } else {
      const user = manager.create(User, {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        admin: false,
        contrib: false,
        family: false,
        approved: false,
        getEmails: false,
      });
      manager.save(user);

      // await userRepository.insert({ //Keep this code to put into bug report
      // name: req.body.name,
      // email: req.body.email,
      // password: req.body.password,
      // admin: false,
      // contrib: false,
      // family: false,
      // approved: false,
      // getEmails: false,
      // });
      req.flash('success', 'Yay good job, you signed up!');
      res.redirect('/photos');
    }
  }
});

router.post(
  '/login',
  //@ts-ignore
  passport.authenticate('local', {
    successRedirect: '/photos',
    successFlash: 'Yay, login successful!',
    failureRedirect: '/auth/login',
    failureFlash: 'Invalid Credentials',
  })
);
module.exports = router;
