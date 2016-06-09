var ctr = require(global._ROOT + '/db/pgsql/ctr');
var errorHandler = require(global._ROOT + '/controllers/eps_options/error_handler');
var epsTestProbability = require(global._ROOT + '/db/pgsql/eps_test_probability');

exports.put = function (req, res) {
    if (req.body.user_unique_id) {
        epsTestProbability.fetchProbabilityByUserUniqueId(req.body.user_unique_id)
            .then(function (testProbability) {
                if (!testProbability) {
                    res.send(400, {"response": "user_unique_id not found"});
                }
                ctr.reward(req.body.user_unique_id, testProbability.test_name, testProbability.option_no)
                    .then(function (response) {
                        res.send(200, {"response": "reward updated"})
                    })
            })
            .catch(function (err) {
                errorHandler.sendErrorResponse(res, err);
            });
    } else {
        res.send(400, {"response": "user_unique_id is required"});
    }
};