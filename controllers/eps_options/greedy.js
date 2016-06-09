var epsTests = require(global._ROOT + '/db/pgsql/eps_tests.js');
var epsTestProbability = require(global._ROOT + '/db/pgsql/eps_test_probability');
var Promise = require('bluebird');

exports.guessOption = function (userUniqueId, testName) {
    return epsTests.findTestByName(testName)
        .then(function (data) {
            if (!data) {
                return data;
            }
            return selectOption(data)
                .then(function (response) {
                    return response;
                });
        })
};

var selectOption = function (testData) {
    var weightHash = {};
    var totalConversion = 0;
    var conversionPromises = [];
    testData.forEach(function (test) {
        conversionPromises.push(
            epsTestProbability.getConversionCountFor(test.test_name, test.option_no)
                .then(function (results) {
                    totalConversion += test.weightage;
                    if (test.auto_optimise) {
                        //10 is the multiplication factor to give more credit to high converted test.
                        totalConversion += results && results[0] && results[0].totalconversioncount ? results[0].totalconversioncount * 10 : 0;
                    }
                    weightHash[test.option_no] = totalConversion;
                    return weightHash;
                })
        );
    });
    return Promise.all(conversionPromises)
        .then(function (results) {
            return getOptionNumberBasedOnWeightage(results[0], totalConversion);
        });
};

var getOptionNumberBasedOnWeightage = function (weightage, totalConversion) {
    var selectedWeight = getRandomIntInclusive(0, totalConversion);
    var sortedKeys = Object.keys(weightage).sort();
    for (var i = 0; i < sortedKeys.length; i++) {
        if (weightage[sortedKeys[i]] >= selectedWeight) {
            return sortedKeys[i];
        }
    }
};

var getRandomIntInclusive = function (low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
};