var dbCommon = require(global._ROOT + '/db/pgsql/db_common');

exports.findAllQuery = function () {
    var query = "select * from eps_tests order by id desc limit 5000";
    return dbCommon.getQuery(query, query);
};

exports.createEpsTestQuery = function () {

    var pgQuery = "insert into eps_tests(test_name, test_description, option_no, weightage, auto_optimise, status) \
                 values\
                 (${test_name}, ${test_description}, ${option_no}, ${weightage}, ${auto_optimise}, ${status})";

    var mysqlQuery = "insert into eps_tests(test_name, test_description, option_no, weightage, auto_optimise, status) \
                 values\
                 (?, ?, ?, ?, ?, ?)";
    return dbCommon.getQuery(pgQuery, mysqlQuery);
};

exports.findEpsTestByIdAndOptionNumber = function () {
    var pgQuery = "select * from eps_tests where id = ${id} and option_no = ${option_no}";
    var mysqlQuery = "select * from eps_tests where id = ? and option_no = ?";
    return dbCommon.getQuery(pgQuery, mysqlQuery);
};

exports.findTestById = function () {
    var pgQuery = "select * from eps_tests where id = $1";
    var mysqlQuery = "select * from eps_tests where id = ?";
    return dbCommon.getQuery(pgQuery, mysqlQuery);
};

exports.updateEPSTest = function () {
    var pgQuery = "update eps_tests set weightage = ${weightage}, \
                 test_description = ${test_description}, auto_optimise = ${auto_optimise}, status = ${status}, \
                 updated_at = current_timestamp where id = ${epsTestId} and option_no = ${option_no} ";
    var mysqlQuery = "update eps_tests set weightage = ?, \
                 test_description = ?, auto_optimise = ?, status = ?, \
                 updated_at = current_timestamp where id = ? and option_no = ? ";
    return dbCommon.getQuery(pgQuery, mysqlQuery);
};

exports.findCTR = function () {
    var pgQuery = "select test_name, option_no, sum(trial) as trial, sum(reward) as reward from eps_greedy_ctr \
                 where test_name = ${test_name} and option_no = ${option_no} group by test_name, option_no";
    var mysqlQuery = "select test_name, option_no, sum(trial) as trial, sum(reward) as reward from eps_greedy_ctr \
                 where test_name = ? and option_no = ? group by test_name, option_no";
    return dbCommon.getQuery(pgQuery, mysqlQuery);
};

exports.stats = function () {
    var pgQuery = "select test_name, option_no, sum(conversion) as conversion from eps_test_probability \
             where test_name = ${test_name} and option_no = ${option_no} group by test_name, option_no";
    var mysqlQuery = "select test_name, option_no, sum(conversion) as conversion from eps_test_probability \
             where test_name = ? and option_no = ? group by test_name, option_no";
    return dbCommon.getQuery(pgQuery, mysqlQuery);
};

exports.findTestByNameAndStatus = function () {
    var pgQuery = "select * from eps_tests where test_name=${testName} and status = ${status}";
    var mysqlQuery = "select * from eps_tests where test_name=? and status = ?";
    return dbCommon.getQuery(pgQuery, mysqlQuery);
};