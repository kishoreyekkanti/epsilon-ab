var dbConfig = global.DB_CONFIG["default"];
var dbName = dbConfig['name'];

exports.findAllQuery = function () {
    if (dbName === 'mysql') {
        return "select * from eps_tests order by id desc limit 5000";
    } else if (dbName === 'pgsql') {
        return "select * from eps_tests order by id desc limit 5000";
    }
};