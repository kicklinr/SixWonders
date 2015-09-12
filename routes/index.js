var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.all('/citation', function(req, res, next) {
    console.log(req.query);
    res.render('citation', {
        query: req.query
    });
});

module.exports = router;
