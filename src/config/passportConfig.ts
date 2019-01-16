import * as passport from 'passport';
import * as passportLocal from 'passport-local';

import { default as User } from '../entity/User';
import { Request, Response, NextFunction } from 'express';

const LocalStrategy = passportLocal.Strategy;

passport.serializeUser<any, any>((user, callback) => {
  callback(null, user.id);
});
/*
passport.deserializeUser((id, callback) => {
  //Still need to create User model from entity
  User.findById(id, (err, user))
    .findByPk(id)
    .then(user => {
      callback(null, user);
    })
    .catch(err => {
      callback(err, null);
    });
});

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    },
    (email, password, callback) => {
      //Still need to create User model from entity
      User.findOne({
        where: { username: username },
      })
        .then(foundUser => {
          // if I didn't find a valid user, and that user's password hash doesn't matches a hash
          if (!foundUser || !foundUser.validPassword(password)) {
            // bad
            console.log('bad credentials');
            callback(null, null);
          } else {
            // good
            console.log('good user');
            callback(null, foundUser);
          }
        })
        .catch(callback);
    }
  )
);
*/
module.exports = passport;
