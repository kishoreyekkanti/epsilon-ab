var dbCommon = require(global._ROOT + '/db/pgsql/pg_common');

exports.findTestByName = function (testName) {
    return fetchTestByName(testName)
        .then(function (data) {
            if (!data || data.length === 0) {
                return null;
            }
            return data;
        })
        .catch(function (err) {
            return err;
        })
};

var fetchTestByName = function (testName) {
    var query = "select * from eps_tests where test_name=$1";
    return dbCommon.dbQuery(query, testName);
};

