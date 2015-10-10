var logger = require(global._ROOT + '/log/logger');
var ctr = require(global._ROOT + '/db/pgsql/ctr');
var errorHandler = require(global._ROOT + '/controllers/eps_options/error_handler');

exports.put = function (req, res) {
    if (req.body.testName && req.body.optionNumber && req.body.userUniqueId) {
        ctr.reward(req.body.userUniqueId, req.body.testName, req.body.optionNumber)
            .then(function (response) {
                res.send(200, {"response": "reward updated"})
            })
            .catch(function (err) {
                errorHandler.sendErrorResponse(res, err);
            });
    } else {
        res.send(400, {"response": "One (or) all of 'testName, optionNumber and userUniqueId' are missing"});
    }
};