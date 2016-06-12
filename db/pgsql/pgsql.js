var pgp = require('pg-promise')();
var db = pgp(global.DB_CONFIG["pgsql"]);

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

var findOne = function (query, options) {
    return dbQuery(query, options)
        .then(function (data) {
            if (!data || data.length === 0) {
                return null;
            }
            return data[0];
        });
};

var getOptions = function (userUniqueId, testName, optionNumber) {
    return {
        userUniqueId: userUniqueId,
        testName: testName,
        optionNumber: optionNumber
    };
};

var haveAllRequiredTables = function () {
    var query = "select * from pg_tables where schemaname='public' and tablename in('eps_tests','eps_greedy_ctr','eps_test_probability')"
    return dbQuery(query, {});
};
module.exports = {
    dbQuery: dbQuery,
    findOne: findOne,
    getOptions: getOptions,
    haveAllRequiredTables: haveAllRequiredTables
};
