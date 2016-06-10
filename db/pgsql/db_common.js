var mysqlConnectionPool;
var logger = require(global._ROOT + '/log/logger');
var dbConfig = global.DB_CONFIG["default"];
var pgsql = require(global._ROOT + '/db/pgsql/pgsql');
var mysqlClient = require(global._ROOT + '/db/pgsql/mysql_client');

if (dbConfig['name'] === 'mysql') {
    mysqlConnectionPool = global._MYSQL_CONNECTION_POOL;
}

function mysqlExecuteWithPromise(query) {
    return new Promise(function (resolve, reject) {
        var mysqlConnectionPool = global._MYSQL_CONNECTION_POOL;
        mysqlClient.executeQueryWithPromise(mysqlConnectionPool, query, [], reject, resolve);
    });
}
var executeQuery = function (query, options) {
    if (dbConfig['name'] === 'pgsql') {
        return pgsql.dbQuery(query, options)
    } else if (dbConfig['name'] === 'mysql') {
        return mysqlExecuteWithPromise(query)
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
        return new Promise(function (resolve, reject) {
            var mysqlConnectionPool = global._MYSQL_CONNECTION_POOL;
            return mysqlClient.executeQueryWithPromise(mysqlConnectionPool, query, [], reject, resolve);
        });
    } else {
        //throw exception
    }
};

var getOptions = function (userUniqueId, testName, optionNumber) {
    if (dbConfig['name'] === 'pgsql') {
        return {
            userUniqueId: userUniqueId,
            testName: testName,
            optionNumber: optionNumber
        };
    } else if (dbConfig['name'] === 'mysql') {
        return new Promise(function (resolve, reject) {
            var mysqlConnectionPool = global._MYSQL_CONNECTION_POOL;
            return mysqlClient.executeQueryWithPromise(mysqlConnectionPool, query, [], reject, resolve);
        });
    } else {
        //throw exception
    }
};


module.exports = {
    executeQuery: executeQuery,
    executeQueryAndFindOne: executeQueryAndFindOne,
    getOptions: getOptions
};

