import * as express from 'express';
import * as passport from '../config/passportConfig';

const router = express.Router();

router.get('/signup', (req, res) => {
  //@ts-ignore
  res.render('auth/signup', { previousData: null });
});
router.get('/login', (req, res) => {
  //@ts-ignore
  res.render('auth/login');
});

router.post('/signup', (req, res) => {
  res.send(req.body);
});

router.post('/login', (req, res) => {
  res.send(req.body);
});
module.exports = router;
