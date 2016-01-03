var settings = require('../utilities/settings')();

var quotesController = function () {
    var quotes = {};

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
        retrieveAjaxQuoteData(function (data) {
            res.json(data);
        });
    };

    var retrieveAjaxQuoteData = function (cb) {
        var xhr = require('node-xhr');

        xhr.get({
            url: 'https://query.yahooapis.com/v1/public/yql?q=' + settings.ajaxSettings.query,
            headers: {
                'Content-Type': 'application/json'
            }
        }, function (err, result) {
            parseQuotes(result.body.query.results.quote, function (parsedData) {
                cb(parsedData);
            });
        });
    };

    /**
     * Parse the quotes according to the retrieved JSON data, into a usable format
     *
     * @param data, raw JSON data to parse to quote "objects"
     * @param cb, callback function to call when data has been succesfully parsed
     */
    var parseQuotes = function (data, cb) {
        var quote;

        for (var i = 0; i < data.length; ++i) {
            quote = data[i].Symbol;

            quotes[quote] = data[i];
        }

        cb(quotes);
    };

    /**
     * Returns a random integer between min (inclusive) and max (inclusive)
     * Using Math.round() will give you a non-uniform distribution!
     */
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    var getQuotes = function (req, res) {
        var reqType = req.param('type');
        var data;

        if (reqType === 'ajax') {
            retrieveAjaxQuoteData(function (parsedData) {
                res.render('quotes', {quotes: parsedData});
            });
        } else if (reqType === 'generate') {
            data = getStaticQuotes();
        } else {
            data = getSocketQuotes(req, res);
        }
    };

    return {
        getSocketQuotes: getSocketQuotes,
        getAjaxQuotes: getAjaxQuotes,
        getQuotes: getQuotes
    };
};

module.exports = quotesController;