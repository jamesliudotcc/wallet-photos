import * as passport from 'passport';
import * as passportLocal from 'passport-local';
import { getRepository } from 'typeorm';
import { User } from '../entity/User';

const LocalStrategy = passportLocal.Strategy;

passport.serializeUser<any, any>((user, callback) => {
  callback(null, user.id);
});

passport.deserializeUser((id, callback) => {
  const userRepo = getRepository(User);
  const user = userRepo.findOne({ where: { id: id } });
  if (user) {
    callback(null, user);
  } else {
    callback(null, {});
  }
});

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
    },
    async (email, password, callback) => {
      //Still need to create User model from entity
      try {
        const foundUser = await getRepository(User).findOne({
          where: { email: email },
        });
        if (!foundUser || !foundUser.validPassword(password)) {
          // bad
          console.log('bad credentials');
          callback(null, null);
        } else {
          // good
          callback(null, foundUser);
        }
      } catch (callback) {
        console.log(callback);
      }
    }
  )
);

module.exports = passport;
