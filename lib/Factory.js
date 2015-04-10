/**
 * @fileOverview Factories provide interface for creating different js view classes (products) according to the target
 * HTML element. To create a new factory inherit your class from {@link Factory}. After that extend the
 * {@link Factory._products} method to define which js class should be instantiated for specified type of html
 * element. You must specify default class by setting value for '*' type in the object which returned by that method.
 */
define([
    'Backbone.View.Elements',
    'underscore',
    'jquery',
    './ProductDescriptor',
    'backbone-super'
], function (ElementsView, _, $, ProductDescriptor) {
    "use strict";

    /**
     * @class Factory
     * @extends ElementsView
     */
    var Factory = ElementsView.View.extend(/**@lends Factory#*/{
        /**
         * @constructs
         */
        initialize: function () {
            this._super();

            /**
             * Keys is types of products
             * @type {Object.<ProductDescriptor>}
             * @protected
             */
            this._productDescriptors = {};
            this._initProductDescriptors();
        },

        /**
         * @private
         * @throws {Error} if class for default product type (*) is not specified
         */
        _initProductDescriptors: function () {
            var constructorsByProductTypes = this._products();
            if (!constructorsByProductTypes || typeof constructorsByProductTypes['*'] != 'function') {
                throw new Error('You must define the default product type. Specify the correct constructor for the "*" key in the _products method');
            }

            this.addProducts(constructorsByProductTypes);
        },

        /**
         * @param {Function} Constructor
         * @param {string} productType
         * @returns {ProductDescriptor}
         * @private
         */
        _addProductDescriptor: function (Constructor, productType) {
            this._productDescriptors[productType] = new ProductDescriptor({
                type: productType,
                Constructor: Constructor
            });

            return this._productDescriptors[productType];
        },

        /**
         * @param {string} productType
         * @param {Function} Constructor
         * @returns {Factory}
         */
        addProduct: function (productType, Constructor) {
            this._addProductDescriptor(Constructor, productType);

            return this;
        },

        /**
         * @param {Object.<Function>} products
         * @returns {Factory}
         */
        addProducts: function (products) {
            _(products).each(this._addProductDescriptor.bind(this));
            return this;
        },

        /**
         * @returns {Object.<Function>} key is product type, value is constructor for products of that type
         * @protected
         */
        _products: function () {
            return {};
        },

        /**
         * @param {string} productType
         * @param {Object} options default options includes only html element as el
         * @returns {Object} options for creating product
         * @protected
         */
        _getProductOptions: function (productType, options) {
            return options;
        },

        /**
         * Create a product for passed html element
         * @param {jQuery|HTMLElement|string} el
         * @param {object} [options]
         * @returns {*} Instance of constructor according to rules described in {@link Factory._products} method
         */
        createInstance: function (el, options) {
            var productDescriptor = this._getSuitableProductDescriptor($(el));
            options = _({el: el}).extend(options);
            options = this._generateProductOptions(options, productDescriptor);

            return productDescriptor.instantiateProduct(options);
        },

        /**
         * @param {object} options
         * @param {ProductDescriptor} productDescriptor
         * @returns {Object}
         * @protected
         */
        _generateProductOptions: function (options, productDescriptor) {
            return this._getProductOptions(productDescriptor.get('type'), options);
        },

        /*jshint unused: false*/
        /**
         * Returns suitable product descriptor for passed jQuery element
         * @param {jQuery} $el
         * @returns {ProductDescriptor}
         * @throws {Error} if your not redefine method in child class
         * @protected
         * @abstract
         */
        _getSuitableProductDescriptor: function ($el) {
            throw new Error('You must redefine the _getProductDescriptor method in your factory');
        }
    });

    return Factory;
});
