var EPSTestProbability = require(global._ROOT + '/model/eps_test_probability');
var dbCommon = require(global._ROOT + '/db/pgsql/pg_common');

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
    var query = "insert into eps_test_probability(user_unique_id, test_name, option_no) \
                 values\
                 (${user_unique_id}, ${test_name}, ${option_no})";
    var options = {
        user_unique_id: userUniqueId,
        test_name: testName,
        option_no: optionNumber
    };
    return dbCommon.dbQuery(query, options);
};

exports.updateConversion = function(userUniqueId, testName, optionNumber){
    var query = "update eps_test_probability set conversion = conversion + 1 where \
                 user_unique_id=${userUniqueId} and test_name=${testName} and option_no=${optionNumber}";
    var options = {
        name: testName,
        optionNumber: optionNumber
    };

    return dbCommon.dbQuery(query, dbCommon.getOptions(userUniqueId, testName, optionNumber));
};

exports.fetchProbabilityByUserUniqueId = function(userUniqueId){
    var query = "select * from eps_test_probability  where user_unique_id=${unique_id}";
    var options = {
        unique_id: userUniqueId
    };
    return dbCommon.findOne(query, options);
};


var fetchConversionCount = function (testName, optionNumber) {
    var query = "select test_name, option_no, count(*) as totalConversionCount from eps_test_probability \
                 where test_name=${name} and option_no=${optionNumber}and conversion > 0 group by test_name, option_no";
    var options = {
        name: testName,
        optionNumber: optionNumber
    };
    return dbCommon.dbQuery(query, options);
};


var fetchTestProbability = function (userUniqueId, testName) {
    var query = "select * from eps_test_probability etp  where test_name=${name} and user_unique_id=${unique_id}";
    var options = {
        name: testName,
        unique_id: userUniqueId
    };
    return dbCommon.dbQuery(query, options);
};

var buildEpsTestProbability = function (testName, option, createdAt) {
    return new EPSTestProbability({testName: testName, option: option, createdAt: createdAt});
};

