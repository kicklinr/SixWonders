CREATE TABLE citations(ID SERIAL PRIMARY KEY, citation_number TEXT, citation_date TIMESTAMP, first_name TEXT, last_name TEXT, date_of_birth TIMESTAMP, defendant_address TEXT, defendant_city TEXT, defendant_state TEXT, drivers_license_number TEXT, court_date TIMESTAMP, court_location TEXT, court_address TEXT);

COPY citations FROM '/Users/david/Downloads/citations.csv' DELIMITER ',' CSV;

CREATE TABLE violations(id SERIAL PRIMARY KEY, citation_number TEXT, violation_number TEXT, violation_description TEXT, warrant_status TEXT, warrant_number TEXT, status TEXT, status_date TEXT, fine_amount TEXT, court_cost TEXT);

CREATE TABLE municiple(Municipality TEXT PRIMARY KEY
  ,municpalAddress   TEXT
  ,zipCode           TEXT
  ,municipalWebsite  TEXT
  ,municipalCourtUrl TEXT
  ,phoneNumber       TEXT
  ,paymentName       TEXT
  ,paymentURL        TEXT
  ,dressCode         TEXT
  ,fineSchedule      TEXT
);

CREATE TABLE ticket_feedback (
  ID SERIAL PRIMARY KEY,
  hashed_citation_number TEXT,
  age INTEGER,
  race TEXT,
  zip TEXT,
  incomeRange INTEGER,
  violation_description TEXT,
  municipality TEXT,
  optional_comment TEXT,
  experience_rating INTEGER
);

INSERT INTO ticket_feedback(hashed_citation_number, age, race, zip, incomeRange, violation_description, municipality, optional_comment, experience_rating)
VALUES ($1::text, $2::integer, $3::text, $4::text, $5::integer, $6::text, $7::text, $8::text, $9::integer);

CREATE TABLE court_feedback (
  ID SERIAL PRIMARY KEY,
  hashed_citation_number TEXT,
  age INTEGER,
  race TEXT,
  zip TEXT,
  incomeRange INTEGER,
  violation_description TEXT,
  municipality TEXT,
  checkin_time TIMESTAMP,
  appearance_time TIMESTAMP,
  attorney BOOLEAN,
  optional_comment TEXT,
  experience_rating INTEGER
);

CREATE TABLE income_ranges(
  id SERIAL PRIMARY KEY,
  lowerRange INTEGER,
  upperRange INTEGER,
  description TEXT
);

INSERT INTO income_ranges(lowerRange, upperRange, description)
VALUES(0, 20000, 'Less than $20,000');
INSERT INTO income_ranges(lowerRange, upperRange, description)
VALUES(20000, 34999, '$20,000 to $34,999');
INSERT INTO income_ranges(lowerRange, upperRange, description)
VALUES(35000, 49999, '$35,000 to $49,999');
INSERT INTO income_ranges(lowerRange, upperRange, description)
VALUES(35000, 49999, '$50,000 to $74,999');
INSERT INTO income_ranges(lowerRange, upperRange, description)
VALUES(75000, 99999, '$75,000 to $99,999');
INSERT INTO income_ranges(lowerRange, upperRange, description)
VALUES(75000, 99999, '$75,000 to $99,999');
INSERT INTO income_ranges(lowerRange, upperRange, description)
VALUES(100000, 149999, '$100,000 to $149,999');
INSERT INTO income_ranges(lowerRange, upperRange, description)
VALUES(150000, 999999, '$150,000 or more');
