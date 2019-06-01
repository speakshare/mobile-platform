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
	__webpack_require__(28);

	var apiPort=location.origin;
	// var apiPort='https://app.91yaowang.com';
	window.fresh = {
	    cache: {},
	    loadDate: 0,
	    apiRoot:apiPort+'/app/webservice/v2/',
	    batchRoot:apiPort+'/app/',
	    init: function (){
	        this.$body = $('body');
	        this.$main = $('#mainPage');
	        this.$content = $('#content');
	        var Router = __webpack_require__(29);
	        window.fresh.router = new Router;
	        Backbone.history.start({pushState: false});
	    }
	};

	// window.onerror=function(e){
	//     console.log(e)
	//     return true
	// };

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
	            icon : $.getStaticOrgin()+'/yaowang/dist/globalImg/headImg.jpg'
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
	    isApp:function(){
	        return $.getParam('isApp')=='1'?true:false;
	    },
	    getImgStream:function(i){
	     var imgStream=[
	     'data:image/png;base64,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',
	     'data:image/png;base64,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',
	     'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANwAAADcCAMAAAAshD+zAAADAFBMVEX///78/fv9/fD+/vj8/Or6+/b8++T++/78+tb7+dDqVFD9+91ppNlhntb598Hm7LH6+MnqaWHpSkflW1aQxuxwreDfQkH59biBu+hKicbiT0vpPz7m7rxZl9H222xSkc3t8bjuXll4tOTlNTT13Kv25LP38Kp7woiKx4qHwevyvq+AuOHu1qbseGqYzO9xqthgtXvgcGn99/fg6Kf48t6xttVtuoP26J33zMBSqnn002F6sd3kfHbnh4PeKSj14NH0zLU/fr7dZV3VNzfz+O20o8X68OdUs4xFnW9ovI94uXbtsJhssWqq1KCPy5mdzp328cXqmaH02ZLz/fz21MyLv+T47tQbbm7wk4rwj3f517vwiJZ/xJubzov4wbgjfnv1tKYuhYyly2qi0/L67LjxfnewxeI8k5uHxHi01bfV5rWlq8vjzqHmZn7wbWydoMG31Wl0tpn45MP3zKn68vDQ4aNBq4EyoXfxjlXpnMEjknFXqWT0opbflJDvdIfnV23lsq3hhaybv1Hts9M3kWDjqMrzprHvwKGuzljokLaxj7W/3KnT6tzt3LZRm1Mgg2B9b1tOnYz65t3WWFCjwNhoZGG9wN241Jjh6txMoKVppYj24nqMy66f0bjwp8rPR0jswY+Cr4XZeIWZg27U6MiFrcZnq1Ww3PbB473o8Mzpvr5gsZ93dHcVYl3ip4yv1IGTxWTfR10xb7TF4dXaqaSqeaDxoYKXv4FeU0W+0OdRRj9XV1fQYXS/23yPtWbG1MeBj6nDrM92obhwYUxlka2Ut5yqlXvu6OXp9eF7u103j4N0vqxjnnHM5erje5bcjXWNnrXKJyiciq+GsUaWs9PLfXdnnsbyRlDd1tLLmr9WgZhygJtLc3nBUlqIcGvwtG2lwqrxwVfvpksfHh+t1NTGa2Hg8fPLk4cTcVGSvce5sqyuxYWLioToz39AdKPUwpXJnpvP32bQxbePcpW2ODs8OTS+e6C+ronngkHKirAZUqGpmprS44M7hEYNUUGXYFaGhbsWAAB23klEQVR42myWPajTUBTHk9aYJdkSSMAQyaIhkICOd5CCk/gFJWOXFEScOujk1klQnApVnAStOjXUoXRoBFF8Bd9U6eDk1OWB8FZR8Hdu6wfoMcnNS9Lc87v//znRiOM47IQdthmHMJRD5BRFEbmu74ZxLNcjd7P5dOPw8PBBc2+wXA4GVX1vWFXDe3cM81RVLYfD74N6ulwuj4+/f/9+TFzvjh6HTqKyICuzIE09j0OQpWkWBKoIvDTQ97I0UEr5SeL7heMkju+4UZTEbuIHQRrIzo8YE7aELUlVIi/yXSdJGZNE9V9I9L2Uaco8L0vPy5lOZjOiKBQ4YjZjZI9d19GzhFG0easCpnu+2HYNiYtHQ+gGg2m9Hg4GdfXMPDluqmUD6FLiO3RP4Ht1rm1sP4c+mSfkn6nSK9Ms83JVpF5aqDRXCjISZ08In9T9wnVd5vWB2wW3SZpHNKKG5BorlDiOhgx8VYK24+v3d2xeKdzcNkDSUIQAfpt14lCmSJwwVKx0stmMtt1u12qbpm23xkPogGsm0wHa3bIOjprpsm6aAXG8/E48Of7+6kTbNIztu44rwhRFEADmsaOEbEWQ5mVWsrwkj2pJocXzXcKPHMfhCgoD5OVacq8kYZJRmlIFmUq0rCicC9hvwBLxPOjlsdTYC7aPb8CJLX23A5oKAid8vjVblmm1DYn2rerevYqoV9NK4IxXR/V0fHNSDYR5IHTH30+da7cMw+yKdkWhCr9IsqwEkBQ9BMzcjfI8VZLd3nHQ+Y6DY+KIEUSAgUtRTlsaSDkhaULUSwBjcPzAe7E35n4oPZ7b+dkIv31DsB3ZTj7o3LgT+glv2rxddLum2SZMom08QqLhcNisJ9PhsBreb9+a1lVv1VsS2PXe8eD4zqtW27AN6IxF6EYFlkMJX4pGJ4dTC0cyVmSZZgqTAedoKCeiCDhFSK1b6ekoFTKLzkqYtIPFkZm4OcvhgmwXkOZiDo+5MsNHLARj0yfsdJXZTFwP2+iiMHXbbVHNQA/rSCtXN6sa4YC7P61vzqdjJGM7puTOv7Lttq3hbOP5106MyWgXeDNJmTBRhShCxWEu0UAlKiHLXblFWFOLB4XUqNYtl4EK9UiZSwlcBYC/uo2SYmPXZH1QUU8bUxnZDLB9yJlo923ms3DCplWzDdMkV9Rr2eaYmquqabVa11W9vtUCrpnTKHWXHCzvnP5wzrJtU1aD327f8rqvs07kSM/IqD+QdMMsqJpCb0iZ+YBhyjCGLpbFCAKhS3MPyXLoPN1bcvj6mHTfMLCp2EB5/X7GvpeO3aPSsYRRdP6godwOMWRhimRzw2536SJaN9smV9M2XzXYEbpVM61XRxet+0fzy01TTafyHViOT120kXgfiH74fPTpxqd3cewUEn7iOnrZtWz8Kb0Gbngc7BiJJwF1Ch7wRCqtHXR5ycgAmYakgQocrxEd/czB3d6fvgk7q2E4v3TT1Yblge0kSjHvovvooNWGypJECTlvjaEb1tWqqdbrK6Z16+jSzV6vV1V0kyXlZhp/BwUrx8PS5dWuJF24ToyMSol6hdQMR98FST/gU3ywshRZLiFEaEdoSngIhXAZxvPEqNJmeQ9Dke/ZCN2pjARbxq68GHO4haL4eZKJ3ZH55sfH988s5BI44RO/HTT1cL1uVqv1evXItu7Pz/amYxFucHTrJF31LzrbsE3Cblnb0WYWi/E2m0h/RsFMHOU7upe4IhfKgQmnA5qvYMjzPoIhnrD1vb108MjHUndSQd23I4FDuz0bjxGG737l5kb8wnc/2hRsjlwpuq0rH+9efvilRZK7ZmmIiq1bTVXX9eXJanXNtC9eu9Sbz48kxq9Q1v4bbie47O3u9jmdKmKGWNiAEy8KBgsJru6VvnIiVHBE2QAOsOTYR7b9yDHAkjQLKcoST+ovOYHVqeN8zwYd5Wr4qKwU68iCPR8tDg8XnzYxqxsv7BO9M3fvXr40f9WyLIt2ogW0rBO35k1d35xM5ge29ezplTf35+PxrWcXW23zXzgd0paM7tsOrTPC+HgQsATBtGaYJPKhRrkojgWSy9ItIZIoBbEsvVL/zVVwKD0QVcZBaycLEhRKlX001oug4Qrtfe5uPh1SITB0D5+H+Gd7rnX20s2Hl2/evHTlQK5LOxFnnrMOepO6N5k8s8+1vly9aFsHF+UbT/uH4X/Br7R4i3dfO0AASMDFIXbdjaPLLO7IV24Hx6dApfBApuUrCcm6D6FEKv/kfz1AMupaKgJMnqGZdiV0ZWY4qhwtXtx4/nYkjVG6/jmjO3r77oZ17uLZy8Slm5PLT18etKg9nSZhHtxvmodnuuesZ9dek3hXrpkW7m21LcxLmJzyOKLpdnv7w4ULFz5Y28WGrhWHIEUQyLFQPiWgCifSLUdMI/AFXsqAgwsYyMiZgBSu/k8ezD/ExTiO43ue7aGG9BiLQ5r9cViz7XEWuTu5PS2uCZmiS2la3ZR16fHXHJrSivyBmFLLdYQUouTHIfkx5UfX2fl58s/xx2r59ZcUr8/3jo/nmWfb3bXX3u/Pr0dVStURYAOSXFXj8MyZSCdiKyuvcA2/YiZ2a59FNpcK+bTPT3x2T7S3dnemMOa57u7UmX7dEuFEG414cvLIaW1iNbfW1iZiWVVTJ0yas2THnDlz1rfoOq+Cq4vOmpG+/qVWq/XV+vYfdZ39tWpWo7GKEEgyjpRDvQhc5CSEkLOpiEnnq16HPuMdWgwnHTokULxHiHYc/BEKERVl0wp+FH0Xc26KuJj3NSkXsI17yi0ppiFUdesCPFkoHEG91LOcDYT2PzxnHm3U+z8d1kk1ZPJMaLkw0FMq9ZSKJdmKdrR4ZKKZaFmeN19rrW1tXV1d2XzHaO+bd41TZ5deI7ePn33YwP9sU3SHubMYAhsquJ5FUxomN+nEIh9oHAInlwgjC4WyIEJSVGcSM6STQjtWK6X6LAy58JEqAzhS4DQOYA1d4G50K7hCvHNBcyG11kY8BNJUuD+dsavncxuxH78/YepAT3EIrlKx+O0bD6Ween3OBMvYaO+vtV2/mF62rXdbb2s23NH39ubniZZHdzSNJHzQoEMMD89bBdSHSx9vEX/+fPxx/8EsQZM+wDEGxym+3K4geZ3FYmxXEKPS1CRzKaTYUblZMlOIJEWES8GNZZVY0Crf6OzEmEfizQuAiz9b65FJDFUlXPfOVHO5Mj9rGNUlA6UigXI8fAOz9I1eWCzOMez9bXt2WUcv9rXGNrfl8/ms2dGXdhzbMCxd9+jG87MNBqPG+x8jPwcH21UMEsce32/INsgiwYEvhQnRSKVxCWEAUbV2NkWxMCMbEzWbh9JtBbmoeu14C1OEPFNBfSjf2NqdKkSj0WbYCtHUs/MGGsOmovypP3fP5qvw7Lgsmo0Jxw6r2EpDQxxz9IMvDiZbDra25rNZMy8RNn2xtMGXZzl60tHdG28+nPXgxyhgUCV4HEdM3Hk/a+7MEIEQKumOc4p8oqD0B6qMGsfgW0EnmC6TPgOsFBNKUARLi1R6mc/4z5KSc+SWYQtcd2dnKpoqdDbHV8OYelQ1ZCTWVFRz53NlKofN/goXWARIclXiAty6drHvoP1mr89nAtdKhPPZWKCjttJyCPkGPUnj85ven+3B9kqsbUOXP3hnQ9dOn/+qnxc+vh+mc4ktx4ulgpNLXgFPBjQ2+umLVTcbW4WYzqkmYCN6hNro3n2jbrgt6gKeEzphFPeVMSURj0bXRJdHiQLSWaKclNTq2rX3dBjrRWgycIknEW4AP3JI+l1YOdLXsizmAy4MW5YI582OgK/vyUbgDMsyPNZGY08CoXqfTHR7llXa7+jaRie9oQLu4Mj7YXGd2gvEkPAREOFToDkI0TAkK+PMCGxUTHmXDk6Hx44X6pkb36kVLuAk/v9Xppw0NzfH48ujq6Nxke5M2W2ptzBtdV2uqml2HSiQxIYq45R6RRW7W2ojy472mV4zbJqmoG3OZmN5MxAYve6osAzdsq5Xgom2tHN0UW9H02CwqWtbumWCnq6JRf+8m/HqlQwnGFAJCBu9QEypSiXg0tcXMubTOSYDR4HFlMKPYeWez8krA/UdbtJpvMupoFr2AxeNxuPNz1ajHRHvfGSTLYiqbHnPYEdAox5OgZNsE8246OGFuic90uXZEAsEwlkyLZ+PhbcA1xo2A+Zo2rEdy0nalpWutFcWOfrF0YRk2+zXsxOJpnzbxS6eBQdvPYxEYFOLuMJTsjCMgalk4x/TSyiiZm/WDaZS3gSNWOzyHGIxY6K3gRNNiHE6q797QbcIhnRr4oRg9huWgHP2UypdO+4qN0qiZXquiB0J4L6VSvWqtn9kWbLNJ2xhs8kb6AgjHubMm+ax3qTAtSSdoy8TlQNOckMl2J7wBpp8HR2B18HgWE1JtP+8zbYCnKqZio9APJjo0yE4aOOsDiumyN2MKQi4IgSsaEqj5wbP5bsCt0NX24mCA0+uybluTAnf8jVr1nC1Jp5COoWm2bnzhla9W2SPU8Vj6MqVoaEMQd6JhvULmlWLJRfFfKKX6Wua5vX5oKOo4NHAnbTtOMmk41xPJLZZTm9lNkBe09zXEc57gQsGZxODg7ca8yJSMUPDanJGMQnAQFRwm4jQ9JlTRDRq5nBI+DlZ0iOuk5d/X757OfO73u8WSwqcYmNGrKYoJwK3fLnQReWys2oxv0hC5g5r7u93hzIDA7Ka48enQgZYsURkdnhc6ZFee2/eGybA8fu9FM1WnsRiZqBy3QDOsZ6MtvvK9h4/ZvT7A2aecip0idnTvF54kW4WS4vsOCEm6X8zpjIesMp8IXo992qRTjZ8aeBi3NAK4Oo9v3ff4Kbx5boa/Uk12FRY9pkCdUQEW7NcFUzgCjnDLQIb5z/Z1oT6lSEh4gY06ytXMnzxQOy2NdfFY3uOolkeNuCOVZqmBUxTPjxPfaNHHeLJfr//YHJZJRhMTGuSjgG7+Nbrb/J6vSAP3lpFmZfbusxWQgje/3GaJ8DRLmRUiZB1rHgKmE4wU+6h1DMDu7deAe7ySVvT/rdo5LGMHHAAoRp0FBVx6BnbMag59rp71Nm7wHHz+UpRkWVKmRJkPZyZC4bm/np187K8DzjimJk3RRr5+MyYf+k0v5Dm6jCOT9cpGHqxHTrkGSFrF1kw6oyIxJl5zphraSEzUupEDIwZKAVmUWkjooLsjbZKkWJkIrWLVmqNyGZQpoIVo8yIBt74Bi0iatBNUZ/nN/sH9ejO2dx7sc/7ff7/5p+p52YTe3sD/dcXxvJHTvh6dNVN3e+3LCq9HvKZug87dpo/0HyKeF/2qQWvEu9WCSzACDhZ4am0cpnMT/yB9+nJ1OjqeT+TWXKr5XLm/caSV2G1+OS6eQgb/jgEnPJM4A4Xo3ivtniyeJHn6WoGuOo5qW4Y7SWmIu5pDbfeems85zf1kB843G1G0oVlWZGZGbSrHyUSib1SIRxL5Jzg9QFdD4WQjncg54Vfh1A/Djbf2+jsvAzN+jpYnYlKZ6kEQGJRNrdEpKzQOpgkLhFZEbHjkss6vrzK83656rrZsixBqsteZjIF1+KLr/TCM9QL3BBsLbgTT/QiLT41FW/zLolybFPezJzB3SvpBN9saBK9uUfHc7rP9lsKrmCahokwPBU6+3QAuDfC4bsS8xRsA8f1KzjwBB5Ivaj7ArUPB9W0zppa9i6XAKWyIbIhmWwZqHOyLryMQfcSqQvIS2GQzYKnvFQ5yGbdCnCZpWsg+3Ou8TID7eKLgA3NDYlw6Hfj1YdT/A949092NC2+Wz1Yl7VeJkNlA5ArcI+xKKKREbhH7pQMOSGlQDcNUorfko9uweYv3pnPDxyFzesGCkHTkEKvDDhFh8B+vaD7nPoH7OSFi0LGXTRTVQH11KaWzHGFrHplgpecQ3SinCzUOj2ZkZE311PKMcvUA+DO0ok3HY2+9nhSVIOuN3njHTf2JoeuPhxpo2tavGWZ1vmV6vp6VYFlZIjDMpS6pX2mQRnycm/13yVVLgYbPhYIhn1+5XXoB9x8Pl+qh638fDhk2aGQ3UKLiFn8SqsWsh81aj938bnZNKrRHTjUQTMggCPL9AFHZ9khoz0qUtA7+i67VBYXnR6c0k2l3AOBe3/pAiboP+k0liWHD8wNASeP5NDQA1T03le02Wh8aoTLybl1ts6PoRuyq1MQurDqPTIpaBqXsXrkEZvsqLKlL+CEw4YuAGBQqp3VgUSp6LyBcCHb9pumJd4aEryYFYnB5odYN2qvDl7azSKCDUSHWB+fX6zvS5EN4/igA03F8E+CjRjtUFteDy45wq4kW84A19iXrflZPkEgbSqZnEM3Bdf7+Bz1oPfauLctfjLVvrx77tzBm2/KEeRZxGHVxnJaGgE1FeZPQ+O2/084EzjyJWFlS0yFHIIuVzRuusmh/gHnm8EbdYfkOnnWyBCDAnf0Q9cgHx449oKcrSEarsiDZE8i4ThFbWRxxu6LWTfIZl62n+zUPO5wzy09Dw+7lINyufL633A8YQxdSQ7NzQncjb246ArKHca9nsWTtdcOf3tlpIJbgqfyP8kk07iHLu7PFi4dPTL9pn9iIhaxbVTwGQHDMahmurAatfpYYtQx77IcJafO+6Zphk01HUVAFDh/6Pj6JhtB4NRi5VJJKZwPgMQwysEDOR8g2C7+slPOLGmh2cN0sOBmt+YZyQL2cMp1q24506Cl+ss0rxaPv5acm8M1MfHLFVEw7tV2TqbO/fby+XR8cWdtqcIas1qtNJbueV1j1EU4MW867c0Vg8d+1VkiCpXAB5zhMwu6XnBqTpPGs2aOOwYvbd0MGeFgIBA2Q36ZjkRG6IAON29j6fcl66NudSrJ8EZVIPmzp2QZrxauX4pushCVNNk1qJZrSO2hDqR6hi93swfAlZ+Oa/8o49729v3eB+bODAcFrncl7Y2fnLyyuyieJxLFl9f2l5fJImp12d5iQ/q0ljiii0KISfisVjEwHNNEPAfKZmlvm1st4CMrhgwzEA4awXCAYV1NEYBJq2kbzdu6iCm2Rp3qnIu8SMroQzRKnEynYABN0EEmsdYNHBmIk2GPe4tbSaEcUedyRko2EDCVLhXey8lk8jmkEzhqwVDyJY938WSXMgeJrCf+6kcVKj9ncCy+ZktF0yTo+MEktZvA6fzRMQpmM5evM7RRIcQjcVieBVTOUWWO6JSyZx83v/mBTSZwsrTtoJBDwFVOMoHpvPiSPsKMvSeJBDyBYvPJi65uzy2ue4sklHXXrWTKlX2PmteUKt529nVrIzfffB9w4D0wRHpJbtJX7m6mNYlKTe2hRTDuIHGRm1AyZkeRrjgzOUFyIPtZEdKG3oILBAN/wTlg0UUahknPBZxPL7ZiULxV4Grv/dDVMlIKPggcVZ2TWjC/7CDQAMIgU3v6btaCJJ6LuXuyPdAhHVF3gIuyzuJzysIYb1tqNN6sNjLuCtJhyccJwJU0hWAHov80xCTWZrF2LZ2Ot281Q5HPJmR9gq/RnYQMhxaSQS1gv9X8aawIHNpRqsPQkXOCYYeEKmw+vJcnEVsHroXGuo8dp4ottIJQeSGp8Ut1iiXkeC4hh3Vc2o1y66kegRvucREvm1rDJzmu33/9fs5tqjSOn1cbTz8394AkleSzQ3OPv+yJ7p9Qwf+HDvdMlLbe+PbHrZ+W0/HZxGlhJkK+RDwsFtENA+eETrdDxdJYk44Z7VAuHIRFJ6EGyCgKjrGAokderb3A0SzWJXB9sHWDh1AEopzuyK0Fx5/wX/laTad4JjEnLulmgeuhT8kO01y1ey9cW1riiyWZz++996DaaLz23APQ0aQ8PvRQ8nyUkFMB91/GqUBpfn50XBbMq7nZeHTg9NHJiYnJfgVoxfymQ+M/U3T8lt7MDTRrYRlMAyqP6hjzus+npgPuPNO5195+8YuPhG+jS6CwPw8bOGuT0xRBZCZQEQc7/shpEVvsLs/Nbmo9hVsiHJCpKe0C0Brl9x/LvE+F/pwy1ljeHJKUCd0Dj095ot5Nmen+hy3/4/x8bmxsLDffv1D/lpmtVLf6Jycn+lt4EQIKJ7ULtqXX6lc2a44TdsKQSd8pRIQa04GPSwjpwAXuKJpOv/v1BorwkfnweFwXF04TONmBEdXIk2gGJp6JdFLvuXncnp7s8PA5TgPgO8iuafv3VBqMd/ziktXqY1UOvs+/tJJM9vY+/uwdWpRCsAnHf8MltkZLeS3NLvSaZx6ZaR7lE4mt309jsfHx/pjQWbZtTfb3WzMAOrVmk+gDLkzU4Y2CglaA4ZPQcQPQqG3N7iWin9CngCSi4HF4ZrcEGV4JXOv6FxzchCi+6QHJdXtIKBJ12VfW9ncbZQZzerE3aYppGstrslw/v/nyS/cN4ZTRNCH3f/Hm3Zp/YpZ0O/DkXaPz47rZ/JY9UOkU8frH+yc+E7hIhFOR/sn+mG0GHbGgc33Qp4tKXGSaFaxAQIknvunUtrT4NYn0rTimpBWRDTi+9yDJExqp13ipBFmHLBtA57+ACB30VFI9iPewRF7PQaWy9nRFWuhfM+9X1pVP/vJjbmsrN5bwarPa4opU7jVC7u8z4b+Nk6+B+a18On7DhG3LiGOabzWPStfM5r+tWzimKBexYsLGI2YVJG8ScEbYMXkKTUswnBMo2bj48U3gfvRqbAE/4dwLNHQRQCREICRT4QUZtF2DlG6iTuCRFrcckePFHgm6nhQ99EjlTQZXvLJa5Vr9/bRe394+2q4flUjt6d0p4KZ20jCRUKQW/huuNDoWTWydFpjh+GDocVysf1vKj9XtyYnx8YmYBVsMNMyK2f5CUfYLgRZcwAj4qOMSZUBiKvxYE9W+ndWoLee/HlSqAcG1Eyg04xtqrdSp4Da6EZIXcMuXoFDuFjySI8YsqTLbc0sFuAx4dMT3Zj7+vW5NY+S+he0cZXtqVzYrm2lBoaTtRf999L23dafW9ogVIflP+P1KvJBebNZPm9akhJyFQaa0s2PWpG0a1wPnGBJcQUIPLBPCkBlSYGRNny9c+xG0aFv6ow1xSPhQEACSY9elV13FTexS0WuQP0BMcgGdr0F5UiNklNQwcOKYajhAO3TLZKrNR1dX4bp9dHQeuny0bXE37t072ZSzAgbWqe/3/g03MDqW3vsMNAzEkGkUDV/orWLdnokgmawYgMOAw/BMg1UsTZf8ql0lPYpUOpVc8EkTGXFLGrmodv7rDckoIMCmoowv36lKQAblR1F3yxTeefZqw4NaWZevLSCf6464MpJX3OHK+9jH9YVc6Yn51dHR2/tjk9slgVv2bpJPJNx2DpO/7fzDKXmU5vNtOQsyLAKcEQyiHXO3rrNFFzYYW3DcpSKQKR0n4HOMoFRzxgIjKBtLBSfaISLZMhqPzmqcdamvQyjf7GSsQTv251Lb0JMHNBs0lcBJBGKDnmzqlQrLVzJKT/aWiluplCsHqeFq5imccnustD29QD0Gbmb6aLbt/O5OfOpkX0r45uHlDx/u/qNRYaVbeiPfHvM/2IKb9PuCxwFDKjPRY1nCxkWohI2LZZtkSkNa5kAQNkz2zGHJlKCRTwIOyjnXERD0qdH0+ecHN4g2FXmgyWlzn7ilvAIQ5cDCRbmSO4k59WWFV4YfHs5WRkZwRnckte4ulfHKV5uf5ranpxcWwBvvn7aO8u17J1OLJ1OkFs/+yrUctq4wmxJ7f4qXG40n7EiLbYIhjhAqSpIoyL7HT4WL8IDrTz5LluzKKxGOVgX10E4WtKEZNReYxyGmowGZv1hPa5rnPAex5HlypXRhaiSFDhT6EqEjy+ClvCOFgTo3vD6c2tk9fLhnZ98FruwOHzTKYh8Xpk+nsYXp2MLtC6urq6Pz3x79uMzei6O7latvvvrhw+SOjDz/gNvL237olE36TUM3ZZYRNhtDOv8M2p2ZZUnOcQTOORNNNhHHQRwVOJ3kcqwHalZCE2ut5No++WhDjeToIwqKSPBJ8lTRKE2MoKuKgVueO3duMb67subdqzDTua9UqsrK1fr0NkxIt7owvcrj0Wl+t75bZC64L3k1J8mXH+6m/1KOUjAwf2fe8tsT77RiTjeLJllBZ6hWHikPP5xyFzabf6uLVxJYFDzwmA0YWY9RXIoccKZUgqgWB01MniAeJEJEqRMY8AQINoEDDGBiDjxP6vC3hw8XvVO7++1fVbMjlWGyCrJVGuXG6fb26u2fil+uEnpIKIyrR2Oatnv1tb3X0mtfvrL8V9QBF5//9Do7JHAx4FRSMKXJL+gyXCsoOhBuQoejFgoFHbelU0Y5vPE4GAj5rg8D51PphOODQLj501+rAXXO3Ja+W5UC6SVFO9xSpFSgqMVFsUvN8PzBxrnHtF1FcZyh8/020cS3saWEYAKosBoqiASBYqEFCYNK+gcaNZ3JKMzHWqiR0BhXrEziolNaqlMrqU6RIRAx4opGpJqIohHmVCQiWNKIVYnBz7ntfKDH9tdf2WT9/L7nnnPuuffXI1V7US79nqMvnzzxNvmg6siRI3dgr/64vDYwuzQDFlyYua6321wXMneO975UXpGpl7SvK3/2n3Db3IvGXHFL0DApgfnoiEArT/AQTbXLcxGNziwdZdhR6cKLJJaQBC4SGiYJJDxMssI1N823QfWX0floq73rPWjEDUUtZFJaQSrCKU3Fa9Exjdzd03PPSc8fPZA+cTcJLxM4Wei/bXkh+Oba2pBrHK6OXTOh3kfMTS4Xaa9zNqC3WvVdmcBNW5mQK1Pr5EXUWeen2Gghq2HDiCphxAGNZDL0hK4EA1y1wwimwDGhA+cMma+CdCknwBFdPhmSrS+pbQaqp8Y0+NObxe/OvvlK8OBMxn7I5AcSaDheLnnuA1Fu+o19bKzcN32o6u7Ku5mb6wIrKwtv/vbF0NovQ+7xgZnxpuahgV27ZmYInOaO+WCO1ZpTbsrU5eRLtXkCjl6sa/9fwqGXqhaZgJ4vVPv7+bPcEple76fTh0v2M9RuuYWcdsYtotxF/E3ocEawlHCXkiF+rqulj5EHHh0dgZPY8v3NMt5SWlFFygu0gAqivOX89d/TDh3qydw3Ebjn6+dPKi3/Qzay8dANBjeW10Jud2hobW1mRhICNjMz0yTWsfh0hZU1ZFN+TuY0fgnYCetdLKFhAhhOSS5mzO2nE3I1XMzBZU14v2rs7RcB90vrS827L5HVcFVCk8GJI3izoGHXfLKYRyVLg/gkTLiwtO3bXqALDQMFtARK9FJwSk3Zfi4HLO1ZQntt7UTg6ARFf09l1TQW2FhZK0ovKwrFi+rcS2vdjLuZFJlZDuPBHJPsKqrUmXTEyxNwnOS5N1GF8ikZTxCIA1xXExCx/n6kknXFfsQrETh0LAFO2FBLxhvaKdmAI/v9HKpVG+dUn03kgxS7i7aK8CAgGqkHiBJMXpcdZLJP+3Xc8uD39Kno+Rx9nm7kG/d8/fXEG/sObKyF6txrrm732lD3WiREOhAyheekf7BrNt+qM2VWZmaaqgPfS3NPGRtGt+Uxe5PuB3Al+68GATI02/9z0vpxRqbftGRJEP3kN4BpS1OFMamj3yzVJWgYHTJ+2M9kRMhUP46rd0K8779EOFKaTEyxVI67GbD3uOfo+4/uevcn+NL2WN+Xdav3j05MHD2gJmi1p8790j20ZjZ3d3e73ea1X9zdwAGmrMFJFe0K5LAhDLvD9PQ+/s0TVssvaAsNzPf371fj7ZJLL4Wjf35+ftZsDIc9Hkejw+MJR3NLbrlFxJP89skt1MaiHOoKnDLcUlL6J8aX54rqrz85PR2fFEgeyvBL4FSlJWIRSCjMbv7phRfVPUeynf77T7/8NO1+vfV7PhFLG1/fg/KouO1U0YwpaijE8eEh81Jd066ZppkUG9Y0sMKCSHU1cJlPT/yzr6e257fVhYaWolKBMBsciC4ZPY7ixkavVqPRZGu81517lVaTHYu5ZscPJ5O3QqOVjlokA2SXE4RjwGnP5e/aMW/NKenpyJaW6vS/9frNEv3V6ohk7pvl/oUnaSsmTXSmSNxz6xPP1lIDfH2UBrlsDaKMWxtCNlGOA6cza0iHNc0YmpzOBik0E3v1VpOpmgZF/tepcCnR8q9Rn8bSZJta9Pba7Q57tkarPfc6r1brvU6r5eNmn6vxttYXhaL9n8AFIGx4rxpuQAoayn1yYWNLQUaGpqCgwLK6avfWs4WTC8jqX9vJ3wNELEGxs866+XUCJ3R31W4/OR2wZNLlFo80aZS/ITsMn/66NCl6XtuaC7a/jEHmGiCLFzZ1GFzIBtz42t58k850W3W1Tvd06b+aDbyBMC+9tA0nKPPGYv5sTKNtbfUCB546ZIuIGm19aLH/k09oN4NDAY1o1CWfM5eQYPKzqzFDTKvNyCiwgLdqya5vA40Ll1f7mYQPOrAwohzSvfcRbrOlKQfb/U9/f+pJzwf2JdnYxrA20ASUK8lGgKTokgK60NCgbGfDwMYf+nxTdbXJBNy+f6QCdclSqyhtoNnt2TzwRy8GFA9vNseWFpy0wJ7dqPXO/vwJXEQTkgBHSeUyR/jk5+GWqzIubmlpuRg6Ec8igPzG+nS2QdbKfTSyoRhGHsSTj2plSGyBw7qeZefo0ffzTtQA5O0Bl8vgErxuF8p1m8c7d3UYBM6JYzbMuCMbfdM6Ey0KXUD88m+DC+fmfrv0envMgmbZwKGd1wsajIBqxfiTAuy667Th6CJh9AKpKEVAxho7L3/O9WsKMi4GDtNymtGiBfAZ9LO3TrWdUvvxly/IfQJ3Pfmuqpd/uh02Ee5fePkVtyLdPhZKS8kjGF1H9/ziAImbutnVZEa4cXdoYKbbPMB8vGF4eJi5eXNR81BkJUAiN5kCpf/6hTKacZzrGWwWi4ClzAsOXIjGiWgocBoEzNBqPNHFEjIE9snP/f0/LzrDHk0GcrVAp1WjtAA8XjUWjAt1PXuIiR7QUEfTXfjpBd4QJLF/w9FOLj9YeuDo98BJMKjd1rvUbB4f7ySCw2cwdOyaH981ztNgGG+QiDJgKy7r3dFsXim3Vmfil1vgiLnXt4o7KjIOci7vMDkKHJ9Z/VlLhmiCOppYOLwUNhqLG1u955133jkXZ4BzscAxOmXUgapFeKxA/KA+PT1dUkReXtpH7/305ffbQPuP6XT6+1ky3Sdw0Cnt0utc4zNkt8OHf54fGBgfPzw+89wO90BHJ/NV53DDTHeWp7mxuNm2FtBV36HLefYfTqnG7KllXlSzaDSNjY0QwIVBogiB0yo+LZ+ZEVVzFXZxhoh08TnKzuMJVgZ2sZJLEfH7kP2qmnPAZfTFvAQyZXKn0Fu1eTI4tm8BZIdvOeulz+4jE6Sl9nxdb6DN31tnkB7KeNP84c4OszlUVjduHm9ycX1dWVlZzcU7yGYBnYlMHij9awmSKoLRVoRHapImaBJRhJEHEiowFSvFEE3oQBGylhaolIEHG5ZUVqtGaEbLOefUtIijwheL9UqxQtmpXpJY21LHv5WTvQq7aWopNJZ7S823zNS55vsPH+7obpqf7zzcuauzc3y8w5y3Y9ww29DdbcvK8niyet2ugIluoGl6XwpOqkzSZz0I8tFBEiZe7ElG9Va9qHyu2HgowwUxFES4GjgVnLgmAxNDZUxbg7W2Cl5GQSxWlA4XbGJp/2eycQ04/cGJAzKbwKtqezs7u8cPH/7888NY5+GOTvoLasYaCuGtZuCgy3L3hpYCLDqb8vUH1cwAt1BwZXx8B8MCS5GkmDjwTP1MvE3YOEMP6BQMiElTEio8THTGMeVqtCZN/Z+rsetPhixlScW2wOUAB57+ngO1yIbVhi7qBEoZTRP1Mr5rBjwgZ+Jut9tltmXZ3Duy1gJ33FYtkzqGM46hLE/GW8EJxyP+Y4JJfpMXxYeaXm2r5LzW1przalr5cZKZY5Lei6t6tS3iihbg1KVARXwY5cQxlXjZXioSZnkpI8f+By5fwZUHJkBTy+Gunz/v7BQ6YGDjVPXAOrDOmR3doRDli9vmyXJHdJkmU6WuQj8BmTJucaH6QA35vCRcbzy+HPT5fJMjPH2+BU4mfUH5yUJQzoMLweDk5Mj66OjIyAhPbHKyr8/n469gvGKT8uILRhL8wkRCCk17TMwejwOX3iaS/L9rUt7rwHu6Ql+dl4IbuEW5o+ChFgblAGTUzZ3m7tBciKJzyGnMMk7z/1ZlmnT6Z1NwZQcm6E5EIkEofCOj6iNzwMbUmTzXIcF4Ue9Gx9Q5D/WEEDixsbGxvrE+uSSwj/lGlPWpK8Ab/qLYxvLE3FRyZ+//wanN9biWqeJp9bcYoAPXACaicRQyzoHDZjo6u4d6T33kkbpQaMjsjtD/qqqkBMtnfYQ4PLcxmPpYo2MnTAhG5AeKDkMajOPI2GCfvB8DBh0RJpGIoQw1CMIsx5eXE4kIivG3+VvyO/pSNibgIvAY1GN9fctzbWkntaVK3H8RVlbClq8PmKz6e5IVNxt/CCWwAIcl4VSDj6Dy3KMPPvJg3bap5+pCG9M6JuOZHPID2/PmViAb7BsUvlFUEVMoC5vKghG6TUNricSQxx+OxeJ2e5CPFY/HvTU151xMllPBxLL6zDNXXHGFJePi8847XfJdzVXX2WNALuC76+rCjKQMQK4NbMCuLE+l9vhugdMJXI7JVJFDfa8cs3f+885xJd0JEzT1nAnJRCi0Pe+5UFFAnwkZT13+7tKNPuGSC8rgEJtdEpsdoERlzbhBLGy0efxix/x+uyUjMenzkrdbAFNRkcPqaoGw3XjFqgXWZCovUGYJjoyscCWK6epwMx6SLshIHlVyyr+9zEfHtioHHiViZn5O+cQ2NoFOvLF9qP/z+2ABThKc6KeUo9o0h7qxB0Ntvd1zFRWKDbcsLz/aN4ityJjP9hY7sph2h43OYUNUmcu1tEQhboi6FF5YAFctCZ/PTgBUcIIgbM9gN94I3+qqKAkd0ZJ6+ZnV4OhIvLXV4TEajeFhp80p5imOb8xNbOAvuM3c/yknlgkc2Vzu9yh99us3trsv+pz4QesE15ynQoGN99SYkIk9GirrDk3nHGHBGeX0+ukVPHJjqsybTcx2eMJh/mXwXFFhdHgwozE6O2CIzpqblXgcLBHfYEzmNDXwKX1ENwztOPAmiUfdhaHcZLyRX+PkmkWjYWM4Gt0ZNhbbe9PSpjbG8JoVGXRbrAo2BECBTNmcnbdv9+6Dzx4Y+Plwp/RfYTOY0Y5MgM0z9+nmQbCse859VE91AhuJclpGW1ueV6ouPgBYYYyLLFyxWHhpc3QyOOsyOqMDZtHO43BYNBGUg4vSOCkdugGHagKIe96YxNNA5tBoIiM+jxHHdrrCRg/vuYb+pSiFdml8ZaVP6OZQbQsed1qx5I9Vm/Tlb+Rte+PDVw4ePPr8EgGz43B///gALFTQKttxnrTnurub3V/nZIpVsm4wJmFkY84OXLYgUZ6FwfJTiAY3R9a/Tdro5mzYUOgyevz8kaVA4DKSlmJTTolXQkjyfub4FfjqxRa/ReNo1JLthoxG0JqlGJdfodE2hqPGpY1BnJKYIqNu68amE2yZpvzyvROnbvvu4Ie7n33lw4m18fGZgaWYu6m722V3GSjHxpm6Und1h7pBo3n0NQFFtgrkW6eVWwwGVfnYiPEiAs5u9gF2wvoGR78ddTUUOj12jy0FJ1GkRbE9o9hQTuiAO7ne8syNxwmbBasWh8OhCY5tOo0ug9Fj5Hr5JJdsLvkZgkHfCtFkeWNwZWO7RPt/w90tS+HUiJlVOfkTebXPHvzw1lcQb9ncTaGlHWK2OpsdHjCQ5VzMy7OErNnNcnLIKsrpaE8ruOUVX0JV/9oWjcPhN4aDI+tjX/Z9++16im9sOb7y7foooc6Y5cnKtlgId9nACRpsNwJmgQ0TOMuZ6adbrji+KtJZEM++MLZZmFvoXPKN/n25RpeyHGHf8oGpbQfmBldWDvwnj7PvPlOZtI+/zqu1fnhwt77ioDUwBIa7NbHITdDeaO4AkDLeFFtzqLm5e1mfT5iVWGuaRraJooSUXerp8TDIxr56790X3lkfGxxLwcWBGxxb31xyZmU55OP6ggKGZRSsHscZlXApe6bm1DwtnNAVKLjg4GbJndFNLtVfVwvMSaMnLoJNTaHfxH8iSpWi41NKNrin7cD0rdaDFbsP7n7ia+jW7k2QN8PXGYgosNE06n4OLrG16ZycSvAk1wG3Mhe3axRbY7FnKDg69t4LP/zw1kcTsI2d+DCDo+s/fLy+Pmt0476WmG8yoTIAj2eO3/gXHETy1J506nmcQWfB/LHg5Oa1i6NffTk2urKyrn7dxAR+sWkMnURqLp1axnm2bPvBLZNw+QK49+vtb+y+9end1nwFt2ReirVP/uGLPeXq7OgwNLGCNSTSoaF7bVpuFlEhhfoSuHhMo4zZ99rI+jtP/vDkR1NTU3NSPCalW5dyYt++kU2atHaHxpJQcGgH3vHjAqTcEko5vcJyyrbTBJV8vuq3oNzk4ubYO09+tLGOYmJ9c8tj/OpIvEwmakm4LfUzY+61u2W4ya23e6u3v2E9aOUux4MVew5WTweDTz31xx899x6KkPKwAXcWYC5G4/K0/tZ8BSd5pGpsZSUh401p540F+z5+a4q74w4cKBtcH5MacH2MYclFLw1uRl02Mp/FEpmcVMFSEhzCpcJJEk5OTq89U/2AhOf3a7KDvs2+Hz4qTVv+lqKLSwVd3/rHN6xPJooEqHRC4MD8l3LcGsCN7pWRpdlgZGWi9p6j1dW33RawWisOVn3w9qE77gXuqZ6ehGF+MbckXJxY2zgaeHo6PwcwDiwYVKL79B8rC8Bh8GHeRHB5bkruIJuaULUtJcQCJefYvuXNxdmwJws2++RoMp7A9s2/B1xSuzNrT1Gl2PFvVhlzflLB8venbq+dW5fpwjqXiwg9tRFxZM1RD29vo7Zd+Tca9vahqqrpQOH8fAmdrtm6ZysO3vbYSyYmQaaquz84VNne88eRV3sqD1UxzUi03xYIBHK6ugDjPkgODDkUz9d/NZiC02b77dJRjkWWixRd28a6lH+qmh6cg21/lA6Fw1IQG10PynDDVDQBR3GpB89nrldwnB8/Zlk95veNBDdqZSEDv6TWIzgOrq9sbBobHfHS7djcysrK1Fa4xUhPT3C2s9Cc1dTUvWtgWV9RfdtL1fkVu01VH3zQc+ipH4+ce6RnL/fA90w/dkeV7gg1qE4MOjXeJNHpjw4uRFSbCodLdZhjifgcyk2VLeOOo3KlP/5e2OadHoeqT0bXI0mnbFk9rvwQUzApunrcUrEdP3aMiOIbDQbvOSmP1Vuhwxdw9pFI2Gn0eKdkQjC1AdzWCmXXeOLI0n2GJgM986WOjmBgdyBw22263btxy9cO9bzd3n7dka6uvfC1/9ijq64+UlklFVeqZgMS4fQT1MzeRq3GLh/cGHaE/Y5seyQSnyorQ7+55ZXBd5an8KHF/f2FNr/A2anoY5Bh/mPih3/zJeFurNl2/SqnCLcKHcptLgWf31ZLK2GOCIx6vr5IONrgNBZPyRocuYBEt8Ux68YLs2bvpPOqzDC7crSaD22tUHB3f/DBq+3tVeVdXV09jz1VlZNDLqwCToWSuwWOtzp9Pj6R8DoUGxYOUzBzmghG5q7vncLa8k5ti0eWFlm3c1J5keVizMBXVY7zHzsmLEL3t3S8tKQXMxZ5d0zRBSfnc12ReCmb3LblzcVXfL7IkMvQYLMNG4vSpde6MrZyYGsqaNrVWZLLFuSmGdVH6NhEt9tM1opbD05/gPUcam8/tJfF8vZ7q3RQ6fiWDZNVIgkGnPxQXz1Hb0HrcIhDOrKlvpVJT9RvBy/eW4YdiK8tRffDttPmX111aAqCo6O+Agtw2ceOHU+RnYiVIHHQnDL063EFh33jD/rmLymJzgY3KLU2NiLBpXBD1OBsbuYfqiujs56+IXBbBp1spzRApQ5mQ8d40ES4rLbqrYG7+Vq2np6n2vlGlLfvvUwasNUIVUVTQrGxUwPnBK78Ni9tHC/tSeHLRjuGno0FVIZXOLIc57/EbDSX/QusAhiB82fbR0bWyXKYX8HBdvzXY38pp6rL9BBwMuaAi0Yjk4v9F93Svzg7NBR3u2T7WIPTZrM127LCxdfL/SvLY4NzW+GYpRkG0Aw2Ea5pVySz+jZs2hp4W74kquex9p69T937UiBfTUzz+XYU9T0bqqohtghcPDuyAJw2m5kAbB7RzphlayjMZaY6y9RglsGGbggHG73w7OD6qE+x4XEppuOL36TgkqkuY1vRNzcySUjS+ROTm4uXXMpSV4nTyZotO2+dzD9sNvpUnvrt9NGX+/4L14HtEjr41BaoSOAOUl31bquJLSkfVB76sZ1s91hmjj6TtUaTbm+OVSdZQMERMgP0X4qzmVXHSHJ+5lqYcTg6LFOvhsISbL/CwvpLhofDfgsWm1xfjwmcBY9LDblvfgUONmXAFWwnFXCahNMmRjYNF7L2yv0i3Dmzs8EAnNNptBlt4aEi2YUTF7jt/+4QzczAZmZJeGZg1hW2uXbNTlfpWFe0WgOHoKs89OpTTz0WoPTPyeGn1fnAWa06ZQDmBwL6rsccWjvjmxzniULlDw9HSwqZUxq4wrJlQxlwucNGQXvGYklMrpPBRbgHHvjmuFIKt1QvgIopOHnDA7hwi31ygf3ubCRQ21hkJzhrhWIuY3FRKUjxPuk0/BuOxsj8PNXVgMto9Na0Ns5uVnIHYD4hRTdNUV116Kn2lwL6ClySCIlbMjXNAc6qy6E5Ic5ZXtnq0HgXmPDQPhieXYzSBWALNw6JbuzywthTA1uh0w+bLG/HIpO+mBpwDwCXHHIo9I9Ux1GUU5wC579KG/S5nA25+/tl7RxCvhRHNqQC2JxVNMV67gRwaVvgZH5t3tU5TnMj+6qaq2qKE3fTCWMwVVin91Z+0HP3ddfl339rhQ46qa7lu1EombGUehXlT2UXaFojvqDd7zfikLmFcOWWFEYBE6oSXvDL3OFh2DAKYbtvMqgRuGOwfUPVrJIASDCmshxwJyk4lemGteddHJmcpY/GNwaAd/iS/gu5cg1Ol0vWLeqm2GEUHxyMbx1z4007entnyODGmPaclvNOP/2yIwwuHYAV5XxdW8+Rc28rf2hPDqGS1M7XF+y1yv3iegadoFXl7Cm3A6eVQSedqehwA67pdO5kzyFy4UMy5i68thA2BYd2DDlfRNi8Ox849lcmgOlfJYrlZOB4L2PO31pzcQy/RCduLbmWm9S4XAYJluSCrGZ30akqWsaTfYa8srL07Wq3RocscsyEmjsXw47zsltPP/305wMyL7dageup2tv+VD5Lr7fq7iDMZObs1efoZKqDcHSWgCt/PJBNWWunao8IHMPWKObEH/uVcFghi81GY4oN6YJJr9TuiLIIfQzlFBW6Kf9Uxln9Kau8KDj7eee0eH2TS+YGzHBnCU7J3eacumS9acfQHOFSwbXlndTLRsPCQlddKZxq2xOPzkLjsI3sq23xRuTmCZOO3bA9eyvP/ZF15ftxS5M8csr13PGfU3HCMfd2Pf6U5Zjf4bfLMCJYqujMloBChMNx1AaIYWGjmyeq8bQzTVXC+Red/Bzpvkmlbjn8XTmfdoqFlxRczTn1EV/EZUjC3WcQI2IKnbs5K0T9RUBZ3nZS2dpiydUsdRBK5k5KwVGnFNqGxcIeW+JuCZem3Xq+baKyPSD3PO6p0KGYNV9fLjcsqXmq0O0t39OV8PsdO6AjXjqAw5zORajUFm3iSzRMrzGckg28VdiSoTJK2gv7h8kG0AGEAfPXKXAqERBPWk8/77z65cmFJZdIR4a5Fi5clEFna84Crg24BeDy3PNs7zfvqJMmayjNDJ0Adgxkgaa2JyfuJhLil7d2lXcdac/Zw72BD7FuXgGSvosb6fZAXQFcTvneij09Mb+leEexx8GoS9CrhM9mWKRYbUiaYVFlW1rMJwYcs9SEFJWO3J25RtKGwBEyT8DBcyPvUO5kC2ewyZCrOf3MogXfpovQL+Ou5D6Gn8AhHcNuaAq3XBhcPql3nq+WYQ5QWDhgy81NMys62UnTPCxkPCMMJmbar1SUl/e0Pwbc/fff/9BDDDy+ggK0+/kyA0BZPcFFy6fZItS4Ywf9PLocwNlEulnGg+C55DJHnTZhA07kEraIlhNNOHf4zqhjmHH3DQmcoJkEBC6lXLrluLCR5RprzquvLxqa9C2BhlEekATM0BnMNizE9w3QIZo71T0vtyJ23ndf4S4OwJlTcLadwoYF83WMrlth6Zo+97Yupdwe6LA9Xffvge9WlMMxRcmAx+6ta6zb0VxMgN+UEYd0zlklWtQA3azBBpzK3dBlJyZHItoMJmjh3GudDddGPTuJKaS7X+GDKmVCelq6RpApLD2tp592Wn1vHSuQwNmgMtpwSxuUkLl59KYd8A0OTp06lCvyyPfF5HKjpRpzsLELKoufq3ulgnoSmklWyv94+1wTYHvAAlDxIaDA6YEjM+x5POD1NjYWFxdneYoTI6MLbvDcbhtlrQE6jJYJLWbgVtGuQCMDTrYAOIzDuTudwztzDc4oHnPsgW9+JZ3DkoL75ptj9bWabzCEKy66/pRTzrz++vjCQtBlTpbLzTaX2RXmVbYfuOvyNnyDK23pa8A17FT3xxru7EwzACZdu4Fup8BhuXZV9BNBKp5tPzcHzSr27HlI6B6/v+shnBPYchl08O3peszb2Aqb0GWxErPg5t+yIV2hBEqp3KH1pOIJTjkJm1aKa9YNKA53khV3RmWwi3gy9jAIhap1G3DKK1vrT8Gury9a8y1sDjUnk9sODsQS+f1kg7j009vKBu4DwNCwEz6c80+mzjWmzTKK43WWaTRGC7Efih9skGgIRKrVlEht02ItgtFKQ7gYgkbiIIgpbM4JhU4L6JDCWo1KtlW8NNoPKLHiVCJTGBNB8RIsiKAxIt4SCS5eQoj+zvPWy1nft2WalV//5znned/nOacop2621icL7LwHdEWWilEmlW/s44r11pYBL4o9IDxKv6GDGTgtGZSER1qcDDfQ6qALrZ8cfj6VasQqcEuiZYW87kA5VMN+GT45/bvckcZ5iQzkDDzFIoNhsRY4cU0N8BumLu1ZhaLbRO2Yw7FXL3Q4JsvkWzahs9n8fht4jcLmTMkS3Zms91N0GoGMRNSDY+q664Xtoz6b0y5DrovsuzFcKXBsfDp9+a1hCSaMP4HiJYzYzXRwE+G84a8HndBBJn9CofXp9ee3UmNKPQC7eOrHMsIx3k7KvZYOrp+7ME5Ct2HpqlishQ6ifwzQuj2tGlyBwwGa3mN1OJLDT65Pz4bQDQNRvU9D6HlWy9/+8ZrodsonCaitu9RydjJUoKu3B1nq8Pk2C/q7alDUbimKDUego+XXwm0XD3hBUolAAgzKHfSWSB8DkY1X4e1QR53gFeCVWGh2nXGxmQphjAeuk1lv6kc6cgB5XnTLxyclF/qWuHIBDrNs4DM1E//giX4PAqd/VobcxKLfamXA6fV6a9Sx9eQ6NpsKJQVOJAyl+HdZ0/05+hxLifHx2OJmsCfODqG1DR17nVIsAYSCKeeiVKHgsK7hEu52XYkwt177Ugk+KSZsXjAPlhSX3KxipVQfLyxv9TvFAEMhzlus55JtxxrFVGKQjc2i3OxJksA9hXItK5ayPRej+56dZFVL6RZzbiWegCEbTurUP8v5wdqKKHB79Wxk80T9ttTz67OzXPjLZ7i1Oas2fEyzPrfs2Tprslh83a6lxsk1X9JfP/mcrjR47Sax1edbLKQmoEZsaZrC6s5Kmim1XPx4ufikzMBwSy+JgOQmYJ0lwjZ0ejmU0uBwlZAESvB4w7en8c6Q+Ew/Oa6DZTvCpCSBQoET7M2xhr6lmLlN4o69ti22WNdfC50ymCDs3/OVouy37n2ZaOnx6D3Q+W1bkP1ram8DuwqWs5J/LfXVu1yUId433k2YlAa2pZvXLto3a+rtS60bbU01VEB3b2heWdx5y2UXTx1XcOWES3L3UPgBYSuGDJd86OBQM7vbJJQQttQIgE3UG37r5PC6rPxvpmTEyXaEk/zV75ID8FLgmMZa1ux2psBNwAXtbTlNNgaeSniiH88Vnm9EQIszqq92eKxWj17viaKdP7k1uz78D900d5p2QsnknqVYzWScUleXnT00mGvSB1zrxvPrG/bSpV9ypEljTbdrGjip56m89bKW5teOkugk5x3EIzXlMNDCxM6RZcY14SQTmUETQjTEX9T7y04h8VPZ5CDLdww4rFGsJnaBkfIRwWsiH5J2K5w1TUXwZOAWqxXchC3q2e/R72XMoZzDAZ2foodZcc7ZHY6tJO+djJ6ltkS6OVhY5YbO3NMT01kWC2dHR4Y3XButlgukRU5sOkKnBukBk3jqspeOHb9z6KEHSlTLEO5eltAjC9PYwiNT2ylhczK2xTJsxEoMPtCGuTk8Tfye/YVNhawkZOCYVrik9sPEtbq6qgbPstFF8i/6zzPz5clV0eA5U7Yf5UgH1mg0Ch3mh4iHMsJWMOU/a4TMYCEDIFuPGcvRLW20vlE+f+fPf220prLjLtfZk7udKIdVRg5c1nwscOyoJDfwIFJw6sqA4DLkfXx5OSRwyCZkGbQGp7zoqOhwtvLh8tGqXVuF3KVkfUuxEU5CNTFaMJjN6WwT1Qcx6cHXlrOGngaAMnR3IBwlP2sha1mZh1EHXDV0DDvgUEtxZVJd0r+WrXrD9JTaYesx52C67XcO3Fo+f+xY+ejA6a2lYGo2Uill4+Ax5FqOY/NHuQ4QJuCKNTbODwyFp85MLYtXqpTDUrI24EINNuILRpTsL3CyPA7ZPWqDeT5sWAXSVrgoSeI3kAo0E7604Ro3t0lKsCjpuER/8I+v/niwyGx2G932KHDYXh4ekc6pBAOPfMcnSdJJOiYp56K+hlpNlKPekh91LVfd2hKYn59n/SMQoMCgOcLeDUo2KUDeJ15JS4YAUy8vaMB5FRlo3oe8zecuAxcqsGFJ3kng0DBUABt0cu5gG0Jhvizqs4FQNv4STng0FvRbTArOAF46nWuMldqpg7T0uCaenfjPL1HO4M7jPzdCJ3gXXgic349uSfWJhpx1wOEJDaHlyQsMOePxycm1s+44yhkw3cXNT7UEyufnTw9cNR94vOq811BunxYsX8ErUW4EfyR4hIeAg0zJxiQz8Ph31/2YJFoqF9GCZSNnYDmcmJDUCVa+2j4v+2/EiD+NY0bYgMOkcodSMrfJUB+qj208+9UEumGkOODM7vS40WwpiO6/Rr/3wgtJ5g6/Ms0vnfxjkk5tyeTSeKwt/pHN39BjdMe6exRcywst154OHJsfHbgq8G1V1jXvc1dI4K4qjjzVIiWOd+KK5eEHDg59XyJwio4rn3Lv0RdP/bhD4MrMhIRPpnk2m3JKTkJyBVj5wAldoUaHpF0uI9UfmCnTh8EoNfC5MZc9NVhBwMzAYXF32kSHvlIax7Ab3VrNoHPwwFCPjxXlxipkNubvG7e4eizjVLG1NZ3t7pFrOt3UyweuHRjhFuzA9ceraNGTNdopbKy2RgZa9kXAKS4vCRx9CDjvkNDhmJzI6x/MzExt8x7KNPE4yXhjTABHzZWzg02+sMmhrd+B1uB01hjTopyq/+AQ0NwbBdCdrB979g8zVBmTfqU0GWwrje6hdlWPa0ajVomaCOhwtNf5nfiJip5nfHbKEvIw43jcImVQ47qyF1oOtDQHRk7fNvKd1ARUze8STVgv7byl5SnWCliZKy73jjAbCZML8E8IuUEUKC956N5TU9t+3kT41HCzwYShnXqBSoX5mm7akwZHAHBJiaOmmxQVSzse6lalZc99951dnDBBp0lXRFMK4Ig4Yx7g9hMz4ZODCyDgHO02SXzomPzOMZ5nzM1WJU+54z3x8clJ3Tm0X3th6sOvXxq9k37VWVUfznwfjkhtZ+S2y35iJeTuuc5OBt2Id8iLckgXuJmblnfeGfAOfXkTwTLpx0Q5QYJJychNFTFNOAIJJmvK6qqWTFHjpmkDcEhGsuNAQipxhS6nyOh2VfyrHX05pJOndHFrYI99GZNMK3/ErMKGKQ2j/uQ52+5cU1osmxDEhlHbXt053715qnn11OnmkWNVVd/Jl2gMedUy8S0tLe88LF8wNMcs07t7Z3FYiycjXm5Hc63n9X65k/L7UyFmDHi/AMkIx004MdIxZ4dW+6GGGy9hE+EK4kZKyLR64oxnGrPlV8Kp4kV5abfRFfsDI6K4cw1FwF1gqG1aitL0/MLzhUulPMafQ9Qj8wlh6po+Ix8TwddkSudyVZAen9S9SXe34yN3HT929N6rX7xavhLng+9hK8ErD8y9+ujdNHnch3i74eLOMBcEkhDKWZcr9noPfrnjS/ltoQZNOcnh2jPjTbvI6xflMGGrc9Zd0aGm2Ek77gOcsMnZxBMGqJE2FPflAuqmaZ3AmW7MNbikJL6ttstScc15Vdbq8y8ETQ8deGLVTDqjDI4fyxqM2fy/kliMceZfPHSfX3Tp1V8PnHpi5t5n+OYY+ZqNz4c6scjoxU9FEvvufhWj+VJiN4J0XnWBWnxL5S3FERLD1PaWTeIWJsppKRXhMtbR78yMN3QTXAoggQvFcqX4D0eUalaTxpimkY1q3FbKwQ+fuM1//GEw3XhBEb8wdJaa2kU2nEhEETbMKlcKMmkBDuV+vCYZV51+0C0NnJjuUuA+fuH41Rfdey9s8qVjN9z7PRjhN1pYVqWD5ZzgzfEarE4Zi8CpSUx4YbkaMImXsHHG5WzKnJCAouA0ujoMMnk01Bizpf5dyuOhFAE1w1Hb3G7GozE3jYt+Qj9PqsiLcuS/mOiJ0BTMohRHrwxCEdCz12P1iAG3P7qG5uKUaWNPj1HBSdusmeOjV1/0zL2fi83MzHwxMrIQWXhp4NW5uURiDjgVV3aVZgku9BQbnvrkloSqYB+6aUg8VDQBgWKqOrF2jU0zYWbilWu0W2R8AAadFKoqNlQ0GNxdEKfF3J8YKbsm0WebUM7AfZYlx7l8oxPp7v9mBRG46PaZZZ8bd0f1eLx7XBUO6C5Cufe+/Xh1ZvXLL1ZXT3165KabVnpXerd2tgfkm8oU4D4JK+KWc/xEW5gE+qHcqa1g0uH3BVMaHVYgaBDw0KQabIdOhUrtbwpsBYvG7HgBcChG8ea/ZKIPzXWNwPHR56kuKRz01hBxmahNdJU27JGADp7G51FX52x12Q/e1NPbH3Uz9XKzbg5bWilH88TPZ1aP/HpkZeXdd1cOPXboRG/viROPPNL75/bXtyQ+Y8zNJSpFuQTtN1AxUZlIJDoTicrI0W+XUykCcSiofBOrU/Ixk0axQc03Bwf/g5PpRCN5INvlcBm18k2YMnQgSEw0Bln4dhvTAkQGVKcc1RWstsJeUVZFowZFpxFqdPv3sN1l+QxbQ1sXlybjSwVr1CH1AKi7+vPV1U+PwHPi0KFDjx0+LI/HQARv5cfRdx5VTvnZHISdu3NYROASeOVCYOrpZRtw8gcTh+TQHBLFhK29Xcp51NQLOP6eKLOYl+2zupBMpBHpMupR/k7UMNpNdMsypzMtwAyAiUHXNFFjt1ZR0JwlD6g49GVlZfo9+CWlKGeo0tw80MrdrlRqzYhf45arR46s9PYCdhiqQxhkQD4G3YmVnYW5ux99eE7U210guiTwUUQj0HRGAj+/HnI46HfmwFBO6HBJP0TKhEZMm6GIT/Lg2MjL9ntceYKFX/KcK88gmnOKJrpMpTShMBugETyDWWsDJi3zLbUTpQ7gsoDD9vDQCBXc8lRViOK+A5u+vrGOVB+3v8gFuj/RCS4UU3Ih2CMnHjkhiIjZuxOh6fRnc6+i2JULEdgijDfgGHGBnd82U/5U0OcHTRm/OjMhARpsv12eqJga5JSPtWtkMNOS2u8xCxRhUag0Y8rSRtAwuehBZLCgGkiEdoRTcNmGIuCSjDllWdpZgyuzArdcdea5pV9+9/Vtjv2ymfLVL1GWqnvs8EeCBoyMtl7oNMDeQ4cfg+7Iz4m5hz/DLSuv9O4qOPxThAuP3L+dCtqivmAIOJj87X6nzIc4wKqurlZ4yu4ZzIfKqQ3FWF4s6umBBi6NLC9DZ+Z2/gUWWmsYLAgmcoGoMgUZ0ARcUYi2osoAw+QkjB7r/qefpkvQ763BvuBm62bQzxbsehZCNGfEGHTCl4Hrhe/wYX5eOV2ZeFiG3FXh3YRYpcCVhL8c+eFxh/hkkjyOsdLTDiFo1WJCBxar0JdQ8AYb0qHd33yda0xbZRjHEem8LHFuRjTsfCjijFGJGTAzE1jNWqpRuQXG5rygiRipRjIEJypmRDbDPXQodVlcNqnasZoYxpZFE7pmCG6DlQW3dqAhsZsrIbpspknDaPw97zm1c07/9JweOj748/887+Wct8/Le7Z1vZ2wFDSq1iTgztJ3Z2Qfei59X0bWiup8medhF2jpkpTUqiPnDmV/8/fSeioYJJVqtwVHb0kZ61t2qemHN6lJwJfgDu5bnp1i5Jm4x0vxKUA5q+CMzT3b9ePr1MBs6Xof65RxTMt7AkeCFjW/qhQ2p/IMwcbjJoRtLB8QQglPJGELY751vdOWv04hAWecaFNWApedXsDYPj9fCkHCBR9oSpnALf8tx4BLFO3Ry2ywwZXrAjtj9L05evmPhoONaqlyAXAGWVIAkntKmDfR+nlsvotgPPxsF12cWCdwLRe9ARd24ZpLvHPCpGYgUCV1W+VtsCG9hamwV3bWVZyy3u60PS8zAJA4G3wrYFn+3FvpZUAWNGUCp9pT1eqoCjfVp55bThnPBFxSqvkM0kvYGhoc7Q7LwVbgCM7176YYTb9Epd4d4CDJZsBtb21ubFw4iWMv0owsvg9blxh3MR6fD1os237aJnD7ncoyjiScbiDRiQSOiaXzFmdnqfObyZUV5Q+t05tJvQgdgi7jbHZ1ZkbZypUZZS9LEZxEwRcOyDMp/3NXU06y+GQCUDcvyGFzOBq+7q/fX4Zxb2oHzxOWgNEVbBdJ/40Ur3R0vD7nOjYPXNFJ4Mg6htTMfbzx7xai2yzBS5cu7Q8GR4ETuqTyllZaEvZJhIqvnWk5dmppfGzN2mFbi1eGZ1nQcbbSelDbZ/2mdSszmioYLRt0Cv1spjWjGrgCe6JqtCGjzgXOsezE1t7guDxmgq7pzdJOtvlJacQtwZNUU4QgCaDOR69Q1twYW3j26SKJzUVsY0zd7fV6F0LRS8GOYRY/WlwdrlFnHpGZh3Q2ZpRy5pQQuZmWk2rZTF+QVW233wURWIbgW8F8+7nsjNXVAldfoODOAodt4pzariKj6To49W4Czib1x1x9De3DlDXPsRw0awcP7vgwJQQdWcdZScFxYKH6VLUqsdBcTdEicF2LXYtMx7vj3nPDwctzw2huzukKBl2u0Tw7LLwEimvmJElYfLPnpLJ7kpMmZTVJZyqbhM4QkQkcg2P+8/MzKSNVkLN/Z2bmztsl3bIUHvc2paRkEzthJOkUnL4bpWvYRKmh9vb20ZtvKk+rrNOC1KnZQc4ZnTjScw826JCEZOP2jxp5C/UDl0g4jNu4a3jQFVyY4zwKGZLlzBaZbSlEuZCBgzxZs8CWZ6c6SirlX+jxnrFaHzJV7MEtsJACJOUo5p+ZXkAbk55vt/+UyeRFTzqhE1+Xr0h/xoBDgCGhvDkH54ZHU4dn29tdJn73aB4P+zBWjKbAhWFwcSQoVXMZhE6yb/tHrc83x+ZmWxYX6bu/7HqqOx6v6vHNBYPBhYW5oCvIMQjj6KhzFJ90PjURwTwnpNhGFSETGyjxqmOssn5dfn19AVhWDgNPRR579+Svg2W1s3w/vqGz+hBNbnFKVcG1wBnGQWFI1QOzjY7B1l9Pt+BxeDy2W4jW8hS8alTpJnlnACIMRNsbW7n8iFN0dhG14NxF78aqnl21X0QvD75xum1hMDg3NzjYAZxMG4ETuzyeSrsgyi+3VlpwNa0+R4qRpDqfuL+uKSvDUv4S5WT5MeDEHDgmV9/FLQj2DbHVl+1RvnHwQ/7hY8Y+yzWduLiWEChjRSzwZZiSpuUqthQEHIKEnoDhSXJygH1koIzCyDzgFvZiXTfuxTceH+hxfzq3MB+O1NYCFg4fGe9ALjJNW6Z5Kln5l6uVeiqXCGelR6tcCmW97K1B8SDLI3Vvr99TwMID6JDORlKxw1DW6mfoCDJIOnuO/XmrmixwZOzMyFwBXfbB0RTg/t3RCVz/4aLZfpuJO5Wax5b4CqSkGDYBh31cI2GETwDhFToal+gBbzzu9ca7Ft/ZerwnEl6zZg1fRgqDhqAb73B5xjx9DShXfnIbtDyctAQt8tRwqVhaX092LOncfP83e86utVd8m8w44KRY1OonfrJKIFoztpnYH8uapffidO/yOKG6zHltHZ5kYEpXMDb7YtGwLdXVXuTw5BlVinHuIwELgaSjhfQLiUgxEG46cryLfkI4btwYJza3Hj/n743ocIE1R44c6e0N1wx31PQ1aMtyG/7Q8aDzeCQuc0RLSkvNGn0B48BKqvWcJ63sFecnYYNOWUdtnvNvv/3Bn1Ym4pC8ZLuJyLTCRuKBn7580w5huwZOF5WxpZL91yVsh2cbni0qwjf+yIBTRskMHHEymkoO3JuYaAa+UaZDsTbvK69Ued9b/LLlne5zbnekd9oXCYcDgTWR4QtjLo+nv6GhT1sGk4At44JLx9IlqTnkuP1WTTOb71xKu2JKZRr08c701WzLUzA5abgH2mT2I6s2r3rmz0mhs95esG3bjk1UpcVR7hzsqd60zV5+jW/XALJBX+pYSVFNDeXmRmbH2MojCUdi4dCESEWiUEJn4CnzJDJbY+c2VnmrBlqAq+JLjZFe32nfG+E3AoGIbYnWoDM5wNK5OC+TNy2PuwEeDXk8pKOE5lKKabydvce6/rey6hVinGhy56FVr9aZza9+vJrbIKrnpl481FLxLZ81XmvtFMmm7Mq/4fj/lTZcXFIzMlJS/LUUuU3+0YGFhdj3aIKSSqzAlBODZfB0QvCkYIHgn/ZWeXvYkaGLsJz21fa6fbXzb0QG3OWVDVeVT7lmeIBTJ7NZXTaU3urJA20ZB797UgmhvM5HXt3c9LNAZIl3uDZ5anMdM1p1O+njUyywlZKDfEwVqSZZTbbWjh03EE9uUOrX8kX34hdGOthzGHHSFfd2b/R6Z/jizw+/NYMiy52paMnYSxchCWtrdKJ5aMZbxZNx2sxX3D7fdCTSW+uLnBgYzMu9ehXblF8Ky6BDXGuaQ0Nm8Hh58ujwUvPqOrnd98F5KaDOGujzpz44tFnd4ARwFW+sc2dxI1+9yN/0Ms9p91eQbWTXDfCkk8sxuUZYHbp7y8nZcrblVGQJuPdkxRor8rpH5g7M09VJS8KXDCaaDT5ck1ldtHniSvw4q6S6F1te8UfcAdIOHYuM5eKbCB4DTlepWa4kDTVzKf8EHAd0DMTyzJ16YTNW8G1exawBos46htisAaRMAFLTJOaJaWnSDFE8iFi7kWgqx0aKi194YdeuLVsulKsProWTBVAsqHysvaX7QChECyNEEwg8NQprxTyyb8jLmoaBd7pOfAZXr/+czx1hM2vP1asgwYbAUUoQauoS15R3coIuTb7MR2x26kWIgKREVGfdrdynI3u4Cem0yF0YC50Hn5h4rPZfm3mTXfy7rWiE73jsOhEOR3rd4zIcuykJtxUJ4Mm+re9071qghRHRewPI8ISeLhbDvOhE9MDAwJMDT86c8PvdkSn3MZ8P+1y5xKSgJeDgNCN84nclxaiJSjXHMocnTVWrtFs6eapl1PKiSGCq3rDTbKiNoIXLpKY0sHEA928JnGm4GON6dofD473uM26pSpeEu6jTbe3u6jv51NbHR774nvZf4dFBgBfjBnQ01twci8YO9Axg3Ra/m1vTD29wB3wzZyJmIySRgGGZ4HDiuIMDswzlknLASQPKDnZiU72lTk0DGZ2ZsEBtgWOMp9TPTVAlO7Qbir3UCErx7avxI+ENZ+47c0Qm68af/8r6V51usf1wy9aWvfNDtCkTTAf01nIiGg2FCkPN0Vg0OjS/C+sGjoEVUDF5zN+v2sgkHmQc+gXSGxKEkY7EhbaEklYmhEVKaoSvuBQJtuIXMqbc/4nGn1C7sqRkN2y94fHx8a/8bCI1NX6h3KAj554i544TkkV896N775YFOu198DHilJFKLEpZ4FB0KIquKDi/e8ofkJD0+yMOlXCC9wBvVCdTrvEmZ7wCD0HEVUIMkKQOJXDXC5CEdF/+H44ANtU8WFKyd3ckTFQi96Ps/+V2T/WOX6DKYEq8GzS1RrRl7+zMzMy875efVQ1Z6g6Jf0d5gkBEhnQ4H1k37d6wIRIJTPmO+f2DuQLHi3KH4CRenIwA1eRFzukZlxDxmccTG/3moxKt3HVw8CTmowrtxjnXT1CO1HQk4MJnZAcw2S7rUZ5Ypfzq3Qqd5NzMQijU1hYLxVRLSUVL6dpbdTpCc2goOjQE3MDMtH/KF5iK+KanI/0SkMJ1z6oHdDKkaDkb8cmbHo1KxiWZx4xLYSXurf7Tw5uvN/RGbCmukZLdxTUm4GBDX02571W7f6G776YTfxLnGBLPHLgSjRF9sZh6XtC8j9EK7kXbjqK2aFthG0l3enqg55wvUBvwUXvBH+hoUN1b7uE+h2aQgZM8GW8GEd6Vimm6yZ40m3FP3IQgVAB/sykZEan7SOuSpOKHN1NNMca5UsbFuQsXCMXX/OwdyMbpd7Ol4H0pv8aPvzeDAoVtp9t4OMdjrMaQmrEyWME7iAqPrjnaNhQ6OjQ0dOVcz/Fzx2oDpBtwvdpVPc/4gnKR9oDZfIc5EZe6xFKuFRgHgo5PHXLW0lJMabZUpD/UUAjAmP4JJ1wc11pnUHIbtqaoeGTw5pRBFZYqz6bcBKbaSJDN0uPxmem5ttrawsJPPz1aWLimMISY+aAYRiq6ttDRNW0wAjc9U/W7333MvaE34j82qA8l2x1a+4uHNcgIQA9viitXnUEyPNTMhnsemhSH5mBKRPlGm3KNFwcEUBGtOhofJsPSsCvhmkgKMtQw06EUroIbHEdHes88rEKSB/z3/UXXGYS2UkVhuGitLdW2GxEhYnDRBlwotKkUV0JLjTgzAfF1M6UUpXGSRRgwLnQluMoUJRA7JmQWgQQnRBEsIdTNiyHFkrQQQimaV6SLIi1CNwVBRPE7d/KqoJ43M5mQh+Z7/7nnnHtz596xPx9kYVlbWxO+wSCLET84sjAqvl+z2Ub2u701/FPoNiCrvtXunLa9yiILUy5myhGXL80SXVhcc5O8KDp0mwcqoOMjVBPIOGwcDA6vCgX5TMFx4cqJ/Rvunx4pJgsePlbxLc9iGerH73vAId0+1+orT70o++OyUdbYLQAEkjXQONZgE8k4Gg1e+Lk1C3F6gG7ZxnfZH29bN23lkp3Wwersy7OzrKfpRkzDr808rVLALxHdCUGjsl9wzfACHMpxSFLgFLrMEYP84oTKAwOcEdfo+s8WGJBxYFRkY4+t/mDt73v7n7NJ/30PLLSD7vr07BXiifzU/zxDe78RLFKpaHRPLLr33cgAQ0R4v1vLypmVdpcdPOi0h50OlXPr56nFl2c3j43kTLJU1uZgo9HNhDSj6Sg4wui7hvMQjjCi4HgNenfJjFt5hDrzjuXfdA/hkEk1SUpM5gFdeteH/evLfrF4WLIplw8PL7ySd+l53uUJIzp5pGPLF9mieuwjgv1a6nRnJ5/njGLg/W0i5Rp0eyi41mj8uJbutDscdAtWJV4ky8umkQxlVBiZCTkMqzm/IA9GZ44H5iNaJqNE5Bj1ErgiXcZxndVHViWbKxwsoBoFz7/hgj0Mx6mgf74+J64HtrWd6OZypCaZEWoX7RKA+/v7J5f5M8gQj23uiR3fRaOA7Zzmo6l0ag1DNi7/5BtAN2hkbxuDVrvaRrtq+3KCMaCnnw5Flu3lTBAl48nyggYe7wJ//HpBLy0YdNI5kkBhCpH3GcdxtSPgoBvhqevdZQSH31I1jzN1aOKRseuNr7a2tpVtcdMrdHv1nOfFTM+M2T3gdndxzDa6qVQ3hvcBtwNXup9OD2hgI/tNHcotwRukDwgn2JftFzpnuOX1z0uLYbcJlrsci1TAAa7m67rhJAkp5L53Xdd1Ds3lyNfBmNho4IELbF+7jsY44yrKkegAU+fdNTDAgp0yH+EhrMl7S49ebm0AFcAhYb2AcrmSZ5u+F/NEut393f18lVipwuUYIRGAVLrfByydRrooYolugvUjXIrwx0Z2b29AkfKgCtzZWftidXIx7OTszcysGyk64fmwSySZq2glU1MBo8z+469nnK83GS11kmR7BiOSziK6ZTQn47qaZuj7j0yM071hRokMP8hNoCN/VmUaRpD3ZNbCOPNk700dDRMBW6JQSGxvFQr0Ueo9zxTlzPsl77645WUbNImWwP0m3x6s0+rpaR4JR0Z8CS6AS5Ygx+9Ff/8N5aqdIdpFHwnhYC6TEw28bJakkDnUD7VaiJHD8KKTWXRlrZ/XNdfd3HQd182IKyabZT+TzGibjuPIwuvWOMNjYADCSc+H60hGld2VfkKNoV18orq1DZXiKzAxu75u2z1RrsSKXvulEm2OmJJ/UQowAMfoyWQRKXWKVU93BAgSeDG028OEEHdFO0JKS+CGZ2cH04uuszjr6iUzgsslnVCtYpi2RpUCbLPM92fFmA/fcN1fuP0a1yT2Z5rLMVqlw8g3cKXYxdG9Cb65fH0iBohiq3CBp+D4g8nHMsE5PrmPcIkAj5teL0e89CzbFji/VEI5Uvk1u3eiG7UlyYypQ6gDnHhlKk0DywZ0QKbhRr8Dcni20Yiu3bLoVUfsvfhi+bhslMt6+Q0tHPLLh1ao4jGbGDYcDwiWqmONAOBEOW3TBe5rl6e3jnUHOssolexDmXMHFLowqZ4XHJQIqkKo6BXAqs/5C9NT91Y74peFQmFL8HK9nueZlmWUiZgCZ9HkyAZnT9ErkIBCoYVl0y2sD1wUAyc6skDAoDZr/HS7lwaONjfsTzNOpx/HzAV0SZKgtbLZdGpO0w9lJD/rMV1n61Ykcn8RNpxQO2ZDI6hj0PFOt+36xcTkEj8GgYZu0LwHnugkwyxA8YYPhXmCKbLAzY3nYaLJnRUkpHRLddPyfcfXfGtZv++VrF3gdk/aQodnkgqkyKKualEO5wNTbQ37DhPP5EYAqVMap8Pq6dkzhc7PtVB4XtpVSXdww8X5sG/2zAzJO9lsEh1dYO3XjV/Ags81MJ1Z3+WmPH6uE0t08m9ud2IaOL73xEglUVEBAsedcI8HssntVHzy5+HGNoZ44BErdd8/1GjBvuVXfG8/gKs+I3uSSoUiwyM/DjD8Ms+xs7OHXnDghoFROCPdQZRmd3vbAi5x019KbpYJehkebC1mZo+Lul8LXZh66On5WY0w2SSOFJc/jGyilYqLDCyyajB/2WbtAIxhxnqutTo1Pa1+zYNEjLT3H8YHqs1NTcWXHjvc2E4kRnz1ek+3tGXdN0p+0q9U/MouBlyH3ir7H4/9+qsMd5HH+sTLKi0OEbEGrS0qwo3yuOQ/ugyNL1v5nWriJn8v7hyz0ksm5DbfTc465ZiUl46mxoG0BdNm2119ATYcU2Ra/nhlZcEweVjtNUYYV2I2Ptk9P5lQs3qZ8Cq2JNEfzdQfAom0PN6PwJVXTi09sq8iCp65najb66Zu8a+mRUzgfPDQDbjrDlvsAadmM/z446Dfbw0GtywWBtjgYZA8UBcsCJhQD1qt07ffKgzvM3PGX1g2D4OaeKaix0zbCIXfCWn81uNQ9B1TeLnEER00fPA1O1YsmiZbP9v2+nqunssVzr1H7im4cUz4gFMGGWfAd6ecgovPTZycbyW2zwq0vK1eKWZqhmlahm74ScO4g8vfPCslyitjX355LvbllzxFCFlKKjFhSdNJuLOUKqyjAxZXfVC9fqszrKjui2EuRELzs64TmjqybNN2np4Pawu666Bd7I3Nr2lrsPFvgBOu13vrK7aNZqVSPdftJs6vH5ucujcNXIAWcATKyYFuvBWjtQmbwM3MvdlGOsnh3XqJLOTrpoQno+KYC5ZvwYZdslnws08QUK6uZHyo++1nPzWytDjQKMVSgBEzMVWnSJvDcaXPN2hdX78wtI8WyWCzM86hS4+6vLJg1Zb8clGbC89mdFOWTnk99kZEgghm8nhasQfdeo6UC5xdzCUS58WjWnxqErhAOqVQQAPaP0TjJIFjk7Kw89w40hWCFF4yDceJ6IZWMrSKoRNbDOCEr622qHtirHvF6NAH561BOnX6FnDUzoFOEvxHJjUYp6S8NJ25t4ZWbbb82vGCMxuPS+ebqF52ZMgu2dSSyU3WKNI2F14Hi8Znmqa93sMlbbZbh40gUMx1E9vto5l34rABh25gUJ7ctblVuTyMl0EmQDcMusfaxEsqL/EEw8lsRnyp+BzDM3zt0CeJg3fQeVY27BnLAffBRkcC5WkqjZHkMCHijN4VKJRgUlm3yN9nDxg3rhg81VNOhvHPcNyzYzEjBOe7r+tkMCINoklPxFxZKa7Uccn6a6adWzfxSKl1t7fzn4fnZ1hx4WGbU3DKQPynBbEE3ViSOw5dfOn+uSRwQmXsJS2T9J0k7TqplTyS+aHleQgHnOzU9gRwDH0NJQtQO/fT0Z2DnZ1USriwHSwa9IKieyfkvnSVzs6LrdAvRc03eFK8GQ6Vl7VazV3oLTv00pIRU1/W9ZeO2bUHGnwnR6dkPQcdb2huPSr5XPf8cjrOCtuTAZzKZncw/04EyicnpzAR716l3AUuUciZppZxreSio/nAGZZlecCJZ5601Vb3Yx9cXW0Mq8iGKlVYxDHxzD0YD+iX0/zwUYYn9rIDklyrNWQY3at88ufVa4e+vhKZDbvFuumEkkZzkS4aKVU36b7qoMXquQJQopTI1cUnSQBSGD74fDosu2bMSZtbUo3uf+H4SLFhwhaP146sbkHlOBNHjNAF4Sm5pIbHeJ6v4LDrV59kJyngNob9VJ/SC8eELYXzpSQB7JABlGRw7qVvIesDfTpsV/uWE8nJLCJL/ts1i+f9I0m6aZTLpmHR+Vixifq0rq1uVwX9XBe1FCRsW+f51SkehpzBx+aAU8rB9Oj/sE0I3B3bzExt6ahIuKzzv7B8elM1Rpoww/I1qjDrQuD2SQbsJTX26VfDByk6qdGdvHQJpNGhH3C8oS7ZOQFx0CCpp6p9rE1h2aJWtLpfXV3Z2vHHx0bFX64XN2HLOJEYaGbxNRsSdCPdciYSxO1CjvtCorB9/mD/sekwcOzTIo1uFC2DAnkEd6fjKMFheKVCmwk77AqOU/bMslHRPKouLZIJVSrJSkW7kDkNxBPgXpUNnsc+3SB743pMuEj3IVPZAN1QjdAiaI1bGUDqpzhhuzkbtizKYK/4Wq7olT7+86tzw194aXPRbRqOr6vFdkFDLUWGFyY4cCRhRLbo6sTc02I45hxsSDcudkckt6vqRsGN2AQujtThTMS4v3uOciXD94kiIcvTHcb4gKv4vqX5KtF1ZLNO4HisIE3mzqcxVMtzC5pkOSlN6MVlJbbgs1V+KgauMzy0Pu7mTFqVrVulDzY2vjp+d5NS+ZgY6Rt2cbmUyymo4MKJ5aCjtXVOVifjkLGBCxemCUOnlFtVfvmPXB6QPVQu8EoyQaa58PrFo31qL50G7lmVGk0t6ZMHgAOPF+CqN8/JroljxVYrfbpDSwsccpTFUfKLg5N8/7YhZHuwpvJ5RoaAe2b7sLixvXFcUjnaMpnE9+eHETraspyp7ekmfpnDAYHBHpbwKpBs97+fVrIBNjLEU3R3LQxGsbs+AXCwPYQLN1k01Jn+/DxRLxO+tMrRvudZnxNHKhXL+hw6CrDKbvUbta362Hmf/hsBkiMqZHnQ8FLxzM55i6JEYgu+GoW/jd28euP9sbW9kWM8xlu++njFXv/00/eXy9K5MWOI6ZVMuwAQ54gNRmHdGl4excNCNh/whYkpSrpRgaIgueOGV2Wg3cFNAec2df3d0ORSL1cv6RG/UquRACr+hed/7nNWLHSjyXXYVxC8sSEg0XQ0eiebQsOqw+1hHjYSwg54aenuVXlE62bo/bm1/RU5i0oq99XVx6asIXL85x9FnZS9Yhusvl4YIWHcBioOr4+m/urq7ELaOsM4Hm2tloF6NwYyvNjcTa+sWdluxmCdbqxraMfOjSUo0s5kkGTMDbyUDcK0CxlOXaYXMh2GNbTMichQUzEsjRZC1ostCcOLIkpHWRAGY072e573zTnrnnycE1vFn//n4/0675FbSrh06pgWzvZLrWD6JY7WYDNwrR0b3ERgNX323YnUzuzb/aTJBW4zmh+em12YGaanOjw3MZPP7289lttv45aLwoUssAkcoHTpON3il9qKXJSsCR81gELxgLZX+fFW7MRxCjuzySBt12TiYLf/hTdfTH3Cord/+nqTMl6TlFSiTEJm3DO12dIKGkjGTKEDztQCawqndD3KpeqZkBM4mneX5sdlE7A9/rJvT49ME3ioN7eU32T12TIeChztZm7bxo0gff6S5MGIigUVWZEDsvFrbRf9sAlwmC9S6PHO7ccDxTJL3Bh5coI3QOlPxejRxOTzyUFvL5WNEhh06XiDzKnudQTcUNODQVM2i2ECzcv+EnJqWgiwVryS7YjTNGjPvpaLUcPHV3HNhfQSTMNzm/LK52fyi69iSPeMr1QKT/mVbQ3l4GR478G2I13CwzBs8NEcU8ekN5stbw+EHYSjQgNXiDFCP8szmPgk1l9I7sSkXjsZxxlwRYOtnFsCTWgAM1wYbBbOiGfYrHTydTdbWr9s7YTtzWuQBjpOb6ZeoLVMJy40vTCxPJNfXuI1DNvMRNnA4ZYRP6kQNOD8oCEUy2f47QdYJoSQD9aIOU0v0vwk4p5xUhnGeneSyBcMMvoEzuxcUhwV9fhAKyToZAY0iShaIcfUnagmXCqfcmEB4Ig5TOhs8reyGYP1jJJpuhx57/Llt8Y5CZxv69nLXaKGD4cu0eBiImtiOT+zuZxPL2xu4ZXf45jA+TXvK1sEAXE/0BCOiJtUySTbaJ65PsmA5ePHA7snGbwSeTKkTFJK0CnQ/yw4N2iVFPjWAr01ht8wRYuFAqpW/U3plE2EE7ieHjfs1At7lE3fYFU4reKdj9ibcjVN+7K1q+1mevxy/+wc5XuYKrCUXyKXkFIWFmYoWYuLi5IgfFNSxkBbmyKvGLQgVggOTE4VI8KGrn6tc8VKubxdXtzNZAo7Sf5XBjfs5Tjg9O7M7pBFMAfDJY1ujCzuLahomJDVg02pzC/d0+IOfrmZ3zX9CL7JKKHVa5c2RtoDQ/xIJj07R3Kx3AKlIM/03GvDlPHLw5ub+auYWRWx7/OHDZsIiN+BVigEg0TM1hRYkidB433tejErnblyMZFhZSL8BB4COpwEezljfcqAI8lDfVKe5fnhdCtpvxMo14xTgqUmB5tOrG7e13kTs2jAjXCj80cmI8l9Rc69H2JgYW9uLr/J4NS1exuDgyMzTNZak1VSqhvaSHE7LDsZ2GS4c2B7EqD7UOmQSpisQ8uSqblqjv4A7kdcQRQk8og24JLSlFTVglrcyrHhdDtoXdCIWAaNI2iweapoPqmX7J70u7CocVRA4VW4jm82rq1OSynnx2Js9RBIb+bm33u0PjbGNX7xWvy4UZbAMbZkJpuBuw4W4vgfbBVIFQKGpwW3wlK/kRNZtRJmSwJXre6R6ZP8vwwZhG/AR4FMBuH6SmTTWKOhNXP2P4nRYuknsohB42V103fYvEaywOmL/6twGnIbGxudeoes57ueDgS4k9SVD37anB4bi8fHxu7Fo7X4+odmVUCDpSNb8LhI/i87B6OgMb5BrixH6O5M+u/6Mf6Vbo800BbL1XKOPCLCOb3foZvj3NhhLCujZ2CZdtbeRNqtaoQ/dG6GbA+Y5qSlw3jD6jVbdQNOgVy35JzvT4dC7ZJOWrnXIJBdz10598qHbfF4NDq48d46cOe7mxsAQz6MBWTSKV2jC7BYzZwkRok4Qs4ZDW4Xw1OTds5AplWPPuOkuFitlFOUaAm05Heim/MVsmUsm9hAMCX+aNnccg2TljXoXOEwF0wPsNncWDePje+D9azAtWtOopQ///WVV061RaPx+CARF43W2robZe0f9UPHsX2STEiFi4WDg4NEwsAFGTGKXMcntU6ESwwQXSTxRB5sVbeBK4hwo7DhnIwjBAHjlMmJAv21rU1B85J/uwWz2R9RrHBWPMMmLunBeWg28FRyeXUGtDv+dEDgnh66cu71hhDCAXcnGo0edxJu3OS17cKF49rXXx/7NKIi2erJCWwHDmAFVksVHvivh0symMJY5d2LR59NhSmDk5XK9nYukxwQpyxkglrMBQxKsiNq5hZOt3uaBereqOlRQolzKxUcrvHBO9jkKKZg3ndq7BKyHJBP7g92obPxVIe65b3B9Wj8+Gx3c3fL+Vrt62drtZdrNZ8IVMQlT04SwCVGg6NYcBsnZBCWSeTS0cW7pRIzeFPF7CRr2raAA+arpOiWJJHgmyeOTFFXtx7mW0Q029AyqqlcblbHXB5Q5GHN9HM0Dv8vng3Ddv1bCaccBXXoQrqhqSMKHcpxGDnT3dxyXANOnsCt+Q0aw5c4Jl4pcGUa06USA+q6IIweK6SRCkvSS4tbe4mCQ6HLSNIkkWAOp6mHE/tPkSAxr2FswgwTJq/1ryBqVi63T0A6Ee0geaIcWL8kMxnPDrTyTooZusLSv3QtCty3wEU7GrvPw+aaDzbIiLfejxCuUPhY4LJ4pCzQKDHnw4jeXT++WckWbzH6t1WM9R0k+hIAgabX9xRSueV8voUhLcWCT8hcNiOXNzRZR+GzC2aPKKdwyqB66Zs1fqC+mROCbuj9noZTZ4/xyjt3bt+OH/eIjwJ1XIvWomPRqE+DzexWxiZKgEGXzJYAg07W6bGgD+f0RyrFyhGLfyvlytzb87G+Ewd3zNBOTg0v9DwVGOqyaDZPSnxIpJlmv6J4VkdrdMlcVb0RWMVRyHbPAgHvJMDibxokLbfj0dvsjDE41tH8eg226HqUok5+WfcRa2y/k0q9lFATttFYpQRWSeAq1Uw1i09OsWZb4bJZ8PxzuVhqd35vaWEmHejiTmOgWbhOC4cXCZzL9v/FCXx0kU0mgVFOjB9iqo95aRr5r4lurUPPtTRd9b32iJi7d+/nsVB3cygeh2wQtPXj41qcWZ6+3d2UwB1guiY4WDmCDbTPjr6UJkuFBQBF2HDMLEfaz5GZ8WEGmtIdbc+fuwIcYF608bIF23ikRYBNH03QeSYCAueaHVWQ9A9Si5JZHHNAM861qHfdPH21+cPudDR+h+0jOk41p9fjY+wBEj0+RjfofH1ClmLfJOAQTqxwtAIdqxGPqqAx+s3oHmTsBQNaBMry9pLM6p/HAIOqS4BMsGFa17yemiXzTCfgeBhKS+XRqXQQivQKpz9OzWqJCfu5m6caflr5852RwZ8/XyVvPrXO5ibUclRbh46E8lLqxRdiL/UlEh5c9YjVzCwWUjaZJqGzziSBU5Z8uRauVKrJyyFZftfVdb7LChZwhw/qfWxN6i7bE4vyzGc+mK63UdCQ8fTGFUx0oZbSGEMzm1kC3MyyofvXT386M7Kxmm9qzl9iS5PBwfX1uOgmOdTXh2js8mucchRGgWPtIau8MrBR9pxqNuw/KtEbkrhj4RxwuRALRTHQhqxHIp9bAOz0jWZJQIRF8fQ2+0qnrBzraJiyGbgWFw7ZLBRPe8JR4G6+/8cvDVfvs7lN6K2lhu70KpuZ3Bkci0fjWBRbB44tOftGLdxoAsBbf2oqySgaz0w2HDkqlYNQZo/2P3aqmcR8CNnEOruUygCKEfvtITeNuHkEcy94c90TOM9cv6wnFCNc/Y+lUKDpKXCtF95/5W7l8P7y1e6m6Tfzp1khwrTB7WsbG2OD66TO2yOhM75UjGSCdAdqAhcEbqVUrBrdCkiXpb9ToauHY5bmRhMZ52A3beFgg87mfzWZJHxiGLnujN51mHDpQ+Hqi6KMX2q2fFfd0s38oJhy59U9+jvP3Wxs3p9NzbBL3ep0+vLGeF6Gc/PpNNdk0H1oOfNFt+9F4EzIYdoAq/5G4a6qjhhNFqdSYuH2AEo61UiSq0eSicRCZ5sLB5fXdRM4YXPnNhRNfNFdRm+X2xu39OZ0rG5YfbqqXrS9im5CDufouvDDO76m7v3Z/av3/56/dO3N8Ua9XEtdvpk/XPcvK/s+2Ze/9xPgPkE14EZHfzxaueVQ2SUCLdwRcDccxpkz5QKbHn+XPMi1emhYp2Ezf2g7ivxklrRwVjm7JtYgWf1sEdcyEOj0eoDCZk1PtRx0Pf/DSnifu8JyPfeXuy/0L5zWtfgYPx5KrtqOhH1sn/fGG3bfSiIPx6z+dSujqRMTPOD+XLkVvMHYCL3Tj7jGove7j1MBZXPpFE6txaBhFs27HMk+1CstnDUzRWDhTLz9N43YTnk9zwB384PXf3p4+PDw8P7+zO+x/uUmWf/ccPqpRr1L291PZXzo8F9OuqPl4J6gLAAAAABJRU5ErkJggg==',
	     'data:image/png;base64,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',
	     'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANwAAADcCAMAAAAshD+zAAADAFBMVEX/8JP404z/+MT53JL/03z/8JD/+ML/7pP/8JX/7pb20or21Yz/037////98JT975L41Ir41If/0n388pL604n81X3/+b//8Jj/8pL71ID/+Mf/03j77ML97pb+6L/43o/75bX/1Hr33pJkKwP83JL+1Xr/0XtgKgL/7Zv904L98pb62pH/8pD96Lv8+sH+65X87cH53JT87o/884/71IT7sHj/8KD13JH304f9+sX5149jLwJcKQH/+br604z/8pX71Xv98Zn22Y/41I368Zf/2pL/97b/8Zz/04H/1YP57sD21of76r778aH70nv75br+9K/+6Lb/+LD/1XX986T444//65BmMAf66ZL575JgLgL/rnn7/v7+9qz/8qj95LL/8ov61Y351YT+68L/97z/9bT675v+4aP23oz90oZcLwH/741oKQT95pD14I//2o/++rb+14j3snr5137625n79JL78p3+6JX50Yr8sXz/+sL++7v+6a/786nz1Y3304L834X82Zb32Jb//vz5577+4J39/fX+88P/1X791o1WLgD94an325z+7L7/8pj+24v31Hr7+sn49Y356o348Iz/6Iz61Yf+4q7+9qf+25363pX+9JL+5Ij77sX/9Zv44pT3sHX/3Zf/9KD67bj+7Lb7z3ZnNQVfNwL45Kf+6JtUKAL845Xz1JX62YmHXB/33qH/9Zb11nzxs3T92oL43IDz3ppwSQ7/5qr53pL90JD94I/z0IeDURn25Yl5URb/+7/WwW2gbTD98bz1xnz/+Mv9zYPgwXmogUF2QhD2/f1tLAe3iknRtmv+66T++uzj0nnsuHOjhmaVZCb+7cr4zH+7lE9tOwjv2H9WLhJmQQr90WX2woX+13zgsW/GrF/1u3vmy4TNqWmqeDqMZy3x4oaTdC28nlWaeDfr14ftwXbVoGLm1r7dyqjHmVq+q1V+W0CtlHZpRymqjUGCZx7s0Y/57+GumkabhTLw2afCrZLSpE7r4NPQup6Sdl24ooftwGAq/oniAABIZElEQVR42rSYT0gjZxjGPyxjZgrOdxhwgjCX5jBDCA5MYERmZEgJ5iRISDvJoCGUXVvGtHjRBcVTIIccUtaksDSQggeDKZVcmkPb1UBh29o0dqHb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',
	     'data:image/png;base64,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',
	     'data:image/png;base64,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',
	     'data:image/png;base64,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',
	     'data:image/png;base64,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'];
	     return imgStream[i];
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
	        var host=location.host.split('.')[0],
	            sh={
	                'dev':'http://staticdev.91yaowang.com',
	                'app':'http://statictest.91yaowang.com',
	                'wz':'http://file.91yaowang.com',
	                'apa':'http://file.91yaowang.com'
	            };
	        return sh[host]||'http://statictest.91yaowang.com';
	    },
	    shareDefault:function(){
	        jsb.setShareInfo({
	            title : '万元恋爱基金大作战',
	            desc : '现在来摇旺晒幸福，赢取万元恋爱基金',
	            link : location.origin+'/events/valentinesDay/index.html',
	            icon : $.getStaticOrgin()+'/yaowang/dist/globalImg/headImg.jpg'
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
	            maxFileSize: 500 * 1024,
	            format: 'image',
	            isCompress: true,
	            maxX:500,  //压缩后的图片最大宽度
	            maxY:500,  //压缩后的图片最大高度
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
	                // if (file.size > opt.maxFileSize) {
	                //     console.log('您上传的' + file.name + ',图片尺寸过大，最大限制为500K');
	                //     $.toast('您上传的文件尺寸过大，最大限制为500K');
	                //     return false;
	                // }
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
	            // alert('name: '+file.name+';size: '+file.size+';type: '+file.type);
	            // alert('Base64 length ==== ' + this.result.length);
	            // alert('Base64 100 ==== ' + this.result.substr(0,100));
	            // alert(this.result)
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
	            var exif,imgRotation=0;

	            img.onload = function () {

	                var orientation = exif ? exif.Orientation : 1;
	                // 判断拍照设备持有方向调整照片角度
	                switch(orientation) {
	                    case 3:
	                        imgRotation = 180;
	                        break;
	                    case 6:
	                        imgRotation = 90;
	                        break;
	                    case 8:
	                        imgRotation = 270;
	                        break;
	                }
	                // alert(img.naturalWidth+','+ img.naturalHeight)
	                if (opt.isCompress) {
	                    if (opt.clipSquare) {
	                        var min = Math.min(img.naturalWidth, img.naturalHeight,opt.maxX,opt.maxY);
	                        _canvas.width = min;
	                        _canvas.height = min;
	                    } else {
	                        _canvas.width = Math.min(img.naturalWidth,opt.maxX);
	                        _canvas.height = Math.min(img.naturalHeight,opt.maxY);
	                    }

	                    var context = _canvas.getContext('2d');
	                    context.drawImage(img, 0, 0,_canvas.width,_canvas.height);
	                    ajaxUploadFile(_canvas.toDataURL('image/jpeg', opt.compressNum),imgRotation);
	                } else {
	                    ajaxUploadFile(file,imgRotation);
	                }
	            };

	            // 转换二进制数据
	            var binaryData = new BinaryFile(atob(file.replace(/^.*?,/,'')));

	            // 获取exif信息
	            exif = EXIF.readFromBinaryFile(binaryData);

	            img.src = file;
	        }
	    }

	    function BinaryFile(strData, iDataOffset, iDataLength) {
	        var data = strData;
	        var dataOffset = iDataOffset || 0;
	        var dataLength = 0;

	        this.getRawData = function () {
	            return data;
	        }

	        if (typeof strData == "string") {
	            dataLength = iDataLength || data.length;

	            this.getByteAt = function (iOffset) {
	                return data.charCodeAt(iOffset + dataOffset) & 0xFF;
	            }

	            this.getBytesAt = function (iOffset, iLength) {
	                var aBytes = [];

	                for (var i = 0; i < iLength; i++) {
	                    aBytes[i] = data.charCodeAt((iOffset + i) + dataOffset) & 0xFF
	                }
	                ;

	                return aBytes;
	            }
	        } else if (typeof strData == "unknown") {
	            dataLength = iDataLength || IEBinary_getLength(data);

	            this.getByteAt = function (iOffset) {
	                return IEBinary_getByteAt(data, iOffset + dataOffset);
	            }

	            this.getBytesAt = function (iOffset, iLength) {
	                return new VBArray(IEBinary_getBytesAt(data, iOffset + dataOffset, iLength)).toArray();
	            }
	        }

	        this.getLength = function () {
	            return dataLength;
	        }

	        this.getSByteAt = function (iOffset) {
	            var iByte = this.getByteAt(iOffset);
	            if (iByte > 127)
	                return iByte - 256;
	            else
	                return iByte;
	        }

	        this.getShortAt = function (iOffset, bBigEndian) {
	            var iShort = bBigEndian ?
	            (this.getByteAt(iOffset) << 8) + this.getByteAt(iOffset + 1)
	                : (this.getByteAt(iOffset + 1) << 8) + this.getByteAt(iOffset)
	            if (iShort < 0) iShort += 65536;
	            return iShort;
	        }
	        this.getSShortAt = function (iOffset, bBigEndian) {
	            var iUShort = this.getShortAt(iOffset, bBigEndian);
	            if (iUShort > 32767)
	                return iUShort - 65536;
	            else
	                return iUShort;
	        }
	        this.getLongAt = function (iOffset, bBigEndian) {
	            var iByte1 = this.getByteAt(iOffset),
	                iByte2 = this.getByteAt(iOffset + 1),
	                iByte3 = this.getByteAt(iOffset + 2),
	                iByte4 = this.getByteAt(iOffset + 3);

	            var iLong = bBigEndian ?
	            (((((iByte1 << 8) + iByte2) << 8) + iByte3) << 8) + iByte4
	                : (((((iByte4 << 8) + iByte3) << 8) + iByte2) << 8) + iByte1;
	            if (iLong < 0) iLong += 4294967296;
	            return iLong;
	        }
	        this.getSLongAt = function (iOffset, bBigEndian) {
	            var iULong = this.getLongAt(iOffset, bBigEndian);
	            if (iULong > 2147483647)
	                return iULong - 4294967296;
	            else
	                return iULong;
	        }

	        this.getStringAt = function (iOffset, iLength) {
	            var aStr = [];

	            var aBytes = this.getBytesAt(iOffset, iLength);
	            for (var j = 0; j < iLength; j++) {
	                aStr[j] = String.fromCharCode(aBytes[j]);
	            }
	            return aStr.join("");
	        }

	        this.getCharAt = function (iOffset) {
	            return String.fromCharCode(this.getByteAt(iOffset));
	        }
	        this.toBase64 = function () {
	            return window.btoa(data);
	        }
	        this.fromBase64 = function (strBase64) {
	            data = window.atob(strBase64);
	        }
	    };

	    function ajaxUploadFile(file,imgRotation) {
	        // alert(imgRotation)
	        if(file.length>opt.maxFileSize){
	            console.log('您上传的' + file.name + ',图片尺寸过大，最大限制为500K');
	            $.toast('您上传的文件尺寸过大，最大限制为500K');
	            return false;
	        }

	        $(opt.loading).show();
	        opt.showThumbnail && opt.showThumbnail(file,imgRotation);

	        $.sync({
	            url: opt.url,
	            type:'post',
	            data: {
	                file: file,
	                uploadFlag:opt.bindUser,
	                imgRotation:imgRotation
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
	                icon = options.icon || $.getStaticOrgin()+'/yaowang/dist/globalImg/headImg.jpg',
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
	                wx.onMenuShareAppMessage(cfg);
	                wx.onMenuShareTimeline(cfg);
	                wx.onMenuShareQQ(cfg);
	                wx.onMenuShareWeibo(cfg);
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
	                    var $iframe = $('<iframe src="https://file.91yaowang.com/yaowang/dist/source/mall/images/9e3e8cf0.png" style="border: 0;outline: 0"></iframe>');
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
/***/ function(module, exports) {

	/*
	 * Javascript EXIF Reader 0.1.4
	 * Copyright (c) 2008 Jacob Seidelin, cupboy@gmail.com, http://blog.nihilogic.dk/
	 * Licensed under the MPL License [http://www.nihilogic.dk/licenses/mpl-license.txt]
	 */


	window.EXIF = {};

	(function() {

	    var bDebug = false;

	    EXIF.Tags = {

	        // version tags
	        0x9000 : "ExifVersion",			// EXIF version
	        0xA000 : "FlashpixVersion",		// Flashpix format version

	        // colorspace tags
	        0xA001 : "ColorSpace",			// Color space information tag

	        // image configuration
	        0xA002 : "PixelXDimension",		// Valid width of meaningful image
	        0xA003 : "PixelYDimension",		// Valid height of meaningful image
	        0x9101 : "ComponentsConfiguration",	// Information about channels
	        0x9102 : "CompressedBitsPerPixel",	// Compressed bits per pixel

	        // user information
	        0x927C : "MakerNote",			// Any desired information written by the manufacturer
	        0x9286 : "UserComment",			// Comments by user

	        // related file
	        0xA004 : "RelatedSoundFile",		// Name of related sound file

	        // date and time
	        0x9003 : "DateTimeOriginal",		// Date and time when the original image was generated
	        0x9004 : "DateTimeDigitized",		// Date and time when the image was stored digitally
	        0x9290 : "SubsecTime",			// Fractions of seconds for DateTime
	        0x9291 : "SubsecTimeOriginal",		// Fractions of seconds for DateTimeOriginal
	        0x9292 : "SubsecTimeDigitized",		// Fractions of seconds for DateTimeDigitized

	        // picture-taking conditions
	        0x829A : "ExposureTime",		// Exposure time (in seconds)
	        0x829D : "FNumber",			// F number
	        0x8822 : "ExposureProgram",		// Exposure program
	        0x8824 : "SpectralSensitivity",		// Spectral sensitivity
	        0x8827 : "ISOSpeedRatings",		// ISO speed rating
	        0x8828 : "OECF",			// Optoelectric conversion factor
	        0x9201 : "ShutterSpeedValue",		// Shutter speed
	        0x9202 : "ApertureValue",		// Lens aperture
	        0x9203 : "BrightnessValue",		// Value of brightness
	        0x9204 : "ExposureBias",		// Exposure bias
	        0x9205 : "MaxApertureValue",		// Smallest F number of lens
	        0x9206 : "SubjectDistance",		// Distance to subject in meters
	        0x9207 : "MeteringMode", 		// Metering mode
	        0x9208 : "LightSource",			// Kind of light source
	        0x9209 : "Flash",			// Flash status
	        0x9214 : "SubjectArea",			// Location and area of main subject
	        0x920A : "FocalLength",			// Focal length of the lens in mm
	        0xA20B : "FlashEnergy",			// Strobe energy in BCPS
	        0xA20C : "SpatialFrequencyResponse",	//
	        0xA20E : "FocalPlaneXResolution", 	// Number of pixels in width direction per FocalPlaneResolutionUnit
	        0xA20F : "FocalPlaneYResolution", 	// Number of pixels in height direction per FocalPlaneResolutionUnit
	        0xA210 : "FocalPlaneResolutionUnit", 	// Unit for measuring FocalPlaneXResolution and FocalPlaneYResolution
	        0xA214 : "SubjectLocation",		// Location of subject in image
	        0xA215 : "ExposureIndex",		// Exposure index selected on camera
	        0xA217 : "SensingMethod", 		// Image sensor type
	        0xA300 : "FileSource", 			// Image source (3 == DSC)
	        0xA301 : "SceneType", 			// Scene type (1 == directly photographed)
	        0xA302 : "CFAPattern",			// Color filter array geometric pattern
	        0xA401 : "CustomRendered",		// Special processing
	        0xA402 : "ExposureMode",		// Exposure mode
	        0xA403 : "WhiteBalance",		// 1 = auto white balance, 2 = manual
	        0xA404 : "DigitalZoomRation",		// Digital zoom ratio
	        0xA405 : "FocalLengthIn35mmFilm",	// Equivalent foacl length assuming 35mm film camera (in mm)
	        0xA406 : "SceneCaptureType",		// Type of scene
	        0xA407 : "GainControl",			// Degree of overall image gain adjustment
	        0xA408 : "Contrast",			// Direction of contrast processing applied by camera
	        0xA409 : "Saturation", 			// Direction of saturation processing applied by camera
	        0xA40A : "Sharpness",			// Direction of sharpness processing applied by camera
	        0xA40B : "DeviceSettingDescription",	//
	        0xA40C : "SubjectDistanceRange",	// Distance to subject

	        // other tags
	        0xA005 : "InteroperabilityIFDPointer",
	        0xA420 : "ImageUniqueID"		// Identifier assigned uniquely to each image
	    };

	    EXIF.TiffTags = {
	        0x0100 : "ImageWidth",
	        0x0101 : "ImageHeight",
	        0x8769 : "ExifIFDPointer",
	        0x8825 : "GPSInfoIFDPointer",
	        0xA005 : "InteroperabilityIFDPointer",
	        0x0102 : "BitsPerSample",
	        0x0103 : "Compression",
	        0x0106 : "PhotometricInterpretation",
	        0x0112 : "Orientation",
	        0x0115 : "SamplesPerPixel",
	        0x011C : "PlanarConfiguration",
	        0x0212 : "YCbCrSubSampling",
	        0x0213 : "YCbCrPositioning",
	        0x011A : "XResolution",
	        0x011B : "YResolution",
	        0x0128 : "ResolutionUnit",
	        0x0111 : "StripOffsets",
	        0x0116 : "RowsPerStrip",
	        0x0117 : "StripByteCounts",
	        0x0201 : "JPEGInterchangeFormat",
	        0x0202 : "JPEGInterchangeFormatLength",
	        0x012D : "TransferFunction",
	        0x013E : "WhitePoint",
	        0x013F : "PrimaryChromaticities",
	        0x0211 : "YCbCrCoefficients",
	        0x0214 : "ReferenceBlackWhite",
	        0x0132 : "DateTime",
	        0x010E : "ImageDescription",
	        0x010F : "Make",
	        0x0110 : "Model",
	        0x0131 : "Software",
	        0x013B : "Artist",
	        0x8298 : "Copyright"
	    }

	    EXIF.GPSTags = {
	        0x0000 : "GPSVersionID",
	        0x0001 : "GPSLatitudeRef",
	        0x0002 : "GPSLatitude",
	        0x0003 : "GPSLongitudeRef",
	        0x0004 : "GPSLongitude",
	        0x0005 : "GPSAltitudeRef",
	        0x0006 : "GPSAltitude",
	        0x0007 : "GPSTimeStamp",
	        0x0008 : "GPSSatellites",
	        0x0009 : "GPSStatus",
	        0x000A : "GPSMeasureMode",
	        0x000B : "GPSDOP",
	        0x000C : "GPSSpeedRef",
	        0x000D : "GPSSpeed",
	        0x000E : "GPSTrackRef",
	        0x000F : "GPSTrack",
	        0x0010 : "GPSImgDirectionRef",
	        0x0011 : "GPSImgDirection",
	        0x0012 : "GPSMapDatum",
	        0x0013 : "GPSDestLatitudeRef",
	        0x0014 : "GPSDestLatitude",
	        0x0015 : "GPSDestLongitudeRef",
	        0x0016 : "GPSDestLongitude",
	        0x0017 : "GPSDestBearingRef",
	        0x0018 : "GPSDestBearing",
	        0x0019 : "GPSDestDistanceRef",
	        0x001A : "GPSDestDistance",
	        0x001B : "GPSProcessingMethod",
	        0x001C : "GPSAreaInformation",
	        0x001D : "GPSDateStamp",
	        0x001E : "GPSDifferential"
	    }

	    EXIF.StringValues = {
	        ExposureProgram : {
	            0 : "Not defined",
	            1 : "Manual",
	            2 : "Normal program",
	            3 : "Aperture priority",
	            4 : "Shutter priority",
	            5 : "Creative program",
	            6 : "Action program",
	            7 : "Portrait mode",
	            8 : "Landscape mode"
	        },
	        MeteringMode : {
	            0 : "Unknown",
	            1 : "Average",
	            2 : "CenterWeightedAverage",
	            3 : "Spot",
	            4 : "MultiSpot",
	            5 : "Pattern",
	            6 : "Partial",
	            255 : "Other"
	        },
	        LightSource : {
	            0 : "Unknown",
	            1 : "Daylight",
	            2 : "Fluorescent",
	            3 : "Tungsten (incandescent light)",
	            4 : "Flash",
	            9 : "Fine weather",
	            10 : "Cloudy weather",
	            11 : "Shade",
	            12 : "Daylight fluorescent (D 5700 - 7100K)",
	            13 : "Day white fluorescent (N 4600 - 5400K)",
	            14 : "Cool white fluorescent (W 3900 - 4500K)",
	            15 : "White fluorescent (WW 3200 - 3700K)",
	            17 : "Standard light A",
	            18 : "Standard light B",
	            19 : "Standard light C",
	            20 : "D55",
	            21 : "D65",
	            22 : "D75",
	            23 : "D50",
	            24 : "ISO studio tungsten",
	            255 : "Other"
	        },
	        Flash : {
	            0x0000 : "Flash did not fire",
	            0x0001 : "Flash fired",
	            0x0005 : "Strobe return light not detected",
	            0x0007 : "Strobe return light detected",
	            0x0009 : "Flash fired, compulsory flash mode",
	            0x000D : "Flash fired, compulsory flash mode, return light not detected",
	            0x000F : "Flash fired, compulsory flash mode, return light detected",
	            0x0010 : "Flash did not fire, compulsory flash mode",
	            0x0018 : "Flash did not fire, auto mode",
	            0x0019 : "Flash fired, auto mode",
	            0x001D : "Flash fired, auto mode, return light not detected",
	            0x001F : "Flash fired, auto mode, return light detected",
	            0x0020 : "No flash function",
	            0x0041 : "Flash fired, red-eye reduction mode",
	            0x0045 : "Flash fired, red-eye reduction mode, return light not detected",
	            0x0047 : "Flash fired, red-eye reduction mode, return light detected",
	            0x0049 : "Flash fired, compulsory flash mode, red-eye reduction mode",
	            0x004D : "Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected",
	            0x004F : "Flash fired, compulsory flash mode, red-eye reduction mode, return light detected",
	            0x0059 : "Flash fired, auto mode, red-eye reduction mode",
	            0x005D : "Flash fired, auto mode, return light not detected, red-eye reduction mode",
	            0x005F : "Flash fired, auto mode, return light detected, red-eye reduction mode"
	        },
	        SensingMethod : {
	            1 : "Not defined",
	            2 : "One-chip color area sensor",
	            3 : "Two-chip color area sensor",
	            4 : "Three-chip color area sensor",
	            5 : "Color sequential area sensor",
	            7 : "Trilinear sensor",
	            8 : "Color sequential linear sensor"
	        },
	        SceneCaptureType : {
	            0 : "Standard",
	            1 : "Landscape",
	            2 : "Portrait",
	            3 : "Night scene"
	        },
	        SceneType : {
	            1 : "Directly photographed"
	        },
	        CustomRendered : {
	            0 : "Normal process",
	            1 : "Custom process"
	        },
	        WhiteBalance : {
	            0 : "Auto white balance",
	            1 : "Manual white balance"
	        },
	        GainControl : {
	            0 : "None",
	            1 : "Low gain up",
	            2 : "High gain up",
	            3 : "Low gain down",
	            4 : "High gain down"
	        },
	        Contrast : {
	            0 : "Normal",
	            1 : "Soft",
	            2 : "Hard"
	        },
	        Saturation : {
	            0 : "Normal",
	            1 : "Low saturation",
	            2 : "High saturation"
	        },
	        Sharpness : {
	            0 : "Normal",
	            1 : "Soft",
	            2 : "Hard"
	        },
	        SubjectDistanceRange : {
	            0 : "Unknown",
	            1 : "Macro",
	            2 : "Close view",
	            3 : "Distant view"
	        },
	        FileSource : {
	            3 : "DSC"
	        },

	        Components : {
	            0 : "",
	            1 : "Y",
	            2 : "Cb",
	            3 : "Cr",
	            4 : "R",
	            5 : "G",
	            6 : "B"
	        }
	    }

	    function addEvent(oElement, strEvent, fncHandler)
	    {
	        if (oElement.addEventListener) {
	            oElement.addEventListener(strEvent, fncHandler, false);
	        } else if (oElement.attachEvent) {
	            oElement.attachEvent("on" + strEvent, fncHandler);
	        }
	    }


	    function imageHasData(oImg)
	    {
	        return !!(oImg.exifdata);
	    }

	    function getImageData(oImg, fncCallback)
	    {
	        BinaryAjax(
	            oImg.src,
	            function(oHTTP) {
	                var oEXIF = findEXIFinJPEG(oHTTP.binaryResponse);
	                oImg.exifdata = oEXIF || {};
	                if (fncCallback) fncCallback();
	            }
	        )
	    }

	    function findEXIFinJPEG(oFile) {
	        var aMarkers = [];

	        if (oFile.getByteAt(0) != 0xFF || oFile.getByteAt(1) != 0xD8) {
	            return false; // not a valid jpeg
	        }

	        var iOffset = 2;
	        var iLength = oFile.getLength();
	        while (iOffset < iLength) {
	            if (oFile.getByteAt(iOffset) != 0xFF) {
	                if (bDebug) console.log("Not a valid marker at offset " + iOffset + ", found: " + oFile.getByteAt(iOffset));
	                return false; // not a valid marker, something is wrong
	            }

	            var iMarker = oFile.getByteAt(iOffset+1);

	            // we could implement handling for other markers here,
	            // but we're only looking for 0xFFE1 for EXIF data

	            if (iMarker == 22400) {
	                if (bDebug) console.log("Found 0xFFE1 marker");
	                return readEXIFData(oFile, iOffset + 4, oFile.getShortAt(iOffset+2, true)-2);
	                iOffset += 2 + oFile.getShortAt(iOffset+2, true);

	            } else if (iMarker == 225) {
	                // 0xE1 = Application-specific 1 (for EXIF)
	                if (bDebug) console.log("Found 0xFFE1 marker");
	                return readEXIFData(oFile, iOffset + 4, oFile.getShortAt(iOffset+2, true)-2);

	            } else {
	                iOffset += 2 + oFile.getShortAt(iOffset+2, true);
	            }

	        }

	    }


	    function readTags(oFile, iTIFFStart, iDirStart, oStrings, bBigEnd)
	    {
	        var iEntries = oFile.getShortAt(iDirStart, bBigEnd);
	        var oTags = {};
	        for (var i=0;i<iEntries;i++) {
	            var iEntryOffset = iDirStart + i*12 + 2;
	            var strTag = oStrings[oFile.getShortAt(iEntryOffset, bBigEnd)];
	            if (!strTag && bDebug) console.log("Unknown tag: " + oFile.getShortAt(iEntryOffset, bBigEnd));
	            oTags[strTag] = readTagValue(oFile, iEntryOffset, iTIFFStart, iDirStart, bBigEnd);
	        }
	        return oTags;
	    }


	    function readTagValue(oFile, iEntryOffset, iTIFFStart, iDirStart, bBigEnd)
	    {
	        var iType = oFile.getShortAt(iEntryOffset+2, bBigEnd);
	        var iNumValues = oFile.getLongAt(iEntryOffset+4, bBigEnd);
	        var iValueOffset = oFile.getLongAt(iEntryOffset+8, bBigEnd) + iTIFFStart;

	        switch (iType) {
	            case 1: // byte, 8-bit unsigned int
	            case 7: // undefined, 8-bit byte, value depending on field
	                if (iNumValues == 1) {
	                    return oFile.getByteAt(iEntryOffset + 8, bBigEnd);
	                } else {
	                    var iValOffset = iNumValues > 4 ? iValueOffset : (iEntryOffset + 8);
	                    var aVals = [];
	                    for (var n=0;n<iNumValues;n++) {
	                        aVals[n] = oFile.getByteAt(iValOffset + n);
	                    }
	                    return aVals;
	                }
	                break;

	            case 2: // ascii, 8-bit byte
	                var iStringOffset = iNumValues > 4 ? iValueOffset : (iEntryOffset + 8);
	                return oFile.getStringAt(iStringOffset, iNumValues-1);
	                break;

	            case 3: // short, 16 bit int
	                if (iNumValues == 1) {
	                    return oFile.getShortAt(iEntryOffset + 8, bBigEnd);
	                } else {
	                    var iValOffset = iNumValues > 2 ? iValueOffset : (iEntryOffset + 8);
	                    var aVals = [];
	                    for (var n=0;n<iNumValues;n++) {
	                        aVals[n] = oFile.getShortAt(iValOffset + 2*n, bBigEnd);
	                    }
	                    return aVals;
	                }
	                break;

	            case 4: // long, 32 bit int
	                if (iNumValues == 1) {
	                    return oFile.getLongAt(iEntryOffset + 8, bBigEnd);
	                } else {
	                    var aVals = [];
	                    for (var n=0;n<iNumValues;n++) {
	                        aVals[n] = oFile.getLongAt(iValueOffset + 4*n, bBigEnd);
	                    }
	                    return aVals;
	                }
	                break;
	            case 5:	// rational = two long values, first is numerator, second is denominator
	                if (iNumValues == 1) {
	                    return oFile.getLongAt(iValueOffset, bBigEnd) / oFile.getLongAt(iValueOffset+4, bBigEnd);
	                } else {
	                    var aVals = [];
	                    for (var n=0;n<iNumValues;n++) {
	                        aVals[n] = oFile.getLongAt(iValueOffset + 8*n, bBigEnd) / oFile.getLongAt(iValueOffset+4 + 8*n, bBigEnd);
	                    }
	                    return aVals;
	                }
	                break;
	            case 9: // slong, 32 bit signed int
	                if (iNumValues == 1) {
	                    return oFile.getSLongAt(iEntryOffset + 8, bBigEnd);
	                } else {
	                    var aVals = [];
	                    for (var n=0;n<iNumValues;n++) {
	                        aVals[n] = oFile.getSLongAt(iValueOffset + 4*n, bBigEnd);
	                    }
	                    return aVals;
	                }
	                break;
	            case 10: // signed rational, two slongs, first is numerator, second is denominator
	                if (iNumValues == 1) {
	                    return oFile.getSLongAt(iValueOffset, bBigEnd) / oFile.getSLongAt(iValueOffset+4, bBigEnd);
	                } else {
	                    var aVals = [];
	                    for (var n=0;n<iNumValues;n++) {
	                        aVals[n] = oFile.getSLongAt(iValueOffset + 8*n, bBigEnd) / oFile.getSLongAt(iValueOffset+4 + 8*n, bBigEnd);
	                    }
	                    return aVals;
	                }
	                break;
	        }
	    }


	    function readEXIFData(oFile, iStart, iLength)
	    {
	        if (oFile.getStringAt(iStart, 4) != "Exif") {
	            if (bDebug) console.log("Not valid EXIF data! " + oFile.getStringAt(iStart, 4));
	            return false;
	        }

	        var bBigEnd;

	        var iTIFFOffset = iStart + 6;

	        // test for TIFF validity and endianness
	        if (oFile.getShortAt(iTIFFOffset) == 0x4949) {
	            bBigEnd = false;
	        } else if (oFile.getShortAt(iTIFFOffset) == 0x4D4D) {
	            bBigEnd = true;
	        } else {
	            if (bDebug) console.log("Not valid TIFF data! (no 0x4949 or 0x4D4D)");
	            return false;
	        }

	        if (oFile.getShortAt(iTIFFOffset+2, bBigEnd) != 0x002A) {
	            if (bDebug) console.log("Not valid TIFF data! (no 0x002A)");
	            return false;
	        }

	        if (oFile.getLongAt(iTIFFOffset+4, bBigEnd) != 0x00000008) {
	            if (bDebug) console.log("Not valid TIFF data! (First offset not 8)", oFile.getShortAt(iTIFFOffset+4, bBigEnd));
	            return false;
	        }

	        var oTags = readTags(oFile, iTIFFOffset, iTIFFOffset+8, EXIF.TiffTags, bBigEnd);

	        if (oTags.ExifIFDPointer) {
	            var oEXIFTags = readTags(oFile, iTIFFOffset, iTIFFOffset + oTags.ExifIFDPointer, EXIF.Tags, bBigEnd);
	            for (var strTag in oEXIFTags) {
	                switch (strTag) {
	                    case "LightSource" :
	                    case "Flash" :
	                    case "MeteringMode" :
	                    case "ExposureProgram" :
	                    case "SensingMethod" :
	                    case "SceneCaptureType" :
	                    case "SceneType" :
	                    case "CustomRendered" :
	                    case "WhiteBalance" :
	                    case "GainControl" :
	                    case "Contrast" :
	                    case "Saturation" :
	                    case "Sharpness" :
	                    case "SubjectDistanceRange" :
	                    case "FileSource" :
	                        oEXIFTags[strTag] = EXIF.StringValues[strTag][oEXIFTags[strTag]];
	                        break;

	                    case "ExifVersion" :
	                    case "FlashpixVersion" :
	                        oEXIFTags[strTag] = String.fromCharCode(oEXIFTags[strTag][0], oEXIFTags[strTag][1], oEXIFTags[strTag][2], oEXIFTags[strTag][3]);
	                        break;

	                    case "ComponentsConfiguration" :
	                        oEXIFTags[strTag] =
	                            EXIF.StringValues.Components[oEXIFTags[strTag][0]]
	                            + EXIF.StringValues.Components[oEXIFTags[strTag][1]]
	                            + EXIF.StringValues.Components[oEXIFTags[strTag][2]]
	                            + EXIF.StringValues.Components[oEXIFTags[strTag][3]];
	                        break;
	                }
	                oTags[strTag] = oEXIFTags[strTag];
	            }
	        }

	        if (oTags.GPSInfoIFDPointer) {
	            var oGPSTags = readTags(oFile, iTIFFOffset, iTIFFOffset + oTags.GPSInfoIFDPointer, EXIF.GPSTags, bBigEnd);
	            for (var strTag in oGPSTags) {
	                switch (strTag) {
	                    case "GPSVersionID" :
	                        oGPSTags[strTag] = oGPSTags[strTag][0]
	                            + "." + oGPSTags[strTag][1]
	                            + "." + oGPSTags[strTag][2]
	                            + "." + oGPSTags[strTag][3];
	                        break;
	                }
	                oTags[strTag] = oGPSTags[strTag];
	            }
	        }

	        return oTags;
	    }


	    EXIF.getData = function(oImg, fncCallback)
	    {
	        if (!oImg.complete) return false;
	        if (!imageHasData(oImg)) {
	            getImageData(oImg, fncCallback);
	        } else {
	            if (fncCallback) fncCallback();
	        }
	        return true;
	    }

	    EXIF.getTag = function(oImg, strTag)
	    {
	        if (!imageHasData(oImg)) return;
	        return oImg.exifdata[strTag];
	    }

	    EXIF.getAllTags = function(oImg)
	    {
	        if (!imageHasData(oImg)) return {};
	        var oData = oImg.exifdata;
	        var oAllTags = {};
	        for (var a in oData) {
	            if (oData.hasOwnProperty(a)) {
	                oAllTags[a] = oData[a];
	            }
	        }
	        return oAllTags;
	    }


	    EXIF.pretty = function(oImg)
	    {
	        if (!imageHasData(oImg)) return "";
	        var oData = oImg.exifdata;
	        var strPretty = "";
	        for (var a in oData) {
	            if (oData.hasOwnProperty(a)) {
	                if (typeof oData[a] == "object") {
	                    strPretty += a + " : [" + oData[a].length + " values]\r\n";
	                } else {
	                    strPretty += a + " : " + oData[a] + "\r\n";
	                }
	            }
	        }
	        return strPretty;
	    }

	    EXIF.readFromBinaryFile = function(oFile) {
	        return findEXIFinJPEG(oFile);
	    }

	    function loadAllImages()
	    {
	        var aImages = document.getElementsByTagName("img");
	        for (var i=0;i<aImages.length;i++) {
	            if (aImages[i].getAttribute("exif") == "true") {
	                if (!aImages[i].complete) {
	                    addEvent(aImages[i], "load",
	                        function() {
	                            EXIF.getData(this);
	                        }
	                    );
	                } else {
	                    EXIF.getData(aImages[i]);
	                }
	            }
	        }
	    }

	    addEvent(window, "load", loadAllImages);

	})();

/***/ },
/* 29 */
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
	        var home=__webpack_require__(30);
	        new home({el:fresh.$content,uid:id});
	    },
	    rule:function(){
	        var rule=__webpack_require__(88);
	        new rule({el:fresh.$content});
	    },
	    landPage:function(id){
	        var landPage=__webpack_require__(92);
	        new landPage({el:fresh.$content,lid:id});
	    },
	    coupleCard:function(id){
	      var coupleCard=__webpack_require__(104);
	      new coupleCard({el:fresh.$content,cid:id});
	  }
	});

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	var template = _.template(__webpack_require__(31));
	__webpack_require__(32);


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
	                self.cache=d||{};
	                self.render();
	            },
	            error:function(){
	                self.cache={};
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
	        var TopInfo=__webpack_require__(35);
	        new TopInfo({el:this.$el.find('.top-info'),
	            cache:this.cache,
	            uid:this.uid
	        });

	        var GiftList=__webpack_require__(77);
	        new GiftList({el:this.$el.find('.gift-box'),
	            uid:this.uid
	        });
	        $.shareDefault();
	        if(this.cache.isReward){
	            $.popWindow({
	                title:'万元恋爱基金大作战',
	                content:'您已成功投资，现在去邀请且选择一位情侣即可获得恋爱基金现金奖励',
	                yes:'我知道了',
	                type:2,
	                tapMask:true,
	                callback:function(){

	                }
	            })
	        }
	    },
	    events: {
	        'tap .rule-btn': 'showRule',
	    },
	    showRule:function(){
	        $.changePage('rule')
	    }
	});

/***/ },
/* 31 */
/***/ function(module, exports) {

	module.exports = "<div class=\"home\">\r\n<div class=\"top-info\"></div>\r\n<div class=\"gift-box\"></div>\r\n<div class=\"rule-btn\"></div>\r\n</div>";

/***/ },
/* 32 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 33 */,
/* 34 */,
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	var template = _.template(__webpack_require__(36));
	__webpack_require__(37);

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
	            showThumbnail:function(img,imgRotation){
	                self.$el.find('.user-icon-1').attr('src',img).css('transform','rotate('+(imgRotation)+'deg)')
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
	        'tap .invite-btn':'invitePartner',
	        'tap .icon-2':'invitePartner2',
	        'tap .share-btn':'sharePage',
	        'tap .history-btn':'createHistory',
	        'tap .invest-btn': 'confirmInvest',
	        'tap .user-icon-1':'toLogin'
	    },
	    toLogin:function(e){
	        var self=this;
	        if(this.cache && this.cache.masterUserId){
	            if($.isApp()){ 
	               var obj = $(e.currentTarget),
	                   idx=parseInt(obj.attr('data-index'));
	               self.$el.append('<div class="defaultavatar"></div>');
	               var avatar=__webpack_require__(61);
	               new avatar({el:this.$el.find('.defaultavatar'),
	               idx: idx,
	               afterUpload:function(file, d,index){
	                  $(".user-icon-1").attr('src',d.url);
	                  $(".user-icon-1").attr('data-index',index);
	              }
	          });
	           }
	           return;
	       }
	       jsb.login();
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
	                if($.charLen(v)>8){
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
	        self._editName();
	    });
	},
	_changePartner:function(obj,name,id){
	    if(obj.hasClass('love')) return;
	    $.popWindow({
	        title:'确定选择 '+name+' 为情人吗?',
	        content:'如更换情人组队投资年化值会重新记录投资所得恋爱基金与Ta分享',
	        type:2,
	            yes:'取消',
	            no:'确认',
	        callback:function(bl){
	                if(!bl){
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
	    jsb.setShareInfo({
	        title : '额。。有句话想对你说！',
	        desc : '表白贴',
	        link : location.origin+'/events/valentinesDay/index.html#landPage/'+this.cache.masterUserId,
	        icon : $.getStaticOrgin()+'/yaowang/dist/globalImg/headImg.jpg'
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
	invitePartner2:function(e){
	    var self=this;
	    if(this.partner.isBind && $(e.currentTarget).hasClass('love')){
	        return false;
	    }
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
/* 36 */
/***/ function(module, exports) {

	module.exports = "<div class=\"logo\"></div>\r\n<div class=\"share-btn\"></div>\r\n<div class=\"l1\"></div>\r\n<div class=\"l2\"></div>\r\n<div class=\"r1\"></div>\r\n<div class=\"r2\"></div>\r\n<div class=\"h1\"></div>\r\n<div class=\"h2\"></div>\r\n<div class=\"h3\"></div>\r\n<div class=\"h4\"></div>\r\n\r\n<div class=\"u-b\">\r\n <% if(info && info.relationList && info.relationList.length>0){ %>\r\n<p class=\"tip1\">主人，有<%=info.relationList.length%>个想跟你结婚的人已排好队</p>\r\n<div class=\"user-list clearfix\">\r\n<div class=\"overSilder\">\r\n<ul class=\"animate\">\r\n <% _.each(info.relationList,function(n){ %>\r\n<li class=\"user-one <%=n.isBind==1?'love':''%>\" data-id=\"<%=n.slaveUserId%>\" data-teamId=\"<%=n.teamId%>\" data-name=\"<%=n.niceName%>\">\r\n <img class=\"user-img\" src=\"<%=n.headImg%>\">\r\n<p class=\"name\"><%=n.niceName%></p>\r\n</li>\r\n <% }) %>\r\n</ul>\r\n</div>\r\n<div class=\"invite-btn\">\r\n<div class=\"invite-btn-img\"></div>\r\n<div class=\"txt\">继续邀请</div>\r\n</div>\r\n</div>\r\n<p class=\"tip2\">选择为情人会获得恋爱基金现金奖励</p>\r\n <% } %>\r\n</div>\r\n\r\n<div class=\"icon-1\" style=\"height:<%=$('.content').width()*0.31%>px\">\r\n <img src=\"<%=info.masterHeadImg?info.masterHeadImg:(location.origin+'/events/valentinesDay/dist/i1.png')%>\" class=\"user-icon-1\">\r\n <% if(info.masterUserId>0 && !$.isApp()){ %>\r\n<div class=\"upload-img-mask\"></div>\r\n <input type=\"file\" class=\"upload-img\">\r\n <%} %>\r\n<div class=\"edit-name-btn\"><%=info.masterNickname?info.masterNickname:'编辑姓名'%></div>\r\n</div>\r\n<div class=\"icon-2 <%=partner.isBind==1?'love':''%>\" style=\"height:<%=$('.content').width()*0.31%>px\">\r\n <img src=\"<%=partner.headImg?partner.headImg:(location.origin+'/events/valentinesDay/dist/i2.png')%>\" class=\"user-icon-2\">\r\n<div class=\"invite-desc\"><%=partner.niceName?partner.niceName:'邀请我的情人'%></div>\r\n</div>\r\n\r\n<div class=\"history-desc\">\r\n<div class=\"history-btn\"></div>\r\n 生成情侣证，分享到朋友圈，得到6个亲朋好友的<br>祝福即可获得300元返现券\r\n</div>\r\n<div class=\"loading-box\">\r\n<div class=\"bounceball\"></div>\r\n</div>\r\n<div class=\"invest-box\">\r\n<p class=\"invest-tip\">投资赢万元恋爱基金</p>\r\n<div class=\"invest-btn\"></div>\r\n <% _.each(info.loverAmountList,function(n){\r\n        if(n.slaveName){ %>\r\n<p class=\"product-orders-p\">您和<span class=\"color2\"><%=n.slaveName%></span>已投资<span class=\"color2\"><%=n.totalInvestAmount%></span>元，年化已达到<span class=\"color2\"><%=n.totalInvestAmountYear%></span></p>\r\n <% }else{ %>\r\n<p class=\"product-orders-p\">您已投资<span class=\"color2\"><%=n.totalInvestAmount%></span>元，年化已达到<span class=\"color2\"><%=n.totalInvestAmountYear%></span></p>\r\n <% }\r\n    }) %>\r\n</div>\r\n<div class=\"share_mask\"></div>";

/***/ },
/* 37 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
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
/* 60 */,
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	var template = _.template(__webpack_require__(62));
	__webpack_require__(63);

	module.exports = Backbone.View.extend({
	    initialize: function (options) { 
	        this.afterUpload=options.afterUpload||function(){};
	        // this.uploadError=options.uploadError||function(){};
	        this.idx=options.idx||'0';
	        this.index=options.idx;
	        this.render();
	    },
	    render: function () {
	        var self=this;
	        this.$el.html(template());
	        this.$el.find('.img'+this.idx).addClass('chooseed');
	        
	        return this;
	  },
	  events:{
	    'tap .close':'remove',
	    'tap .imgbox':'selectImg',
	    'tap .yesbtn':'upload'
	},

	remove:function(){
	    $('.defaultavatar').remove();
	},
	selectImg:function(e){
	    var self = $(e.currentTarget);
	    this.index=parseInt(self.attr('data-index'));
	    self.addClass('chooseed').siblings().removeClass("chooseed");
	},
	upload:function(){
	    var self=this;
	    if(this.index>0){
	        if(this.index!=this.idx){
	            var file=$.getImgStream(this.index-1);
	            if(file){
	                $.sync({
	                    url:fresh.apiRoot+'loveractivity/upload',
	                    type:'post',
	                    data: {
	                        file:file,
	                        uploadFlag:1,
	                        imgRotation:0
	                    },
	                    success: function (d) {
	                        self.afterUpload && self.afterUpload(file, d,self.index);
	                        self.remove();
	                    },
	                    error: function (d) {
	                        $.toast('上传失败');
	                    }
	                })  
	            }else{
	                $.toast("上传失败");
	            }
	        }else{
	            self.remove();  
	        }
	    }else{
	        $.toast("请选择头像");
	    }
	}

	});

/***/ },
/* 62 */
/***/ function(module, exports) {

	module.exports = "<div class=\"avatarwrap\">\r\n\t<div class=\"close\"></div>\r\n\t<p class=\"titledesc\">请选择头像</p>\r\n\t<div class=\"imglist clearfix\">\r\n\t\t<div class=\"imgbox img1\" data-index=\"1\"></div>\r\n\t\t<div class=\"imgbox img2\" data-index=\"2\"></div>\r\n\t\t<div class=\"imgbox img3\" data-index=\"3\"></div>\r\n\t\r\n\t\t<div class=\"imgbox img4\" data-index=\"4\"></div>\r\n\t\t<div class=\"imgbox img5\" data-index=\"5\"></div>\r\n\t\t<div class=\"imgbox img6\" data-index=\"6\"></div>\r\n\t\r\n\t\t<div class=\"imgbox img7\" data-index=\"7\"></div>\r\n\t\t<div class=\"imgbox img8\" data-index=\"8\"></div>\r\n\t\t<div class=\"imgbox img9\" data-index=\"9\"></div>\r\n\t</div>\r\n\t<div class=\"yesbtn\"></div>\r\n</div>";

/***/ },
/* 63 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 64 */,
/* 65 */,
/* 66 */,
/* 67 */,
/* 68 */,
/* 69 */,
/* 70 */,
/* 71 */,
/* 72 */,
/* 73 */,
/* 74 */,
/* 75 */,
/* 76 */,
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	var template = _.template(__webpack_require__(78));
	__webpack_require__(79);

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
	            },
	            error:function(){
	                self.cache={lv1:[],lv2:[],lv3:[],lv4:[]};
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
/* 78 */
/***/ function(module, exports) {

	module.exports = "<div class=\"gift-banner\"></div>\r\n<p class=\"gift-tip\">达到LV4获总共10000元现金</p>\r\n<div class=\"gift-b gift-1\">\r\n <b>开个标间也可以</b>\r\n<p>投资年化达到10000 平分200元现金</p>\r\n<div class=\"<%=lv1.length>0?'receive-btn':'fighting-btn'%>\" data-id=\"1\"></div>\r\n</div>\r\n<div class=\"gift-b gift-2\">\r\n <b>哎呦，大床房，不错哦</b>\r\n<p>投资年化达到50000 平分1500元现金</p>\r\n<div class=\"<%=lv2.length>0?'receive-btn':'fighting-btn'%>\" data-id=\"2\"></div>\r\n</div>\r\n<div class=\"gift-b gift-3\">\r\n <b>商务套房，逼格更上一层楼</b>\r\n<p>投资年化达到100000 平分4000元现金</p>\r\n<div class=\"<%=lv3.length>0?'receive-btn':'fighting-btn'%>\" data-id=\"3\"></div>\r\n</div>\r\n<div class=\"gift-b gift-4\">\r\n <b>总统套房…这是要上天</b>\r\n<p>投资年化达到200000 平分10000元现金</p>\r\n<div class=\"<%=lv4.length>0?'receive-btn':'fighting-btn'%>\" data-id=\"4\"></div>\r\n</div>\r\n<p class=\"gift-tip2\">投资年化达到200000 平分10000元现金</p>";

/***/ },
/* 79 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 80 */,
/* 81 */,
/* 82 */,
/* 83 */,
/* 84 */,
/* 85 */,
/* 86 */,
/* 87 */,
/* 88 */
/***/ function(module, exports, __webpack_require__) {

	var template = _.template(__webpack_require__(89));
	__webpack_require__(90);

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
/* 89 */
/***/ function(module, exports) {

	module.exports = "<div class=\"rule-box\">\r\n<h3 class=\"rule-title\">活动细则</h3>\r\n<ol class=\"rule-txt\">\r\n<li>活动时间：2017年2月10日—2017年2月19日。</li>\r\n<li>活动期间，邀请到好友并投资满额的用户可根据等级获取恋爱基金。\r\n<table class=\"table\">\r\n<tr>\r\n<th>情侣等级</th>\r\n<th>累计投资年化金额<br>（非变现定期产品）</th>\r\n<th>恋爱基金/现金奖励<br>（和情侣二人平分）</th>\r\n</tr>\r\n<tr>\r\n<td>LV1</td>\r\n<td>≥10000元</td>\r\n<td class=\"color1\">200元</td>\r\n</tr>\r\n<tr>\r\n<td>LV2</td>\r\n<td>≥50000元</td>\r\n<td class=\"color1\">1500元</td>\r\n</tr>\r\n<tr>\r\n<td>LV3</td>\r\n<td>≥100000元</td>\r\n<td class=\"color1\">4000元</td>\r\n</tr>\r\n<tr>\r\n<td>LV4</td>\r\n<td>≥200000元</td>\r\n<td class=\"color1\">10000元</td>\r\n</tr>\r\n</table>\r\n</li>\r\n<li>用户获取恋爱基金（现金奖励）条件：\r\n<p><b class=\"color2\">第一步：</b>活动期间，用户通过活动页面邀请好友组队。（好友不限是否已注册摇旺，好友需填写个人手机号接受邀请，一旦接受不可解除）</p>\r\n<p><b class=\"color2\">第一步：</b>用户需选择且仅能选择其中一个好友成为自己的“情侣”，活动期间可以更换“情侣”。</p>\r\n<p><b class=\"color2\">第一步：</b>用户累计投资年化金额满足指定金额即可获得相应的恋爱基金（现金奖励），该奖励仅与自己选择的“情侣”平分。（若双方互相选择对方为“情侣”，则二人投资金额可合并计算）</p>\r\n</li>\r\n<li>恋爱基金（现金奖励）获取规则：\r\n<p class=\"color2\">当用户累计投资年化金额10000元时，共获得现金奖励200元；若该用户继续投资年化金额40000元，累计年化金额达到50000元，则再获得现金奖励1300元；以此类推，每对“情侣”最高可获得现金奖励10000元。</p>\r\n</li>\r\n<li>活动开始后，如果用户未选择“情侣”即进行投资，该期间的投资所产生的恋爱基金（现金奖励）将与用户选择的第一个“情侣“进行平分；若中途变更“情侣”，后期投资产生的恋爱基金（现金奖励）等级将重新计算，并与新情侣进行平分。</li>\r\n<li>获得恋爱基金（现金奖励）的用户必须注册并完成绑卡才能取出，如在活动结束后30日内（2017年3月21日前）未完成注册，所获恋爱基金（现金奖励）取消发放。</li>\r\n<li>获得恋爱基金（现金奖励）的未注册用户，在注册时必须使用受邀请时填写的手机号码，否则无法收到恋爱基金（现金奖励）。</li>\r\n<li>累计年化投资金额(元)=活动期间用户新增非变现定期投资金额(元)×产品期限(天)/360(天)(若有多笔投资，累计年化投资金额为各笔年化投资金额之和）；</li>\r\n<li>用户分享“情侣证”到微信，集齐6个“祝福”即可获取300元返现券大礼包一份，仅限分享用户获得，每人限得一份。\r\n<table class=\"table\">\r\n<tr>\r\n<th>返现券金额</th>\r\n<th>激活门槛</th>\r\n<th>适用产品</th>\r\n</tr>\r\n<tr>\r\n<td>200元</td>\r\n<td>20000元</td>\r\n<td>360天及以上产品</td>\r\n</tr>\r\n<tr>\r\n<td>100元</td>\r\n<td>20000元</td>\r\n<td>180天及以上产品</td>\r\n</tr>\r\n</table>\r\n</li>\r\n <% if($.isIOS()){ %>\r\n<li>本活动与苹果公司无关。</li>\r\n <% } %>\r\n<li>活动最终解释权归摇旺理财所有。</li>\r\n</ol>\r\n</div>\r\n";

/***/ },
/* 90 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 91 */,
/* 92 */
/***/ function(module, exports, __webpack_require__) {

	var template = _.template(__webpack_require__(93));
	__webpack_require__(94);


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
	            },
	            error:function(d){
	                $.toast(d.msg);
	                $.changePage('home')
	            }
	        });
	    },
	    render: function () {
	        var self=this;
	        this.$el.html(template({initInviterInfo:this.initInviterInfo}));
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
	            if($.charLen(name)<1&&$.charLen(name)>=8){
	                $.toast('姓名最长4个中文字');
	                return;
	            }
	            if(!$.isMobileNum(mobile) || !self.currimgurl){
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
/* 93 */
/***/ function(module, exports) {

	module.exports = "<div class=\"acty214-landPage\">\r\n\t<div class=\"acty214-wrap\">\r\n\t\t<div class=\"logo\"></div>\r\n\t\t<div class=\"headimg\" style=\"height:<%= $(window).width()*0.33 %>px\"></div>\r\n\t\t<div class=\"innerwarp\" style=\"height:<%= $(window).width()*1.2 %>px\">\r\n\t\t\t<div class=\"content\">\r\n\t\t\t\t<div class=\"facebox clearfix\">\r\n\t\t\t\t\t<div class=\"mainface\">\r\n\t\t\t\t\t\t<div class=\"face\">\r\n\t\t\t\t\t\t\t<img src=\"<%=initInviterInfo.headImg?initInviterInfo.headImg:(location.origin+'/events/valentinesDay/dist/i2.png')%>\"/>\r\n\t\t\t\t\t\t\t\r\n\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t<p class=\"name\"><%=initInviterInfo.niceName%></p>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t\t<div class=\"subface\">\r\n\t\t\t\t\t\t<div class=\"face\">\r\n\t\t\t\t\t\t\t<img src=\"xxxHTMLLINKxxx0.69003226188942790.26530854823067784xxx\" class=\"slaveHeadImg\"/>\r\n\t\t\t\t\t\t\t<input type=\"file\" class=\"upload-img\"/>\r\n\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t<p class=\"name subname\">上传你的美照吧</p>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t\t<div class=\"dottedline\"></div>\r\n\t\t\t<div class=\"content\">\r\n\t\t\t\t<div class=\"inputbox\"><input class=\"input inviteename\" placeholder=\"请输入姓名\"/></div>\r\n\t\t\t\t<div class=\"inputbox\"><input class=\"input inviteemobile\" placeholder=\"请输入摇旺注册手机号\" maxlength=\"11\"/></div>\r\n\t\t\t\t<p class=\"tips\">如尚未注册，注册时请使用本次输入手机号<br/>如果填写有误或者填写了无法注册的手机号后期得不到现金奖励与摇旺无关</p>\r\n\t\t\t</div>\r\n\t\t\t<div class=\"btnbox\">\r\n\t\t\t\t<div class=\"content\">\r\n\t\t\t\t\t<div class=\"bottombtn nobtn\"></div>\r\n\t\t\t\t\t<div class=\"bottombtn yesbtn\"></div>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t</div>\r\n\t<div class=\"loading-box\">\r\n\t\t<div class=\"bounceball\"></div>\r\n\t</div>\r\n</div>";

/***/ },
/* 94 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 95 */,
/* 96 */,
/* 97 */,
/* 98 */,
/* 99 */,
/* 100 */,
/* 101 */,
/* 102 */,
/* 103 */,
/* 104 */
/***/ function(module, exports, __webpack_require__) {

	var template = _.template(__webpack_require__(105));
	__webpack_require__(106);
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
	            },
	            error:function(d){
	                $.toast(d.msg);
	                $.changePage('home')
	            }
	        });
	    },
	    render: function () {
	        this.$el.html(template(this.cache));
	        $.setWeixinTitle('情侣证');
	        jsb.setShareInfo({
	            title : '我们在一起了，祝福我们吧！',
	            desc : '我们的幸福需要你的祝福',
	            link : location.origin+'/events/valentinesDay/index.html#coupleCard/'+this.cid+'?isShare=true',
	            icon : $.getStaticOrgin()+'/yaowang/dist/globalImg/headImg.jpg'
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
/* 105 */
/***/ function(module, exports) {

	module.exports = "<div class=\"acty214-couplecard\">\r\n\t<div class=\"rightlead <%= isFromShare?'joinbtn':'sharebtn' %>\"></div>\r\n\t<div class=\"acty214-wrap\">\r\n\t\t<div class=\"headimg\" style=\"height:<%= $(window).width()*0.25 %>px\"></div>\r\n\t\t<div class=\"innerwarp\" style=\"height:<%= $(window).width()*1.35 %>px\">\r\n\t\t\t<div class=\"content\">\r\n\t\t\t\t<p class=\"headtitle\">情侣证</p>\r\n\t\t\t\t<div class=\"facebox clearfix\">\r\n\t\t\t\t<div class=\"lovestamp\"></div>\r\n\t\t\t\t\t<div class=\"mainface\">\r\n\t\t\t\t\t\t<div class=\"face\"><img src=\"<%= cardinfo.masterHeadImg%>\"/></div>\r\n\t\t\t\t\t\t<p class=\"name\"><%= cardinfo.masterNickname%></p>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t\t<div class=\"subface\">\r\n\t\t\t\t\t\t<div class=\"face\"><img src=\"<%= cardinfo.slaveHeadImg%>\"/></div>\r\n\t\t\t\t\t\t<p class=\"name\"><%= cardinfo.slaveNiceName%></p>\r\n\t\t\t\t\t</div>\t\r\n\t\t\t\t</div>\r\n\t\t\t\t<div class=\"carddesc\">经摇旺专业恋爱认证协会审核通过：<br/><span class=\"username\"><%= cardinfo.masterNickname%></span> 和 <span class=\"username\"><%= cardinfo.slaveNiceName%></span> 正式成为情侣<br/>特发此证！</div>\r\n\t\t\t\t<p class=\"source\">摇旺专业恋爱认证协会监制</p>\r\n\t\t\t</div>\r\n\t\t\t<div class=\"doshedline\"></div>\r\n\t\t\t<div class=\"blessbox\">\r\n\t\t\t\t<div class=\"content\">\r\n\t\t\t\t\t<div class=\"blesstitle\">亲友祝福 <%if(isFromShare){%><span id=\"blesscount\"><%=list.count%></span> 条<%}%></div>\r\n\t\t\t\t\t<%if(!isFromShare && cardinfo.masterFxq=='0'){%>\r\n\t\t\t\t\t\t<p class=\"sharetips\">点击右上角“分享”按钮，求祝福可获300元返现券</p>\r\n\t\t\t\t\t<%}else{%>\r\n\t\t\t\t\t\t<div class=\"blesslist\">\r\n\t\t\t\t\t\t\t<% _.each(list.hdLoverWishs,function(item){  %>\r\n\t\t\t\t\t\t\t<p class=\"blessinfo\"><%= item.wishContent%></p>\r\n\t\t\t\t\t\t\t<%})%>\r\n\t\t\t\t\t\t</div>\r\n\t\t\t\t\t<%}%>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t\t<%if(isFromShare){%>\r\n\t\t\t\t<div class=\"blessbtn\"></div>\r\n\t\t\t<%}%>\r\n\t\t</div>\r\n\t</div>\r\n\t<div class=\"share_mask\"></div>\r\n</div>";

/***/ },
/* 106 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }
/******/ ]);