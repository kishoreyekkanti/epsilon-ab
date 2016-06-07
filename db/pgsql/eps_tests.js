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

exports.create = function (epsTest) {
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

exports.findTestById = function (id, optionNumber) {
    var query = "select * from eps_tests where id = ${id} and option_no = ${option_no}";
    var options = {
        id: id,
        option_no: optionNumber
    };
    return dbCommon.dbQuery(query, options)
        .then(function (data) {
            if (!data || data.length === 0) {
                return null;
            }
            return data[0];
        });
};

exports.update = function (epsTest) {
    var query = "update eps_tests set weightage = ${weightage}, \
                 test_description = ${test_description}, auto_optimise = ${auto_optimise}, status = ${status}, \
                 updated_at = current_timestamp where id = ${epsTestId} and option_no = ${option_no} ";
    var options = {
        test_description: epsTest.test_description,
        auto_optimise: epsTest.auto_optimise,
        status: epsTest.status,
        epsTestId: epsTest.id,
        option_no: epsTest.option_no,
        weightage: epsTest.weightage
    };
    return dbCommon.dbQuery(query, options);
};
var fetchTestByName = function (testName) {
    var query = "select * from eps_tests where test_name=$1";
    return dbCommon.dbQuery(query, testName);
};

