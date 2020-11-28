const router = require('express').Router();
const {User} = require('../db/models');

function isAdmin(req, res, next) {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).send("You don't have permission to view this page.");
  }
}

router.post('/', async (req, res, next) => {
  try {
    console.log('server received post signup request');
    const user = await User.create(req.body);
    req.login(user, (err) => (err ? next(err) : res.json(user)));
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      res.status(401).send('User already exists');
    } else {
      next(err);
    }
  }
});

router.get('/', isAdmin, async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'firstName', 'lastName', 'email', 'isAdmin'],
    });
    res.json(users);
  } catch (err) {
    next(err);
  }
});

router.get('/:userId', isAdmin, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.userId, {
      attributes: [
        'firstName',
        'lastName',
        'email',
      ],
    });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

router.put('/:userId', isAdmin, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.userId);
    await User.update(req.body);
    res.json(user);
  } catch (err) {
    next(err);
  }
});

module.exports = router;