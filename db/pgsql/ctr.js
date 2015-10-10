var dbCommon = require(global._ROOT + '/db/pgsql/pg_common');

exports.upsertCTR = function (userUniqueId, testName, optionNumber) {
    var query = "select * from eps_greedy_ctr where user_unique_id=${unique_id} and test_name=${testName} \
                 and option_no=${optionNumber}";
    var options = {
        unique_id: userUniqueId,
        testName: testName,
        optionNumber: optionNumber
    };
    return dbCommon.dbQuery(query, options)
        .then(function (res) {
            if (res && res.length === 1) {
                return updateCTRTrialById(res[0].id);
            } else if (res.length === 0) {
                return insertIntoCTR(userUniqueId, testName, optionNumber);
            }
        })
        .catch(function (err) {
            return err;
        });
};

exports.reward = function (userUniqueId, testName, optionNumber) {
    var query = "update eps_greedy_ctr set reward = reward + 1 where \
                    user_unique_id=${userUniqueId} and test_name=${testName} and option_no=${optionNumber}";
    return dbCommon.dbQuery(query, dbCommon.getOptions(userUniqueId, testName, optionNumber));
};

var updateCTRTrialById = function (id) {
    var query = "update eps_greedy_ctr set trial = trial + 1 where id=${id}";
    var options = {
        id: id
    };
    return dbCommon.dbQuery(query, options);
};

var insertIntoCTR = function (userUniqueId, testName, optionNumber) {
    var query = "insert into eps_greedy_ctr(user_unique_id, test_name, option_no, trial) values \
                 (${userUniqueId}, ${testName}, ${optionNumber}, 1)";
    return dbCommon.dbQuery(query, dbCommon.getOptions(userUniqueId, testName, optionNumber));
};
