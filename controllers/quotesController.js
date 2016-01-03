var settings = require('../utilities/settings')();

var quotesController = function () {
    /**
     * generates data based on the query, provided in the settings
     */
    var generateData = function () {
        var query = settings.generateSettings.query;
        var testData = JSON.parse(query);

        for (var i = 0; i < testData.query.results.row.length; i++) {
            var date = new Date();
            var rnd = getRandomInt(90, 110) / 100;

            var vol = parseFloat(obj.query.results.row[i].col1);

            var result = (vol * rnd ).toFixed(3);

            testData.query.results.row[i].col1 = result;
            testData.query.results.row[i].col2 = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();

            if (testData.query.results.row[i].col5)
                testData.query.results.row[i].col4 = (vol - result).toFixed(2);

            // volume
            vol = parseFloat(testData.query.results.row[i].col8);
            if (vol == 0) {
                vol = 100;
            }

            result = (vol * rnd).toFixed(0);
            testData.query.results.row[i].col8 = result;
        }

        return testData;
    };

    var getStaticQuotes = function (interval) {
        setInterval(function () {
            var data = generateData();
            //todo: get io
            io.sockets.emit("stockquotes", data);
        }, interval)
    };

    var getSocketQuotes = function (req, res) {
    };

    /**
     * makes use of https://www.npmjs.com/package/node-xhr as an XMLHttpRequest wrapper, using a callback instead of an
     * eventListener, provided by the standard XMLHttpRequest. The standard can be used by executing the following:
     *
     * https://developer.mozilla.org/en/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest, The first code snippet
     * demonstrates the usage of a simple request.
     *
     * The settings specified in the "header" field will tell the request to retrieve data in JSON format, so no additional
     * need to parse the results is required, otherwise JSON.parse had to be called.
     *
     * @param req, the express request object
     * @param res, the express response object
     */
    var getAjaxQuotes = function (req, res) {
        var xhr = require('node-xhr');

        xhr.get({
            url: settings.ajaxSettings.url,
            headers: {
                'Content-Type': 'application/json'
            }
        }, function (err, res) {
            console.log(res);
        });
    };

    /**
     * Returns a random integer between min (inclusive) and max (inclusive)
     * Using Math.round() will give you a non-uniform distribution!
     */
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    return {
        getSocketQuotes: getSocketQuotes,
        getAjaxQuotes: getAjaxQuotes
    };
};

module.exports = quotesController;