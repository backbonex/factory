define(['underscore', './ProductDescriptor'], function (_, ProductDescriptor) {
    "use strict";

    /**
     * @class SelectorsProductDescriptor
     * @extends ProductDescriptor
     * @param {Object} options
     * @param {string} options.compositeType types of product separated by space
     * @param {Function} options.Constructor constructor for this product type
     */
    var SelectorsProductDescriptor = ProductDescriptor.extend(/**@lends SelectorsProductDescriptor */{
        /**
         * @protected
         * @returns {Object}
         */
        defaults: function () {
            return _({
                selector: ''
            }).defaults(this._super());
        },

        /**
         * Weight is count of types for this descriptor. Appropriated descriptor with biggest weight is most relevant for
         * element
         * @returns {number}
         */
        getWeight: function () {
            return this.get('type') == '*' ? 0 : this.getTypes().length;
        },

        /**
         * @returns {Array.<string>} all product types for current product descriptor
         */
        getTypes: function () {
            return this.get('type').split(' ');
        }
    });

    return SelectorsProductDescriptor;
});