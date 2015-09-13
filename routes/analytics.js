var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('analytics', { title: 'Analytics' });
});

module.exports = router;
