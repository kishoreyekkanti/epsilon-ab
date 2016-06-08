var epsTestProbability = require(global._ROOT + '/db/pgsql/eps_test_probability');
var errorHandler = require(global._ROOT + '/controllers/eps_options/error_handler');
var EPSTest = require(global._ROOT + '/model/eps_test');
var epsTestDbHandler = require(global._ROOT + '/db/pgsql/eps_tests');
var Promise = require('bluebird');

exports.userConverted = function (req, res) {
    if (req.body.testName && req.body.optionNumber && req.body.userUniqueId) {
        epsTestProbability.updateConversion(req.body.userUniqueId, req.body.testName, req.body.optionNumber)
            .then(function (response) {
                res.send(200, {"response": "conversion updated"})
            })
            .catch(function (err) {
                errorHandler.sendErrorResponse(res, err);
            });
    } else {
        res.send(400, {"response": "One (or) all of 'testName, optionNumber and userUniqueId' are missing"});
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
                res.send(201, {"response": "saved the eps tests"})
            })
            .catch(function (err) {
                errorHandler.sendErrorResponse(res, err);
            });
    } else {
        res.send(400, {"response": "test options are missing"});
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
                epsTest.auto_optimise = options.auto_optimise ? options.auto_optimise : epsTest.auto_optimise;
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
