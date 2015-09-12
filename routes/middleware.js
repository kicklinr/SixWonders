/**
 * This file contains the common middleware used routes.
 */

// Query Citations
exports.citationViolationList = function(req, res, next) {
    var query = req.pgQuery;
    var values = [req.body.lastName];
    var sqlBase = 
        'SELECT * FROM citations INNER JOIN violations ON ' +
        'citations.citation_number = violations.citation_number ' +
        'WHERE citations.last_name = $1::text';

    var count=2;

    console.log(req.body);

    if (typeof req.body.firstName != 'undefined' && req.body.firstName!== '') {
        values.push(req.body.firstName);
        sqlBase= sqlBase + " AND citations.first_name = $"+count+"::text";
        count = count +1;
    }
    else if(typeof req.body.dob != 'undefined' && req.body.dob!==''){
        values.push(req.body.dob);
        sqlBase= sqlBase + " AND citations.dob = $"+count+"::text";
        count = count +1;
    }
    else if(typeof req.body.driverLicense != 'undefined'&& req.body.driverLicense!==''){
        values.push(req.body.driverLicense);
        sqlBase= sqlBase + " AND citations.driverLicense = $"+count+"::text";
        count = count +1;
    }
    else if(typeof req.body.citationNum != 'undefined' && req.body.citationNum!==''){
        values.push(req.body.citationNum);
        sqlBase= sqlBase + " AND citations.citationNum = $"+count+"::text";
        count = count +1;
    }
    console.log(sqlBase);
    console.log(values);
    query(sqlBase, values, function(err, rows, result) {
        // format some dats and stuff.
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
        }
        res.citations = rows;
        console.log(err);
        next();
    });

}
