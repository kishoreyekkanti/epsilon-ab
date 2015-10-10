var epsTestProbability = require(global._ROOT + '/db/pgsql/eps_test_probability');
var errorHandler = require(global._ROOT + '/controllers/eps_options/error_handler');

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