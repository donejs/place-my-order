/*can@2.3.0-pre.3#map/define/define*/
define('can@2.3.0-pre.3#map/define/define', [
    'can/util/util',
    'can/map/map_helpers',
    'can/observe/observe'
], function (can, mapHelpers) {
    var define = can.define = {};
    var getPropDefineBehavior = function (behavior, attr, define) {
        var prop, defaultProp;
        if (define) {
            prop = define[attr];
            defaultProp = define['*'];
            if (prop && prop[behavior] !== undefined) {
                return prop[behavior];
            } else if (defaultProp && defaultProp[behavior] !== undefined) {
                return defaultProp[behavior];
            }
        }
    };
    mapHelpers.define = function (Map) {
        var definitions = Map.prototype.define;
        Map.defaultGenerators = {};
        for (var prop in definitions) {
            var type = definitions[prop].type;
            if (typeof type === 'string') {
                if (typeof define.types[type] === 'object') {
                    delete definitions[prop].type;
                    can.extend(definitions[prop], define.types[type]);
                }
            }
            if ('value' in definitions[prop]) {
                if (typeof definitions[prop].value === 'function') {
                    Map.defaultGenerators[prop] = definitions[prop].value;
                } else {
                    Map.defaults[prop] = definitions[prop].value;
                }
            }
            if (typeof definitions[prop].Value === 'function') {
                (function (Constructor) {
                    Map.defaultGenerators[prop] = function () {
                        return new Constructor();
                    };
                }(definitions[prop].Value));
            }
        }
    };
    var oldSetupDefaults = can.Map.prototype._setupDefaults;
    can.Map.prototype._setupDefaults = function (obj) {
        var defaults = oldSetupDefaults.call(this), propsCommittedToAttr = {}, Map = this.constructor, originalGet = this._get;
        this._get = function (originalProp) {
            prop = originalProp.indexOf('.') !== -1 ? originalProp.substr(0, originalProp.indexOf('.')) : prop;
            if (prop in defaults && !(prop in propsCommittedToAttr)) {
                this.attr(prop, defaults[prop]);
                propsCommittedToAttr[prop] = true;
            }
            return originalGet.apply(this, arguments);
        };
        for (var prop in Map.defaultGenerators) {
            if (!obj || !(prop in obj)) {
                defaults[prop] = Map.defaultGenerators[prop].call(this);
            }
        }
        delete this._get;
        return defaults;
    };
    var proto = can.Map.prototype, oldSet = proto.__set;
    proto.__set = function (prop, value, current, success, error) {
        var errorCallback = function (errors) {
                var stub = error && error.call(self, errors);
                if (stub !== false) {
                    can.trigger(self, 'error', [
                        prop,
                        errors
                    ], true);
                }
                return false;
            }, self = this, setter = getPropDefineBehavior('set', prop, this.define), getter = getPropDefineBehavior('get', prop, this.define);
        if (setter) {
            can.batch.start();
            var setterCalled = false, setValue = setter.call(this, value, function (value) {
                    if (getter) {
                        self[prop](value);
                    } else {
                        oldSet.call(self, prop, value, current, success, errorCallback);
                    }
                    setterCalled = true;
                }, errorCallback, getter ? this._computedAttrs[prop].compute.computeInstance.lastSetValue.get() : current);
            if (getter) {
                if (setValue !== undefined && !setterCalled && setter.length >= 1) {
                    this._computedAttrs[prop].compute(setValue);
                }
                can.batch.stop();
                return;
            } else if (setValue === undefined && !setterCalled && setter.length >= 1) {
                can.batch.stop();
                return;
            } else {
                if (!setterCalled) {
                    oldSet.call(self, prop, setter.length === 0 && setValue === undefined ? value : setValue, current, success, errorCallback);
                }
                can.batch.stop();
                return this;
            }
        } else {
            oldSet.call(self, prop, value, current, success, errorCallback);
        }
        return this;
    };
    define.types = {
        'date': function (str) {
            var type = typeof str;
            if (type === 'string') {
                str = Date.parse(str);
                return isNaN(str) ? null : new Date(str);
            } else if (type === 'number') {
                return new Date(str);
            } else {
                return str;
            }
        },
        'number': function (val) {
            if (val == null) {
                return val;
            }
            return +val;
        },
        'boolean': function (val) {
            if (val === 'false' || val === '0' || !val) {
                return false;
            }
            return true;
        },
        'htmlbool': function (val) {
            return typeof val === 'string' || !!val;
        },
        '*': function (val) {
            return val;
        },
        'string': function (val) {
            if (val == null) {
                return val;
            }
            return '' + val;
        },
        'compute': {
            set: function (newValue, setVal, setErr, oldValue) {
                if (newValue.isComputed) {
                    return newValue;
                }
                if (oldValue && oldValue.isComputed) {
                    oldValue(newValue);
                    return oldValue;
                }
                return newValue;
            },
            get: function (value) {
                return value && value.isComputed ? value() : value;
            }
        }
    };
    var oldType = proto.__type;
    proto.__type = function (value, prop) {
        var type = getPropDefineBehavior('type', prop, this.define), Type = getPropDefineBehavior('Type', prop, this.define), newValue = value;
        if (typeof type === 'string') {
            type = define.types[type];
        }
        if (type || Type) {
            if (type) {
                newValue = type.call(this, newValue, prop);
            }
            if (Type && !(newValue instanceof Type)) {
                newValue = new Type(newValue);
            }
            return newValue;
        } else if (can.isPlainObject(newValue) && newValue.define) {
            newValue = can.Map.extend(newValue);
            newValue = new newValue();
        }
        return oldType.call(this, newValue, prop);
    };
    var oldRemove = proto.__remove;
    proto.__remove = function (prop, current) {
        var remove = getPropDefineBehavior('remove', prop, this.define), res;
        if (remove) {
            can.batch.start();
            res = remove.call(this, current);
            if (res === false) {
                can.batch.stop();
                return;
            } else {
                res = oldRemove.call(this, prop, current);
                can.batch.stop();
                return res;
            }
        }
        return oldRemove.call(this, prop, current);
    };
    var oldSetupComputes = proto._setupComputedProperties;
    proto._setupComputedProperties = function () {
        oldSetupComputes.apply(this, arguments);
        for (var attr in this.define) {
            var def = this.define[attr], get = def.get;
            if (get) {
                mapHelpers.addComputedAttr(this, attr, can.compute.async(undefined, get, this));
            }
        }
    };
    var oldSingleSerialize = proto.___serialize;
    proto.___serialize = function (name, val) {
        return serializeProp(this, name, val);
    };
    var serializeProp = function (map, attr, val) {
        var serializer = attr === '*' ? false : getPropDefineBehavior('serialize', attr, map.define);
        if (serializer === undefined) {
            return oldSingleSerialize.call(map, attr, val);
        } else if (serializer !== false) {
            return typeof serializer === 'function' ? serializer.call(map, val, attr) : oldSingleSerialize.call(map, attr, val);
        }
    };
    var oldSerialize = proto.serialize;
    proto.serialize = function (property) {
        var serialized = oldSerialize.apply(this, arguments);
        if (property) {
            return serialized;
        }
        var serializer, val;
        for (var attr in this.define) {
            if (!(attr in serialized)) {
                serializer = this.define && this.define[attr] && this.define[attr].serialize;
                if (serializer) {
                    val = serializeProp(this, attr, this.attr(attr));
                    if (val !== undefined) {
                        serialized[attr] = val;
                    }
                }
            }
        }
        return serialized;
    };
    return can.define;
});
/*can@2.3.0-pre.3#control/route/route*/
define('can@2.3.0-pre.3#control/route/route', [
    'can/util/util',
    'can/route/route',
    'can/control/control'
], function (can) {
    can.Control.processors.route = function (el, event, selector, funcName, controller) {
        selector = selector || '';
        if (!can.route.routes[selector]) {
            if (selector[0] === '/') {
                selector = selector.substring(1);
            }
            can.route(selector);
        }
        var batchNum, check = function (ev, attr, how) {
                if (can.route.attr('route') === selector && (ev.batchNum === undefined || ev.batchNum !== batchNum)) {
                    batchNum = ev.batchNum;
                    var d = can.route.attr();
                    delete d.route;
                    if (can.isFunction(controller[funcName])) {
                        controller[funcName](d);
                    } else {
                        controller[controller[funcName]](d);
                    }
                }
            };
        can.route.bind('change', check);
        return function () {
            can.route.unbind('change', check);
        };
    };
    return can;
});
/*can@2.3.0-pre.3#model/model*/
define('can@2.3.0-pre.3#model/model', [
    'can/util/util',
    'can/map/map',
    'can/list/list'
], function (can) {
    var pipe = function (def, thisArg, func) {
            var d = new can.Deferred();
            def.then(function () {
                var args = can.makeArray(arguments), success = true;
                try {
                    args[0] = func.apply(thisArg, args);
                } catch (e) {
                    success = false;
                    d.rejectWith(d, [e].concat(args));
                }
                if (success) {
                    d.resolveWith(d, args);
                }
            }, function () {
                d.rejectWith(this, arguments);
            });
            if (typeof def.abort === 'function') {
                d.abort = function () {
                    return def.abort();
                };
            }
            return d;
        }, modelNum = 0, getId = function (inst) {
            can.__observe(inst, inst.constructor.id);
            return inst.___get(inst.constructor.id);
        }, ajax = function (ajaxOb, data, type, dataType, success, error) {
            var params = {};
            if (typeof ajaxOb === 'string') {
                var parts = ajaxOb.split(/\s+/);
                params.url = parts.pop();
                if (parts.length) {
                    params.type = parts.pop();
                }
            } else {
                can.extend(params, ajaxOb);
            }
            params.data = typeof data === 'object' && !can.isArray(data) ? can.extend(params.data || {}, data) : data;
            params.url = can.sub(params.url, params.data, true);
            return can.ajax(can.extend({
                type: type || 'post',
                dataType: dataType || 'json',
                success: success,
                error: error
            }, params));
        }, makeRequest = function (modelObj, type, success, error, method) {
            var args;
            if (can.isArray(modelObj)) {
                args = modelObj[1];
                modelObj = modelObj[0];
            } else {
                args = modelObj.serialize();
            }
            args = [args];
            var deferred, model = modelObj.constructor, jqXHR;
            if (type === 'update' || type === 'destroy') {
                args.unshift(getId(modelObj));
            }
            jqXHR = model[type].apply(model, args);
            deferred = pipe(jqXHR, modelObj, function (data) {
                modelObj[method || type + 'd'](data, jqXHR);
                return modelObj;
            });
            if (jqXHR.abort) {
                deferred.abort = function () {
                    jqXHR.abort();
                };
            }
            deferred.then(success, error);
            return deferred;
        }, converters = {
            models: function (instancesRawData, oldList, xhr) {
                can.Model._reqs++;
                if (!instancesRawData) {
                    return;
                }
                if (instancesRawData instanceof this.List) {
                    return instancesRawData;
                }
                var self = this, tmp = [], ListClass = self.List || ML, modelList = oldList instanceof can.List ? oldList : new ListClass(), rawDataIsList = instancesRawData instanceof ML, raw = rawDataIsList ? instancesRawData.serialize() : instancesRawData;
                raw = self.parseModels(raw, xhr);
                if (raw.data) {
                    instancesRawData = raw;
                    raw = raw.data;
                }
                if (typeof raw === 'undefined' || !can.isArray(raw)) {
                    throw new Error('Could not get any raw data while converting using .models');
                }
                if (modelList.length) {
                    modelList.splice(0);
                }
                can.each(raw, function (rawPart) {
                    tmp.push(self.model(rawPart, xhr));
                });
                modelList.push.apply(modelList, tmp);
                if (!can.isArray(instancesRawData)) {
                    can.each(instancesRawData, function (val, prop) {
                        if (prop !== 'data') {
                            modelList.attr(prop, val);
                        }
                    });
                }
                setTimeout(can.proxy(this._clean, this), 1);
                return modelList;
            },
            model: function (attributes, oldModel, xhr) {
                if (!attributes) {
                    return;
                }
                if (typeof attributes.serialize === 'function') {
                    attributes = attributes.serialize();
                } else {
                    attributes = this.parseModel(attributes, xhr);
                }
                var id = attributes[this.id];
                if ((id || id === 0) && this.store[id]) {
                    oldModel = this.store[id];
                }
                var model = oldModel && can.isFunction(oldModel.attr) ? oldModel.attr(attributes, this.removeAttr || false) : new this(attributes);
                return model;
            }
        }, makeParser = {
            parseModel: function (prop) {
                return function (attributes) {
                    return prop ? can.getObject(prop, attributes) : attributes;
                };
            },
            parseModels: function (prop) {
                return function (attributes) {
                    if (can.isArray(attributes)) {
                        return attributes;
                    }
                    prop = prop || 'data';
                    var result = can.getObject(prop, attributes);
                    if (!can.isArray(result)) {
                        throw new Error('Could not get any raw data while converting using .models');
                    }
                    return result;
                };
            }
        }, ajaxMethods = {
            create: {
                url: '_shortName',
                type: 'post'
            },
            update: {
                data: function (id, attrs) {
                    attrs = attrs || {};
                    var identity = this.id;
                    if (attrs[identity] && attrs[identity] !== id) {
                        attrs['new' + can.capitalize(id)] = attrs[identity];
                        delete attrs[identity];
                    }
                    attrs[identity] = id;
                    return attrs;
                },
                type: 'put'
            },
            destroy: {
                type: 'delete',
                data: function (id, attrs) {
                    attrs = attrs || {};
                    attrs.id = attrs[this.id] = id;
                    return attrs;
                }
            },
            findAll: { url: '_shortName' },
            findOne: {}
        }, ajaxMaker = function (ajaxMethod, str) {
            return function (data) {
                data = ajaxMethod.data ? ajaxMethod.data.apply(this, arguments) : data;
                return ajax(str || this[ajaxMethod.url || '_url'], data, ajaxMethod.type || 'get');
            };
        }, createURLFromResource = function (model, name) {
            if (!model.resource) {
                return;
            }
            var resource = model.resource.replace(/\/+$/, '');
            if (name === 'findAll' || name === 'create') {
                return resource;
            } else {
                return resource + '/{' + model.id + '}';
            }
        };
    can.Model = can.Map.extend({
        fullName: 'can.Model',
        _reqs: 0,
        setup: function (base, fullName, staticProps, protoProps) {
            if (typeof fullName !== 'string') {
                protoProps = staticProps;
                staticProps = fullName;
            }
            if (!protoProps) {
                protoProps = staticProps;
            }
            this.store = {};
            can.Map.setup.apply(this, arguments);
            if (!can.Model) {
                return;
            }
            if (staticProps && staticProps.List) {
                this.List = staticProps.List;
                this.List.Map = this;
            } else {
                this.List = base.List.extend({ Map: this }, {});
            }
            var self = this, clean = can.proxy(this._clean, self);
            can.each(ajaxMethods, function (method, name) {
                if (staticProps && staticProps[name] && (typeof staticProps[name] === 'string' || typeof staticProps[name] === 'object')) {
                    self[name] = ajaxMaker(method, staticProps[name]);
                } else if (staticProps && staticProps.resource && !can.isFunction(staticProps[name])) {
                    self[name] = ajaxMaker(method, createURLFromResource(self, name));
                }
                if (self['make' + can.capitalize(name)]) {
                    var newMethod = self['make' + can.capitalize(name)](self[name]);
                    can.Construct._overwrite(self, base, name, function () {
                        can.Model._reqs++;
                        var def = newMethod.apply(this, arguments);
                        var then = def.then(clean, clean);
                        then.abort = def.abort;
                        return then;
                    });
                }
            });
            var hasCustomConverter = {};
            can.each(converters, function (converter, name) {
                var parseName = 'parse' + can.capitalize(name), dataProperty = staticProps && staticProps[name] || self[name];
                if (typeof dataProperty === 'string') {
                    self[parseName] = dataProperty;
                    can.Construct._overwrite(self, base, name, converter);
                } else if (staticProps && staticProps[name]) {
                    hasCustomConverter[parseName] = true;
                }
            });
            can.each(makeParser, function (maker, parseName) {
                var prop = staticProps && staticProps[parseName] || self[parseName];
                if (typeof prop === 'string') {
                    can.Construct._overwrite(self, base, parseName, maker(prop));
                } else if ((!staticProps || !can.isFunction(staticProps[parseName])) && !self[parseName]) {
                    var madeParser = maker();
                    madeParser.useModelConverter = hasCustomConverter[parseName];
                    can.Construct._overwrite(self, base, parseName, madeParser);
                }
            });
            if (self.fullName === 'can.Model' || !self.fullName) {
                self.fullName = 'Model' + ++modelNum;
            }
            can.Model._reqs = 0;
            this._url = this._shortName + '/{' + this.id + '}';
        },
        _ajax: ajaxMaker,
        _makeRequest: makeRequest,
        _clean: function () {
            can.Model._reqs--;
            if (!can.Model._reqs) {
                for (var id in this.store) {
                    if (!this.store[id]._bindings) {
                        delete this.store[id];
                    }
                }
            }
            return arguments[0];
        },
        models: converters.models,
        model: converters.model
    }, {
        setup: function (attrs) {
            var id = attrs && attrs[this.constructor.id];
            if (can.Model._reqs && id != null) {
                this.constructor.store[id] = this;
            }
            can.Map.prototype.setup.apply(this, arguments);
        },
        isNew: function () {
            var id = getId(this);
            return !(id || id === 0);
        },
        save: function (success, error) {
            return makeRequest(this, this.isNew() ? 'create' : 'update', success, error);
        },
        destroy: function (success, error) {
            if (this.isNew()) {
                var self = this;
                var def = can.Deferred();
                def.then(success, error);
                return def.done(function (data) {
                    self.destroyed(data);
                }).resolve(self);
            }
            return makeRequest(this, 'destroy', success, error, 'destroyed');
        },
        _bindsetup: function () {
            var modelInstance = this.___get(this.constructor.id);
            if (modelInstance != null) {
                this.constructor.store[modelInstance] = this;
            }
            return can.Map.prototype._bindsetup.apply(this, arguments);
        },
        _bindteardown: function () {
            delete this.constructor.store[getId(this)];
            return can.Map.prototype._bindteardown.apply(this, arguments);
        },
        ___set: function (prop, val) {
            can.Map.prototype.___set.call(this, prop, val);
            if (prop === this.constructor.id && this._bindings) {
                this.constructor.store[getId(this)] = this;
            }
        }
    });
    var makeGetterHandler = function (name) {
            return function (data, readyState, xhr) {
                return this[name](data, null, xhr);
            };
        }, createUpdateDestroyHandler = function (data) {
            if (this.parseModel.useModelConverter) {
                return this.model(data);
            }
            return this.parseModel(data);
        };
    var responseHandlers = {
            makeFindAll: makeGetterHandler('models'),
            makeFindOne: makeGetterHandler('model'),
            makeCreate: createUpdateDestroyHandler,
            makeUpdate: createUpdateDestroyHandler,
            makeDestroy: createUpdateDestroyHandler
        };
    can.each(responseHandlers, function (method, name) {
        can.Model[name] = function (oldMethod) {
            return function () {
                var args = can.makeArray(arguments), oldArgs = can.isFunction(args[1]) ? args.splice(0, 1) : args.splice(0, 2), def = pipe(oldMethod.apply(this, oldArgs), this, method);
                def.then(args[0], args[1]);
                return def;
            };
        };
    });
    can.each([
        'created',
        'updated',
        'destroyed'
    ], function (funcName) {
        can.Model.prototype[funcName] = function (attrs) {
            var self = this, constructor = self.constructor;
            if (attrs && typeof attrs === 'object') {
                this.attr(can.isFunction(attrs.attr) ? attrs.attr() : attrs);
            }
            can.dispatch.call(this, {
                type: funcName,
                target: this
            }, []);
            can.dispatch.call(constructor, funcName, [this]);
        };
    });
    var ML = can.Model.List = can.List.extend({
            _bubbleRule: function (eventName, list) {
                var bubbleRules = can.List._bubbleRule(eventName, list);
                bubbleRules.push('destroyed');
                return bubbleRules;
            }
        }, {
            setup: function (params) {
                if (can.isPlainObject(params) && !can.isArray(params)) {
                    can.List.prototype.setup.apply(this);
                    this.replace(can.isDeferred(params) ? params : this.constructor.Map.findAll(params));
                } else {
                    can.List.prototype.setup.apply(this, arguments);
                }
                this.bind('destroyed', can.proxy(this._destroyed, this));
            },
            _destroyed: function (ev, attr) {
                if (/\w+/.test(attr)) {
                    var index;
                    while ((index = this.indexOf(ev.target)) > -1) {
                        this.splice(index, 1);
                    }
                }
            }
        });
    return can.Model;
});
/*can@2.3.0-pre.3#can*/
define('can@2.3.0-pre.3#can', [
    'can/util/util',
    'can/control/route/route',
    'can/model/model',
    'can/view/mustache/mustache',
    'can/component/component'
], function (can) {
    return can;
});
/*when@3.7.3#es6-shim/Promise*/
define('when@3.7.3#es6-shim/Promise', [
    'module',
    '@loader'
], function (module, loader) {
    loader.get('@@global-helpers').prepareGlobal(module.id, []);
    var define = loader.global.define;
    var require = loader.global.require;
    var source = '!function(e){"object"==typeof exports?module.exports=e():"function"==typeof define&&define.amd?define(e):"undefined"!=typeof window?window.Promise=e():"undefined"!=typeof global?global.Promise=e():"undefined"!=typeof self&&(self.Promise=e())}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module \'"+o+"\'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){\n/** @license MIT License (c) copyright 2010-2014 original author or authors */\n/** @author Brian Cavalier */\n/** @author John Hann */\n\n/**\n * ES6 global Promise shim\n */\nvar unhandledRejections = require(\'../lib/decorators/unhandledRejection\');\nvar PromiseConstructor = unhandledRejections(require(\'../lib/Promise\'));\n\nmodule.exports = typeof global != \'undefined\' ? (global.Promise = PromiseConstructor)\n\t           : typeof self   != \'undefined\' ? (self.Promise   = PromiseConstructor)\n\t           : PromiseConstructor;\n\n},{"../lib/Promise":2,"../lib/decorators/unhandledRejection":4}],2:[function(require,module,exports){\n/** @license MIT License (c) copyright 2010-2014 original author or authors */\n/** @author Brian Cavalier */\n/** @author John Hann */\n\n(function(define) { \'use strict\';\ndefine(function (require) {\n\n\tvar makePromise = require(\'./makePromise\');\n\tvar Scheduler = require(\'./Scheduler\');\n\tvar async = require(\'./env\').asap;\n\n\treturn makePromise({\n\t\tscheduler: new Scheduler(async)\n\t});\n\n});\n})(typeof define === \'function\' && define.amd ? define : function (factory) { module.exports = factory(require); });\n\n},{"./Scheduler":3,"./env":5,"./makePromise":7}],3:[function(require,module,exports){\n/** @license MIT License (c) copyright 2010-2014 original author or authors */\n/** @author Brian Cavalier */\n/** @author John Hann */\n\n(function(define) { \'use strict\';\ndefine(function() {\n\n\t// Credit to Twisol (https://github.com/Twisol) for suggesting\n\t// this type of extensible queue + trampoline approach for next-tick conflation.\n\n\t/**\n\t * Async task scheduler\n\t * @param {function} async function to schedule a single async function\n\t * @constructor\n\t */\n\tfunction Scheduler(async) {\n\t\tthis._async = async;\n\t\tthis._running = false;\n\n\t\tthis._queue = this;\n\t\tthis._queueLen = 0;\n\t\tthis._afterQueue = {};\n\t\tthis._afterQueueLen = 0;\n\n\t\tvar self = this;\n\t\tthis.drain = function() {\n\t\t\tself._drain();\n\t\t};\n\t}\n\n\t/**\n\t * Enqueue a task\n\t * @param {{ run:function }} task\n\t */\n\tScheduler.prototype.enqueue = function(task) {\n\t\tthis._queue[this._queueLen++] = task;\n\t\tthis.run();\n\t};\n\n\t/**\n\t * Enqueue a task to run after the main task queue\n\t * @param {{ run:function }} task\n\t */\n\tScheduler.prototype.afterQueue = function(task) {\n\t\tthis._afterQueue[this._afterQueueLen++] = task;\n\t\tthis.run();\n\t};\n\n\tScheduler.prototype.run = function() {\n\t\tif (!this._running) {\n\t\t\tthis._running = true;\n\t\t\tthis._async(this.drain);\n\t\t}\n\t};\n\n\t/**\n\t * Drain the handler queue entirely, and then the after queue\n\t */\n\tScheduler.prototype._drain = function() {\n\t\tvar i = 0;\n\t\tfor (; i < this._queueLen; ++i) {\n\t\t\tthis._queue[i].run();\n\t\t\tthis._queue[i] = void 0;\n\t\t}\n\n\t\tthis._queueLen = 0;\n\t\tthis._running = false;\n\n\t\tfor (i = 0; i < this._afterQueueLen; ++i) {\n\t\t\tthis._afterQueue[i].run();\n\t\t\tthis._afterQueue[i] = void 0;\n\t\t}\n\n\t\tthis._afterQueueLen = 0;\n\t};\n\n\treturn Scheduler;\n\n});\n}(typeof define === \'function\' && define.amd ? define : function(factory) { module.exports = factory(); }));\n\n},{}],4:[function(require,module,exports){\n/** @license MIT License (c) copyright 2010-2014 original author or authors */\n/** @author Brian Cavalier */\n/** @author John Hann */\n\n(function(define) { \'use strict\';\ndefine(function(require) {\n\n\tvar setTimer = require(\'../env\').setTimer;\n\tvar format = require(\'../format\');\n\n\treturn function unhandledRejection(Promise) {\n\n\t\tvar logError = noop;\n\t\tvar logInfo = noop;\n\t\tvar localConsole;\n\n\t\tif(typeof console !== \'undefined\') {\n\t\t\t// Alias console to prevent things like uglify\'s drop_console option from\n\t\t\t// removing console.log/error. Unhandled rejections fall into the same\n\t\t\t// category as uncaught exceptions, and build tools shouldn\'t silence them.\n\t\t\tlocalConsole = console;\n\t\t\tlogError = typeof localConsole.error !== \'undefined\'\n\t\t\t\t? function (e) { localConsole.error(e); }\n\t\t\t\t: function (e) { localConsole.log(e); };\n\n\t\t\tlogInfo = typeof localConsole.info !== \'undefined\'\n\t\t\t\t? function (e) { localConsole.info(e); }\n\t\t\t\t: function (e) { localConsole.log(e); };\n\t\t}\n\n\t\tPromise.onPotentiallyUnhandledRejection = function(rejection) {\n\t\t\tenqueue(report, rejection);\n\t\t};\n\n\t\tPromise.onPotentiallyUnhandledRejectionHandled = function(rejection) {\n\t\t\tenqueue(unreport, rejection);\n\t\t};\n\n\t\tPromise.onFatalRejection = function(rejection) {\n\t\t\tenqueue(throwit, rejection.value);\n\t\t};\n\n\t\tvar tasks = [];\n\t\tvar reported = [];\n\t\tvar running = null;\n\n\t\tfunction report(r) {\n\t\t\tif(!r.handled) {\n\t\t\t\treported.push(r);\n\t\t\t\tlogError(\'Potentially unhandled rejection [\' + r.id + \'] \' + format.formatError(r.value));\n\t\t\t}\n\t\t}\n\n\t\tfunction unreport(r) {\n\t\t\tvar i = reported.indexOf(r);\n\t\t\tif(i >= 0) {\n\t\t\t\treported.splice(i, 1);\n\t\t\t\tlogInfo(\'Handled previous rejection [\' + r.id + \'] \' + format.formatObject(r.value));\n\t\t\t}\n\t\t}\n\n\t\tfunction enqueue(f, x) {\n\t\t\ttasks.push(f, x);\n\t\t\tif(running === null) {\n\t\t\t\trunning = setTimer(flush, 0);\n\t\t\t}\n\t\t}\n\n\t\tfunction flush() {\n\t\t\trunning = null;\n\t\t\twhile(tasks.length > 0) {\n\t\t\t\ttasks.shift()(tasks.shift());\n\t\t\t}\n\t\t}\n\n\t\treturn Promise;\n\t};\n\n\tfunction throwit(e) {\n\t\tthrow e;\n\t}\n\n\tfunction noop() {}\n\n});\n}(typeof define === \'function\' && define.amd ? define : function(factory) { module.exports = factory(require); }));\n\n},{"../env":5,"../format":6}],5:[function(require,module,exports){\n/** @license MIT License (c) copyright 2010-2014 original author or authors */\n/** @author Brian Cavalier */\n/** @author John Hann */\n\n/*global process,document,setTimeout,clearTimeout,MutationObserver,WebKitMutationObserver*/\n(function(define) { \'use strict\';\ndefine(function(require) {\n\t/*jshint maxcomplexity:6*/\n\n\t// Sniff "best" async scheduling option\n\t// Prefer process.nextTick or MutationObserver, then check for\n\t// setTimeout, and finally vertx, since its the only env that doesn\'t\n\t// have setTimeout\n\n\tvar MutationObs;\n\tvar capturedSetTimeout = typeof setTimeout !== \'undefined\' && setTimeout;\n\n\t// Default env\n\tvar setTimer = function(f, ms) { return setTimeout(f, ms); };\n\tvar clearTimer = function(t) { return clearTimeout(t); };\n\tvar asap = function (f) { return capturedSetTimeout(f, 0); };\n\n\t// Detect specific env\n\tif (isNode()) { // Node\n\t\tasap = function (f) { return process.nextTick(f); };\n\n\t} else if (MutationObs = hasMutationObserver()) { // Modern browser\n\t\tasap = initMutationObserver(MutationObs);\n\n\t} else if (!capturedSetTimeout) { // vert.x\n\t\tvar vertxRequire = require;\n\t\tvar vertx = vertxRequire(\'vertx\');\n\t\tsetTimer = function (f, ms) { return vertx.setTimer(ms, f); };\n\t\tclearTimer = vertx.cancelTimer;\n\t\tasap = vertx.runOnLoop || vertx.runOnContext;\n\t}\n\n\treturn {\n\t\tsetTimer: setTimer,\n\t\tclearTimer: clearTimer,\n\t\tasap: asap\n\t};\n\n\tfunction isNode () {\n\t\treturn typeof process !== \'undefined\' &&\n\t\t\tObject.prototype.toString.call(process) === \'[object process]\';\n\t}\n\n\tfunction hasMutationObserver () {\n\t\treturn (typeof MutationObserver === \'function\' && MutationObserver) ||\n\t\t\t(typeof WebKitMutationObserver === \'function\' && WebKitMutationObserver);\n\t}\n\n\tfunction initMutationObserver(MutationObserver) {\n\t\tvar scheduled;\n\t\tvar node = document.createTextNode(\'\');\n\t\tvar o = new MutationObserver(run);\n\t\to.observe(node, { characterData: true });\n\n\t\tfunction run() {\n\t\t\tvar f = scheduled;\n\t\t\tscheduled = void 0;\n\t\t\tf();\n\t\t}\n\n\t\tvar i = 0;\n\t\treturn function (f) {\n\t\t\tscheduled = f;\n\t\t\tnode.data = (i ^= 1);\n\t\t};\n\t}\n});\n}(typeof define === \'function\' && define.amd ? define : function(factory) { module.exports = factory(require); }));\n\n},{}],6:[function(require,module,exports){\n/** @license MIT License (c) copyright 2010-2014 original author or authors */\n/** @author Brian Cavalier */\n/** @author John Hann */\n\n(function(define) { \'use strict\';\ndefine(function() {\n\n\treturn {\n\t\tformatError: formatError,\n\t\tformatObject: formatObject,\n\t\ttryStringify: tryStringify\n\t};\n\n\t/**\n\t * Format an error into a string.  If e is an Error and has a stack property,\n\t * it\'s returned.  Otherwise, e is formatted using formatObject, with a\n\t * warning added about e not being a proper Error.\n\t * @param {*} e\n\t * @returns {String} formatted string, suitable for output to developers\n\t */\n\tfunction formatError(e) {\n\t\tvar s = typeof e === \'object\' && e !== null && e.stack ? e.stack : formatObject(e);\n\t\treturn e instanceof Error ? s : s + \' (WARNING: non-Error used)\';\n\t}\n\n\t/**\n\t * Format an object, detecting "plain" objects and running them through\n\t * JSON.stringify if possible.\n\t * @param {Object} o\n\t * @returns {string}\n\t */\n\tfunction formatObject(o) {\n\t\tvar s = String(o);\n\t\tif(s === \'[object Object]\' && typeof JSON !== \'undefined\') {\n\t\t\ts = tryStringify(o, s);\n\t\t}\n\t\treturn s;\n\t}\n\n\t/**\n\t * Try to return the result of JSON.stringify(x).  If that fails, return\n\t * defaultValue\n\t * @param {*} x\n\t * @param {*} defaultValue\n\t * @returns {String|*} JSON.stringify(x) or defaultValue\n\t */\n\tfunction tryStringify(x, defaultValue) {\n\t\ttry {\n\t\t\treturn JSON.stringify(x);\n\t\t} catch(e) {\n\t\t\treturn defaultValue;\n\t\t}\n\t}\n\n});\n}(typeof define === \'function\' && define.amd ? define : function(factory) { module.exports = factory(); }));\n\n},{}],7:[function(require,module,exports){\n/** @license MIT License (c) copyright 2010-2014 original author or authors */\n/** @author Brian Cavalier */\n/** @author John Hann */\n\n(function(define) { \'use strict\';\ndefine(function() {\n\n\treturn function makePromise(environment) {\n\n\t\tvar tasks = environment.scheduler;\n\t\tvar emitRejection = initEmitRejection();\n\n\t\tvar objectCreate = Object.create ||\n\t\t\tfunction(proto) {\n\t\t\t\tfunction Child() {}\n\t\t\t\tChild.prototype = proto;\n\t\t\t\treturn new Child();\n\t\t\t};\n\n\t\t/**\n\t\t * Create a promise whose fate is determined by resolver\n\t\t * @constructor\n\t\t * @returns {Promise} promise\n\t\t * @name Promise\n\t\t */\n\t\tfunction Promise(resolver, handler) {\n\t\t\tthis._handler = resolver === Handler ? handler : init(resolver);\n\t\t}\n\n\t\t/**\n\t\t * Run the supplied resolver\n\t\t * @param resolver\n\t\t * @returns {Pending}\n\t\t */\n\t\tfunction init(resolver) {\n\t\t\tvar handler = new Pending();\n\n\t\t\ttry {\n\t\t\t\tresolver(promiseResolve, promiseReject, promiseNotify);\n\t\t\t} catch (e) {\n\t\t\t\tpromiseReject(e);\n\t\t\t}\n\n\t\t\treturn handler;\n\n\t\t\t/**\n\t\t\t * Transition from pre-resolution state to post-resolution state, notifying\n\t\t\t * all listeners of the ultimate fulfillment or rejection\n\t\t\t * @param {*} x resolution value\n\t\t\t */\n\t\t\tfunction promiseResolve (x) {\n\t\t\t\thandler.resolve(x);\n\t\t\t}\n\t\t\t/**\n\t\t\t * Reject this promise with reason, which will be used verbatim\n\t\t\t * @param {Error|*} reason rejection reason, strongly suggested\n\t\t\t *   to be an Error type\n\t\t\t */\n\t\t\tfunction promiseReject (reason) {\n\t\t\t\thandler.reject(reason);\n\t\t\t}\n\n\t\t\t/**\n\t\t\t * @deprecated\n\t\t\t * Issue a progress event, notifying all progress listeners\n\t\t\t * @param {*} x progress event payload to pass to all listeners\n\t\t\t */\n\t\t\tfunction promiseNotify (x) {\n\t\t\t\thandler.notify(x);\n\t\t\t}\n\t\t}\n\n\t\t// Creation\n\n\t\tPromise.resolve = resolve;\n\t\tPromise.reject = reject;\n\t\tPromise.never = never;\n\n\t\tPromise._defer = defer;\n\t\tPromise._handler = getHandler;\n\n\t\t/**\n\t\t * Returns a trusted promise. If x is already a trusted promise, it is\n\t\t * returned, otherwise returns a new trusted Promise which follows x.\n\t\t * @param  {*} x\n\t\t * @return {Promise} promise\n\t\t */\n\t\tfunction resolve(x) {\n\t\t\treturn isPromise(x) ? x\n\t\t\t\t: new Promise(Handler, new Async(getHandler(x)));\n\t\t}\n\n\t\t/**\n\t\t * Return a reject promise with x as its reason (x is used verbatim)\n\t\t * @param {*} x\n\t\t * @returns {Promise} rejected promise\n\t\t */\n\t\tfunction reject(x) {\n\t\t\treturn new Promise(Handler, new Async(new Rejected(x)));\n\t\t}\n\n\t\t/**\n\t\t * Return a promise that remains pending forever\n\t\t * @returns {Promise} forever-pending promise.\n\t\t */\n\t\tfunction never() {\n\t\t\treturn foreverPendingPromise; // Should be frozen\n\t\t}\n\n\t\t/**\n\t\t * Creates an internal {promise, resolver} pair\n\t\t * @private\n\t\t * @returns {Promise}\n\t\t */\n\t\tfunction defer() {\n\t\t\treturn new Promise(Handler, new Pending());\n\t\t}\n\n\t\t// Transformation and flow control\n\n\t\t/**\n\t\t * Transform this promise\'s fulfillment value, returning a new Promise\n\t\t * for the transformed result.  If the promise cannot be fulfilled, onRejected\n\t\t * is called with the reason.  onProgress *may* be called with updates toward\n\t\t * this promise\'s fulfillment.\n\t\t * @param {function=} onFulfilled fulfillment handler\n\t\t * @param {function=} onRejected rejection handler\n\t\t * @param {function=} onProgress @deprecated progress handler\n\t\t * @return {Promise} new promise\n\t\t */\n\t\tPromise.prototype.then = function(onFulfilled, onRejected, onProgress) {\n\t\t\tvar parent = this._handler;\n\t\t\tvar state = parent.join().state();\n\n\t\t\tif ((typeof onFulfilled !== \'function\' && state > 0) ||\n\t\t\t\t(typeof onRejected !== \'function\' && state < 0)) {\n\t\t\t\t// Short circuit: value will not change, simply share handler\n\t\t\t\treturn new this.constructor(Handler, parent);\n\t\t\t}\n\n\t\t\tvar p = this._beget();\n\t\t\tvar child = p._handler;\n\n\t\t\tparent.chain(child, parent.receiver, onFulfilled, onRejected, onProgress);\n\n\t\t\treturn p;\n\t\t};\n\n\t\t/**\n\t\t * If this promise cannot be fulfilled due to an error, call onRejected to\n\t\t * handle the error. Shortcut for .then(undefined, onRejected)\n\t\t * @param {function?} onRejected\n\t\t * @return {Promise}\n\t\t */\n\t\tPromise.prototype[\'catch\'] = function(onRejected) {\n\t\t\treturn this.then(void 0, onRejected);\n\t\t};\n\n\t\t/**\n\t\t * Creates a new, pending promise of the same type as this promise\n\t\t * @private\n\t\t * @returns {Promise}\n\t\t */\n\t\tPromise.prototype._beget = function() {\n\t\t\treturn begetFrom(this._handler, this.constructor);\n\t\t};\n\n\t\tfunction begetFrom(parent, Promise) {\n\t\t\tvar child = new Pending(parent.receiver, parent.join().context);\n\t\t\treturn new Promise(Handler, child);\n\t\t}\n\n\t\t// Array combinators\n\n\t\tPromise.all = all;\n\t\tPromise.race = race;\n\t\tPromise._traverse = traverse;\n\n\t\t/**\n\t\t * Return a promise that will fulfill when all promises in the\n\t\t * input array have fulfilled, or will reject when one of the\n\t\t * promises rejects.\n\t\t * @param {array} promises array of promises\n\t\t * @returns {Promise} promise for array of fulfillment values\n\t\t */\n\t\tfunction all(promises) {\n\t\t\treturn traverseWith(snd, null, promises);\n\t\t}\n\n\t\t/**\n\t\t * Array<Promise<X>> -> Promise<Array<f(X)>>\n\t\t * @private\n\t\t * @param {function} f function to apply to each promise\'s value\n\t\t * @param {Array} promises array of promises\n\t\t * @returns {Promise} promise for transformed values\n\t\t */\n\t\tfunction traverse(f, promises) {\n\t\t\treturn traverseWith(tryCatch2, f, promises);\n\t\t}\n\n\t\tfunction traverseWith(tryMap, f, promises) {\n\t\t\tvar handler = typeof f === \'function\' ? mapAt : settleAt;\n\n\t\t\tvar resolver = new Pending();\n\t\t\tvar pending = promises.length >>> 0;\n\t\t\tvar results = new Array(pending);\n\n\t\t\tfor (var i = 0, x; i < promises.length && !resolver.resolved; ++i) {\n\t\t\t\tx = promises[i];\n\n\t\t\t\tif (x === void 0 && !(i in promises)) {\n\t\t\t\t\t--pending;\n\t\t\t\t\tcontinue;\n\t\t\t\t}\n\n\t\t\t\ttraverseAt(promises, handler, i, x, resolver);\n\t\t\t}\n\n\t\t\tif(pending === 0) {\n\t\t\t\tresolver.become(new Fulfilled(results));\n\t\t\t}\n\n\t\t\treturn new Promise(Handler, resolver);\n\n\t\t\tfunction mapAt(i, x, resolver) {\n\t\t\t\tif(!resolver.resolved) {\n\t\t\t\t\ttraverseAt(promises, settleAt, i, tryMap(f, x, i), resolver);\n\t\t\t\t}\n\t\t\t}\n\n\t\t\tfunction settleAt(i, x, resolver) {\n\t\t\t\tresults[i] = x;\n\t\t\t\tif(--pending === 0) {\n\t\t\t\t\tresolver.become(new Fulfilled(results));\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\n\t\tfunction traverseAt(promises, handler, i, x, resolver) {\n\t\t\tif (maybeThenable(x)) {\n\t\t\t\tvar h = getHandlerMaybeThenable(x);\n\t\t\t\tvar s = h.state();\n\n\t\t\t\tif (s === 0) {\n\t\t\t\t\th.fold(handler, i, void 0, resolver);\n\t\t\t\t} else if (s > 0) {\n\t\t\t\t\thandler(i, h.value, resolver);\n\t\t\t\t} else {\n\t\t\t\t\tresolver.become(h);\n\t\t\t\t\tvisitRemaining(promises, i+1, h);\n\t\t\t\t}\n\t\t\t} else {\n\t\t\t\thandler(i, x, resolver);\n\t\t\t}\n\t\t}\n\n\t\tPromise._visitRemaining = visitRemaining;\n\t\tfunction visitRemaining(promises, start, handler) {\n\t\t\tfor(var i=start; i<promises.length; ++i) {\n\t\t\t\tmarkAsHandled(getHandler(promises[i]), handler);\n\t\t\t}\n\t\t}\n\n\t\tfunction markAsHandled(h, handler) {\n\t\t\tif(h === handler) {\n\t\t\t\treturn;\n\t\t\t}\n\n\t\t\tvar s = h.state();\n\t\t\tif(s === 0) {\n\t\t\t\th.visit(h, void 0, h._unreport);\n\t\t\t} else if(s < 0) {\n\t\t\t\th._unreport();\n\t\t\t}\n\t\t}\n\n\t\t/**\n\t\t * Fulfill-reject competitive race. Return a promise that will settle\n\t\t * to the same state as the earliest input promise to settle.\n\t\t *\n\t\t * WARNING: The ES6 Promise spec requires that race()ing an empty array\n\t\t * must return a promise that is pending forever.  This implementation\n\t\t * returns a singleton forever-pending promise, the same singleton that is\n\t\t * returned by Promise.never(), thus can be checked with ===\n\t\t *\n\t\t * @param {array} promises array of promises to race\n\t\t * @returns {Promise} if input is non-empty, a promise that will settle\n\t\t * to the same outcome as the earliest input promise to settle. if empty\n\t\t * is empty, returns a promise that will never settle.\n\t\t */\n\t\tfunction race(promises) {\n\t\t\tif(typeof promises !== \'object\' || promises === null) {\n\t\t\t\treturn reject(new TypeError(\'non-iterable passed to race()\'));\n\t\t\t}\n\n\t\t\t// Sigh, race([]) is untestable unless we return *something*\n\t\t\t// that is recognizable without calling .then() on it.\n\t\t\treturn promises.length === 0 ? never()\n\t\t\t\t : promises.length === 1 ? resolve(promises[0])\n\t\t\t\t : runRace(promises);\n\t\t}\n\n\t\tfunction runRace(promises) {\n\t\t\tvar resolver = new Pending();\n\t\t\tvar i, x, h;\n\t\t\tfor(i=0; i<promises.length; ++i) {\n\t\t\t\tx = promises[i];\n\t\t\t\tif (x === void 0 && !(i in promises)) {\n\t\t\t\t\tcontinue;\n\t\t\t\t}\n\n\t\t\t\th = getHandler(x);\n\t\t\t\tif(h.state() !== 0) {\n\t\t\t\t\tresolver.become(h);\n\t\t\t\t\tvisitRemaining(promises, i+1, h);\n\t\t\t\t\tbreak;\n\t\t\t\t} else {\n\t\t\t\t\th.visit(resolver, resolver.resolve, resolver.reject);\n\t\t\t\t}\n\t\t\t}\n\t\t\treturn new Promise(Handler, resolver);\n\t\t}\n\n\t\t// Promise internals\n\t\t// Below this, everything is @private\n\n\t\t/**\n\t\t * Get an appropriate handler for x, without checking for cycles\n\t\t * @param {*} x\n\t\t * @returns {object} handler\n\t\t */\n\t\tfunction getHandler(x) {\n\t\t\tif(isPromise(x)) {\n\t\t\t\treturn x._handler.join();\n\t\t\t}\n\t\t\treturn maybeThenable(x) ? getHandlerUntrusted(x) : new Fulfilled(x);\n\t\t}\n\n\t\t/**\n\t\t * Get a handler for thenable x.\n\t\t * NOTE: You must only call this if maybeThenable(x) == true\n\t\t * @param {object|function|Promise} x\n\t\t * @returns {object} handler\n\t\t */\n\t\tfunction getHandlerMaybeThenable(x) {\n\t\t\treturn isPromise(x) ? x._handler.join() : getHandlerUntrusted(x);\n\t\t}\n\n\t\t/**\n\t\t * Get a handler for potentially untrusted thenable x\n\t\t * @param {*} x\n\t\t * @returns {object} handler\n\t\t */\n\t\tfunction getHandlerUntrusted(x) {\n\t\t\ttry {\n\t\t\t\tvar untrustedThen = x.then;\n\t\t\t\treturn typeof untrustedThen === \'function\'\n\t\t\t\t\t? new Thenable(untrustedThen, x)\n\t\t\t\t\t: new Fulfilled(x);\n\t\t\t} catch(e) {\n\t\t\t\treturn new Rejected(e);\n\t\t\t}\n\t\t}\n\n\t\t/**\n\t\t * Handler for a promise that is pending forever\n\t\t * @constructor\n\t\t */\n\t\tfunction Handler() {}\n\n\t\tHandler.prototype.when\n\t\t\t= Handler.prototype.become\n\t\t\t= Handler.prototype.notify // deprecated\n\t\t\t= Handler.prototype.fail\n\t\t\t= Handler.prototype._unreport\n\t\t\t= Handler.prototype._report\n\t\t\t= noop;\n\n\t\tHandler.prototype._state = 0;\n\n\t\tHandler.prototype.state = function() {\n\t\t\treturn this._state;\n\t\t};\n\n\t\t/**\n\t\t * Recursively collapse handler chain to find the handler\n\t\t * nearest to the fully resolved value.\n\t\t * @returns {object} handler nearest the fully resolved value\n\t\t */\n\t\tHandler.prototype.join = function() {\n\t\t\tvar h = this;\n\t\t\twhile(h.handler !== void 0) {\n\t\t\t\th = h.handler;\n\t\t\t}\n\t\t\treturn h;\n\t\t};\n\n\t\tHandler.prototype.chain = function(to, receiver, fulfilled, rejected, progress) {\n\t\t\tthis.when({\n\t\t\t\tresolver: to,\n\t\t\t\treceiver: receiver,\n\t\t\t\tfulfilled: fulfilled,\n\t\t\t\trejected: rejected,\n\t\t\t\tprogress: progress\n\t\t\t});\n\t\t};\n\n\t\tHandler.prototype.visit = function(receiver, fulfilled, rejected, progress) {\n\t\t\tthis.chain(failIfRejected, receiver, fulfilled, rejected, progress);\n\t\t};\n\n\t\tHandler.prototype.fold = function(f, z, c, to) {\n\t\t\tthis.when(new Fold(f, z, c, to));\n\t\t};\n\n\t\t/**\n\t\t * Handler that invokes fail() on any handler it becomes\n\t\t * @constructor\n\t\t */\n\t\tfunction FailIfRejected() {}\n\n\t\tinherit(Handler, FailIfRejected);\n\n\t\tFailIfRejected.prototype.become = function(h) {\n\t\t\th.fail();\n\t\t};\n\n\t\tvar failIfRejected = new FailIfRejected();\n\n\t\t/**\n\t\t * Handler that manages a queue of consumers waiting on a pending promise\n\t\t * @constructor\n\t\t */\n\t\tfunction Pending(receiver, inheritedContext) {\n\t\t\tPromise.createContext(this, inheritedContext);\n\n\t\t\tthis.consumers = void 0;\n\t\t\tthis.receiver = receiver;\n\t\t\tthis.handler = void 0;\n\t\t\tthis.resolved = false;\n\t\t}\n\n\t\tinherit(Handler, Pending);\n\n\t\tPending.prototype._state = 0;\n\n\t\tPending.prototype.resolve = function(x) {\n\t\t\tthis.become(getHandler(x));\n\t\t};\n\n\t\tPending.prototype.reject = function(x) {\n\t\t\tif(this.resolved) {\n\t\t\t\treturn;\n\t\t\t}\n\n\t\t\tthis.become(new Rejected(x));\n\t\t};\n\n\t\tPending.prototype.join = function() {\n\t\t\tif (!this.resolved) {\n\t\t\t\treturn this;\n\t\t\t}\n\n\t\t\tvar h = this;\n\n\t\t\twhile (h.handler !== void 0) {\n\t\t\t\th = h.handler;\n\t\t\t\tif (h === this) {\n\t\t\t\t\treturn this.handler = cycle();\n\t\t\t\t}\n\t\t\t}\n\n\t\t\treturn h;\n\t\t};\n\n\t\tPending.prototype.run = function() {\n\t\t\tvar q = this.consumers;\n\t\t\tvar handler = this.handler;\n\t\t\tthis.handler = this.handler.join();\n\t\t\tthis.consumers = void 0;\n\n\t\t\tfor (var i = 0; i < q.length; ++i) {\n\t\t\t\thandler.when(q[i]);\n\t\t\t}\n\t\t};\n\n\t\tPending.prototype.become = function(handler) {\n\t\t\tif(this.resolved) {\n\t\t\t\treturn;\n\t\t\t}\n\n\t\t\tthis.resolved = true;\n\t\t\tthis.handler = handler;\n\t\t\tif(this.consumers !== void 0) {\n\t\t\t\ttasks.enqueue(this);\n\t\t\t}\n\n\t\t\tif(this.context !== void 0) {\n\t\t\t\thandler._report(this.context);\n\t\t\t}\n\t\t};\n\n\t\tPending.prototype.when = function(continuation) {\n\t\t\tif(this.resolved) {\n\t\t\t\ttasks.enqueue(new ContinuationTask(continuation, this.handler));\n\t\t\t} else {\n\t\t\t\tif(this.consumers === void 0) {\n\t\t\t\t\tthis.consumers = [continuation];\n\t\t\t\t} else {\n\t\t\t\t\tthis.consumers.push(continuation);\n\t\t\t\t}\n\t\t\t}\n\t\t};\n\n\t\t/**\n\t\t * @deprecated\n\t\t */\n\t\tPending.prototype.notify = function(x) {\n\t\t\tif(!this.resolved) {\n\t\t\t\ttasks.enqueue(new ProgressTask(x, this));\n\t\t\t}\n\t\t};\n\n\t\tPending.prototype.fail = function(context) {\n\t\t\tvar c = typeof context === \'undefined\' ? this.context : context;\n\t\t\tthis.resolved && this.handler.join().fail(c);\n\t\t};\n\n\t\tPending.prototype._report = function(context) {\n\t\t\tthis.resolved && this.handler.join()._report(context);\n\t\t};\n\n\t\tPending.prototype._unreport = function() {\n\t\t\tthis.resolved && this.handler.join()._unreport();\n\t\t};\n\n\t\t/**\n\t\t * Wrap another handler and force it into a future stack\n\t\t * @param {object} handler\n\t\t * @constructor\n\t\t */\n\t\tfunction Async(handler) {\n\t\t\tthis.handler = handler;\n\t\t}\n\n\t\tinherit(Handler, Async);\n\n\t\tAsync.prototype.when = function(continuation) {\n\t\t\ttasks.enqueue(new ContinuationTask(continuation, this));\n\t\t};\n\n\t\tAsync.prototype._report = function(context) {\n\t\t\tthis.join()._report(context);\n\t\t};\n\n\t\tAsync.prototype._unreport = function() {\n\t\t\tthis.join()._unreport();\n\t\t};\n\n\t\t/**\n\t\t * Handler that wraps an untrusted thenable and assimilates it in a future stack\n\t\t * @param {function} then\n\t\t * @param {{then: function}} thenable\n\t\t * @constructor\n\t\t */\n\t\tfunction Thenable(then, thenable) {\n\t\t\tPending.call(this);\n\t\t\ttasks.enqueue(new AssimilateTask(then, thenable, this));\n\t\t}\n\n\t\tinherit(Pending, Thenable);\n\n\t\t/**\n\t\t * Handler for a fulfilled promise\n\t\t * @param {*} x fulfillment value\n\t\t * @constructor\n\t\t */\n\t\tfunction Fulfilled(x) {\n\t\t\tPromise.createContext(this);\n\t\t\tthis.value = x;\n\t\t}\n\n\t\tinherit(Handler, Fulfilled);\n\n\t\tFulfilled.prototype._state = 1;\n\n\t\tFulfilled.prototype.fold = function(f, z, c, to) {\n\t\t\trunContinuation3(f, z, this, c, to);\n\t\t};\n\n\t\tFulfilled.prototype.when = function(cont) {\n\t\t\trunContinuation1(cont.fulfilled, this, cont.receiver, cont.resolver);\n\t\t};\n\n\t\tvar errorId = 0;\n\n\t\t/**\n\t\t * Handler for a rejected promise\n\t\t * @param {*} x rejection reason\n\t\t * @constructor\n\t\t */\n\t\tfunction Rejected(x) {\n\t\t\tPromise.createContext(this);\n\n\t\t\tthis.id = ++errorId;\n\t\t\tthis.value = x;\n\t\t\tthis.handled = false;\n\t\t\tthis.reported = false;\n\n\t\t\tthis._report();\n\t\t}\n\n\t\tinherit(Handler, Rejected);\n\n\t\tRejected.prototype._state = -1;\n\n\t\tRejected.prototype.fold = function(f, z, c, to) {\n\t\t\tto.become(this);\n\t\t};\n\n\t\tRejected.prototype.when = function(cont) {\n\t\t\tif(typeof cont.rejected === \'function\') {\n\t\t\t\tthis._unreport();\n\t\t\t}\n\t\t\trunContinuation1(cont.rejected, this, cont.receiver, cont.resolver);\n\t\t};\n\n\t\tRejected.prototype._report = function(context) {\n\t\t\ttasks.afterQueue(new ReportTask(this, context));\n\t\t};\n\n\t\tRejected.prototype._unreport = function() {\n\t\t\tif(this.handled) {\n\t\t\t\treturn;\n\t\t\t}\n\t\t\tthis.handled = true;\n\t\t\ttasks.afterQueue(new UnreportTask(this));\n\t\t};\n\n\t\tRejected.prototype.fail = function(context) {\n\t\t\tthis.reported = true;\n\t\t\temitRejection(\'unhandledRejection\', this);\n\t\t\tPromise.onFatalRejection(this, context === void 0 ? this.context : context);\n\t\t};\n\n\t\tfunction ReportTask(rejection, context) {\n\t\t\tthis.rejection = rejection;\n\t\t\tthis.context = context;\n\t\t}\n\n\t\tReportTask.prototype.run = function() {\n\t\t\tif(!this.rejection.handled && !this.rejection.reported) {\n\t\t\t\tthis.rejection.reported = true;\n\t\t\t\temitRejection(\'unhandledRejection\', this.rejection) ||\n\t\t\t\t\tPromise.onPotentiallyUnhandledRejection(this.rejection, this.context);\n\t\t\t}\n\t\t};\n\n\t\tfunction UnreportTask(rejection) {\n\t\t\tthis.rejection = rejection;\n\t\t}\n\n\t\tUnreportTask.prototype.run = function() {\n\t\t\tif(this.rejection.reported) {\n\t\t\t\temitRejection(\'rejectionHandled\', this.rejection) ||\n\t\t\t\t\tPromise.onPotentiallyUnhandledRejectionHandled(this.rejection);\n\t\t\t}\n\t\t};\n\n\t\t// Unhandled rejection hooks\n\t\t// By default, everything is a noop\n\n\t\tPromise.createContext\n\t\t\t= Promise.enterContext\n\t\t\t= Promise.exitContext\n\t\t\t= Promise.onPotentiallyUnhandledRejection\n\t\t\t= Promise.onPotentiallyUnhandledRejectionHandled\n\t\t\t= Promise.onFatalRejection\n\t\t\t= noop;\n\n\t\t// Errors and singletons\n\n\t\tvar foreverPendingHandler = new Handler();\n\t\tvar foreverPendingPromise = new Promise(Handler, foreverPendingHandler);\n\n\t\tfunction cycle() {\n\t\t\treturn new Rejected(new TypeError(\'Promise cycle\'));\n\t\t}\n\n\t\t// Task runners\n\n\t\t/**\n\t\t * Run a single consumer\n\t\t * @constructor\n\t\t */\n\t\tfunction ContinuationTask(continuation, handler) {\n\t\t\tthis.continuation = continuation;\n\t\t\tthis.handler = handler;\n\t\t}\n\n\t\tContinuationTask.prototype.run = function() {\n\t\t\tthis.handler.join().when(this.continuation);\n\t\t};\n\n\t\t/**\n\t\t * Run a queue of progress handlers\n\t\t * @constructor\n\t\t */\n\t\tfunction ProgressTask(value, handler) {\n\t\t\tthis.handler = handler;\n\t\t\tthis.value = value;\n\t\t}\n\n\t\tProgressTask.prototype.run = function() {\n\t\t\tvar q = this.handler.consumers;\n\t\t\tif(q === void 0) {\n\t\t\t\treturn;\n\t\t\t}\n\n\t\t\tfor (var c, i = 0; i < q.length; ++i) {\n\t\t\t\tc = q[i];\n\t\t\t\trunNotify(c.progress, this.value, this.handler, c.receiver, c.resolver);\n\t\t\t}\n\t\t};\n\n\t\t/**\n\t\t * Assimilate a thenable, sending it\'s value to resolver\n\t\t * @param {function} then\n\t\t * @param {object|function} thenable\n\t\t * @param {object} resolver\n\t\t * @constructor\n\t\t */\n\t\tfunction AssimilateTask(then, thenable, resolver) {\n\t\t\tthis._then = then;\n\t\t\tthis.thenable = thenable;\n\t\t\tthis.resolver = resolver;\n\t\t}\n\n\t\tAssimilateTask.prototype.run = function() {\n\t\t\tvar h = this.resolver;\n\t\t\ttryAssimilate(this._then, this.thenable, _resolve, _reject, _notify);\n\n\t\t\tfunction _resolve(x) { h.resolve(x); }\n\t\t\tfunction _reject(x)  { h.reject(x); }\n\t\t\tfunction _notify(x)  { h.notify(x); }\n\t\t};\n\n\t\tfunction tryAssimilate(then, thenable, resolve, reject, notify) {\n\t\t\ttry {\n\t\t\t\tthen.call(thenable, resolve, reject, notify);\n\t\t\t} catch (e) {\n\t\t\t\treject(e);\n\t\t\t}\n\t\t}\n\n\t\t/**\n\t\t * Fold a handler value with z\n\t\t * @constructor\n\t\t */\n\t\tfunction Fold(f, z, c, to) {\n\t\t\tthis.f = f; this.z = z; this.c = c; this.to = to;\n\t\t\tthis.resolver = failIfRejected;\n\t\t\tthis.receiver = this;\n\t\t}\n\n\t\tFold.prototype.fulfilled = function(x) {\n\t\t\tthis.f.call(this.c, this.z, x, this.to);\n\t\t};\n\n\t\tFold.prototype.rejected = function(x) {\n\t\t\tthis.to.reject(x);\n\t\t};\n\n\t\tFold.prototype.progress = function(x) {\n\t\t\tthis.to.notify(x);\n\t\t};\n\n\t\t// Other helpers\n\n\t\t/**\n\t\t * @param {*} x\n\t\t * @returns {boolean} true iff x is a trusted Promise\n\t\t */\n\t\tfunction isPromise(x) {\n\t\t\treturn x instanceof Promise;\n\t\t}\n\n\t\t/**\n\t\t * Test just enough to rule out primitives, in order to take faster\n\t\t * paths in some code\n\t\t * @param {*} x\n\t\t * @returns {boolean} false iff x is guaranteed *not* to be a thenable\n\t\t */\n\t\tfunction maybeThenable(x) {\n\t\t\treturn (typeof x === \'object\' || typeof x === \'function\') && x !== null;\n\t\t}\n\n\t\tfunction runContinuation1(f, h, receiver, next) {\n\t\t\tif(typeof f !== \'function\') {\n\t\t\t\treturn next.become(h);\n\t\t\t}\n\n\t\t\tPromise.enterContext(h);\n\t\t\ttryCatchReject(f, h.value, receiver, next);\n\t\t\tPromise.exitContext();\n\t\t}\n\n\t\tfunction runContinuation3(f, x, h, receiver, next) {\n\t\t\tif(typeof f !== \'function\') {\n\t\t\t\treturn next.become(h);\n\t\t\t}\n\n\t\t\tPromise.enterContext(h);\n\t\t\ttryCatchReject3(f, x, h.value, receiver, next);\n\t\t\tPromise.exitContext();\n\t\t}\n\n\t\t/**\n\t\t * @deprecated\n\t\t */\n\t\tfunction runNotify(f, x, h, receiver, next) {\n\t\t\tif(typeof f !== \'function\') {\n\t\t\t\treturn next.notify(x);\n\t\t\t}\n\n\t\t\tPromise.enterContext(h);\n\t\t\ttryCatchReturn(f, x, receiver, next);\n\t\t\tPromise.exitContext();\n\t\t}\n\n\t\tfunction tryCatch2(f, a, b) {\n\t\t\ttry {\n\t\t\t\treturn f(a, b);\n\t\t\t} catch(e) {\n\t\t\t\treturn reject(e);\n\t\t\t}\n\t\t}\n\n\t\t/**\n\t\t * Return f.call(thisArg, x), or if it throws return a rejected promise for\n\t\t * the thrown exception\n\t\t */\n\t\tfunction tryCatchReject(f, x, thisArg, next) {\n\t\t\ttry {\n\t\t\t\tnext.become(getHandler(f.call(thisArg, x)));\n\t\t\t} catch(e) {\n\t\t\t\tnext.become(new Rejected(e));\n\t\t\t}\n\t\t}\n\n\t\t/**\n\t\t * Same as above, but includes the extra argument parameter.\n\t\t */\n\t\tfunction tryCatchReject3(f, x, y, thisArg, next) {\n\t\t\ttry {\n\t\t\t\tf.call(thisArg, x, y, next);\n\t\t\t} catch(e) {\n\t\t\t\tnext.become(new Rejected(e));\n\t\t\t}\n\t\t}\n\n\t\t/**\n\t\t * @deprecated\n\t\t * Return f.call(thisArg, x), or if it throws, *return* the exception\n\t\t */\n\t\tfunction tryCatchReturn(f, x, thisArg, next) {\n\t\t\ttry {\n\t\t\t\tnext.notify(f.call(thisArg, x));\n\t\t\t} catch(e) {\n\t\t\t\tnext.notify(e);\n\t\t\t}\n\t\t}\n\n\t\tfunction inherit(Parent, Child) {\n\t\t\tChild.prototype = objectCreate(Parent.prototype);\n\t\t\tChild.prototype.constructor = Child;\n\t\t}\n\n\t\tfunction snd(x, y) {\n\t\t\treturn y;\n\t\t}\n\n\t\tfunction noop() {}\n\n\t\tfunction initEmitRejection() {\n\t\t\t/*global process, self, CustomEvent*/\n\t\t\tif(typeof process !== \'undefined\' && process !== null\n\t\t\t\t&& typeof process.emit === \'function\') {\n\t\t\t\t// Returning falsy here means to call the default\n\t\t\t\t// onPotentiallyUnhandledRejection API.  This is safe even in\n\t\t\t\t// browserify since process.emit always returns falsy in browserify:\n\t\t\t\t// https://github.com/defunctzombie/node-process/blob/master/browser.js#L40-L46\n\t\t\t\treturn function(type, rejection) {\n\t\t\t\t\treturn type === \'unhandledRejection\'\n\t\t\t\t\t\t? process.emit(type, rejection.value, rejection)\n\t\t\t\t\t\t: process.emit(type, rejection);\n\t\t\t\t};\n\t\t\t} else if(typeof self !== \'undefined\' && typeof CustomEvent === \'function\') {\n\t\t\t\treturn (function(noop, self, CustomEvent) {\n\t\t\t\t\tvar hasCustomEvent = false;\n\t\t\t\t\ttry {\n\t\t\t\t\t\tvar ev = new CustomEvent(\'unhandledRejection\');\n\t\t\t\t\t\thasCustomEvent = ev instanceof CustomEvent;\n\t\t\t\t\t} catch (e) {}\n\n\t\t\t\t\treturn !hasCustomEvent ? noop : function(type, rejection) {\n\t\t\t\t\t\tvar ev = new CustomEvent(type, {\n\t\t\t\t\t\t\tdetail: {\n\t\t\t\t\t\t\t\treason: rejection.value,\n\t\t\t\t\t\t\t\tkey: rejection\n\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\tbubbles: false,\n\t\t\t\t\t\t\tcancelable: true\n\t\t\t\t\t\t});\n\n\t\t\t\t\t\treturn !self.dispatchEvent(ev);\n\t\t\t\t\t};\n\t\t\t\t}(noop, self, CustomEvent));\n\t\t\t}\n\n\t\t\treturn noop;\n\t\t}\n\n\t\treturn Promise;\n\t};\n});\n}(typeof define === \'function\' && define.amd ? define : function(factory) { module.exports = factory(); }));\n\n},{}]},{},[1])\n(1)\n});\n;';
    loader.global.define = undefined;
    loader.global.module = undefined;
    loader.global.exports = undefined;
    loader.__exec({
        'source': source,
        'address': module.uri
    });
    loader.global.require = require;
    loader.global.define = define;
    return loader.get('@@global-helpers').retrieveGlobal(module.id, false);
});
/*can-connect@0.0.2#helpers/helpers*/
define('can-connect@0.0.2#helpers/helpers', function (require, exports, module) {
    require('when/es6-shim/Promise');
    var strReplacer = /\{([^\}]+)\}/g, isContainer = function (current) {
            return /^f|^o/.test(typeof current);
        };
    var helpers;
    module.exports = helpers = {
        extend: function (d, s) {
            for (var name in s) {
                d[name] = s[name];
            }
            return d;
        },
        deferred: function () {
            var def = {};
            def.promise = new Promise(function (resolve, reject) {
                def.resolve = resolve;
                def.reject = reject;
            });
            return def;
        },
        each: function (obj, cb) {
            for (var prop in obj) {
                cb(obj[prop], prop);
            }
            return obj;
        },
        getObject: function (prop, data, remove) {
            var res = data[prop];
            if (remove) {
                delete data[prop];
            }
            return res;
        },
        sub: function (str, data, remove) {
            var obs = [];
            str = str || '';
            obs.push(str.replace(strReplacer, function (whole, inside) {
                var ob = helpers.getObject(inside, data, remove);
                if (ob === undefined || ob === null) {
                    obs = null;
                    return '';
                }
                if (isContainer(ob) && obs) {
                    obs.push(ob);
                    return '';
                }
                return '' + ob;
            }));
            return obs === null ? obs : obs.length <= 1 ? obs[0] : obs;
        }
    };
});
/*can-connect@0.0.2#can-connect*/
define('can-connect@0.0.2#can-connect', function (require, exports, module) {
    var helpers = require('./helpers/');
    var connect = function (behaviors, options) {
        behaviors = behaviors.map(function (behavior, index) {
            var sortedIndex;
            if (typeof behavior === 'string') {
                sortedIndex = connect.order.indexOf(behavior);
                behavior = behaviorsMap[behavior];
            } else if (behavior.isBehavior) {
            } else {
                behavior = connect.behavior(behavior);
            }
            return {
                originalIndex: index,
                sortedIndex: sortedIndex,
                behavior: behavior
            };
        }).sort(function (b1, b2) {
            if (b1.sortedIndex != null && b2.sortedIndex != null) {
                return b1.sortedIndex - b2.sortedIndex;
            }
            return b1.originalIndex - b2.originalIndex;
        }).map(function (b) {
            return b.behavior;
        });
        var behavior = core(connect.behavior('options', function () {
                return options;
            })());
        behaviors.forEach(function (behave) {
            behavior = behave(behavior);
        });
        if (behavior.init) {
            behavior.init();
        }
        return behavior;
    };
    connect.order = [
        'data-localstorage-cache',
        'data-url',
        'data-parse',
        'cache-requests',
        'data-combine-requests',
        'constructor',
        'constructor-store',
        'can-map',
        'fall-through-cache',
        'data-inline-cache',
        'data-callbacks-cache',
        'data-callbacks',
        'constructor-callbacks-once'
    ];
    connect.behavior = function (name, behavior) {
        if (typeof name !== 'string') {
            behavior = name;
            name = undefined;
        }
        var behaviorMixin = function (base) {
            var Behavior = function () {
            };
            Behavior.name = name;
            Behavior.prototype = base;
            var newBehavior = new Behavior();
            var res = behavior.apply(newBehavior, arguments);
            helpers.extend(newBehavior, res);
            newBehavior.__behaviorName = name;
            return newBehavior;
        };
        if (name) {
            behaviorMixin.name = name;
            behaviorsMap[name] = behaviorMixin;
        }
        behaviorMixin.isBehavior = true;
        return behaviorMixin;
    };
    var behaviorsMap = {};
    var core = connect.behavior('base', function (base) {
            return {
                id: function (instance) {
                    return instance[this.idProp || 'id'];
                },
                idProp: base.idProp || 'id',
                listSet: function (list) {
                    return list[this.listSetProp];
                },
                listSetProp: '__set',
                init: function () {
                }
            };
        });
    connect.base = core;
    module.exports = connect;
});
/*can-connect@0.0.2#can/can*/
define('can-connect@0.0.2#can/can', function (require, exports, module) {
    var can = require('can/util/util');
    can.isPromise = can.isDeferred = function (obj) {
        return obj && (window.Promise && obj instanceof Promise || can.isFunction(obj.then) && can.isFunction(obj['catch'] || obj.fail));
    };
});
/*can-connect@0.0.2#can/tag/tag*/
define('can-connect@0.0.2#can/tag/tag', function (require, exports, module) {
    var connect = require('can-connect');
    var can = require('can/util/util');
    require('can/compute/compute');
    require('can/view/bindings/bindings');
    require('../can');
    var mustacheCore = require('can/view/stache/mustache_core');
    connect.tag = function (tagName, connection) {
        var removeBrackets = function (value, open, close) {
            open = open || '{';
            close = close || '}';
            if (value[0] === open && value[value.length - 1] === close) {
                return value.substr(1, value.length - 2);
            }
            return value;
        };
        can.view.tag(tagName, function (el, tagData) {
            var getList = el.getAttribute('getList') || el.getAttribute('get-list');
            var getInstance = el.getAttribute('get');
            var attrValue = getList || getInstance;
            var method = getList ? 'getList' : 'get';
            var attrInfo = mustacheCore.expressionData('tmp ' + removeBrackets(attrValue));
            var addedToPageData = false;
            var addToPageData = can.__notObserve(function (set, promise) {
                    if (!addedToPageData) {
                        var root = tagData.scope.attr('@root');
                        if (root && root.pageData) {
                            if (method === 'get') {
                                set = connection.id(set);
                            }
                            root.pageData(connection.name, set, promise);
                        }
                    }
                    addedToPageData = true;
                });
            var request = can.compute(function () {
                    var hash = {};
                    can.each(attrInfo.hash, function (val, key) {
                        if (val && val.hasOwnProperty('get')) {
                            hash[key] = tagData.scope.read(val.get, {}).value;
                        } else {
                            hash[key] = val;
                        }
                    });
                    var promise = connection[method](hash);
                    addToPageData(hash, promise);
                    return promise;
                });
            can.data(can.$(el), 'viewModel', request);
            var nodeList = can.view.nodeLists.register([], undefined, true);
            var frag = tagData.subtemplate ? tagData.subtemplate(tagData.scope.add(request), tagData.options, nodeList) : document.createDocumentFragment();
            can.appendChild(el, frag);
            can.view.nodeLists.update(nodeList, el.childNodes);
            can.one.call(el, 'removed', function () {
                can.view.nodeLists.unregister(nodeList);
            });
        });
    };
    module.exports = connect.tag;
});
/*can-connect@0.0.2#helpers/weak-reference-map*/
define('can-connect@0.0.2#helpers/weak-reference-map', function (require, exports, module) {
    var helpers = require('can-connect/helpers/');
    var WeakReferenceMap = function () {
        this.set = {};
    };
    helpers.extend(WeakReferenceMap.prototype, {
        has: function (key) {
            return !!this.set[key];
        },
        addReference: function (key, item) {
            var data = this.set[key];
            if (!data) {
                data = this.set[key] = {
                    item: item,
                    referenceCount: 0,
                    key: key
                };
            }
            data.referenceCount++;
        },
        deleteReference: function (key) {
            var data = this.set[key];
            if (data) {
                data.referenceCount--;
                if (data.referenceCount === 0) {
                    delete this.set[key];
                }
            }
        },
        get: function (key) {
            var data = this.set[key];
            if (data) {
                return data.item;
            }
        },
        forEach: function (cb) {
            for (var id in this.set) {
                cb(this.set[id].item, id);
            }
        }
    });
    module.exports = WeakReferenceMap;
});
/*can-connect@0.0.2#helpers/overwrite*/
define('can-connect@0.0.2#helpers/overwrite', function (require, exports, module) {
    module.exports = function (d, s, id) {
        for (var prop in d) {
            if (prop !== id && !(prop in s)) {
                delete d[prop];
            }
        }
        for (prop in s) {
            d[prop] = s[prop];
        }
        return d;
    };
});
/*can-connect@0.0.2#helpers/id-merge*/
define('can-connect@0.0.2#helpers/id-merge', function (require, exports, module) {
    module.exports = function (list, update, id, make) {
        var listIndex = 0, updateIndex = 0;
        while (listIndex < list.length && updateIndex < update.length) {
            var listItem = list[listIndex], updateItem = update[updateIndex], lID = id(listItem), uID = id(updateItem);
            if (id(listItem) === id(updateItem)) {
                listIndex++;
                updateIndex++;
                continue;
            }
            if (updateIndex + 1 < update.length && id(update[updateIndex + 1]) === lID) {
                list.splice(listIndex, 0, make(update[updateIndex]));
                listIndex++;
                updateIndex++;
                continue;
            } else if (listIndex + 1 < list.length && id(list[listIndex + 1]) === uID) {
                list.splice(listIndex, 1);
                listIndex++;
                updateIndex++;
                continue;
            } else {
                list.splice.apply(list, [
                    listIndex,
                    list.length - listIndex
                ].concat(update.slice(updateIndex).map(make)));
                return list;
            }
        }
        if (updateIndex === update.length && listIndex === list.length) {
            return;
        }
        list.splice.apply(list, [
            listIndex,
            list.length - listIndex
        ].concat(update.slice(updateIndex).map(make)));
        return;
    };
});
/*can-connect@0.0.2#constructor/constructor*/
define('can-connect@0.0.2#constructor/constructor', function (require, exports, module) {
    var connect = require('can-connect');
    var WeakReferenceMap = require('can-connect/helpers/weak-reference-map');
    var overwrite = require('can-connect/helpers/overwrite');
    var idMerge = require('can-connect/helpers/id-merge');
    var helpers = require('can-connect/helpers/');
    module.exports = connect.behavior('constructor', function (baseConnect) {
        var behavior = {
                cidStore: new WeakReferenceMap(),
                _cid: 0,
                get: function (params) {
                    var self = this;
                    return this.getData(params).then(function (data) {
                        return self.hydrateInstance(data);
                    });
                },
                getList: function (set) {
                    var self = this;
                    return this.getListData(set).then(function (data) {
                        return self.hydrateList(data, set);
                    });
                },
                hydrateList: function (listData, set) {
                    if (Array.isArray(listData)) {
                        listData = { data: listData };
                    }
                    var arr = [];
                    for (var i = 0; i < listData.data.length; i++) {
                        arr.push(this.hydrateInstance(listData.data[i]));
                    }
                    listData.data = arr;
                    if (this.list) {
                        return this.list(listData, set);
                    } else {
                        var list = listData.data.slice(0);
                        list.__set = set;
                        return list;
                    }
                },
                hydrateInstance: function (props) {
                    if (this.instance) {
                        return this.instance(props);
                    } else {
                        return helpers.extend({}, props);
                    }
                },
                save: function (instance) {
                    var serialized = this.serializeInstance(instance);
                    var id = this.id(instance);
                    var self = this;
                    if (id === undefined) {
                        var cid = this._cid++;
                        this.cidStore.addReference(cid, instance);
                        return this.createData(serialized, cid).then(function (data) {
                            if (data !== undefined) {
                                self.createdInstance(instance, data);
                            }
                            self.cidStore.deleteReference(cid, instance);
                            return instance;
                        });
                    } else {
                        return this.updateData(serialized).then(function (data) {
                            if (data !== undefined) {
                                self.updatedInstance(instance, data);
                            }
                            return instance;
                        });
                    }
                },
                destroy: function (instance) {
                    var serialized = this.serializeInstance(instance), self = this;
                    return this.destroyData(serialized).then(function (data) {
                        if (data !== undefined) {
                            self.destroyedInstance(instance, data);
                        }
                        return instance;
                    });
                },
                createdInstance: function (instance, props) {
                    helpers.extend(instance, props);
                },
                updatedInstance: function (instance, data) {
                    overwrite(instance, data, this.idProp);
                },
                updatedList: function (list, listData, set) {
                    var instanceList = [];
                    for (var i = 0; i < listData.data.length; i++) {
                        instanceList.push(this.hydrateInstance(listData.data[i]));
                    }
                    idMerge(list, instanceList, this.id.bind(this), this.hydrateInstance.bind(this));
                },
                destroyedInstance: function (instance, data) {
                    overwrite(instance, data, this.idProp);
                },
                serializeInstance: function (instance) {
                    return helpers.extend({}, instance);
                },
                serializeList: function (list) {
                    var self = this;
                    return list.map(function (instance) {
                        return self.serializeInstance(instance);
                    });
                },
                isNew: function (instance) {
                    var id = this.id(instance);
                    return !(id || id === 0);
                }
            };
        return behavior;
    });
});
/*can-connect@0.0.2#can/map/map*/
define('can-connect@0.0.2#can/map/map', function (require, exports, module) {
    require('when/es6-shim/Promise');
    require('../can');
    var can = require('can/util/util');
    var connect = require('can-connect');
    var Map = require('can/map/map');
    var List = require('can/list/list');
    module.exports = connect.behavior('can-map', function (baseConnect) {
        var behavior = {
                init: function () {
                    overwrite(this, this.Map, mapOverwrites, mapStaticOverwrites);
                    overwrite(this, this.List, listPrototypeOverwrites, listStaticOverwrites);
                    baseConnect.init.apply(this, arguments);
                },
                id: function (instance) {
                    var idProp = this.idProp;
                    if (instance instanceof can.Map) {
                        if (callCanReadingOnIdRead) {
                            can.__observe(instance, idProp);
                        }
                        return instance.__get(idProp);
                    } else {
                        return instance[idProp];
                    }
                },
                serializeInstance: function (instance) {
                    return instance.serialize();
                },
                serializeList: function (list) {
                    return list.serialize();
                },
                instance: function (props) {
                    return new (this.Map || Map)(props);
                },
                list: function (listData, set) {
                    var list = new (this.List || this.Map && this.Map.List || List)(listData.data);
                    can.each(listData, function (val, prop) {
                        if (prop !== 'data') {
                            list.attr(prop, val);
                        }
                    });
                    list.__set = set;
                    return list;
                },
                updatedList: function () {
                    can.batch.start();
                    var res = baseConnect.updatedList.apply(this, arguments);
                    can.batch.stop();
                    return res;
                }
            };
        can.each([
            'created',
            'updated',
            'destroyed'
        ], function (funcName) {
            behavior[funcName + 'Instance'] = function (instance, props) {
                var constructor = instance.constructor;
                if (props && typeof props === 'object') {
                    instance.attr(can.isFunction(props.attr) ? props.attr() : props, this.constructor.removeAttr || false);
                }
                can.dispatch.call(instance, {
                    type: funcName,
                    target: instance
                });
                can.dispatch.call(constructor, funcName, [instance]);
            };
        });
        return behavior;
    });
    var callCanReadingOnIdRead = true;
    var mapStaticOverwrites = {
            getList: function (base, connection) {
                return function (set) {
                    return connection.getList(set);
                };
            },
            get: function (base, connection) {
                return function (params) {
                    return connection.get(params);
                };
            }
        };
    var mapOverwrites = {
            _bindsetup: function (base, connection) {
                return function () {
                    callCanReadingOnIdRead = false;
                    connection.addInstanceReference(this);
                    callCanReadingOnIdRead = true;
                    return base.apply(this, arguments);
                };
            },
            _bindteardown: function (base, connection) {
                return function () {
                    callCanReadingOnIdRead = false;
                    connection.deleteInstanceReference(this);
                    callCanReadingOnIdRead = true;
                    return base.apply(this, arguments);
                };
            },
            ___set: function (base, connection) {
                return function (prop, val) {
                    base.apply(this, arguments);
                    if (prop === connection.idProp && this._bindings) {
                        connection.addInstanceReference(this);
                    }
                };
            },
            isNew: function (base, connection) {
                return function () {
                    var id = connection.id(this);
                    return !(id || id === 0);
                };
            },
            save: function (base, connection) {
                return function (success, error) {
                    var promise = connection.save(this);
                    promise.then(success, error);
                    return promise;
                };
            },
            destroy: function (base, connection) {
                return function (success, error) {
                    var promise;
                    if (this.isNew()) {
                        promise = Promise.resolve(this);
                        connection.destroyedInstance(this, {});
                    } else {
                        promise = connection.destroy(this);
                    }
                    promise.then(success, error);
                    return promise;
                };
            }
        };
    var listPrototypeOverwrites = {
            setup: function (base, connection) {
                return function (params) {
                    if (can.isPlainObject(params) && !can.isArray(params)) {
                        base.apply(this);
                        this.replace(can.isDeferred(params) ? params : connection.getList(params));
                    } else {
                        base.apply(this, arguments);
                    }
                    this._init = 1;
                    this.bind('destroyed', can.proxy(this._destroyed, this));
                    delete this._init;
                };
            },
            _destroyed: function () {
                return function (ev, attr) {
                    if (/\w+/.test(attr)) {
                        var index;
                        while ((index = this.indexOf(ev.target)) > -1) {
                            this.splice(index, 1);
                        }
                    }
                };
            },
            _bindsetup: function (base, connection) {
                return function () {
                    connection.addListReference(this);
                    return base.apply(this, arguments);
                };
            },
            _bindteardown: function (base, connection) {
                return function () {
                    connection.deleteListReference(this);
                    return base.apply(this, arguments);
                };
            }
        };
    var listStaticOverwrites = {
            _bubbleRule: function (base, connection) {
                return function (eventName, list) {
                    var bubbleRules = base(eventName, list);
                    bubbleRules.push('destroyed');
                    return bubbleRules;
                };
            }
        };
    var overwrite = function (connection, Constructor, prototype, statics) {
        for (var prop in prototype) {
            Constructor.prototype[prop] = prototype[prop](Constructor.prototype[prop], connection);
        }
        if (statics) {
            for (var prop in statics) {
                Constructor[prop] = statics[prop](Constructor[prop], connection);
            }
        }
    };
});
/*can-connect@0.0.2#helpers/sorted-set-json*/
define('can-connect@0.0.2#helpers/sorted-set-json', function (require, exports, module) {
    module.exports = function (set) {
        if (set == null) {
            return set;
        } else {
            var sorted = {};
            Object.keys(set).sort().forEach(function (prop) {
                sorted[prop] = set[prop];
            });
            return JSON.stringify(sorted);
        }
    };
});
/*can-connect@0.0.2#constructor/store/store*/
define('can-connect@0.0.2#constructor/store/store', function (require, exports, module) {
    var connect = require('can-connect');
    var WeakReferenceMap = require('can-connect/helpers/weak-reference-map');
    var sortedSetJSON = require('can-connect/helpers/sorted-set-json');
    module.exports = connect.behavior('constructor-store', function (baseConnect) {
        var behavior = {
                instanceStore: new WeakReferenceMap(),
                listStore: new WeakReferenceMap(),
                _requestInstances: {},
                _requestLists: {},
                _pendingRequests: 0,
                _finishedRequest: function () {
                    this._pendingRequests--;
                    if (this._pendingRequests === 0) {
                        for (var id in this._requestInstances) {
                            this.instanceStore.deleteReference(id);
                        }
                        this._requestInstances = {};
                        for (var id in this._requestLists) {
                            this.listStore.deleteReference(id);
                        }
                        this._requestLists = {};
                    }
                },
                addInstanceReference: function (instance, id) {
                    this.instanceStore.addReference(id || this.id(instance), instance);
                },
                addInstanceMetaData: function (instance, name, value) {
                    var data = this.instanceStore.set[this.id(instance)];
                    if (data) {
                        data[name] = value;
                    }
                },
                getInstanceMetaData: function (instance, name) {
                    var data = this.instanceStore.set[this.id(instance)];
                    if (data) {
                        return data[name];
                    }
                },
                deleteInstanceMetaData: function (instance, name) {
                    var data = this.instanceStore.set[this.id(instance)];
                    delete data[name];
                },
                deleteInstanceReference: function (instance) {
                    this.instanceStore.deleteReference(this.id(instance), instance);
                },
                addListReference: function (list, set) {
                    var id = sortedSetJSON(set || this.listSet(list));
                    this.listStore.addReference(id, list);
                },
                deleteListReference: function (list, set) {
                    var id = sortedSetJSON(set || this.listSet(list));
                    this.listStore.deleteReference(id, list);
                },
                hydratedInstance: function (instance) {
                    if (this._pendingRequests > 0) {
                        var id = this.id(instance);
                        if (!this._requestInstances[id]) {
                            this.addInstanceReference(instance);
                            this._requestInstances[id] = instance;
                        }
                    }
                },
                hydrateInstance: function (props) {
                    var id = this.id(props);
                    if ((id || id === 0) && this.instanceStore.has(id)) {
                        var storeInstance = this.instanceStore.get(id);
                        this.updatedInstance(storeInstance, props);
                        return storeInstance;
                    }
                    var instance = baseConnect.hydrateInstance.call(this, props);
                    this.hydratedInstance(instance);
                    return instance;
                },
                hydratedList: function (list, set) {
                    if (this._pendingRequests > 0) {
                        var id = sortedSetJSON(set || this.listSet(list));
                        if (id) {
                            if (!this._requestLists[id]) {
                                this.addListReference(list, set);
                                this._requestLists[id] = list;
                            }
                        }
                    }
                },
                hydrateList: function (listData, set) {
                    set = set || this.listSet(listData);
                    var id = sortedSetJSON(set);
                    if (id && this.listStore.has(id)) {
                        var storeList = this.listStore.get(id);
                        this.updatedList(storeList, listData, set);
                        return storeList;
                    }
                    var list = baseConnect.hydrateList.call(this, listData, set);
                    this.hydratedList(list, set);
                    return list;
                },
                getList: function (params) {
                    var self = this;
                    self._pendingRequests++;
                    var promise = baseConnect.getList.call(this, params);
                    promise.then(function (instances) {
                        self._finishedRequest();
                    }, function () {
                        self._finishedRequest();
                    });
                    return promise;
                },
                get: function (params) {
                    var self = this;
                    self._pendingRequests++;
                    var promise = baseConnect.get.call(this, params);
                    promise.then(function (instance) {
                        self._finishedRequest();
                    }, function () {
                        self._finishedRequest();
                    });
                    return promise;
                },
                save: function (instance) {
                    var self = this;
                    self._pendingRequests++;
                    var updating = !this.isNew(instance);
                    if (updating) {
                        this.addInstanceReference(instance);
                    }
                    var promise = baseConnect.save.call(this, instance);
                    promise.then(function (instances) {
                        if (updating) {
                            self.deleteInstanceReference(instance);
                        }
                        self._finishedRequest();
                    }, function () {
                        self._finishedRequest();
                    });
                    return promise;
                },
                destroy: function (instance) {
                    var self = this;
                    self._pendingRequests++;
                    var promise = baseConnect.destroy.call(this, instance);
                    promise.then(function (instance) {
                        self._finishedRequest();
                    }, function () {
                        self._finishedRequest();
                    });
                    return promise;
                }
            };
        return behavior;
    });
});
/*can-connect@0.0.2#constructor/callbacks-once/callbacks-once*/
define('can-connect@0.0.2#constructor/callbacks-once/callbacks-once', function (require, exports, module) {
    var connect = require('can-connect');
    var sortedSetJSON = require('can-connect/helpers/sorted-set-json');
    var callbacks = [
            'createdInstance',
            'updatedInstance',
            'destroyedInstance'
        ];
    module.exports = connect.behavior('constructor-callbacks-once', function (baseConnect) {
        var behavior = {};
        callbacks.forEach(function (name) {
            behavior[name] = function (instance, data) {
                var lastSerialized = this.getInstanceMetaData(instance, 'last-data');
                var serialize = sortedSetJSON(data), serialized = sortedSetJSON(this.serializeInstance(instance));
                if (lastSerialized !== serialize && serialized !== serialize) {
                    var result = baseConnect[name].apply(this, arguments);
                    this.addInstanceMetaData(instance, 'last-data', serialize);
                    return result;
                }
            };
        });
        return behavior;
    });
});
/*can-connect@0.0.2#data/callbacks/callbacks*/
define('can-connect@0.0.2#data/callbacks/callbacks', function (require, exports, module) {
    var connect = require('can-connect');
    var helpers = require('can-connect/helpers/');
    var pairs = {
            getListData: 'gotListData',
            createData: 'createdData',
            updateData: 'updatedData',
            destroyData: 'destroyedData'
        };
    var returnArg = function (item) {
        return item;
    };
    module.exports = connect.behavior('data-callbacks', function (baseConnect) {
        var behavior = {};
        helpers.each(pairs, function (callbackName, name) {
            behavior[name] = function (params, cid) {
                var self = this;
                return baseConnect[name].call(this, params).then(function (data) {
                    if (self[callbackName]) {
                        return self[callbackName].call(self, data, params, cid);
                    } else {
                        return data;
                    }
                });
            };
        });
        return behavior;
    });
});
/*can-connect@0.0.2#data/callbacks-cache/callbacks-cache*/
define('can-connect@0.0.2#data/callbacks-cache/callbacks-cache', function (require, exports, module) {
    var connect = require('can-connect');
    var idMerge = require('can-connect/helpers/id-merge');
    var helpers = require('can-connect/helpers/');
    var pairs = {
            createdData: 'createData',
            updatedData: 'updateData',
            destroyedData: 'destroyData'
        };
    module.exports = connect.behavior('data-callbacks-cache', function (baseConnect) {
        var behavior = {};
        helpers.each(pairs, function (cacheCallback, dataCallbackName) {
            behavior[dataCallbackName] = function (data, set, cid) {
                this.cacheConnection[cacheCallback](helpers.extend({}, data));
                return baseConnect[dataCallbackName].call(this, data, set, cid);
            };
        });
        return behavior;
    });
});
/*can-set@0.2.0#src/helpers*/
define('can-set@0.2.0#src/helpers', function (require, exports, module) {
    var helpers;
    module.exports = helpers = {
        extend: function (d, s) {
            for (var prop in s) {
                d[prop] = s[prop];
            }
            return d;
        },
        isArrayLike: function (arr) {
            return arr && typeof arr === 'object' && typeof arr.length === 'number' && arr.length >= 0 && (arr.length === 0 || arr.length - 1 in arr);
        },
        each: function (obj, cb) {
            if (helpers.isArrayLike(obj)) {
                for (var i = 0; i < obj.length; i++) {
                    if (cb(obj[i], i) === false) {
                        break;
                    }
                }
            } else {
                for (var prop in obj) {
                    if (obj.hasOwnProperty(prop)) {
                        if (cb(obj[prop], prop) === false) {
                            break;
                        }
                    }
                }
            }
            return obj;
        },
        eachInUnique: function (a, acb, b, bcb, defaultReturn) {
            var bCopy = helpers.extend({}, b), res;
            for (var prop in a) {
                res = acb(a[prop], b[prop], a, b, prop);
                if (res !== undefined) {
                    return res;
                }
                delete bCopy[prop];
            }
            for (prop in bCopy) {
                res = bcb(undefined, b[prop], a, b, prop);
                if (res !== undefined) {
                    return res;
                }
            }
            return defaultReturn;
        },
        makeArray: function (arr) {
            var array = [];
            helpers.each(arr, function (item) {
                array.push(item);
            });
            return array;
        },
        doubleLoop: function (arr, callbacks) {
            if (typeof callbacks === 'function') {
                callbacks = { iterate: callbacks };
            }
            var i = 0;
            while (i < arr.length) {
                if (callbacks.start) {
                    callbacks.start(arr[i]);
                }
                var j = i + 1;
                while (j < arr.length) {
                    if (callbacks.iterate(arr[j], j, arr[i], i) === false) {
                        arr.splice(j, 1);
                    } else {
                        j++;
                    }
                }
                if (callbacks.end) {
                    callbacks.end(arr[i]);
                }
                i++;
            }
        },
        identityMap: function (arr) {
            var map = {};
            helpers.each(arr, function (value) {
                map[value] = 1;
            });
            return map;
        },
        arrayUnionIntersectionDifference: function (arr1, arr2) {
            var map = {};
            var intersection = [];
            var union = [];
            var difference = arr1.slice(0);
            helpers.each(arr1, function (value) {
                map[value] = true;
                union.push(value);
            });
            helpers.each(arr2, function (value) {
                if (map[value]) {
                    intersection.push(value);
                    var index = difference.indexOf(value);
                    if (index !== -1) {
                        difference.splice(index, 1);
                    }
                } else {
                    union.push(value);
                }
            });
            return {
                intersection: intersection,
                union: union,
                difference: difference
            };
        },
        arraySame: function (arr1, arr2) {
            if (arr1.length !== arr2.length) {
                return false;
            }
            var map = helpers.identityMap(arr1);
            for (var i = 0; i < arr2.length; i++) {
                var val = map[arr2[i]];
                if (!val) {
                    return false;
                } else if (val > 1) {
                    return false;
                } else {
                    map[arr2[i]]++;
                }
            }
            return true;
        }
    };
});
/*can-set@0.2.0#src/compare*/
define('can-set@0.2.0#src/compare', function (require, exports, module) {
    var h = require('./helpers');
    var compareHelpers;
    var loop = function (a, b, aParent, bParent, prop, compares, options) {
        var checks = options.checks;
        for (var i = 0; i < checks.length; i++) {
            var res = checks[i](a, b, aParent, bParent, prop, compares || {}, options);
            if (res !== undefined) {
                return res;
            }
        }
        return options['default'];
    };
    var addToResult = function (fn, name) {
        return function (a, b, aParent, bParent, prop, compares, options) {
            var res = fn.apply(this, arguments);
            if (res === true) {
                if (prop !== undefined && !(prop in options.result)) {
                    options.result[prop] = a;
                }
                return true;
            } else {
                return res;
            }
        };
    };
    module.exports = compareHelpers = {
        equal: function (a, b, aParent, bParent, prop, compares, options) {
            options.checks = [
                compareHelpers.equalComparesType,
                compareHelpers.equalBasicTypes,
                compareHelpers.equalArrayLike,
                compareHelpers.equalObject
            ];
            options['default'] = false;
            return loop(a, b, aParent, bParent, prop, compares, options);
        },
        equalComparesType: function (a, b, aParent, bParent, prop, compares, options) {
            if (typeof compares === 'function') {
                var compareResult = compares(a, b, aParent, bParent, prop, options);
                if (typeof compareResult === 'boolean') {
                    return compareResult;
                } else if (compareResult && typeof compareResult === 'object') {
                    if ('intersection' in compareResult && !('difference' in compareResult)) {
                        var reverseResult = compares(b, a, bParent, aParent, prop, options);
                        return 'intersection' in reverseResult && !('difference' in reverseResult);
                    }
                    return false;
                }
                return compareResult;
            }
        },
        equalBasicTypes: function (a, b, aParent, bParent, prop, compares, options) {
            if (a === null || b === null) {
                return a === b;
            }
            if (a instanceof Date || b instanceof Date) {
                return a === b;
            }
            if (options.deep === -1) {
                return typeof a === 'object' || a === b;
            }
            if (typeof a !== typeof b || h.isArrayLike(a) !== h.isArrayLike(b)) {
                return false;
            }
            if (a === b) {
                return true;
            }
        },
        equalArrayLike: function (a, b, aParent, bParent, prop, compares, options) {
            if (h.isArrayLike(a) && h.isArrayLike(b)) {
                if (a.length !== b.length) {
                    return false;
                }
                for (var i = 0; i < a.length; i++) {
                    var compare = compares[i] === undefined ? compares['*'] : compares[i];
                    if (!loop(a[i], b[i], a, b, i, compare, options)) {
                        return false;
                    }
                }
                return true;
            }
        },
        equalObject: function (a, b, aParent, bParent, parentProp, compares, options) {
            var aType = typeof a;
            if (aType === 'object' || aType === 'function') {
                var bCopy = h.extend({}, b);
                if (options.deep === false) {
                    options.deep = -1;
                }
                for (var prop in a) {
                    var compare = compares[prop] === undefined ? compares['*'] : compares[prop];
                    if (!loop(a[prop], b[prop], a, b, prop, compare, options)) {
                        return false;
                    }
                    delete bCopy[prop];
                }
                for (prop in bCopy) {
                    if (compares[prop] === undefined || !loop(undefined, b[prop], a, b, prop, compares[prop], options)) {
                        return false;
                    }
                }
                return true;
            }
        },
        subset: function (a, b, aParent, bParent, prop, compares, options) {
            options.checks = [
                compareHelpers.subsetComparesType,
                compareHelpers.equalBasicTypes,
                compareHelpers.equalArrayLike,
                compareHelpers.subsetObject
            ];
            options.getSubsets = [];
            options.removeProps = [];
            options['default'] = false;
            return loop(a, b, aParent, bParent, prop, compares, options);
        },
        subsetObject: function (a, b, aParent, bParent, parentProp, compares, options) {
            var aType = typeof a;
            if (aType === 'object' || aType === 'function') {
                return h.eachInUnique(a, function (a, b, aParent, bParent, prop) {
                    var compare = compares[prop] === undefined ? compares['*'] : compares[prop];
                    if (!loop(a, b, aParent, bParent, prop, compare, options) && prop in bParent) {
                        return false;
                    }
                }, b, function (a, b, aParent, bParent, prop) {
                    var compare = compares[prop] === undefined ? compares['*'] : compares[prop];
                    if (!loop(a, b, aParent, bParent, prop, compare, options)) {
                        return false;
                    }
                }, true);
            }
        },
        subsetComparesType: function (a, b, aParent, bParent, prop, compares, options) {
            if (typeof compares === 'function') {
                var compareResult = compares(a, b, aParent, bParent, prop, options);
                if (typeof compareResult === 'boolean') {
                    return compareResult;
                } else if (compareResult && typeof compareResult === 'object') {
                    if (compareResult.getSubset) {
                        options.removeProps.push(prop);
                        if (options.getSubsets.indexOf(compareResult.getSubset) === -1) {
                            options.getSubsets.push(compareResult.getSubset);
                        }
                    }
                    if ('intersection' in compareResult && !('difference' in compareResult)) {
                        var reverseResult = compares(b, a, bParent, aParent, prop, options);
                        return 'intersection' in reverseResult;
                    }
                    return false;
                }
                return compareResult;
            }
        },
        properSupersetObject: function (a, b, aParent, bParent, parentProp, compares, options) {
            var bType = typeof b;
            var hasAdditionalProp = false;
            if (bType === 'object' || bType === 'function') {
                var aCopy = h.extend({}, a);
                if (options.deep === false) {
                    options.deep = -1;
                }
                for (var prop in b) {
                    var compare = compares[prop] === undefined ? compares['*'] : compares[prop];
                    var compareResult = loop(a[prop], b[prop], a, b, prop, compare, options);
                    if (!(prop in a) || options.performedDifference) {
                        hasAdditionalProp = true;
                    } else if (!compareResult) {
                        return false;
                    }
                    delete aCopy[prop];
                }
                for (prop in aCopy) {
                    if (compares[prop] === undefined || !loop(undefined, b[prop], a, b, prop, compares[prop], options)) {
                        return false;
                    }
                }
                return hasAdditionalProp;
            }
        },
        properSubsetComparesType: function (a, b, aParent, bParent, prop, compares, options) {
            if (typeof compares === 'function') {
                var compareResult = compares(a, b, aParent, bParent, prop, options);
                if (typeof compareResult === 'boolean') {
                    return compareResult;
                } else if (compareResult && typeof compareResult === 'object') {
                    if ('intersection' in compareResult && !('difference' in compareResult)) {
                        var reverseResult = compares(b, a, bParent, aParent, prop, options);
                        return 'intersection' in reverseResult && 'difference' in reverseResult;
                    }
                    return false;
                }
                return compareResult;
            }
        },
        difference: function (a, b, aParent, bParent, prop, compares, options) {
            options.result = {};
            options.performedDifference = 0;
            options.checks = [
                compareHelpers.differenceComparesType,
                addToResult(compareHelpers.equalBasicTypes, 'equalBasicTypes'),
                addToResult(compareHelpers.equalArrayLike, 'equalArrayLike'),
                addToResult(compareHelpers.properSupersetObject, 'properSubsetObject')
            ];
            options['default'] = true;
            var res = loop(a, b, aParent, bParent, prop, compares, options);
            if (res === true && options.performedDifference) {
                return options.result;
            }
            return res;
        },
        differenceComparesType: function (a, b, aParent, bParent, prop, compares, options) {
            if (typeof compares === 'function') {
                var compareResult = compares(a, b, aParent, bParent, prop, options);
                if (typeof compareResult === 'boolean') {
                    if (compareResult === true) {
                        options.result[prop] = a;
                        return true;
                    } else {
                        return compareResult;
                    }
                } else if (compareResult && typeof compareResult === 'object') {
                    if ('difference' in compareResult) {
                        if (compareResult.difference != null) {
                            options.result[prop] = compareResult.difference;
                            options.performedDifference++;
                            return true;
                        } else {
                            return compareResult.difference;
                        }
                    } else {
                        if (compareHelpers.equalComparesType.apply(this, arguments)) {
                            options.performedDifference++;
                            options.result[prop] = compareResult.union;
                        } else {
                            return false;
                        }
                    }
                }
            }
        },
        diffObject: function (a, b, aParent, bParent, parentProp, compares, options) {
            var aType = typeof a;
            if (aType === 'object' || aType === 'function') {
                var bCopy = h.extend({}, b);
                if (options.deep === false) {
                    options.deep = -1;
                }
                for (var prop in a) {
                    var compare = compares[prop] === undefined ? compares['*'] : compares[prop];
                    if (!loop(a[prop], b[prop], a, b, prop, compare, options)) {
                        return false;
                    }
                    delete bCopy[prop];
                }
                for (prop in bCopy) {
                    if (compares[prop] === undefined || !loop(undefined, b[prop], a, b, prop, compares[prop], options)) {
                        return false;
                    }
                }
                return true;
            }
        },
        union: function (a, b, aParent, bParent, prop, compares, options) {
            options.result = {};
            options.performedUnion = 0;
            options.checks = [
                compareHelpers.unionComparesType,
                addToResult(compareHelpers.equalBasicTypes, 'equalBasicTypes'),
                addToResult(compareHelpers.unionArrayLike, 'unionArrayLike'),
                addToResult(compareHelpers.unionObject, 'unionObject')
            ];
            options.getUnions = [];
            options['default'] = false;
            var res = loop(a, b, aParent, bParent, prop, compares, options);
            if (res === true) {
                return options.result;
            }
            return false;
        },
        unionComparesType: function (a, b, aParent, bParent, prop, compares, options) {
            if (typeof compares === 'function') {
                var compareResult = compares(a, b, aParent, bParent, prop, options);
                if (typeof compareResult === 'boolean') {
                    if (compareResult === true) {
                        options.result[prop] = a;
                        return true;
                    } else {
                        return compareResult;
                    }
                } else if (compareResult && typeof compareResult === 'object') {
                    if (compareResult.getUnion) {
                        if (options.getUnions.indexOf(compareResult.getUnion) === -1) {
                            options.getUnions.push(compareResult.getUnion);
                        }
                    }
                    if ('union' in compareResult) {
                        if (compareResult.union !== undefined) {
                            options.result[prop] = compareResult.union;
                        }
                        options.performedUnion++;
                        return true;
                    }
                }
            }
        },
        unionObject: function (a, b, aParent, bParent, prop, compares, options) {
            var subsetCompare = function (a, b, aParent, bParent, prop) {
                var compare = compares[prop] === undefined ? compares['*'] : compares[prop];
                if (!loop(a, b, aParent, bParent, prop, compare, options)) {
                    var subsetCheck;
                    if (!(prop in aParent)) {
                        subsetCheck = 'subsetB';
                    }
                    if (!(prop in bParent)) {
                        subsetCheck = 'subsetA';
                    }
                    if (subsetCheck) {
                        if (!options.subset) {
                            options.subset = subsetCheck;
                        }
                        return options.subset === subsetCheck ? undefined : false;
                    }
                    return false;
                }
            };
            var aType = typeof a;
            if (aType === 'object' || aType === 'function') {
                return h.eachInUnique(a, subsetCompare, b, subsetCompare, true);
            }
        },
        unionArrayLike: function (a, b, aParent, bParent, prop, compares, options) {
            if (h.isArrayLike(a) && h.isArrayLike(b)) {
                var combined = h.makeArray(a).concat(h.makeArray(b));
                h.doubleLoop(combined, function (item, j, cur, i) {
                    var res = !compareHelpers.equal(cur, item, aParent, bParent, undefined, compares['*'], { 'default': false });
                    return res;
                });
                options.result[prop] = combined;
                return true;
            }
        },
        count: function (a, b, aParent, bParent, prop, compares, options) {
            options.checks = [
                compareHelpers.countComparesType,
                compareHelpers.equalBasicTypes,
                compareHelpers.equalArrayLike,
                compareHelpers.loopObject
            ];
            options['default'] = false;
            loop(a, b, aParent, bParent, prop, compares, options);
            if (typeof options.count === 'number') {
                return options.count;
            }
            return Infinity;
        },
        countComparesType: function (a, b, aParent, bParent, prop, compares, options) {
            if (typeof compares === 'function') {
                var compareResult = compares(a, b, aParent, bParent, prop, options);
                if (typeof compareResult === 'boolean') {
                    return true;
                } else if (compareResult && typeof compareResult === 'object') {
                    if (typeof compareResult.count === 'number') {
                        if (!('count' in options) || compareResult.count === options.count) {
                            options.count = compareResult.count;
                        } else {
                            options.count = Infinity;
                        }
                    }
                    return true;
                }
            }
        },
        loopObject: function (a, b, aParent, bParent, prop, compares, options) {
            var aType = typeof a;
            if (aType === 'object' || aType === 'function') {
                h.each(a, function (aValue, prop) {
                    var compare = compares[prop] === undefined ? compares['*'] : compares[prop];
                    loop(aValue, b[prop], a, b, prop, compare, options);
                });
                return true;
            }
        },
        intersection: function (a, b, aParent, bParent, prop, compares, options) {
            options.result = {};
            options.performedIntersection = 0;
            options.checks = [
                compareHelpers.intersectionComparesType,
                addToResult(compareHelpers.equalBasicTypes, 'equalBasicTypes'),
                addToResult(compareHelpers.intersectionArrayLike, 'intersectionArrayLike'),
                compareHelpers.intersectionObject
            ];
            options['default'] = false;
            var res = loop(a, b, aParent, bParent, prop, compares, options);
            if (res === true) {
                return options.result;
            }
            return false;
        },
        intersectionComparesType: function (a, b, aParent, bParent, prop, compares, options) {
            if (typeof compares === 'function') {
                var compareResult = compares(a, b, aParent, bParent, prop, options);
                if (typeof compareResult === 'boolean') {
                    if (compareResult === true) {
                        options.result[prop] = a;
                        return true;
                    } else {
                        return compareResult;
                    }
                } else if (compareResult && typeof compareResult === 'object') {
                    if ('intersection' in compareResult) {
                        if (compareResult.intersection !== undefined) {
                            options.result[prop] = compareResult.intersection;
                        }
                        options.performedIntersection++;
                        return true;
                    }
                }
            }
        },
        intersectionObject: function (a, b, aParent, bParent, prop, compares, options) {
            var subsetCompare = function (a, b, aParent, bParent, prop) {
                var compare = compares[prop] === undefined ? compares['*'] : compares[prop];
                if (!loop(a, b, aParent, bParent, prop, compare, options)) {
                    var subsetCheck;
                    if (!(prop in aParent)) {
                        subsetCheck = 'subsetB';
                    }
                    if (!(prop in bParent)) {
                        subsetCheck = 'subsetA';
                    }
                    if (subsetCheck) {
                        if (!options.subset) {
                            options.subset = subsetCheck;
                        }
                        var addProp = options.subset === subsetCheck;
                        if (addProp) {
                            if (subsetCheck === 'subsetB') {
                                options.result[prop] = b;
                            } else {
                                options.result[prop] = a;
                            }
                        }
                        return addProp;
                    }
                    return false;
                }
            };
            var aType = typeof a;
            if (aType === 'object' || aType === 'function') {
                return h.eachInUnique(a, subsetCompare, b, subsetCompare, true);
            }
        },
        intersectionArrayLike: function (a, b, aParent, bParent, prop, compares, options) {
            if (h.isArrayLike(a) && h.isArrayLike(b)) {
                var intersection = [];
                h.each(h.makeArray(a), function (cur) {
                    for (var i = 0; i < b.length; i++) {
                        if (compareHelpers.equal(cur, b[i], aParent, bParent, undefined, compares['*'], { 'default': false })) {
                            intersection.push(cur);
                            break;
                        }
                    }
                });
                options.result[prop] = intersection;
                return true;
            }
        }
    };
});
/*can-set@0.2.0#src/set-core*/
define('can-set@0.2.0#src/set-core', function (require, exports, module) {
    var h = require('./helpers'), compare = require('./compare');
    var Algebra = function (compare) {
        this.compare = compare;
    };
    Algebra.make = function (compare, count) {
        if (compare instanceof Algebra) {
            return compare;
        } else {
            return new Algebra(compare, count);
        }
    };
    h.extend(Algebra.prototype, {
        equal: function (a, b) {
            return compare.equal(a, b, undefined, undefined, undefined, this.compare, {});
        },
        subset: function (a, b) {
            return compare.subset(a, b, undefined, undefined, undefined, this.compare, {});
        },
        properSubset: function (a, b) {
            return this.subset(a, b) && !this.equal(a, b);
        },
        difference: function (a, b) {
            return compare.difference(a, b, undefined, undefined, undefined, this.compare, {});
        },
        union: function (a, b) {
            return compare.union(a, b, undefined, undefined, undefined, this.compare, {});
        },
        intersection: function (a, b) {
            return compare.intersection(a, b, undefined, undefined, undefined, this.compare, {});
        },
        count: function (a) {
            return compare.count(a, {}, undefined, undefined, undefined, this.compare, {});
        }
    });
    module.exports = {
        Algebra: Algebra,
        difference: function (a, b, config) {
            return Algebra.make(config).difference(a, b);
        },
        equal: function (a, b, config) {
            return Algebra.make(config).equal(a, b);
        },
        subset: function (a, b, config) {
            return Algebra.make(config).subset(a, b);
        },
        properSubset: function (a, b, config) {
            return Algebra.make(config).properSubset(a, b);
        },
        union: function (a, b, config) {
            return Algebra.make(config).union(a, b);
        },
        intersection: function (a, b, config) {
            return Algebra.make(config).intersection(a, b);
        },
        count: function (a, config) {
            return Algebra.make(config).count(a);
        }
    };
});
/*can-set@0.2.0#src/comparators*/
define('can-set@0.2.0#src/comparators', function (require, exports, module) {
    var h = require('./helpers');
    function makeComparator(fn) {
        return function () {
            var result = {};
            h.each(arguments, function (propertyName) {
                result[propertyName] = fn;
            });
            return result;
        };
    }
    var within = function (value, range) {
        return value >= range[0] && value <= range[1];
    };
    var diff = function (setA, setB, property1, property2) {
        var sAv1 = setA[property1], sAv2 = setA[property2], sBv1 = setB[property1], sBv2 = setB[property2], count = sAv2 - sAv1 + 1;
        var after = {
                difference: [
                    sBv2 + 1,
                    sAv2
                ],
                intersection: [
                    sAv1,
                    sBv2
                ],
                union: [
                    sBv1,
                    sAv2
                ],
                count: count,
                meta: 'after'
            };
        var before = {
                difference: [
                    sAv1,
                    sBv1 - 1
                ],
                intersection: [
                    sBv1,
                    sAv2
                ],
                union: [
                    sAv1,
                    sBv2
                ],
                count: count,
                meta: 'before'
            };
        if (sAv1 === sBv1 && sAv2 === sBv2) {
            return {
                intersection: [
                    sAv1,
                    sAv2
                ],
                union: [
                    sAv1,
                    sAv2
                ],
                count: count,
                meta: 'equal'
            };
        } else if (sAv1 === sBv1 && sBv2 < sAv2) {
            return after;
        } else if (sAv2 === sBv2 && sBv1 > sAv1) {
            return before;
        } else if (within(sAv1, [
                sBv1,
                sBv2
            ]) && within(sAv2, [
                sBv1,
                sBv2
            ])) {
            return {
                intersection: [
                    sAv1,
                    sAv2
                ],
                union: [
                    sBv1,
                    sBv2
                ],
                count: count,
                meta: 'subset'
            };
        } else if (within(sBv1, [
                sAv1,
                sAv2
            ]) && within(sBv2, [
                sAv1,
                sAv2
            ])) {
            return {
                intersection: [
                    sBv1,
                    sBv2
                ],
                difference: [
                    null,
                    null
                ],
                union: [
                    sAv1,
                    sAv2
                ],
                count: count,
                meta: 'superset'
            };
        } else if (sAv1 < sBv1 && within(sAv2, [
                sBv1,
                sBv2
            ])) {
            return before;
        } else if (sBv1 < sAv1 && within(sBv2, [
                sAv1,
                sAv2
            ])) {
            return after;
        } else if (sAv2 === sBv1 - 1) {
            return {
                difference: [
                    sAv1,
                    sAv2
                ],
                union: [
                    sAv1,
                    sBv2
                ],
                count: count,
                meta: 'disjoint-before'
            };
        } else if (sBv2 === sAv1 - 1) {
            return {
                difference: [
                    sAv1,
                    sAv2
                ],
                union: [
                    sBv1,
                    sAv2
                ],
                count: count,
                meta: 'disjoint-after'
            };
        }
        if (!isNaN(count)) {
            return {
                count: count,
                meta: 'disjoint'
            };
        }
    };
    var cleanUp = function (value, enumData) {
        if (!value) {
            return enumData;
        }
        if (!h.isArrayLike(value)) {
            value = [value];
        }
        if (!value.length) {
            return enumData;
        }
        return value;
    };
    module.exports = {
        enum: function (prop, enumData) {
            var compares = {};
            compares[prop] = function (vA, vB, A, B) {
                vA = cleanUp(vA, enumData);
                vB = cleanUp(vB, enumData);
                var data = h.arrayUnionIntersectionDifference(vA, vB);
                if (!data.difference.length) {
                    delete data.difference;
                }
                h.each(data, function (value, prop) {
                    if (h.isArrayLike(value)) {
                        if (h.arraySame(enumData, value)) {
                            data[prop] = undefined;
                        } else if (value.length === 1) {
                            data[prop] = value[0];
                        }
                    }
                });
                return data;
            };
            return compares;
        },
        rangeInclusive: function (startIndexProperty, endIndexProperty) {
            var compares = {};
            var makeResult = function (result, index) {
                var res = {};
                if (result.intersection) {
                    res.intersection = result.intersection[index];
                }
                if (result.difference) {
                    res.difference = result.difference[index];
                }
                if (result.union) {
                    res.union = result.union[index];
                }
                if (result.count) {
                    res.count = result.count;
                }
                return res;
            };
            compares[startIndexProperty] = function (vA, vB, A, B) {
                if (vA === undefined) {
                    return;
                }
                var res = diff(A, B, startIndexProperty, endIndexProperty);
                var result = makeResult(res, 0);
                result.getSubset = function (a, b, bItems, algebra, options) {
                    return bItems;
                };
                result.getUnion = function (a, b, aItems, bItems, algebra, options) {
                    return [
                        aItems,
                        bItems
                    ];
                };
                return result;
            };
            compares[endIndexProperty] = function (vA, vB, A, B) {
                if (vA === undefined) {
                    return;
                }
                var data = diff(A, B, startIndexProperty, endIndexProperty);
                var res = makeResult(data, 1);
                res.getSubset = function (a, b, bItems, algebra, options) {
                    var aStartValue = a[startIndexProperty], aEndValue = a[endIndexProperty];
                    var bStartValue = b[startIndexProperty];
                    if (!(endIndexProperty in b) || !(endIndexProperty in a)) {
                        return bItems.slice(aStartValue, aEndValue + 1);
                    }
                    return bItems.slice(aStartValue - bStartValue, aEndValue - bStartValue + 1);
                };
                res.getUnion = function (a, b, aItems, bItems, algebra, options) {
                    if (data.meta.indexOf('after') >= 0) {
                        if (data.intersection) {
                            bItems = bItems.slice(0, data.intersection[0] - b[startIndexProperty]);
                        }
                        return [
                            bItems,
                            aItems
                        ];
                    }
                    if (data.intersection) {
                        aItems = aItems.slice(0, data.intersection[0] - a[startIndexProperty]);
                    }
                    return [
                        aItems,
                        bItems
                    ];
                };
                return res;
            };
            return compares;
        },
        'boolean': makeComparator(function (propA, propB) {
            var notA = !propA, notB = !propB;
            if (propA === notB && propB === notA) {
                return {
                    difference: !propB,
                    union: undefined
                };
            } else if (propA === undefined) {
                return {
                    difference: !propB,
                    intersection: propB,
                    union: undefined
                };
            }
        })
    };
});
/*can-set@0.2.0#src/get*/
define('can-set@0.2.0#src/get', function (require, exports, module) {
    var compare = require('./compare');
    var set = require('./set-core');
    var h = require('./helpers');
    var defaultGetSubset = function (a, b, bItems, algebra, options) {
        return bItems.filter(function (item) {
            return set.subset(item, a, algebra);
        });
    };
    module.exports = {
        getSubset: function (a, b, bItems, algebra) {
            var options = {};
            var isSubset = compare.subset(a, b, undefined, undefined, undefined, algebra, options);
            if (isSubset) {
                var aItems = bItems.slice(0);
                var aCopy = h.extend({}, a);
                h.each(options.removeProps, function (prop) {
                    delete aCopy[prop];
                });
                aItems = defaultGetSubset(aCopy, b, aItems, algebra, options);
                h.each(options.getSubsets, function (filter) {
                    aItems = filter(a, b, aItems, algebra, options);
                });
                return aItems;
            }
        },
        getUnion: function (a, b, aItems, bItems, algebra) {
            var options = {};
            if (compare.subset(a, b, undefined, undefined, undefined, algebra, options)) {
                return bItems;
            } else if (compare.subset(b, a, undefined, undefined, undefined, algebra, options)) {
                return aItems;
            }
            var isUnion = compare.union(a, b, undefined, undefined, undefined, algebra, options);
            if (isUnion) {
                h.each(options.getUnions, function (filter) {
                    var items = filter(a, b, aItems, bItems, algebra, options);
                    aItems = items[0];
                    bItems = items[1];
                });
                return aItems.concat(bItems);
            }
        }
    };
});
/*can-set@0.2.0#src/set*/
define('can-set@0.2.0#src/set', function (require, exports, module) {
    var set = require('./set-core');
    var comparators = require('./comparators');
    set.comparators = comparators;
    set.helpers = require('./helpers');
    var get = require('./get');
    set.helpers.extend(set, get);
    if (typeof window !== 'undefined' && !require.resolve) {
        window.set = set;
    }
    module.exports = set;
});
/*can-connect@0.0.2#helpers/get-items*/
define('can-connect@0.0.2#helpers/get-items', function (require, exports, module) {
    module.exports = function (data) {
        if (Array.isArray(data)) {
            return data;
        } else {
            return data.data;
        }
    };
});
/*can-connect@0.0.2#data/combine-requests/combine-requests*/
define('can-connect@0.0.2#data/combine-requests/combine-requests', function (require, exports, module) {
    var connect = require('can-connect');
    var canSet = require('can-set');
    var getItems = require('can-connect/helpers/get-items');
    module.exports = connect.behavior('data-combine-requests', function (base) {
        var pendingRequests;
        return {
            unionPendingRequests: function (pendingRequests) {
                var self = this;
                pendingRequests.sort(function (pReq1, pReq2) {
                    if (canSet.subset(pReq1.set, pReq2.set, self.algebra)) {
                        return 1;
                    } else if (canSet.subset(pReq2.set, pReq1.set, self.algebra)) {
                        return -1;
                    }
                });
                var combineData = [];
                var current;
                var self = this;
                doubleLoop(pendingRequests, {
                    start: function (pendingRequest) {
                        current = {
                            set: pendingRequest.set,
                            pendingRequests: [pendingRequest]
                        };
                        combineData.push(current);
                    },
                    iterate: function (pendingRequest) {
                        var combined = canSet.union(current.set, pendingRequest.set, self.algebra);
                        if (combined) {
                            current.set = combined;
                            current.pendingRequests.push(pendingRequest);
                            return true;
                        }
                    }
                });
                return Promise.resolve(combineData);
            },
            getSubset: function (set, unionSet, data) {
                return canSet.getSubset(set, unionSet, data, this.algebra);
            },
            time: 1,
            getListData: function (set) {
                var self = this;
                if (!pendingRequests) {
                    pendingRequests = [];
                    setTimeout(function () {
                        var combineDataPromise = self.unionPendingRequests(pendingRequests);
                        pendingRequests = null;
                        combineDataPromise.then(function (combinedData) {
                            combinedData.forEach(function (combined) {
                                base.getListData(combined.set).then(function (data) {
                                    if (combined.pendingRequests.length === 1) {
                                        combined.pendingRequests[0].deferred.resolve(data);
                                    } else {
                                        combined.pendingRequests.forEach(function (pending) {
                                            pending.deferred.resolve({ data: self.getSubset(pending.set, combined.set, getItems(data)) });
                                        });
                                    }
                                });
                            });
                        });
                    }, this.time || 1);
                }
                var deferred = {};
                var promise = new Promise(function (resolve, reject) {
                        deferred.resolve = resolve;
                        deferred.reject = reject;
                    });
                pendingRequests.push({
                    deferred: deferred,
                    set: set
                });
                return promise;
            }
        };
    });
    var doubleLoop = function (arr, callbacks) {
        var i = 0;
        while (i < arr.length) {
            callbacks.start(arr[i]);
            var j = i + 1;
            while (j < arr.length) {
                if (callbacks.iterate(arr[j]) === true) {
                    arr.splice(j, 1);
                } else {
                    j++;
                }
            }
            i++;
        }
    };
});
/*can-connect@0.0.2#data/inline-cache/inline-cache*/
define('can-connect@0.0.2#data/inline-cache/inline-cache', function (require, exports, module) {
    var connect = require('can-connect');
    var sortedSetJSON = require('can-connect/helpers/sorted-set-json');
    module.exports = connect.behavior('data-inline-cache', function (baseConnect) {
        if (typeof INLINE_CACHE === 'undefined') {
            return {};
        }
        var getData = function (id) {
            var type = INLINE_CACHE[this.name];
            if (type) {
                var data = type[id];
                if (data) {
                    delete type[id];
                    return data;
                }
            }
        };
        return {
            getListData: function (set) {
                var id = sortedSetJSON(set);
                var data = getData.call(this, id);
                if (data !== undefined) {
                    if (this.cacheConnection) {
                        this.cacheConnection.updateListData(data, set);
                    }
                    return Promise.resolve(data);
                } else {
                    return baseConnect.getListData.apply(this, arguments);
                }
            },
            getData: function (params) {
                var id = this.id(params);
                var data = getData.call(this, id);
                if (data !== undefined) {
                    if (this.cacheConnection) {
                        this.cacheConnection.updateData(data);
                    }
                    return Promise.resolve(data);
                } else {
                    return baseConnect.getData.apply(this, arguments);
                }
            }
        };
        return behavior;
    });
});
/*can-connect@0.0.2#data/localstorage-cache/localstorage-cache*/
define('can-connect@0.0.2#data/localstorage-cache/localstorage-cache', function (require, exports, module) {
    var getItems = require('can-connect/helpers/get-items');
    var connect = require('can-connect');
    var sortedSetJSON = require('can-connect/helpers/sorted-set-json');
    var canSet = require('can-set');
    require('when/es6-shim/Promise');
    var indexOf = function (connection, props, items) {
        var id = connection.id(props);
        for (var i = 0; i < items.length; i++) {
            if (id == connection.id(items[i])) {
                return i;
            }
        }
        return -1;
    };
    var setAdd = function (set, items, item, algebra) {
        return items.concat([item]);
    };
    module.exports = connect.behavior('data-localstorage-cache', function (baseConnect) {
        var behavior = {
                _sets: null,
                _instances: {},
                getSetData: function () {
                    if (!this._sets) {
                        var sets = this._sets = {};
                        var self = this;
                        (JSON.parse(localStorage.getItem(this.name + '-sets')) || []).forEach(function (set) {
                            var setKey = sortedSetJSON(set);
                            if (localStorage.getItem(self.name + '/set/' + setKey)) {
                                sets[setKey] = {
                                    set: set,
                                    setKey: setKey
                                };
                            }
                        });
                    }
                    return this._sets;
                },
                _getSets: function () {
                    var sets = [];
                    var setData = this.getSetData();
                    for (var setKey in setData) {
                        sets.push(setData[setKey].set);
                    }
                    return sets;
                },
                getSets: function () {
                    return Promise.resolve(this._getSets());
                },
                getInstance: function (id) {
                    var res = localStorage.getItem(this.name + '/instance/' + id);
                    if (res) {
                        return JSON.parse(res);
                    }
                },
                getInstances: function (ids) {
                    var self = this;
                    return ids.map(function (id) {
                        return self.getInstance(id);
                    });
                },
                removeSet: function (setKey, noUpdate) {
                    var sets = this.getSetData();
                    localStorage.removeItem(this.name + '/set/' + setKey);
                    delete sets[setKey];
                    if (noUpdate !== true) {
                        this.updateSets();
                    }
                },
                updateSets: function () {
                    var sets = this._getSets();
                    localStorage.setItem(this.name + '-sets', JSON.stringify(sets));
                },
                clear: function () {
                    var sets = this.getSetData();
                    for (var setKey in sets) {
                        localStorage.removeItem(this.name + '/set/' + setKey);
                    }
                    localStorage.removeItem(this.name + '-sets');
                    var i = 0;
                    while (i < localStorage.length) {
                        if (localStorage.key(i).indexOf(this.name + '/instance/') === 0) {
                            localStorage.removeItem(localStorage.key(i));
                        } else {
                            i++;
                        }
                    }
                    this._instances = {};
                    this._sets = null;
                },
                getListData: function (set) {
                    var setKey = sortedSetJSON(set);
                    var setDatum = this.getSetData()[setKey];
                    if (setDatum) {
                        var localData = localStorage.getItem(this.name + '/set/' + setKey);
                        if (localData) {
                            return Promise.resolve({ data: this.getInstances(JSON.parse(localData)) });
                        }
                    }
                    return Promise.reject({
                        message: 'no data',
                        error: 404
                    });
                },
                getData: function (params) {
                    var id = this.id(params);
                    var res = localStorage.getItem(this.name + '/instance/' + id);
                    if (res) {
                        return Promise.resolve(JSON.parse(res));
                    } else {
                        return new Promise.reject({
                            message: 'no data',
                            error: 404
                        });
                    }
                },
                updateSet: function (setDatum, items, newSet) {
                    var newSetKey = newSet ? sortedSetJSON(newSet) : setDatum.setKey;
                    if (newSet) {
                        if (newSetKey !== setDatum.setKey) {
                            var sets = this.getSetData();
                            var oldSetKey = setDatum.setKey;
                            sets[newSetKey] = setDatum;
                            setDatum.setKey = newSetKey;
                            this.removeSet(oldSetKey);
                        }
                    }
                    setDatum.items = items;
                    var self = this;
                    var ids = items.map(function (item) {
                            var id = self.id(item);
                            localStorage.setItem(self.name + '/instance/' + id, JSON.stringify(item));
                            return id;
                        });
                    localStorage.setItem(this.name + '/set/' + newSetKey, JSON.stringify(ids));
                },
                addSet: function (set, data) {
                    var items = getItems(data);
                    var sets = this.getSetData();
                    var setKey = sortedSetJSON(set);
                    sets[setKey] = {
                        setKey: setKey,
                        items: items,
                        set: set
                    };
                    var self = this;
                    var ids = items.map(function (item) {
                            var id = self.id(item);
                            localStorage.setItem(self.name + '/instance/' + id, JSON.stringify(item));
                            return id;
                        });
                    localStorage.setItem(this.name + '/set/' + setKey, JSON.stringify(ids));
                    this.updateSets();
                },
                updateListData: function (data, set) {
                    var items = getItems(data);
                    var sets = this.getSetData();
                    var self = this;
                    for (var setKey in sets) {
                        var setDatum = sets[setKey];
                        var union = canSet.union(setDatum.set, set, this.algebra);
                        if (union) {
                            return this.getListData(setDatum.set).then(function (setData) {
                                self.updateSet(setDatum, canSet.getUnion(setDatum.set, set, getItems(setData), items, this.algebra), union);
                            });
                        }
                    }
                    this.addSet(set, data);
                    return Promise.resolve();
                },
                _eachSet: function (cb) {
                    var sets = this.getSetData();
                    var self = this;
                    var loop = function (setDatum, setKey) {
                        return cb(setDatum, setKey, function () {
                            if (!('items' in setDatum)) {
                                var ids = JSON.parse(localStorage.getItem(self.name + '/set/' + setKey));
                                setDatum.items = self.getInstances(ids);
                            }
                            return setDatum.items;
                        });
                    };
                    for (var setKey in sets) {
                        var setDatum = sets[setKey];
                        var result = loop(setDatum, setKey);
                        if (result !== undefined) {
                            return result;
                        }
                    }
                },
                createData: function (props) {
                    var self = this;
                    this._eachSet(function (setDatum, setKey, getItems) {
                        if (canSet.subset(props, setDatum.set, this.algebra)) {
                            self.updateSet(setDatum, setAdd(setDatum.set, getItems(), props, this.algebra), setDatum.set);
                        }
                    });
                    var id = this.id(props);
                    localStorage.setItem(this.name + '/instance/' + id, JSON.stringify(props));
                    return Promise.resolve({});
                },
                updateData: function (props) {
                    var self = this;
                    this._eachSet(function (setDatum, setKey, getItems) {
                        var items = getItems();
                        var index = indexOf(self, props, items);
                        if (canSet.subset(props, setDatum.set, this.algebra)) {
                            if (index == -1) {
                                self.updateSet(setDatum, setAdd(setDatum.set, getItems(), props, this.algebra));
                            } else {
                                items.splice(index, 1, props);
                                self.updateSet(setDatum, items);
                            }
                        } else if (index != -1) {
                            items.splice(index, 1);
                            self.updateSet(setDatum, items);
                        }
                    });
                    var id = this.id(props);
                    localStorage.setItem(this.name + '/instance/' + id, JSON.stringify(props));
                    return Promise.resolve({});
                },
                destroyData: function (props) {
                    var self = this;
                    this._eachSet(function (setDatum, setKey, getItems) {
                        var items = getItems();
                        var index = indexOf(self, props, items);
                        if (index != -1) {
                            items.splice(index, 1);
                            self.updateSet(setDatum, items);
                        }
                    });
                    var id = this.id(props);
                    localStorage.removeItem(this.name + '/instance/' + id);
                    return Promise.resolve({});
                }
            };
        return behavior;
    });
});
/*can-connect@0.0.2#data/parse/parse*/
define('can-connect@0.0.2#data/parse/parse', function (require, exports, module) {
    var connect = require('can-connect');
    var helpers = require('can-connect/helpers/');
    module.exports = connect.behavior('data-parse', function (baseConnect) {
        var behavior = {
                parseListData: function (responseData, xhr, headers) {
                    var result;
                    if (Array.isArray(responseData)) {
                        result = { data: responseData };
                    } else {
                        var prop = this.parseListProp || 'data';
                        responseData.data = helpers.getObject(prop, responseData);
                        result = responseData;
                        if (prop !== 'data') {
                            delete responseData[prop];
                        }
                        if (!Array.isArray(result.data)) {
                            throw new Error('Could not get any raw data while converting using .models');
                        }
                    }
                    var arr = [];
                    for (var i = 0; i < result.data.length; i++) {
                        arr.push(this.parseInstanceData(result.data[i], xhr, headers));
                    }
                    result.data = arr;
                    return result;
                },
                parseInstanceData: function (props) {
                    return this.parseInstanceProp ? helpers.getObject(this.parseInstanceProp, props) || props : props;
                }
            };
        helpers.each(pairs, function (parseFunction, name) {
            behavior[name] = function (params) {
                var self = this;
                return baseConnect[name].call(this, params).then(function () {
                    return self[parseFunction].apply(self, arguments);
                });
            };
        });
        return behavior;
    });
    var pairs = {
            getListData: 'parseListData',
            getData: 'parseInstanceData',
            createData: 'parseInstanceData',
            updateData: 'parseInstanceData',
            destroyData: 'parseInstanceData'
        };
});
/*can-connect@0.0.2#helpers/ajax*/
define('can-connect@0.0.2#helpers/ajax', function (require, exports, module) {
    require('when/es6-shim/Promise');
    var helpers = require('can-connect/helpers/');
    var slice = [].slice;
    var win = window, xhrs = [
            function () {
                return new XMLHttpRequest();
            },
            function () {
                return new ActiveXObject('Microsoft.XMLHTTP');
            },
            function () {
                return new ActiveXObject('MSXML2.XMLHTTP.3.0');
            },
            function () {
                return new ActiveXObject('MSXML2.XMLHTTP');
            }
        ], _xhrf = null;
    var hasOwnProperty = Object.prototype.hasOwnProperty, nativeForEach = Array.prototype.forEach;
    var _each = function (o, fn, ctx) {
        if (o == null)
            return;
        if (nativeForEach && o.forEach === nativeForEach)
            o.forEach(fn, ctx);
        else if (o.length === +o.length) {
            for (var i = 0, l = o.length; i < l; i++)
                if (i in o && fn.call(ctx, o[i], i, o) === breaker)
                    return;
        } else {
            for (var key in o)
                if (hasOwnProperty.call(o, key))
                    if (fn.call(ctx, o[key], key, o) === breaker)
                        return;
        }
    };
    var _extend = function (o) {
        _each(slice.call(arguments, 1), function (a) {
            for (var p in a)
                if (a[p] !== void 0)
                    o[p] = a[p];
        });
        return o;
    };
    var $ = {};
    $.xhr = function () {
        if (_xhrf != null)
            return _xhrf();
        for (var i = 0, l = xhrs.length; i < l; i++) {
            try {
                var f = xhrs[i], req = f();
                if (req != null) {
                    _xhrf = f;
                    return req;
                }
            } catch (e) {
                continue;
            }
        }
        return function () {
        };
    };
    $._xhrResp = function (xhr) {
        switch (xhr.getResponseHeader('Content-Type').split(';')[0]) {
        case 'text/xml':
            return xhr.responseXML;
        case 'text/json':
        case 'application/json':
        case 'text/javascript':
        case 'application/javascript':
        case 'application/x-javascript':
            return win.JSON ? JSON.parse(xhr.responseText) : eval(xhr.responseText);
        default:
            return xhr.responseText;
        }
    };
    $._formData = function (o) {
        var kvps = [], regEx = /%20/g;
        for (var k in o)
            kvps.push(encodeURIComponent(k).replace(regEx, '+') + '=' + encodeURIComponent(o[k].toString()).replace(regEx, '+'));
        return kvps.join('&');
    };
    module.exports = function (o) {
        var xhr = $.xhr(), timer, n = 0;
        o = _extend({
            userAgent: 'XMLHttpRequest',
            lang: 'en',
            type: 'GET',
            data: null,
            dataType: 'application/x-www-form-urlencoded'
        }, o);
        if (o.timeout)
            timer = setTimeout(function () {
                xhr.abort();
                if (o.timeoutFn)
                    o.timeoutFn(o.url);
            }, o.timeout);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (timer)
                    clearTimeout(timer);
                if (xhr.status < 300) {
                    if (o.success)
                        o.success($._xhrResp(xhr));
                } else if (o.error)
                    o.error(xhr, xhr.status, xhr.statusText);
                if (o.complete)
                    o.complete(xhr, xhr.statusText);
            } else if (o.progress)
                o.progress(++n);
        };
        var url = o.url, data = null;
        var isPost = o.type == 'POST' || o.type == 'PUT';
        if (!isPost && o.data)
            url += '?' + $._formData(o.data);
        xhr.open(o.type, url);
        if (isPost) {
            var isJson = o.dataType.indexOf('json') >= 0;
            data = isJson ? JSON.stringify(o.data) : $._formData(o.data);
            xhr.setRequestHeader('Content-Type', isJson ? 'application/json' : 'application/x-www-form-urlencoded');
        }
        var deferred = helpers.deferred();
        xhr.onreadystagechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    deferred.resolve(JSON.parse(xhr.responseText));
                } else {
                    deferred.reject(JSON.parse(xhr.responseText));
                }
            }
        };
        xhr.send(data);
        return deferred.promise;
    };
});
/*can-connect@0.0.2#data/url/url*/
define('can-connect@0.0.2#data/url/url', function (require, exports, module) {
    var connect = require('can-connect');
    var helpers = require('can-connect/helpers/');
    var ajax = require('can-connect/helpers/ajax');
    module.exports = connect.behavior('data-url', function (baseConnect) {
        var behavior = {};
        helpers.each(pairs, function (reqOptions, name) {
            behavior[name] = function (params) {
                if (typeof this.url === 'object') {
                    if (typeof this.url[reqOptions.prop] === 'function') {
                        return this.url[reqOptions.prop](params);
                    } else if (this.url[reqOptions.prop]) {
                        return makeAjax(this.url[reqOptions.prop], params, reqOptions.type, this.ajax || ajax);
                    }
                }
                var resource = typeof this.url === 'string' ? this.url : this.url.resource;
                if (resource && this.idProp) {
                    return makeAjax(createURLFromResource(resource, this.idProp, reqOptions.prop), params, reqOptions.type, this.ajax || ajax);
                }
                return baseConnect[name].call(this, params);
            };
        });
        return behavior;
    });
    var pairs = {
            getListData: {
                prop: 'getListData',
                type: 'GET'
            },
            getData: {
                prop: 'getData',
                type: 'GET'
            },
            createData: {
                prop: 'createData',
                type: 'POST'
            },
            updateData: {
                prop: 'updateData',
                type: 'PUT'
            },
            destroyData: {
                prop: 'destroyData',
                type: 'DELETE'
            }
        };
    var makeAjax = function (ajaxOb, data, type, ajax) {
        var params = {};
        if (typeof ajaxOb === 'string') {
            var parts = ajaxOb.split(/\s+/);
            params.url = parts.pop();
            if (parts.length) {
                params.type = parts.pop();
            }
        } else {
            helpers.extend(params, ajaxOb);
        }
        params.data = typeof data === 'object' && !Array.isArray(data) ? helpers.extend(params.data || {}, data) : data;
        params.url = helpers.sub(params.url, params.data, true);
        return ajax(helpers.extend({
            type: type || 'post',
            dataType: 'json'
        }, params));
    };
    var createURLFromResource = function (resource, idProp, name) {
        var url = resource.replace(/\/+$/, '');
        if (name === 'getListData' || name === 'createData') {
            return url;
        } else {
            return url + '/{' + idProp + '}';
        }
    };
});
/*can-connect@0.0.2#fall-through-cache/fall-through-cache*/
define('can-connect@0.0.2#fall-through-cache/fall-through-cache', function (require, exports, module) {
    var getItems = require('../helpers/get-items');
    var connect = require('can-connect');
    var canSet = require('can-set');
    var sortedSetJSON = require('../helpers/sorted-set-json');
    module.exports = connect.behavior('fall-through-cache', function (baseConnect) {
        var behavior = {
                hydrateList: function (listData, set) {
                    set = set || this.listSet(listData);
                    var id = sortedSetJSON(set);
                    var list = baseConnect.hydrateList.call(this, listData, set);
                    if (this._getHydrateListCallbacks[id]) {
                        this._getHydrateListCallbacks[id].shift()(list);
                        if (!this._getHydrateListCallbacks[id].length) {
                            delete this._getHydrateListCallbacks[id];
                        }
                    }
                    return list;
                },
                _getHydrateListCallbacks: {},
                _getHydrateList: function (set, callback) {
                    var id = sortedSetJSON(set);
                    if (!this._getHydrateListCallbacks[id]) {
                        this._getHydrateListCallbacks[id] = [];
                    }
                    this._getHydrateListCallbacks[id].push(callback);
                },
                getListData: function (set) {
                    var self = this;
                    return this.cacheConnection.getListData(set).then(function (data) {
                        self._getHydrateList(set, function (list) {
                            self.addListReference(list, set);
                            setTimeout(function () {
                                baseConnect.getListData.call(self, set).then(function (listData) {
                                    self.cacheConnection.updateListData(listData, set);
                                    self.updatedList(list, listData, set);
                                    self.deleteListReference(list, set);
                                }, function () {
                                    console.log('REJECTED', e);
                                });
                            }, 1);
                        });
                        return data;
                    }, function () {
                        var listData = baseConnect.getListData.call(self, set);
                        listData.then(function (listData) {
                            self.cacheConnection.updateListData(listData, set);
                        });
                        return listData;
                    });
                },
                hydrateInstance: function (props) {
                    var id = this.id(props);
                    var instance = baseConnect.hydrateInstance.apply(this, arguments);
                    if (this._getMakeInstanceCallbacks[id]) {
                        this._getMakeInstanceCallbacks[id].shift()(instance);
                        if (!this._getMakeInstanceCallbacks[id].length) {
                            delete this._getMakeInstanceCallbacks[id];
                        }
                    }
                    return instance;
                },
                _getMakeInstanceCallbacks: {},
                _getMakeInstance: function (id, callback) {
                    if (!this._getMakeInstanceCallbacks[id]) {
                        this._getMakeInstanceCallbacks[id] = [];
                    }
                    this._getMakeInstanceCallbacks[id].push(callback);
                },
                getData: function (params) {
                    var self = this;
                    return this.cacheConnection.getData(params).then(function (instanceData) {
                        self._getMakeInstance(self.id(instanceData) || self.id(params), function (instance) {
                            self.addInstanceReference(instance);
                            setTimeout(function () {
                                baseConnect.getData.call(self, params).then(function (instanceData2) {
                                    self.cacheConnection.updateData(instanceData2);
                                    self.updatedInstance(instance, instanceData2);
                                    self.deleteInstanceReference(instance);
                                }, function () {
                                    console.log('REJECTED', e);
                                });
                            }, 1);
                        });
                        return instanceData;
                    }, function () {
                        var listData = baseConnect.getData.call(self, params);
                        listData.then(function (instanceData) {
                            self.cacheConnection.updateData(instanceData);
                        });
                        return listData;
                    });
                }
            };
        return behavior;
    });
});
/*can-connect@0.0.2#real-time/real-time*/
define('can-connect@0.0.2#real-time/real-time', function (require, exports, module) {
    var connect = require('../can-connect');
    var canSet = require('can-set');
    module.exports = connect.behavior('real-time', function (baseConnect) {
        return {
            createInstance: function (props) {
                var id = this.id(props);
                var instance = this.instanceStore.get(id);
                var promise;
                var serialized;
                if (instance) {
                    return this.updateInstance(props);
                } else {
                    instance = this.hydrateInstance(props);
                    serialized = this.serializeInstance(instance);
                    var self = this;
                    this.addInstanceReference(instance);
                    return Promise.resolve(this.createdData(props, serialized)).then(function () {
                        self.deleteInstanceReference(instance);
                        return instance;
                    });
                }
            },
            createdData: function (props, params, cid) {
                var instance;
                if (cid !== undefined) {
                    instance = this.cidStore.get(cid);
                } else {
                    instance = this.instanceStore.get(this.id(props));
                }
                this.addInstanceReference(instance, this.id(props));
                this.createdInstance(instance, props);
                create.call(this, this.serializeInstance(instance));
                this.deleteInstanceReference(instance);
                return undefined;
            },
            updatedData: function (props, params) {
                var instance = this.instanceStore.get(this.id(params));
                this.updatedInstance(instance, props);
                update.call(this, this.serializeInstance(instance));
                return undefined;
            },
            updateInstance: function (props) {
                var id = this.id(props);
                var instance = this.instanceStore.get(id);
                if (!instance) {
                    instance = this.hydrateInstance(props);
                }
                this.addInstanceReference(instance);
                var serialized = this.serializeInstance(instance), self = this;
                return Promise.resolve(this.updatedData(props, serialized)).then(function () {
                    self.deleteInstanceReference(instance);
                    return instance;
                });
            },
            destroyedData: function (props, params) {
                var id = this.id(params || props);
                var instance = this.instanceStore.get(id);
                if (!instance) {
                    instance = this.hydrateInstance(props);
                }
                var serialized = this.serializeInstance(instance);
                destroy.call(this, serialized);
                return undefined;
            },
            destroyInstance: function (props) {
                var id = this.id(props);
                var instance = this.instanceStore.get(id);
                if (!instance) {
                    instance = this.hydrateInstance(props);
                }
                this.addInstanceReference(instance);
                var serialized = this.serializeInstance(instance), self = this;
                return Promise.resolve(this.destroyedData(props, serialized)).then(function () {
                    self.deleteInstanceReference(instance);
                    return instance;
                });
            }
        };
    });
    var indexOf = function (connection, props, items) {
        var id = connection.id(props);
        for (var i = 0; i < items.length; i++) {
            if (id === connection.id(items[i])) {
                return i;
            }
        }
        return -1;
    };
    var setAdd = function (connection, set, items, item, algebra) {
        return items.concat([item]);
    };
    var create = function (props) {
        var self = this;
        this.listStore.forEach(function (list, id) {
            var set = JSON.parse(id);
            var index = indexOf(self, props, list);
            if (canSet.subset(props, set, self.algebra)) {
                if (index == -1) {
                    var items = self.serializeList(list);
                    self.updatedList(list, { data: setAdd(self, set, items, props, self.algebra) }, set);
                } else {
                }
            }
        });
    };
    var update = function (props) {
        var self = this;
        this.listStore.forEach(function (list, id) {
            var set = JSON.parse(id);
            var index = indexOf(self, props, list);
            if (canSet.subset(props, set, self.algebra)) {
                if (index == -1) {
                    var items = self.serializeList(list);
                    self.updatedList(list, { data: setAdd(self, set, items, props, self.algebra) }, set);
                }
            } else if (index != -1) {
                var items = self.serializeList(list);
                items.splice(index, 1);
                self.updatedList(list, { data: items }, set);
            }
        });
    };
    var destroy = function (props) {
        var self = this;
        this.listStore.forEach(function (list, id) {
            var set = JSON.parse(id);
            var index = indexOf(self, props, list);
            if (index != -1) {
                var items = self.serializeList(list);
                items.splice(index, 1);
                self.updatedList(list, { data: items }, set);
            }
        });
    };
});
/*can-connect@0.0.2#can/super-map/super-map*/
define('can-connect@0.0.2#can/super-map/super-map', function (require, exports, module) {
    var connect = require('can-connect');
    require('../../constructor/');
    require('../map/');
    require('../can');
    require('../../constructor/store/');
    require('../../constructor/callbacks-once/');
    require('../../data/callbacks/');
    require('../../data/callbacks-cache/');
    require('../../data/combine-requests/');
    require('../../data/inline-cache/');
    require('../../data/localstorage-cache/');
    require('../../data/parse/');
    require('../../data/url/');
    require('../../fall-through-cache/');
    require('../../real-time/');
    var Map = require('can/map/map');
    var List = require('can/list/list');
    connect.superMap = function (options) {
        var behaviors = [
                'constructor',
                'can-map',
                'constructor-store',
                'data-callbacks',
                'data-callbacks-cache',
                'data-combine-requests',
                'data-inline-cache',
                'data-parse',
                'data-url',
                'real-time',
                'constructor-callbacks-once'
            ];
        if (typeof localStorage !== 'undefined') {
            options.cacheConnection = connect(['data-localstorage-cache'], {
                name: options.name + 'Cache',
                idProp: options.idProp
            });
            behaviors.push('fall-through-cache');
        }
        options.ajax = $.ajax;
        return connect(behaviors, options);
    };
    module.exports = connect.superMap;
});
/*pmo/models/base-url*/
define('pmo/models/base-url', [
    'exports',
    'module',
    'steal-platform'
], function (exports, module, _stealPlatform) {
    'use strict';
    var _interopRequire = function (obj) {
        return obj && obj.__esModule ? obj['default'] : obj;
    };
    var platform = _interopRequire(_stealPlatform);
    var baseUrl = '';
    if (platform.isCordova || platform.isNW) {
        baseUrl = 'http://place-my-order.com';
    }
    module.exports = baseUrl;
});
/*pmo/models/restaurant*/
define('pmo/models/restaurant', [
    'exports',
    'module',
    'can',
    'can-connect/can/tag/',
    'can-connect/can/super-map/',
    './base-url'
], function (exports, module, _can, _canConnectCanTag, _canConnectCanSuperMap, _baseUrl) {
    'use strict';
    var _interopRequire = function (obj) {
        return obj && obj.__esModule ? obj['default'] : obj;
    };
    var can = _interopRequire(_can);
    var tag = _interopRequire(_canConnectCanTag);
    var superMap = _interopRequire(_canConnectCanSuperMap);
    var baseUrl = _interopRequire(_baseUrl);
    var Restaurant = can.Map.extend({});
    Restaurant.List = can.List.extend({ Map: Restaurant }, {});
    var restaurantConnection = superMap({
            url: baseUrl + '/api/restaurants',
            idProp: '_id',
            Map: Restaurant,
            List: Restaurant.List,
            name: 'restaurant'
        });
    tag('restaurant-model', restaurantConnection);
    module.exports = Restaurant;
});