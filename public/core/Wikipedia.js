/* jshint strict: true */

/**
 * A core library that handles the Wikipedia API.
 * All request to Wikipedia will go through this class.
 * @param {String} langCode is the 2-digit language code for Wikipedia. (Example: 'en')
 */
var Wikipedia = function (langCode) {
    var self = this;
    self.url = 'http://' + (langCode || 'en') + '.wikipedia.org/w/api.php';
    self.baseRequest = {
        format: 'json',
        origin: 'https://www.mediawiki.org'
    };

    /**
     * Searches for a string using the Wiki API
     * @param {String} searchTerm
     * @param {Function} callback has one parameter, which either contains the result or is 'false' if there was a problem.
     */
    self.searchFor = function (searchTerm, callback) {
        query({
            action: 'openSearch',
            search: searchTerm
        }, function (result) {
            callback(result);
        });
    };

    /**
     * Queries the Wikipedia API
     * @param {Object} request contains the parameters for the query. (Check this: http://en.wikipedia.org/wiki/Help:URL)
     * @param {Function} callback has one paramter that gives back the original response of Wikipedia as an object.
     */
    function query(request, callback) {
        request = $.extend(self.baseRequest, request);

        $.ajax({
            url: self.url,
            data: request,
            xhrFields: {
                'withCredentials': true
            },
            type: 'GET',
            dataType: 'json',
            success: callback,
            error: function () {
                callback(false);
            }
        });
    }
};