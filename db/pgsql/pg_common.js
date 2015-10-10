var pgp = require('pg-promise')();
var db = pgp(global.DB_CONFIG["pgsql"]);

exports.dbQuery = function (query, options) {
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

exports.getOptions = function (userUniqueId, testName, optionNumber) {
    return {
        userUniqueId: userUniqueId,
        testName: testName,
        optionNumber: optionNumber
    };
};
