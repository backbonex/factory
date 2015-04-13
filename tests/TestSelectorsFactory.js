define([
    'underscore',
    'lib/SelectorsFactory',
    './testProducts'
], function (_, SelectorsFactory, testProducts) {
    "use strict";

    /**
     * @class TestSelectorsFactory
     * @extends SelectorsFactory
     */
    var TestSelectorsFactory = SelectorsFactory.extend(/**@lends TestSelectorsFactory*/{
        /**
         * @see {@link Backbone.View._classes}
         * @protected
         * @returns {Object}
         */
        _classes: function () {
            return _.defaults({
                test1: 'test1',
                test2: 'test2',
                test3: 'test3'
            }, this._super());
        },

        /**
         * @returns {Object}
         * @protected
         */
        _products: function () {
            return _({
                '*': testProducts.Test,
                test1: testProducts.Test1,
                test2: testProducts.Test2,
                test3: testProducts.Test,
                'test1 test2': testProducts.Test12
            }).defaults(this._super());
        },

        /**
         * @returns {Object}
         * @protected
         */
        _getProductOptions: function (type, options) {
            switch (type) {
                case 'test2':
                    return _({
                        type: type
                    }).defaults(options);

                default:
                    return this._super(type, options);
            }
        }
    });

    return TestSelectorsFactory;
});
