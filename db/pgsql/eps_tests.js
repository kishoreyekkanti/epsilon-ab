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

exports.create = function(epsTest) {
    var query = "insert into eps_tests(test_name, test_description, option_no, weightage, auto_optimise, status) \
                 values\
                 (${test_name}, ${test_description}, ${option_no}, ${weightage}, ${auto_optimise}, ${status})";
    var options = {
        test_name: epsTest.data.test_name,
        test_description: epsTest.data.test_description,
        option_no: epsTest.data.option_no,
        weightage: epsTest.data.weightage,
        auto_optimise: epsTest.data.auto_optimise,
        status: epsTest.data.status
    };
    return dbCommon.dbQuery(query, options);
};

var fetchTestByName = function (testName) {
    var query = "select * from eps_tests where test_name=$1";
    return dbCommon.dbQuery(query, testName);
};

