var EPSTestProbability = require(global._ROOT + '/model/eps_test_probability');
var dbCommon = require(global._ROOT + '/db/pgsql/db_common');
var testProbabilityQuery = require(global._ROOT + '/db/queries/eps_test_probability');

exports.getTestProbability = function (userUniqueId, testName) {
    return fetchTestProbability(userUniqueId, testName)
        .then(function (data) {
            if (!data || data.length === 0) {
                return null;
            } else {
                return buildEpsTestProbability(testName, data[0].option_no, data[0].created_at);
            }
        })
};

exports.getConversionCountFor = function (testName, optionNumber) {
    return fetchConversionCount(testName, optionNumber)
        .then(function (data) {
            return data;
        })
        .catch(function (err) {
            return err;
        })
};

exports.createUserOption = function (userUniqueId, testName, optionNumber) {
    var query = testProbabilityQuery.createUserOption();
    var options = {
        user_unique_id: userUniqueId,
        test_name: testName,
        option_no: optionNumber
    };
    return dbCommon.executeQuery(query, options);
};

exports.updateConversion = function (userUniqueId, testName, optionNumber, userDomainId) {
    var query = testProbabilityQuery.updateConversion(userDomainId);
    var options = {
        userUniqueId: userUniqueId,
        testName: testName,
        optionNumber: optionNumber,
        userDomainId: userDomainId
    };
    return dbCommon.executeQuery(query, options);
};

exports.fetchProbabilityByUserUniqueId = function (userUniqueId) {
    var query = testProbabilityQuery.fetchProbabilityByUserUniqueId();
    var options = {
        unique_id: userUniqueId
    };
    return dbCommon.executeQueryAndFindOne(query, options);
};


var fetchConversionCount = function (testName, optionNumber) {
    var query = testProbabilityQuery.fetchConversionCount();
    var options = {
        name: testName,
        optionNumber: optionNumber
    };
    return dbCommon.executeQuery(query, options);
};

var fetchTestProbability = function (userUniqueId, testName) {
    var query = testProbabilityQuery.fetchTestProbability();
    var options = {
        name: testName,
        unique_id: userUniqueId
    };
    return dbCommon.executeQuery(query, options);
};

var buildEpsTestProbability = function (testName, option, createdAt) {
    return new EPSTestProbability({testName: testName, option: option, createdAt: createdAt});
};

