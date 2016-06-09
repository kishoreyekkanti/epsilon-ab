var logger = require(global._ROOT + '/log/logger');

exports.sendErrorResponse = function (res, err, message) {
    message = message || "some thing went wrong with the request";
    logger.error("Exception raised ", err);
    return res.send(500, {error: message});
};
