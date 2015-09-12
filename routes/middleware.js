/**
 * This file contains the common middleware used by your routes.
 *
 * Extend or replace these functions as your application requires.
 *
 * This structure is not enforced, and just a starting point. If
 * you have more middleware you may want to group it as separate
 * modules in your project's /lib directory.
 */

var _ = require('underscore'),
    querystring = require('querystring');


/**
    Initialises the standard view locals

    The included layout depends on the navLinks array to generate
    the navigation in the header, you may wish to change this array
    or replace it with your own templates / logic.
*/

// Query Citations
exports.citationViolationList = function(req, res, next) {
    var query = req.pgQuery;
    var values = [req.query.lastName];
    var sqlBase = 'SELECT * FROM citations INNER JOIN violations ON citations.citation_number = violations.citation_number WHERE citations.last_name = $1::text';

    var count=2;

    console.log(req.query);

    if(req.query.firstName!=null){
        values.push(req.query.firstName);
        sqlBase= sqlBase + " AND citations.first_name = $"+count+"::text";
        count = count +1;
    }
    else if(req.query.dob!=null){
        values.push(req.query.dob);
        sqlBase= sqlBase + " AND citations.dob = $"+count+"::text";
        count = count +1;
    }
    else if(req.query.driverLicense!=null){
        values.push(req.query.driverLicense);
        sqlBase= sqlBase + " AND citations.driverLicense = $"+count+"::text";
        count = count +1;
    }
    else if(req.query.citationNum!=null){
        values.push(req.query.citationNum);
        sqlBase= sqlBase + " AND citations.citationNum = $"+count+"::text";
        count = count +1;
    }
    console.log(sqlBase);
    console.log(values);
    query(sqlBase, values, function(err, rows, result) {
        res.citations = json(rows);
        console.log(err);
        next();
    });

}
