define([
    'backbone',
    'backbone-super'
], function (Backbone) {
    "use strict";

    /**
     * @class ProductDescriptor
     * @extends Backbone.Model
     * @param {Object} options
     * @param {string} options.compositeType types of product separated by space
     * @param {Function} options.Constructor constructor for this product type
     */
    var ProductDescriptor = Backbone.Model.extend(/**@lends ProductDescriptor#*/{
        /**
         * @protected
         * @returns {Object}
         */
        defaults: function () {
            return {
                type: '',
                Constructor: null
            };
        },

        /**
         * Create instance of that product type
         * @param {Object} options
         * @returns {object}
         */
        instantiateProduct: function (options) {
            var Constructor = this.get('Constructor');
            return new Constructor(options);
        }
    });

    return ProductDescriptor;
});
