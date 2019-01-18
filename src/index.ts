// Express required Imports
import * as express from 'express';
import * as bodyParser from 'body-parser';
const flash = require('connect-flash');
const passport = require('./config/passportConfig');
import * as session from 'express-session';
require('dotenv').config();

// DB requried imports
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { Photo } from './entity/Photo';
import { User } from './entity/User';
import { Comment } from './entity/Comment';
import { Heart } from './entity/Heart';

// End of upload required packages

// Constants:

// Connect Database through TypeORM

createConnection({
  type: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'docker',
  port: 5430,
  database: 'walletphotos',
  entities: [Photo, User, Comment, Heart],
  synchronize: true,
  logging: false,
})
  .then(async connection => {
    let photoRepository = connection.getRepository(Photo);

    /* ****************************************
    //              Initialize App
    ******************************************/

    const app = express();
    app.set('view engine', 'pug');

    /* ****************************************
    //              Middlewares
    ******************************************/

    app.use(
      bodyParser.urlencoded({
        extended: false,
      })
    );
    app.use(
      session({ secret: 'Secret', resave: false, saveUninitialized: true })
    );
    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());

    // Expose Auth routes before all other
    // Middlewares run
    app.get('/', (req, res) => {
      res.render('home', { alerts: req.flash() });
    });

    app.use('/auth', require('./controllers/auth'));

    // Refactor into Middlewares
    app.use(function(req, res, next) {
      if (!req.isAuthenticated()) {
        return res.redirect('/');
      }
      next();
    });
    app.use(express.static('static'));

    /* ****************************************
    //              Routes
    ******************************************/

    // Include Controllers
    app.use('/photos', require('./controllers/photos'));
    app.use('/upload', require('./controllers/upload'));
    app.use('/comment', require('./controllers/comment'));
    app.use('/heart', require('./controllers/heart'));
    app.use('/admin', require('./controllers/admin'));
    /* ****************************************
    //              Listen
    ******************************************/

    app.listen(3000, () => {
      console.log('Listening on Port 3000');
    });
  })
  .catch(error => {
    console.log(error);
  });
