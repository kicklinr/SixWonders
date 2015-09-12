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
      res.render('citation', {
        query: req.query
      });
    });
});

module.exports = router;
