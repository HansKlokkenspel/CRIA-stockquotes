var quotesRouter = require('express').Router();

var routes = function (sockets, ajax) {
    var quotesController = require('../controllers/quotesController')();

    /**
     * General page request
     */
    quotesRouter.route('/').get(quotesController.getQuotes);

    /**
     * Sockets implementation
     */
    quotesRouter.route('/api/sockets').get(quotesController.getSocketQuotes);

    /**
     * AJAX implementation
     */
    quotesRouter.route('/api/http').get(quotesController.getAjaxQuotes);

    return quotesRouter;
};

module.exports = routes;

