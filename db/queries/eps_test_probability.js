var dbCommon = require(global._ROOT + '/db/pgsql/db_common');

exports.createUserOption = function () {
    var pgQuery = "insert into eps_test_probability(user_unique_id, test_name, option_no) \
                 values\
                 (${user_unique_id}, ${test_name}, ${option_no})";
    var mysqlQuery = "insert into eps_test_probability(user_unique_id, test_name, option_no) \
                 values\
                 (?, ?, ?)";
    return dbCommon.getQuery(pgQuery, mysqlQuery);
};

exports.updateConversion = function () {
    var pgQuery = "update eps_test_probability set conversion = conversion + 1 where \
                 user_unique_id=${userUniqueId} and test_name=${testName} and option_no=${optionNumber}";
    var mysqlQuery = "update eps_test_probability set conversion = conversion + 1 where \
                 user_unique_id=? and test_name=? and option_no=?";

    return dbCommon.getQuery(pgQuery, mysqlQuery);
};

exports.fetchProbabilityByUserUniqueId = function () {
    var pgQuery = "select * from eps_test_probability  where user_unique_id=${unique_id}";
    var mysqlQuery = "select * from eps_test_probability  where user_unique_id=?";
    return dbCommon.getQuery(pgQuery, mysqlQuery);
};

exports.fetchConversionCount = function () {
    var pgQuery = "select test_name, option_no, count(*) as totalConversionCount from eps_test_probability \
                 where test_name=${name} and option_no=${optionNumber} and conversion > 0 group by test_name, option_no";
    var mysqlQuery = "select test_name, option_no, count(*) as totalConversionCount from eps_test_probability \
                 where test_name=? and option_no=? and conversion > 0 group by test_name, option_no";
    return dbCommon.getQuery(pgQuery, mysqlQuery);
};

exports.fetchTestProbability = function () {
    var pgQuery = "select * from eps_test_probability etp  where test_name=${name} and user_unique_id=${unique_id}";
    var mysqlQuery = "select * from eps_test_probability etp  where test_name=? and user_unique_id=?";
    return dbCommon.getQuery(pgQuery, mysqlQuery);
};