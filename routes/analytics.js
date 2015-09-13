var express = require('express');
var router = express.Router();
var fs = require('fs');
var middleware = require('./middleware');

var obj;

router.all('/', function(req, res, next) {
  fs.readFile('public/geo/courts.geojson', handleFile);

  function handleFile(err, data) {
    if (err) throw err
    obj = JSON.parse(data)

    console.log("Done loading file.")
    
    function getAverages() {
      console.log("getting averages");

      middleware.averageExperienceList(req, res, function() {
        console.log("got averages!!!");
        console.log(res.averages);

        res.render('analytics', { title: 'Analytics',
          geojson : obj,
          averages : res.averages
        });
      });
    }

    getAverages();
  }

});

module.exports = router;
