var dbCommon = require(global._ROOT + '/db/pgsql/db_common');
var ctrQuery = require(global._ROOT + '/db/queries/ctr');

exports.upsertCTR = function (userUniqueId, testName, optionNumber) {
    var query = ctrQuery.upsertCTR();
    var options = {
        unique_id: userUniqueId,
        testName: testName,
        optionNumber: optionNumber
    };
    return dbCommon.executeQuery(query, options)
        .then(function (res) {
            if (res && res.length === 1) {
                return updateCTRTrialById(res[0].id);
            } else if (res == null || res.length === 0) {
                return insertIntoCTR(userUniqueId, testName, optionNumber);
            }
        })
        .catch(function (err) {
            return err;
        });
};

exports.reward = function (userUniqueId, testName, optionNumber) {
    var query = ctrQuery.reward();
    return dbCommon.executeQuery(query, dbCommon.getOptions(userUniqueId, testName, optionNumber));
};

var updateCTRTrialById = function (id) {
    var query = ctrQuery.updateCTRTrail();
    var options = {
        id: id
    };
    return dbCommon.executeQuery(query, options);
};

var insertIntoCTR = function (userUniqueId, testName, optionNumber) {
    var query = ctrQuery.insertIntoCTR();
    var options = dbCommon.getOptions(userUniqueId, testName, optionNumber);
    return dbCommon.executeQuery(query, options);
};
