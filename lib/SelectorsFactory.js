define([
    'underscore',
    './Factory',
    './SelectorsProductDescriptor'
], function (_, Factory, SelectorsProductDescriptor) {
    "use strict";

    /**
     * Class uses {@link Backbone.View._selectors} for defining types of products. You can use composite product types
     * separated by comma in _products method. In this case product type will be related to html element if it has all
     * specified css classes
     * @class SelectorsFactory
     * @extends Factory
     */
    var SelectorsFactory = Factory.extend(/**@lends SelectorsFactory */{
        /**
         * @see {@link Factory._addProductDescriptor}
         * @param {Function} Constructor
         * @param {string} productType
         * @returns {ProductDescriptor}
         * @protected
         */
        _addProductDescriptor: function (Constructor, productType) {
            var descriptor = this._productDescriptors[productType] = new SelectorsProductDescriptor({
                type: productType,
                Constructor: Constructor
            });

            var self = this;
            var selector = productType == '*' ? '*' : descriptor.getTypes().reduce(function (selector, type) {
                return selector + self._selector(type);
            }, '');

            descriptor.set('selector', selector);
            return descriptor;
        },

        /**
         * Method invokes {@link Factory._getProductOptions} for each type of product
         * @param {object} options
         * @param {SelectorsProductDescriptor} productDescriptor
         * @returns {Object}
         * @protected
         */
        _generateProductOptions: function (options, productDescriptor) {
            productDescriptor.getTypes().forEach(function (type) {
                options = this._getProductOptions(type, options);
            }, this);

            return options;
        },

        /**
         * @see {@link Factory._getSuitableProductDescriptor}
         * @param {jQuery} $el
         * @returns {ProductDescriptor}
         * @protected
         */
        _getSuitableProductDescriptor: function ($el) {
            var descriptors =  _(this._productDescriptors).filter(function (productDescriptor) {
                return $el.is(productDescriptor.get('selector'));
            }, this);

            return this._getMostRelevantProductDescriptor(descriptors);
        },

        /**
         * Pick the most relevant product descriptor based on its weight
         * @see {@link SelectorsProductDescriptor.getWeight}
         * @param {Array.<SelectorsProductDescriptor>} descriptors
         * @returns {SelectorsProductDescriptor}
         * @throws {Error} if element does not match any product descriptor. In general it's not possible, but just in case
         * @throws {Error} if {@link Factory._products} method has ambiguous rules for processing element
         * @private
         */
        _getMostRelevantProductDescriptor: function (descriptors) {
            if (!descriptors.length) {
                throw new Error('Element does not match any product descriptor. Factory cannot instantiate it');
            }

            var relevantDescriptors = [],
                maxWeight = 0;

            descriptors.forEach(function (descriptor) {
                var weight = descriptor.getWeight();
                if (weight > maxWeight) {
                    relevantDescriptors = [descriptor];
                    maxWeight = weight;
                }
                else if (weight == maxWeight) {
                    relevantDescriptors.push(descriptor);
                }
            });

            if (relevantDescriptors.length > 1) {
                var ambiguousTypes = relevantDescriptors.map(function (descriptor) {
                    return descriptor.get('type');
                }).join(', ');

                var error = 'Ambiguous product types: ' + ambiguousTypes +
                    '. Change the _products method to provide unequivocal rules for creating instances';
                throw new Error(error);
            }

            return relevantDescriptors[0];
        }
    });

    return SelectorsFactory;
});
