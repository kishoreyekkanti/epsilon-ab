var dbCommon = require(global._ROOT + '/db/pgsql/db_common');

exports.upsertCTR = function () {
    var pgQuery = "select * from eps_greedy_ctr where user_unique_id=${unique_id} and test_name=${testName} \
                 and option_no=${optionNumber}";
    var mysqlQuery = "select * from eps_greedy_ctr where user_unique_id=? and test_name=? \
                 and option_no=?";
    return dbCommon.getQuery(pgQuery, mysqlQuery);
};

exports.reward = function () {
    var pgQuery = "update eps_greedy_ctr set reward = reward + 1 where \
                    user_unique_id=${userUniqueId} and test_name=${testName} and option_no=${optionNumber}";
    var mysqlQuery = "update eps_greedy_ctr set reward = reward + 1 where \
                    user_unique_id=? and test_name=? and option_no=?";
    return dbCommon.getQuery(pgQuery, mysqlQuery);
};

exports.updateCTRTrail = function () {
    var pgQuery = "update eps_greedy_ctr set trial = trial + 1 where id=${id}";
    var mysqlQuery = "update eps_greedy_ctr set trial = trial + 1 where id=?";
    return dbCommon.getQuery(pgQuery, mysqlQuery);
};

exports.insertIntoCTR = function () {
    var pgQuery = "insert into eps_greedy_ctr(user_unique_id, test_name, option_no, trial) values \
                 (${userUniqueId}, ${testName}, ${optionNumber}, 1)";
    var mysqlQuery = "insert into eps_greedy_ctr(user_unique_id, test_name, option_no, trial) values \
                 (?, ?, ?, 1)";
    return dbCommon.getQuery(pgQuery, mysqlQuery);
};