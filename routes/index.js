var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.all('/citation', function(req, res, next) {
    res.render('citation', {
        citation: req.body.citation,
        lastName: req.body.lastName
    });
});

module.exports = router;
