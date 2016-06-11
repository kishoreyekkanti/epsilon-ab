var mysqlConnectionPool;
var logger = require(global._ROOT + '/log/logger');
var dbConfig = global.DB_CONFIG["default"];
var pgsql = require(global._ROOT + '/db/pgsql/pgsql');
var mysqlClient = require(global._ROOT + '/db/pgsql/mysql_client');
var _ = require('underscore');

if (dbConfig['name'] === 'mysql') {
    mysqlConnectionPool = global._MYSQL_CONNECTION_POOL;
}

function mysqlExecuteWithPromise(query, options) {
    return new Promise(function (resolve, reject) {
        var preparedStatementValues = [];
        _.each(options, function (val) {
            preparedStatementValues.push(val);
        });
        var mysqlConnectionPool = global._MYSQL_CONNECTION_POOL;
        mysqlClient.executeQueryWithPromise(mysqlConnectionPool, query, preparedStatementValues, reject, resolve);
    });
}
var executeQuery = function (query, options) {
    if (dbConfig['name'] === 'pgsql') {
        return pgsql.dbQuery(query, options)
    } else if (dbConfig['name'] === 'mysql') {
        return mysqlExecuteWithPromise(query, options)
            .then(function (data) {
                return data;
            })
    } else {
        //throw exception
    }
};

var executeQueryAndFindOne = function (query, options) {
    if (dbConfig['name'] === 'pgsql') {
        return pgsql.findOne(query, options)
    } else if (dbConfig['name'] === 'mysql') {
        return mysqlExecuteWithPromise(query, options)
            .then(function (data) {
                return Array.isArray(data) && data.length > 0 ? data[0] : null;
            });
    } else {
        //throw exception
    }
};

var getOptions = function (userUniqueId, testName, optionNumber) {
    return {
        userUniqueId: userUniqueId,
        testName: testName,
        optionNumber: optionNumber
    };
};

var getQuery = function getQuery(pgQuery, mySqlQuery) {
    if (dbConfig['name'] === 'pgsql') {
        return pgQuery;
    } else if (dbConfig['name'] === 'mysql') {
        return mySqlQuery;
    }
};


module.exports = {
    executeQuery: executeQuery,
    executeQueryAndFindOne: executeQueryAndFindOne,
    getOptions: getOptions,
    getQuery: getQuery
};

