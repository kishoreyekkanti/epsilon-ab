var pgp = require('pg-promise')();
var Promise = require('bluebird');
var EPSTestProbability = require(global._ROOT + '/model/eps_test_probability');
var cn = {
    host: 'localhost',
    port: 5432,
    database: 'eps',
    user: 'epsuser',
    password: 'epsuser'
};
var db = pgp(cn);

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

exports.getTestProbability = function (userUniqueId, testName) {
    return fetchTestProbability(userUniqueId, testName)
        .then(function (data) {
            if (!data || data.length === 0) {
                return null;
            } else {
                return buildEpsTestProbability(testName, data[0].eps_option_no, data[0].created_at);
            }
        })
        .catch(function (err) {
            return err;
        });
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
    var query = "insert into eps_test_probability(user_unique_id, test_name, eps_option_no) \
                 values\
                 (${user_unique_id}, ${test_name}, ${eps_option_no})";
    var options = {
        user_unique_id: userUniqueId,
        test_name: testName,
        eps_option_no: optionNumber
    };
    return dbQuery(query, options);
};

exports.upsertCTR = function (userUniqueId, testName, optionNumber) {
    var query = "select * from eps_greedy_ctr where user_unique_id=${unique_id} and test_name=${testName} \
                 and option_no=${optionNumber}";
    var options = {
        unique_id: userUniqueId,
        testName: testName,
        optionNumber: optionNumber
    };
    return dbQuery(query, options)
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

var updateCTRTrialById = function (id) {
    var query = "update eps_greedy_ctr set trial = trial + 1 where id=${id}";
    var options = {
        id: id
    };
    return dbQuery(query, options);
};

var insertIntoCTR = function (userUniqueId, testName, optionNumber) {
    var query = "insert into eps_greedy_ctr(user_unique_id, test_name, option_no, trial) values \
                 (${userUniqueId}, ${testName}, ${optionNumber}, 1)";
    var options = {
        userUniqueId: userUniqueId,
        testName: testName,
        optionNumber: optionNumber
    };
    return dbQuery(query, options);
};

var fetchConversionCount = function (testName, optionNumber) {
    var query = "select test_name, eps_option_no, count(*) as totalConversionCount from eps_test_probability \
                 where test_name=${name} and eps_option_no=${optionNumber}and conversion > 0 group by test_name, eps_option_no";
    var options = {
        name: testName,
        optionNumber: optionNumber
    };
    return dbQuery(query, options);
};

var fetchTestByName = function (testName) {
    var query = "select * from eps_tests where test_name=$1";
    return dbQuery(query, testName);
};

var fetchTestProbability = function (userUniqueId, testName) {
    var query = "select * from eps_test_probability etp  where test_name=${name} and user_unique_id=${unique_id}";
    var options = {
        name: testName,
        unique_id: userUniqueId
    };
    return dbQuery(query, options);
};

var dbQuery = function (query, options) {
    return new Promise(function (resolve, reject) {
        db.query(query, options)
            .then(function (data) {
                return resolve(data);
            }, function (reason) {
                return reject(reason);
            })
            .done(function () {
                pgp.end();
            });
    });

};
var buildEpsTestProbability = function (testName, option, createdAt) {
    return new EPSTestProbability({testName: testName, option: option, createdAt: createdAt});
};