/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	window.underscore=window._=__webpack_require__(2);
	window.Backbone=__webpack_require__(3);
	window.store = __webpack_require__(4);

	__webpack_require__(5);
	__webpack_require__(21);
	__webpack_require__(26);
	__webpack_require__(27);

	var apiPort=location.origin;
	// var apiPort='http://dev.91yaowang.com';
	window.fresh = {
	    cache: {},
	    loadDate: 0,
	    apiRoot:apiPort+'/app/webservice/v2/',
	    batchRoot:apiPort+'/app/',
	    init: function (){
	        this.$body = $('body');
	        this.$main = $('#mainPage');
	        this.$content = $('#content');
	        var Router = __webpack_require__(28);
	        window.fresh.router = new Router;
	        Backbone.history.start({pushState: false});
	    }
	};

	$(function(){

	    if($.getParam('isapp')){
	        localStorage.setItem('yw_user_loginToken',$.getParam('loginToken'));
	    }

	    _initShareInfo();
	    function _initShareInfo(){
	        jsb.setShareInfo({
	            title : '万元恋爱基金大作战',
	            desc : '现在来摇旺晒幸福，赢取万元恋爱基金',
	            link : location.origin+'/events/valentinesDay/index.html',
	            icon : 'https://wz.91yaowang.com/weizhan/res/images/headImg.jpg'
	        });
	    }
	    fresh.init();
	});

/***/ },
/* 2 */
/***/ function(module, exports) {

	/**
	 * 阉割版的underScore只保留backbone依赖的函数已经 _.each 和 _.template
	 *
	 */


	var _ = function(obj) {
	    if (obj instanceof _) return obj;
	    if (!(this instanceof _)) return new _(obj);
	    this._wrapped = obj;
	};

	var ArrayProto = Array.prototype,
	    ObjProto = Object.prototype,
	    FuncProto = Function.prototype,
	    push = ArrayProto.push,
	    slice = ArrayProto.slice,
	    toString = ObjProto.toString,
	    hasOwnProperty = ObjProto.hasOwnProperty,
	    nativeIsArray = Array.isArray,
	    nativeKeys = Object.keys,
	    nativeBind = FuncProto.bind,
	    nativeCreate = Object.create,
	    hasEnumBug = !{toString: null}.propertyIsEnumerable('toString'),
	    nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString', 'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'],
	    MAX_ARRAY_INDEX = Math.pow(2, 53) - 1,
	    getLength = property('length'),
	    Ctor = function () {
	    };


	if (typeof /./ != 'function' && typeof Int8Array != 'object') {
	    _.isFunction = function (obj) {
	        return typeof obj == 'function' || false;
	    };
	}
	function property(key) {
	    return function (obj) {
	        return obj == null ? void 0 : obj[key];
	    };
	}

	function isArrayLike(collection) {
	    var length = getLength(collection);
	    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
	}

	function collectNonEnumProps(obj, keys) {
	    var nonEnumIdx = nonEnumerableProps.length;
	    var constructor = obj.constructor;
	    var proto = (_.isFunction(constructor) && constructor.prototype) || ObjProto;
	    var prop = 'constructor';
	    if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);
	    while (nonEnumIdx--) {
	        prop = nonEnumerableProps[nonEnumIdx];
	        if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
	            keys.push(prop);
	        }
	    }
	}

	function baseCreate(prototype) {
	    if (!_.isObject(prototype)) return {};
	    if (nativeCreate) return nativeCreate(prototype);
	    Ctor.prototype = prototype;
	    var result = new Ctor;
	    Ctor.prototype = null;
	    return result;
	}

	function executeBound(sourceFunc, boundFunc, context, callingContext, args) {
	    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
	    var self = baseCreate(sourceFunc.prototype);
	    var result = sourceFunc.apply(self, args);
	    if (_.isObject(result)) return result;
	    return self;
	}

	function createAssigner(keysFunc, undefinedOnly) {
	    return function (obj) {
	        var length = arguments.length;
	        if (length < 2 || obj == null) return obj;
	        for (var index = 1; index < length; index++) {
	            var source = arguments[index],
	                keys = keysFunc(source),
	                l = keys.length;
	            for (var i = 0; i < l; i++) {
	                var key = keys[i];
	                if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
	            }
	        }
	        return obj;
	    };
	}

	function cb(value, context, argCount) {
	    if (value == null) return _.identity;
	    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
	    if (_.isObject(value)) return _.matcher(value);
	    return _.property(value);
	}

	function property(key) {
	    return function (obj) {
	        return obj == null ? void 0 : obj[key];
	    };
	}


	function optimizeCb(func, context, argCount) {
	    if (context === void 0) return func;
	    switch (argCount == null ? 3 : argCount) {
	        case 1:
	            return function (value) {
	                return func.call(context, value);
	            };
	        case 2:
	            return function (value, other) {
	                return func.call(context, value, other);
	            };
	        case 3:
	            return function (value, index, collection) {
	                return func.call(context, value, index, collection);
	            };
	        case 4:
	            return function (accumulator, value, index, collection) {
	                return func.call(context, accumulator, value, index, collection);
	            };
	    }
	    return function () {
	        return func.apply(context, arguments);
	    };
	}

	function flatten(input, shallow, strict, startIndex) {
	    var output = [], idx = 0;
	    for (var i = startIndex || 0, length = getLength(input); i < length; i++) {
	        var value = input[i];
	        if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
	            //flatten current level of array or arguments object
	            if (!shallow) value = flatten(value, shallow, strict);
	            var j = 0, len = value.length;
	            output.length += len;
	            while (j < len) {
	                output[idx++] = value[j++];
	            }
	        } else if (!strict) {
	            output[idx++] = value;
	        }
	    }
	    return output;
	}

	_.isObject = function (obj) {
	    var type = typeof obj;
	    return type === 'function' || type === 'object' && !!obj;
	};

	_.each = _.forEach = function (obj, iteratee, context) {
	    iteratee = optimizeCb(iteratee, context);
	    var i, length;
	    if (isArrayLike(obj)) {
	        for (i = 0, length = obj.length; i < length; i++) {
	            iteratee(obj[i], i, obj);
	        }
	    } else {
	        var keys = _.keys(obj);
	        for (i = 0, length = keys.length; i < length; i++) {
	            iteratee(obj[keys[i]], keys[i], obj);
	        }
	    }
	    return obj;
	};

	_.has = function (obj, key) {
	    return obj != null && hasOwnProperty.call(obj, key);
	};
	_.keys = function (obj) {
	    if (!_.isObject(obj)) return [];
	    if (nativeKeys) return nativeKeys(obj);
	    var keys = [];
	    for (var key in obj) if (_.has(obj, key)) keys.push(key);
	    if (hasEnumBug) collectNonEnumProps(obj, keys);
	    return keys;
	};

	var idCounter = 0;
	_.uniqueId = function (prefix) {
	    var id = ++idCounter + '';
	    return prefix ? prefix + id : id;
	};
	_.isArray = nativeIsArray || function (obj) {
	        return toString.call(obj) === '[object Array]';
	    };

	_.isEmpty = function (obj) {
	    if (obj == null) return true;
	    if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
	    return _.keys(obj).length === 0;
	};

	_.size = function (obj) {
	    if (obj == null) return 0;
	    return isArrayLike(obj) ? obj.length : _.keys(obj).length;
	};

	_.bind = function (func, context) {
	    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
	    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
	    var args = slice.call(arguments, 2);
	    var bound = function () {
	        return executeBound(func, bound, context, this, args.concat(slice.call(arguments)));
	    };
	    return bound;
	};

	_.partial = function (func) {
	    var boundArgs = slice.call(arguments, 1);
	    var bound = function () {
	        var position = 0, length = boundArgs.length;
	        var args = Array(length);
	        for (var i = 0; i < length; i++) {
	            args[i] = boundArgs[i] === _ ? arguments[position++] : boundArgs[i];
	        }
	        while (position < arguments.length) args.push(arguments[position++]);
	        return executeBound(func, bound, this, this, args);
	    };
	    return bound;
	};
	_.once = _.partial(_.before, 2);


	_.allKeys = function (obj) {
	    if (!_.isObject(obj)) return [];
	    var keys = [];
	    for (var key in obj) keys.push(key);
	    // Ahem, IE < 9.
	    if (hasEnumBug) collectNonEnumProps(obj, keys);
	    return keys;
	};
	_.extend = createAssigner(_.allKeys);

	_.extendOwn = _.assign = createAssigner(_.keys);


	_.pick = function (object, oiteratee, context) {
	    var result = {}, obj = object, iteratee, keys;
	    if (obj == null) return result;
	    if (_.isFunction(oiteratee)) {
	        keys = _.allKeys(obj);
	        iteratee = optimizeCb(oiteratee, context);
	    } else {
	        keys = flatten(arguments, false, false, 1);
	        iteratee = function (value, key, obj) {
	            return key in obj;
	        };
	        obj = Object(obj);
	    }
	    for (var i = 0, length = keys.length; i < length; i++) {
	        var key = keys[i];
	        var value = obj[key];
	        if (iteratee(value, key, obj)) result[key] = value;
	    }
	    return result;
	};
	_.result = function (object, property, fallback) {
	    var value = object == null ? void 0 : object[property];
	    if (value === void 0) {
	        value = fallback;
	    }
	    return _.isFunction(value) ? value.call(object) : value;
	};

	_.identity = function (value) {
	    return value;
	};


	_.matcher = _.matches = function (attrs) {
	    attrs = _.extendOwn({}, attrs);
	    return function (obj) {
	        return _.isMatch(obj, attrs);
	    };
	};
	_.iteratee = function (value, context) {
	    return cb(value, context, Infinity);
	};

	_.map = _.collect = function (obj, iteratee, context) {
	    iteratee = cb(iteratee, context);
	    var keys = !isArrayLike(obj) && _.keys(obj),
	        length = (keys || obj).length,
	        results = Array(length);
	    for (var index = 0; index < length; index++) {
	        var currentKey = keys ? keys[index] : index;
	        results[index] = iteratee(obj[currentKey], currentKey, obj);
	    }
	    return results;
	};

	_.bindAll = function (obj) {
	    var i, length = arguments.length, key;
	    if (length <= 1) throw new Error('bindAll must be passed function names');
	    for (i = 1; i < length; i++) {
	        key = arguments[i];
	        obj[key] = _.bind(obj[key], obj);
	    }
	    return obj;
	};

	_.some = _.any = function (obj, predicate, context) {
	    predicate = cb(predicate, context);
	    var keys = !isArrayLike(obj) && _.keys(obj),
	        length = (keys || obj).length;
	    for (var index = 0; index < length; index++) {
	        var currentKey = keys ? keys[index] : index;
	        if (predicate(obj[currentKey], currentKey, obj)) return true;
	    }
	    return false;
	};

	_.has = function (obj, key) {
	    return obj != null && hasOwnProperty.call(obj, key);
	};

	_.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function (name) {
	    _['is' + name] = function (obj) {
	        return toString.call(obj) === '[object ' + name + ']';
	    };
	});


	_.templateSettings = {
	    evaluate: /<%([\s\S]+?)%>/g,
	    interpolate: /<%=([\s\S]+?)%>/g,
	    escape: /<%-([\s\S]+?)%>/g
	};


	var noMatch = /(.)^/;

	var escapes = {
	    "'": "'",
	    '\\': '\\',
	    '\r': 'r',
	    '\n': 'n',
	    '\u2028': 'u2028',
	    '\u2029': 'u2029'
	};

	var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

	var escapeChar = function (match) {
	    return '\\' + escapes[match];
	};

	_.defaults = createAssigner(_.allKeys, true);

	_.template = function (text, settings, oldSettings) {
	    if (!settings && oldSettings) settings = oldSettings;
	    settings = _.defaults({}, settings, _.templateSettings);

	    // Combine delimiters into one regular expression via alternation.
	    var matcher = RegExp([
	            (settings.escape || noMatch).source,
	            (settings.interpolate || noMatch).source,
	            (settings.evaluate || noMatch).source
	        ].join('|') + '|$', 'g');

	    // Compile the template source, escaping string literals appropriately.
	    var index = 0;
	    var source = "__p+='";
	    text.replace(matcher, function (match, escape, interpolate, evaluate, offset) {
	        source += text.slice(index, offset).replace(escaper, escapeChar);
	        index = offset + match.length;

	        if (escape) {
	            source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
	        } else if (interpolate) {
	            source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
	        } else if (evaluate) {
	            source += "';\n" + evaluate + "\n__p+='";
	        }

	        // Adobe VMs need the match returned to produce the correct offest.
	        return match;
	    });
	    source += "';\n";

	    // If a variable is not specified, place data values in local scope.
	    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

	    source = "var __t,__p='',__j=Array.prototype.join," +
	        "print=function(){__p+=__j.call(arguments,'');};\n" +
	        source + 'return __p;\n';

	    try {
	        var render = new Function(settings.variable || 'obj', '_', source);
	    } catch (e) {
	        e.source = source;
	        throw e;
	    }

	    var template = function (data) {
	        return render.call(this, data, _);
	    };

	    // Provide the compiled source as a convenience for precompilation.
	    var argument = settings.variable || 'obj';
	    template.source = 'function(' + argument + '){\n' + source + '}';

	    return template;
	};

	var eq = function(a, b, aStack, bStack) {
	    // Identical objects are equal. `0 === -0`, but they aren't identical.
	    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
	    if (a === b) return a !== 0 || 1 / a === 1 / b;
	    // A strict comparison is necessary because `null == undefined`.
	    if (a == null || b == null) return a === b;
	    // Unwrap any wrapped objects.
	    if (a instanceof _) a = a._wrapped;
	    if (b instanceof _) b = b._wrapped;
	    // Compare `[[Class]]` names.
	    var className = toString.call(a);
	    if (className !== toString.call(b)) return false;
	    switch (className) {
	        // Strings, numbers, regular expressions, dates, and booleans are compared by value.
	        case '[object RegExp]':
	        // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
	        case '[object String]':
	            // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
	            // equivalent to `new String("5")`.
	            return '' + a === '' + b;
	        case '[object Number]':
	            // `NaN`s are equivalent, but non-reflexive.
	            // Object(NaN) is equivalent to NaN
	            if (+a !== +a) return +b !== +b;
	            // An `egal` comparison is performed for other numeric values.
	            return +a === 0 ? 1 / +a === 1 / b : +a === +b;
	        case '[object Date]':
	        case '[object Boolean]':
	            // Coerce dates and booleans to numeric primitive values. Dates are compared by their
	            // millisecond representations. Note that invalid dates with millisecond representations
	            // of `NaN` are not equivalent.
	            return +a === +b;
	    }

	    var areArrays = className === '[object Array]';
	    if (!areArrays) {
	        if (typeof a != 'object' || typeof b != 'object') return false;

	        // Objects with different constructors are not equivalent, but `Object`s or `Array`s
	        // from different frames are.
	        var aCtor = a.constructor, bCtor = b.constructor;
	        if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
	            _.isFunction(bCtor) && bCtor instanceof bCtor)
	            && ('constructor' in a && 'constructor' in b)) {
	            return false;
	        }
	    }
	    // Assume equality for cyclic structures. The algorithm for detecting cyclic
	    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

	    // Initializing stack of traversed objects.
	    // It's done here since we only need them for objects and arrays comparison.
	    aStack = aStack || [];
	    bStack = bStack || [];
	    var length = aStack.length;
	    while (length--) {
	        // Linear search. Performance is inversely proportional to the number of
	        // unique nested structures.
	        if (aStack[length] === a) return bStack[length] === b;
	    }

	    // Add the first object to the stack of traversed objects.
	    aStack.push(a);
	    bStack.push(b);

	    // Recursively compare objects and arrays.
	    if (areArrays) {
	        // Compare array lengths to determine if a deep comparison is necessary.
	        length = a.length;
	        if (length !== b.length) return false;
	        // Deep compare the contents, ignoring non-numeric properties.
	        while (length--) {
	            if (!eq(a[length], b[length], aStack, bStack)) return false;
	        }
	    } else {
	        // Deep compare objects.
	        var keys = _.keys(a), key;
	        length = keys.length;
	        // Ensure that both objects contain the same number of properties before comparing deep equality.
	        if (_.keys(b).length !== length) return false;
	        while (length--) {
	            // Deep compare each member
	            key = keys[length];
	            if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
	        }
	    }
	    // Remove the first object from the stack of traversed objects.
	    aStack.pop();
	    bStack.pop();
	    return true;
	};

	_.isEqual=function(a,b){
	    return eq(a,b)
	};

	_.isBoolean = function(obj) {
	    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
	};

	_.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
	    if (!isArrayLike(obj)) obj = _.values(obj);
	    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
	    return _.indexOf(obj, item, fromIndex) >= 0;
	};

	function createIndexFinder(dir, predicateFind, sortedIndex) {
	    return function(array, item, idx) {
	        var i = 0, length = getLength(array);
	        if (typeof idx == 'number') {
	            if (dir > 0) {
	                i = idx >= 0 ? idx : Math.max(idx + length, i);
	            } else {
	                length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
	            }
	        } else if (sortedIndex && idx && length) {
	            idx = sortedIndex(array, item);
	            return array[idx] === item ? idx : -1;
	        }
	        if (item !== item) {
	            idx = predicateFind(slice.call(array, i, length), _.isNaN);
	            return idx >= 0 ? idx + i : -1;
	        }
	        for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
	            if (array[idx] === item) return idx;
	        }
	        return -1;
	    };
	}

	_.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
	_.lastIndexOf = createIndexFinder(-1, _.findLastIndex);

	_.uniq = _.unique = function(array, isSorted, iteratee, context) {
	    if (!_.isBoolean(isSorted)) {
	        context = iteratee;
	        iteratee = isSorted;
	        isSorted = false;
	    }
	    if (iteratee != null) iteratee = cb(iteratee, context);
	    var result = [];
	    var seen = [];
	    for (var i = 0, length = getLength(array); i < length; i++) {
	        var value = array[i],
	            computed = iteratee ? iteratee(value, i, array) : value;
	        if (isSorted) {
	            if (!i || seen !== computed) result.push(value);
	            seen = computed;
	        } else if (iteratee) {
	            if (!_.contains(seen, computed)) {
	                seen.push(computed);
	                result.push(value);
	            }
	        } else if (!_.contains(result, value)) {
	            result.push(value);
	        }
	    }
	    return result;
	};



	module.exports = _;



/***/ },
/* 3 */
/***/ function(module, exports) {

	/**
	 * 阉割版的backbone
	 * 只保留了event view history router模块
	 *
	 */

	var Backbone = {};
	Backbone.VERSION = '1.2.1';
	Backbone.$ = $;

	// Backbone.Events

	var Events = Backbone.Events = {};

	var eventSplitter = /\s+/;
	var eventsApi = function (iteratee, memo, name, callback, opts) {
	    var i = 0, names;
	    if (name && typeof name === 'object') {
	        // Handle event maps.
	        if (callback !== void 0 && 'context' in opts && opts.context === void 0) opts.context = callback;
	        for (names = _.keys(name); i < names.length; i++) {
	            memo = iteratee(memo, names[i], name[names[i]], opts);
	        }
	    } else if (name && eventSplitter.test(name)) {
	        // Handle space separated event names.
	        for (names = name.split(eventSplitter); i < names.length; i++) {
	            memo = iteratee(memo, names[i], callback, opts);
	        }
	    } else {
	        memo = iteratee(memo, name, callback, opts);
	    }
	    return memo;
	};

	Events.on = function (name, callback, context) {
	    return internalOn(this, name, callback, context);
	};

	var internalOn = function (obj, name, callback, context, listening) {
	    obj._events = eventsApi(onApi, obj._events || {}, name, callback, {
	        context: context,
	        ctx: obj,
	        listening: listening
	    });
	    if (listening) {
	        var listeners = obj._listeners || (obj._listeners = {});
	        listeners[listening.id] = listening;
	    }
	    return obj;
	};

	Events.listenTo = function (obj, name, callback) {
	    if (!obj) return this;
	    var id = obj._listenId || (obj._listenId = _.uniqueId('l'));
	    var listeningTo = this._listeningTo || (this._listeningTo = {});
	    var listening = listeningTo[id];

	    if (!listening) {
	        var thisId = this._listenId || (this._listenId = _.uniqueId('l'));
	        listening = listeningTo[id] = {obj: obj, objId: id, id: thisId, listeningTo: listeningTo, count: 0};
	    }

	    internalOn(obj, name, callback, this, listening);
	    return this;
	};

	var onApi = function (events, name, callback, options) {
	    if (callback) {
	        var handlers = events[name] || (events[name] = []);
	        var context = options.context, ctx = options.ctx, listening = options.listening;
	        if (listening) listening.count++;

	        handlers.push({callback: callback, context: context, ctx: context || ctx, listening: listening});
	    }
	    return events;
	};

	Events.off = function (name, callback, context) {
	    if (!this._events) return this;
	    this._events = eventsApi(offApi, this._events, name, callback, {
	        context: context,
	        listeners: this._listeners
	    });
	    return this;
	};

	Events.stopListening = function (obj, name, callback) {
	    var listeningTo = this._listeningTo;
	    if (!listeningTo) return this;

	    var ids = obj ? [obj._listenId] : _.keys(listeningTo);

	    for (var i = 0; i < ids.length; i++) {
	        var listening = listeningTo[ids[i]];

	        if (!listening) break;

	        listening.obj.off(name, callback, this);
	    }
	    if (_.isEmpty(listeningTo)) this._listeningTo = void 0;

	    return this;
	};

	var offApi = function (events, name, callback, options) {
	    if (!events) return;

	    var i = 0, listening;
	    var context = options.context, listeners = options.listeners;
	    if (!name && !callback && !context) {
	        var ids = _.keys(listeners);
	        for (; i < ids.length; i++) {
	            listening = listeners[ids[i]];
	            delete listeners[listening.id];
	            delete listening.listeningTo[listening.objId];
	        }
	        return;
	    }

	    var names = name ? [name] : _.keys(events);
	    for (; i < names.length; i++) {
	        name = names[i];
	        var handlers = events[name];

	        if (!handlers) break;

	        var remaining = [];
	        for (var j = 0; j < handlers.length; j++) {
	            var handler = handlers[j];
	            if (
	                callback && callback !== handler.callback &&
	                callback !== handler.callback._callback ||
	                context && context !== handler.context
	            ) {
	                remaining.push(handler);
	            } else {
	                listening = handler.listening;
	                if (listening && --listening.count === 0) {
	                    delete listeners[listening.id];
	                    delete listening.listeningTo[listening.objId];
	                }
	            }
	        }

	        if (remaining.length) {
	            events[name] = remaining;
	        } else {
	            delete events[name];
	        }
	    }
	    if (_.size(events)) return events;
	};

	Events.once = function (name, callback, context) {
	    // Map the event into a `{event: once}` object.
	    var events = eventsApi(onceMap, {}, name, callback, _.bind(this.off, this));
	    return this.on(events, void 0, context);
	};

	Events.listenToOnce = function (obj, name, callback) {
	    // Map the event into a `{event: once}` object.
	    var events = eventsApi(onceMap, {}, name, callback, _.bind(this.stopListening, this, obj));
	    return this.listenTo(obj, events);
	};

	var onceMap = function (map, name, callback, offer) {
	    if (callback) {
	        var once = map[name] = _.once(function () {
	            offer(name, once);
	            callback.apply(this, arguments);
	        });
	        once._callback = callback;
	    }
	    return map;
	};

	Events.trigger = function (name) {
	    if (!this._events) return this;

	    var length = Math.max(0, arguments.length - 1);
	    var args = Array(length);
	    for (var i = 0; i < length; i++) args[i] = arguments[i + 1];

	    eventsApi(triggerApi, this._events, name, void 0, args);
	    return this;
	};

	var triggerApi = function (objEvents, name, cb, args) {
	    if (objEvents) {
	        var events = objEvents[name];
	        var allEvents = objEvents.all;
	        if (events && allEvents) allEvents = allEvents.slice();
	        if (events) triggerEvents(events, args);
	        if (allEvents) triggerEvents(allEvents, [name].concat(args));
	    }
	    return objEvents;
	};

	var triggerEvents = function (events, args) {
	    var ev, i = -1, l = events.length, a1 = args[0], a2 = args[1], a3 = args[2];
	    switch (args.length) {
	        case 0:
	            while (++i < l) (ev = events[i]).callback.call(ev.ctx);
	            return;
	        case 1:
	            while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1);
	            return;
	        case 2:
	            while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2);
	            return;
	        case 3:
	            while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2, a3);
	            return;
	        default:
	            while (++i < l) (ev = events[i]).callback.apply(ev.ctx, args);
	            return;
	    }
	};
	Events.bind = Events.on;
	Events.unbind = Events.off;

	_.extend(Backbone, Events);


	// Backbone.View

	var View = Backbone.View = function (options) {
	    this.cid = _.uniqueId('view');
	    _.extend(this, _.pick(options, viewOptions));
	    this._ensureElement();
	    this.initialize.apply(this, arguments);
	};

	var delegateEventSplitter = /^(\S+)\s*(.*)$/;

	var viewOptions = ['el', 'id', 'attributes', 'className', 'tagName', 'events'];

	_.extend(View.prototype, Events, {

	    tagName: 'div',

	    $: function (selector) {
	        return this.$el.find(selector);
	    },

	    initialize: function () {
	    },

	    render: function () {
	        return this;
	    },

	    remove: function () {
	        this._removeElement();
	        this.stopListening();
	        return this;
	    },

	    _removeElement: function () {
	        this.$el.remove();
	    },

	    setElement: function (element) {
	        // this.undelegateEvents();
	        this._setElement(element);
	        this.delegateEvents();
	        return this;
	    },

	    _setElement: function (el) {
	        this.$el = el instanceof Backbone.$ ? el : Backbone.$(el);
	        this.el = this.$el[0];
	    },

	    delegateEvents: function (events) {
	        events || (events = _.result(this, 'events'));
	        if (!events) return this;
	        this.undelegateEvents();
	        for (var key in events) {
	            var method = events[key];
	            if (!_.isFunction(method)) method = this[method];
	            if (!method) continue;
	            var match = key.match(delegateEventSplitter);
	            this.delegate(match[1], match[2], _.bind(method, this));
	        }
	        return this;
	    },

	    delegate: function (eventName, selector, listener) {
	        this.$el.on(eventName + '.delegateEvents' + this.cid, selector, listener);
	        return this;
	    },

	    undelegateEvents: function () {
	        if (this.$el) {
	            this.$el.off('.delegateEvents' + this.cid);
	        } else if (this.el) {
	            $(this.el).off();
	        }
	        return this;
	    },

	    undelegate: function (eventName, selector, listener) {
	        this.$el.off(eventName + '.delegateEvents' + this.cid, selector, listener);
	        return this;
	    },
	    _createElement: function (tagName) {
	        return document.createElement(tagName);
	    },

	    _ensureElement: function () {
	        if (!this.el) {
	            var attrs = _.extend({}, _.result(this, 'attributes'));
	            if (this.id) attrs.id = _.result(this, 'id');
	            if (this.className) attrs['class'] = _.result(this, 'className');
	            this.setElement(this._createElement(_.result(this, 'tagName')));
	            this._setAttributes(attrs);
	        } else {
	            this.setElement(_.result(this, 'el'));
	        }
	    },

	    _setAttributes: function (attributes) {
	        this.$el.attr(attributes);
	    }

	});


	// Backbone.Router

	var Router = Backbone.Router = function (options) {
	    options || (options = {});
	    if (options.routes) this.routes = options.routes;

	    this.initialize.apply(this, arguments);
	    this._bindRoutes();
	};

	var optionalParam = /\((.*?)\)/g;
	var namedParam = /(\(\?)?:\w+/g;
	var splatParam = /\*\w+/g;
	var escapeRegExp = /[\-{}\[\]+?.,\\\^$|#\s]/g;


	_.extend(Router.prototype, Events, {


	    initialize: function () {
	    },


	    route: function (route, name, callback) {
	        if (!_.isRegExp(route)) route = this._routeToRegExp(route);
	        if (_.isFunction(name)) {
	            callback = name;
	            name = '';
	        }
	        if (!callback) callback = this[name];
	        var router = this;

	        Backbone.history.route(route, function (fragment) {
	            //route before 陈材华添加
	            router._beforeRoute && router._beforeRoute(name);
	            var args = router._extractParameters(route, fragment);
	            if (router.execute(callback, args, name) !== false) {
	                router.trigger.apply(router, ['route:' + name].concat(args));
	                router.trigger('route', name, args);
	                Backbone.history.trigger('route', router, name, args);
	            }
	        });
	        return this;

	    },


	    execute: function (callback, args, name) {
	        if (callback) callback.apply(this, args);
	    },


	    navigate: function (fragment, options) {

	        Backbone.history.navigate(fragment, options);
	        return this;
	    },

	    _bindRoutes: function () {
	        if (!this.routes) return;
	        this.routes = _.result(this, 'routes');
	        var route, routes = _.keys(this.routes);
	        while ((route = routes.pop()) != null) {
	            this.route(route, this.routes[route]);
	        }
	    },


	    _routeToRegExp: function (route) {
	        route = route.replace(escapeRegExp, '\\$&')
	            .replace(optionalParam, '(?:$1)?')
	            .replace(namedParam, function (match, optional) {
	                return optional ? match : '([^/?]+)';
	            })
	            .replace(splatParam, '([^?]*?)');
	//      return new RegExp('^' + route + '(?:\\?([\\s\\S]*))?$');
	//        陈材华 路由不区分大小写
	        return new RegExp('^' + route + '(?:\\?([\\s\\S]*))?$', 'i');
	    },

	    _extractParameters: function (route, fragment) {
	        var params = route.exec(fragment).slice(1);
	        return _.map(params, function (param, i) {
	            // Don't decode the search params.
	            if (i === params.length - 1) return param || null;
	            return param ? decodeURIComponent(param) : null;
	        });
	    }

	});

	// Backbone.History

	var History = Backbone.History = function () {
	    this.handlers = [];
	    _.bindAll(this, 'checkUrl');

	    if (typeof window !== 'undefined') {
	        this.location = window.location;
	        this.history = window.history;
	    }
	};


	var routeStripper = /^[#\/]|\s+$/g;


	var rootStripper = /^\/+|\/+$/g;


	var pathStripper = /#.*$/;


	History.started = false;


	_.extend(History.prototype, Events, {


	    interval: 50,


	    atRoot: function () {
	        var path = this.location.pathname.replace(/[^\/]$/, '$&/');
	        return path === this.root && !this.getSearch();
	    },


	    matchRoot: function () {
	        var path = this.decodeFragment(this.location.pathname);
	        var root = path.slice(0, this.root.length - 1) + '/';
	        return root === this.root;
	    },


	    decodeFragment: function (fragment) {
	        return decodeURI(fragment.replace(/%25/g, '%2525'));
	    },


	    getSearch: function () {
	        var match = this.location.href.replace(/#.*/, '').match(/\?.+/);
	        return match ? match[0] : '';
	    },


	    getHash: function (window) {
	        var match = (window || this).location.href.match(/#(.*)$/);
	        return match ? match[1] : '';
	    },


	    getPath: function () {
	        var path = this.decodeFragment(
	            this.location.pathname + this.getSearch()
	        ).slice(this.root.length - 1);
	        return path.charAt(0) === '/' ? path.slice(1) : path;
	    },


	    getFragment: function (fragment) {
	        if (fragment == null) {
	            if (this._usePushState || !this._wantsHashChange) {
	                fragment = this.getPath();
	            } else {
	                fragment = this.getHash();
	            }
	        }
	        return fragment.replace(routeStripper, '');
	    },


	    start: function (options) {
	        if (History.started) throw new Error('Backbone.history has already been started');
	        History.started = true;


	        this.options = _.extend({root: '/'}, this.options, options);
	        this.root = this.options.root;
	        this._wantsHashChange = this.options.hashChange !== false;
	        this._hasHashChange = 'onhashchange' in window;
	        this._useHashChange = this._wantsHashChange && this._hasHashChange;
	        this._wantsPushState = !!this.options.pushState;
	        this._hasPushState = !!(this.history && this.history.pushState);
	        this._usePushState = this._wantsPushState && this._hasPushState;
	        this.fragment = this.getFragment();


	        this.root = ('/' + this.root + '/').replace(rootStripper, '/');


	        if (this._wantsHashChange && this._wantsPushState) {


	            if (!this._hasPushState && !this.atRoot()) {
	                var root = this.root.slice(0, -1) || '/';
	                this.location.replace(root + '#' + this.getPath());

	                return true;


	            } else if (this._hasPushState && this.atRoot()) {
	                this.navigate(this.getHash(), {replace: true});
	            }

	        }


	        if (!this._hasHashChange && this._wantsHashChange && !this._usePushState) {
	            this.iframe = document.createElement('iframe');
	            this.iframe.src = 'javascript:0';
	            this.iframe.style.display = 'none';
	            this.iframe.tabIndex = -1;
	            var body = document.body;
	            // Using `appendChild` will throw on IE < 9 if the document is not ready.
	            var iWindow = body.insertBefore(this.iframe, body.firstChild).contentWindow;
	            iWindow.document.open();
	            iWindow.document.close();
	            iWindow.location.hash = '#' + this.fragment;
	        }


	        var addEventListener = window.addEventListener || function (eventName, listener) {
	                return attachEvent('on' + eventName, listener);
	            };


	        if (this._usePushState) {
	            addEventListener('popstate', this.checkUrl, false);
	        } else if (this._useHashChange && !this.iframe) {
	            addEventListener('hashchange', this.checkUrl, false);
	        } else if (this._wantsHashChange) {
	            this._checkUrlInterval = setInterval(this.checkUrl, this.interval);
	        }

	        if (!this.options.silent) return this.loadUrl();
	    },


	    stop: function () {

	        var removeEventListener = window.removeEventListener || function (eventName, listener) {
	                return detachEvent('on' + eventName, listener);
	            };


	        if (this._usePushState) {
	            removeEventListener('popstate', this.checkUrl, false);
	        } else if (this._useHashChange && !this.iframe) {
	            removeEventListener('hashchange', this.checkUrl, false);
	        }


	        if (this.iframe) {
	            document.body.removeChild(this.iframe);
	            this.iframe = null;
	        }


	        if (this._checkUrlInterval) clearInterval(this._checkUrlInterval);
	        History.started = false;
	    },


	    route: function (route, callback) {
	        this.handlers.unshift({route: route, callback: callback});
	    },

	    checkUrl: function (e) {
	        var current = this.getFragment();


	        if (current === this.fragment && this.iframe) {
	            current = this.getHash(this.iframe.contentWindow);
	        }

	        if (current === this.fragment) return false;
	        if (this.iframe) this.navigate(current);
	        this.loadUrl();
	    },


	    loadUrl: function (fragment) {

	        if (!this.matchRoot()) return false;
	        fragment = this.fragment = this.getFragment(fragment);
	        return _.any(this.handlers, function (handler) {
	            if (handler.route.test(fragment)) {
	                handler.callback(fragment);
	                return true;
	            }
	        });
	    },


	    navigate: function (fragment, options) {
	        if (!History.started) return false;
	        if (!options || options === true) options = {trigger: !!options};

	        fragment = this.getFragment(fragment || '');


	        var root = this.root;
	        if (fragment === '' || fragment.charAt(0) === '?') {
	            root = root.slice(0, -1) || '/';
	        }
	        var url = root + fragment;

	        fragment = this.decodeFragment(fragment.replace(pathStripper, ''));

	        if (this.fragment === fragment) return;
	        this.fragment = fragment;

	        if (this._usePushState) {
	            this.history[options.replace ? 'replaceState' : 'pushState']({}, document.title, url);


	        } else if (this._wantsHashChange) {
	            this._updateHash(this.location, fragment, options.replace);
	            if (this.iframe && (fragment !== this.getHash(this.iframe.contentWindow))) {
	                var iWindow = this.iframe.contentWindow;


	                if (!options.replace) {
	                    iWindow.document.open();
	                    iWindow.document.close();
	                }

	                this._updateHash(iWindow.location, fragment, options.replace);
	            }


	        } else {
	            return this.location.assign(url);
	        }
	        if (options.trigger) return this.loadUrl(fragment);
	    },


	    _updateHash: function (location, fragment, replace) {
	        if (replace) {
	            var href = location.href.replace(/(javascript:|#).*$/, '');
	            location.replace(href + '#' + fragment);
	        } else {

	            location.hash = '#' + fragment;
	        }
	    }

	});


	Backbone.history = new History;

	// Helpers

	var extend = function (protoProps, staticProps) {
	    var parent = this;
	    var child;


	    if (protoProps && _.has(protoProps, 'constructor')) {
	        child = protoProps.constructor;
	    } else {
	        child = function () {
	            return parent.apply(this, arguments);
	        };
	    }

	    _.extend(child, parent, staticProps);

	    var Surrogate = function () {
	        this.constructor = child;
	    };
	    Surrogate.prototype = parent.prototype;
	    child.prototype = new Surrogate;


	    if (protoProps) _.extend(child.prototype, protoProps);


	    child.__super__ = parent.prototype;

	    return child;
	};

	Router.extend = View.extend = History.extend = extend;

	module.exports = Backbone;



/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (root, factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof exports === 'object') {
	        module.exports = factory();
	    } else {
	        root.store = factory();
	    }
	}(this, function () {
	    "use strict";

	    var _maxExpireDate = new Date('Fri, 31 Dec 9999 23:59:59 UTC'),
	        _serialize = function (item) {
	            return JSON.stringify(item);
	        },
	        _deserialize = function (data) {
	            return data && JSON.parse(data);
	        },
	        _isSupported = function (storage) {
	            var supported = false;
	            if (storage && storage.setItem) {
	                supported = true;
	                var key = '__' + Math.round(Math.random() * 1e7);
	                try {
	                    storage.setItem(key, key);
	                    storage.removeItem(key);
	                } catch (err) {
	                    supported = false;
	                }
	            }
	            return supported;
	        },
	        _getStorage = function (storage) {
	            if (typeof(storage) === 'string') {
	                return window[storage];
	            }
	            return storage;
	        },
	        _isDate = function (date) {
	            return Object.prototype.toString.call(date) === '[object Date]' && !isNaN(date.getTime());
	        },
	        _getExpDate = function (expires, now) {
	            now = now || new Date();
	            if (typeof expires === 'number') {
	                expires = expires === Infinity ?
	                    _maxExpireDate : new Date(now.getTime() + expires * 1000);
	            } else if (typeof expires === 'string') {
	                expires = new Date(expires);
	            }
	            if (expires && !_isDate(expires)) {
	                throw new Error('`expires` parameter cannot be converted to a valid Date instance');
	            }
	            return expires;
	        },
	        _cacheItem = function (value, exp) {
	            exp = exp || _maxExpireDate;
	            return {
	                c: new Date().getTime(),
	                e: _getExpDate(exp).getTime(),
	                v: value
	            }
	        };

	    function Store() {
	        this.storage = _getStorage('localStorage');
	    }

	    //默认不支持localStorage的不报错，包含隐私模式下同样的不报错，让页面正常运行
	    Store.prototype = {
	        constructor: Store,
	        set: function () {
	        },
	        get: function () {
	        },
	        del: function () {
	        },
	        clearExp: function () {
	        },
	        clearAll: function () {
	        },
	        add: function () {
	        },
	        setExp: function () {
	        },
	        getExp: function () {
	        }
	    };

	    if (_isSupported(_getStorage('localStorage'))) {
	        Store.prototype = {
	            constructor: Store,
	            /**
	             * 设置缓存，可以设置过期时间，单位：秒
	             * @param key 缓存名称
	             * @param val 缓存的值，如果未定义或为null，则删除该缓存
	             * @param exp 缓存的过期时间
	             * @returns {*}
	             */
	            set: function (key, val, exp) {
	                if (typeof(key) !== 'string') {
	                    console.warn(key + ' used as a key, but it is not a string.');
	                    key = '' + key;
	                }
	                if (val === undefined || val === null) {
	                    return this.del(key);
	                }
	                try {
	                    this.storage.setItem(key, _serialize(_cacheItem(_serialize(val), exp)));
	                } catch (e) {
	                    console.error(e);
	                }
	                return val;
	            },

	            /**
	             * 获取缓存，如果已经过期，会主动删除缓存，并返回null
	             * @param key 缓存名称
	             * @returns {*} 缓存的值，默认已经做好序列化
	             */
	            get: function (key) {
	                var item = _deserialize(this.storage.getItem(key));
	                if (item !== null && item !== undefined) {
	                    var timeNow = new Date().getTime();
	                    if (timeNow < item.e) {
	                        return _deserialize(item.v);
	                    } else {
	                        this.del(key);
	                    }
	                }
	                return null;
	            },

	            /**
	             *  删除指定的缓存
	             * @param key 要删除缓存的主键
	             * @returns {*}
	             */
	            del: function (key) {
	                this.storage.removeItem(key);
	                return key;
	            },

	            /**
	             *  删除所有过期的缓存
	             * @returns {Array}
	             */
	            clearExp: function () {
	                var length = this.storage.length,
	                    caches = [],
	                    _this = this;
	                for (var i = 0; i < length; i++) {
	                    var key = this.storage.key(i),
	                        item = _deserialize(this.get(key));

	                    if (item && !item.e) {
	                        if (new Date().getTime() >= item.e) {
	                            caches.push(key);
	                        }
	                    }
	                }
	                caches.forEach(function (key) {
	                    _this.del(key);
	                });
	                return caches;
	            },
	            /**
	             *  清空缓存
	             */
	            clearAll: function () {
	                this.storage.clear();
	            },
	            /**
	             * 添加一条缓存，如果已经存在同样名称的缓存，则不做任何处理
	             * @param key 缓存的名称
	             * @param value 缓存的值
	             * @param exp 过期时间 单位：秒
	             */
	            add: function (key, value, exp) {
	                if (this.get(key) === null || this.get(key) === undefined) {
	                    this.set(key, value, exp);
	                }
	            },
	            /**
	             * 设置修改缓存的过期时间
	             * @param key 缓存的名称
	             * @param exp 新的过期时间 单位：秒
	             */
	            setExp: function (key, exp) {
	                var item = this.get(key);
	                if (item !== null && item !== undefined) {
	                    item.e = _getExpDate(exp, item.c);
	                    this.set(key, _serialize(item), exp);
	                }
	            },
	            /**
	             * 获取缓存的过期时间
	             * @param key 缓存的名称
	             * @returns {*} 单位：秒
	             */
	            getExp: function (key) {
	                var item = this.get(key);
	                return item && item.e;
	            }
	        }
	    }
	    return new Store();
	}));

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	$.extend({
	    checkNetwork: function () {
	//        if (navigator.onLine) {
	//            return true;
	//        } else {
	//            $.toast('您的网络不太给力哦~', 500);
	//            return false;
	//        }
	        return true;
	    },
	    serverError: function () {
	        $.toast('服务器忙，请稍候再试~', 500);
	    },
	    isRetina: function () {
	        return window.devicePixelRatio && window.devicePixelRatio >= 1.5;
	    },
	    uniqID: function (string) {
	        string = string || '';
	        return string + Math.floor(Math.random() * 10000000) + new Date().getTime().toString().substring(10, 13);
	    },
	    scrollTo: function (obj) {
	        if (typeof obj === "number") {
	            $(window).scrollTop(obj);
	        }
	        else {
	            var offset = $(obj).offset();
	            $(window).scrollTop(offset.top);
	        }
	    },
	    isWeixin: function () {
	        return /MicroMessenger/i.test(navigator.userAgent);
	    },
	    isIOS: function () {
	        return /ipad|iphone|iPod|Macintosh|mac os/i.test(navigator.userAgent);
	    },
	    isAndroid: function () {
	        return /Android/i.test(navigator.userAgent);
	    },
	    charLen: function (string) {
	        if (!string) return 0;
	        return string.replace(/[^\x00-\xff]/g, '00').length;
	    },
	    isMobileNum:function(num){
	        return !isNaN(num) && /^1[3|5|7|8]\d{9}$/.test(num);
	    },
	    setCache:function(key,value,exp,type){
	        //过期时间默认1天
	        exp=exp||86400;
	        type=type||0;
	        !type && (key+='_'+ curUserID);
	        fresh.cache[key] = value;
	        store.set(key, value, exp);
	    },
	    getCache:function(key,type){
	        type=type||0;
	        !type && (key+='_'+ curUserID);
	        return (fresh.cache[key] || store.get(key));
	    },
	    setWeixinTitle:function(title){
	        document.title=title;
	        // hack在微信IOS webview中无法修改document.title的情况
	        if($.isWeixin() && $.isIOS()) {
	            var $iframe = $('<iframe src="/st/images/icon144.png"></iframe>');
	            $iframe.on('load', function () {
	                setTimeout(function () {
	                    $iframe.off('load').remove();
	                }, 0);
	            }).appendTo('body');
	        }
	    },
	    getLimitString: function (str, limit) {
	        var pos = 0;
	        if (!limit || $.charLen(str) <= limit) return str;
	        for (var i = 0; i < str.length; i++) {
	            pos += str.charCodeAt(i) > 255 ? 2 : 1;
	            if (limit <= pos) {
	                return str.substr(0, i + 1);
	                break;
	            }
	        }
	    },
	    toast:__webpack_require__(6) ,
	    parseURL:__webpack_require__(11),
	    dateFormat: __webpack_require__(12),
	    popWindow:__webpack_require__(13),
	    sync:__webpack_require__(17),
	    login:function(){
	        jsb.login()
	        // if($.getParam('isApp')){
	        //     window.location='/weizhan/member/login';
	        // }else{
	        //     localStorage.setItem('yw_user_after_login_link',location.href);
	        //     window.location='/weizhan/#login';
	        // }
	    },
	    getParam: function(str,key){
	        if(arguments.length==1){
	            key=str;
	            str=location.href;
	        }

	        var reg = new RegExp(key +'=([^#&]*)','i');
	        var r = str.match(reg);
	        if (r!=null) return decodeURIComponent(r[1]); return null;
	    },
	    inviteUser:function() {
	        jsb.share();
	    },
	    changePage: function (hash_path,replace) {
	        fresh.router.navigate(hash_path, {trigger:true,replace:replace});
	    },
	    // showRule:function(day){
	    //     $.popWindow({
	    //         title:'活动规则',
	    //         content:_.template(require('../source/rule/rule.html'))({day:day}),
	    //         yes:'确认',
	    //         type:2,
	    //         // closeBtn:true,
	    //         tapMask:true,
	    //         callback:function(){
	    //
	    //         }
	    //     });
	    //     $('.pop_window2 .pop_content').css('height',$(window).height()*0.8-100);
	    // },
	    // showRule2:function(){
	    //     $.popWindow({
	    //         title:'累计年化投资金额',
	    //         content:require('../source/rule/rule2.html'),
	    //         yes:'确认',
	    //         type:2,
	    //         tapMask:true,
	    //         callback:function(){
	    //
	    //         }
	    //     });
	    // },
	    getToken:function () {
	        return localStorage.getItem('yw_user_loginToken')||'';
	        //return localStorage.getItem('yw_user_loginToken')==null?'':localStorage.getItem('yw_user_loginToken');
	    },
	    batSync:function(opt){
	        var data={
	            url:fresh.batchRoot+'batch/batchRequest.html?timer='+new Date().getTime(),
	            type:'post',
	            data:{
	                data:JSON.stringify(opt.data)
	            },
	            dataType:'json',
	            timeout:20000,
	            headers:{
	                logintoken:$.getToken()
	            },
	            success:function(d){
	                if (opt.loading) $(opt.loading).hide();
	                if (d.status == 0) {
	                    var callbackData=[];
	                    if(opt.data.length>1){
	                        $.each(d.data,function(i,n){
	                            if (n.status == 0) {
	                                callbackData.push(n.data);
	                            }else{
	                                callbackData.push(null)
	                                // $.toast(n.msg)
	                                console.log(opt.data[i].url+' ::: '+n.msg);
	                            }
	                        });
	                    }else{
	                        callbackData=d.data;
	                    }

	                    opt.success && opt.success(callbackData);

	                } else if (opt.error && $.type(opt.error) === 'function') {
	                    opt.error(d);
	                } else {
	                    $.toast(d.message, 500);
	                }
	            },
	            error:function(d){
	                if (opt.loading) $(opt.loading).hide();
	                if (opt.error && $.type(opt.error) === 'function') {
	                    opt.error(d);
	                }else {
	                    $.serverError();
	                }
	            }
	        }

	        if (opt.loading) $(opt.loading).show();
	        $.ajax(data);
	    },
	    checkUser:function(bl,callback){
	        if(typeof(bl)=='function'){
	            callback=bl;
	            bl=false;
	        }
	        var isLogin=localStorage.getItem('yw_user_loginToken');
	        if(!isLogin || isLogin=='null'){
	            if(!bl){
	                jsb.login();
	            }else{
	                callback(false);
	            }
	        }else{
	            callback(true);
	        }




	        // if(typeof(bl)=='function'){
	        //     callback=bl;
	        //     bl=false;
	        // }
	        // if(isLogin){
	        //     callback && callback(true);
	        // }else{
	        //     $.sync({
	        //         url:fresh.apiRoot+'verifCode/verifLogin',
	        //         type:'post',
	        //         success:function () {
	        //             callback && callback(true);
	        //             $.setLogin(true);
	        //         },
	        //         error:function(){
	        //             if(!bl){
	        //                 $.login()
	        //             }else{
	        //                 callback &&callback(false);
	        //             }
	        //         }
	        //     });
	        // }
	    },
	    productList:function(){
	        jsb.toList();
	        // if($.getParam('isapp')){
	        //     location.href='/weizhan/product/productClassifyList'
	        // }else{
	        //     location.href='/weizhan/#product'
	        // }
	    },
	    amountFormat:function(v) {
	        if(!v) return '0.00'
	        v = parseFloat(v).toFixed(2);
	        v = v.toString().split('.');
	        return (+v[0]).toLocaleString() + '.' + (v[1] >= 01 ? v[1] : '00');
	    },
	    getStaticOrgin:function(){
	        var url=location.href;
	        var staticurl='';
	        if(url.indexOf('dev.91yaowang.com')>-1){
	            staticurl='http://staticdev.91yaowang.com';
	        }else if(url.indexOf('app.91yaowang.com')>-1){
	            staticurl='https://statictest.91yaowang.com';
	        }else if(url.indexOf('wz.91yaowang.com')>-1){
	            staticurl='https://static.91yaowang.com';
	        }else{
	            staticurl='https://statictest.91yaowang.com';
	        }
	        return staticurl;
	    },
	    shareDefault:function(){
	        jsb.setShareInfo({
	            title : '万元恋爱基金大作战',
	            desc : '现在来摇旺晒幸福，赢取万元恋爱基金',
	            link : location.origin+'/events/valentinesDay/index.html',
	            icon : 'https://wz.91yaowang.com/weizhan/res/images/headImg.jpg'
	        });
	    }
	});

	$.extend($.fn,{
	    upload:__webpack_require__(18),
	    translate3d: function (x, y, z) {
	        x = x || 0, y = y || 0, z = z || 0;
	        $(this).css({
	            "-webkit-transform": "translate3d(" + x + "px," + y + "px," + z + "px)",
	            "-moz-transform": "translate3d(" + x + "px," + y + "px," + z + "px)",
	            transform: "translate3d(" + x + "px," + y + "px," + z + "px)"
	        })
	    },
	    setTransitionTime: function (num) {
	        $(this).css({
	            "-webkit-transition": +num + "s",
	            "-moz-transition": +num + "s",
	            transition: +num + "s"
	        })
	    },
	    overSlides: function (callback) {
	        $(this).each(function () {
	            $(this).overSlide(callback);
	        })
	    },
	    //整体滚动
	    overSlide: __webpack_require__(19),
	    //单个滚动
	    bannerSlider:__webpack_require__(20),
	})

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(7);
	module.exports = function (msg, interval, site) {
	    /* site位置如下：默认为5
	     *  1,2,3
	     *  4,5,6
	     *  7,8,9
	     * */
	    msg || (msg = '');
	    site = site || 5;
	    var id = $.uniqID(),
	        msg = $('<div class="toast_info_box hide toast_info_box_site' + site + '" id="' + id + '"><span class="error_msg">' + msg + '</span></div>');
	    $('body').append(msg);
	    $('#' + id).fadeIn();
	    var close = function () {
	        $('#' + id).fadeOut();
	        setTimeout(function () {
	            $('#' + id).remove();
	        }, 200);
	    }

	    if (interval !== false)
	        setTimeout(function () {
	            close();
	        }, interval || 3000);

	    return {
	        close: function () {
	            close();
	        }
	    };
	}

/***/ },
/* 7 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */
/***/ function(module, exports) {

	module.exports = function (url) {
	    var a = document.createElement('a');
	    a.href = url;
	    return {
	        source: url,
	        protocol: a.protocol.replace(':', ''),
	        host: a.hostname,
	        port: a.port,
	        query: a.search,
	        params: (function () {
	            var ret = {},
	                seg = a.search.replace(/^\?/, '').split('&'),
	                len = seg.length, i = 0, s;
	            for (; i < len; i++) {
	                if (!seg[i]) {
	                    continue;
	                }
	                s = seg[i].split('=');
	                ret[s[0]] = s[1];
	            }
	            return ret;
	        })(),
	        file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
	        hash: a.hash.replace('#', ''),
	        path: a.pathname.replace(/^([^\/])/, '/$1'),
	        relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
	        segments: a.pathname.replace(/^\//, '').split('/')
	    };
	}

/***/ },
/* 12 */
/***/ function(module, exports) {

	module.exports=function (date, fmt) {
	    //指定fmt 格式，按照fmt格式输出
	    //未指定fmt 按照语义化输出。
	    if (!date) return '';
	    function getDateStr(d) {
	        if (!d) return '';
	        return d.toString().replace('T', ' ').replace(/-/g, '/').split('+')[0].split('.')[0];
	    }

	    function _isDate(date) {
	        return Object.prototype.toString.call(date) === '[object Date]' && !isNaN(date.getTime());
	    }

	    if (!_isDate(date))
	        date = new Date(date);
	    var now = new Date(),
	        o = {
	            "M+": date.getMonth() + 1,
	            "d+": date.getDate(),
	            "h+": date.getHours(),
	            "m+": date.getMinutes(),
	            "s+": date.getSeconds(),
	            "q+": Math.floor((date.getMonth() + 3) / 3),
	            "S": date.getMilliseconds()
	        },
	        format = function (fmt) {
	            if (/(y+)/.test(fmt))
	                fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
	            for (var k in o)
	                if (new RegExp("(" + k + ")").test(fmt))
	                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	            return fmt;
	        };
	    if (fmt) {
	        return format(fmt);
	    } else {
	        var ts = new Date().getTime() - date.getTime();
	        if (!date || ts <= 3000) return '刚刚';
	        if (Math.floor(ts / 1000) < 60) return Math.floor(ts / 1000) + '秒钟前';
	        if (Math.floor(ts / 60000) < 60) return Math.floor(ts / 60000) + '分钟前';
	        if (Math.floor(ts / 3600000) < 24) return Math.floor(ts / 3600000) + '小时前';
	        if (Math.floor(ts / 86400000) <= 10) return Math.floor(ts / 86400000) + '天前';
	        if (now.getFullYear() == date.getFullYear()) {
	            return format('MM-dd hh:mm');
	        } else {
	            return format('yyyy-MM-dd hh:mm');
	        }
	    }
	}


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var template= _.template(__webpack_require__(14));
	__webpack_require__(15);
	module.exports=function (options) {
	    var defaultOptions = {
	            title: '',
	            content: '',
	            yes: '确认',
	            no: '',
	            uniqID: $.uniqID(),
	            type: 1,
	            closeBtn: false,
	            tapMask: false,
	            callback: $.noop()
	        },

	        opt = {},
	        win;
	    opt = $.extend(defaultOptions, options);
	    if (opt.type == 1) opt.no = opt.no || '取消';
	    win = $(template(opt));
	    $('body').append(win).on('touchend.popWindow' + opt.uniqID, '.yes_btn,.no_btn,.pop_window_wrap', function (e) {
	        var pos = false,
	            obj = $(e.target),
	            obj2 = $(e.currentTarget);

	        if (obj.hasClass('pop_window_wrap') && opt.tapMask) {
	            win.remove();
	            $('body').off('touchend.popWindow' + opt.uniqID);
	            return false;
	        }
	        if (obj2.hasClass('yes_btn') || obj2.hasClass('no_btn')) {
	            if (obj2.hasClass('yes_btn')) {
	                pos = true
	            }
	            if ($.type(opt.callback) == 'function') {
	                var temp = (function(pos, event){
	                    event.preventDefault();
	                    opt.callback(pos,event);
	                })(pos, event);
	                if (temp !== false) {
	                    win.remove();
	                    $('body').off('touchend.popWindow' + opt.uniqID);
	                }
	            } else {
	                win.remove();
	                $('body').off('touchend.popWindow' + opt.uniqID);
	            }
	        }
	    })
	    // window.onpopstate = function() {
	    //     win.remove();
	    //     $('body').off('tap.popWindow' + opt.uniqID);
	    //     window.onpopstate=null;
	    // };
	    var obj=win.find('.pop_window');
	    obj.css('margin-top',-obj.height()/2);
	    $(window).on('popstate.popWindow'+ opt.uniqID,function(){
	        win.remove();
	        $('body').off('tap.popWindow' + opt.uniqID);
	        $(window).off('popstate.popWindow'+ opt.uniqID);
	    })
	};

/***/ },
/* 14 */
/***/ function(module, exports) {

	module.exports = "<div class=\"pop_window_wrap\">\r\n <% if(type==1){%>\r\n<div class=\"pop_window\" id=\"<%=uniqID%>\">\r\n<div class=\"pop_header\">\r\n <span class=\"no_btn\"><%=no%></span>\r\n <span class=\"yes_btn\"><%=yes%></span>\r\n <span class=\"pop_title\"><%=title%></span>\r\n</div>\r\n<div class=\"pop_content\"><%=content%></div>\r\n</div>\r\n <% }else if(type==2){ %>\r\n<div class=\"pop_window pop_window2\" id=\"<%=uniqID%>\">\r\n <% if(closeBtn){ %>\r\n<div class=\"no_btn close_btn\">Ｘ</div>\r\n <% } %>\r\n <% if(title){ %>\r\n<div class=\"pop_title\"><%=title%></div>\r\n <% } %>\r\n<div class=\"pop_content\"><%=content%></div>\r\n<div class=\"pop_btns\">\r\n <% if(no){ %>\r\n <span class=\"yes_btn\"><%=yes%></span>\r\n <span class=\"no_btn\"><%=no%></span>\r\n <% }else{ %>\r\n <span class=\"yes_btn yes_btn_all\"><%=yes%></span>\r\n <% } %>\r\n</div>\r\n</div>\r\n <% } %>\r\n</div>\r\n";

/***/ },
/* 15 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 16 */,
/* 17 */
/***/ function(module, exports) {

	module.exports = function (options) {
	    var defaultSetting = {
	            checkNetwork: true,
	            timeout: 20000
	        },
	        opt = $.extend(true, defaultSetting, options),
	        type = (opt.type || 'get').toLowerCase();
	    if (type == 'get') {
	        if (opt.data) {
	            opt.data.uniq = $.uniqID();
	        }else {
	            opt.data = {
	                uniq: $.uniqID()
	            };
	        }
	    }
	    if (!opt.checkNetwork || (opt.checkNetwork && $.checkNetwork())) {
	        var data = {
	            url: opt.url,
	            type: type,
	            data: opt.data,
	            dataType:'json',
	            timeout:opt.timeout,
	            headers:{
	                logintoken:$.getToken()
	            },
	            success:function(d){
	                $('.loading-refresh').hide();
	                if(d.status==-1){
	                    localStorage.clear();
	                    $.popWindow({
	                        content:'账号在异地登录，若非本人操作请修改密码！',
	                        type:'2',
	                        yes:'确定',
	                        no:'取消',
	                        callback:function(bl){
	                            if(bl){
	                                jsb.login()
	                            }else{
	                                history.go(-1);
	                            }
	                        }
	                    });
	                    return true;
	                }else if(d.status==-2){
	                    $.popWindow({
	                        content:'您的请求无效！',
	                        type:'2',
	                        yes:'确定',
	                        callback:function(bl){
	                            if(bl){
	                                history.go(-1);
	                            }
	                        }
	                    });
	                    return true;
	                }else if(d.status==-3){
	                    $.popWindow({
	                        content:'维护时间段，某些操作无法进行！',
	                        type:'2',
	                        yes:'确定',
	                        callback:function(bl){
	                            if(bl){
	                                history.go(-1);
	                            }
	                        }
	                    });
	                    return true;
	                }
	                if (d.status == 0) {
	                    opt.success && opt.success(d.data);
	                } else if (opt.error && $.type(opt.error) === 'function') {
	                    opt.error(d);
	                } else {
	                    $.toast(d.msg, 1000);
	                }
	            },
	            error:function(d){
	                $('.loading-refresh').hide();
	                if (opt.error && $.type(opt.error) === 'function') {
	                    opt.error(d);
	                }else {
	                    $.serverError();
	                }
	            }
	        };
	        $('.loading-refresh').show();
	        $.ajax(data);
	    }
	};

/***/ },
/* 18 */
/***/ function(module, exports) {

	module.exports = function (options) {
	    var _defaultSetting = {
	            loading: '.loading',
	            // url: 'http://192.168.62.244:8080/app/webservice/v2/loveractivity/upload', //接收数据的api接口地址
	            url: '/app/webservice/v2/loveractivity/upload', //接收数据的api接口地址
	            // url: '', //接收数据的api接口地址
	            maxFileSize: 10 * 1024 * 1024,
	            format: 'image',
	            isCompress: true,
	            bindUser:false, //上传图片绑定用户
	            clipSquare:false, //压缩上传前把图片截取成正方形，
	            compressNum: 0.6, // 0~1 设置为1可能最终结果比未压缩还大，请慎用1.
	            beforeUpload: function () {
	            },
	            uploadStart: function () {
	            },
	            afterUpload: function () {
	            },
	            uploadProgress: function (v) {
	            },
	            uploadError: function () {
	            },
	            showThumbnail: function () {
	            }
	        },
	        opt = {};

	    function startUpload(el) {
	        var files = el.files,
	            len = files.length;
	        for (var i = len - 1; i >= 0; i--) {
	            (function (file) {
	                if (file.size > opt.maxFileSize) {
	                    console.log('您上传的' + file.name + ',图片尺寸过大，最大限制为10M');
	                    return false;
	                }
	                //有些安卓手机无法获取文件类型
	                if (new RegExp(opt.format, 'i').test(file.type) || !file.type) {
	                    if (opt.beforeUpload() === false) {
	                        return false;
	                    }
	                    readFile(file);
	                } else {
	                    console.log("您上传的文件不符合上传的要求");
	                }
	            }(files[i]));
	        }
	    }

	    function readFile(file) {
	        var reader = new FileReader();
	        reader.onload = function () {
	            file = this.result;
	            opt.uploadStart && opt.uploadStart(file);
	            upLoadFile(file);
	            this.result = null;
	            reader.onload = null;
	            reader = null;
	        };
	        reader.onprogress = function (e) {
	            if (e.lengthComputable) {
	                var percentLoaded = Math.round((e.loaded / e.total) * 100);
	                opt.uploadProgress && opt.uploadProgress(percentLoaded);
	            }
	        };
	        reader.onabort = function () {
	            opt.uploadError && opt.uploadError();
	        }
	        if (opt.format = 'image') {
	            reader.readAsDataURL(file);
	        } else {
	            reader.readAsBinaryString(file);
	            opt.isCompress = false;
	        }
	    }

	    function upLoadFile(file) {
	        if (opt.format != 'image') {
	            ajaxUploadFile(file);
	        } else {
	            var _canvas = $('<canvas style="display: none"></canvas>')[0];
	            var img = new Image();
	            img.onload = function () {
	                if (opt.isCompress) {
	                    if(opt.clipSquare){
	                        var min=Math.min(img.naturalWidth,img.naturalHeight);
	                        _canvas.width = min;
	                        _canvas.height = min;
	                    }else{
	                        _canvas.width = img.naturalWidth;
	                        _canvas.height = img.naturalHeight;
	                    }

	                    var context = _canvas.getContext('2d');
	                    context.drawImage(img, 0, 0);
	                    ajaxUploadFile(_canvas.toDataURL('image/jpeg', opt.compressNum));
	                } else {
	                    ajaxUploadFile(file);
	                }
	            };
	            img.src = file;
	        }
	    }

	    function ajaxUploadFile(file) {
	        $(opt.loading).show();
	        opt.showThumbnail && opt.showThumbnail(file);
	        $.sync({
	            url: opt.url,
	            type:'post',
	            data: {
	                file: file,
	                uploadFlag:opt.bindUser
	            },
	            success: function (d) {
	                $(opt.loading).hide();
	                opt.afterUpload && opt.afterUpload(file, d);
	            },
	            error: function (d) {
	                $(opt.loading).hide();
	                opt.uploadError && opt.uploadError(d);
	            }
	        });
	    }

	    opt = $.extend(true, _defaultSetting, options);
	    $(this).on('change', function () {
	        startUpload(this);
	    });
	}

/***/ },
/* 19 */
/***/ function(module, exports) {

	module.exports = function (options, callback) {
	    var $this = $(this),
	        $parent = $this.parent(),
	        $child = $this.children(),
	        wrapWidth = $parent.outerWidth(true),
	        wrapPadding = parseInt($this.css('padding-left')) + parseInt($this.css('padding-right')),
	        childsWidth = 0,
	        minMove = 1,
	        defaultOptions = {
	            move: true,
	            padding: 20
	        };

	    if ($.type(options) == 'function') {
	        callback = options;
	        options = {};
	    } else {
	        options = $.extend(true, defaultOptions, options);
	    }
	    childsWidth += options.padding;
	    $child.each(function () {
	        var width=$(this).outerWidth(true)
	        childsWidth += width;
	        $(this).css('width',width);
	    });

	    childsWidth += wrapPadding;

	    var _bindEvent = function () {
	        var starty = startX = dx = dy = endTy = endTx = 0,
	            oldDate;
	        $this.addClass('bindedEvent').css('width', childsWidth);
	        $parent.on('touchstart', function (e) {
	            oldDate = new Date();
	            starty = e.originalEvent.touches[0].clientY;
	            if (!options.move) {
	                startX = e.originalEvent.touches[0].clientX;
	            } else {
	                startX = e.originalEvent.touches[0].clientX - $this.offset().left;
	            }
	        });
	        $parent.on('touchmove', function (e) {
	            endTy = e.originalEvent.touches[0].clientY || e.originalEvent.changedTouches[0].clientY;
	            endX = e.originalEvent.touches[0].clientX || e.originalEvent.changedTouches[0].clientX;

	            dx = Math.abs(endX - startX);
	            dy = Math.abs(endTy - starty);
	            //竖向拖动不阻止默认事件
	            if ((dy > dx || dy > 10 ) || dx < minMove) {
	                return;
	            }
	            event.preventDefault();
	            dx = endX - startX;
	            dy = endTy - starty;
	            if (options.move !== false) {
	                $this.setTransitionTime(0);
	                $this.translate3d(dx);
	            }
	        });

	        $parent.on('touchend', function (e) {
	            var newDate = new Date();
	            if ((dx < 12 || dx > -12) && (dy > -12 || dy < 12) && newDate - oldDate < 200 && options.tap) {
	                oldDate = newDate;
	                $parent.trigger('tap');
	            }
	            var offleft = $this.offset().left;
	            $this.setTransitionTime(0.3);
	            if (offleft > 0) {
	                $this.translate3d(0);
	            }
	            if (offleft < -(childsWidth - wrapWidth)) {
	                $this.translate3d(-(childsWidth - wrapWidth));
	            }
	            callback && callback(dx, dy);
	            dx = 0;
	            dy = 0;
	        });
	    }
	    if ($this.hasClass('bindedEvent')) {
	        return;
	    }

	    if (childsWidth > wrapWidth) {
	        _bindEvent();
	    }
	    return {
	        destory: function () {
	            $this.removeClass('bindedEvent');
	            $parent.off();
	        },
	        reset: function () {
	            childsWidth = 0;
	            wrapWidth = $this.parent().outerWidth(true);
	//                if(wrapWidth>screen.availWidth)
	//                    wrapWidth=screen.availWidth;
	            $this.children().each(function () {
	                childsWidth += $(this).outerWidth(true);
	            });
	            childsWidth += wrapPadding + options.padding;
	            $this.css('width', childsWidth);
	        },
	        moveTo: function (num) {
	            var moveX = 0;
	            $this.children().each(function (i) {
	                if (num - i > 0) {
	                    moveX += $(this).outerWidth(true);
	                }
	            });
	            if (-moveX < -(childsWidth - wrapWidth)) {
	                moveX = childsWidth - wrapWidth;
	            }
	            if(moveX<wrapWidth){
	                moveX=0;
	            }
	            $this.setTransitionTime(0);
	            $this.translate3d(-moveX);
	            oldX = -moveX;
	        }
	    }
	}

/***/ },
/* 20 */
/***/ function(module, exports) {

	module.exports = function (pageObj, autoscroll) {
	    var slideObj = $(this),
	        $child = $(this).children(),
	        slideWidth = $child.outerWidth(true),
	        countPage = $child.length,
	        slideCurPage = 1,
	        returnObj,
	        timeout;
	    $child.css('width', $child.outerWidth(true));
	    pageObj.eq(0).addClass('active').siblings().removeClass('active');

	    function autoScrollBanner() {
	        if (autoscroll !== 0) {
	            clearInterval(timeout);
	            timeout = setInterval(function () {
	                turnPage(-21);
	            }, autoscroll);
	        }
	    }

	    var turnPage = function (dx) {

	        if (dx > 20) {
	            slideCurPage -= 1;
	            slideCurPage = slideCurPage == 0 ? countPage : slideCurPage;
	        } else if (dx < -20) {
	            slideCurPage += 1;
	            slideCurPage = slideCurPage > countPage ? 1 : slideCurPage;
	        }

	        slideObj.translate3d(-(slideCurPage - 1) * slideWidth);
	        pageObj.eq(slideCurPage - 1).addClass('active').siblings().removeClass('active');
	        //console.log(slideCurPage, countPage, dx);
	        autoScrollBanner();
	    };

	    returnObj = slideObj.overSlide({move: false, tap: true}, function (dx) {
	        turnPage(dx);
	    });

	    autoScrollBanner();


	    return {
	        next: function () {
	            turnPage(-21);
	        },
	        prev: function () {
	            turnPage(21);
	        }
	    };
	}

/***/ },
/* 21 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 22 */,
/* 23 */,
/* 24 */,
/* 25 */,
/* 26 */
/***/ function(module, exports) {

	(function () {
	    var coord = {},
	        start = {},
	        el;

	    document.addEventListener('touchstart', touchStart);
	    document.addEventListener('touchmove', touchMove);
	    document.addEventListener('touchend', touchEnd);
	    document.addEventListener('touchcanel', touchCancel);

	    function newEvent(type) {
	        return new Event(type, {bubbles: true, cancelable: true});
	    }

	    function touchCancel() {
	        coord = {}

	    }

	    function touchStart(e) {
	        var c = e.touches[0];
	        start = {
	            x: c.clientX,
	            y: c.clientY,
	            time: Date.now()
	        };
	        el = e.target;
	        el = 'tagName' in el ? el : el.parentNode;
	    }

	    function touchMove(e) {
	        var t = e.touches[0];
	        coord = {
	            x: t.clientX - start.x,
	            y: t.clientY - start.y
	        }
	    }

	    function touchEnd() {
	        var touchTimes = Date.now() - start.time,
	            ty = Math.abs(coord.y),
	            tx = Math.abs(coord.x),
	            c = ((250 > touchTimes && tx > 20) || tx > 80) && (ty < 30 || tx > ty * 1.5),
	            s = ((250 > touchTimes && ty > 20) || ty > 80) && (tx < 30 || ty > tx * 1.5),
	            left = coord.x < 0,
	            top = coord.y < 0;
	        if (250 > touchTimes && (isNaN(coord.y) || ty) < 12 && (isNaN(coord.x) || tx < 12)) {
	            el.dispatchEvent(newEvent('tap'));
	        } else if (750 < touchTimes && (isNaN(coord.y) || ty) < 12 && (isNaN(coord.x) || tx < 12)) {
	            el.dispatchEvent(newEvent('longTap'));
	        }
	        c ? el.dispatchEvent(left ? newEvent('swipeLeft') : newEvent('swipeRight')) : s && el.dispatchEvent(top ? newEvent('swipeUp') : newEvent('swipeDown'));

	        coord = {};
	    }
	}());

/***/ },
/* 27 */
/***/ function(module, exports) {

	(function () {
	    var weChatCfg;

	    function getParam(str,key){
	        if(arguments.length==1){
	            key=str;
	            str=location.href;
	        }
	        var reg = new RegExp('(\\w*'+key+')'+'=([^#&]*)','i');
	        var r = str.match(reg);
	        if (r!=null && r[1]==key)
	            return decodeURIComponent(r[2])
	        return null;
	    }

	    function getParams(str) {
	        var ret = {},
	            str2=str.split('?'),
	            seg = str2[1] && str2[1].split('&'),
	            len = seg && seg.length, i = 0, s;
	        for (; i < len; i++) {
	            if (!seg[i]) {
	                continue;
	            }
	            s = seg[i].split('=');
	            ret[s[0]] = s[1];
	        }
	        return ret;
	    }

	    function delParam(str,key){
	        if(arguments.length==1){
	            key=str;
	            str=location.href;
	        }
	        var uo=getParams(str);
	        $.each(uo,function(k,v){
	            if(k==key){
	                delete uo[k]
	            }
	        });
	        return $.param(uo);
	    }

	    function uniqID(string) {
	        string = string || '';
	        return string + Math.floor(Math.random() * 10000000) + new Date().getTime().toString().substring(10, 13);
	    }

	    function getUniqFn(fn) {
	        var uniq = uniqID('callback_');
	        window[uniq] = function (d) {
	            if (d.status == 0) {
	                fn(d.data);
	            } else {
	                console.log(d.msg);
	            }
	        };
	        return uniq;
	    }

	    var JSBridge = function () {
	        var isBridge = window.JF,
	            isApp = getParam('isapp'),
	            shareInfo={};
	        this.share = function () {
	            // if (isBridge) {
	            //     JF.navigator_setShareInfo(JSON.stringify({
	            //         title: shareInfo.title,
	            //         desc: shareInfo.desc,
	            //         icon: shareInfo.icon,
	            //         link: shareInfo.link
	            //     }), getUniqFn(function (d) {
	            //         callback(d);
	            //         shareMask.hide().off('tap.share_mask');
	            //     }));
	            // } else
	            if (isApp) {
	                window.location = '/invitefriends/toapp?jsonstr=' +encodeURIComponent( JSON.stringify({
	                    title: shareInfo.title,
	                    desc: shareInfo.desc,
	                    icon: shareInfo.icon,
	                    link: shareInfo.link
	                }));
	            } else {
	                var shareMask = $('.share_mask');
	                if (shareMask.length) {
	                    shareMask.show().on('tap.share_mask', function () {
	                        shareMask.hide().off('tap.share_mask');
	                    });
	                } else {
	                    shareMask = $('<div class="share_mask"></div>');
	                    $('body').append(shareMask);
	                    shareMask.show().on('tap.share_mask', function () {
	                        shareMask.hide().off('tap.share_mask');
	                    });
	                }
	            }
	        };
	        this.setShareInfo=function(options){
	            var title = options.title || '跟我来摇旺赚钱吧，100元返现券、14%新手专享产品和万元体验金等你来拿~',
	                desc = options.desc || '不会理财的人不漂亮！',
	                link = options.link || location.href,
	                icon = options.icon || 'https://wz.91yaowang.com/weizhan/res/images/headImg.jpg',
	                callback = options.callback || function () {};
	            link=link.split('?')[0]+'?'+delParam(link,'isapp');
	            link=link.split('?')[0]+'?'+delParam(link,'loginToken');
	            shareInfo={
	                title:title,
	                desc:desc,
	                link:link,
	                icon:icon
	            };
	            if(weChatCfg){
	                _resetShareInfo();
	            }else{
	                $.sync({
	                    method: 'get',
	                    url: location.origin + '/weizhan/oauth/config',
	                    data: {url: location.href.split('#')[0]},
	                    dataType: 'json',
	                    success: function (d) {
	                        weChatCfg=d;
	                        _initWeChat();
	                    }
	                });
	            }

	            function _resetShareInfo(){
	                var cfg = {
	                    title: title,
	                    desc: desc,
	                    link: link,
	                    imgUrl: icon,
	                    success: function () {
	                        callback();
	                        shareMask.hide().off('tap.share_mask');
	                    },
	                    cancel: function () {
	                        shareMask.hide().off('tap.share_mask');
	                    }
	                };
	                wx.showOptionMenu();
	                wx.ready(function () {
	                    wx.onMenuShareAppMessage(cfg);
	                    wx.onMenuShareTimeline(cfg);
	                    wx.onMenuShareQQ(cfg);
	                    wx.onMenuShareWeibo(cfg);
	                });
	            }


	            function _initWeChat() {
	                wx.config({
	                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
	                    appId: weChatCfg.appid, // 必填，公众号的唯一标识
	                    timestamp: weChatCfg.timestamp, // 必填，生成签名的时间戳
	                    nonceStr: weChatCfg.nonceStr, // 必填，生成签名的随机串
	                    signature: weChatCfg.signature,// 必填，签名，见附录1
	                    jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone', 'openLocation', 'getLocation', 'scanQRCode'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2 onMenuShareAppMessage showOptionMenu
	                });
	                _resetShareInfo();
	            }
	        };
	        this.toList = function () {
	            // if (isBridge) {
	            //     JF.passport_productList();
	            // } else
	            if (isApp) {
	                // window.location='/weizhan/product/productClassifyList';
	                window.location = '/product/list';
	            } else {
	                window.location = '/weizhan/#product';
	            }
	        };
	        this.toDetail = function (pid) {
	            if (isBridge) {
	                JF.passport_productDetail(JSON.stringify({productNo: pid}));
	            } else if (isApp) {
	                window.location = '/productDetail?pid=' + pid;
	            } else {
	                window.location = '/weizhan/#product';
	            }
	        }
	        this.login = function (id, callback) {
	            if (typeof(id == 'function')) {
	                callback = id;
	                id = '';
	            }
	            // if (isBridge) {
	            //     JF.passport_login(JSON.stringify({phoneNum: id}), getUniqFn(function (d) {
	            //         localStorage.setItem('yw_user_loginToken', d);
	            //         if (callback) {
	            //             callback();
	            //         } else {
	            //             location.reload();
	            //         }
	            //     }));
	            // } else
	            if (isApp) {
	                window.location = '/member/login?phoneNum=' + id;
	            } else {
	                localStorage.setItem('yw_user_after_login_link', location.href);
	                window.location = '/weizhan/#login';
	            }
	        }
	        this.register = function (id, callback) {
	            if (typeof(id == 'function')) {
	                callback = id;
	                id = '';
	            }
	            if (isBridge) {
	                JF.passport_register(JSON.stringify({phoneNum: id}), getUniqFn(function (d) {
	                    localStorage.setItem('yw_user_loginToken', d);
	                    if (callback) {
	                        callback();
	                    } else {
	                        location.reload();
	                    }
	                }));
	            } else if (isApp) {
	                window.location = '/register?phoneNum=' + id;
	            } else {
	                window.location = '/weizhan/#register';
	            }
	        }
	        this.setTitle = function (title) {
	            if (isBridge) {
	                JF.navigator_setTitle(JSON.stringify({title: title}));
	            } else {
	                document.title = title;
	                // $.setAppTitle(title);
	                // hack在微信IOS webview中无法修改document.title的情况
	                if ($.isWeixin() && $.isIOS()) {
	                    var $iframe = $('<iframe src="https://static.91yaowang.com/yaowang/dist/source/mall/images/9e3e8cf0.png" style="border: 0;outline: 0"></iframe>');
	                    $iframe.on('load', function () {
	                        setTimeout(function () {
	                            $iframe.off('load').remove();
	                        }, 0);
	                    }).appendTo('body');
	                }
	            }
	        }
	        this.invite = function (code) {
	            // if (isBridge) {
	            //     JF.passport_invite(JSON.stringify({code: code}));
	            // } else
	            if (isApp) {
	                window.location = '/invite?code=' + code;
	            } else {
	                window.location = '/weizhan/#uc/invite';
	            }
	        }

	        function yaobao(id) {
	            if (isBridge) {
	                JF.passport_shakeTreasure(JSON.stringify({code: id}));
	            } else if (isApp) {
	                window.location = '/yaobao?pid=' + id;
	            } else {
	                window.location = '/weizhan/#yaobao';
	            }
	        }

	        this.yaobao = function (id) {
	            if (id > 0) {
	                yaobao(id)
	            } else {
	                $.sync({
	                    // url: 'https://app.91yaowang.com/app/webservice/v2/newProductList',
	                    url: location.origin + '/app/webservice/v2/newProductList',
	                    type: 'post',
	                    data: {
	                        currentPage: 0,
	                        pageCount: 15,
	                        productType: 4,
	                        channelCode: ''
	                    },
	                    success: function (d) {
	                        yaobao(d.currentProduct.productNo);
	                    }
	                });
	            }
	        }
	        this.mall = function () {
	            if (isBridge) {
	                JF.passport_ScoreMarket();
	            } else if (isApp) {
	                window.location = '/mall?code=' + code;
	            } else {
	                window.location = '/weizhan/#mall';
	            }
	        }
	    }
	    window.jsb = new JSBridge();
	}());

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	var oldRouter,
	ref='';

	function clearPageData(){
	    fresh.$content.off().html('<div class="loading"></div><div class="grey center">加载中...</div>');
	}

	module.exports=Backbone.Router.extend({
	    initialize:function(){
	        var that = this;
	        this.bind('route',function(curRouter){
	            //after Route
	            ref=location.href;
	            setTimeout(function(){
	                $('#changePageAnimate').fadeOut();
	            },400);
	        });
	    },
	    //before route
	    _beforeRoute:function(curRouter){
	        //if(st.loadDate) st.loadDate.destory();
	        clearPageData();
	        oldRouter=curRouter;
	        if(!ref){
	            fresh.$body.append('<div class="change_page_loading" id="changePageAnimate"><div class="page_loading"></div></div>');
	        }else{
	            $('#changePageAnimate').show();
	        }

	    },

	    routes:{
	        '':                             'home',
	        'home/*':                       'home',
	        'home/:id/*':                   'home',
	        'landPage/:id/*':               'landPage',
	        'coupleCard/:id/*':             'coupleCard',
	        'rule/*':                       'rule',
	        'rd':                           'home',
	        ':id/*':                        'home'
	    },
	    home:function(id){
	        var home=__webpack_require__(29);
	        new home({el:fresh.$content,uid:id});
	    },
	    rule:function(){
	        var rule=__webpack_require__(71);
	        new rule({el:fresh.$content});
	    },
	    landPage:function(id){
	        var landPage=__webpack_require__(75);
	        new landPage({el:fresh.$content,lid:id});
	    },
	    coupleCard:function(id){
	      var coupleCard=__webpack_require__(87);
	      new coupleCard({el:fresh.$content,cid:id});
	  }
	});

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	var template = _.template(__webpack_require__(30));
	__webpack_require__(31);


	module.exports = Backbone.View.extend({
	    initialize: function (options) {
	        this.uid = options.uid || '';
	        this.getData();
	    },
	    getData:function(){
	        var self=this;
	        $.sync({
	            type:'post',
	            url:fresh.apiRoot+'loveractivity/homePage',
	            data:{
	                loverUserId:this.uid
	            },
	            success:function(d){
	                self.cache=d;
	                // self.cache={};
	                self.render();
	            }
	        });
	    },
	    render: function () {
	        this.$el.html(template());
	        $.setWeixinTitle('万元恋爱基金大作战');
	        this._initEvent();
	        return this;
	    },
	    _initEvent:function(){
	        var TopInfo=__webpack_require__(34);
	        new TopInfo({el:this.$el.find('.top-info'),
	            cache:this.cache,
	            uid:this.uid
	        });

	        var GiftList=__webpack_require__(60);
	        new GiftList({el:this.$el.find('.gift-box'),
	            uid:this.uid
	        });
	        $.shareDefault();
	    },
	    events: {
	        'tap .rule-btn': 'showRule',
	    },
	    showRule:function(){
	        $.changePage('rule')
	    }
	});

/***/ },
/* 30 */
/***/ function(module, exports) {

	module.exports = "<div class=\"home\">\r\n<div class=\"top-info\"></div>\r\n<div class=\"gift-box\"></div>\r\n<div class=\"rule-btn\"></div>\r\n</div>";

/***/ },
/* 31 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 32 */,
/* 33 */,
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	var template = _.template(__webpack_require__(35));
	__webpack_require__(36);

	module.exports = Backbone.View.extend({
	    initialize: function (options) {
	        this.uid=options.uid;
	        this.cache=options.cache;
	        this.render();
	    },
	    render: function () {
	        var self=this;
	        this.partner={};
	        if(this.cache && this.cache.relationList && this.cache.relationList.length && this.cache.relationList[0].isBind==1){
	            this.partner=this.cache.relationList[0];
	        }
	        this.$el.html(template({info:this.cache,partner:this.partner}));
	        this.$el.find('.upload-img').upload({
	            clipSquare:true,
	            bindUser:1,
	            loading:self.$el.find('.loading-box'),
	            showThumbnail:function(img){
	                self.$el.find('.user-icon-1').attr('src',img);
	            },
	            afterUpload:function(file,d){

	            },
	            uploadError:function(){
	                self.$el.find('.user-icon-1').attr('src',$.getStaticOrgin()+'/events/valentinesDay/dist/i1.png');
	            }
	        });
	        this.$el.find('.animate').overSlide();
	        return this;
	    },
	    _checkUid:function(callback){
	        if(this.uid>0){
	            if(this.cache.isLogin){
	                callback();
	            }else{
	                jsb.login();
	            }
	        }else {
	            $.checkUser(function () {
	                callback();
	            });
	        }
	    },
	    events:{
	        'tap .edit-name-btn':'editName',
	        'tap .user-one':'changePartner',
	        'tap .invite-btn,.icon-2':'invitePartner',
	        'tap .share-btn':'sharePage',
	        'tap .history-btn':'createHistory',
	        'tap .invest-btn': 'confirmInvest'
	    },
	    _editName:function(){
	        var self=this;
	        $.popWindow({
	            title:'编辑姓名',
	            content:'<input type="text" class="input-text edit-name-input" placeholder="输入姓名">',
	            type:2,
	            yes:'取消',
	            no:'保存',
	            callback:function(bl){
	                if(!bl){
	                    var v=$('.edit-name-input').val();
	                    if($.charLen(v)>=8){
	                        $.toast('姓名最长4个中文字');
	                    }else{
	                        $.sync({
	                            url:fresh.apiRoot+'loveractivity/loverActivityNickNameUpdate',
	                            type:'post',
	                            data:{
	                                niceName:v
	                            },
	                            success:function(){
	                                self.$el.find('.edit-name-btn').html(v);
	                            }
	                        })
	                    }
	                }
	            }
	        })
	    },


	    
	    editName:function(){
	        var self=this;
	        this._checkUid(function(){
	            self._editName(obj,name,id);
	        });
	    },
	    _changePartner:function(obj,name,id){
	        if(obj.hasClass('love')) return;
	        $.popWindow({
	            title:'确定选择 '+name+' 为情人吗?',
	            content:'如更换情人组队投资年化值会重新记录投资所得恋爱基金与Ta分享',
	            type:2,
	            yes:'确认',
	            no:'取消',
	            callback:function(bl){
	                if(bl){
	                    $.sync({
	                        url:fresh.apiRoot+'loveractivity/confirmRelation',
	                        data:{
	                            slaveUserId:id
	                        },
	                        type:'post',
	                        success:function(){
	                            location.reload();
	                        }
	                    })
	                }
	            }
	        })
	    },
	    changePartner:function(e){
	        var self=this,
	            obj=$(e.currentTarget),
	            name=obj.attr('data-name'),
	            id=obj.attr('data-id');

	        this._checkUid(function(){
	            self._changePartner(obj,name,id);
	        });
	    },
	    _invitePartner:function(){
	        if(this.partner.isBind && $(e.currentTarget).hasClass('love')){
	            return false;
	        }
	        jsb.setShareInfo({
	            title : '额。。有句话想对你说！',
	            desc : '表白贴',
	            link : location.origin+'/events/valentinesDay/index.html#landPage/'+this.cache.masterUserId,
	            icon : 'https://wz.91yaowang.com/weizhan/res/images/headImg.jpg'
	        });
	        this.$el.find('.share_mask').addClass('share_mask2');
	        jsb.share();
	    },
	    invitePartner:function(){
	        var self=this;
	        this._checkUid(function(){
	            self._invitePartner();
	        });
	    },
	    sharePage:function(){
	        $.shareDefault();
	        this.$el.find('.share_mask').removeClass('share_mask2');
	        jsb.share();
	    },
	    _createHistory:function(){
	        var self=this;
	        if (self.partner.isBind) {
	            $.sync({
	                url: fresh.apiRoot + 'loveractivity/createLoverCard',
	                data: {
	                    teamId: self.partner.teamId
	                },
	                type: 'post',
	                success: function (d) {
	                    $.changePage('coupleCard/' + d.cardId);
	                }
	            });
	        } else {
	            $.toast('先邀请选择一个情人才能生成情侣证哦！');
	        }
	    },
	    createHistory:function(){
	        var self=this;
	        this._checkUid(function(){
	            self._createHistory();
	        })
	    },
	    _confirmInvest:function(){
	        var self=this;
	        if(!self.partner.isBind){
	            $.popWindow({
	                type:2,
	                title:'万元恋爱基金大作战',
	                content:'您还没有选择情人，只有邀请成功并选择为情人才能得到恋爱基金奖励。',
	                yes:'继续去投资',
	                no:'去邀请情人',
	                callback:function(bl){
	                    if(bl){
	                        jsb.toList();
	                    }else{
	                        self.invitePartner();
	                    }
	                }
	            })
	        }else{
	            $.popWindow({
	                type:2,
	                title:'万元恋爱基金大作战',
	                content:'<div class="user-icons"><img class="u-i-1" src="'+self.cache.masterHeadImg+'">'
	                +'<img class="u-i-2" src="'+self.partner.headImg+'"></div>'
	                +'您和<span class="color">'+self.partner.niceName+'</span>将会得到恋爱基金现金奖励',
	                yes:'换一个情人',
	                no:'确认去投资',
	                callback:function(bl){
	                    if(!bl){
	                        jsb.toList();
	                    }
	                }
	            })
	        }
	    },
	    confirmInvest:function(){
	        var self=this;
	        this._checkUid(function(){
	            self._confirmInvest();
	        })
	    }
	});

/***/ },
/* 35 */
/***/ function(module, exports) {

	module.exports = "<div class=\"logo\"></div>\r\n<div class=\"share-btn\"></div>\r\n<div class=\"l1\"></div>\r\n<div class=\"l2\"></div>\r\n<div class=\"r1\"></div>\r\n<div class=\"r2\"></div>\r\n<div class=\"h1\"></div>\r\n<div class=\"h2\"></div>\r\n<div class=\"h3\"></div>\r\n<div class=\"h4\"></div>\r\n\r\n<div class=\"u-b\">\r\n <% if(info && info.relationList && info.relationList.length>0){ %>\r\n<p class=\"tip1\">主人，有<%=info.relationList.length%>个想跟你结婚的人已排好队</p>\r\n<div class=\"user-list clearfix\">\r\n<div class=\"overSilder\">\r\n<ul class=\"animate\">\r\n <% _.each(info.relationList,function(n){ %>\r\n<li class=\"user-one <%=n.isBind==1?'love':''%>\" data-id=\"<%=n.slaveUserId%>\" data-teamId=\"<%=n.teamId%>\" data-name=\"<%=n.niceName%>\">\r\n <img class=\"user-img\" src=\"<%=n.headImg%>\">\r\n<p class=\"name\"><%=n.niceName%></p>\r\n</li>\r\n <% }) %>\r\n</ul>\r\n</div>\r\n<div class=\"invite-btn\">\r\n<div class=\"invite-btn-img\"></div>\r\n<div class=\"txt\">继续邀请</div>\r\n</div>\r\n</div>\r\n<p class=\"tip2\">选择为情人会获得恋爱基金现金奖励</p>\r\n <% } %>\r\n</div>\r\n\r\n<div class=\"icon-1\" style=\"height:<%=$('.content').width()*0.31%>px\">\r\n <img src=\"<%=info.masterHeadImg?info.masterHeadImg:(location.origin+'/events/valentinesDay/dist/i1.png')%>\" class=\"user-icon-1\">\r\n <% if(info.masterUserId>0){ %>\r\n<div class=\"upload-img-mask\"></div>\r\n <input type=\"file\" class=\"upload-img\">\r\n <%} %>\r\n<div class=\"edit-name-btn\"><%=info.masterNickname?info.masterNickname:'编辑姓名'%></div>\r\n</div>\r\n<div class=\"icon-2 <%=partner.isBind==1?'love':''%>\" style=\"height:<%=$('.content').width()*0.31%>px\">\r\n <img src=\"<%=partner.headImg?partner.headImg:(location.origin+'/events/valentinesDay/dist/i2.png')%>\" class=\"user-icon-2\">\r\n<div class=\"invite-desc\"><%=partner.niceName?partner.niceName:'邀请我的情人'%></div>\r\n</div>\r\n\r\n<div class=\"history-desc\">\r\n<div class=\"history-btn\"></div>\r\n 生成情侣证，分享到朋友圈，得到6个亲朋好友的<br>祝福即可获得300元返现券\r\n</div>\r\n<div class=\"loading-box\">\r\n<div class=\"bounceball\"></div>\r\n</div>\r\n<div class=\"invest-box\">\r\n<p class=\"invest-tip\">投资赢万元恋爱基金</p>\r\n<div class=\"invest-btn\"></div>\r\n <% _.each(info.loverAmountList,function(n){\r\n        if(n.slaveName){ %>\r\n<p class=\"product-orders-p\">您和<span class=\"color2\"><%=n.slaveName%></span>已投资<span class=\"color2\"><%=n.totalInvestAmount%></span>元，年化已达到<span class=\"color2\"><%=n.totalInvestAmountYear%></span></p>\r\n <% }else{ %>\r\n<p class=\"product-orders-p\">您已投资<span class=\"color2\"><%=n.totalInvestAmount%></span>元，年化已达到<span class=\"color2\"><%=n.totalInvestAmountYear%></span></p>\r\n <% }\r\n    }) %>\r\n</div>\r\n<div class=\"share_mask\"></div>";

/***/ },
/* 36 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 37 */,
/* 38 */,
/* 39 */,
/* 40 */,
/* 41 */,
/* 42 */,
/* 43 */,
/* 44 */,
/* 45 */,
/* 46 */,
/* 47 */,
/* 48 */,
/* 49 */,
/* 50 */,
/* 51 */,
/* 52 */,
/* 53 */,
/* 54 */,
/* 55 */,
/* 56 */,
/* 57 */,
/* 58 */,
/* 59 */,
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	var template = _.template(__webpack_require__(61));
	__webpack_require__(62);

	module.exports = Backbone.View.extend({
	    initialize: function (options) {
	        this.uid=options.uid;
	        this.cache= options.cache && options.cache.loverAmountList || {}
	        this.getData();
	    },
	    getData:function(){
	        var self=this;
	        $.sync({
	            type:'post',
	            url:fresh.apiRoot+'loveractivity/rewardList',
	            data:{
	                loverUserId:this.uid
	            },
	            success:function(d){
	                var list={lv1:[],lv2:[],lv3:[],lv4:[]};
	                if(d && d.hdLoverUserRewardList) {
	                    $.each(d.hdLoverUserRewardList, function (i, n) {
	                        list['lv' + n.rewardLevel].push(n);
	                    });
	                }
	                self.cache=list;
	                self.render();
	            }
	        });
	    },
	    render: function () {
	        var self=this;
	        this.$el.html(template(this.cache));
	        this.$el.find('.upload-img').upload({
	            clipSquare:true,
	            loading:self.$el.find('.loading-box'),
	            showThumbnail:function(img){
	                self.$el.find('.user-icon-1').attr('src',img);
	            },
	            afterUpload:function(file,d){

	            }
	        });
	        this.$el.find('.animate').overSlide();
	        return this;
	    },
	    events:{
	        'tap .receive-btn':'receiveCoupon'
	    },
	    _changeBtn:function (obj,id) {
	        this.cache['lv'+id].shift();
	        if(!this.cache['lv'+id].length){
	            obj.addClass('fighting-btn').removeClass('receive-btn');
	        }
	    },
	    receiveCoupon:function(e){
	        var self=this,
	            obj=$(e.currentTarget),
	            id=obj.attr('data-id');
	        var coupon=this.cache['lv'+id][0];
	        $.popWindow({
	            title:'领取奖励',
	            type:2,
	            content:'<div class="user-icons"><img class="u-i-1" src="'+coupon.masterHeadImg+'">'
	            +'<img class="u-i-2" src="'+coupon.slaveHeadImg+'"></div>'
	            +'恭喜，'+coupon.masterName+'和'+coupon.slaveUserName+'，投资年化达到'+coupon.amountYear+'元，'
	            +'平分'+(coupon.amount*2)+'元奖励，你得到'+coupon.amount+'元现金红包。',
	            yes:'立刻领取',
	            tapMask:true,
	            callback:function(bl){
	                if(bl){
	                    $.sync({
	                        type:'post',
	                        url:fresh.apiRoot+'member/receiveCoupon',
	                        data:{
	                            sendRewardId:coupon.rewardId
	                        },
	                        success:function(d){
	                            $.toast('已领取'+coupon.amount+'元现金红包，请到我的礼券或余额中查看');
	                            self._changeBtn(obj,id);
	                        }
	                    });
	                }
	            }
	        })
	    }
	});

/***/ },
/* 61 */
/***/ function(module, exports) {

	module.exports = "<div class=\"gift-banner\"></div>\r\n<p class=\"gift-tip\">达到LV4获总共10000元现金</p>\r\n<div class=\"gift-b gift-1\">\r\n <b>开个标间也可以</b>\r\n<p>投资年化达到10000 平分200元现金</p>\r\n<div class=\"<%=lv1.length>0?'receive-btn':'fighting-btn'%>\" data-id=\"1\"></div>\r\n</div>\r\n<div class=\"gift-b gift-2\">\r\n <b>哎呦，大床房，不错哦</b>\r\n<p>投资年化达到50000 平分1500元现金</p>\r\n<div class=\"<%=lv2.length>0?'receive-btn':'fighting-btn'%>\" data-id=\"2\"></div>\r\n</div>\r\n<div class=\"gift-b gift-3\">\r\n <b>商务套房，逼格更上一层楼</b>\r\n<p>投资年化达到100000 平分4000元现金</p>\r\n<div class=\"<%=lv3.length>0?'receive-btn':'fighting-btn'%>\" data-id=\"3\"></div>\r\n</div>\r\n<div class=\"gift-b gift-4\">\r\n <b>总统套房…这是要上天</b>\r\n<p>投资年化达到20000 平分10000元现金</p>\r\n<div class=\"<%=lv4.length>0?'receive-btn':'fighting-btn'%>\" data-id=\"4\"></div>\r\n</div>\r\n<p class=\"gift-tip2\">投资年化达到20000 平分10000元现金</p>";

/***/ },
/* 62 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 63 */,
/* 64 */,
/* 65 */,
/* 66 */,
/* 67 */,
/* 68 */,
/* 69 */,
/* 70 */,
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	var template = _.template(__webpack_require__(72));
	__webpack_require__(73);

	module.exports = Backbone.View.extend({
	    initialize: function () {
	        $('body')[0].scrollTop=0;
	        this.render();
	    },
	    render: function () {
	        this.$el.html(template());
	        $.setWeixinTitle('活动细则');
	        $.shareDefault();
	    }
	});

/***/ },
/* 72 */
/***/ function(module, exports) {

	module.exports = "<div class=\"rule-box\">\r\n<h3 class=\"rule-title\">活动细则</h3>\r\n<ol class=\"rule-txt\">\r\n<li>活动时间为2017年2月10日—2017年2月19日；</li>\r\n<li>活动期间，邀请到好友并投资满额的用户可根据等级获取恋爱基金；\r\n<table class=\"table\">\r\n<tr>\r\n<th>情侣等级</th>\r\n<th>累计投资年化</th>\r\n<th>恋爱基金/现金奖励 (二人平分）</th>\r\n</tr>\r\n<tr>\r\n<td>LV1</td>\r\n<td>≥10000元</td>\r\n<td class=\"color1\">200元</td>\r\n</tr>\r\n<tr>\r\n<td>LV2</td>\r\n<td>≥50000元</td>\r\n<td class=\"color1\">1500元</td>\r\n</tr>\r\n<tr>\r\n<td>LV3</td>\r\n<td>≥100000元</td>\r\n<td class=\"color1\">4000元</td>\r\n</tr>\r\n<tr>\r\n<td>LV4</td>\r\n<td>≥200000元</td>\r\n<td class=\"color1\">10000元</td>\r\n</tr>\r\n</table>\r\n</li>\r\n<li>用户获取恋爱基金（现金奖励）条件；\r\n<p><b class=\"color2\">第一步：</b>活动期间，通过活动页面邀请到好友（好友不限是否注册摇旺，一旦组成不可解除）</p>\r\n<p><b class=\"color2\">第一步：</b>选中一个好友组成“情侣”</p>\r\n<p><b class=\"color2\">第一步：</b>用户累计投资年化金额满足指定金额即可获得相应的恋爱基金（现金奖励）<br>\r\n (若自己和好友互相选择对方为“情侣”则二人投资年化金额之和满足即可）</p>\r\n</li>\r\n<li>恋爱基金（现金奖励）不可叠加获取；\r\n<p class=\"color2\">当用户累计投资年化金额≥10000元时，该用户与自己选中的“情侣”平分200元<br>\r\n 若该用户新增年化投资金额40000元，累计年化金额≥50000元时，该用户与自己选中的“情侣”再平分1300元，两人共合计平分1500元，以此类推</p>\r\n</li>\r\n<li>用户在活动开始后到选中第一个情侣期间投资金额产生的恋爱基金(现金奖励)，将与第一个情侣平分（必须选中），中途变更情侣后，后期投资产生的恋爱基金（现金奖励）将与新情侣平分；</li>\r\n<li>用户与某位情侣可获取恋爱基金（现金奖励）最高额度为投资平分10000元（年化投资金额≥200000元），达到最高奖励级别后，如继续选择该情侣并投资，不再产生恋爱基金（现金奖励）</li>\r\n<li>获得恋爱基金（现金奖励）的用户必须注册并完成绑卡才能取出，如在活动结束后30日内（2017年3月21日前）不完成注册，所获恋爱基金（现金奖励）取消；</li>\r\n<li>获得恋爱基金（现金奖励）的未注册用户注册使用的手机号码必须与组情侣时留下的手机号码一致，否则无法收到恋爱基金（现金奖励）；</li>\r\n<li>累计年化投资金额(元)=活动期间用户新增非变现定期投资金额(元)×产品期限(天)/360(天)(若有多笔投资，累计年化投资金额为各笔年化投资金额之和）；</li>\r\n<li>用户分享”情人证”到微信，集齐6个“祝福”即可获取300元返现券大礼包一份，每人限得一份；\r\n<table class=\"table\">\r\n<tr>\r\n<th>返现券金额</th>\r\n<th>激活门槛</th>\r\n<th>适用产品</th>\r\n</tr>\r\n<tr>\r\n<td>200元</td>\r\n<td>20000元</td>\r\n<td>360天及以上产品</td>\r\n</tr>\r\n<tr>\r\n<td>100元</td>\r\n<td>20000元</td>\r\n<td>180天及以上产品</td>\r\n</tr>\r\n</table>\r\n</li>\r\n <% if($.isIOS()){ %>\r\n<li>本活动与苹果公司无关；</li>\r\n <% } %>\r\n<li>活动最终解释权归摇旺理财所有。</li>\r\n</ol>\r\n</div>\r\n";

/***/ },
/* 73 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 74 */,
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	var template = _.template(__webpack_require__(76));
	__webpack_require__(77);


	module.exports = Backbone.View.extend({
	    initialize: function (options) {
	        this.type=options.type;
	        this.lid=options.lid;
	        this.getData(options.lid);
	        this.currimgurl=null;
	    },
	    getData:function(id){
	        var self=this;
	        $.sync({
	            url:fresh.apiRoot + 'loveractivity/initInviterInfo',
	            type:'post',
	            data:{masterUserId:id},
	            success:function(d){
	                self.initInviterInfo=d;
	                self.render();
	            }
	      });
	    },
	    render: function () {
	        var self=this;
	        this.$el.html(template(this.initInviterInfo));
	        $.setWeixinTitle('邀请好友');
	        this.$el.find('.upload-img').upload({
	            clipSquare:true,
	            loading:self.$el.find('.loading-box'),
	            showThumbnail:function(img){
	                self.$el.find('.slaveHeadImg').attr('src',img).show();
	                $('.subname').text('更换美照');
	            },
	            afterUpload:function(file,d){
	                 self.currimgurl=d.url;
	            },
	            uploadError:function(){
	                self.$el.find('.slaveHeadImg').attr('src','').hide();
	            }
	        });
	        $.shareDefault();
	        return this;
	    },
	    events:{
	        'tap .bottombtn':'acceptResult'
	    },
	    acceptResult:function(e){
	        var self=this,
	            name=this.$el.find('.inviteename').val().trim(),
	            mobile=this.$el.find('.inviteemobile').val();
	        if($(e.currentTarget).hasClass('yesbtn')){
	            if(name.length<2 || !$.isMobileNum(mobile) || !self.currimgurl){
	                $.toast('请完整填写姓名手机号、上传头像后接受邀请。');
	                return;
	            }
	            $.sync({
	                url:fresh.apiRoot + 'loveractivity/acceptInvite',
	                type:'post',
	                data:{
	                    masterUserId:self.lid,
	                    headImg:self.currimgurl,
	                    niceName:name,
	                    mobile:mobile
	                },
	                success:function(d){
	                    $.changePage('home/'+d.slaveUserId);
	                },error:function(d){
	                    $.toast(d.msg);
	                }
	            });
	        }else{
	           $.changePage('home');
	        }
	    }
	});

/***/ },
/* 76 */
/***/ function(module, exports) {

	module.exports = "<div class=\"acty214-landPage\">\r\n\t<div class=\"acty214-wrap\">\r\n\t\t<div class=\"logo\"></div>\r\n\t\t<div class=\"headimg\" style=\"height:<%= $(window).width()*0.33 %>px\"></div>\r\n\t\t<div class=\"innerwarp\" style=\"height:<%= $(window).width()*1.2 %>px\">\r\n\t\t\t<div class=\"content\">\r\n\t\t\t\t<div class=\"facebox clearfix\">\r\n\t\t\t\t\t<div class=\"mainface\">\r\n\t\t\t\t\t\t<div class=\"face\">\r\n\t\t\t\t\t\t\t<img src=\"<%=headImg%>\"/>\r\n\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t<p class=\"name\"><%=niceName%></p>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t\t<div class=\"subface\">\r\n\t\t\t\t\t\t<div class=\"face\">\r\n\t\t\t\t\t\t\t<img src=\"xxxHTMLLINKxxx0.83854539389722050.7878388038370758xxx\" class=\"slaveHeadImg\"/>\r\n\t\t\t\t\t\t\t<input type=\"file\" class=\"upload-img\"/>\r\n\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t<p class=\"name subname\">上传你的美照吧</p>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t\t\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t\t<div class=\"dottedline\"></div>\r\n\t\t\t<div class=\"content\">\r\n\t\t\t\t<div class=\"inputbox\"><input class=\"input inviteename\" placeholder=\"请输入姓名\" maxlength=\"8\"/></div>\r\n\t\t\t\t<div class=\"inputbox\"><input class=\"input inviteemobile\" placeholder=\"请输入摇旺注册手机号\" maxlength=\"11\"/></div>\r\n\t\t\t\t<p class=\"tips\">如尚未注册，注册时请使用本次输入手机号<br/>如果填写有误或者填写了无法注册的手机号后期得不到现金奖励与摇旺无关</p>\r\n\t\t\t</div>\r\n\t\t\t<div class=\"btnbox\">\r\n\t\t\t\t<div class=\"content\">\r\n\t\t\t\t\t<div class=\"bottombtn nobtn\"></div>\r\n\t\t\t\t\t<div class=\"bottombtn yesbtn\"></div>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t</div>\r\n\t<div class=\"loading-box\">\r\n\t\t<div class=\"bounceball\"></div>\r\n\t</div>\r\n</div>";

/***/ },
/* 77 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 78 */,
/* 79 */,
/* 80 */,
/* 81 */,
/* 82 */,
/* 83 */,
/* 84 */,
/* 85 */,
/* 86 */,
/* 87 */
/***/ function(module, exports, __webpack_require__) {

	var template = _.template(__webpack_require__(88));
	__webpack_require__(89);
	module.exports = Backbone.View.extend({
	    initialize: function (options) {
	        this.type=options.type;
	        this.cid=options.cid;
	        this.getData(options.cid);
	        this.list=[];
	    },
	    getData:function(id){
	        var isShare=$.getParam('isShare')?true:false;
	        var self=this;
	        $.batSync({
	            data:[
	                {url:fresh.apiRoot + 'loveractivity/selectLoverCardInfo',data:{cardId:id}},
	                {url:fresh.apiRoot + 'loveractivity/wishList',data:{cardId:id}}       
	            ],
	            success:function(d){
	                self.cache={
	                    cardinfo : d[0],
	                    list : d[1],
	                    isFromShare:isShare
	                }
	                self.render();
	            },error:function(d){
	                $.toast(d.msg);
	                self.render();
	            }
	        });
	    },
	    render: function () {
	        this.$el.html(template(this.cache));
	        $.setWeixinTitle('情侣证');
	        jsb.setShareInfo({
	            title : '我们在一起了，祝福我们吧！',
	            desc : '我们的幸福需要你的祝福',
	            link : location.origin+'/events/valentinesDay/index.html?isShare=true',
	            icon : 'https://wz.91yaowang.com/weizhan/res/images/headImg.jpg'
	        });
	        return this;
	    },
	    events:{
	        'tap .blessbtn':'bless',
	        'tap .sharebtn':'share',
	        'tap .joinbtn' :'tohome'
	    },
	    bless:function(){
	        var self=this;
	        $.sync({
	            url: fresh.apiRoot + 'loveractivity/sendWish',
	            data: {cardId:self.cid},
	            type: 'post',
	            success: function(d){
	                var textDom=self.$el.find('#blesscount');
	                textDom.text(parseInt(textDom.text())+1);
	                self.$el.find('.blesslist').prepend('<p class="blessinfo">'+d.wishContent+'</p>')
	            }
	        });
	    },
	    share:function(){
	        jsb.share();
	    },
	    tohome:function(){
	        $.changePage('home');
	    }

	});

/***/ },
/* 88 */
/***/ function(module, exports) {

	module.exports = "<div class=\"acty214-couplecard\">\r\n\t<div class=\"rightlead <%= isFromShare?'joinbtn':'sharebtn' %>\"></div>\r\n\t<div class=\"acty214-wrap\">\r\n\t\t<div class=\"headimg\" style=\"height:<%= $(window).width()*0.25 %>px\"></div>\r\n\t\t<div class=\"innerwarp\" style=\"height:<%= $(window).width()*1.35 %>px\">\r\n\t\t\t<div class=\"content\">\r\n\t\t\t\t<p class=\"headtitle\">情侣证</p>\r\n\t\t\t\t<div class=\"facebox clearfix\">\r\n\t\t\t\t<div class=\"lovestamp\"></div>\r\n\t\t\t\t\t<div class=\"mainface\">\r\n\t\t\t\t\t\t<div class=\"face\"><img src=\"<%= cardinfo.masterHeadImg%>\"/></div>\r\n\t\t\t\t\t\t<p class=\"name\"><%= cardinfo.masterNickname%></p>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t\t<div class=\"subface\">\r\n\t\t\t\t\t\t<div class=\"face\"><img src=\"<%= cardinfo.slaveHeadImg%>\"/></div>\r\n\t\t\t\t\t\t<p class=\"name\"><%= cardinfo.slaveNiceName%></p>\r\n\t\t\t\t\t</div>\t\r\n\t\t\t\t</div>\r\n\t\t\t\t<div class=\"carddesc\">经摇旺专业恋爱认证协会审核通过：<br/><span class=\"username\"><%= cardinfo.masterNickname%></span> 和 <span class=\"username\"><%= cardinfo.slaveNiceName%></span> 正式成为情侣<br/>特发此证！</div>\r\n\t\t\t\t<p class=\"source\">摇旺专业恋爱认证协会监制</p>\r\n\t\t\t</div>\r\n\t\t\t<div class=\"doshedline\"></div>\r\n\t\t\t<div class=\"blessbox\">\r\n\t\t\t\t<div class=\"content\">\r\n\t\t\t\t\t<div class=\"blesstitle\">亲友祝福 <%if(isFromShare){%><span id=\"blesscount\"><%=list.count%></span> 条<%}%></div>\r\n\t\t\t\t\t<%if(!isFromShare && cardinfo.masterFxq=='0'){%>\r\n\t\t\t\t\t\t<p class=\"sharetips\">点击右上角“分享”按钮，求祝福可获300元返现券</p>\r\n\t\t\t\t\t<%}else{%>\r\n\t\t\t\t\t\t<div class=\"blesslist\">\r\n\t\t\t\t\t\t\t<% _.each(list.hdLoverWishs,function(item){  %>\r\n\t\t\t\t\t\t\t<p class=\"blessinfo\"><%= item.wishContent%></p>\r\n\t\t\t\t\t\t\t<%})%>\r\n\t\t\t\t\t\t</div>\r\n\t\t\t\t\t<%}%>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t\t<%if(isFromShare){%>\r\n\t\t\t\t<div class=\"blessbtn\"></div>\r\n\t\t\t<%}%>\r\n\t\t</div>\r\n\t</div>\r\n\t<div class=\"share_mask\"></div>\r\n</div>";

/***/ },
/* 89 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }
/******/ ]);