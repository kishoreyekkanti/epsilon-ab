var logger = require(global._ROOT + '/log/logger');
var epsTestProbability = require(global._ROOT + '/db/pgsql/eps_test_probability');
var ctr = require(global._ROOT + '/db/pgsql/ctr');
var greedy = require(global._ROOT + '/controllers/eps_options/greedy');
var errorHandler = require(global._ROOT + '/controllers/eps_options/error_handler');

exports.get = function (req, res) {
    if (!req.params.user_unique_id || !req.params.test_name) {
        return res.send(500, {error: "require user unique id and test name"});
    }
    return getOrCreateOption(req, res);
};

var getOrCreateOption = function (req, res) {
    var userUniqueId = req.params.user_unique_id;
    var testName = req.params.test_name;
    epsTestProbability.getTestProbability(userUniqueId, testName)
        .then(function (epsTestProbability) {
            if (!epsTestProbability) {
                createOption(userUniqueId, testName, res);
            } else {
                upsertCTR(userUniqueId, testName, epsTestProbability, res);
            }

        })
        .catch(function (err) {
            errorHandler.sendErrorResponse(res, err);
        });
};
var upsertCTR = function (userUniqueId, testName, epsTestProbability, res) {
    ctr.upsertCTR(userUniqueId, testName, epsTestProbability.data.option)
        .then(function (response) {
            return res.send(200, epsTestProbability.data);

        }
    );
};

var createOption = function (userUniqueId, testName, res) {
    greedy.guessOption(userUniqueId, testName)
        .then(function (option) {
            if (!option) {
                return res.send(500, {error: "test name '"+testName+"' not found"});
            }
            epsTestProbability.createUserOption(userUniqueId, testName, option)
                .then(function (userOptionCreated) {
                    ctr.upsertCTR(userUniqueId, testName, option)
                        .then(function (response) {
                            return res.send(201, {testName: testName, option: option, createdAt: new Date()});

                        });
                })
        })
        .catch(function (err) {
            errorHandler.sendErrorResponse(res, err);
        })
};
