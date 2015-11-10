/**
 * This file now provides the ability to manually include and initialize a
 * before and after hooks that are scoped to a unit test.
 *
 * Example usage:
 *
 *  var ghostdom = require('../test/ghost-dom');
 *
 *  describe(..., function () {
 *    ghostdom();
 *    ...
 *  }
 *
 */
var jsdom = require('jsdom').jsdom;

/**
 * Creates the jsdom elements if they do not exists.
 */
function createDom(markup) {

    var location;
    if (typeof markup === 'object') {
        location = markup.location;
        markup = markup.markup;
    }

    if (typeof global.document !== 'undefined') {
        return;
    }

    global.document = jsdom(markup || '<html><body></body></html>');
    global.window = document.parentWindow;

    // HACK: Necessary so that you can include the jsdom before including
    // React. Otherwise React will attempt to check the userAgent and throw an
    // exception.
    //
    // TODO: Allow override the userAgent
    global.navigator = {
        userAgent: 'Ghost'
    };

    if (location) {
        global.location = location;
        global.window.location = location;
    }

}

/**
 * Cleans up the jsdom elements.
 */
function removeDom() {
    delete global.navigator;
    delete global.location;
    delete global.window;
    delete global.document;
}

/**
 * Adds before and after hooks to enable the creation and cleanup of jsdom
 * objects.
 *
 * @param {String} markup The markup it initialize jsdom with.
 */
function addScopedHooks(markup) {

    before(function () {
        createDom(markup);
    });

    after(function () {
        removeDom();
    });

}

module.exports = function (markup) {
    addScopedHooks(markup);
};
