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
  var user = req.session.user;
  User.findById(user._id, function(err, user){
    res.render('game', {
      color: user.color,
      lastthrow: new Date(user.lastthrow),
    })
  })
})


router.post('/', function (req, res) {
  var user = req.session.user,
      userColor = user.color,
      atkdid = req.body['atkdid[]'],
      los = Math.floor((Math.random() * 20) + 1),
      time = new Date()
  if(typeof(atkdid)==="undefined"){var atkdid = ['0']};


  Hex.find({'color': userColor}, function(err, userHexes){
    jsonfile.readFile(datafile, function(err, obj){
      Hex.findById(atkdid[0], function(err, atkdhexid){
        User.findById(user._id, function(err, userid){

          //TIME CHECK
          var lastthrow = userid.lastthrow;
          var timecheck = false;
          var posttime = new Date();
          if((posttime - lastthrow) > 8*3600*1000){
            timecheck = true;
          }

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
            timeupdate();
          }

          var timeupdate = function(){
            userid.lastthrow = posttime;
            userid.save();
            servrespond();
          }

          var servrespond = function(){
            req.flash("success", "WSZYSTKO OK, WYRZUCIŁEŚ:"+(los));
            res.send('done')
          }
          
          
          if (atkdid.length == 20 && checked && timecheck){
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