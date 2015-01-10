var assert = require('assert');
var fs = require('fs');

/**
 * This module manages the multi language support.
 */
module.exports = function () {

    // Defines the default language, which will be used as fallback.
    var fallbackLanguage = 'en';

    /**
     * Checks if a language code is valid.
     * @param {String} languageCode is a two digit language code. (e.g. 'en', 'de', ...)
     * @returns {Boolean} true if the language is valid.
     */
    this.valid = function (languageCode) {
        return languageCode && languageCode.length == 2;
    }

    /**
     * Gets a language object for the specific language and fill the missing fields with the default language.
     * @param {String} languageCode is a two digit language code. (e.g. 'en', 'de', ...)
     * @returns {Object} A language object that contains several translated words and texts.
     */
    this.get = function (languageCode) {
        assert.ok(languageCode, "'languageCode' cannot be empty.");
        assert.equal(languageCode.length, 2, "'languageCode' must have an exact length of 2 characters.");

        // Get the specific language object.
        var lang = getLangObject(languageCode);

        // Use the default language as a fallback, excepting the case that the current language is the fallback language.
        if (languageCode != fallbackLanguage) {
            var fallback = getLangObject(fallbackLanguage);
            merge(lang, fallback);
        }

        return lang;
    }

    /**
     * Gets a language object for the specific language.
     * @param {String} languageCode is a two digit language code. (e.g. 'en', 'de', ...)
     * @returns {Object} A language object that contains several translated words and texts.
     * If the language could not be found, an empty object will be returned.
     */
    function getLangObject(languageCode) {
        
        var path = __dirname + '/../lang/' + languageCode + '.json';
        if (!fs.existsSync(path)) {
            console.warn("Language file could not be found!", path);
            return {};
        }

        var content = fs.readFileSync(path);
        return JSON.parse(content);
    }

    /**
     * Merges two objectcs deeply. Similar to jQuerys extend().
     * Every word or sentence that is empty in the current language, gets replaced by the fallback language.
     * @param {Object} lang is an object that contains the translations for the current language.
     * @param {Object} fallback is the default language.
     * @returns {void} No return value.
     */
    function merge(lang, fallback) {
        for (var k in fallback) {
            if (!lang[k]) {
                lang[k] = fallback[k];
            } else if (typeof fallback[k] === 'object') {
                merge(lang[k], fallback[k]);
            }
        }
    }

    return this;
}