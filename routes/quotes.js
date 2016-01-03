var quotesRouter = require('express').Router();

var routes = function (sockets, ajax) {
    var quotesController = require('../controllers/quotesController')();

    /**
     * Sockets implementation
     */
    quotesRouter.route('/sockets').get(quotesController.getSocketQuotes);

    /**
     * AJAX implementation
     */
    quotesRouter.route('/http').get(quotesController.getAjaxQuotes);

    return quotesRouter;
};

module.exports = routes;

