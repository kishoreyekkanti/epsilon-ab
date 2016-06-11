var dbCommon = require(global._ROOT + '/db/pgsql/db_common');
var epsTestsQuery = require(global._ROOT + '/db/queries/eps_tests');

exports.findTestByName = function (testName) {
    return fetchTestByName(testName)
        .then(function (data) {
            if (!data || data.length === 0) {
                return null;
            }
            return data;
        });
};

exports.create = function (epsTest) {
    var query = epsTestsQuery.createEpsTestQuery();
    var options = {
        test_name: epsTest.data.test_name,
        test_description: epsTest.data.test_description,
        option_no: epsTest.data.option_no,
        weightage: epsTest.data.weightage,
        auto_optimise: epsTest.data.auto_optimise,
        status: epsTest.data.status
    };
    return dbCommon.executeQuery(query, options);
};

exports.findTestByIdAndOptionNumber = function (id, optionNumber) {
    var query = epsTestsQuery.findEpsTestByIdAndOptionNumber();
    var options = {
        id: id,
        option_no: optionNumber
    };
    return dbCommon.executeQueryAndFindOne(query, options);
};

exports.findTestById = function (id) {
    var query = epsTestsQuery.findTestById();
    return dbCommon.executeQueryAndFindOne(query, id)
};

exports.findAll = function () {
    var query = epsTestsQuery.findAllQuery(); //you are screwed if you are running these many tests
    return dbCommon.executeQuery(query);
};

exports.update = function (epsTest) {
    var query = epsTestsQuery.updateEPSTest();
    var options = {
        test_description: epsTest.test_description,
        auto_optimise: epsTest.auto_optimise,
        status: epsTest.status,
        epsTestId: epsTest.id,
        option_no: epsTest.option_no,
        weightage: epsTest.weightage
    };
    return dbCommon.executeQuery(query, options);
};

exports.findCTR = function (test_name, option_no) {
    var query = epsTestsQuery.findCTR();
    var options = getQueryOptionsFor(test_name, option_no);
    return dbCommon.executeQueryAndFindOne(query, options);
};

exports.findConversionStats = function (test_name, option_no) {
    var query = epsTestsQuery.stats();
    var options = getQueryOptionsFor(test_name, option_no);
    return dbCommon.executeQueryAndFindOne(query, options);
};

var fetchTestByName = function (testName) {
    var query = epsTestsQuery.findTestByNameAndStatus();
    var options = {
        testName: testName,
        status: 'active'
    };
    return dbCommon.executeQuery(query, options);
};

function getQueryOptionsFor(test_name, option_no) {
    return {
        test_name: test_name,
        option_no: option_no
    };
}
