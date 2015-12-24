var quotesRouter = require('express').Router();

var routes = function (sockets, ajax) {
    var quotesController = require('../controllers/quotesController')();

    /**
     * Sockets implementation
     */
    quotesRouter.route('/sockets').get(quotesController.getSocketQuotes);

    quotesRouter.route('/http').get(quotesController.getAjaxQuotes);

    /**
     * AJAX implementation
     */

    return quotesRouter;
};

module.exports = routes;

