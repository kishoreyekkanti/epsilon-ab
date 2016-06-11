var epsTestProbability = require(global._ROOT + '/db/pgsql/eps_test_probability');
var errorHandler = require(global._ROOT + '/controllers/eps_options/error_handler');
var EPSTest = require(global._ROOT + '/model/eps_test');
var epsTestDbHandler = require(global._ROOT + '/db/pgsql/eps_tests');
var Promise = require('bluebird');

exports.userConverted = function (req, res) {
    if (req.body.user_unique_id) {
        epsTestProbability.fetchProbabilityByUserUniqueId(req.body.user_unique_id)
            .then(function (testProbability) {
                if (!testProbability) {
                    res.send(400, {"response": "user_unique_id not found"});
                }
                return epsTestProbability.updateConversion(req.body.user_unique_id, testProbability.test_name, testProbability.option_no)
                    .then(function (response) {
                        res.send(200, {"response": "conversion updated"})
                    })
            })
            .catch(function (err) {
                errorHandler.sendErrorResponse(res, err);
            });

    } else {
        res.send(400, {"response": "user_unique_id is required"});
    }
};

exports.create = function (req, res) {
    var epsTestDetails = req.body;
    if (epsTestDetails.options && epsTestDetails.options.length > 0) {
        Promise.each(epsTestDetails.options,
            function (option) {
                var epsTest = buildEpsTest(epsTestDetails, option);
                return epsTestDbHandler.create(epsTest);
            })
            .then(function () {
                res.send(201, {"response": "Saved the AB tests successfully"})
            })
            .catch(function (err) {
                errorHandler.sendErrorResponse(res, err);
            });
    } else {
        res.send(400, {"response": "Test options are mandatory"});
    }
};

exports.findById = function (req, res) {
    var testId = req.params.id;
    if (testId) {
        epsTestDbHandler.findTestById(testId)
            .then(function (epsTest) {
                if (!epsTest) {
                    return res.send(500, {"response": "Unable to find a test for id " + testId});
                }
                return res.send(200, epsTest);
            })
            .catch(function (err) {
                errorHandler.sendErrorResponse(res, err);
            })
    } else {
        res.send(400, {"response": "Test id is missing"});
    }
};

exports.findAll = function (req, res) {
    epsTestDbHandler.findAll()
        .then(function (epsTests) {
            return res.send(200, epsTests);
        })
        .catch(function (err) {
            errorHandler.sendErrorResponse(res, err);
        })
};

exports.update = function (req, res) {
    var testId = req.params.id;
    var optionNumber = req.params.optionNumber;
    if (testId && optionNumber) {
        var options = req.body.options;
        epsTestDbHandler.findTestByIdAndOptionNumber(testId, optionNumber)
            .then(function (epsTest) {
                if (!epsTest) {
                    return res.send(500, {"response": "Unable to find a test for id " + testId + " and option number " + optionNumber});
                }
                epsTest.weightage = options.weightage ? options.weightage : epsTest.weightage;
                epsTest.auto_optimise = options.auto_optimise && [true, false].indexOf(options.auto_optimise) > -1 ? options.auto_optimise : epsTest.auto_optimise;
                epsTest.status = options.status ? options.status : epsTest.status;
                epsTest.test_description = options.test_description ? options.test_description : epsTest.test_description;
                return epsTestDbHandler.update(epsTest)
                    .then(function (updateStatus) {
                        res.send(200, {"response": "Eps option updated successfully"})
                    });
            })
            .catch(function (err) {
                errorHandler.sendErrorResponse(res, err);
            })
    } else {
        res.send(400, {"response": "Test Id or Option Number is missing"});
    }

};

exports.stats = function (req, res) {
    var testName = req.params.name;
    epsTestDbHandler.findTestByName(testName)
        .then(function (epsTests) {
            if (!epsTests) {
                return res.send(500, {"response": "Unable to find a test for id " + testName});
            }
            var stats = initialiseStats(epsTests);
            var statsPromises = [];
            stats.options.forEach(function (option) {
                statsPromises.push(fetchStats(testName, option));
            });
            return Promise.all(statsPromises)
                .then(function (results) {
                    var statsHash = {};
                    statsHash.test_name = testName;
                    statsHash.options = results;
                    res.send(200, statsHash);
                });
        })
        .catch(function (err) {
            errorHandler.sendErrorResponse(res, err);
        })
};

function buildEpsTest(epsTestDetails, option) {
    return new EPSTest(
        {
            test_name: epsTestDetails.test_name,
            option_no: option.option_no,
            weightage: option.weightage,
            auto_optimise: option.auto_optimise,
            status: option.status,
            test_description: option.test_description
        }
    );
}

function initialiseStats(epsTests) {
    var stats = {};
    stats.options = [];
    epsTests.forEach(function (epsTest) {
        stats.test_name = epsTest.test_name;
        var optionHash = {
            option_no: epsTest.option_no,
            weightage: epsTest.weightage,
            auto_optimise: epsTest.auto_optimise,
            status: epsTest.status,
            test_description: epsTest.test_description
        };
        stats.options.push(optionHash);
    });
    return stats;
}

function fetchStats(testName, option) {
    var stats = {};
    return epsTestDbHandler.findCTR(testName, option.option_no)
        .then(function (epsTestCTR) {
            stats.option_no = option.option_no;
            stats.trial = epsTestCTR ? epsTestCTR.trial : 0;
            stats.reward = epsTestCTR ? epsTestCTR.reward : 0;
            stats.weightage = option.weightage;
            stats.auto_optimise = option.auto_optimise;
            stats.status = option.status;
            stats.test_description = option.test_description;
            return stats;
        }).then(function (ctrStats) {
            return epsTestDbHandler.findConversionStats(testName, option.option_no)
                .then(function (conversionStats) {
                    ctrStats.conversion = conversionStats ? conversionStats.conversion : 0;
                    return ctrStats;
                });
        });
}
