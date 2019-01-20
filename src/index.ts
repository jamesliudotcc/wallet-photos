// Express required Imports
import * as express from 'express';
import * as bodyParser from 'body-parser';
const flash = require('connect-flash');
import * as methodOverride from 'method-override';
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

createConnection({
  type: 'postgres',
  host: 'localhost',
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  port: Number(process.env.POSTGRES_PORT),
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
      session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
      })
    );
    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(methodOverride('_method'));

    // Expose Auth routes before all other
    // Middlewares run
    app.get('/', (req, res) => {
      res.render('home', { alerts: req.flash() });
    });

    app.use('/auth', require('./controllers/auth'));

    app.use(function(req, res, next) {
      if (!req.isAuthenticated()) {
        req.flash('error', 'Please log in or sign up.');
        res.redirect('/');
      }
      next();
    });
    app.use(express.static('static'));

    /* ****************************************
    //              Routes
    ******************************************/

    app.use('/photos', require('./controllers/photos'));
    app.use('/upload', require('./controllers/upload'));
    app.use('/comment', require('./controllers/comment'));
    app.use('/heart', require('./controllers/heart'));
    app.use('/admin', require('./controllers/admin'));

    /* ****************************************
    //              Listen
    ******************************************/

    app.listen(process.env.PORT || 3000, () => {
      console.log('Listening');
    });
  })
  .catch(error => {
    console.log(error);
  });
