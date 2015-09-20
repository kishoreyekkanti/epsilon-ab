var pgp = require('pg-promise')();
var Promise = require('bluebird');
var cn = {
    host: 'localhost',
    port: 5432,
    database: 'eps',
    user: 'epsuser',
    password: 'epsuser'
};
var db = pgp(cn);


//var insertIntoDB = function (query, options) {
//    var query = "select * from eps_test_probability";
//    var options = {};
//    return new Promise(function (resolve, reject) {
//        db.query(query, options)
//            .then(function (data) {
//                resolve(data);
//            }, function (reason) {
//                reject(reason);
//            })
//            .done(function () {
//                pgp.end();
//            });
//    });
//};
//
//var inserted = insertIntoDB("", "");
//inserted.then(function (res) {
//    console.log(res[0].user_unique_id);
//});

var dbQuery = function (query, options) {
    return new Promise(function (resolve, reject) {
        db.query(query, options)
            .then(function (data) {
                return resolve(data);
            }, function (reason) {
                return reject(reason);
            })
            .done(function () {
                pgp.end();
            });
    });

};

dbQuery("select * from eps_tests where test_name=$1", "show_beta_navigation")
    .then(function(data){
        console.log(data);
    });

/////////////////////////////////////////////////
//// This is to show a complete test application;
/////////////////////////////////////////////////
//
//// Loading and initializing the library without options;
//// See also: https://github.com/vitaly-t/pg-promise#initialization-options
//var pgp = require('pg-promise')(/*options*/);
//
//// Database connection details;
//var cn = {
//    host: 'localhost', // 'localhost' is the default;
//    port: 5432, // 5432 is the default;
//    database: 'eps_options',
//    user: 'epsuser',
//    password: 'epsuser'
//};
//// You can check for all default values in:
//// https://github.com/brianc/node-postgres/blob/master/lib/defaults.js
//
//var db = pgp(cn); // database instance;
//
//db.query("select * from users where active=$1", true)
//    .then(function (data) {
//        console.log(data); // print data;
//    }, function (reason) {
//        console.log(reason); // print error;
//    })
//    .done(function () {
//        // If we do not close the connection pool when exiting the application,
//        // it may take 30 seconds (poolIdleTimeout) before the process terminates,
//        // waiting for the connection to expire in the pool.
//
//        // But if you normally just kill the process, then it doesn't matter.
//
//        pgp.end(); // closing the connection pool, to exit immediately.
//
//        // See also:
//        // https://github.com/vitaly-t/pg-promise#library-de-initialization
//    });
//
