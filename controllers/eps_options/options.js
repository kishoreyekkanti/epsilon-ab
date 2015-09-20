var logger = require(global._ROOT + '/log/logger');
var epsTests = require(global._ROOT + '/db/pgsql/eps_tests');
var greedy = require(global._ROOT + '/controllers/eps_options/greedy');
exports.get = function (req, res) {
    if (!req.params.user_unique_id || !req.params.test_name) {
        return res.send({error: "require user unique id and test name"});
    }
    return getOrCreateOption(req, res);
};

var getOrCreateOption = function (req, res) {
    var userUniqueId = req.params.user_unique_id;
    var testName = req.params.test_name;
    epsTests.getTestProbability(userUniqueId, testName)
        .then(function (epsTestProbability) {
            if (!epsTestProbability) {
                greedy.guessOption(userUniqueId, testName)
                    .then(function (option) {
                        if (!option) {
                            res.status(500).send({error: "unable to generate an option"});
                        } else {
                            return option;
                        }
                    })
                    .then(function (option) {
                        epsTests.createUserOption(userUniqueId, testName, option)
                            .then(function (userOptionCreated) {
                                return epsTests.upsertCTR(userUniqueId, testName, option)
                            })
                            .then(function () {
                                res.send({testName: testName, option: option});
                            });

                        //create another api to update/increment reward
                    })
                    .catch(function (err) {
                        return err;
                    })

            } else {
                return epsTests.upsertCTR(userUniqueId, testName, epsTestProbability.data.option)
                    .then(function (response) {
                        res.send(epsTestProbability.data);
                    }
                );

            }

        })
        .catch(function (err) {
            console.log(err);
        });
};

