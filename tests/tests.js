requirejs.config({
    paths: {
        backbone: '../bower_components/backbone/backbone',
        underscore: '../bower_components/underscore/underscore',
        jquery: '../bower_components/jquery/dist/jquery',
        mocha: '../bower_components/mocha/mocha',
        mochaOOPWrapper: '../bower_components/mocha-oop-wrapper/lib/mochaOOPWrapper',
        lib: window.mochaPhantomJS ? '../lib-cov' : '../lib',
        expect: '../bower_components/expect/index',
        'backbone-super': '../bower_components/backbone-super/backbone-super/backbone-super',
        'Backbone.View.Elements': '../bower_components/backbone.view.elements/lib/Backbone.View.Elements'
    },
    shim: {
        backbone: {
            exports: 'Backbone'
        },
        jquery: {
            exports: 'jQuery'
        },
        mocha: {
            exports: 'mocha'
        },
        expect: {
            exports: 'expect'
        },
        'Backbone.View.Elements': {
            deps: ['backbone-super']
        }
    }
});

// Hello PhantomJS https://github.com/ariya/phantomjs/issues/10522
if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
        if (typeof this !== 'function') {
            // closest thing possible to the ECMAScript 5
            // internal IsCallable function
            throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
        }

        var aArgs = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fNOP = function () {
            },
            fBound = function () {
                return fToBind.apply(this instanceof fNOP && oThis
                        ? this
                        : oThis,
                    aArgs.concat(Array.prototype.slice.call(arguments)));
            };

        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();

        return fBound;
    };
}

require(['jquery', 'SelectorsFactoryTests'], function ($, SelectorsFactoryTests) {
    new SelectorsFactoryTests({
        el: $('.factory-tests')
    });
});
