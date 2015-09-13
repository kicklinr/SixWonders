var express = require('express');
var router = express.Router();
var middleware = require('./middleware');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.all('/citation', function(req, res, next) {
    middleware.citationViolationList(req, res, function(){
      console.log(res.citations);
      if(req.query.json) {
        res.json(res.citations);
      } else {
        res.render('citation', {
          citations: res.citations,
          totalFines: res.totalFines
        });
      }
    });
});

module.exports = router;
