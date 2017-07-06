var express = require('express'),
  router = express.Router(),
  Hex = require('../models/hex'),
  Engine = require('../models/engine'),
  User = require('../models/user'),
  jsonfile = require('jsonfile'),
  datafile = './public/javascripts/data.json'

router.get('/', function (req, res) {
  if (!req.session.user) {
    return res.redirect('../');
  };
  Engine.findOne().lean().exec(function (err, turn) {
    var user = req.session.user;
    var ifnotturn = User.findOne({
      '_id': turn.turn
    }, function (err, ifnotturn) {
      res.render('game', {
        user: user._id,
        turn: turn.turn,
        ifnotturn: ifnotturn.color,
        color: user.color
      })
    })
  })
});


router.post('/', function (req, res) {
  var user = req.session.user,
      userColor = user.color,
      atkdid = req.body['atkdid[]'],
      los = Math.floor((Math.random() * 20) + 1)
  if(typeof(atkdid)==="undefined"){var atkdid = ['0']};


  Hex.find({'color': userColor}, function(err, userHexes){
    Engine.findById("593efd484d43218f3197065a", function (err, turn) {
      jsonfile.readFile(datafile, function(err, obj){
        Hex.findById(atkdid[0], function(err, atkdhexid){

          //NGHBRS CHECK:
          var checked = false;
          for(var i = 0; i < userHexes.length; i++){
            for(var j = 0; j < 6; j++){
              if (userHexes[i].nghbrs[j][0] == atkdhexid.coords[0] && userHexes[i].nghbrs[j][1] == atkdhexid.coords[1]){
                checked = true;
              }
            }
          }

          //ALL CHECK
          var dbchange = function(){
            for(var i = 0; i < los; i++){
              Hex.findById(atkdid[i], function(err, hex){
                  hex.color = userColor;
                  hex.save();
              });
              obj[atkdid[i]].color = userColor;
            };
            jsonupdate();
          }
          var jsonupdate = function jsonupdate(){
            jsonfile.writeFileSync(datafile, obj);
            turnchange();
          }
          var turnchange = function(){
            if(turn.turn == 5){
              turn.turn = 1;
            } else {
              turn.turn += 1;
            }
            turn.save();
            servrespond();
          }
          var servrespond = function(){
            req.flash("success", "WSZYSTKO OK, WYRZUCIŁEŚ:"+(los));
            res.send('done')
          }
          
          
          if (user._id == turn.turn && atkdid.length == 20 && checked){
            dbchange();

          } else {
              req.flash("danger", "Coś poszło nie tak, spróbuj jeszcze raz...");
              res.send('err');
          };
        });
      });
    });
  });
});

module.exports = router;