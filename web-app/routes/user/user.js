const express = require('express');

const router = express.Router();
const { ObjectId } = require('mongoose').Types;
const middleware = require('../middleware/auth');
const { authTypeEmail } = require('../auth/authType');
const User = require('../../models/user');
const bcrypt = require('bcryptjs');

router.post('/update-email', middleware.isAuthenticated, async (req, res) => {
  const { authType } = req.decoded;
  let user;

  try {
    if (authType === authTypeEmail) {
      user = await User.findOneAndUpdate({
        _id: new ObjectId(req.decoded.id),
      }, {
        $set: { email: req.body.email },
      }, { returnOriginal: false });
    } else {
      user = await User.findOneAndUpdate({
        _id: new ObjectId(req.decoded.id),
      }, {
        $set: { email: req.body.email },
      }, { returnOriginal: false });
    }
    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error,
    });
  }
});

router.post('/update-password', middleware.isAuthenticated, async (req, res) => {
  const { authType } = req.decoded;
  if (authType === authTypeEmail) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);
    try {
      const user = await User.findOneAndUpdate({
        _id: new ObjectId(req.decoded.id),
      }, { $set: { password: hash } })

      if (user) {
        res.json({
          success: true,
        });
      }
    } catch (error) {
      res.json({
        success: false,
        message: error,
      });
    }
  }
  else {
    res.json({
      success: false,
      message: 'Only can change password using email authentication',
    });
  }
});

router.get('/retrieve-user', middleware.isAuthenticated, async (req, res) => {
  const { authType } = req.decoded;
  let user;
  try {
    if (authType === authTypeEmail) {
      user = await User.findOne({
        _id: new ObjectId(req.decoded.id),
      });
    } else {
      user = await User.findOne({
        [authType]: req.decoded.id,
      });
    }
    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error,
    });
  }
});


router.post('/update-balance', middleware.isAuthenticated, async (req, res) => {
  const { authType } = req.decoded;
  let user;

  try {
    if (authType === authTypeEmail) {
      user = await User.findOneAndUpdate({
        _id: new ObjectId(req.decoded.id),
      }, {
        $inc: { accountBalance: (req.body.topUpAmount) / 100 },
      }, { returnOriginal: false });
    } else {
      user = await User.findOneAndUpdate({
        [authType]: req.decoded.id,
      }, {
        $inc: { accountBalance: (req.body.topUpAmount) / 100 },
      }, { returnOriginal: false });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error,
    });
  }
});

module.exports = router;
