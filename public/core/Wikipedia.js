/* jshint strict: true */

/**
 * A core library that handles the Wikipedia API.
 * All request to Wikipedia will go through this class.
 * @param {String} langCode is the 2-digit language code for Wikipedia. (Example: 'en')
 */
var Wikipedia = function (langCode) {
    var xhr = null;
    
    /**
     * Searches for a string using the Wiki API
     * @param {String} searchTerm
     * @param {Function} callback has one parameter, which either contains the result or is 'false' if there was a problem.
     */
    this.searchFor = function (searchTerm, limit, callback) {
        query({
            action: 'opensearch',
            search: searchTerm,
            limit: limit
        }, function (result) {
            if (!result) {
                return;
            }

            var pages = [];

            for (var i in result[1]) {
                var page = {
                    title: result[1][i],
                    description: result[2][i],
                    link: result[3][i]
                };
                pages.push(page);
            }

            callback(pages);
        });
    };

    /**
     * http://en.wikipedia.org/w/api.php?format=json&action=query&prop=revisions&titles=Stack%20Overflow&rvprop=content&rvsection=0&rvparse
     */
    this.getArticle = function (name, callback) {
        query({
            action: 'parse',
            page: name
        }, function (result) {
            if (result) {
                callback(result.parse);
            }
        });
    };

    /**
     * Gets the article html without using JSON or similar.
     */
    this.getArticleContent = function (name, callback) {
        if (xhr)
            xhr.abort();
        
        xhr = $.ajax({
            url: '/' + langCode + '/wiki/' + name,
            type: 'GET',
            success: callback,
            error: function() {
                callback(false);   
            }
        });
    };

    /**
     * Queries the Wikipedia API
     * @param {Object} request contains the parameters for the query. (Check this: http://en.wikipedia.org/wiki/Help:URL)
     * @param {Function} callback has one paramter that gives back the original response of Wikipedia as an object.
     */
    function query(request, callback) {
        if (xhr)
            xhr.abort();
        
        request.format = 'json';

        xhr = $.ajax({
            url: '/' + langCode + '/wiki',
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