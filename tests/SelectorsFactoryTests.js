define([
    'underscore',
    'jquery',
    'Backbone.View.Elements',
    'mochaOOPWrapper',
    'expect',
    'lib/Factory',
    './TestSelectorsFactory',
    './testProducts'
], function (_, $, ElementsView, mochaOOPWrapper, expect, Factory, TestSelectorsFactory, testProducts) {
    'use strict';

    /**
     * Intermediate class based on mochaOOPWrapper
     * @class MochaOOPWrapper
     * @extends ElementsView
     */
    var MochaOOPWrapper = ElementsView.extend(mochaOOPWrapper);
    
    /**
     * @class SelectorsFactoryTests
     * @extends MochaOOPWrapper
     */
    return MochaOOPWrapper.extend(/**@lends SelectorsFactoryTests#*/{
        /**
         * Name of testing module
         * @type {string}
         * @protected
         */
        _name: 'Factory',

        /**
         * @see {@link Backbone.View._classes}
         * @protected
         * @returns {Object}
         */
        _classes: function () {
            return _.defaults({
                test: 'test'
            }, this._super());
        },

        /**
         * @constructs
         */
        initialize: function () {
            this._super();

            /**
             * @type {Factory}
             * @private
             */
            this._factory = null;

            // run tests after initialization
            this._initTests();
        },

        /**
         * @protected
         */
        _describe: function () {
            this.describe('Factory initialization', this._checkFactoryInitialization);
            this.describe('Factory', this._checkInstancesCreation);
        },

        /**
         * @private
         */
        _checkFactoryInitialization: function () {
            this.it('should throw an error if default factory product is not specified', function () {
                var TestFactory = Factory.extend({});
                expect(function () {
                    new TestFactory;
                }).to.throwError();
            });

            this.it('should be initialized', function () {
                expect(function () {
                    this._factory = new TestSelectorsFactory({
                        el: document.body
                    });
                }.bind(this)).not.to.throwError();
            });
        },

        /**
         * @private
         */
        _checkInstancesCreation: function () {
            this.it('should create an instance of default (*) class, if the element is not matched to any selector', function () {
                this._checkInstance(0, testProducts.Test);
            });

            this.it('should create an instances of js classes according to css classes', function () {
                this._checkInstance(1, testProducts.Test1);
                this._checkInstance(2, testProducts.Test2, 'test2');
            });

            this.it('should create an instance with more concrete type', function () {
                this._checkInstance(3, testProducts.Test12, 'test2');
            });

            this.it('should throw an error when trying to create an ambiguous instances', function () {
                expect(function () {
                    this._factory.createInstance(this._elem('test').eq(4));
                }.bind(this)).to.throwError();
            });
        },

        /**
         * @param {number} n
         * @param {Function} Class
         * @param {string} [typeValue]
         * @private
         */
        _checkInstance: function (n, Class, typeValue) {
            var $el = this._elem('test').eq(n);
            var instance = this._factory.createInstance($el);
            expect(instance instanceof Class).to.be.ok();
            expect(instance.options.type).to.be(typeValue);
            expect(instance.el).to.be($el[0]);
        }
    });
});
