var express = require('express');
var router = express.Router();
var User = require('../models/user.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/', function (req, res) {
  var loginname = req.body.username;
  User.findOne({
    loginname: loginname
    }, function (err, user) {
    if (err) {
      console.log(err);
      return res.send('Błąd')
    }
    if (!user) {
      res.send('Nie znaleziono użytkownika')
    } else {
      req.session.user = user;
      return res.redirect('/game');
    }

  })
});

module.exports = router;
