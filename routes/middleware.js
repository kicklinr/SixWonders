/**
 * This file contains the common middleware used routes.
 */

// Query Citations
exports.averageExperienceList = function(req, res, next) {
    var query = req.pgQuery;
    var values = [];
    var sqlBase = 
       'select municipality, avg(experience_rating) as averageExperience ' + 
       'FROM court_feedback ' +
       'GROUP BY municipality';

    console.log(req.body);

    query(sqlBase, values, function(err, rows, result) {
        // format some dats and stuff.
        res.averages = rows;
        console.log(err);
        next();
    });
},


// Query Citations
exports.citationViolationList = function(req, res, next) {
    var query = req.pgQuery;
    // Hack to allow query from query string as well as post
    if (!req.body.lastName && req.query.lastName) {
      req.body = req.query;
    }
    var values = [req.body.lastName];
    var sqlBase = 
        'SELECT * FROM citations ' + 
        'LEFT OUTER JOIN violations ON ' +
        'citations.citation_number = violations.citation_number ' +
        'LEFT OUTER JOIN municiple ON ' +
        'upper(municiple.municipality) = upper(citations.court_location) ' +
        'WHERE upper(citations.last_name) = upper($1::text)';

    var count=2;

    console.log(req.body);

    if (typeof req.body.firstName != 'undefined' && req.body.firstName!== '') {
        values.push(req.body.firstName);
        sqlBase= sqlBase + " AND citations.first_name = $"+count+"::text";
        count = count +1;
    }
    
    if (typeof req.body.dob != 'undefined' && req.body.dob!==''){
       values.push(req.body.dob);
       sqlBase= sqlBase + " AND to_char(citations.date_of_birth, 'MM/DD/YYYY') = $"+count+"::text";
       count = count +1;
    }
    
    if (typeof req.body.driverLicense != 'undefined'&& req.body.driverLicense!==''){
       values.push(req.body.driverLicense);
       sqlBase= sqlBase + " AND citations.drivers_license_number = $"+count+"::text";
       count = count +1;
    }
    
    if (typeof req.body.citationNum != 'undefined' && req.body.citationNum!==''){
       values.push(req.body.citationNum);
       sqlBase= sqlBase + " AND citations.citation_number = $"+count+"::text";
       count = count +1;
    }

    console.log(sqlBase);
    console.log(values);
    query(sqlBase, values, function(err, rows, result) {
        // format some dats and stuff.

        if (rows != null) {
            for (var i=0; i < rows.length; i++) {
                var date = new String(rows[i].court_date);
                if (date != null) {
                    date = 
                        date.split(" ")[0] + " " + 
                        date.split(" ")[1] + " " +
                        date.split(" ")[2] + " " +
                        date.split(" ")[3];

                    rows[i].court_date = date;
                }

                date = new String(rows[i].citation_date);
                if (date != null) {
                    date = 
                        date.split(" ")[0] + " " + 
                        date.split(" ")[1] + " " +
                        date.split(" ")[2] + " " +
                        date.split(" ")[3];

                    rows[i].citation_date = date;
                }

                var total1 = new Number(0), total2 = new Number(0);     
                if (rows[i].fine_amount != null) {
                    total1 = new Number(rows[i].fine_amount.substring(1));
                }

                if (rows[i].court_cost != null) {
                    total2 = new Number(rows[i].court_cost.substring(1));
                }

                rows[i].total_cost = "$" + (total1 + total2).toFixed(2);

                rows[i].court_location_encoded = '';
                if (rows[i].court_address != null && rows[i].court_location) {
                    rows[i].court_address_encoded = encodeURIComponent(rows[i].court_address + ", " + rows[i].court_location);
                }
            }
        }

        res.citations = rows;
        console.log(err);
        next();
    });

}
