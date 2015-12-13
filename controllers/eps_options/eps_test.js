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

};

exports.findAll = function (req, res) {

};

exports.update = function (req, res) {

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
