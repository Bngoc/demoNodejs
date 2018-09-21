webpackJsonp(["main"],{

/***/ "../node_modules/emoji-text/index.js":
/***/ (function(module, exports, __webpack_require__) {

var wemoji = __webpack_require__("../node_modules/wemoji/index.js");

// Regex for replacing
var pattern = new RegExp(Object.keys( wemoji.unicode ).join('|'), 'g');
var defaults = {
  before: '[',
  after: ']',
  field: 'name'
};

module.exports.convert = function (str, options) {
  if (typeof str !== 'string') {
    return str;
  }

  if (options == null) options = {};

  var before, after
  if ( 'delimiter' in options ) {
    before = options.delimiter
    after  = options.delimiter
  } else {
    before = 'before' in options ? options.before : defaults.before
    after = 'after' in options ? options.after : defaults.after
  }
  var field = options.field || defaults.field;

  return str.replace(pattern, function(val) {
    if (options.callback) {
      return options.callback(val, wemoji.unicode[ val ]);
    } else {
      return before + wemoji.unicode[ val ][ field ] + after;
    }
  });
}


/***/ }),

/***/ "../node_modules/lodash.toarray/index.js":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    mapTag = '[object Map]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    weakMapTag = '[object WeakMap]';

var dataViewTag = '[object DataView]';

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/** Used to compose unicode character classes. */
var rsAstralRange = '\\ud800-\\udfff',
    rsComboMarksRange = '\\u0300-\\u036f\\ufe20-\\ufe23',
    rsComboSymbolsRange = '\\u20d0-\\u20f0',
    rsVarRange = '\\ufe0e\\ufe0f';

/** Used to compose unicode capture groups. */
var rsAstral = '[' + rsAstralRange + ']',
    rsCombo = '[' + rsComboMarksRange + rsComboSymbolsRange + ']',
    rsFitz = '\\ud83c[\\udffb-\\udfff]',
    rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')',
    rsNonAstral = '[^' + rsAstralRange + ']',
    rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}',
    rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]',
    rsZWJ = '\\u200d';

/** Used to compose unicode regexes. */
var reOptMod = rsModifier + '?',
    rsOptVar = '[' + rsVarRange + ']?',
    rsOptJoin = '(?:' + rsZWJ + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*',
    rsSeq = rsOptVar + reOptMod + rsOptJoin,
    rsSymbol = '(?:' + [rsNonAstral + rsCombo + '?', rsCombo, rsRegional, rsSurrPair, rsAstral].join('|') + ')';

/** Used to match [string symbols](https://mathiasbynens.be/notes/javascript-unicode). */
var reUnicode = RegExp(rsFitz + '(?=' + rsFitz + ')|' + rsSymbol + rsSeq, 'g');

/** Used to detect strings with [zero-width joiners or code points from the astral planes](http://eev.ee/blog/2015/09/12/dark-corners-of-unicode/). */
var reHasUnicode = RegExp('[' + rsZWJ + rsAstralRange  + rsComboMarksRange + rsComboSymbolsRange + rsVarRange + ']');

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array ? array.length : 0,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

/**
 * Converts an ASCII `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */
function asciiToArray(string) {
  return string.split('');
}

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

/**
 * The base implementation of `_.values` and `_.valuesIn` which creates an
 * array of `object` property values corresponding to the property names
 * of `props`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array} props The property names to get values for.
 * @returns {Object} Returns the array of property values.
 */
function baseValues(object, props) {
  return arrayMap(props, function(key) {
    return object[key];
  });
}

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Checks if `string` contains Unicode symbols.
 *
 * @private
 * @param {string} string The string to inspect.
 * @returns {boolean} Returns `true` if a symbol is found, else `false`.
 */
function hasUnicode(string) {
  return reHasUnicode.test(string);
}

/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

/**
 * Converts `iterator` to an array.
 *
 * @private
 * @param {Object} iterator The iterator to convert.
 * @returns {Array} Returns the converted array.
 */
function iteratorToArray(iterator) {
  var data,
      result = [];

  while (!(data = iterator.next()).done) {
    result.push(data.value);
  }
  return result;
}

/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

/**
 * Converts `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */
function stringToArray(string) {
  return hasUnicode(string)
    ? unicodeToArray(string)
    : asciiToArray(string);
}

/**
 * Converts a Unicode `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */
function unicodeToArray(string) {
  return string.match(reUnicode) || [];
}

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Built-in value references. */
var Symbol = root.Symbol,
    iteratorSymbol = Symbol ? Symbol.iterator : undefined,
    propertyIsEnumerable = objectProto.propertyIsEnumerable;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = overArg(Object.keys, Object);

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView'),
    Map = getNative(root, 'Map'),
    Promise = getNative(root, 'Promise'),
    Set = getNative(root, 'Set'),
    WeakMap = getNative(root, 'WeakMap');

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map),
    promiseCtorString = toSource(Promise),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap);

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  // Safari 9 makes `arguments.length` enumerable in strict mode.
  var result = (isArray(value) || isArguments(value))
    ? baseTimes(value.length, String)
    : [];

  var length = result.length,
      skipIndexes = !!length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (key == 'length' || isIndex(key, length)))) {
      result.push(key);
    }
  }
  return result;
}

/**
 * The base implementation of `getTag`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  return objectToString.call(value);
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function copyArray(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11,
// for data views in Edge < 14, and promises in Node.js.
if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
    (Map && getTag(new Map) != mapTag) ||
    (Promise && getTag(Promise.resolve()) != promiseTag) ||
    (Set && getTag(new Set) != setTag) ||
    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
  getTag = function(value) {
    var result = objectToString.call(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : undefined;

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag;
        case mapCtorString: return mapTag;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag;
        case weakMapCtorString: return weakMapTag;
      }
    }
    return result;
  };
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments(value) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') &&
    (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `String` primitive or object.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a string, else `false`.
 * @example
 *
 * _.isString('abc');
 * // => true
 *
 * _.isString(1);
 * // => false
 */
function isString(value) {
  return typeof value == 'string' ||
    (!isArray(value) && isObjectLike(value) && objectToString.call(value) == stringTag);
}

/**
 * Converts `value` to an array.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {Array} Returns the converted array.
 * @example
 *
 * _.toArray({ 'a': 1, 'b': 2 });
 * // => [1, 2]
 *
 * _.toArray('abc');
 * // => ['a', 'b', 'c']
 *
 * _.toArray(1);
 * // => []
 *
 * _.toArray(null);
 * // => []
 */
function toArray(value) {
  if (!value) {
    return [];
  }
  if (isArrayLike(value)) {
    return isString(value) ? stringToArray(value) : copyArray(value);
  }
  if (iteratorSymbol && value[iteratorSymbol]) {
    return iteratorToArray(value[iteratorSymbol]());
  }
  var tag = getTag(value),
      func = tag == mapTag ? mapToArray : (tag == setTag ? setToArray : values);

  return func(value);
}

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

/**
 * Creates an array of the own enumerable string keyed property values of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property values.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.values(new Foo);
 * // => [1, 2] (iteration order is not guaranteed)
 *
 * _.values('hi');
 * // => ['h', 'i']
 */
function values(object) {
  return object ? baseValues(object, keys(object)) : [];
}

module.exports = toArray;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "../node_modules/node-emoji/index.js":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("../node_modules/node-emoji/lib/emoji.js");

/***/ }),

/***/ "../node_modules/node-emoji/lib/emoji.js":
/***/ (function(module, exports, __webpack_require__) {

/*jslint node: true*/
var toArray = __webpack_require__("../node_modules/lodash.toarray/index.js");
var emojiByName = __webpack_require__("../node_modules/node-emoji/lib/emoji.json");

"use strict";

/**
 * regex to parse emoji in a string - finds emoji, e.g. :coffee:
 */
var emojiNameRegex = /:([a-zA-Z0-9_\-\+]+):/g;

/**
 * regex to trim whitespace
 * use instead of String.prototype.trim() for IE8 supprt
 */
var trimSpaceRegex = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

/**
 * Removes colons on either side
 * of the string if present
 * @param  {string} str
 * @return {string}
 */
function stripColons (str) {
  var colonIndex = str.indexOf(':');
  if (colonIndex > -1) {
    // :emoji: (http://www.emoji-cheat-sheet.com/)
    if (colonIndex === str.length - 1) {
      str = str.substring(0, colonIndex);
      return stripColons(str);
    } else {
      str = str.substr(colonIndex + 1);
      return stripColons(str);
    }
  }

  return str;
}

/**
 * Adds colons to either side
 * of the string
 * @param {string} str
 * @return {string}
 */
function wrapColons (str) {
  return (typeof str === 'string' && str.length > 0) ? ':' + str + ':' : str;
}

/**
 * Ensure that the word is wrapped in colons
 * by only adding them, if they are not there.
 * @param {string} str
 * @return {string}
 */
function ensureColons (str) {
  return (typeof str === 'string' && str[0] !== ':') ? wrapColons(str) : str;
}

// Non spacing mark, some emoticons have them. It's the 'Variant Form',
// which provides more information so that emoticons can be rendered as
// more colorful graphics. FE0E is a unicode text version, where as FE0F
// should be rendered as a graphical version. The code gracefully degrades.
var NON_SPACING_MARK = String.fromCharCode(65039); // 65039 - '️' - 0xFE0F;
var nonSpacingRegex = new RegExp(NON_SPACING_MARK, 'g')

// Remove the non-spacing-mark from the code, never send a stripped version
// to the client, as it kills graphical emoticons.
function stripNSB (code) {
  return code.replace(nonSpacingRegex, '');
};

// Reversed hash table, where as emojiByName contains a { heart: '❤' }
// dictionary emojiByCode contains { ❤: 'heart' }. The codes are normalized
// to the text version.
var emojiByCode = Object.keys(emojiByName).reduce(function(h,k) {
  h[stripNSB(emojiByName[k])] = k;
  return h;
}, {});

/**
 * Emoji namespace
 */
var Emoji = {
  emoji: emojiByName,
};

/**
 * get emoji code from name
 * @param  {string} emoji
 * @return {string}
 */
Emoji._get = function _get (emoji) {
  if (emojiByName.hasOwnProperty(emoji)) {
    return emojiByName[emoji];
  }

  return ensureColons(emoji);
};

/**
 * get emoji code from :emoji: string or name
 * @param  {string} emoji
 * @return {string}
 */
Emoji.get = function get (emoji) {
  emoji = stripColons(emoji);

  return Emoji._get(emoji);
};

/**
 * find the emoji by either code or name
 * @param {string} nameOrCode The emoji to find, either `coffee`, `:coffee:` or `☕`;
 * @return {object}
 */
Emoji.find = function find (nameOrCode) {
  return Emoji.findByName(nameOrCode) || Emoji.findByCode(nameOrCode);
};

/**
 * find the emoji by name
 * @param {string} name The emoji to find either `coffee` or `:coffee:`;
 * @return {object}
 */
Emoji.findByName = function findByName (name) {
  var stripped = stripColons(name);
  var emoji = emojiByName[stripped];

  return emoji ? ({ emoji: emoji, key: stripped }) : undefined;
};

/**
 * find the emoji by code (emoji)
 * @param {string} code The emoji to find; for example `☕` or `☔`
 * @return {object}
 */
Emoji.findByCode = function findByCode (code) {
  var stripped = stripNSB(code);
  var name = emojiByCode[stripped];

  // lookup emoji to ensure the Variant Form is returned
  return name ? ({ emoji: emojiByName[name], key: name }) : undefined;
};


/**
 * Check if an emoji is known by this library
 * @param {string} nameOrCode The emoji to validate, either `coffee`, `:coffee:` or `☕`;
 * @return {object}
 */
Emoji.hasEmoji = function hasEmoji (nameOrCode) {
  return Emoji.hasEmojiByName(nameOrCode) || Emoji.hasEmojiByCode(nameOrCode);
};

/**
 * Check if an emoji with given name is known by this library
 * @param {string} name The emoji to validate either `coffee` or `:coffee:`;
 * @return {object}
 */
Emoji.hasEmojiByName = function hasEmojiByName (name) {
  var result = Emoji.findByName(name);
  return !!result && result.key === stripColons(name);
};

/**
 * Check if a given emoji is known by this library
 * @param {string} code The emoji to validate; for example `☕` or `☔`
 * @return {object}
 */
Emoji.hasEmojiByCode = function hasEmojiByCode (code) {
  var result = Emoji.findByCode(code);
  return !!result && stripNSB(result.emoji) === stripNSB(code);
};

/**
 * get emoji name from code
 * @param  {string} emoji
 * @param  {boolean} includeColons should the result include the ::
 * @return {string}
 */
Emoji.which = function which (emoji_code, includeColons) {
  var code = stripNSB(emoji_code);
  var word = emojiByCode[code];

  return includeColons ? wrapColons(word) : word;
};

/**
 * emojify a string (replace :emoji: with an emoji)
 * @param  {string} str
 * @param  {function} on_missing (gets emoji name without :: and returns a proper emoji if no emoji was found)
 * @param  {function} format (wrap the returned emoji in a custom element)
 * @return {string}
 */
Emoji.emojify = function emojify (str, on_missing, format) {
  if (!str) return '';

  return str.split(emojiNameRegex) // parse emoji via regex
            .map(function parseEmoji(s, i) {
              // every second element is an emoji, e.g. "test :fast_forward:" -> [ "test ", "fast_forward" ]
              if (i % 2 === 0) return s;
              var emoji = Emoji._get(s);
              var isMissing = emoji.indexOf(':') > -1;

              if (isMissing && typeof on_missing === 'function') {
                return on_missing(s);
              }

              if (!isMissing && typeof format === 'function') {
                return format(emoji, s);
              }

              return emoji;
            })
            .join('') // convert back to string
  ;
};

/**
 * return a random emoji
 * @return {string}
 */
Emoji.random = function random () {
  var emojiKeys = Object.keys(emojiByName);
  var randomIndex = Math.floor(Math.random() * emojiKeys.length);
  var key = emojiKeys[randomIndex];
  var emoji = Emoji._get(key);
  return { key: key, emoji: emoji };
}

/**
 *  return an collection of potential emoji matches
 *  @param {string} str
 *  @return {Array.<Object>}
 */
Emoji.search = function search (str) {
  var emojiKeys = Object.keys(emojiByName);
  var matcher = stripColons(str)
  var matchingKeys = emojiKeys.filter(function(key) {
    return key.toString().indexOf(matcher) === 0;
  });
  return matchingKeys.map(function(key) {
    return {
      key: key,
      emoji: Emoji._get(key),
    };
  });
}

/**
 * unemojify a string (replace emoji with :emoji:)
 * @param  {string} str
 * @return {string}
 */
Emoji.unemojify = function unemojify (str) {
  if (!str) return '';
  var words = toArray(str);

  return words.map(function(word) {
    return Emoji.which(word, true) || word;
  }).join('');
};

/**
 * replace emojis with replacement value
 * @param {string} str
 * @param {function|string} the string or callback function to replace the emoji with
 * @param {boolean} should trailing whitespaces be cleaned? Defaults false
 * @return {string}
 */
Emoji.replace = function replace (str, replacement, cleanSpaces) {
  if (!str) return '';

  var replace = typeof replacement === 'function' ? replacement : function() { return replacement; };
  var words = toArray(str);

  var replaced = words.map(function(word, idx) {
    var emoji = Emoji.findByCode(word);
    
    if (emoji && cleanSpaces && words[idx + 1] === ' ') {
      words[idx + 1] = '';
    }

    return emoji ? replace(emoji) : word;
  }).join('');

  return cleanSpaces ? replaced.replace(trimSpaceRegex, '') : replaced;
};


/**
 * remove all emojis from a string
 * @param {string} str
 * @return {string}
 */
Emoji.strip = function strip (str) {
  return Emoji.replace(str, '', true);
};

module.exports = Emoji;


/***/ }),

/***/ "../node_modules/node-emoji/lib/emoji.json":
/***/ (function(module, exports) {

module.exports = {"100":"💯","1234":"🔢","interrobang":"⁉️","tm":"™️","information_source":"ℹ️","left_right_arrow":"↔️","arrow_up_down":"↕️","arrow_upper_left":"↖️","arrow_upper_right":"↗️","arrow_lower_right":"↘️","arrow_lower_left":"↙️","keyboard":"⌨","sunny":"☀️","cloud":"☁️","umbrella":"☔️","showman":"☃","comet":"☄","ballot_box_with_check":"☑️","coffee":"☕️","shamrock":"☘","skull_and_crossbones":"☠","radioactive_sign":"☢","biohazard_sign":"☣","orthodox_cross":"☦","wheel_of_dharma":"☸","white_frowning_face":"☹","aries":"♈️","taurus":"♉️","sagittarius":"♐️","capricorn":"♑️","aquarius":"♒️","pisces":"♓️","spades":"♠️","clubs":"♣️","hearts":"♥️","diamonds":"♦️","hotsprings":"♨️","hammer_and_pick":"⚒","anchor":"⚓️","crossed_swords":"⚔","scales":"⚖","alembic":"⚗","gear":"⚙","scissors":"✂️","white_check_mark":"✅","airplane":"✈️","email":"✉️","envelope":"✉️","black_nib":"✒️","heavy_check_mark":"✔️","heavy_multiplication_x":"✖️","star_of_david":"✡","sparkles":"✨","eight_spoked_asterisk":"✳️","eight_pointed_black_star":"✴️","snowflake":"❄️","sparkle":"❇️","question":"❓","grey_question":"❔","grey_exclamation":"❕","exclamation":"❗️","heavy_exclamation_mark":"❗️","heavy_heart_exclamation_mark_ornament":"❣","heart":"❤️","heavy_plus_sign":"➕","heavy_minus_sign":"➖","heavy_division_sign":"➗","arrow_heading_up":"⤴️","arrow_heading_down":"⤵️","wavy_dash":"〰️","congratulations":"㊗️","secret":"㊙️","copyright":"©️","registered":"®️","bangbang":"‼️","leftwards_arrow_with_hook":"↩️","arrow_right_hook":"↪️","watch":"⌚️","hourglass":"⌛️","fast_forward":"⏩","rewind":"⏪","arrow_double_up":"⏫","arrow_double_down":"⏬","black_right_pointing_double_triangle_with_vertical_bar":"⏭","black_left_pointing_double_triangle_with_vertical_bar":"⏮","black_right_pointing_triangle_with_double_vertical_bar":"⏯","alarm_clock":"⏰","stopwatch":"⏱","timer_clock":"⏲","hourglass_flowing_sand":"⏳","double_vertical_bar":"⏸","black_square_for_stop":"⏹","black_circle_for_record":"⏺","m":"Ⓜ️","black_small_square":"▪️","white_small_square":"▫️","arrow_forward":"▶️","arrow_backward":"◀️","white_medium_square":"◻️","black_medium_square":"◼️","white_medium_small_square":"◽️","black_medium_small_square":"◾️","phone":"☎️","telephone":"☎️","point_up":"☝️","star_and_crescent":"☪","peace_symbol":"☮","yin_yang":"☯","relaxed":"☺️","gemini":"♊️","cancer":"♋️","leo":"♌️","virgo":"♍️","libra":"♎️","scorpius":"♏️","recycle":"♻️","wheelchair":"♿️","atom_symbol":"⚛","fleur_de_lis":"⚜","warning":"⚠️","zap":"⚡️","white_circle":"⚪️","black_circle":"⚫️","coffin":"⚰","funeral_urn":"⚱","soccer":"⚽️","baseball":"⚾️","snowman":"⛄️","partly_sunny":"⛅️","thunder_cloud_and_rain":"⛈","ophiuchus":"⛎","pick":"⛏","helmet_with_white_cross":"⛑","chains":"⛓","no_entry":"⛔️","shinto_shrine":"⛩","church":"⛪️","mountain":"⛰","umbrella_on_ground":"⛱","fountain":"⛲️","golf":"⛳️","ferry":"⛴","boat":"⛵️","sailboat":"⛵️","skier":"⛷","ice_skate":"⛸","person_with_ball":"⛹","tent":"⛺️","fuelpump":"⛽️","fist":"✊","hand":"✋","raised_hand":"✋","v":"✌️","writing_hand":"✍","pencil2":"✏️","latin_cross":"✝","x":"❌","negative_squared_cross_mark":"❎","arrow_right":"➡️","curly_loop":"➰","loop":"➿","arrow_left":"⬅️","arrow_up":"⬆️","arrow_down":"⬇️","black_large_square":"⬛️","white_large_square":"⬜️","star":"⭐️","o":"⭕️","part_alternation_mark":"〽️","mahjong":"🀄️","black_joker":"🃏","a":"🅰️","b":"🅱️","o2":"🅾️","parking":"🅿️","ab":"🆎","cl":"🆑","cool":"🆒","free":"🆓","id":"🆔","new":"🆕","ng":"🆖","ok":"🆗","sos":"🆘","up":"🆙","vs":"🆚","koko":"🈁","sa":"🈂️","u7121":"🈚️","u6307":"🈯️","u7981":"🈲","u7a7a":"🈳","u5408":"🈴","u6e80":"🈵","u6709":"🈶","u6708":"🈷️","u7533":"🈸","u5272":"🈹","u55b6":"🈺","ideograph_advantage":"🉐","accept":"🉑","cyclone":"🌀","foggy":"🌁","closed_umbrella":"🌂","night_with_stars":"🌃","sunrise_over_mountains":"🌄","sunrise":"🌅","city_sunset":"🌆","city_sunrise":"🌇","rainbow":"🌈","bridge_at_night":"🌉","ocean":"🌊","volcano":"🌋","milky_way":"🌌","earth_africa":"🌍","earth_americas":"🌎","earth_asia":"🌏","globe_with_meridians":"🌐","new_moon":"🌑","waxing_crescent_moon":"🌒","first_quarter_moon":"🌓","moon":"🌔","waxing_gibbous_moon":"🌔","full_moon":"🌕","waning_gibbous_moon":"🌖","last_quarter_moon":"🌗","waning_crescent_moon":"🌘","crescent_moon":"🌙","new_moon_with_face":"🌚","first_quarter_moon_with_face":"🌛","last_quarter_moon_with_face":"🌜","full_moon_with_face":"🌝","sun_with_face":"🌞","star2":"🌟","stars":"🌠","thermometer":"🌡","mostly_sunny":"🌤","sun_small_cloud":"🌤","barely_sunny":"🌥","sun_behind_cloud":"🌥","partly_sunny_rain":"🌦","sun_behind_rain_cloud":"🌦","rain_cloud":"🌧","snow_cloud":"🌨","lightning":"🌩","lightning_cloud":"🌩","tornado":"🌪","tornado_cloud":"🌪","fog":"🌫","wind_blowing_face":"🌬","hotdog":"🌭","taco":"🌮","burrito":"🌯","chestnut":"🌰","seedling":"🌱","evergreen_tree":"🌲","deciduous_tree":"🌳","palm_tree":"🌴","cactus":"🌵","hot_pepper":"🌶","tulip":"🌷","cherry_blossom":"🌸","rose":"🌹","hibiscus":"🌺","sunflower":"🌻","blossom":"🌼","corn":"🌽","ear_of_rice":"🌾","herb":"🌿","four_leaf_clover":"🍀","maple_leaf":"🍁","fallen_leaf":"🍂","leaves":"🍃","mushroom":"🍄","tomato":"🍅","eggplant":"🍆","grapes":"🍇","melon":"🍈","watermelon":"🍉","tangerine":"🍊","lemon":"🍋","banana":"🍌","pineapple":"🍍","apple":"🍎","green_apple":"🍏","pear":"🍐","peach":"🍑","cherries":"🍒","strawberry":"🍓","hamburger":"🍔","pizza":"🍕","meat_on_bone":"🍖","poultry_leg":"🍗","rice_cracker":"🍘","rice_ball":"🍙","rice":"🍚","curry":"🍛","ramen":"🍜","spaghetti":"🍝","bread":"🍞","fries":"🍟","sweet_potato":"🍠","dango":"🍡","oden":"🍢","sushi":"🍣","fried_shrimp":"🍤","fish_cake":"🍥","icecream":"🍦","shaved_ice":"🍧","ice_cream":"🍨","doughnut":"🍩","cookie":"🍪","chocolate_bar":"🍫","candy":"🍬","lollipop":"🍭","custard":"🍮","honey_pot":"🍯","cake":"🍰","bento":"🍱","stew":"🍲","egg":"🍳","fork_and_knife":"🍴","tea":"🍵","sake":"🍶","wine_glass":"🍷","cocktail":"🍸","tropical_drink":"🍹","beer":"🍺","beers":"🍻","baby_bottle":"🍼","knife_fork_plate":"🍽","champagne":"🍾","popcorn":"🍿","ribbon":"🎀","gift":"🎁","birthday":"🎂","jack_o_lantern":"🎃","christmas_tree":"🎄","santa":"🎅","fireworks":"🎆","sparkler":"🎇","balloon":"🎈","tada":"🎉","confetti_ball":"🎊","tanabata_tree":"🎋","crossed_flags":"🎌","bamboo":"🎍","dolls":"🎎","flags":"🎏","wind_chime":"🎐","rice_scene":"🎑","school_satchel":"🎒","mortar_board":"🎓","medal":"🎖","reminder_ribbon":"🎗","studio_microphone":"🎙","level_slider":"🎚","control_knobs":"🎛","film_frames":"🎞","admission_tickets":"🎟","carousel_horse":"🎠","ferris_wheel":"🎡","roller_coaster":"🎢","fishing_pole_and_fish":"🎣","microphone":"🎤","movie_camera":"🎥","cinema":"🎦","headphones":"🎧","art":"🎨","tophat":"🎩","circus_tent":"🎪","ticket":"🎫","clapper":"🎬","performing_arts":"🎭","video_game":"🎮","dart":"🎯","slot_machine":"🎰","8ball":"🎱","game_die":"🎲","bowling":"🎳","flower_playing_cards":"🎴","musical_note":"🎵","notes":"🎶","saxophone":"🎷","guitar":"🎸","musical_keyboard":"🎹","trumpet":"🎺","violin":"🎻","musical_score":"🎼","running_shirt_with_sash":"🎽","tennis":"🎾","ski":"🎿","basketball":"🏀","checkered_flag":"🏁","snowboarder":"🏂","runner":"🏃","running":"🏃","surfer":"🏄","sports_medal":"🏅","trophy":"🏆","horse_racing":"🏇","football":"🏈","rugby_football":"🏉","swimmer":"🏊","weight_lifter":"🏋","golfer":"🏌","racing_motorcycle":"🏍","racing_car":"🏎","cricket_bat_and_ball":"🏏","volleyball":"🏐","field_hockey_stick_and_ball":"🏑","ice_hockey_stick_and_puck":"🏒","table_tennis_paddle_and_ball":"🏓","snow_capped_mountain":"🏔","camping":"🏕","beach_with_umbrella":"🏖","building_construction":"🏗","house_buildings":"🏘","cityscape":"🏙","derelict_house_building":"🏚","classical_building":"🏛","desert":"🏜","desert_island":"🏝","national_park":"🏞","stadium":"🏟","house":"🏠","house_with_garden":"🏡","office":"🏢","post_office":"🏣","european_post_office":"🏤","hospital":"🏥","bank":"🏦","atm":"🏧","hotel":"🏨","love_hotel":"🏩","convenience_store":"🏪","school":"🏫","department_store":"🏬","factory":"🏭","izakaya_lantern":"🏮","lantern":"🏮","japanese_castle":"🏯","european_castle":"🏰","waving_white_flag":"🏳","waving_black_flag":"🏴","rosette":"🏵","label":"🏷","badminton_racquet_and_shuttlecock":"🏸","bow_and_arrow":"🏹","amphora":"🏺","skin-tone-2":"🏻","skin-tone-3":"🏼","skin-tone-4":"🏽","skin-tone-5":"🏾","skin-tone-6":"🏿","rat":"🐀","mouse2":"🐁","ox":"🐂","water_buffalo":"🐃","cow2":"🐄","tiger2":"🐅","leopard":"🐆","rabbit2":"🐇","cat2":"🐈","dragon":"🐉","crocodile":"🐊","whale2":"🐋","snail":"🐌","snake":"🐍","racehorse":"🐎","ram":"🐏","goat":"🐐","sheep":"🐑","monkey":"🐒","rooster":"🐓","chicken":"🐔","dog2":"🐕","pig2":"🐖","boar":"🐗","elephant":"🐘","octopus":"🐙","shell":"🐚","bug":"🐛","ant":"🐜","bee":"🐝","honeybee":"🐝","beetle":"🐞","fish":"🐟","tropical_fish":"🐠","blowfish":"🐡","turtle":"🐢","hatching_chick":"🐣","baby_chick":"🐤","hatched_chick":"🐥","bird":"🐦","penguin":"🐧","koala":"🐨","poodle":"🐩","dromedary_camel":"🐪","camel":"🐫","dolphin":"🐬","flipper":"🐬","mouse":"🐭","cow":"🐮","tiger":"🐯","rabbit":"🐰","cat":"🐱","dragon_face":"🐲","whale":"🐳","horse":"🐴","monkey_face":"🐵","dog":"🐶","pig":"🐷","frog":"🐸","hamster":"🐹","wolf":"🐺","bear":"🐻","panda_face":"🐼","pig_nose":"🐽","feet":"🐾","paw_prints":"🐾","chipmunk":"🐿","eyes":"👀","eye":"👁","ear":"👂","nose":"👃","lips":"👄","tongue":"👅","point_up_2":"👆","point_down":"👇","point_left":"👈","point_right":"👉","facepunch":"👊","punch":"👊","wave":"👋","ok_hand":"👌","+1":"👍","thumbsup":"👍","-1":"👎","thumbsdown":"👎","clap":"👏","open_hands":"👐","crown":"👑","womans_hat":"👒","eyeglasses":"👓","necktie":"👔","shirt":"👕","tshirt":"👕","jeans":"👖","dress":"👗","kimono":"👘","bikini":"👙","womans_clothes":"👚","purse":"👛","handbag":"👜","pouch":"👝","mans_shoe":"👞","shoe":"👞","athletic_shoe":"👟","high_heel":"👠","sandal":"👡","boot":"👢","footprints":"👣","bust_in_silhouette":"👤","busts_in_silhouette":"👥","boy":"👦","girl":"👧","man":"👨","woman":"👩","family":"👨‍👩‍👦","man-woman-boy":"👨‍👩‍👦","couple":"👫","man_and_woman_holding_hands":"👫","two_men_holding_hands":"👬","two_women_holding_hands":"👭","cop":"👮","dancers":"👯","bride_with_veil":"👰","person_with_blond_hair":"👱","man_with_gua_pi_mao":"👲","man_with_turban":"👳","older_man":"👴","older_woman":"👵","baby":"👶","construction_worker":"👷","princess":"👸","japanese_ogre":"👹","japanese_goblin":"👺","ghost":"👻","angel":"👼","alien":"👽","space_invader":"👾","imp":"👿","skull":"💀","information_desk_person":"💁","guardsman":"💂","dancer":"💃","lipstick":"💄","nail_care":"💅","massage":"💆","haircut":"💇","barber":"💈","syringe":"💉","pill":"💊","kiss":"💋","love_letter":"💌","ring":"💍","gem":"💎","couplekiss":"💏","bouquet":"💐","couple_with_heart":"💑","wedding":"💒","heartbeat":"💓","broken_heart":"💔","two_hearts":"💕","sparkling_heart":"💖","heartpulse":"💗","cupid":"💘","blue_heart":"💙","green_heart":"💚","yellow_heart":"💛","purple_heart":"💜","gift_heart":"💝","revolving_hearts":"💞","heart_decoration":"💟","diamond_shape_with_a_dot_inside":"💠","bulb":"💡","anger":"💢","bomb":"💣","zzz":"💤","boom":"💥","collision":"💥","sweat_drops":"💦","droplet":"💧","dash":"💨","hankey":"💩","poop":"💩","shit":"💩","muscle":"💪","dizzy":"💫","speech_balloon":"💬","thought_balloon":"💭","white_flower":"💮","moneybag":"💰","currency_exchange":"💱","heavy_dollar_sign":"💲","credit_card":"💳","yen":"💴","dollar":"💵","euro":"💶","pound":"💷","money_with_wings":"💸","chart":"💹","seat":"💺","computer":"💻","briefcase":"💼","minidisc":"💽","floppy_disk":"💾","cd":"💿","dvd":"📀","file_folder":"📁","open_file_folder":"📂","page_with_curl":"📃","page_facing_up":"📄","date":"📅","calendar":"📆","card_index":"📇","chart_with_upwards_trend":"📈","chart_with_downwards_trend":"📉","bar_chart":"📊","clipboard":"📋","pushpin":"📌","round_pushpin":"📍","paperclip":"📎","straight_ruler":"📏","triangular_ruler":"📐","bookmark_tabs":"📑","ledger":"📒","notebook":"📓","notebook_with_decorative_cover":"📔","closed_book":"📕","book":"📖","open_book":"📖","green_book":"📗","blue_book":"📘","orange_book":"📙","books":"📚","name_badge":"📛","scroll":"📜","memo":"📝","pencil":"📝","telephone_receiver":"📞","pager":"📟","fax":"📠","satellite":"🛰","loudspeaker":"📢","mega":"📣","outbox_tray":"📤","inbox_tray":"📥","package":"📦","e-mail":"📧","incoming_envelope":"📨","envelope_with_arrow":"📩","mailbox_closed":"📪","mailbox":"📫","mailbox_with_mail":"📬","mailbox_with_no_mail":"📭","postbox":"📮","postal_horn":"📯","newspaper":"📰","iphone":"📱","calling":"📲","vibration_mode":"📳","mobile_phone_off":"📴","no_mobile_phones":"📵","signal_strength":"📶","camera":"📷","camera_with_flash":"📸","video_camera":"📹","tv":"📺","radio":"📻","vhs":"📼","film_projector":"📽","prayer_beads":"📿","twisted_rightwards_arrows":"🔀","repeat":"🔁","repeat_one":"🔂","arrows_clockwise":"🔃","arrows_counterclockwise":"🔄","low_brightness":"🔅","high_brightness":"🔆","mute":"🔇","speaker":"🔈","sound":"🔉","loud_sound":"🔊","battery":"🔋","electric_plug":"🔌","mag":"🔍","mag_right":"🔎","lock_with_ink_pen":"🔏","closed_lock_with_key":"🔐","key":"🔑","lock":"🔒","unlock":"🔓","bell":"🔔","no_bell":"🔕","bookmark":"🔖","link":"🔗","radio_button":"🔘","back":"🔙","end":"🔚","on":"🔛","soon":"🔜","top":"🔝","underage":"🔞","keycap_ten":"🔟","capital_abcd":"🔠","abcd":"🔡","symbols":"🔣","abc":"🔤","fire":"🔥","flashlight":"🔦","wrench":"🔧","hammer":"🔨","nut_and_bolt":"🔩","hocho":"🔪","knife":"🔪","gun":"🔫","microscope":"🔬","telescope":"🔭","crystal_ball":"🔮","six_pointed_star":"🔯","beginner":"🔰","trident":"🔱","black_square_button":"🔲","white_square_button":"🔳","red_circle":"🔴","large_blue_circle":"🔵","large_orange_diamond":"🔶","large_blue_diamond":"🔷","small_orange_diamond":"🔸","small_blue_diamond":"🔹","small_red_triangle":"🔺","small_red_triangle_down":"🔻","arrow_up_small":"🔼","arrow_down_small":"🔽","om_symbol":"🕉","dove_of_peace":"🕊","kaaba":"🕋","mosque":"🕌","synagogue":"🕍","menorah_with_nine_branches":"🕎","clock1":"🕐","clock2":"🕑","clock3":"🕒","clock4":"🕓","clock5":"🕔","clock6":"🕕","clock7":"🕖","clock8":"🕗","clock9":"🕘","clock10":"🕙","clock11":"🕚","clock12":"🕛","clock130":"🕜","clock230":"🕝","clock330":"🕞","clock430":"🕟","clock530":"🕠","clock630":"🕡","clock730":"🕢","clock830":"🕣","clock930":"🕤","clock1030":"🕥","clock1130":"🕦","clock1230":"🕧","candle":"🕯","mantelpiece_clock":"🕰","hole":"🕳","man_in_business_suit_levitating":"🕴","sleuth_or_spy":"🕵","dark_sunglasses":"🕶","spider":"🕷","spider_web":"🕸","joystick":"🕹","linked_paperclips":"🖇","lower_left_ballpoint_pen":"🖊","lower_left_fountain_pen":"🖋","lower_left_paintbrush":"🖌","lower_left_crayon":"🖍","raised_hand_with_fingers_splayed":"🖐","middle_finger":"🖕","reversed_hand_with_middle_finger_extended":"🖕","spock-hand":"🖖","desktop_computer":"🖥","printer":"🖨","three_button_mouse":"🖱","trackball":"🖲","frame_with_picture":"🖼","card_index_dividers":"🗂","card_file_box":"🗃","file_cabinet":"🗄","wastebasket":"🗑","spiral_note_pad":"🗒","spiral_calendar_pad":"🗓","compression":"🗜","old_key":"🗝","rolled_up_newspaper":"🗞","dagger_knife":"🗡","speaking_head_in_silhouette":"🗣","left_speech_bubble":"🗨","right_anger_bubble":"🗯","ballot_box_with_ballot":"🗳","world_map":"🗺","mount_fuji":"🗻","tokyo_tower":"🗼","statue_of_liberty":"🗽","japan":"🗾","moyai":"🗿","grinning":"😀","grin":"😁","joy":"😂","smiley":"😃","smile":"😄","sweat_smile":"😅","laughing":"😆","satisfied":"😆","innocent":"😇","smiling_imp":"😈","wink":"😉","blush":"😊","yum":"😋","relieved":"😌","heart_eyes":"😍","sunglasses":"😎","smirk":"😏","neutral_face":"😐","expressionless":"😑","unamused":"😒","sweat":"😓","pensive":"😔","confused":"😕","confounded":"😖","kissing":"😗","kissing_heart":"😘","kissing_smiling_eyes":"😙","kissing_closed_eyes":"😚","stuck_out_tongue":"😛","stuck_out_tongue_winking_eye":"😜","stuck_out_tongue_closed_eyes":"😝","disappointed":"😞","worried":"😟","angry":"😠","rage":"😡","cry":"😢","persevere":"😣","triumph":"😤","disappointed_relieved":"😥","frowning":"😦","anguished":"😧","fearful":"😨","weary":"😩","sleepy":"😪","tired_face":"😫","grimacing":"😬","sob":"😭","open_mouth":"😮","hushed":"😯","cold_sweat":"😰","scream":"😱","astonished":"😲","flushed":"😳","sleeping":"😴","dizzy_face":"😵","no_mouth":"😶","mask":"😷","smile_cat":"😸","joy_cat":"😹","smiley_cat":"😺","heart_eyes_cat":"😻","smirk_cat":"😼","kissing_cat":"😽","pouting_cat":"😾","crying_cat_face":"😿","scream_cat":"🙀","slightly_frowning_face":"🙁","slightly_smiling_face":"🙂","upside_down_face":"🙃","face_with_rolling_eyes":"🙄","no_good":"🙅","ok_woman":"🙆","bow":"🙇","see_no_evil":"🙈","hear_no_evil":"🙉","speak_no_evil":"🙊","raising_hand":"🙋","raised_hands":"🙌","person_frowning":"🙍","person_with_pouting_face":"🙎","pray":"🙏","rocket":"🚀","helicopter":"🚁","steam_locomotive":"🚂","railway_car":"🚃","bullettrain_side":"🚄","bullettrain_front":"🚅","train2":"🚆","metro":"🚇","light_rail":"🚈","station":"🚉","tram":"🚊","train":"🚋","bus":"🚌","oncoming_bus":"🚍","trolleybus":"🚎","busstop":"🚏","minibus":"🚐","ambulance":"🚑","fire_engine":"🚒","police_car":"🚓","oncoming_police_car":"🚔","taxi":"🚕","oncoming_taxi":"🚖","car":"🚗","red_car":"🚗","oncoming_automobile":"🚘","blue_car":"🚙","truck":"🚚","articulated_lorry":"🚛","tractor":"🚜","monorail":"🚝","mountain_railway":"🚞","suspension_railway":"🚟","mountain_cableway":"🚠","aerial_tramway":"🚡","ship":"🚢","rowboat":"🚣","speedboat":"🚤","traffic_light":"🚥","vertical_traffic_light":"🚦","construction":"🚧","rotating_light":"🚨","triangular_flag_on_post":"🚩","door":"🚪","no_entry_sign":"🚫","smoking":"🚬","no_smoking":"🚭","put_litter_in_its_place":"🚮","do_not_litter":"🚯","potable_water":"🚰","non-potable_water":"🚱","bike":"🚲","no_bicycles":"🚳","bicyclist":"🚴","mountain_bicyclist":"🚵","walking":"🚶","no_pedestrians":"🚷","children_crossing":"🚸","mens":"🚹","womens":"🚺","restroom":"🚻","baby_symbol":"🚼","toilet":"🚽","wc":"🚾","shower":"🚿","bath":"🛀","bathtub":"🛁","passport_control":"🛂","customs":"🛃","baggage_claim":"🛄","left_luggage":"🛅","couch_and_lamp":"🛋","sleeping_accommodation":"🛌","shopping_bags":"🛍","bellhop_bell":"🛎","bed":"🛏","place_of_worship":"🛐","hammer_and_wrench":"🛠","shield":"🛡","oil_drum":"🛢","motorway":"🛣","railway_track":"🛤","motor_boat":"🛥","small_airplane":"🛩","airplane_departure":"🛫","airplane_arriving":"🛬","passenger_ship":"🛳","zipper_mouth_face":"🤐","money_mouth_face":"🤑","face_with_thermometer":"🤒","nerd_face":"🤓","thinking_face":"🤔","face_with_head_bandage":"🤕","robot_face":"🤖","hugging_face":"🤗","the_horns":"🤘","sign_of_the_horns":"🤘","crab":"🦀","lion_face":"🦁","scorpion":"🦂","turkey":"🦃","unicorn_face":"🦄","cheese_wedge":"🧀","hash":"#️⃣","keycap_star":"*⃣","zero":"0️⃣","one":"1️⃣","two":"2️⃣","three":"3️⃣","four":"4️⃣","five":"5️⃣","six":"6️⃣","seven":"7️⃣","eight":"8️⃣","nine":"9️⃣","flag-ac":"🇦🇨","flag-ad":"🇦🇩","flag-ae":"🇦🇪","flag-af":"🇦🇫","flag-ag":"🇦🇬","flag-ai":"🇦🇮","flag-al":"🇦🇱","flag-am":"🇦🇲","flag-ao":"🇦🇴","flag-aq":"🇦🇶","flag-ar":"🇦🇷","flag-as":"🇦🇸","flag-at":"🇦🇹","flag-au":"🇦🇺","flag-aw":"🇦🇼","flag-ax":"🇦🇽","flag-az":"🇦🇿","flag-ba":"🇧🇦","flag-bb":"🇧🇧","flag-bd":"🇧🇩","flag-be":"🇧🇪","flag-bf":"🇧🇫","flag-bg":"🇧🇬","flag-bh":"🇧🇭","flag-bi":"🇧🇮","flag-bj":"🇧🇯","flag-bl":"🇧🇱","flag-bm":"🇧🇲","flag-bn":"🇧🇳","flag-bo":"🇧🇴","flag-bq":"🇧🇶","flag-br":"🇧🇷","flag-bs":"🇧🇸","flag-bt":"🇧🇹","flag-bv":"🇧🇻","flag-bw":"🇧🇼","flag-by":"🇧🇾","flag-bz":"🇧🇿","flag-ca":"🇨🇦","flag-cc":"🇨🇨","flag-cd":"🇨🇩","flag-cf":"🇨🇫","flag-cg":"🇨🇬","flag-ch":"🇨🇭","flag-ci":"🇨🇮","flag-ck":"🇨🇰","flag-cl":"🇨🇱","flag-cm":"🇨🇲","flag-cn":"🇨🇳","cn":"🇨🇳","flag-co":"🇨🇴","flag-cp":"🇨🇵","flag-cr":"🇨🇷","flag-cu":"🇨🇺","flag-cv":"🇨🇻","flag-cw":"🇨🇼","flag-cx":"🇨🇽","flag-cy":"🇨🇾","flag-cz":"🇨🇿","flag-de":"🇩🇪","de":"🇩🇪","flag-dg":"🇩🇬","flag-dj":"🇩🇯","flag-dk":"🇩🇰","flag-dm":"🇩🇲","flag-do":"🇩🇴","flag-dz":"🇩🇿","flag-ea":"🇪🇦","flag-ec":"🇪🇨","flag-ee":"🇪🇪","flag-eg":"🇪🇬","flag-eh":"🇪🇭","flag-er":"🇪🇷","flag-es":"🇪🇸","es":"🇪🇸","flag-et":"🇪🇹","flag-eu":"🇪🇺","flag-fi":"🇫🇮","flag-fj":"🇫🇯","flag-fk":"🇫🇰","flag-fm":"🇫🇲","flag-fo":"🇫🇴","flag-fr":"🇫🇷","fr":"🇫🇷","flag-ga":"🇬🇦","flag-gb":"🇬🇧","gb":"🇬🇧","uk":"🇬🇧","flag-gd":"🇬🇩","flag-ge":"🇬🇪","flag-gf":"🇬🇫","flag-gg":"🇬🇬","flag-gh":"🇬🇭","flag-gi":"🇬🇮","flag-gl":"🇬🇱","flag-gm":"🇬🇲","flag-gn":"🇬🇳","flag-gp":"🇬🇵","flag-gq":"🇬🇶","flag-gr":"🇬🇷","flag-gs":"🇬🇸","flag-gt":"🇬🇹","flag-gu":"🇬🇺","flag-gw":"🇬🇼","flag-gy":"🇬🇾","flag-hk":"🇭🇰","flag-hm":"🇭🇲","flag-hn":"🇭🇳","flag-hr":"🇭🇷","flag-ht":"🇭🇹","flag-hu":"🇭🇺","flag-ic":"🇮🇨","flag-id":"🇮🇩","flag-ie":"🇮🇪","flag-il":"🇮🇱","flag-im":"🇮🇲","flag-in":"🇮🇳","flag-io":"🇮🇴","flag-iq":"🇮🇶","flag-ir":"🇮🇷","flag-is":"🇮🇸","flag-it":"🇮🇹","it":"🇮🇹","flag-je":"🇯🇪","flag-jm":"🇯🇲","flag-jo":"🇯🇴","flag-jp":"🇯🇵","jp":"🇯🇵","flag-ke":"🇰🇪","flag-kg":"🇰🇬","flag-kh":"🇰🇭","flag-ki":"🇰🇮","flag-km":"🇰🇲","flag-kn":"🇰🇳","flag-kp":"🇰🇵","flag-kr":"🇰🇷","kr":"🇰🇷","flag-kw":"🇰🇼","flag-ky":"🇰🇾","flag-kz":"🇰🇿","flag-la":"🇱🇦","flag-lb":"🇱🇧","flag-lc":"🇱🇨","flag-li":"🇱🇮","flag-lk":"🇱🇰","flag-lr":"🇱🇷","flag-ls":"🇱🇸","flag-lt":"🇱🇹","flag-lu":"🇱🇺","flag-lv":"🇱🇻","flag-ly":"🇱🇾","flag-ma":"🇲🇦","flag-mc":"🇲🇨","flag-md":"🇲🇩","flag-me":"🇲🇪","flag-mf":"🇲🇫","flag-mg":"🇲🇬","flag-mh":"🇲🇭","flag-mk":"🇲🇰","flag-ml":"🇲🇱","flag-mm":"🇲🇲","flag-mn":"🇲🇳","flag-mo":"🇲🇴","flag-mp":"🇲🇵","flag-mq":"🇲🇶","flag-mr":"🇲🇷","flag-ms":"🇲🇸","flag-mt":"🇲🇹","flag-mu":"🇲🇺","flag-mv":"🇲🇻","flag-mw":"🇲🇼","flag-mx":"🇲🇽","flag-my":"🇲🇾","flag-mz":"🇲🇿","flag-na":"🇳🇦","flag-nc":"🇳🇨","flag-ne":"🇳🇪","flag-nf":"🇳🇫","flag-ng":"🇳🇬","flag-ni":"🇳🇮","flag-nl":"🇳🇱","flag-no":"🇳🇴","flag-np":"🇳🇵","flag-nr":"🇳🇷","flag-nu":"🇳🇺","flag-nz":"🇳🇿","flag-om":"🇴🇲","flag-pa":"🇵🇦","flag-pe":"🇵🇪","flag-pf":"🇵🇫","flag-pg":"🇵🇬","flag-ph":"🇵🇭","flag-pk":"🇵🇰","flag-pl":"🇵🇱","flag-pm":"🇵🇲","flag-pn":"🇵🇳","flag-pr":"🇵🇷","flag-ps":"🇵🇸","flag-pt":"🇵🇹","flag-pw":"🇵🇼","flag-py":"🇵🇾","flag-qa":"🇶🇦","flag-re":"🇷🇪","flag-ro":"🇷🇴","flag-rs":"🇷🇸","flag-ru":"🇷🇺","ru":"🇷🇺","flag-rw":"🇷🇼","flag-sa":"🇸🇦","flag-sb":"🇸🇧","flag-sc":"🇸🇨","flag-sd":"🇸🇩","flag-se":"🇸🇪","flag-sg":"🇸🇬","flag-sh":"🇸🇭","flag-si":"🇸🇮","flag-sj":"🇸🇯","flag-sk":"🇸🇰","flag-sl":"🇸🇱","flag-sm":"🇸🇲","flag-sn":"🇸🇳","flag-so":"🇸🇴","flag-sr":"🇸🇷","flag-ss":"🇸🇸","flag-st":"🇸🇹","flag-sv":"🇸🇻","flag-sx":"🇸🇽","flag-sy":"🇸🇾","flag-sz":"🇸🇿","flag-ta":"🇹🇦","flag-tc":"🇹🇨","flag-td":"🇹🇩","flag-tf":"🇹🇫","flag-tg":"🇹🇬","flag-th":"🇹🇭","flag-tj":"🇹🇯","flag-tk":"🇹🇰","flag-tl":"🇹🇱","flag-tm":"🇹🇲","flag-tn":"🇹🇳","flag-to":"🇹🇴","flag-tr":"🇹🇷","flag-tt":"🇹🇹","flag-tv":"🇹🇻","flag-tw":"🇹🇼","flag-tz":"🇹🇿","flag-ua":"🇺🇦","flag-ug":"🇺🇬","flag-um":"🇺🇲","flag-us":"🇺🇸","us":"🇺🇸","flag-uy":"🇺🇾","flag-uz":"🇺🇿","flag-va":"🇻🇦","flag-vc":"🇻🇨","flag-ve":"🇻🇪","flag-vg":"🇻🇬","flag-vi":"🇻🇮","flag-vn":"🇻🇳","flag-vu":"🇻🇺","flag-wf":"🇼🇫","flag-ws":"🇼🇸","flag-xk":"🇽🇰","flag-ye":"🇾🇪","flag-yt":"🇾🇹","flag-za":"🇿🇦","flag-zm":"🇿🇲","flag-zw":"🇿🇼","man-man-boy":"👨‍👨‍👦","man-man-boy-boy":"👨‍👨‍👦‍👦","man-man-girl":"👨‍👨‍👧","man-man-girl-boy":"👨‍👨‍👧‍👦","man-man-girl-girl":"👨‍👨‍👧‍👧","man-woman-boy-boy":"👨‍👩‍👦‍👦","man-woman-girl":"👨‍👩‍👧","man-woman-girl-boy":"👨‍👩‍👧‍👦","man-woman-girl-girl":"👨‍👩‍👧‍👧","man-heart-man":"👨‍❤️‍👨","man-kiss-man":"👨‍❤️‍💋‍👨","woman-woman-boy":"👩‍👩‍👦","woman-woman-boy-boy":"👩‍👩‍👦‍👦","woman-woman-girl":"👩‍👩‍👧","woman-woman-girl-boy":"👩‍👩‍👧‍👦","woman-woman-girl-girl":"👩‍👩‍👧‍👧","woman-heart-woman":"👩‍❤️‍👩","woman-kiss-woman":"👩‍❤️‍💋‍👩"}

/***/ }),

/***/ "../node_modules/wemoji/index.js":
/***/ (function(module, exports, __webpack_require__) {

var unicode = __webpack_require__("../node_modules/wemoji/lib/wemoji.json")
var name = {}

for ( emoji in unicode ) {

  var data = unicode[ emoji ]

  // Create name map
  name[ data.name ] = data

  // Add variations to index
  if (data.variations) {
    for (i in data.variations) {
      var variation = data.variations[i]
      unicode[ variation ] = data
    }
  }

}

exports.unicode = unicode
exports.name = name


/***/ }),

/***/ "../node_modules/wemoji/lib/wemoji.json":
/***/ (function(module, exports) {

module.exports = {"©️":{"emoji":"©️","platforms":["a","g"],"description":"COPYRIGHT SIGN","name":"copyright","css":"copyright","variations":["©"]},"®️":{"emoji":"®️","platforms":["a","g"],"description":"REGISTERED SIGN","name":"registered","css":"registered","variations":["®"]},"‼️":{"emoji":"‼️","platforms":["tw","a","g"],"description":"DOUBLE EXCLAMATION MARK","name":"bangbang","css":"bangbang","variations":["‼"]},"⁉️":{"emoji":"⁉️","platforms":["tw","a","g"],"description":"EXCLAMATION QUESTION MARK","name":"interrobang","css":"interrobang","variations":["⁉"]},"™️":{"emoji":"™️","platforms":["tw","a","g"],"description":"TRADE MARK SIGN","name":"tm","css":"tm","variations":["™"]},"ℹ️":{"emoji":"ℹ️","platforms":["tw","a","g"],"description":"INFORMATION SOURCE","name":"information_source","css":"information_source","variations":["ℹ"]},"↔️":{"emoji":"↔️","platforms":["tw","a","g"],"description":"LEFT RIGHT ARROW","name":"left_right_arrow","css":"left_right_arrow","variations":["↔"]},"↕️":{"emoji":"↕️","platforms":["tw","a","g"],"description":"UP DOWN ARROW","name":"arrow_up_down","css":"arrow_up_down","variations":["↕"]},"↖️":{"emoji":"↖️","platforms":["tw","a","g"],"description":"NORTH WEST ARROW","name":"arrow_upper_left","css":"arrow_upper_left","variations":["↖"]},"↗️":{"emoji":"↗️","platforms":["tw","a","g"],"description":"NORTH EAST ARROW","name":"arrow_upper_right","css":"arrow_upper_right","variations":["↗"]},"↘️":{"emoji":"↘️","platforms":["tw","a","g"],"description":"SOUTH EAST ARROW","name":"arrow_lower_right","css":"arrow_lower_right","variations":["↘"]},"↙️":{"emoji":"↙️","platforms":["tw","a","g"],"description":"SOUTH WEST ARROW","name":"arrow_lower_left","css":"arrow_lower_left","variations":["↙"]},"↩️":{"emoji":"↩️","platforms":["tw","a","g"],"description":"LEFTWARDS ARROW WITH HOOK","name":"leftwards_arrow_with_hook","css":"leftwards_arrow_with_hook","variations":["↩"]},"↪️":{"emoji":"↪️","platforms":["tw","a","g"],"description":"RIGHTWARDS ARROW WITH HOOK","name":"arrow_right_hook","css":"arrow_right_hook","variations":["↪"]},"⌚️":{"emoji":"⌚️","platforms":["tw","a","g"],"description":"WATCH","name":"watch","css":"watch","variations":["⌚"]},"⌛️":{"emoji":"⌛️","platforms":["tw","a","g"],"description":"HOURGLASS","name":"hourglass","css":"hourglass","variations":["⌛"]},"⏩":{"emoji":"⏩","platforms":["tw","a","g"],"description":"BLACK RIGHT-POINTING DOUBLE TRIANGLE","name":"fast_forward","css":"fast_forward"},"⏪":{"emoji":"⏪","platforms":["tw","a","g"],"description":"BLACK LEFT-POINTING DOUBLE TRIANGLE","name":"rewind","css":"rewind","category":"thing"},"⏫":{"emoji":"⏫","platforms":["tw","a","g"],"description":"BLACK UP-POINTING DOUBLE TRIANGLE","name":"arrow_double_up","css":"arrow_double_up","category":"folderol"},"⏬":{"emoji":"⏬","platforms":["tw","a","g"],"description":"BLACK DOWN-POINTING DOUBLE TRIANGLE","name":"arrow_double_down","css":"arrow_double_down","category":"folderol"},"⏰":{"emoji":"⏰","platforms":["tw","a","g"],"description":"ALARM CLOCK","name":"alarm_clock","css":"alarm_clock","category":"thing"},"⏳":{"emoji":"⏳","platforms":["tw","a","g"],"description":"HOURGLASS WITH FLOWING SAND","name":"hourglass_flowing_sand","css":"hourglass_flowing_sand","category":"thing"},"Ⓜ️":{"emoji":"Ⓜ️","platforms":["tw","a","g"],"description":"CIRCLED LATIN CAPITAL LETTER M","name":"m","css":"m","variations":["Ⓜ"]},"▪️":{"emoji":"▪️","platforms":["tw","a","g"],"description":"BLACK SMALL SQUARE","name":"black_small_square","css":"black_small_square","variations":["▪"]},"▫️":{"emoji":"▫️","platforms":["tw","a","g"],"description":"WHITE SMALL SQUARE","name":"white_small_square","css":"white_small_square","variations":["▫"]},"▶️":{"emoji":"▶️","platforms":["tw","a","g"],"description":"BLACK RIGHT-POINTING TRIANGLE","name":"arrow_forward","css":"arrow_forward","variations":["▶"]},"◀️":{"emoji":"◀️","platforms":["tw","a","g"],"description":"BLACK LEFT-POINTING TRIANGLE","name":"arrow_backward","css":"arrow_backward","variations":["◀"]},"◻️":{"emoji":"◻️","platforms":["tw","a","g"],"description":"WHITE MEDIUM SQUARE","name":"white_medium_square","css":"white_medium_square","variations":["◻"]},"◼️":{"emoji":"◼️","platforms":["tw","a","g"],"description":"BLACK MEDIUM SQUARE","name":"black_medium_square","css":"black_medium_square","variations":["◼"]},"◽️":{"emoji":"◽️","platforms":["tw","a","g"],"description":"WHITE MEDIUM SMALL SQUARE","name":"white_medium_small_square","css":"white_medium_small_square","variations":["◽"]},"◾️":{"emoji":"◾️","platforms":["tw","a","g"],"description":"BLACK MEDIUM SMALL SQUARE","name":"black_medium_small_square","css":"black_medium_small_square","variations":["◾"]},"☀️":{"emoji":"☀️","platforms":["tw","a","g"],"description":"BLACK SUN WITH RAYS","name":"sunny","css":"sunny","variations":["☀"]},"☁️":{"emoji":"☁️","platforms":["tw","a","g"],"description":"CLOUD","name":"cloud","css":"cloud","variations":["☁"]},"☎️":{"emoji":"☎️","platforms":["tw","a","g"],"description":"BLACK TELEPHONE","name":"phone","css":"phone","variations":["☎"]},"☑️":{"emoji":"☑️","platforms":["tw","a","g"],"description":"BALLOT BOX WITH CHECK","name":"ballot_box_with_check","css":"ballot_box_with_check","variations":["☑"]},"☔️":{"emoji":"☔️","platforms":["tw","a","g"],"description":"UMBRELLA WITH RAIN DROPS","name":"umbrella","css":"umbrella","variations":["☔"]},"☕️":{"emoji":"☕️","platforms":["tw","a","g"],"description":"HOT BEVERAGE","name":"coffee","css":"coffee","variations":["☕"]},"☝️":{"emoji":"☝️","platforms":["tw","a","g"],"description":"WHITE UP POINTING INDEX","name":"point_up","css":"point_up","variations":["☝"]},"☺️":{"emoji":"☺️","platforms":["tw","a","g"],"description":"WHITE SMILING FACE","name":"relaxed","css":"relaxed","variations":["☺"]},"♈️":{"emoji":"♈️","platforms":["tw","a","g"],"description":"ARIES","name":"aries","css":"aries","variations":["♈"]},"♉️":{"emoji":"♉️","platforms":["tw","a","g"],"description":"TAURUS","name":"taurus","css":"taurus","variations":["♉"]},"♊️":{"emoji":"♊️","platforms":["tw","a","g"],"description":"GEMINI","name":"gemini","css":"gemini","variations":["♊"]},"♋️":{"emoji":"♋️","platforms":["tw","a","g"],"description":"CANCER","name":"cancer","css":"cancer","variations":["♋"]},"♌️":{"emoji":"♌️","platforms":["tw","a","g"],"description":"LEO","name":"leo","css":"leo","variations":["♌"]},"♍️":{"emoji":"♍️","platforms":["tw","a","g"],"description":"VIRGO","name":"virgo","css":"virgo","variations":["♍"]},"♎️":{"emoji":"♎️","platforms":["tw","a","g"],"description":"LIBRA","name":"libra","css":"libra","variations":["♎"]},"♏️":{"emoji":"♏️","platforms":["tw","a","g"],"description":"SCORPIUS","name":"scorpius","css":"scorpius","variations":["♏"]},"♐️":{"emoji":"♐️","platforms":["tw","a","g"],"description":"SAGITTARIUS","name":"sagittarius","css":"sagittarius","variations":["♐"]},"♑️":{"emoji":"♑️","platforms":["tw","a","g"],"description":"CAPRICORN","name":"capricorn","css":"capricorn","variations":["♑"]},"♒️":{"emoji":"♒️","platforms":["tw","a","g"],"description":"AQUARIUS","name":"aquarius","css":"aquarius","variations":["♒"]},"♓️":{"emoji":"♓️","platforms":["tw","a","g"],"description":"PISCES","name":"pisces","css":"pisces","variations":["♓"]},"♠️":{"emoji":"♠️","platforms":["tw","a","g"],"description":"BLACK SPADE SUIT","name":"spades","css":"spades","variations":["♠"]},"♣️":{"emoji":"♣️","platforms":["tw","a","g"],"description":"BLACK CLUB SUIT","name":"clubs","css":"clubs","variations":["♣"]},"♥️":{"emoji":"♥️","platforms":["tw","a","g"],"description":"BLACK HEART SUIT","name":"hearts","css":"hearts","variations":["♥"]},"♦️":{"emoji":"♦️","platforms":["tw","a","g"],"description":"BLACK DIAMOND SUIT","name":"diamonds","css":"diamonds","variations":["♦"]},"♨️":{"emoji":"♨️","platforms":["tw","a","g"],"description":"HOT SPRINGS","name":"hotsprings","css":"hotsprings","variations":["♨"]},"♻️":{"emoji":"♻️","platforms":["tw","a","g"],"description":"BLACK UNIVERSAL RECYCLING SYMBOL","name":"recycle","css":"recycle","variations":["♻"]},"♿️":{"emoji":"♿️","platforms":["tw","a","g"],"description":"WHEELCHAIR SYMBOL","name":"wheelchair","css":"wheelchair","variations":["♿"]},"⚓️":{"emoji":"⚓️","platforms":["tw","a","g"],"description":"ANCHOR","name":"anchor","css":"anchor","variations":["⚓"]},"⚠️":{"emoji":"⚠️","platforms":["tw","a","g"],"description":"WARNING SIGN","name":"warning","css":"warning","variations":["⚠"]},"⚡️":{"emoji":"⚡️","platforms":["tw","a","g"],"description":"HIGH VOLTAGE SIGN","name":"zap","css":"zap","variations":["⚡"]},"⚪️":{"emoji":"⚪️","platforms":["tw","a","g"],"description":"MEDIUM WHITE CIRCLE","name":"white_circle","css":"white_circle","variations":["⚪"]},"⚫️":{"emoji":"⚫️","platforms":["tw","a","g"],"description":"MEDIUM BLACK CIRCLE","name":"black_circle","css":"black_circle","variations":["⚫"]},"⚽️":{"emoji":"⚽️","platforms":["tw","a","g"],"description":"SOCCER BALL","name":"soccer","css":"soccer","variations":["⚽"]},"⚾️":{"emoji":"⚾️","platforms":["tw","a","g"],"description":"BASEBALL","name":"baseball","css":"baseball","variations":["⚾"]},"⛄️":{"emoji":"⛄️","platforms":["tw","a","g"],"description":"SNOWMAN WITHOUT SNOW","name":"snowman","css":"snowman","variations":["⛄"]},"⛅️":{"emoji":"⛅️","platforms":["tw","a","g"],"description":"SUN BEHIND CLOUD","name":"partly_sunny","css":"partly_sunny","variations":["⛅"]},"⛎":{"emoji":"⛎","platforms":["tw","a","g"],"description":"OPHIUCHUS","name":"ophiuchus","css":"ophiuchus","category":"folderol"},"⛔️":{"emoji":"⛔️","platforms":["tw","a","g"],"description":"NO ENTRY","name":"no_entry","css":"no_entry","variations":["⛔"]},"⛪️":{"emoji":"⛪️","platforms":["tw","a","g"],"description":"CHURCH","name":"church","css":"church","variations":["⛪"]},"⛲️":{"emoji":"⛲️","platforms":["tw","a","g"],"description":"FOUNTAIN","name":"fountain","css":"fountain","variations":["⛲"]},"⛳️":{"emoji":"⛳️","platforms":["tw","a","g"],"description":"FLAG IN HOLE","name":"golf","css":"golf","variations":["⛳"]},"⛵️":{"emoji":"⛵️","platforms":["tw","a","g"],"description":"SAILBOAT","name":"boat","css":"boat","variations":["⛵"]},"⛺️":{"emoji":"⛺️","platforms":["tw","a","g"],"description":"TENT","name":"tent","css":"tent","variations":["⛺"]},"⛽️":{"emoji":"⛽️","platforms":["tw","a","g"],"description":"FUEL PUMP","name":"fuelpump","css":"fuelpump","variations":["⛽"]},"✂️":{"emoji":"✂️","platforms":["tw","a","g"],"description":"BLACK SCISSORS","name":"scissors","css":"scissors","variations":["✂"]},"✅":{"emoji":"✅","platforms":["tw","a","g"],"description":"WHITE HEAVY CHECK MARK","name":"white_check_mark","css":"white_check_mark","category":"folderol"},"✈️":{"emoji":"✈️","platforms":["tw","a","g"],"description":"AIRPLANE","name":"airplane","css":"airplane","variations":["✈"]},"✉️":{"emoji":"✉️","platforms":["tw","a","g"],"description":"ENVELOPE","name":"email","css":"email","variations":["✉"]},"✊":{"emoji":"✊","platforms":["tw","a","g"],"description":"RAISED FIST","name":"fist","css":"fist","category":"people"},"✋":{"emoji":"✋","platforms":["tw","a","g"],"description":"RAISED HAND","name":"hand","css":"hand","category":"people"},"✌️":{"emoji":"✌️","platforms":["tw","a","g"],"description":"VICTORY HAND","name":"v","css":"v","variations":["✌"]},"✏️":{"emoji":"✏️","platforms":["tw","a","g"],"description":"PENCIL","name":"pencil2","css":"pencil2","variations":["✏"]},"✒️":{"emoji":"✒️","platforms":["tw","a","g"],"description":"BLACK NIB","name":"black_nib","css":"black_nib","variations":["✒"]},"✔️":{"emoji":"✔️","platforms":["tw","a","g"],"description":"HEAVY CHECK MARK","name":"heavy_check_mark","css":"heavy_check_mark","variations":["✔"]},"✖️":{"emoji":"✖️","platforms":["tw","a","g"],"description":"HEAVY MULTIPLICATION X","name":"heavy_multiplication_x","css":"heavy_multiplication_x","variations":["✖"]},"✨":{"emoji":"✨","platforms":["tw","a","g"],"description":"SPARKLES","name":"sparkles","css":"sparkles","category":"folderol"},"✳️":{"emoji":"✳️","platforms":["tw","a","g"],"description":"EIGHT SPOKED ASTERISK","name":"eight_spoked_asterisk","css":"eight_spoked_asterisk","variations":["✳"]},"✴️":{"emoji":"✴️","platforms":["tw","a","g"],"description":"EIGHT POINTED BLACK STAR","name":"eight_pointed_black_star","css":"eight_pointed_black_star","variations":["✴"]},"❄️":{"emoji":"❄️","platforms":["tw","a","g"],"description":"SNOWFLAKE","name":"snowflake","css":"snowflake","variations":["❄"]},"❇️":{"emoji":"❇️","platforms":["tw","a","g"],"description":"SPARKLE","name":"sparkle","css":"sparkle","variations":["❇"]},"❌":{"emoji":"❌","platforms":["tw","a","g"],"description":"CROSS MARK","name":"x","css":"x","category":"folderol"},"❎":{"emoji":"❎","platforms":["tw","a","g"],"description":"NEGATIVE SQUARED CROSS MARK","name":"negative_squared_cross_mark","css":"negative_squared_cross_mark","category":"folderol"},"❓":{"emoji":"❓","platforms":["tw","a","g"],"description":"BLACK QUESTION MARK ORNAMENT","name":"question","css":"question","category":"folderol"},"❔":{"emoji":"❔","platforms":["tw","a","g"],"description":"WHITE QUESTION MARK ORNAMENT","name":"grey_question","css":"grey_question","category":"folderol"},"❕":{"emoji":"❕","platforms":["tw","a","g"],"description":"WHITE EXCLAMATION MARK ORNAMENT","name":"grey_exclamation","css":"grey_exclamation","category":"folderol"},"❗️":{"emoji":"❗️","platforms":["tw","a","g"],"description":"HEAVY EXCLAMATION MARK SYMBOL","name":"exclamation","css":"exclamation","variations":["❗"]},"❤️":{"emoji":"❤️","platforms":["tw","a","g"],"description":"HEAVY BLACK HEART","name":"heart","css":"heart","variations":["❤"]},"➕":{"emoji":"➕","platforms":["tw","a","g"],"description":"HEAVY PLUS SIGN","name":"heavy_plus_sign","css":"heavy_plus_sign","category":"folderol"},"➖":{"emoji":"➖","platforms":["tw","a","g"],"description":"HEAVY MINUS SIGN","name":"heavy_minus_sign","css":"heavy_minus_sign","category":"folderol"},"➗":{"emoji":"➗","platforms":["tw","a","g"],"description":"HEAVY DIVISION SIGN","name":"heavy_division_sign","css":"heavy_division_sign","category":"folderol"},"➡️":{"emoji":"➡️","platforms":["tw","a","g"],"description":"BLACK RIGHTWARDS ARROW","name":"arrow_right","css":"arrow_right","variations":["➡"]},"➰":{"emoji":"➰","platforms":["tw","a","g"],"description":"CURLY LOOP","name":"curly_loop","css":"curly_loop","category":"folderol"},"➿":{"emoji":"➿","platforms":["tw","a","g"],"description":"DOUBLE CURLY LOOP","name":"loop","css":"loop","category":"folderol"},"⤴️":{"emoji":"⤴️","platforms":["tw","a","g"],"description":"ARROW POINTING RIGHTWARDS THEN CURVING UPWARDS","name":"arrow_heading_up","css":"arrow_heading_up","variations":["⤴"]},"⤵️":{"emoji":"⤵️","platforms":["tw","a","g"],"description":"ARROW POINTING RIGHTWARDS THEN CURVING DOWNWARDS","name":"arrow_heading_down","css":"arrow_heading_down","variations":["⤵"]},"⬅️":{"emoji":"⬅️","platforms":["tw","a","g"],"description":"LEFTWARDS BLACK ARROW","name":"arrow_left","css":"arrow_left","variations":["⬅"]},"⬆️":{"emoji":"⬆️","platforms":["tw","a","g"],"description":"UPWARDS BLACK ARROW","name":"arrow_up","css":"arrow_up","variations":["⬆"]},"⬇️":{"emoji":"⬇️","platforms":["tw","a","g"],"description":"DOWNWARDS BLACK ARROW","name":"arrow_down","css":"arrow_down","variations":["⬇"]},"⬛️":{"emoji":"⬛️","platforms":["tw","a","g"],"description":"BLACK LARGE SQUARE","name":"black_large_square","css":"black_large_square","variations":["⬛"]},"⬜️":{"emoji":"⬜️","platforms":["tw","a","g"],"description":"WHITE LARGE SQUARE","name":"white_large_square","css":"white_large_square","variations":["⬜"]},"⭐️":{"emoji":"⭐️","platforms":["tw","a","g"],"description":"WHITE MEDIUM STAR","name":"star","css":"star","variations":["⭐"]},"⭕️":{"emoji":"⭕️","platforms":["tw","a","g"],"description":"HEAVY LARGE CIRCLE","name":"o","css":"o","variations":["⭕"]},"〰️":{"emoji":"〰️","platforms":["tw","a","g"],"description":"WAVY DASH","name":"wavy_dash","css":"wavy_dash","variations":["〰"]},"〽️":{"emoji":"〽️","platforms":["tw","a","g"],"description":"PART ALTERNATION MARK","name":"part_alternation_mark","css":"part_alternation_mark","variations":["〽"]},"㊗️":{"emoji":"㊗️","platforms":["tw","a","g"],"description":"CIRCLED IDEOGRAPH CONGRATULATION","name":"congratulations","css":"congratulations","variations":["㊗"]},"㊙️":{"emoji":"㊙️","platforms":["tw","a","g"],"description":"CIRCLED IDEOGRAPH SECRET","name":"secret","css":"secret","variations":["㊙"]},"🀄️":{"emoji":"🀄️","platforms":["tw","a","g"],"description":"MAHJONG TILE RED DRAGON","name":"mahjong","css":"mahjong","variations":["🀄"]},"🃏":{"emoji":"🃏","platforms":["tw","a","g"],"description":"PLAYING CARD BLACK JOKER","name":"black_joker","css":"black_joker","category":"folderol"},"🅰️":{"emoji":"🅰️","platforms":["tw","a","g"],"description":"NEGATIVE SQUARED LATIN CAPITAL LETTER A","name":"a","css":"a","variations":["🅰"]},"🅱️":{"emoji":"🅱️","platforms":["tw","a","g"],"description":"NEGATIVE SQUARED LATIN CAPITAL LETTER B","name":"b","css":"b","variations":["🅱"]},"🅾️":{"emoji":"🅾️","platforms":["tw","a","g"],"description":"NEGATIVE SQUARED LATIN CAPITAL LETTER O","name":"o2","css":"o2","variations":["🅾"]},"🅿️":{"emoji":"🅿️","platforms":["tw","a","g"],"description":"NEGATIVE SQUARED LATIN CAPITAL LETTER P","name":"parking","css":"parking","variations":["🅿"]},"🆎":{"emoji":"🆎","platforms":["tw","a","g"],"description":"NEGATIVE SQUARED AB","name":"ab","css":"ab","category":"folderol"},"🆑":{"emoji":"🆑","platforms":["tw","a","g"],"description":"SQUARED CL","name":"cl","css":"cl","category":"folderol"},"🆒":{"emoji":"🆒","platforms":["tw","a","g"],"description":"SQUARED COOL","name":"cool","css":"cool","category":"folderol"},"🆓":{"emoji":"🆓","platforms":["tw","a","g"],"description":"SQUARED FREE","name":"free","css":"free","category":"folderol"},"🆔":{"emoji":"🆔","platforms":["tw","a","g"],"description":"SQUARED ID","name":"id","css":"id","category":"folderol"},"🆕":{"emoji":"🆕","platforms":["tw","a","g"],"description":"SQUARED NEW","name":"new","css":"new","category":"folderol"},"🆖":{"emoji":"🆖","platforms":["tw","a","g"],"description":"SQUARED NG","name":"ng","css":"ng","category":"folderol"},"🆗":{"emoji":"🆗","platforms":["tw","a","g"],"description":"SQUARED OK","name":"ok","css":"ok","category":"folderol"},"🆘":{"emoji":"🆘","platforms":["tw","a","g"],"description":"SQUARED SOS","name":"sos","css":"sos","category":"folderol"},"🆙":{"emoji":"🆙","platforms":["tw","a","g"],"description":"SQUARED UP WITH EXCLAMATION MARK","name":"up","css":"up","category":"folderol"},"🆚":{"emoji":"🆚","platforms":["tw","a","g"],"description":"SQUARED VS","name":"vs","css":"vs","category":"folderol"},"🈁":{"emoji":"🈁","platforms":["tw","a","g"],"description":"SQUARED KATAKANA KOKO","name":"koko","css":"koko","category":"folderol"},"🈂️":{"emoji":"🈂️","platforms":["tw","a","g"],"description":"SQUARED KATAKANA SA","name":"sa","css":"sa","variations":["🈂"]},"🈚️":{"emoji":"🈚️","platforms":["tw","a","g"],"description":"SQUARED CJK UNIFIED IDEOGRAPH-7121","name":"u7121","css":"u7121","variations":["🈚"]},"🈯️":{"emoji":"🈯️","platforms":["tw","a","g"],"description":"SQUARED CJK UNIFIED IDEOGRAPH-6307","name":"u6307","css":"u6307","variations":["🈯"]},"🈲":{"emoji":"🈲","platforms":["tw","a","g"],"description":"SQUARED CJK UNIFIED IDEOGRAPH-7981","name":"u7981","css":"u7981","category":"folderol"},"🈳":{"emoji":"🈳","platforms":["tw","a","g"],"description":"SQUARED CJK UNIFIED IDEOGRAPH-7A7A","name":"u7a7a","css":"u7a7a","category":"folderol"},"🈴":{"emoji":"🈴","platforms":["tw","a","g"],"description":"SQUARED CJK UNIFIED IDEOGRAPH-5408","name":"u5408","css":"u5408","category":"folderol"},"🈵":{"emoji":"🈵","platforms":["tw","a","g"],"description":"SQUARED CJK UNIFIED IDEOGRAPH-6E80","name":"u6e80","css":"u6e80","category":"folderol"},"🈶":{"emoji":"🈶","platforms":["tw","a","g"],"description":"SQUARED CJK UNIFIED IDEOGRAPH-6709","name":"u6709","css":"u6709","category":"folderol"},"🈷️":{"emoji":"🈷️","platforms":["tw","a","g"],"description":"SQUARED CJK UNIFIED IDEOGRAPH-6708","name":"u6708","css":"u6708","variations":["🈷"]},"🈸":{"emoji":"🈸","platforms":["tw","a","g"],"description":"SQUARED CJK UNIFIED IDEOGRAPH-7533","name":"u7533","css":"u7533","category":"folderol"},"🈹":{"emoji":"🈹","platforms":["tw","a","g"],"description":"SQUARED CJK UNIFIED IDEOGRAPH-5272","name":"u5272","css":"u5272","category":"folderol"},"🈺":{"emoji":"🈺","platforms":["tw","a","g"],"description":"SQUARED CJK UNIFIED IDEOGRAPH-55B6","name":"u55b6","css":"u55b6","category":"folderol"},"🉐":{"emoji":"🉐","platforms":["tw","a","g"],"description":"CIRCLED IDEOGRAPH ADVANTAGE","name":"ideograph_advantage","css":"ideograph_advantage","category":"folderol"},"🉑":{"emoji":"🉑","platforms":["tw","a","g"],"description":"CIRCLED IDEOGRAPH ACCEPT","name":"accept","css":"accept","category":"folderol"},"🌀":{"emoji":"🌀","platforms":["tw","a","g"],"description":"CYCLONE","name":"cyclone","css":"cyclone","category":"thing"},"🌁":{"emoji":"🌁","platforms":["tw","a","g"],"description":"FOGGY","name":"foggy","css":"foggy","category":"thing"},"🌂":{"emoji":"🌂","platforms":["tw","a","g"],"description":"CLOSED UMBRELLA","name":"closed_umbrella","css":"closed_umbrella","category":"thing"},"🌃":{"emoji":"🌃","platforms":["tw","a","g"],"description":"NIGHT WITH STARS","name":"night_with_stars","css":"night_with_stars","category":"thing"},"🌄":{"emoji":"🌄","platforms":["tw","a","g"],"description":"SUNRISE OVER MOUNTAINS","name":"sunrise_over_mountains","css":"sunrise_over_mountains","category":"thing"},"🌅":{"emoji":"🌅","platforms":["tw","a","g"],"description":"SUNRISE","name":"sunrise","css":"sunrise","category":"thing"},"🌆":{"emoji":"🌆","platforms":["tw","a","g"],"description":"CITYSCAPE AT DUSK","name":"city_sunset","css":"city_sunset","category":"thing"},"🌇":{"emoji":"🌇","platforms":["tw","a","g"],"description":"SUNSET OVER BUILDINGS","name":"city_sunrise","css":"city_sunrise","category":"thing"},"🌈":{"emoji":"🌈","platforms":["tw","a","g"],"description":"RAINBOW","name":"rainbow","css":"rainbow","category":"thing"},"🌉":{"emoji":"🌉","platforms":["tw","a","g"],"description":"BRIDGE AT NIGHT","name":"bridge_at_night","css":"bridge_at_night","category":"thing"},"🌊":{"emoji":"🌊","platforms":["tw","a","g"],"description":"WATER WAVE","name":"ocean","css":"ocean","category":"thing"},"🌋":{"emoji":"🌋","platforms":["tw","a","g"],"description":"VOLCANO","name":"volcano","css":"volcano","category":"thing"},"🌌":{"emoji":"🌌","platforms":["tw","a","g"],"description":"MILKY WAY","name":"milky_way","css":"milky_way","category":"thing"},"🌍":{"emoji":"🌍","platforms":["tw","a","g"],"description":"EARTH GLOBE EUROPE-AFRICA","name":"earth_africa","css":"earth_africa","category":"thing"},"🌎":{"emoji":"🌎","platforms":["tw","a","g"],"description":"EARTH GLOBE AMERICAS","name":"earth_americas","css":"earth_americas","category":"thing"},"🌏":{"emoji":"🌏","platforms":["tw","a","g"],"description":"EARTH GLOBE ASIA-AUSTRALIA","name":"earth_asia","css":"earth_asia","category":"thing"},"🌐":{"emoji":"🌐","platforms":["tw","a","g"],"description":"GLOBE WITH MERIDIANS","name":"globe_with_meridians","css":"globe_with_meridians","category":"thing"},"🌑":{"emoji":"🌑","platforms":["tw","a","g"],"description":"NEW MOON SYMBOL","name":"new_moon","css":"new_moon","category":"thing"},"🌒":{"emoji":"🌒","platforms":["tw","a","g"],"description":"WAXING CRESCENT MOON SYMBOL","name":"waxing_crescent_moon","css":"waxing_crescent_moon","category":"thing"},"🌓":{"emoji":"🌓","platforms":["tw","a","g"],"description":"FIRST QUARTER MOON SYMBOL","name":"first_quarter_moon","css":"first_quarter_moon","category":"thing"},"🌔":{"emoji":"🌔","platforms":["tw","a","g"],"description":"WAXING GIBBOUS MOON SYMBOL","name":"moon","css":"moon","category":"thing"},"🌕":{"emoji":"🌕","platforms":["tw","a","g"],"description":"FULL MOON SYMBOL","name":"full_moon","css":"full_moon","category":"thing"},"🌖":{"emoji":"🌖","platforms":["tw","a","g"],"description":"WANING GIBBOUS MOON SYMBOL","name":"waning_gibbous_moon","css":"waning_gibbous_moon","category":"thing"},"🌗":{"emoji":"🌗","platforms":["tw","a","g"],"description":"LAST QUARTER MOON SYMBOL","name":"last_quarter_moon","css":"last_quarter_moon","category":"thing"},"🌘":{"emoji":"🌘","platforms":["tw","a","g"],"description":"WANING CRESCENT MOON SYMBOL","name":"waning_crescent_moon","css":"waning_crescent_moon","category":"thing"},"🌙":{"emoji":"🌙","platforms":["tw","a","g"],"description":"CRESCENT MOON","name":"crescent_moon","css":"crescent_moon","category":"thing"},"🌚":{"emoji":"🌚","platforms":["tw","a","g"],"description":"NEW MOON WITH FACE","name":"new_moon_with_face","css":"new_moon_with_face","category":"thing"},"🌛":{"emoji":"🌛","platforms":["tw","a","g"],"description":"FIRST QUARTER MOON WITH FACE","name":"first_quarter_moon_with_face","css":"first_quarter_moon_with_face","category":"thing"},"🌜":{"emoji":"🌜","platforms":["tw","a","g"],"description":"LAST QUARTER MOON WITH FACE","name":"last_quarter_moon_with_face","css":"last_quarter_moon_with_face","category":"thing"},"🌝":{"emoji":"🌝","platforms":["tw","a","g"],"description":"FULL MOON WITH FACE","name":"full_moon_with_face","css":"full_moon_with_face","category":"thing"},"🌞":{"emoji":"🌞","platforms":["tw","a","g"],"description":"SUN WITH FACE","name":"sun_with_face","css":"sun_with_face","category":"thing"},"🌟":{"emoji":"🌟","platforms":["tw","a","g"],"description":"GLOWING STAR","name":"star2","css":"star2","category":"thing"},"🌠":{"emoji":"🌠","platforms":["tw","a","g"],"description":"SHOOTING STAR","name":"stars","css":"stars","category":"thing"},"🌰":{"emoji":"🌰","platforms":["tw","a","g"],"description":"CHESTNUT","name":"chestnut","css":"chestnut","category":"thing"},"🌱":{"emoji":"🌱","platforms":["tw","a","g"],"description":"SEEDLING","name":"seedling","css":"seedling","category":"thing"},"🌲":{"emoji":"🌲","platforms":["tw","a","g"],"description":"EVERGREEN TREE","name":"evergreen_tree","css":"evergreen_tree","category":"thing"},"🌳":{"emoji":"🌳","platforms":["tw","a","g"],"description":"DECIDUOUS TREE","name":"deciduous_tree","css":"deciduous_tree","category":"thing"},"🌴":{"emoji":"🌴","platforms":["tw","a","g"],"description":"PALM TREE","name":"palm_tree","css":"palm_tree","category":"thing"},"🌵":{"emoji":"🌵","platforms":["tw","a","g"],"description":"CACTUS","name":"cactus","css":"cactus","category":"thing"},"🌷":{"emoji":"🌷","platforms":["tw","a","g"],"description":"TULIP","name":"tulip","css":"tulip","category":"thing"},"🌸":{"emoji":"🌸","platforms":["tw","a","g"],"description":"CHERRY BLOSSOM","name":"cherry_blossom","css":"cherry_blossom","category":"thing"},"🌹":{"emoji":"🌹","platforms":["tw","a","g"],"description":"ROSE","name":"rose","css":"rose","category":"thing"},"🌺":{"emoji":"🌺","platforms":["tw","a","g"],"description":"HIBISCUS","name":"hibiscus","css":"hibiscus","category":"thing"},"🌻":{"emoji":"🌻","platforms":["tw","a","g"],"description":"SUNFLOWER","name":"sunflower","css":"sunflower","category":"thing"},"🌼":{"emoji":"🌼","platforms":["tw","a","g"],"description":"BLOSSOM","name":"blossom","css":"blossom","category":"thing"},"🌽":{"emoji":"🌽","platforms":["tw","a","g"],"description":"EAR OF MAIZE","name":"corn","css":"corn","category":"thing"},"🌾":{"emoji":"🌾","platforms":["tw","a","g"],"description":"EAR OF RICE","name":"ear_of_rice","css":"ear_of_rice","category":"thing"},"🌿":{"emoji":"🌿","platforms":["tw","a","g"],"description":"HERB","name":"herb","css":"herb","category":"thing"},"🍀":{"emoji":"🍀","platforms":["tw","a","g"],"description":"FOUR LEAF CLOVER","name":"four_leaf_clover","css":"four_leaf_clover","category":"thing"},"🍁":{"emoji":"🍁","platforms":["tw","a","g"],"description":"MAPLE LEAF","name":"maple_leaf","css":"maple_leaf","category":"thing"},"🍂":{"emoji":"🍂","platforms":["tw","a","g"],"description":"FALLEN LEAF","name":"fallen_leaf","css":"fallen_leaf","category":"thing"},"🍃":{"emoji":"🍃","platforms":["tw","a","g"],"description":"LEAF FLUTTERING IN WIND","name":"leaves","css":"leaves","category":"thing"},"🍄":{"emoji":"🍄","platforms":["tw","a","g"],"description":"MUSHROOM","name":"mushroom","css":"mushroom","category":"food"},"🍅":{"emoji":"🍅","platforms":["tw","a","g"],"description":"TOMATO","name":"tomato","css":"tomato","category":"food"},"🍆":{"emoji":"🍆","platforms":["tw","a","g"],"description":"AUBERGINE","name":"eggplant","css":"eggplant","category":"food"},"🍇":{"emoji":"🍇","platforms":["tw","a","g"],"description":"GRAPES","name":"grapes","css":"grapes","category":"food"},"🍈":{"emoji":"🍈","platforms":["tw","a","g"],"description":"MELON","name":"melon","css":"melon","category":"food"},"🍉":{"emoji":"🍉","platforms":["tw","a","g"],"description":"WATERMELON","name":"watermelon","css":"watermelon","category":"food"},"🍊":{"emoji":"🍊","platforms":["tw","a","g"],"description":"TANGERINE","name":"tangerine","css":"tangerine","category":"food"},"🍋":{"emoji":"🍋","platforms":["tw","a","g"],"description":"LEMON","name":"lemon","css":"lemon","category":"food"},"🍌":{"emoji":"🍌","platforms":["tw","a","g"],"description":"BANANA","name":"banana","css":"banana","category":"food"},"🍍":{"emoji":"🍍","platforms":["tw","a","g"],"description":"PINEAPPLE","name":"pineapple","css":"pineapple","category":"food"},"🍎":{"emoji":"🍎","platforms":["tw","a","g"],"description":"RED APPLE","name":"apple","css":"apple","category":"food"},"🍏":{"emoji":"🍏","platforms":["tw","a","g"],"description":"GREEN APPLE","name":"green_apple","css":"green_apple","category":"food"},"🍐":{"emoji":"🍐","platforms":["tw","a","g"],"description":"PEAR","name":"pear","css":"pear","category":"food"},"🍑":{"emoji":"🍑","platforms":["tw","a","g"],"description":"PEACH","name":"peach","css":"peach","category":"food"},"🍒":{"emoji":"🍒","platforms":["tw","a","g"],"description":"CHERRIES","name":"cherries","css":"cherries","category":"food"},"🍓":{"emoji":"🍓","platforms":["tw","a","g"],"description":"STRAWBERRY","name":"strawberry","css":"strawberry","category":"food"},"🍔":{"emoji":"🍔","platforms":["tw","a","g"],"description":"HAMBURGER","name":"hamburger","css":"hamburger","category":"food"},"🍕":{"emoji":"🍕","platforms":["tw","a","g"],"description":"SLICE OF PIZZA","name":"pizza","css":"pizza","category":"food"},"🍖":{"emoji":"🍖","platforms":["tw","a","g"],"description":"MEAT ON BONE","name":"meat_on_bone","css":"meat_on_bone","category":"food"},"🍗":{"emoji":"🍗","platforms":["tw","a","g"],"description":"POULTRY LEG","name":"poultry_leg","css":"poultry_leg","category":"food"},"🍘":{"emoji":"🍘","platforms":["tw","a","g"],"description":"RICE CRACKER","name":"rice_cracker","css":"rice_cracker","category":"food"},"🍙":{"emoji":"🍙","platforms":["tw","a","g"],"description":"RICE BALL","name":"rice_ball","css":"rice_ball","category":"food"},"🍚":{"emoji":"🍚","platforms":["tw","a","g"],"description":"COOKED RICE","name":"rice","css":"rice","category":"food"},"🍛":{"emoji":"🍛","platforms":["tw","a","g"],"description":"CURRY AND RICE","name":"curry","css":"curry","category":"food"},"🍜":{"emoji":"🍜","platforms":["tw","a","g"],"description":"STEAMING BOWL","name":"ramen","css":"ramen","category":"food"},"🍝":{"emoji":"🍝","platforms":["tw","a","g"],"description":"SPAGHETTI","name":"spaghetti","css":"spaghetti","category":"food"},"🍞":{"emoji":"🍞","platforms":["tw","a","g"],"description":"BREAD","name":"bread","css":"bread","category":"food"},"🍟":{"emoji":"🍟","platforms":["tw","a","g"],"description":"FRENCH FRIES","name":"fries","css":"fries","category":"food"},"🍠":{"emoji":"🍠","platforms":["tw","a","g"],"description":"ROASTED SWEET POTATO","name":"sweet_potato","css":"sweet_potato","category":"food"},"🍡":{"emoji":"🍡","platforms":["tw","a","g"],"description":"DANGO","name":"dango","css":"dango","category":"food"},"🍢":{"emoji":"🍢","platforms":["tw","a","g"],"description":"ODEN","name":"oden","css":"oden","category":"food"},"🍣":{"emoji":"🍣","platforms":["tw","a","g"],"description":"SUSHI","name":"sushi","css":"sushi","category":"food"},"🍤":{"emoji":"🍤","platforms":["tw","a","g"],"description":"FRIED SHRIMP","name":"fried_shrimp","css":"fried_shrimp","category":"food"},"🍥":{"emoji":"🍥","platforms":["tw","a","g"],"description":"FISH CAKE WITH SWIRL DESIGN","name":"fish_cake","css":"fish_cake","category":"food"},"🍦":{"emoji":"🍦","platforms":["tw","a","g"],"description":"SOFT ICE CREAM","name":"icecream","css":"icecream","category":"food"},"🍧":{"emoji":"🍧","platforms":["tw","a","g"],"description":"SHAVED ICE","name":"shaved_ice","css":"shaved_ice","category":"food"},"🍨":{"emoji":"🍨","platforms":["tw","a","g"],"description":"ICE CREAM","name":"ice_cream","css":"ice_cream","category":"food"},"🍩":{"emoji":"🍩","platforms":["tw","a","g"],"description":"DOUGHNUT","name":"doughnut","css":"doughnut","category":"food"},"🍪":{"emoji":"🍪","platforms":["tw","a","g"],"description":"COOKIE","name":"cookie","css":"cookie","category":"food"},"🍫":{"emoji":"🍫","platforms":["tw","a","g"],"description":"CHOCOLATE BAR","name":"chocolate_bar","css":"chocolate_bar","category":"food"},"🍬":{"emoji":"🍬","platforms":["tw","a","g"],"description":"CANDY","name":"candy","css":"candy","category":"food"},"🍭":{"emoji":"🍭","platforms":["tw","a","g"],"description":"LOLLIPOP","name":"lollipop","css":"lollipop","category":"food"},"🍮":{"emoji":"🍮","platforms":["tw","a","g"],"description":"CUSTARD","name":"custard","css":"custard","category":"food"},"🍯":{"emoji":"🍯","platforms":["tw","a","g"],"description":"HONEY POT","name":"honey_pot","css":"honey_pot","category":"food"},"🍰":{"emoji":"🍰","platforms":["tw","a","g"],"description":"SHORTCAKE","name":"cake","css":"cake","category":"food"},"🍱":{"emoji":"🍱","platforms":["tw","a","g"],"description":"BENTO BOX","name":"bento","css":"bento","category":"food"},"🍲":{"emoji":"🍲","platforms":["tw","a","g"],"description":"POT OF FOOD","name":"stew","css":"stew","category":"food"},"🍳":{"emoji":"🍳","platforms":["tw","a","g"],"description":"COOKING","name":"egg","css":"egg","category":"food"},"🍴":{"emoji":"🍴","platforms":["tw","a","g"],"description":"FORK AND KNIFE","name":"fork_and_knife","css":"fork_and_knife","category":"food"},"🍵":{"emoji":"🍵","platforms":["tw","a","g"],"description":"TEACUP WITHOUT HANDLE","name":"tea","css":"tea","category":"food"},"🍶":{"emoji":"🍶","platforms":["tw","a","g"],"description":"SAKE BOTTLE AND CUP","name":"sake","css":"sake","category":"food"},"🍷":{"emoji":"🍷","platforms":["tw","a","g"],"description":"WINE GLASS","name":"wine_glass","css":"wine_glass","category":"food"},"🍸":{"emoji":"🍸","platforms":["tw","a","g"],"description":"COCKTAIL GLASS","name":"cocktail","css":"cocktail","category":"food"},"🍹":{"emoji":"🍹","platforms":["tw","a","g"],"description":"TROPICAL DRINK","name":"tropical_drink","css":"tropical_drink","category":"food"},"🍺":{"emoji":"🍺","platforms":["tw","a","g"],"description":"BEER MUG","name":"beer","css":"beer","category":"food"},"🍻":{"emoji":"🍻","platforms":["tw","a","g"],"description":"CLINKING BEER MUGS","name":"beers","css":"beers","category":"food"},"🍼":{"emoji":"🍼","platforms":["tw","a","g"],"description":"BABY BOTTLE","name":"baby_bottle","css":"baby_bottle","category":"food"},"🎀":{"emoji":"🎀","platforms":["tw","a","g"],"description":"RIBBON","name":"ribbon","css":"ribbon","category":"thing"},"🎁":{"emoji":"🎁","platforms":["tw","a","g"],"description":"WRAPPED PRESENT","name":"gift","css":"gift","category":"thing"},"🎂":{"emoji":"🎂","platforms":["tw","a","g"],"description":"BIRTHDAY CAKE","name":"birthday","css":"birthday","category":"thing"},"🎃":{"emoji":"🎃","platforms":["tw","a","g"],"description":"JACK-O-LANTERN","name":"jack_o_lantern","css":"jack_o_lantern","category":"thing"},"🎄":{"emoji":"🎄","platforms":["tw","a","g"],"description":"CHRISTMAS TREE","name":"christmas_tree","css":"christmas_tree","category":"thing"},"🎅":{"emoji":"🎅","platforms":["tw","a","g"],"description":"FATHER CHRISTMAS","name":"santa","css":"santa","category":"thing"},"🎆":{"emoji":"🎆","platforms":["tw","a","g"],"description":"FIREWORKS","name":"fireworks","css":"fireworks","category":"thing"},"🎇":{"emoji":"🎇","platforms":["tw","a","g"],"description":"FIREWORK SPARKLER","name":"sparkler","css":"sparkler","category":"thing"},"🎈":{"emoji":"🎈","platforms":["tw","a","g"],"description":"BALLOON","name":"balloon","css":"balloon","category":"thing"},"🎉":{"emoji":"🎉","platforms":["tw","a","g"],"description":"PARTY POPPER","name":"tada","css":"tada","category":"thing"},"🎊":{"emoji":"🎊","platforms":["tw","a","g"],"description":"CONFETTI BALL","name":"confetti_ball","css":"confetti_ball","category":"thing"},"🎋":{"emoji":"🎋","platforms":["tw","a","g"],"description":"TANABATA TREE","name":"tanabata_tree","css":"tanabata_tree","category":"thing"},"🎌":{"emoji":"🎌","platforms":["tw","a","g"],"description":"CROSSED FLAGS","name":"crossed_flags","css":"crossed_flags","category":"thing"},"🎍":{"emoji":"🎍","platforms":["tw","a","g"],"description":"PINE DECORATION","name":"bamboo","css":"bamboo","category":"thing"},"🎎":{"emoji":"🎎","platforms":["tw","a","g"],"description":"JAPANESE DOLLS","name":"dolls","css":"dolls","category":"thing"},"🎏":{"emoji":"🎏","platforms":["tw","a","g"],"description":"CARP STREAMER","name":"flags","css":"flags","category":"thing"},"🎐":{"emoji":"🎐","platforms":["tw","a","g"],"description":"WIND CHIME","name":"wind_chime","css":"wind_chime","category":"thing"},"🎑":{"emoji":"🎑","platforms":["tw","a","g"],"description":"MOON VIEWING CEREMONY","name":"rice_scene","css":"rice_scene","category":"thing"},"🎒":{"emoji":"🎒","platforms":["tw","a","g"],"description":"SCHOOL SATCHEL","name":"school_satchel","css":"school_satchel","category":"thing"},"🎓":{"emoji":"🎓","platforms":["tw","a","g"],"description":"GRADUATION CAP","name":"mortar_board","css":"mortar_board","category":"thing"},"🎠":{"emoji":"🎠","platforms":["tw","a","g"],"description":"CAROUSEL HORSE","name":"carousel_horse","css":"carousel_horse","category":"thing"},"🎡":{"emoji":"🎡","platforms":["tw","a","g"],"description":"FERRIS WHEEL","name":"ferris_wheel","css":"ferris_wheel","category":"thing"},"🎢":{"emoji":"🎢","platforms":["tw","a","g"],"description":"ROLLER COASTER","name":"roller_coaster","css":"roller_coaster","category":"thing"},"🎣":{"emoji":"🎣","platforms":["tw","a","g"],"description":"FISHING POLE AND FISH","name":"fishing_pole_and_fish","css":"fishing_pole_and_fish","category":"thing"},"🎤":{"emoji":"🎤","platforms":["tw","a","g"],"description":"MICROPHONE","name":"microphone","css":"microphone","category":"thing"},"🎥":{"emoji":"🎥","platforms":["tw","a","g"],"description":"MOVIE CAMERA","name":"movie_camera","css":"movie_camera","category":"thing"},"🎦":{"emoji":"🎦","platforms":["tw","a","g"],"description":"CINEMA","name":"cinema","css":"cinema","category":"thing"},"🎧":{"emoji":"🎧","platforms":["tw","a","g"],"description":"HEADPHONE","name":"headphones","css":"headphones","category":"thing"},"🎨":{"emoji":"🎨","platforms":["tw","a","g"],"description":"ARTIST PALETTE","name":"art","css":"art","category":"thing"},"🎩":{"emoji":"🎩","platforms":["tw","a","g"],"description":"TOP HAT","name":"tophat","css":"tophat","category":"thing"},"🎪":{"emoji":"🎪","platforms":["tw","a","g"],"description":"CIRCUS TENT","name":"circus_tent","css":"circus_tent","category":"thing"},"🎫":{"emoji":"🎫","platforms":["tw","a","g"],"description":"TICKET","name":"ticket","css":"ticket","category":"thing"},"🎬":{"emoji":"🎬","platforms":["tw","a","g"],"description":"CLAPPER BOARD","name":"clapper","css":"clapper","category":"thing"},"🎭":{"emoji":"🎭","platforms":["tw","a","g"],"description":"PERFORMING ARTS","name":"performing_arts","css":"performing_arts","category":"thing"},"🎮":{"emoji":"🎮","platforms":["tw","a","g"],"description":"VIDEO GAME","name":"video_game","css":"video_game","category":"thing"},"🎯":{"emoji":"🎯","platforms":["tw","a","g"],"description":"DIRECT HIT","name":"dart","css":"dart","category":"thing"},"🎰":{"emoji":"🎰","platforms":["tw","a","g"],"description":"SLOT MACHINE","name":"slot_machine","css":"slot_machine","category":"thing"},"🎱":{"emoji":"🎱","platforms":["tw","a","g"],"description":"BILLIARDS","name":"8ball","css":"8ball","category":"thing"},"🎲":{"emoji":"🎲","platforms":["tw","a","g"],"description":"GAME DIE","name":"game_die","css":"game_die","category":"thing"},"🎳":{"emoji":"🎳","platforms":["tw","a","g"],"description":"BOWLING","name":"bowling","css":"bowling","category":"thing"},"🎴":{"emoji":"🎴","platforms":["tw","a","g"],"description":"FLOWER PLAYING CARDS","name":"flower_playing_cards","css":"flower_playing_cards","category":"thing"},"🎵":{"emoji":"🎵","platforms":["tw","a","g"],"description":"MUSICAL NOTE","name":"musical_note","css":"musical_note","category":"thing"},"🎶":{"emoji":"🎶","platforms":["tw","a","g"],"description":"MULTIPLE MUSICAL NOTES","name":"notes","css":"notes","category":"thing"},"🎷":{"emoji":"🎷","platforms":["tw","a","g"],"description":"SAXOPHONE","name":"saxophone","css":"saxophone","category":"thing"},"🎸":{"emoji":"🎸","platforms":["tw","a","g"],"description":"GUITAR","name":"guitar","css":"guitar","category":"thing"},"🎹":{"emoji":"🎹","platforms":["tw","a","g"],"description":"MUSICAL KEYBOARD","name":"musical_keyboard","css":"musical_keyboard","category":"thing"},"🎺":{"emoji":"🎺","platforms":["tw","a","g"],"description":"TRUMPET","name":"trumpet","css":"trumpet","category":"thing"},"🎻":{"emoji":"🎻","platforms":["tw","a","g"],"description":"VIOLIN","name":"violin","css":"violin","category":"thing"},"🎼":{"emoji":"🎼","platforms":["tw","a","g"],"description":"MUSICAL SCORE","name":"musical_score","css":"musical_score","category":"thing"},"🎽":{"emoji":"🎽","platforms":["tw","a","g"],"description":"RUNNING SHIRT WITH SASH","name":"running_shirt_with_sash","css":"running_shirt_with_sash","category":"thing"},"🎾":{"emoji":"🎾","platforms":["tw","a","g"],"description":"TENNIS RACQUET AND BALL","name":"tennis","css":"tennis","category":"thing"},"🎿":{"emoji":"🎿","platforms":["tw","a","g"],"description":"SKI AND SKI BOOT","name":"ski","css":"ski","category":"thing"},"🏀":{"emoji":"🏀","platforms":["tw","a","g"],"description":"BASKETBALL AND HOOP","name":"basketball","css":"basketball","category":"thing"},"🏁":{"emoji":"🏁","platforms":["tw","a","g"],"description":"CHEQUERED FLAG","name":"checkered_flag","css":"checkered_flag","category":"thing"},"🏂":{"emoji":"🏂","platforms":["tw","a","g"],"description":"SNOWBOARDER","name":"snowboarder","css":"snowboarder","category":"people"},"🏃":{"emoji":"🏃","platforms":["tw","a","g"],"description":"RUNNER","name":"runner","css":"runner","category":"people"},"🏄":{"emoji":"🏄","platforms":["tw","a","g"],"description":"SURFER","name":"surfer","css":"surfer","category":"people"},"🏆":{"emoji":"🏆","platforms":["tw","a","g"],"description":"TROPHY","name":"trophy","css":"trophy","category":"people"},"🏇":{"emoji":"🏇","platforms":["tw","a","g"],"description":"HORSE RACING","name":"horse_racing","css":"horse_racing","category":"people"},"🏈":{"emoji":"🏈","platforms":["tw","a","g"],"description":"AMERICAN FOOTBALL","name":"football","css":"football","category":"people"},"🏉":{"emoji":"🏉","platforms":["tw","a","g"],"description":"RUGBY FOOTBALL","name":"rugby_football","css":"rugby_football","category":"people"},"🏊":{"emoji":"🏊","platforms":["tw","a","g"],"description":"SWIMMER","name":"swimmer","css":"swimmer","category":"people"},"🏠":{"emoji":"🏠","platforms":["tw","a","g"],"description":"HOUSE BUILDING","name":"house","css":"house","category":"travel"},"🏡":{"emoji":"🏡","platforms":["tw","a","g"],"description":"HOUSE WITH GARDEN","name":"house_with_garden","css":"house_with_garden","category":"travel"},"🏢":{"emoji":"🏢","platforms":["tw","a","g"],"description":"OFFICE BUILDING","name":"office","css":"office","category":"travel"},"🏣":{"emoji":"🏣","platforms":["tw","a","g"],"description":"JAPANESE POST OFFICE","name":"post_office","css":"post_office","category":"travel"},"🏤":{"emoji":"🏤","platforms":["tw","a","g"],"description":"EUROPEAN POST OFFICE","name":"european_post_office","css":"european_post_office","category":"travel"},"🏥":{"emoji":"🏥","platforms":["tw","a","g"],"description":"HOSPITAL","name":"hospital","css":"hospital","category":"travel"},"🏦":{"emoji":"🏦","platforms":["tw","a","g"],"description":"BANK","name":"bank","css":"bank","category":"travel"},"🏧":{"emoji":"🏧","platforms":["tw","a","g"],"description":"AUTOMATED TELLER MACHINE","name":"atm","css":"atm","category":"travel"},"🏨":{"emoji":"🏨","platforms":["tw","a","g"],"description":"HOTEL","name":"hotel","css":"hotel","category":"travel"},"🏩":{"emoji":"🏩","platforms":["tw","a","g"],"description":"LOVE HOTEL","name":"love_hotel","css":"love_hotel","category":"travel"},"🏪":{"emoji":"🏪","platforms":["tw","a","g"],"description":"CONVENIENCE STORE","name":"convenience_store","css":"convenience_store","category":"travel"},"🏫":{"emoji":"🏫","platforms":["tw","a","g"],"description":"SCHOOL","name":"school","css":"school","category":"travel"},"🏬":{"emoji":"🏬","platforms":["tw","a","g"],"description":"DEPARTMENT STORE","name":"department_store","css":"department_store","category":"travel"},"🏭":{"emoji":"🏭","platforms":["tw","a","g"],"description":"FACTORY","name":"factory","css":"factory","category":"travel"},"🏮":{"emoji":"🏮","platforms":["tw","a","g"],"description":"IZAKAYA LANTERN","name":"izakaya_lantern","css":"izakaya_lantern","category":"travel"},"🏯":{"emoji":"🏯","platforms":["tw","a","g"],"description":"JAPANESE CASTLE","name":"japanese_castle","css":"japanese_castle","category":"travel"},"🏰":{"emoji":"🏰","platforms":["tw","a","g"],"description":"EUROPEAN CASTLE","name":"european_castle","css":"european_castle","category":"travel"},"🏻":{"emoji":"🏻","description":"EMOJI MODIFIER FITZPATRICK TYPE-1-2","name":"skin-tone-2","css":"skin-tone-2","category":"people"},"🏼":{"emoji":"🏼","description":"EMOJI MODIFIER FITZPATRICK TYPE-3","name":"skin-tone-3","css":"skin-tone-3","category":"people"},"🏽":{"emoji":"🏽","description":"EMOJI MODIFIER FITZPATRICK TYPE-4","name":"skin-tone-4","css":"skin-tone-4","category":"people"},"🏾":{"emoji":"🏾","description":"EMOJI MODIFIER FITZPATRICK TYPE-5","name":"skin-tone-5","css":"skin-tone-5","category":"people"},"🏿":{"emoji":"🏿","description":"EMOJI MODIFIER FITZPATRICK TYPE-6","name":"skin-tone-6","css":"skin-tone-6","category":"people"},"🐀":{"emoji":"🐀","platforms":["tw","a","g"],"description":"RAT","name":"rat","css":"rat","category":"animal"},"🐁":{"emoji":"🐁","platforms":["tw","a","g"],"description":"MOUSE","name":"mouse2","css":"mouse2","category":"animal"},"🐂":{"emoji":"🐂","platforms":["tw","a","g"],"description":"OX","name":"ox","css":"ox","category":"animal"},"🐃":{"emoji":"🐃","platforms":["tw","a","g"],"description":"WATER BUFFALO","name":"water_buffalo","css":"water_buffalo","category":"animal"},"🐄":{"emoji":"🐄","platforms":["tw","a","g"],"description":"COW","name":"cow2","css":"cow2","category":"animal"},"🐅":{"emoji":"🐅","platforms":["tw","a","g"],"description":"TIGER","name":"tiger2","css":"tiger2","category":"animal"},"🐆":{"emoji":"🐆","platforms":["tw","a","g"],"description":"LEOPARD","name":"leopard","css":"leopard","category":"animal"},"🐇":{"emoji":"🐇","platforms":["tw","a","g"],"description":"RABBIT","name":"rabbit2","css":"rabbit2","category":"animal"},"🐈":{"emoji":"🐈","platforms":["tw","a","g"],"description":"CAT","name":"cat2","css":"cat2","category":"animal"},"🐉":{"emoji":"🐉","platforms":["tw","a","g"],"description":"DRAGON","name":"dragon","css":"dragon","category":"animal"},"🐊":{"emoji":"🐊","platforms":["tw","a","g"],"description":"CROCODILE","name":"crocodile","css":"crocodile","category":"animal"},"🐋":{"emoji":"🐋","platforms":["tw","a","g"],"description":"WHALE","name":"whale2","css":"whale2","category":"animal"},"🐌":{"emoji":"🐌","platforms":["tw","a","g"],"description":"SNAIL","name":"snail","css":"snail","category":"animal"},"🐍":{"emoji":"🐍","platforms":["tw","a","g"],"description":"SNAKE","name":"snake","css":"snake","category":"animal"},"🐎":{"emoji":"🐎","platforms":["tw","a","g"],"description":"HORSE","name":"racehorse","css":"racehorse","category":"animal"},"🐏":{"emoji":"🐏","platforms":["tw","a","g"],"description":"RAM","name":"ram","css":"ram","category":"animal"},"🐐":{"emoji":"🐐","platforms":["tw","a","g"],"description":"GOAT","name":"goat","css":"goat","category":"animal"},"🐑":{"emoji":"🐑","platforms":["tw","a","g"],"description":"SHEEP","name":"sheep","css":"sheep","category":"animal"},"🐒":{"emoji":"🐒","platforms":["tw","a","g"],"description":"MONKEY","name":"monkey","css":"monkey","category":"animal"},"🐓":{"emoji":"🐓","platforms":["tw","a","g"],"description":"ROOSTER","name":"rooster","css":"rooster","category":"animal"},"🐔":{"emoji":"🐔","platforms":["tw","a","g"],"description":"CHICKEN","name":"chicken","css":"chicken","category":"animal"},"🐕":{"emoji":"🐕","platforms":["tw","a","g"],"description":"DOG","name":"dog2","css":"dog2","category":"animal"},"🐖":{"emoji":"🐖","platforms":["tw","a","g"],"description":"PIG","name":"pig2","css":"pig2","category":"animal"},"🐗":{"emoji":"🐗","platforms":["tw","a","g"],"description":"BOAR","name":"boar","css":"boar","category":"animal"},"🐘":{"emoji":"🐘","platforms":["tw","a","g"],"description":"ELEPHANT","name":"elephant","css":"elephant","category":"animal"},"🐙":{"emoji":"🐙","platforms":["tw","a","g"],"description":"OCTOPUS","name":"octopus","css":"octopus","category":"animal"},"🐚":{"emoji":"🐚","platforms":["tw","a","g"],"description":"SPIRAL SHELL","name":"shell","css":"shell","category":"animal"},"🐛":{"emoji":"🐛","platforms":["tw","a","g"],"description":"BUG","name":"bug","css":"bug","category":"animal"},"🐜":{"emoji":"🐜","platforms":["tw","a","g"],"description":"ANT","name":"ant","css":"ant","category":"animal"},"🐝":{"emoji":"🐝","platforms":["tw","a","g"],"description":"HONEYBEE","name":"bee","css":"bee","category":"animal"},"🐞":{"emoji":"🐞","platforms":["tw","a","g"],"description":"LADY BEETLE","name":"beetle","css":"beetle","category":"animal"},"🐟":{"emoji":"🐟","platforms":["tw","a","g"],"description":"FISH","name":"fish","css":"fish","category":"animal"},"🐠":{"emoji":"🐠","platforms":["tw","a","g"],"description":"TROPICAL FISH","name":"tropical_fish","css":"tropical_fish","category":"animal"},"🐡":{"emoji":"🐡","platforms":["tw","a","g"],"description":"BLOWFISH","name":"blowfish","css":"blowfish","category":"animal"},"🐢":{"emoji":"🐢","platforms":["tw","a","g"],"description":"TURTLE","name":"turtle","css":"turtle","category":"animal"},"🐣":{"emoji":"🐣","platforms":["tw","a","g"],"description":"HATCHING CHICK","name":"hatching_chick","css":"hatching_chick","category":"animal"},"🐤":{"emoji":"🐤","platforms":["tw","a","g"],"description":"BABY CHICK","name":"baby_chick","css":"baby_chick","category":"animal"},"🐥":{"emoji":"🐥","platforms":["tw","a","g"],"description":"FRONT-FACING BABY CHICK","name":"hatched_chick","css":"hatched_chick","category":"animal"},"🐦":{"emoji":"🐦","platforms":["tw","a","g"],"description":"BIRD","name":"bird","css":"bird","category":"animal"},"🐧":{"emoji":"🐧","platforms":["tw","a","g"],"description":"PENGUIN","name":"penguin","css":"penguin","category":"animal"},"🐨":{"emoji":"🐨","platforms":["tw","a","g"],"description":"KOALA","name":"koala","css":"koala","category":"animal"},"🐩":{"emoji":"🐩","platforms":["tw","a","g"],"description":"POODLE","name":"poodle","css":"poodle","category":"animal"},"🐪":{"emoji":"🐪","platforms":["tw","a","g"],"description":"DROMEDARY CAMEL","name":"dromedary_camel","css":"dromedary_camel","category":"animal"},"🐫":{"emoji":"🐫","platforms":["tw","a","g"],"description":"BACTRIAN CAMEL","name":"camel","css":"camel","category":"animal"},"🐬":{"emoji":"🐬","platforms":["tw","a","g"],"description":"DOLPHIN","name":"dolphin","css":"dolphin","category":"animal"},"🐭":{"emoji":"🐭","platforms":["tw","a","g"],"description":"MOUSE FACE","name":"mouse","css":"mouse","category":"animal"},"🐮":{"emoji":"🐮","platforms":["tw","a","g"],"description":"COW FACE","name":"cow","css":"cow","category":"animal"},"🐯":{"emoji":"🐯","platforms":["tw","a","g"],"description":"TIGER FACE","name":"tiger","css":"tiger","category":"animal"},"🐰":{"emoji":"🐰","platforms":["tw","a","g"],"description":"RABBIT FACE","name":"rabbit","css":"rabbit","category":"animal"},"🐱":{"emoji":"🐱","platforms":["tw","a","g"],"description":"CAT FACE","name":"cat","css":"cat","category":"animal"},"🐲":{"emoji":"🐲","platforms":["tw","a","g"],"description":"DRAGON FACE","name":"dragon_face","css":"dragon_face","category":"animal"},"🐳":{"emoji":"🐳","platforms":["tw","a","g"],"description":"SPOUTING WHALE","name":"whale","css":"whale","category":"animal"},"🐴":{"emoji":"🐴","platforms":["tw","a","g"],"description":"HORSE FACE","name":"horse","css":"horse","category":"animal"},"🐵":{"emoji":"🐵","platforms":["tw","a","g"],"description":"MONKEY FACE","name":"monkey_face","css":"monkey_face","category":"animal"},"🐶":{"emoji":"🐶","platforms":["tw","a","g"],"description":"DOG FACE","name":"dog","css":"dog","category":"animal"},"🐷":{"emoji":"🐷","platforms":["tw","a","g"],"description":"PIG FACE","name":"pig","css":"pig","category":"animal"},"🐸":{"emoji":"🐸","platforms":["tw","a","g"],"description":"FROG FACE","name":"frog","css":"frog","category":"animal"},"🐹":{"emoji":"🐹","platforms":["tw","a","g"],"description":"HAMSTER FACE","name":"hamster","css":"hamster","category":"animal"},"🐺":{"emoji":"🐺","platforms":["tw","a","g"],"description":"WOLF FACE","name":"wolf","css":"wolf","category":"animal"},"🐻":{"emoji":"🐻","platforms":["tw","a","g"],"description":"BEAR FACE","name":"bear","css":"bear","category":"animal"},"🐼":{"emoji":"🐼","platforms":["tw","a","g"],"description":"PANDA FACE","name":"panda_face","css":"panda_face","category":"animal"},"🐽":{"emoji":"🐽","platforms":["tw","a","g"],"description":"PIG NOSE","name":"pig_nose","css":"pig_nose","category":"animal"},"🐾":{"emoji":"🐾","platforms":["tw","a","g"],"description":"PAW PRINTS","name":"feet","css":"feet","category":"people"},"👀":{"emoji":"👀","platforms":["tw","a","g"],"description":"EYES","name":"eyes","css":"eyes","category":"people"},"👂":{"emoji":"👂","platforms":["tw","a","g"],"description":"EAR","name":"ear","css":"ear","category":"people"},"👃":{"emoji":"👃","platforms":["tw","a","g"],"description":"NOSE","name":"nose","css":"nose","category":"people"},"👄":{"emoji":"👄","platforms":["tw","a","g"],"description":"MOUTH","name":"lips","css":"lips","category":"people"},"👅":{"emoji":"👅","platforms":["tw","a","g"],"description":"TONGUE","name":"tongue","css":"tongue","category":"people"},"👆":{"emoji":"👆","platforms":["tw","a","g"],"description":"WHITE UP POINTING BACKHAND INDEX","name":"point_up_2","css":"point_up_2","category":"people"},"👇":{"emoji":"👇","platforms":["tw","a","g"],"description":"WHITE DOWN POINTING BACKHAND INDEX","name":"point_down","css":"point_down","category":"people"},"👈":{"emoji":"👈","platforms":["tw","a","g"],"description":"WHITE LEFT POINTING BACKHAND INDEX","name":"point_left","css":"point_left","category":"people"},"👉":{"emoji":"👉","platforms":["tw","a","g"],"description":"WHITE RIGHT POINTING BACKHAND INDEX","name":"point_right","css":"point_right","category":"people"},"👊":{"emoji":"👊","platforms":["tw","a","g"],"description":"FISTED HAND SIGN","name":"facepunch","css":"facepunch","category":"people"},"👋":{"emoji":"👋","platforms":["tw","a","g"],"description":"WAVING HAND SIGN","name":"wave","css":"wave","category":"people"},"👌":{"emoji":"👌","platforms":["tw","a","g"],"description":"OK HAND SIGN","name":"ok_hand","css":"ok_hand","category":"people"},"👍":{"emoji":"👍","platforms":["tw","a","g"],"description":"THUMBS UP SIGN","name":"+1","css":"plus1","category":"people"},"👎":{"emoji":"👎","platforms":["tw","a","g"],"description":"THUMBS DOWN SIGN","name":"-1","css":"-1","category":"people"},"👏":{"emoji":"👏","platforms":["tw","a","g"],"description":"CLAPPING HANDS SIGN","name":"clap","css":"clap","category":"people"},"👐":{"emoji":"👐","platforms":["tw","a","g"],"description":"OPEN HANDS SIGN","name":"open_hands","css":"open_hands","category":"people"},"👑":{"emoji":"👑","platforms":["tw","a","g"],"description":"CROWN","name":"crown","css":"crown","category":"people"},"👒":{"emoji":"👒","platforms":["tw","a","g"],"description":"WOMANS HAT","name":"womans_hat","css":"womans_hat","category":"people"},"👓":{"emoji":"👓","platforms":["tw","a","g"],"description":"EYEGLASSES","name":"eyeglasses","css":"eyeglasses","category":"people"},"👔":{"emoji":"👔","platforms":["tw","a","g"],"description":"NECKTIE","name":"necktie","css":"necktie","category":"people"},"👕":{"emoji":"👕","platforms":["tw","a","g"],"description":"T-SHIRT","name":"shirt","css":"shirt","category":"people"},"👖":{"emoji":"👖","platforms":["tw","a","g"],"description":"JEANS","name":"jeans","css":"jeans","category":"people"},"👗":{"emoji":"👗","platforms":["tw","a","g"],"description":"DRESS","name":"dress","css":"dress","category":"people"},"👘":{"emoji":"👘","platforms":["tw","a","g"],"description":"KIMONO","name":"kimono","css":"kimono","category":"people"},"👙":{"emoji":"👙","platforms":["tw","a","g"],"description":"BIKINI","name":"bikini","css":"bikini","category":"people"},"👚":{"emoji":"👚","platforms":["tw","a","g"],"description":"WOMANS CLOTHES","name":"womans_clothes","css":"womans_clothes","category":"people"},"👛":{"emoji":"👛","platforms":["tw","a","g"],"description":"PURSE","name":"purse","css":"purse","category":"people"},"👜":{"emoji":"👜","platforms":["tw","a","g"],"description":"HANDBAG","name":"handbag","css":"handbag","category":"people"},"👝":{"emoji":"👝","platforms":["tw","a","g"],"description":"POUCH","name":"pouch","css":"pouch","category":"people"},"👞":{"emoji":"👞","platforms":["tw","a","g"],"description":"MANS SHOE","name":"mans_shoe","css":"mans_shoe","category":"people"},"👟":{"emoji":"👟","platforms":["tw","a","g"],"description":"ATHLETIC SHOE","name":"athletic_shoe","css":"athletic_shoe","category":"people"},"👠":{"emoji":"👠","platforms":["tw","a","g"],"description":"HIGH-HEELED SHOE","name":"high_heel","css":"high_heel","category":"people"},"👡":{"emoji":"👡","platforms":["tw","a","g"],"description":"WOMANS SANDAL","name":"sandal","css":"sandal","category":"people"},"👢":{"emoji":"👢","platforms":["tw","a","g"],"description":"WOMANS BOOTS","name":"boot","css":"boot","category":"people"},"👣":{"emoji":"👣","platforms":["tw","a","g"],"description":"FOOTPRINTS","name":"footprints","css":"footprints","category":"people"},"👤":{"emoji":"👤","platforms":["tw","a","g"],"description":"BUST IN SILHOUETTE","name":"bust_in_silhouette","css":"bust_in_silhouette","category":"people"},"👥":{"emoji":"👥","platforms":["tw","a","g"],"description":"BUSTS IN SILHOUETTE","name":"busts_in_silhouette","css":"busts_in_silhouette","category":"people"},"👦":{"emoji":"👦","platforms":["tw","a","g"],"description":"BOY","name":"boy","css":"boy","category":"people"},"👧":{"emoji":"👧","platforms":["tw","a","g"],"description":"GIRL","name":"girl","css":"girl","category":"people"},"👨":{"emoji":"👨","platforms":["tw","a","g"],"description":"MAN","name":"man","css":"man","category":"people"},"👩":{"emoji":"👩","platforms":["tw","a","g"],"description":"WOMAN","name":"woman","css":"woman","category":"people"},"👪":{"emoji":"👪","platforms":["tw","a","g"],"description":"FAMILY","name":"family","css":"family","category":"people"},"👫":{"emoji":"👫","platforms":["tw","a","g"],"description":"MAN AND WOMAN HOLDING HANDS","name":"couple","css":"couple","category":"people"},"👬":{"emoji":"👬","platforms":["tw","a","g"],"description":"TWO MEN HOLDING HANDS","name":"two_men_holding_hands","css":"two_men_holding_hands","category":"people"},"👭":{"emoji":"👭","platforms":["tw","a","g"],"description":"TWO WOMEN HOLDING HANDS","name":"two_women_holding_hands","css":"two_women_holding_hands","category":"people"},"👮":{"emoji":"👮","platforms":["tw","a","g"],"description":"POLICE OFFICER","name":"cop","css":"cop","category":"people"},"👯":{"emoji":"👯","platforms":["tw","a","g"],"description":"WOMAN WITH BUNNY EARS","name":"dancers","css":"dancers","category":"people"},"👰":{"emoji":"👰","platforms":["tw","a","g"],"description":"BRIDE WITH VEIL","name":"bride_with_veil","css":"bride_with_veil","category":"people"},"👱":{"emoji":"👱","platforms":["tw","a","g"],"description":"PERSON WITH BLOND HAIR","name":"person_with_blond_hair","css":"person_with_blond_hair","category":"people"},"👲":{"emoji":"👲","platforms":["tw","a","g"],"description":"MAN WITH GUA PI MAO","name":"man_with_gua_pi_mao","css":"man_with_gua_pi_mao","category":"people"},"👳":{"emoji":"👳","platforms":["tw","a","g"],"description":"MAN WITH TURBAN","name":"man_with_turban","css":"man_with_turban","category":"people"},"👴":{"emoji":"👴","platforms":["tw","a","g"],"description":"OLDER MAN","name":"older_man","css":"older_man","category":"people"},"👵":{"emoji":"👵","platforms":["tw","a","g"],"description":"OLDER WOMAN","name":"older_woman","css":"older_woman","category":"people"},"👶":{"emoji":"👶","platforms":["tw","a","g"],"description":"BABY","name":"baby","css":"baby","category":"people"},"👷":{"emoji":"👷","platforms":["tw","a","g"],"description":"CONSTRUCTION WORKER","name":"construction_worker","css":"construction_worker","category":"people"},"👸":{"emoji":"👸","platforms":["tw","a","g"],"description":"PRINCESS","name":"princess","css":"princess","category":"people"},"👹":{"emoji":"👹","platforms":["tw","a","g"],"description":"JAPANESE OGRE","name":"japanese_ogre","css":"japanese_ogre","category":"people"},"👺":{"emoji":"👺","platforms":["tw","a","g"],"description":"JAPANESE GOBLIN","name":"japanese_goblin","css":"japanese_goblin","category":"people"},"👻":{"emoji":"👻","platforms":["tw","a","g"],"description":"GHOST","name":"ghost","css":"ghost","category":"people"},"👼":{"emoji":"👼","platforms":["tw","a","g"],"description":"BABY ANGEL","name":"angel","css":"angel","category":"people"},"👽":{"emoji":"👽","platforms":["tw","a","g"],"description":"EXTRATERRESTRIAL ALIEN","name":"alien","css":"alien","category":"people"},"👾":{"emoji":"👾","platforms":["tw","a","g"],"description":"ALIEN MONSTER","name":"space_invader","css":"space_invader","category":"people"},"👿":{"emoji":"👿","platforms":["tw","a","g"],"description":"IMP","name":"imp","css":"imp","category":"people"},"💀":{"emoji":"💀","platforms":["tw","a","g"],"description":"SKULL","name":"skull","css":"skull","category":"people"},"💁":{"emoji":"💁","platforms":["tw","a","g"],"description":"INFORMATION DESK PERSON","name":"information_desk_person","css":"information_desk_person","category":"people"},"💂":{"emoji":"💂","platforms":["tw","a","g"],"description":"GUARDSMAN","name":"guardsman","css":"guardsman","category":"people"},"💃":{"emoji":"💃","platforms":["tw","a","g"],"description":"DANCER","name":"dancer","css":"dancer","category":"people"},"💄":{"emoji":"💄","platforms":["tw","a","g"],"description":"LIPSTICK","name":"lipstick","css":"lipstick","category":"people"},"💅":{"emoji":"💅","platforms":["tw","a","g"],"description":"NAIL POLISH","name":"nail_care","css":"nail_care","category":"people"},"💆":{"emoji":"💆","platforms":["tw","a","g"],"description":"FACE MASSAGE","name":"massage","css":"massage","category":"people"},"💇":{"emoji":"💇","platforms":["tw","a","g"],"description":"HAIRCUT","name":"haircut","css":"haircut","category":"people"},"💈":{"emoji":"💈","platforms":["tw","a","g"],"description":"BARBER POLE","name":"barber","css":"barber","category":"people"},"💉":{"emoji":"💉","platforms":["tw","a","g"],"description":"SYRINGE","name":"syringe","css":"syringe","category":"emotion"},"💊":{"emoji":"💊","platforms":["tw","a","g"],"description":"PILL","name":"pill","css":"pill","category":"emotion"},"💋":{"emoji":"💋","platforms":["tw","a","g"],"description":"KISS MARK","name":"kiss","css":"kiss","category":"emotion"},"💌":{"emoji":"💌","platforms":["tw","a","g"],"description":"LOVE LETTER","name":"love_letter","css":"love_letter","category":"emotion"},"💍":{"emoji":"💍","platforms":["tw","a","g"],"description":"RING","name":"ring","css":"ring","category":"emotion"},"💎":{"emoji":"💎","platforms":["tw","a","g"],"description":"GEM STONE","name":"gem","css":"gem","category":"emotion"},"💏":{"emoji":"💏","platforms":["tw","a","g"],"description":"KISS","name":"couplekiss","css":"couplekiss","category":"emotion"},"💐":{"emoji":"💐","platforms":["tw","a","g"],"description":"BOUQUET","name":"bouquet","css":"bouquet","category":"emotion"},"💑":{"emoji":"💑","platforms":["tw","a","g"],"description":"COUPLE WITH HEART","name":"couple_with_heart","css":"couple_with_heart","category":"emotion"},"💒":{"emoji":"💒","platforms":["tw","a","g"],"description":"WEDDING","name":"wedding","css":"wedding","category":"emotion"},"💓":{"emoji":"💓","platforms":["tw","a","g"],"description":"BEATING HEART","name":"heartbeat","css":"heartbeat","category":"emotion"},"💔":{"emoji":"💔","platforms":["tw","a","g"],"description":"BROKEN HEART","name":"broken_heart","css":"broken_heart","category":"emotion"},"💕":{"emoji":"💕","platforms":["tw","a","g"],"description":"TWO HEARTS","name":"two_hearts","css":"two_hearts","category":"emotion"},"💖":{"emoji":"💖","platforms":["tw","a","g"],"description":"SPARKLING HEART","name":"sparkling_heart","css":"sparkling_heart","category":"emotion"},"💗":{"emoji":"💗","platforms":["tw","a","g"],"description":"GROWING HEART","name":"heartpulse","css":"heartpulse","category":"emotion"},"💘":{"emoji":"💘","platforms":["tw","a","g"],"description":"HEART WITH ARROW","name":"cupid","css":"cupid","category":"emotion"},"💙":{"emoji":"💙","platforms":["tw","a","g"],"description":"BLUE HEART","name":"blue_heart","css":"blue_heart","category":"emotion"},"💚":{"emoji":"💚","platforms":["tw","a","g"],"description":"GREEN HEART","name":"green_heart","css":"green_heart","category":"emotion"},"💛":{"emoji":"💛","platforms":["tw","a","g"],"description":"YELLOW HEART","name":"yellow_heart","css":"yellow_heart","category":"emotion"},"💜":{"emoji":"💜","platforms":["tw","a","g"],"description":"PURPLE HEART","name":"purple_heart","css":"purple_heart","category":"emotion"},"💝":{"emoji":"💝","platforms":["tw","a","g"],"description":"HEART WITH RIBBON","name":"gift_heart","css":"gift_heart","category":"emotion"},"💞":{"emoji":"💞","platforms":["tw","a","g"],"description":"REVOLVING HEARTS","name":"revolving_hearts","css":"revolving_hearts","category":"emotion"},"💟":{"emoji":"💟","platforms":["tw","a","g"],"description":"HEART DECORATION","name":"heart_decoration","css":"heart_decoration","category":"emotion"},"💠":{"emoji":"💠","platforms":["tw","a","g"],"description":"DIAMOND SHAPE WITH A DOT INSIDE","name":"diamond_shape_with_a_dot_inside","css":"diamond_shape_with_a_dot_inside","category":"emotion"},"💡":{"emoji":"💡","platforms":["tw","a","g"],"description":"ELECTRIC LIGHT BULB","name":"bulb","css":"bulb","category":"emotion"},"💢":{"emoji":"💢","platforms":["tw","a","g"],"description":"ANGER SYMBOL","name":"anger","css":"anger","category":"emotion"},"💣":{"emoji":"💣","platforms":["tw","a","g"],"description":"BOMB","name":"bomb","css":"bomb","category":"emotion"},"💤":{"emoji":"💤","platforms":["tw","a","g"],"description":"SLEEPING SYMBOL","name":"zzz","css":"zzz","category":"emotion"},"💥":{"emoji":"💥","platforms":["tw","a","g"],"description":"COLLISION SYMBOL","name":"boom","css":"boom","category":"emotion"},"💦":{"emoji":"💦","platforms":["tw","a","g"],"description":"SPLASHING SWEAT SYMBOL","name":"sweat_drops","css":"sweat_drops","category":"emotion"},"💧":{"emoji":"💧","platforms":["tw","a","g"],"description":"DROPLET","name":"droplet","css":"droplet","category":"emotion"},"💨":{"emoji":"💨","platforms":["tw","a","g"],"description":"DASH SYMBOL","name":"dash","css":"dash","category":"emotion"},"💩":{"emoji":"💩","platforms":["tw","a","g"],"description":"PILE OF POO","name":"hankey","css":"hankey","category":"emotion"},"💪":{"emoji":"💪","platforms":["tw","a","g"],"description":"FLEXED BICEPS","name":"muscle","css":"muscle","category":"emotion"},"💫":{"emoji":"💫","platforms":["tw","a","g"],"description":"DIZZY SYMBOL","name":"dizzy","css":"dizzy","category":"emotion"},"💬":{"emoji":"💬","platforms":["tw","a","g"],"description":"SPEECH BALLOON","name":"speech_balloon","css":"speech_balloon","category":"emotion"},"💭":{"emoji":"💭","platforms":["tw","a","g"],"description":"THOUGHT BALLOON","name":"thought_balloon","css":"thought_balloon","category":"emotion"},"💮":{"emoji":"💮","platforms":["tw","a","g"],"description":"WHITE FLOWER","name":"white_flower","css":"white_flower","category":"emotion"},"💯":{"emoji":"💯","platforms":["tw","a","g"],"description":"HUNDRED POINTS SYMBOL","name":"100","css":"100","category":"emotion"},"💰":{"emoji":"💰","platforms":["tw","a","g"],"description":"MONEY BAG","name":"moneybag","css":"moneybag","category":"emotion"},"💱":{"emoji":"💱","platforms":["tw","a","g"],"description":"CURRENCY EXCHANGE","name":"currency_exchange","css":"currency_exchange","category":"emotion"},"💲":{"emoji":"💲","platforms":["tw","a","g"],"description":"HEAVY DOLLAR SIGN","name":"heavy_dollar_sign","css":"heavy_dollar_sign","category":"emotion"},"💳":{"emoji":"💳","platforms":["tw","a","g"],"description":"CREDIT CARD","name":"credit_card","css":"credit_card","category":"emotion"},"💴":{"emoji":"💴","platforms":["tw","a","g"],"description":"BANKNOTE WITH YEN SIGN","name":"yen","css":"yen","category":"emotion"},"💵":{"emoji":"💵","platforms":["tw","a","g"],"description":"BANKNOTE WITH DOLLAR SIGN","name":"dollar","css":"dollar","category":"emotion"},"💶":{"emoji":"💶","platforms":["tw","a","g"],"description":"BANKNOTE WITH EURO SIGN","name":"euro","css":"euro","category":"emotion"},"💷":{"emoji":"💷","platforms":["tw","a","g"],"description":"BANKNOTE WITH POUND SIGN","name":"pound","css":"pound","category":"emotion"},"💸":{"emoji":"💸","platforms":["tw","a","g"],"description":"MONEY WITH WINGS","name":"money_with_wings","css":"money_with_wings","category":"emotion"},"💹":{"emoji":"💹","platforms":["tw","a","g"],"description":"CHART WITH UPWARDS TREND AND YEN SIGN","name":"chart","css":"chart","category":"thing"},"💺":{"emoji":"💺","platforms":["tw","a","g"],"description":"SEAT","name":"seat","css":"seat","category":"thing"},"💻":{"emoji":"💻","platforms":["tw","a","g"],"description":"PERSONAL COMPUTER","name":"computer","css":"computer","category":"thing"},"💼":{"emoji":"💼","platforms":["tw","a","g"],"description":"BRIEFCASE","name":"briefcase","css":"briefcase","category":"thing"},"💽":{"emoji":"💽","platforms":["tw","a","g"],"description":"MINIDISC","name":"minidisc","css":"minidisc","category":"thing"},"💾":{"emoji":"💾","platforms":["tw","a","g"],"description":"FLOPPY DISK","name":"floppy_disk","css":"floppy_disk","category":"thing"},"💿":{"emoji":"💿","platforms":["tw","a","g"],"description":"OPTICAL DISC","name":"cd","css":"cd","category":"thing"},"📀":{"emoji":"📀","platforms":["tw","a","g"],"description":"DVD","name":"dvd","css":"dvd","category":"thing"},"📁":{"emoji":"📁","platforms":["tw","a","g"],"description":"FILE FOLDER","name":"file_folder","css":"file_folder","category":"thing"},"📂":{"emoji":"📂","platforms":["tw","a","g"],"description":"OPEN FILE FOLDER","name":"open_file_folder","css":"open_file_folder","category":"thing"},"📃":{"emoji":"📃","platforms":["tw","a","g"],"description":"PAGE WITH CURL","name":"page_with_curl","css":"page_with_curl","category":"thing"},"📄":{"emoji":"📄","platforms":["tw","a","g"],"description":"PAGE FACING UP","name":"page_facing_up","css":"page_facing_up","category":"thing"},"📅":{"emoji":"📅","platforms":["tw","a","g"],"description":"CALENDAR","name":"date","css":"date","category":"thing"},"📆":{"emoji":"📆","platforms":["tw","a","g"],"description":"TEAR-OFF CALENDAR","name":"calendar","css":"calendar","category":"thing"},"📇":{"emoji":"📇","platforms":["tw","a","g"],"description":"CARD INDEX","name":"card_index","css":"card_index","category":"thing"},"📈":{"emoji":"📈","platforms":["tw","a","g"],"description":"CHART WITH UPWARDS TREND","name":"chart_with_upwards_trend","css":"chart_with_upwards_trend","category":"thing"},"📉":{"emoji":"📉","platforms":["tw","a","g"],"description":"CHART WITH DOWNWARDS TREND","name":"chart_with_downwards_trend","css":"chart_with_downwards_trend","category":"thing"},"📊":{"emoji":"📊","platforms":["tw","a","g"],"description":"BAR CHART","name":"bar_chart","css":"bar_chart","category":"thing"},"📋":{"emoji":"📋","platforms":["tw","a","g"],"description":"CLIPBOARD","name":"clipboard","css":"clipboard","category":"thing"},"📌":{"emoji":"📌","platforms":["tw","a","g"],"description":"PUSHPIN","name":"pushpin","css":"pushpin","category":"thing"},"📍":{"emoji":"📍","platforms":["tw","a","g"],"description":"ROUND PUSHPIN","name":"round_pushpin","css":"round_pushpin","category":"thing"},"📎":{"emoji":"📎","platforms":["tw","a","g"],"description":"PAPERCLIP","name":"paperclip","css":"paperclip","category":"thing"},"📏":{"emoji":"📏","platforms":["tw","a","g"],"description":"STRAIGHT RULER","name":"straight_ruler","css":"straight_ruler","category":"thing"},"📐":{"emoji":"📐","platforms":["tw","a","g"],"description":"TRIANGULAR RULER","name":"triangular_ruler","css":"triangular_ruler","category":"thing"},"📑":{"emoji":"📑","platforms":["tw","a","g"],"description":"BOOKMARK TABS","name":"bookmark_tabs","css":"bookmark_tabs","category":"thing"},"📒":{"emoji":"📒","platforms":["tw","a","g"],"description":"LEDGER","name":"ledger","css":"ledger","category":"thing"},"📓":{"emoji":"📓","platforms":["tw","a","g"],"description":"NOTEBOOK","name":"notebook","css":"notebook","category":"thing"},"📔":{"emoji":"📔","platforms":["tw","a","g"],"description":"NOTEBOOK WITH DECORATIVE COVER","name":"notebook_with_decorative_cover","css":"notebook_with_decorative_cover","category":"thing"},"📕":{"emoji":"📕","platforms":["tw","a","g"],"description":"CLOSED BOOK","name":"closed_book","css":"closed_book","category":"thing"},"📖":{"emoji":"📖","platforms":["tw","a","g"],"description":"OPEN BOOK","name":"book","css":"book","category":"thing"},"📗":{"emoji":"📗","platforms":["tw","a","g"],"description":"GREEN BOOK","name":"green_book","css":"green_book","category":"thing"},"📘":{"emoji":"📘","platforms":["tw","a","g"],"description":"BLUE BOOK","name":"blue_book","css":"blue_book","category":"thing"},"📙":{"emoji":"📙","platforms":["tw","a","g"],"description":"ORANGE BOOK","name":"orange_book","css":"orange_book","category":"thing"},"📚":{"emoji":"📚","platforms":["tw","a","g"],"description":"BOOKS","name":"books","css":"books","category":"thing"},"📛":{"emoji":"📛","platforms":["tw","a","g"],"description":"NAME BADGE","name":"name_badge","css":"name_badge","category":"thing"},"📜":{"emoji":"📜","platforms":["tw","a","g"],"description":"SCROLL","name":"scroll","css":"scroll","category":"thing"},"📝":{"emoji":"📝","platforms":["tw","a","g"],"description":"MEMO","name":"memo","css":"memo","category":"thing"},"📞":{"emoji":"📞","platforms":["tw","a","g"],"description":"TELEPHONE RECEIVER","name":"telephone_receiver","css":"telephone_receiver","category":"thing"},"📟":{"emoji":"📟","platforms":["tw","a","g"],"description":"PAGER","name":"pager","css":"pager","category":"thing"},"📠":{"emoji":"📠","platforms":["tw","a","g"],"description":"FAX MACHINE","name":"fax","css":"fax","category":"thing"},"📡":{"emoji":"📡","platforms":["tw","a","g"],"description":"SATELLITE ANTENNA","name":"satellite","css":"satellite","category":"thing"},"📢":{"emoji":"📢","platforms":["tw","a","g"],"description":"PUBLIC ADDRESS LOUDSPEAKER","name":"loudspeaker","css":"loudspeaker","category":"thing"},"📣":{"emoji":"📣","platforms":["tw","a","g"],"description":"CHEERING MEGAPHONE","name":"mega","css":"mega","category":"thing"},"📤":{"emoji":"📤","platforms":["tw","a","g"],"description":"OUTBOX TRAY","name":"outbox_tray","css":"outbox_tray","category":"thing"},"📥":{"emoji":"📥","platforms":["tw","a","g"],"description":"INBOX TRAY","name":"inbox_tray","css":"inbox_tray","category":"thing"},"📦":{"emoji":"📦","platforms":["tw","a","g"],"description":"PACKAGE","name":"package","css":"package","category":"thing"},"📧":{"emoji":"📧","platforms":["tw","a","g"],"description":"E-MAIL SYMBOL","name":"e-mail","css":"e-mail","category":"thing"},"📨":{"emoji":"📨","platforms":["tw","a","g"],"description":"INCOMING ENVELOPE","name":"incoming_envelope","css":"incoming_envelope","category":"thing"},"📩":{"emoji":"📩","platforms":["tw","a","g"],"description":"ENVELOPE WITH DOWNWARDS ARROW ABOVE","name":"envelope_with_arrow","css":"envelope_with_arrow","category":"thing"},"📪":{"emoji":"📪","platforms":["tw","a","g"],"description":"CLOSED MAILBOX WITH LOWERED FLAG","name":"mailbox_closed","css":"mailbox_closed","category":"thing"},"📫":{"emoji":"📫","platforms":["tw","a","g"],"description":"CLOSED MAILBOX WITH RAISED FLAG","name":"mailbox","css":"mailbox","category":"thing"},"📬":{"emoji":"📬","platforms":["tw","a","g"],"description":"OPEN MAILBOX WITH RAISED FLAG","name":"mailbox_with_mail","css":"mailbox_with_mail","category":"thing"},"📭":{"emoji":"📭","platforms":["tw","a","g"],"description":"OPEN MAILBOX WITH LOWERED FLAG","name":"mailbox_with_no_mail","css":"mailbox_with_no_mail","category":"thing"},"📮":{"emoji":"📮","platforms":["tw","a","g"],"description":"POSTBOX","name":"postbox","css":"postbox","category":"thing"},"📯":{"emoji":"📯","platforms":["tw","a","g"],"description":"POSTAL HORN","name":"postal_horn","css":"postal_horn","category":"thing"},"📰":{"emoji":"📰","platforms":["tw","a","g"],"description":"NEWSPAPER","name":"newspaper","css":"newspaper","category":"thing"},"📱":{"emoji":"📱","platforms":["tw","a","g"],"description":"MOBILE PHONE","name":"iphone","css":"iphone","category":"thing"},"📲":{"emoji":"📲","platforms":["tw","a","g"],"description":"MOBILE PHONE WITH RIGHTWARDS ARROW AT LEFT","name":"calling","css":"calling","category":"thing"},"📳":{"emoji":"📳","platforms":["tw","a","g"],"description":"VIBRATION MODE","name":"vibration_mode","css":"vibration_mode","category":"thing"},"📴":{"emoji":"📴","platforms":["tw","a","g"],"description":"MOBILE PHONE OFF","name":"mobile_phone_off","css":"mobile_phone_off","category":"thing"},"📵":{"emoji":"📵","platforms":["tw","a","g"],"description":"NO MOBILE PHONES","name":"no_mobile_phones","css":"no_mobile_phones","category":"thing"},"📶":{"emoji":"📶","platforms":["tw","a","g"],"description":"ANTENNA WITH BARS","name":"signal_strength","css":"signal_strength","category":"thing"},"📷":{"emoji":"📷","platforms":["tw","a","g"],"description":"CAMERA","name":"camera","css":"camera","category":"thing"},"📹":{"emoji":"📹","platforms":["tw","a","g"],"description":"VIDEO CAMERA","name":"video_camera","css":"video_camera","category":"thing"},"📺":{"emoji":"📺","platforms":["tw","a","g"],"description":"TELEVISION","name":"tv","css":"tv","category":"thing"},"📻":{"emoji":"📻","platforms":["tw","a","g"],"description":"RADIO","name":"radio","css":"radio","category":"thing"},"📼":{"emoji":"📼","platforms":["tw","a","g"],"description":"VIDEOCASSETTE","name":"vhs","css":"vhs","category":"thing"},"🔀":{"emoji":"🔀","platforms":["tw","a","g"],"description":"TWISTED RIGHTWARDS ARROWS","name":"twisted_rightwards_arrows","css":"twisted_rightwards_arrows","category":"thing"},"🔁":{"emoji":"🔁","platforms":["tw","a","g"],"description":"CLOCKWISE RIGHTWARDS AND LEFTWARDS OPEN CIRCLE ARROWS","name":"repeat","css":"repeat","category":"thing"},"🔂":{"emoji":"🔂","platforms":["tw","a","g"],"description":"CLOCKWISE RIGHTWARDS AND LEFTWARDS OPEN CIRCLE ARROWS WITH CIRCLED ONE OVERLAY","name":"repeat_one","css":"repeat_one","category":"thing"},"🔃":{"emoji":"🔃","platforms":["tw","a","g"],"description":"CLOCKWISE DOWNWARDS AND UPWARDS OPEN CIRCLE ARROWS","name":"arrows_clockwise","css":"arrows_clockwise","category":"thing"},"🔄":{"emoji":"🔄","platforms":["tw","a","g"],"description":"ANTICLOCKWISE DOWNWARDS AND UPWARDS OPEN CIRCLE ARROWS","name":"arrows_counterclockwise","css":"arrows_counterclockwise","category":"thing"},"🔅":{"emoji":"🔅","platforms":["tw","a","g"],"description":"LOW BRIGHTNESS SYMBOL","name":"low_brightness","css":"low_brightness","category":"thing"},"🔆":{"emoji":"🔆","platforms":["tw","a","g"],"description":"HIGH BRIGHTNESS SYMBOL","name":"high_brightness","css":"high_brightness","category":"thing"},"🔇":{"emoji":"🔇","platforms":["tw","a","g"],"description":"SPEAKER WITH CANCELLATION STROKE","name":"mute","css":"mute","category":"thing"},"🔈":{"emoji":"🔈","platforms":["tw","a","g"],"description":"SPEAKER","name":"speaker","css":"speaker","category":"thing"},"🔉":{"emoji":"🔉","platforms":["tw","a","g"],"description":"SPEAKER WITH ONE SOUND WAVE","name":"sound","css":"sound","category":"thing"},"🔊":{"emoji":"🔊","platforms":["tw","a","g"],"description":"SPEAKER WITH THREE SOUND WAVES","name":"loud_sound","css":"loud_sound","category":"thing"},"🔋":{"emoji":"🔋","platforms":["tw","a","g"],"description":"BATTERY","name":"battery","css":"battery","category":"thing"},"🔌":{"emoji":"🔌","platforms":["tw","a","g"],"description":"ELECTRIC PLUG","name":"electric_plug","css":"electric_plug","category":"thing"},"🔍":{"emoji":"🔍","platforms":["tw","a","g"],"description":"LEFT-POINTING MAGNIFYING GLASS","name":"mag","css":"mag","category":"thing"},"🔎":{"emoji":"🔎","platforms":["tw","a","g"],"description":"RIGHT-POINTING MAGNIFYING GLASS","name":"mag_right","css":"mag_right","category":"thing"},"🔏":{"emoji":"🔏","platforms":["tw","a","g"],"description":"LOCK WITH INK PEN","name":"lock_with_ink_pen","css":"lock_with_ink_pen","category":"thing"},"🔐":{"emoji":"🔐","platforms":["tw","a","g"],"description":"CLOSED LOCK WITH KEY","name":"closed_lock_with_key","css":"closed_lock_with_key","category":"thing"},"🔑":{"emoji":"🔑","platforms":["tw","a","g"],"description":"KEY","name":"key","css":"key","category":"thing"},"🔒":{"emoji":"🔒","platforms":["tw","a","g"],"description":"LOCK","name":"lock","css":"lock","category":"thing"},"🔓":{"emoji":"🔓","platforms":["tw","a","g"],"description":"OPEN LOCK","name":"unlock","css":"unlock","category":"thing"},"🔔":{"emoji":"🔔","platforms":["tw","a","g"],"description":"BELL","name":"bell","css":"bell","category":"thing"},"🔕":{"emoji":"🔕","platforms":["tw","a","g"],"description":"BELL WITH CANCELLATION STROKE","name":"no_bell","css":"no_bell","category":"thing"},"🔖":{"emoji":"🔖","platforms":["tw","a","g"],"description":"BOOKMARK","name":"bookmark","css":"bookmark","category":"folderol"},"🔗":{"emoji":"🔗","platforms":["tw","a","g"],"description":"LINK SYMBOL","name":"link","css":"link","category":"folderol"},"🔘":{"emoji":"🔘","platforms":["tw","a","g"],"description":"RADIO BUTTON","name":"radio_button","css":"radio_button","category":"folderol"},"🔙":{"emoji":"🔙","platforms":["tw","a","g"],"description":"BACK WITH LEFTWARDS ARROW ABOVE","name":"back","css":"back","category":"folderol"},"🔚":{"emoji":"🔚","platforms":["tw","a","g"],"description":"END WITH LEFTWARDS ARROW ABOVE","name":"end","css":"end","category":"folderol"},"🔛":{"emoji":"🔛","platforms":["tw","a","g"],"description":"ON WITH EXCLAMATION MARK WITH LEFT RIGHT ARROW ABOVE","name":"on","css":"on","category":"folderol"},"🔜":{"emoji":"🔜","platforms":["tw","a","g"],"description":"SOON WITH RIGHTWARDS ARROW ABOVE","name":"soon","css":"soon","category":"folderol"},"🔝":{"emoji":"🔝","platforms":["tw","a","g"],"description":"TOP WITH UPWARDS ARROW ABOVE","name":"top","css":"top","category":"folderol"},"🔞":{"emoji":"🔞","platforms":["tw","a","g"],"description":"NO ONE UNDER EIGHTEEN SYMBOL","name":"underage","css":"underage","category":"folderol"},"🔟":{"emoji":"🔟","platforms":["tw","a","g"],"description":"KEYCAP TEN","name":"keycap_ten","css":"keycap_ten","category":"folderol"},"🔠":{"emoji":"🔠","platforms":["tw","a","g"],"description":"INPUT SYMBOL FOR LATIN CAPITAL LETTERS","name":"capital_abcd","css":"capital_abcd","category":"folderol"},"🔡":{"emoji":"🔡","platforms":["tw","a","g"],"description":"INPUT SYMBOL FOR LATIN SMALL LETTERS","name":"abcd","css":"abcd","category":"folderol"},"🔢":{"emoji":"🔢","platforms":["tw","a","g"],"description":"INPUT SYMBOL FOR NUMBERS","name":"1234","css":"1234","category":"folderol"},"🔣":{"emoji":"🔣","platforms":["tw","a","g"],"description":"INPUT SYMBOL FOR SYMBOLS","name":"symbols","css":"symbols","category":"folderol"},"🔤":{"emoji":"🔤","platforms":["tw","a","g"],"description":"INPUT SYMBOL FOR LATIN LETTERS","name":"abc","css":"abc","category":"folderol"},"🔥":{"emoji":"🔥","platforms":["tw","a","g"],"description":"FIRE","name":"fire","css":"fire","category":"thing"},"🔦":{"emoji":"🔦","platforms":["tw","a","g"],"description":"ELECTRIC TORCH","name":"flashlight","css":"flashlight","category":"thing"},"🔧":{"emoji":"🔧","platforms":["tw","a","g"],"description":"WRENCH","name":"wrench","css":"wrench","category":"thing"},"🔨":{"emoji":"🔨","platforms":["tw","a","g"],"description":"HAMMER","name":"hammer","css":"hammer","category":"thing"},"🔩":{"emoji":"🔩","platforms":["tw","a","g"],"description":"NUT AND BOLT","name":"nut_and_bolt","css":"nut_and_bolt","category":"thing"},"🔪":{"emoji":"🔪","platforms":["tw","a","g"],"description":"HOCHO","name":"hocho","css":"hocho","category":"thing"},"🔫":{"emoji":"🔫","platforms":["tw","a","g"],"description":"PISTOL","name":"gun","css":"gun","category":"thing"},"🔬":{"emoji":"🔬","platforms":["tw","a","g"],"description":"MICROSCOPE","name":"microscope","css":"microscope","category":"thing"},"🔭":{"emoji":"🔭","platforms":["tw","a","g"],"description":"TELESCOPE","name":"telescope","css":"telescope","category":"thing"},"🔮":{"emoji":"🔮","platforms":["tw","a","g"],"description":"CRYSTAL BALL","name":"crystal_ball","css":"crystal_ball","category":"thing"},"🔯":{"emoji":"🔯","platforms":["tw","a","g"],"description":"SIX POINTED STAR WITH MIDDLE DOT","name":"six_pointed_star","css":"six_pointed_star","category":"thing"},"🔰":{"emoji":"🔰","platforms":["tw","a","g"],"description":"JAPANESE SYMBOL FOR BEGINNER","name":"beginner","css":"beginner","category":"thing"},"🔱":{"emoji":"🔱","platforms":["tw","a","g"],"description":"TRIDENT EMBLEM","name":"trident","css":"trident","category":"thing"},"🔲":{"emoji":"🔲","platforms":["tw","a","g"],"description":"BLACK SQUARE BUTTON","name":"black_square_button","css":"black_square_button","category":"folderol"},"🔳":{"emoji":"🔳","platforms":["tw","a","g"],"description":"WHITE SQUARE BUTTON","name":"white_square_button","css":"white_square_button","category":"folderol"},"🔴":{"emoji":"🔴","platforms":["tw","a","g"],"description":"LARGE RED CIRCLE","name":"red_circle","css":"red_circle","category":"folderol"},"🔵":{"emoji":"🔵","platforms":["tw","a","g"],"description":"LARGE BLUE CIRCLE","name":"large_blue_circle","css":"large_blue_circle","category":"folderol"},"🔶":{"emoji":"🔶","platforms":["tw","a","g"],"description":"LARGE ORANGE DIAMOND","name":"large_orange_diamond","css":"large_orange_diamond","category":"folderol"},"🔷":{"emoji":"🔷","platforms":["tw","a","g"],"description":"LARGE BLUE DIAMOND","name":"large_blue_diamond","css":"large_blue_diamond","category":"folderol"},"🔸":{"emoji":"🔸","platforms":["tw","a","g"],"description":"SMALL ORANGE DIAMOND","name":"small_orange_diamond","css":"small_orange_diamond","category":"folderol"},"🔹":{"emoji":"🔹","platforms":["tw","a","g"],"description":"SMALL BLUE DIAMOND","name":"small_blue_diamond","css":"small_blue_diamond","category":"folderol"},"🔺":{"emoji":"🔺","platforms":["tw","a","g"],"description":"UP-POINTING RED TRIANGLE","name":"small_red_triangle","css":"small_red_triangle","category":"folderol"},"🔻":{"emoji":"🔻","platforms":["tw","a","g"],"description":"DOWN-POINTING RED TRIANGLE","name":"small_red_triangle_down","css":"small_red_triangle_down","category":"folderol"},"🔼":{"emoji":"🔼","platforms":["tw","a","g"],"description":"UP-POINTING SMALL RED TRIANGLE","name":"arrow_up_small","css":"arrow_up_small","category":"folderol"},"🔽":{"emoji":"🔽","platforms":["tw","a","g"],"description":"DOWN-POINTING SMALL RED TRIANGLE","name":"arrow_down_small","css":"arrow_down_small","category":"folderol"},"🕐":{"emoji":"🕐","platforms":["tw","a","g"],"description":"CLOCK FACE ONE OCLOCK","name":"clock1","css":"clock1","category":"folderol"},"🕑":{"emoji":"🕑","platforms":["tw","a","g"],"description":"CLOCK FACE TWO OCLOCK","name":"clock2","css":"clock2","category":"folderol"},"🕒":{"emoji":"🕒","platforms":["tw","a","g"],"description":"CLOCK FACE THREE OCLOCK","name":"clock3","css":"clock3","category":"folderol"},"🕓":{"emoji":"🕓","platforms":["tw","a","g"],"description":"CLOCK FACE FOUR OCLOCK","name":"clock4","css":"clock4","category":"folderol"},"🕔":{"emoji":"🕔","platforms":["tw","a","g"],"description":"CLOCK FACE FIVE OCLOCK","name":"clock5","css":"clock5","category":"folderol"},"🕕":{"emoji":"🕕","platforms":["tw","a","g"],"description":"CLOCK FACE SIX OCLOCK","name":"clock6","css":"clock6","category":"folderol"},"🕖":{"emoji":"🕖","platforms":["tw","a","g"],"description":"CLOCK FACE SEVEN OCLOCK","name":"clock7","css":"clock7","category":"folderol"},"🕗":{"emoji":"🕗","platforms":["tw","a","g"],"description":"CLOCK FACE EIGHT OCLOCK","name":"clock8","css":"clock8","category":"folderol"},"🕘":{"emoji":"🕘","platforms":["tw","a","g"],"description":"CLOCK FACE NINE OCLOCK","name":"clock9","css":"clock9","category":"folderol"},"🕙":{"emoji":"🕙","platforms":["tw","a","g"],"description":"CLOCK FACE TEN OCLOCK","name":"clock10","css":"clock10","category":"folderol"},"🕚":{"emoji":"🕚","platforms":["tw","a","g"],"description":"CLOCK FACE ELEVEN OCLOCK","name":"clock11","css":"clock11","category":"folderol"},"🕛":{"emoji":"🕛","platforms":["tw","a","g"],"description":"CLOCK FACE TWELVE OCLOCK","name":"clock12","css":"clock12","category":"folderol"},"🕜":{"emoji":"🕜","platforms":["tw","a","g"],"description":"CLOCK FACE ONE-THIRTY","name":"clock130","css":"clock130","category":"folderol"},"🕝":{"emoji":"🕝","platforms":["tw","a","g"],"description":"CLOCK FACE TWO-THIRTY","name":"clock230","css":"clock230","category":"folderol"},"🕞":{"emoji":"🕞","platforms":["tw","a","g"],"description":"CLOCK FACE THREE-THIRTY","name":"clock330","css":"clock330","category":"folderol"},"🕟":{"emoji":"🕟","platforms":["tw","a","g"],"description":"CLOCK FACE FOUR-THIRTY","name":"clock430","css":"clock430","category":"folderol"},"🕠":{"emoji":"🕠","platforms":["tw","a","g"],"description":"CLOCK FACE FIVE-THIRTY","name":"clock530","css":"clock530","category":"folderol"},"🕡":{"emoji":"🕡","platforms":["tw","a","g"],"description":"CLOCK FACE SIX-THIRTY","name":"clock630","css":"clock630","category":"folderol"},"🕢":{"emoji":"🕢","platforms":["tw","a","g"],"description":"CLOCK FACE SEVEN-THIRTY","name":"clock730","css":"clock730","category":"folderol"},"🕣":{"emoji":"🕣","platforms":["tw","a","g"],"description":"CLOCK FACE EIGHT-THIRTY","name":"clock830","css":"clock830","category":"folderol"},"🕤":{"emoji":"🕤","platforms":["tw","a","g"],"description":"CLOCK FACE NINE-THIRTY","name":"clock930","css":"clock930","category":"folderol"},"🕥":{"emoji":"🕥","platforms":["tw","a","g"],"description":"CLOCK FACE TEN-THIRTY","name":"clock1030","css":"clock1030","category":"folderol"},"🕦":{"emoji":"🕦","platforms":["tw","a","g"],"description":"CLOCK FACE ELEVEN-THIRTY","name":"clock1130","css":"clock1130","category":"folderol"},"🕧":{"emoji":"🕧","platforms":["tw","a","g"],"description":"CLOCK FACE TWELVE-THIRTY","name":"clock1230","css":"clock1230","category":"folderol"},"🗻":{"emoji":"🗻","platforms":["tw","a","g"],"description":"MOUNT FUJI","name":"mount_fuji","css":"mount_fuji","category":"travel"},"🗼":{"emoji":"🗼","platforms":["tw","a","g"],"description":"TOKYO TOWER","name":"tokyo_tower","css":"tokyo_tower","category":"travel"},"🗽":{"emoji":"🗽","platforms":["tw","a","g"],"description":"STATUE OF LIBERTY","name":"statue_of_liberty","css":"statue_of_liberty","category":"travel"},"🗾":{"emoji":"🗾","platforms":["tw","a","g"],"description":"SILHOUETTE OF JAPAN","name":"japan","css":"japan","category":"travel"},"🗿":{"emoji":"🗿","platforms":["tw","a","g"],"description":"MOYAI","name":"moyai","css":"moyai","category":"travel"},"😀":{"emoji":"😀","platforms":["tw","a","g"],"description":"GRINNING FACE","name":"grinning","css":"grinning","category":"people"},"😁":{"emoji":"😁","platforms":["tw","a","g"],"description":"GRINNING FACE WITH SMILING EYES","name":"grin","css":"grin","category":"people"},"😂":{"emoji":"😂","platforms":["tw","a","g"],"description":"FACE WITH TEARS OF JOY","name":"joy","css":"joy","category":"people"},"😃":{"emoji":"😃","platforms":["tw","a","g"],"description":"SMILING FACE WITH OPEN MOUTH","name":"smiley","css":"smiley","category":"people"},"😄":{"emoji":"😄","platforms":["tw","a","g"],"description":"SMILING FACE WITH OPEN MOUTH AND SMILING EYES","name":"smile","css":"smile","category":"people"},"😅":{"emoji":"😅","platforms":["tw","a","g"],"description":"SMILING FACE WITH OPEN MOUTH AND COLD SWEAT","name":"sweat_smile","css":"sweat_smile","category":"people"},"😆":{"emoji":"😆","platforms":["tw","a","g"],"description":"SMILING FACE WITH OPEN MOUTH AND TIGHTLY-CLOSED EYES","name":"laughing","css":"laughing","category":"people"},"😇":{"emoji":"😇","platforms":["tw","a","g"],"description":"SMILING FACE WITH HALO","name":"innocent","css":"innocent","category":"people"},"😈":{"emoji":"😈","platforms":["tw","a","g"],"description":"SMILING FACE WITH HORNS","name":"smiling_imp","css":"smiling_imp","category":"people"},"😉":{"emoji":"😉","platforms":["tw","a","g"],"description":"WINKING FACE","name":"wink","css":"wink","category":"people"},"😊":{"emoji":"😊","platforms":["tw","a","g"],"description":"SMILING FACE WITH SMILING EYES","name":"blush","css":"blush","category":"people"},"😋":{"emoji":"😋","platforms":["tw","a","g"],"description":"FACE SAVOURING DELICIOUS FOOD","name":"yum","css":"yum","category":"people"},"😌":{"emoji":"😌","platforms":["tw","a","g"],"description":"RELIEVED FACE","name":"relieved","css":"relieved","category":"people"},"😍":{"emoji":"😍","platforms":["tw","a","g"],"description":"SMILING FACE WITH HEART-SHAPED EYES","name":"heart_eyes","css":"heart_eyes","category":"people"},"😎":{"emoji":"😎","platforms":["tw","a","g"],"description":"SMILING FACE WITH SUNGLASSES","name":"sunglasses","css":"sunglasses","category":"people"},"😏":{"emoji":"😏","platforms":["tw","a","g"],"description":"SMIRKING FACE","name":"smirk","css":"smirk","category":"people"},"😐":{"emoji":"😐","platforms":["tw","a","g"],"description":"NEUTRAL FACE","name":"neutral_face","css":"neutral_face","category":"people"},"😑":{"emoji":"😑","platforms":["tw","a","g"],"description":"EXPRESSIONLESS FACE","name":"expressionless","css":"expressionless","category":"people"},"😒":{"emoji":"😒","platforms":["tw","a","g"],"description":"UNAMUSED FACE","name":"unamused","css":"unamused","category":"people"},"😓":{"emoji":"😓","platforms":["tw","a","g"],"description":"FACE WITH COLD SWEAT","name":"sweat","css":"sweat","category":"people"},"😔":{"emoji":"😔","platforms":["tw","a","g"],"description":"PENSIVE FACE","name":"pensive","css":"pensive","category":"people"},"😕":{"emoji":"😕","platforms":["tw","a","g"],"description":"CONFUSED FACE","name":"confused","css":"confused","category":"people"},"😖":{"emoji":"😖","platforms":["tw","a","g"],"description":"CONFOUNDED FACE","name":"confounded","css":"confounded","category":"people"},"😗":{"emoji":"😗","platforms":["tw","a","g"],"description":"KISSING FACE","name":"kissing","css":"kissing","category":"people"},"😘":{"emoji":"😘","platforms":["tw","a","g"],"description":"FACE THROWING A KISS","name":"kissing_heart","css":"kissing_heart","category":"people"},"😙":{"emoji":"😙","platforms":["tw","a","g"],"description":"KISSING FACE WITH SMILING EYES","name":"kissing_smiling_eyes","css":"kissing_smiling_eyes","category":"people"},"😚":{"emoji":"😚","platforms":["tw","a","g"],"description":"KISSING FACE WITH CLOSED EYES","name":"kissing_closed_eyes","css":"kissing_closed_eyes","category":"people"},"😛":{"emoji":"😛","platforms":["tw","a","g"],"description":"FACE WITH STUCK-OUT TONGUE","name":"stuck_out_tongue","css":"stuck_out_tongue","category":"people"},"😜":{"emoji":"😜","platforms":["tw","a","g"],"description":"FACE WITH STUCK-OUT TONGUE AND WINKING EYE","name":"stuck_out_tongue_winking_eye","css":"stuck_out_tongue_winking_eye","category":"people"},"😝":{"emoji":"😝","platforms":["tw","a","g"],"description":"FACE WITH STUCK-OUT TONGUE AND TIGHTLY-CLOSED EYES","name":"stuck_out_tongue_closed_eyes","css":"stuck_out_tongue_closed_eyes","category":"people"},"😞":{"emoji":"😞","platforms":["tw","a","g"],"description":"DISAPPOINTED FACE","name":"disappointed","css":"disappointed","category":"people"},"😟":{"emoji":"😟","platforms":["tw","a","g"],"description":"WORRIED FACE","name":"worried","css":"worried","category":"people"},"😠":{"emoji":"😠","platforms":["tw","a","g"],"description":"ANGRY FACE","name":"angry","css":"angry","category":"people"},"😡":{"emoji":"😡","platforms":["tw","a","g"],"description":"POUTING FACE","name":"rage","css":"rage","category":"people"},"😢":{"emoji":"😢","platforms":["tw","a","g"],"description":"CRYING FACE","name":"cry","css":"cry","category":"people"},"😣":{"emoji":"😣","platforms":["tw","a","g"],"description":"PERSEVERING FACE","name":"persevere","css":"persevere","category":"people"},"😤":{"emoji":"😤","platforms":["tw","a","g"],"description":"FACE WITH LOOK OF TRIUMPH","name":"triumph","css":"triumph","category":"people"},"😥":{"emoji":"😥","platforms":["tw","a","g"],"description":"DISAPPOINTED BUT RELIEVED FACE","name":"disappointed_relieved","css":"disappointed_relieved","category":"people"},"😦":{"emoji":"😦","platforms":["tw","a","g"],"description":"FROWNING FACE WITH OPEN MOUTH","name":"frowning","css":"frowning","category":"people"},"😧":{"emoji":"😧","platforms":["tw","a","g"],"description":"ANGUISHED FACE","name":"anguished","css":"anguished","category":"people"},"😨":{"emoji":"😨","platforms":["tw","a","g"],"description":"FEARFUL FACE","name":"fearful","css":"fearful","category":"people"},"😩":{"emoji":"😩","platforms":["tw","a","g"],"description":"WEARY FACE","name":"weary","css":"weary","category":"people"},"😪":{"emoji":"😪","platforms":["tw","a","g"],"description":"SLEEPY FACE","name":"sleepy","css":"sleepy","category":"people"},"😫":{"emoji":"😫","platforms":["tw","a","g"],"description":"TIRED FACE","name":"tired_face","css":"tired_face","category":"people"},"😬":{"emoji":"😬","platforms":["tw","a","g"],"description":"GRIMACING FACE","name":"grimacing","css":"grimacing","category":"people"},"😭":{"emoji":"😭","platforms":["tw","a","g"],"description":"LOUDLY CRYING FACE","name":"sob","css":"sob","category":"people"},"😮":{"emoji":"😮","platforms":["tw","a","g"],"description":"FACE WITH OPEN MOUTH","name":"open_mouth","css":"open_mouth","category":"people"},"😯":{"emoji":"😯","platforms":["tw","a","g"],"description":"HUSHED FACE","name":"hushed","css":"hushed","category":"people"},"😰":{"emoji":"😰","platforms":["tw","a","g"],"description":"FACE WITH OPEN MOUTH AND COLD SWEAT","name":"cold_sweat","css":"cold_sweat","category":"people"},"😱":{"emoji":"😱","platforms":["tw","a","g"],"description":"FACE SCREAMING IN FEAR","name":"scream","css":"scream","category":"people"},"😲":{"emoji":"😲","platforms":["tw","a","g"],"description":"ASTONISHED FACE","name":"astonished","css":"astonished","category":"people"},"😳":{"emoji":"😳","platforms":["tw","a","g"],"description":"FLUSHED FACE","name":"flushed","css":"flushed","category":"people"},"😴":{"emoji":"😴","platforms":["tw","a","g"],"description":"SLEEPING FACE","name":"sleeping","css":"sleeping","category":"people"},"😵":{"emoji":"😵","platforms":["tw","a","g"],"description":"DIZZY FACE","name":"dizzy_face","css":"dizzy_face","category":"people"},"😶":{"emoji":"😶","platforms":["tw","a","g"],"description":"FACE WITHOUT MOUTH","name":"no_mouth","css":"no_mouth","category":"people"},"😷":{"emoji":"😷","platforms":["tw","a","g"],"description":"FACE WITH MEDICAL MASK","name":"mask","css":"mask","category":"people"},"😸":{"emoji":"😸","platforms":["tw","a","g"],"description":"GRINNING CAT FACE WITH SMILING EYES","name":"smile_cat","css":"smile_cat","category":"people"},"😹":{"emoji":"😹","platforms":["tw","a","g"],"description":"CAT FACE WITH TEARS OF JOY","name":"joy_cat","css":"joy_cat","category":"people"},"😺":{"emoji":"😺","platforms":["tw","a","g"],"description":"SMILING CAT FACE WITH OPEN MOUTH","name":"smiley_cat","css":"smiley_cat","category":"people"},"😻":{"emoji":"😻","platforms":["tw","a","g"],"description":"SMILING CAT FACE WITH HEART-SHAPED EYES","name":"heart_eyes_cat","css":"heart_eyes_cat","category":"people"},"😼":{"emoji":"😼","platforms":["tw","a","g"],"description":"CAT FACE WITH WRY SMILE","name":"smirk_cat","css":"smirk_cat","category":"people"},"😽":{"emoji":"😽","platforms":["tw","a","g"],"description":"KISSING CAT FACE WITH CLOSED EYES","name":"kissing_cat","css":"kissing_cat","category":"people"},"😾":{"emoji":"😾","platforms":["tw","a","g"],"description":"POUTING CAT FACE","name":"pouting_cat","css":"pouting_cat","category":"people"},"😿":{"emoji":"😿","platforms":["tw","a","g"],"description":"CRYING CAT FACE","name":"crying_cat_face","css":"crying_cat_face","category":"people"},"🙀":{"emoji":"🙀","platforms":["tw","a","g"],"description":"WEARY CAT FACE","name":"scream_cat","css":"scream_cat","category":"people"},"🙅":{"emoji":"🙅","platforms":["tw","a","g"],"description":"FACE WITH NO GOOD GESTURE","name":"no_good","css":"no_good","category":"people"},"🙆":{"emoji":"🙆","platforms":["tw","a","g"],"description":"FACE WITH OK GESTURE","name":"ok_woman","css":"ok_woman","category":"people"},"🙇":{"emoji":"🙇","platforms":["tw","a","g"],"description":"PERSON BOWING DEEPLY","name":"bow","css":"bow","category":"people"},"🙈":{"emoji":"🙈","platforms":["tw","a","g"],"description":"SEE-NO-EVIL MONKEY","name":"see_no_evil","css":"see_no_evil","category":"people"},"🙉":{"emoji":"🙉","platforms":["tw","a","g"],"description":"HEAR-NO-EVIL MONKEY","name":"hear_no_evil","css":"hear_no_evil","category":"people"},"🙊":{"emoji":"🙊","platforms":["tw","a","g"],"description":"SPEAK-NO-EVIL MONKEY","name":"speak_no_evil","css":"speak_no_evil","category":"people"},"🙋":{"emoji":"🙋","platforms":["tw","a","g"],"description":"HAPPY PERSON RAISING ONE HAND","name":"raising_hand","css":"raising_hand","category":"people"},"🙌":{"emoji":"🙌","platforms":["tw","a","g"],"description":"PERSON RAISING BOTH HANDS IN CELEBRATION","name":"raised_hands","css":"raised_hands","category":"people"},"🙍":{"emoji":"🙍","platforms":["tw","a","g"],"description":"PERSON FROWNING","name":"person_frowning","css":"person_frowning","category":"people"},"🙎":{"emoji":"🙎","platforms":["tw","a","g"],"description":"PERSON WITH POUTING FACE","name":"person_with_pouting_face","css":"person_with_pouting_face","category":"people"},"🙏":{"emoji":"🙏","platforms":["tw","a","g"],"description":"PERSON WITH FOLDED HANDS","name":"pray","css":"pray","category":"people"},"🚀":{"emoji":"🚀","platforms":["tw","a","g"],"description":"ROCKET","name":"rocket","css":"rocket","category":"travel"},"🚁":{"emoji":"🚁","platforms":["tw","a","g"],"description":"HELICOPTER","name":"helicopter","css":"helicopter","category":"travel"},"🚂":{"emoji":"🚂","platforms":["tw","a","g"],"description":"STEAM LOCOMOTIVE","name":"steam_locomotive","css":"steam_locomotive","category":"travel"},"🚃":{"emoji":"🚃","platforms":["tw","a","g"],"description":"RAILWAY CAR","name":"railway_car","css":"railway_car","category":"travel"},"🚄":{"emoji":"🚄","platforms":["tw","a","g"],"description":"HIGH-SPEED TRAIN","name":"bullettrain_side","css":"bullettrain_side","category":"travel"},"🚅":{"emoji":"🚅","platforms":["tw","a","g"],"description":"HIGH-SPEED TRAIN WITH BULLET NOSE","name":"bullettrain_front","css":"bullettrain_front","category":"travel"},"🚆":{"emoji":"🚆","platforms":["tw","a","g"],"description":"TRAIN","name":"train2","css":"train2","category":"travel"},"🚇":{"emoji":"🚇","platforms":["tw","a","g"],"description":"METRO","name":"metro","css":"metro","category":"travel"},"🚈":{"emoji":"🚈","platforms":["tw","a","g"],"description":"LIGHT RAIL","name":"light_rail","css":"light_rail","category":"travel"},"🚉":{"emoji":"🚉","platforms":["tw","a","g"],"description":"STATION","name":"station","css":"station","category":"travel"},"🚊":{"emoji":"🚊","platforms":["tw","a","g"],"description":"TRAM","name":"tram","css":"tram","category":"travel"},"🚋":{"emoji":"🚋","platforms":["tw","a","g"],"description":"TRAM CAR","name":"train","css":"train","category":"travel"},"🚌":{"emoji":"🚌","platforms":["tw","a","g"],"description":"BUS","name":"bus","css":"bus","category":"travel"},"🚍":{"emoji":"🚍","platforms":["tw","a","g"],"description":"ONCOMING BUS","name":"oncoming_bus","css":"oncoming_bus","category":"travel"},"🚎":{"emoji":"🚎","platforms":["tw","a","g"],"description":"TROLLEYBUS","name":"trolleybus","css":"trolleybus","category":"travel"},"🚏":{"emoji":"🚏","platforms":["tw","a","g"],"description":"BUS STOP","name":"busstop","css":"busstop","category":"travel"},"🚐":{"emoji":"🚐","platforms":["tw","a","g"],"description":"MINIBUS","name":"minibus","css":"minibus","category":"travel"},"🚑":{"emoji":"🚑","platforms":["tw","a","g"],"description":"AMBULANCE","name":"ambulance","css":"ambulance","category":"travel"},"🚒":{"emoji":"🚒","platforms":["tw","a","g"],"description":"FIRE ENGINE","name":"fire_engine","css":"fire_engine","category":"travel"},"🚓":{"emoji":"🚓","platforms":["tw","a","g"],"description":"POLICE CAR","name":"police_car","css":"police_car","category":"travel"},"🚔":{"emoji":"🚔","platforms":["tw","a","g"],"description":"ONCOMING POLICE CAR","name":"oncoming_police_car","css":"oncoming_police_car","category":"travel"},"🚕":{"emoji":"🚕","platforms":["tw","a","g"],"description":"TAXI","name":"taxi","css":"taxi","category":"travel"},"🚖":{"emoji":"🚖","platforms":["tw","a","g"],"description":"ONCOMING TAXI","name":"oncoming_taxi","css":"oncoming_taxi","category":"travel"},"🚗":{"emoji":"🚗","platforms":["tw","a","g"],"description":"AUTOMOBILE","name":"car","css":"car","category":"travel"},"🚘":{"emoji":"🚘","platforms":["tw","a","g"],"description":"ONCOMING AUTOMOBILE","name":"oncoming_automobile","css":"oncoming_automobile","category":"travel"},"🚙":{"emoji":"🚙","platforms":["tw","a","g"],"description":"RECREATIONAL VEHICLE","name":"blue_car","css":"blue_car","category":"travel"},"🚚":{"emoji":"🚚","platforms":["tw","a","g"],"description":"DELIVERY TRUCK","name":"truck","css":"truck","category":"travel"},"🚛":{"emoji":"🚛","platforms":["tw","a","g"],"description":"ARTICULATED LORRY","name":"articulated_lorry","css":"articulated_lorry","category":"travel"},"🚜":{"emoji":"🚜","platforms":["tw","a","g"],"description":"TRACTOR","name":"tractor","css":"tractor","category":"travel"},"🚝":{"emoji":"🚝","platforms":["tw","a","g"],"description":"MONORAIL","name":"monorail","css":"monorail","category":"travel"},"🚞":{"emoji":"🚞","platforms":["tw","a","g"],"description":"MOUNTAIN RAILWAY","name":"mountain_railway","css":"mountain_railway","category":"travel"},"🚟":{"emoji":"🚟","platforms":["tw","a","g"],"description":"SUSPENSION RAILWAY","name":"suspension_railway","css":"suspension_railway","category":"travel"},"🚠":{"emoji":"🚠","platforms":["tw","a","g"],"description":"MOUNTAIN CABLEWAY","name":"mountain_cableway","css":"mountain_cableway","category":"travel"},"🚡":{"emoji":"🚡","platforms":["tw","a","g"],"description":"AERIAL TRAMWAY","name":"aerial_tramway","css":"aerial_tramway","category":"travel"},"🚢":{"emoji":"🚢","platforms":["tw","a","g"],"description":"SHIP","name":"ship","css":"ship","category":"travel"},"🚣":{"emoji":"🚣","platforms":["tw","a","g"],"description":"ROWBOAT","name":"rowboat","css":"rowboat","category":"travel"},"🚤":{"emoji":"🚤","platforms":["tw","a","g"],"description":"SPEEDBOAT","name":"speedboat","css":"speedboat","category":"travel"},"🚥":{"emoji":"🚥","platforms":["tw","a","g"],"description":"HORIZONTAL TRAFFIC LIGHT","name":"traffic_light","css":"traffic_light","category":"travel"},"🚦":{"emoji":"🚦","platforms":["tw","a","g"],"description":"VERTICAL TRAFFIC LIGHT","name":"vertical_traffic_light","css":"vertical_traffic_light","category":"travel"},"🚧":{"emoji":"🚧","platforms":["tw","a","g"],"description":"CONSTRUCTION SIGN","name":"construction","css":"construction","category":"travel"},"🚨":{"emoji":"🚨","platforms":["tw","a","g"],"description":"POLICE CARS REVOLVING LIGHT","name":"rotating_light","css":"rotating_light","category":"travel"},"🚩":{"emoji":"🚩","platforms":["tw","a","g"],"description":"TRIANGULAR FLAG ON POST","name":"triangular_flag_on_post","css":"triangular_flag_on_post","category":"travel"},"🚪":{"emoji":"🚪","platforms":["tw","a","g"],"description":"DOOR","name":"door","css":"door","category":"travel"},"🚫":{"emoji":"🚫","platforms":["tw","a","g"],"description":"NO ENTRY SIGN","name":"no_entry_sign","css":"no_entry_sign","category":"travel"},"🚬":{"emoji":"🚬","platforms":["tw","a","g"],"description":"SMOKING SYMBOL","name":"smoking","css":"smoking","category":"travel"},"🚭":{"emoji":"🚭","platforms":["tw","a","g"],"description":"NO SMOKING SYMBOL","name":"no_smoking","css":"no_smoking","category":"travel"},"🚮":{"emoji":"🚮","platforms":["tw","a","g"],"description":"PUT LITTER IN ITS PLACE SYMBOL","name":"put_litter_in_its_place","css":"put_litter_in_its_place","category":"travel"},"🚯":{"emoji":"🚯","platforms":["tw","a","g"],"description":"DO NOT LITTER SYMBOL","name":"do_not_litter","css":"do_not_litter","category":"travel"},"🚰":{"emoji":"🚰","platforms":["tw","a","g"],"description":"POTABLE WATER SYMBOL","name":"potable_water","css":"potable_water","category":"travel"},"🚱":{"emoji":"🚱","platforms":["tw","a","g"],"description":"NON-POTABLE WATER SYMBOL","name":"non-potable_water","css":"non-potable_water","category":"travel"},"🚲":{"emoji":"🚲","platforms":["tw","a","g"],"description":"BICYCLE","name":"bike","css":"bike","category":"travel"},"🚳":{"emoji":"🚳","platforms":["tw","a","g"],"description":"NO BICYCLES","name":"no_bicycles","css":"no_bicycles","category":"travel"},"🚴":{"emoji":"🚴","platforms":["tw","a","g"],"description":"BICYCLIST","name":"bicyclist","css":"bicyclist","category":"travel"},"🚵":{"emoji":"🚵","platforms":["tw","a","g"],"description":"MOUNTAIN BICYCLIST","name":"mountain_bicyclist","css":"mountain_bicyclist","category":"travel"},"🚶":{"emoji":"🚶","platforms":["tw","a","g"],"description":"PEDESTRIAN","name":"walking","css":"walking","category":"travel"},"🚷":{"emoji":"🚷","platforms":["tw","a","g"],"description":"NO PEDESTRIANS","name":"no_pedestrians","css":"no_pedestrians","category":"travel"},"🚸":{"emoji":"🚸","platforms":["tw","a","g"],"description":"CHILDREN CROSSING","name":"children_crossing","css":"children_crossing","category":"travel"},"🚹":{"emoji":"🚹","platforms":["tw","a","g"],"description":"MENS SYMBOL","name":"mens","css":"mens","category":"travel"},"🚺":{"emoji":"🚺","platforms":["tw","a","g"],"description":"WOMENS SYMBOL","name":"womens","css":"womens","category":"travel"},"🚻":{"emoji":"🚻","platforms":["tw","a","g"],"description":"RESTROOM","name":"restroom","css":"restroom","category":"travel"},"🚼":{"emoji":"🚼","platforms":["tw","a","g"],"description":"BABY SYMBOL","name":"baby_symbol","css":"baby_symbol","category":"travel"},"🚽":{"emoji":"🚽","platforms":["tw","a","g"],"description":"TOILET","name":"toilet","css":"toilet","category":"travel"},"🚾":{"emoji":"🚾","platforms":["tw","a","g"],"description":"WATER CLOSET","name":"wc","css":"wc","category":"travel"},"🚿":{"emoji":"🚿","platforms":["tw","a","g"],"description":"SHOWER","name":"shower","css":"shower","category":"travel"},"🛀":{"emoji":"🛀","platforms":["tw","a","g"],"description":"BATH","name":"bath","css":"bath","category":"travel"},"🛁":{"emoji":"🛁","platforms":["tw","a","g"],"description":"BATHTUB","name":"bathtub","css":"bathtub","category":"travel"},"🛂":{"emoji":"🛂","platforms":["tw","a","g"],"description":"PASSPORT CONTROL","name":"passport_control","css":"passport_control","category":"travel"},"🛃":{"emoji":"🛃","platforms":["tw","a","g"],"description":"CUSTOMS","name":"customs","css":"customs","category":"travel"},"🛄":{"emoji":"🛄","platforms":["tw","a","g"],"description":"BAGGAGE CLAIM","name":"baggage_claim","css":"baggage_claim","category":"travel"},"🛅":{"emoji":"🛅","platforms":["tw","a","g"],"description":"LEFT LUGGAGE","name":"left_luggage","css":"left_luggage","category":"travel"},"#️⃣":{"emoji":"#️⃣","platforms":["tw","a","g"],"description":"HASH KEY","name":"hash","css":"hash","variations":["#⃣"]},"0️⃣":{"emoji":"0️⃣","platforms":["tw","a","g"],"description":"KEYCAP 0","name":"zero","css":"zero","variations":["0⃣"]},"1️⃣":{"emoji":"1️⃣","platforms":["tw","a","g"],"description":"KEYCAP 1","name":"one","css":"one","variations":["1⃣"]},"2️⃣":{"emoji":"2️⃣","platforms":["tw","a","g"],"description":"KEYCAP 2","name":"two","css":"two","variations":["2⃣"]},"3️⃣":{"emoji":"3️⃣","platforms":["tw","a","g"],"description":"KEYCAP 3","name":"three","css":"three","variations":["3⃣"]},"4️⃣":{"emoji":"4️⃣","platforms":["tw","a","g"],"description":"KEYCAP 4","name":"four","css":"four","variations":["4⃣"]},"5️⃣":{"emoji":"5️⃣","platforms":["tw","a","g"],"description":"KEYCAP 5","name":"five","css":"five","variations":["5⃣"]},"6️⃣":{"emoji":"6️⃣","platforms":["tw","a","g"],"description":"KEYCAP 6","name":"six","css":"six","variations":["6⃣"]},"7️⃣":{"emoji":"7️⃣","platforms":["tw","a","g"],"description":"KEYCAP 7","name":"seven","css":"seven","variations":["7⃣"]},"8️⃣":{"emoji":"8️⃣","platforms":["tw","a","g"],"description":"KEYCAP 8","name":"eight","css":"eight","variations":["8⃣"]},"9️⃣":{"emoji":"9️⃣","platforms":["tw","a","g"],"description":"KEYCAP 9","name":"nine","css":"nine","variations":["9⃣"]},"🇦🇪":{"emoji":"🇦🇪","platforms":["g"],"description":"REGIONAL INDICATOR SYMBOL LETTERS AE","name":"flag-ae","css":"flag-ae","category":"folderol"},"🇦🇹":{"emoji":"🇦🇹","platforms":["g"],"description":"REGIONAL INDICATOR SYMBOL LETTERS AT","name":"flag-at","css":"flag-at","category":"folderol"},"🇦🇺":{"emoji":"🇦🇺","platforms":["g"],"description":"REGIONAL INDICATOR SYMBOL LETTERS AU","name":"flag-au","css":"flag-au","category":"folderol"},"🇧🇪":{"emoji":"🇧🇪","platforms":["g"],"description":"REGIONAL INDICATOR SYMBOL LETTERS BE","name":"flag-be","css":"flag-be","category":"folderol"},"🇧🇷":{"emoji":"🇧🇷","platforms":["g"],"description":"REGIONAL INDICATOR SYMBOL LETTERS BR","name":"flag-br","css":"flag-br","category":"folderol"},"🇨🇦":{"emoji":"🇨🇦","platforms":["a","g"],"description":"REGIONAL INDICATOR SYMBOL LETTERS CA","name":"flag-ca","css":"flag-ca","category":"folderol"},"🇨🇭":{"emoji":"🇨🇭","platforms":["a","g"],"description":"REGIONAL INDICATOR SYMBOL LETTERS CH","name":"flag-ch","css":"flag-ch","category":"folderol"},"🇨🇱":{"emoji":"🇨🇱","platforms":["a","g"],"description":"REGIONAL INDICATOR SYMBOL LETTERS CL","name":"flag-cl","css":"flag-cl","category":"folderol"},"🇨🇳":{"emoji":"🇨🇳","platforms":["tw","a","g"],"description":"REGIONAL INDICATOR SYMBOL LETTERS CN","name":"flag-cn","css":"flag-cn","category":"folderol"},"🇨🇴":{"emoji":"🇨🇴","platforms":["a","g"],"description":"REGIONAL INDICATOR SYMBOL LETTERS CO","name":"flag-co","css":"flag-co","category":"folderol"},"🇩🇪":{"emoji":"🇩🇪","platforms":["tw","a","g"],"description":"REGIONAL INDICATOR SYMBOL LETTERS DE","name":"flag-de","css":"flag-de","category":"folderol"},"🇩🇰":{"emoji":"🇩🇰","platforms":["a","g"],"description":"REGIONAL INDICATOR SYMBOL LETTERS DK","name":"flag-dk","css":"flag-dk","category":"folderol"},"🇪🇸":{"emoji":"🇪🇸","platforms":["tw","a","g"],"description":"REGIONAL INDICATOR SYMBOL LETTERS ES","name":"flag-es","css":"flag-es","category":"folderol"},"🇫🇮":{"emoji":"🇫🇮","platforms":["a","g"],"description":"REGIONAL INDICATOR SYMBOL LETTERS FI","name":"flag-fi","css":"flag-fi","category":"folderol"},"🇫🇷":{"emoji":"🇫🇷","platforms":["tw","a","g"],"description":"REGIONAL INDICATOR SYMBOL LETTERS FR","name":"flag-fr","css":"flag-fr","category":"folderol"},"🇬🇧":{"emoji":"🇬🇧","platforms":["tw","a","g"],"description":"REGIONAL INDICATOR SYMBOL LETTERS GB","name":"flag-gb","css":"flag-gb","category":"folderol"},"🇭🇰":{"emoji":"🇭🇰","platforms":["g"],"description":"REGIONAL INDICATOR SYMBOL LETTERS HK","name":"flag-hk","css":"flag-hk","category":"folderol"},"🇮🇩":{"emoji":"🇮🇩","platforms":["a","g"],"description":"REGIONAL INDICATOR SYMBOL LETTERS ID","name":"flag-id","css":"flag-id","category":"folderol"},"🇮🇪":{"emoji":"🇮🇪","platforms":["a","g"],"description":"REGIONAL INDICATOR SYMBOL LETTERS IE","name":"flag-ie","css":"flag-ie","category":"folderol"},"🇮🇱":{"emoji":"🇮🇱","platforms":["a","g"],"description":"REGIONAL INDICATOR SYMBOL LETTERS IL","name":"flag-il","css":"flag-il","category":"folderol"},"🇮🇳":{"emoji":"🇮🇳","platforms":["a","g"],"description":"REGIONAL INDICATOR SYMBOL LETTERS IN","name":"flag-in","css":"flag-in","category":"folderol"},"🇮🇹":{"emoji":"🇮🇹","platforms":["tw","a","g"],"description":"REGIONAL INDICATOR SYMBOL LETTERS IT","name":"flag-it","css":"flag-it","category":"folderol"},"🇯🇵":{"emoji":"🇯🇵","platforms":["tw","a","g"],"description":"REGIONAL INDICATOR SYMBOL LETTERS JP","name":"flag-jp","css":"flag-jp","category":"folderol"},"🇰🇷":{"emoji":"🇰🇷","platforms":["tw","a","g"],"description":"REGIONAL INDICATOR SYMBOL LETTERS KR","name":"flag-kr","css":"flag-kr","category":"folderol"},"🇲🇴":{"emoji":"🇲🇴","platforms":["g"],"description":"REGIONAL INDICATOR SYMBOL LETTERS MO","name":"flag-mo","css":"flag-mo","category":"folderol"},"🇲🇽":{"emoji":"🇲🇽","platforms":["g"],"description":"REGIONAL INDICATOR SYMBOL LETTERS MX","name":"flag-mx","css":"flag-mx","category":"folderol"},"🇲🇾":{"emoji":"🇲🇾","platforms":["g"],"description":"REGIONAL INDICATOR SYMBOL LETTERS MY","name":"flag-my","css":"flag-my","category":"folderol"},"🇳🇱":{"emoji":"🇳🇱","platforms":["g"],"description":"REGIONAL INDICATOR SYMBOL LETTERS NL","name":"flag-nl","css":"flag-nl","category":"folderol"},"🇳🇴":{"emoji":"🇳🇴","platforms":["g"],"description":"REGIONAL INDICATOR SYMBOL LETTERS NO","name":"flag-no","css":"flag-no","category":"folderol"},"🇳🇿":{"emoji":"🇳🇿","platforms":["g"],"description":"REGIONAL INDICATOR SYMBOL LETTERS NZ","name":"flag-nz","css":"flag-nz","category":"folderol"},"🇵🇭":{"emoji":"🇵🇭","platforms":["g"],"description":"REGIONAL INDICATOR SYMBOL LETTERS PH","name":"flag-ph","css":"flag-ph","category":"folderol"},"🇵🇱":{"emoji":"🇵🇱","platforms":["g"],"description":"REGIONAL INDICATOR SYMBOL LETTERS PL","name":"flag-pl","css":"flag-pl","category":"folderol"},"🇵🇷":{"emoji":"🇵🇷","platforms":["g"],"description":"REGIONAL INDICATOR SYMBOL LETTERS PR","name":"flag-pr","css":"flag-pr","category":"folderol"},"🇵🇹":{"emoji":"🇵🇹","platforms":["g"],"description":"REGIONAL INDICATOR SYMBOL LETTERS PT","name":"flag-pt","css":"flag-pt","category":"folderol"},"🇷🇺":{"emoji":"🇷🇺","platforms":["tw","a","g"],"description":"REGIONAL INDICATOR SYMBOL LETTERS RU","name":"flag-ru","css":"flag-ru","category":"folderol"},"🇸🇦":{"emoji":"🇸🇦","platforms":["g"],"description":"REGIONAL INDICATOR SYMBOL LETTERS SA","name":"flag-sa","css":"flag-sa","category":"folderol"},"🇸🇪":{"emoji":"🇸🇪","platforms":["g"],"description":"REGIONAL INDICATOR SYMBOL LETTERS SE","name":"flag-se","css":"flag-se","category":"folderol"},"🇸🇬":{"emoji":"🇸🇬","platforms":["g"],"description":"REGIONAL INDICATOR SYMBOL LETTERS SG","name":"flag-sg","css":"flag-sg","category":"folderol"},"🇹🇷":{"emoji":"🇹🇷","platforms":["g"],"description":"REGIONAL INDICATOR SYMBOL LETTERS TR","name":"flag-tr","css":"flag-tr","category":"folderol"},"🇺🇸":{"emoji":"🇺🇸","platforms":["tw","a","g"],"description":"REGIONAL INDICATOR SYMBOL LETTERS US","name":"flag-us","css":"flag-us","category":"folderol"},"🇻🇳":{"emoji":"🇻🇳","platforms":["g"],"description":"REGIONAL INDICATOR SYMBOL LETTERS VN","name":"flag-vn","css":"flag-vn","category":"folderol"},"🇿🇦":{"emoji":"🇿🇦","platforms":["g"],"description":"REGIONAL INDICATOR SYMBOL LETTERS ZA","name":"flag-za","css":"flag-za","category":"folderol"},"👨‍👨‍👦":{"emoji":"👨‍👨‍👦","description":"","name":"man-man-boy","css":"man-man-boy","category":"people"},"👨‍👨‍👦‍👦":{"emoji":"👨‍👨‍👦‍👦","description":"","name":"man-man-boy-boy","css":"man-man-boy-boy","category":"people"},"👨‍👨‍👧":{"emoji":"👨‍👨‍👧","description":"","name":"man-man-girl","css":"man-man-girl","category":"people"},"👨‍👨‍👧‍👦":{"emoji":"👨‍👨‍👧‍👦","description":"","name":"man-man-girl-boy","css":"man-man-girl-boy","category":"people"},"👨‍👨‍👧‍👧":{"emoji":"👨‍👨‍👧‍👧","description":"","name":"man-man-girl-girl","css":"man-man-girl-girl","category":"people"},"👨‍👩‍👦":{"emoji":"👨‍👩‍👦","description":"","name":"man-woman-boy","css":"man-woman-boy","category":"people"},"👨‍👩‍👦‍👦":{"emoji":"👨‍👩‍👦‍👦","description":"","name":"man-woman-boy-boy","css":"man-woman-boy-boy","category":"people"},"👨‍👩‍👧":{"emoji":"👨‍👩‍👧","description":"","name":"man-woman-girl","css":"man-woman-girl","category":"people"},"👨‍👩‍👧‍👧":{"emoji":"👨‍👩‍👧‍👧","description":"","name":"man-woman-girl-girl","css":"man-woman-girl-girl","category":"people"},"👨‍❤️‍👨":{"emoji":"👨‍❤️‍👨","description":"","name":"man-heart-man","css":"man-heart-man","category":"people"},"👨‍❤️‍💋‍👨":{"emoji":"👨‍❤️‍💋‍👨","description":"","name":"man-kiss-man","css":"man-kiss-man","category":"people"},"👩‍👩‍👦":{"emoji":"👩‍👩‍👦","description":"","name":"woman-woman-boy","css":"woman-woman-boy","category":"people"},"👩‍👩‍👦‍👦":{"emoji":"👩‍👩‍👦‍👦","description":"","name":"woman-woman-boy-boy","css":"woman-woman-boy-boy","category":"people"},"👩‍👩‍👧":{"emoji":"👩‍👩‍👧","description":"","name":"woman-woman-girl","css":"woman-woman-girl","category":"people"},"👩‍👩‍👧‍👦":{"emoji":"👩‍👩‍👧‍👦","description":"","name":"woman-woman-girl-boy","css":"woman-woman-girl-boy","category":"people"},"👩‍👩‍👧‍👧":{"emoji":"👩‍👩‍👧‍👧","description":"","name":"woman-woman-girl-girl","css":"woman-woman-girl-girl","category":"people"},"👩‍❤️‍👩":{"emoji":"👩‍❤️‍👩","description":"","name":"woman-heart-woman","css":"woman-heart-woman","category":"people"},"👩‍❤️‍💋‍👩":{"emoji":"👩‍❤️‍💋‍👩","description":"","name":"woman-kiss-woman","css":"woman-kiss-woman","category":"people"}}

/***/ }),

/***/ "../proxy.conf.json":
/***/ (function(module, exports) {

module.exports = {"/api/*":{"target":"http://localhost:7233","secure":false,"changeOrigin":true}}

/***/ }),

/***/ "./bundles.angular.json":
/***/ (function(module, exports) {

module.exports = {"meta":{"main":["<meta name=\"twitter:app:BBBBBBBBBBB\" content=\"US\">","<meta name=\"twitter:app:BBBBBBBBBB\" content=\"US\">"],"admin_main":["<meta name=\"twitter:app:country\" content=\"US\">","<meta name=\"twitter:app:country\" content=\"US\">"]},"styles":{"main":{"files":["css/style.css","css/flexslider.css","css/jquery.fancybox.css","css/cloud-zoom.css","css/common.style.css","css/select2.css"]},"admin_main":{"files":["css/reset/reset.css","css/font-awesome/css/font-awesome.min.css","css/admin/bower_components/metisMenu/dist/metisMenu.min.css","css/admin/bower_components/font-awesome/css/font-awesome.min.css","css/admin/bower_components/datatables-plugins/integration/bootstrap/3/dataTables.bootstrap.css","css/admin/bower_components/datatables-responsive/css/dataTables.responsive.css","css/admin/dist/css/sb-admin-2.css","css/rawcss.css","css/select2.css"]}},"scripts":{"main":{"files":{"head":["js/common.js","js/select2.js"],"body":["js/bootstrap.js","js/respond.min.js","js/bootstrap-tooltip.js","js/jquery.flexslider.js","js/jquery.tweet.js","js/cloud-zoom.1.0.2.js","js/jquery.validate.js","js/jquery.carouFredSel-6.1.0-packed.js","js/jquery.mousewheel.min.js","js/jquery.touchSwipe.min.js","js/jquery.ba-throttle-debounce.min.js"]}},"admin_main":{"files":{"head":["js/jquery-3.2.1.min.js","js/bootstrap.js","js/respond.min.js","js/application.js","js/common.js","js/select2.js"],"body":["js/bootstrap.js","js/respond.min.js","js/application.js","js/bootstrap-tooltip.js","js/jquery.fancybox.js","js/jquery.flexslider.js","js/jquery.tweet.js","js/cloud-zoom.1.0.2.js","js/jquery.validate.js","js/jquery.carouFredSel-6.1.0-packed.js","js/jquery.mousewheel.min.js","js/jquery.touchSwipe.min.js","js/jquery.ba-throttle-debounce.min.js"]}}}}

/***/ }),

/***/ "./package.json":
/***/ (function(module, exports) {

module.exports = {"name":"angular","version":"0.0.0","license":"MIT","scripts":{"ng-serve-target":"ng serve --prod --proxy-config proxy.conf.json","start-prod":"npm run build & \"npm run ng-serve-target\"","ng-serve-target-dev":"ng serve --dev --aot --proxy-config proxy.conf.json","start-dev":"npm run \"build-dev\"& \"npm run ng-serve-target-dev\"","start-dev-test":"npm run \"build-dev-test","start":"npm run ng-serve-target-dev","ng":"ng","build":"ng build --prod","test":"ng test","lint":"ng lint","e2e":"ng e2e","build-dev":"ng build --dev","build-dev-test":"ng build --dev --aot --proxy-config proxy.conf.json"},"private":true,"dependencies":{"@angular/animations":"^5.2.0","@angular/common":"^5.2.0","@angular/compiler":"^5.2.0","@angular/core":"^5.2.0","@angular/forms":"^5.2.0","@angular/http":"^5.2.0","@angular/platform-browser":"^5.2.0","@angular/platform-browser-dynamic":"^5.2.0","@angular/router":"^5.2.0","@auth0/angular-jwt":"^2.0.0","bootstrap":"^3.3.7","core-js":"^2.4.1","font-awesome":"^4.7.0","jquery":"^3.2.1","moment":"^2.22.1","rxjs":"^5.5.6","rxjs-compat":"^6.3.2","socket.io":"^2.0.4","socket.io-client":"^2.0.4","zone.js":"^0.8.19"},"devDependencies":{"@angular/cli":"~1.7.4","@angular/compiler-cli":"^5.2.0","@angular/language-service":"^5.2.0","@types/jasmine":"~2.8.3","@types/jasminewd2":"~2.0.2","@types/node":"~6.0.60","codelyzer":"^4.0.1","jasmine-core":"~2.8.0","jasmine-spec-reporter":"~4.2.1","karma":"~2.0.0","karma-chrome-launcher":"~2.2.0","karma-coverage-istanbul-reporter":"^1.2.1","karma-jasmine":"~1.1.0","karma-jasmine-html-reporter":"^0.2.2","protractor":"~5.1.2","ts-node":"~4.1.0","tslint":"~5.9.1","typescript":"~2.5.3"}}

/***/ }),

/***/ "./src/$$_lazy_route_resource lazy recursive":
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "./src/$$_lazy_route_resource lazy recursive";

/***/ }),

/***/ "./src/app/app-routing.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppRoutingModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_contents_errors_page404_page404_component__ = __webpack_require__("./src/app/components/contents/errors/page404/page404.component.ts");


var appRoutes = [
    { path: '', redirectTo: '/', pathMatch: 'full' },
    { path: '**', component: __WEBPACK_IMPORTED_MODULE_0__components_contents_errors_page404_page404_component__["a" /* Page404Component */] }
];
var AppRoutingModule = /** @class */ (function () {
    function AppRoutingModule() {
    }
    return AppRoutingModule;
}());



/***/ }),

/***/ "./src/app/app.component.css.shim.ngstyle.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return styles; });
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes}
 * tslint:disable
 */ 
var styles = [""];



/***/ }),

/***/ "./src/app/app.component.ngfactory.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export RenderType_AppComponent */
/* unused harmony export View_AppComponent_0 */
/* unused harmony export View_AppComponent_Host_0 */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppComponentNgFactory; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__app_component_css_shim_ngstyle__ = __webpack_require__("./src/app/app.component.css.shim.ngstyle.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_layouts_header_header_component_ngfactory__ = __webpack_require__("./src/app/components/layouts/header/header.component.ngfactory.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_layouts_header_header_component__ = __webpack_require__("./src/app/components/layouts/header/header.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_layouts_nav_nav_component_ngfactory__ = __webpack_require__("./src/app/components/layouts/nav/nav.component.ngfactory.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_layouts_nav_nav_component__ = __webpack_require__("./src/app/components/layouts/nav/nav.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__components_layouts_footer_footer_component_ngfactory__ = __webpack_require__("./src/app/components/layouts/footer/footer.component.ngfactory.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__components_layouts_footer_footer_component__ = __webpack_require__("./src/app/components/layouts/footer/footer.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__angular_common__ = __webpack_require__("./node_modules/@angular/common/esm5/common.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__components_contents_contents_component_ngfactory__ = __webpack_require__("./src/app/components/contents/contents.component.ngfactory.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__components_contents_contents_component__ = __webpack_require__("./src/app/components/contents/contents.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__angular_router__ = __webpack_require__("./node_modules/@angular/router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__app_component__ = __webpack_require__("./src/app/app.component.ts");
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes}
 * tslint:disable
 */ 













var styles_AppComponent = [__WEBPACK_IMPORTED_MODULE_0__app_component_css_shim_ngstyle__["a" /* styles */]];
var RenderType_AppComponent = __WEBPACK_IMPORTED_MODULE_1__angular_core__["_11" /* ɵcrt */]({ encapsulation: 0, styles: styles_AppComponent, data: {} });

function View_AppComponent_1(_l) { return __WEBPACK_IMPORTED_MODULE_1__angular_core__["_31" /* ɵvid */](0, [(_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](0, 0, null, null, 1, "app-header", [], null, null, null, __WEBPACK_IMPORTED_MODULE_2__components_layouts_header_header_component_ngfactory__["b" /* View_HeaderComponent_0 */], __WEBPACK_IMPORTED_MODULE_2__components_layouts_header_header_component_ngfactory__["a" /* RenderType_HeaderComponent */])), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_12" /* ɵdid */](1, 114688, null, 0, __WEBPACK_IMPORTED_MODULE_3__components_layouts_header_header_component__["a" /* HeaderComponent */], [], null, null)], function (_ck, _v) { _ck(_v, 1, 0); }, null); }
function View_AppComponent_2(_l) { return __WEBPACK_IMPORTED_MODULE_1__angular_core__["_31" /* ɵvid */](0, [(_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](0, 0, null, null, 1, "app-nav", [], null, null, null, __WEBPACK_IMPORTED_MODULE_4__components_layouts_nav_nav_component_ngfactory__["b" /* View_NavComponent_0 */], __WEBPACK_IMPORTED_MODULE_4__components_layouts_nav_nav_component_ngfactory__["a" /* RenderType_NavComponent */])), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_12" /* ɵdid */](1, 114688, null, 0, __WEBPACK_IMPORTED_MODULE_5__components_layouts_nav_nav_component__["a" /* NavComponent */], [], null, null)], function (_ck, _v) { _ck(_v, 1, 0); }, null); }
function View_AppComponent_3(_l) { return __WEBPACK_IMPORTED_MODULE_1__angular_core__["_31" /* ɵvid */](0, [(_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](0, 0, null, null, 4, "footer", [["class", "s-footer js-footer"], ["id", "footer"], ["role", "contentinfo"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n  "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](2, 0, null, null, 1, "app-footer", [], null, null, null, __WEBPACK_IMPORTED_MODULE_6__components_layouts_footer_footer_component_ngfactory__["b" /* View_FooterComponent_0 */], __WEBPACK_IMPORTED_MODULE_6__components_layouts_footer_footer_component_ngfactory__["a" /* RenderType_FooterComponent */])), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_12" /* ɵdid */](3, 114688, null, 0, __WEBPACK_IMPORTED_MODULE_7__components_layouts_footer_footer_component__["a" /* FooterComponent */], [], null, null), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n"]))], function (_ck, _v) { _ck(_v, 3, 0); }, null); }
function View_AppComponent_0(_l) { return __WEBPACK_IMPORTED_MODULE_1__angular_core__["_31" /* ɵvid */](0, [(_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](0, 0, null, null, 0, "div", [["id", "notify-container"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](2, 0, null, null, 0, "div", [["id", "custom-header"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n\n"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_8" /* ɵand */](16777216, null, null, 1, null, View_AppComponent_1)), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_12" /* ɵdid */](5, 16384, null, 0, __WEBPACK_IMPORTED_MODULE_8__angular_common__["i" /* NgIf */], [__WEBPACK_IMPORTED_MODULE_1__angular_core__["X" /* ViewContainerRef */], __WEBPACK_IMPORTED_MODULE_1__angular_core__["U" /* TemplateRef */]], { ngIf: [0, "ngIf"] }, null), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n\n"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](7, 0, null, null, 31, "div", [["class", "container _full"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n  "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](9, 0, null, null, 28, "div", [["class", "snippet-hidden"], ["id", "content"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](11, 0, null, null, 25, "div", [["class", "inner-content"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n      "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_8" /* ɵand */](16777216, null, null, 1, null, View_AppComponent_2)), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_12" /* ɵdid */](14, 16384, null, 0, __WEBPACK_IMPORTED_MODULE_8__angular_common__["i" /* NgIf */], [__WEBPACK_IMPORTED_MODULE_1__angular_core__["X" /* ViewContainerRef */], __WEBPACK_IMPORTED_MODULE_1__angular_core__["U" /* TemplateRef */]], { ngIf: [0, "ngIf"] }, null), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n      "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](16, 0, null, null, 1, "app-contents", [], null, [[null, "LoginChanged"]], function (_v, en, $event) { var ad = true; var _co = _v.component; if (("LoginChanged" === en)) {
        var pd_0 = (_co.LoginChangedHandler($event) !== false);
        ad = (pd_0 && ad);
    } return ad; }, __WEBPACK_IMPORTED_MODULE_9__components_contents_contents_component_ngfactory__["b" /* View_ContentsComponent_0 */], __WEBPACK_IMPORTED_MODULE_9__components_contents_contents_component_ngfactory__["a" /* RenderType_ContentsComponent */])), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_12" /* ɵdid */](17, 114688, null, 0, __WEBPACK_IMPORTED_MODULE_10__components_contents_contents_component__["a" /* ContentsComponent */], [], null, { LoginChanged: "LoginChanged" }), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n\n      "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n      "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n      "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n\n      "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n      "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n      "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n      "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n      "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n      "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n      "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n      "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n      "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n      "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n      "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n      "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n      "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n      "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n      "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n\n    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n  "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_8" /* ɵand */](16777216, null, null, 1, null, View_AppComponent_3)), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_12" /* ɵdid */](41, 16384, null, 0, __WEBPACK_IMPORTED_MODULE_8__angular_common__["i" /* NgIf */], [__WEBPACK_IMPORTED_MODULE_1__angular_core__["X" /* ViewContainerRef */], __WEBPACK_IMPORTED_MODULE_1__angular_core__["U" /* TemplateRef */]], { ngIf: [0, "ngIf"] }, null), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](43, 16777216, null, null, 1, "router-outlet", [], null, null, null, null, null)), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_12" /* ɵdid */](44, 212992, null, 0, __WEBPACK_IMPORTED_MODULE_11__angular_router__["m" /* RouterOutlet */], [__WEBPACK_IMPORTED_MODULE_11__angular_router__["b" /* ChildrenOutletContexts */], __WEBPACK_IMPORTED_MODULE_1__angular_core__["X" /* ViewContainerRef */], __WEBPACK_IMPORTED_MODULE_1__angular_core__["k" /* ComponentFactoryResolver */], [8, null], __WEBPACK_IMPORTED_MODULE_1__angular_core__["i" /* ChangeDetectorRef */]], null, null)], function (_ck, _v) { var _co = _v.component; var currVal_0 = !_co.isPageLogin; _ck(_v, 5, 0, currVal_0); var currVal_1 = !_co.isPageLogin; _ck(_v, 14, 0, currVal_1); _ck(_v, 17, 0); var currVal_2 = !_co.isPageLogin; _ck(_v, 41, 0, currVal_2); _ck(_v, 44, 0); }, null); }
function View_AppComponent_Host_0(_l) { return __WEBPACK_IMPORTED_MODULE_1__angular_core__["_31" /* ɵvid */](0, [(_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](0, 0, null, null, 1, "app-root", [], null, null, null, View_AppComponent_0, RenderType_AppComponent)), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_12" /* ɵdid */](1, 114688, null, 0, __WEBPACK_IMPORTED_MODULE_12__app_component__["a" /* AppComponent */], [__WEBPACK_IMPORTED_MODULE_11__angular_router__["k" /* Router */]], null, null)], function (_ck, _v) { _ck(_v, 1, 0); }, null); }
var AppComponentNgFactory = __WEBPACK_IMPORTED_MODULE_1__angular_core__["_9" /* ɵccf */]("app-root", __WEBPACK_IMPORTED_MODULE_12__app_component__["a" /* AppComponent */], View_AppComponent_Host_0, {}, {}, []);



/***/ }),

/***/ "./src/app/app.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_router__ = __webpack_require__("./node_modules/@angular/router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_libSupports__ = __webpack_require__("./src/app/common/libSupports.ts");
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


var AppComponent = /** @class */ (function (_super) {
    __extends(AppComponent, _super);
    function AppComponent(route) {
        var _this = _super.call(this) || this;
        _this.route = route;
        _this.title = 'app';
        _this.isPageLogin = false;
        _this.arrPageLogin = ['forgot', 'login', 'register'];
        return _this;
        // this.intiLoadCss();
        // this.intiLoadScript();
    }
    AppComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.intiLoadCss();
        this.intiLoadScript();
        this.url = this.urlSide();
        // console.log(this.router.url); // array of states
        // console.log('11111 ' + this.isPageLogin + '333' + this.currentURL);
        // this.isPageLogin = this.currentURL == 'http://localhost:1234/login' ? true : false;
        // console.log(this.getRoutes());
        // console.log(this.activatedRoute.toString());
        // console.log(this.route.events);
        this.route.events.subscribe(function (val) {
            if (val instanceof __WEBPACK_IMPORTED_MODULE_0__angular_router__["o" /* RoutesRecognized */]) {
                var pathRouter = val.state.root.firstChild.routeConfig.path;
                _this.isPageLogin = (pathRouter) && _this.arrPageLogin.includes(pathRouter) ? true : false;
                // console.log(val.state.root.firstChild.routeConfig.path);
            }
        });
    };
    ;
    AppComponent.prototype.LoginChangedHandler = function (isPageLoginChild) {
        // this.isPageLogin  = isPageLoginChild;
    };
    return AppComponent;
}(__WEBPACK_IMPORTED_MODULE_1__common_libSupports__["a" /* libSupports */]));



/***/ }),

/***/ "./src/app/app.module.ngfactory.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModuleNgFactory; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_module__ = __webpack_require__("./src/app/app.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_component__ = __webpack_require__("./src/app/app.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_contents_register_register_component_ngfactory__ = __webpack_require__("./src/app/components/contents/register/register.component.ngfactory.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_contents_login_login_component_ngfactory__ = __webpack_require__("./src/app/components/contents/login/login.component.ngfactory.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_contents_logout_logout_component_ngfactory__ = __webpack_require__("./src/app/components/contents/logout/logout.component.ngfactory.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__components_contents_forgot_forgot_component_ngfactory__ = __webpack_require__("./src/app/components/contents/forgot/forgot.component.ngfactory.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__components_contents_chat_chat_component_ngfactory__ = __webpack_require__("./src/app/components/contents/chat/chat.component.ngfactory.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__components_contents_home_home_component_ngfactory__ = __webpack_require__("./src/app/components/contents/home/home.component.ngfactory.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__components_contents_errors_page_error_page_error_component_ngfactory__ = __webpack_require__("./src/app/components/contents/errors/page-error/page-error.component.ngfactory.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__components_contents_errors_page404_page404_component_ngfactory__ = __webpack_require__("./src/app/components/contents/errors/page404/page404.component.ngfactory.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__app_component_ngfactory__ = __webpack_require__("./src/app/app.component.ngfactory.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__angular_common__ = __webpack_require__("./node_modules/@angular/common/esm5/common.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__angular_platform_browser__ = __webpack_require__("./node_modules/@angular/platform-browser/esm5/platform-browser.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__angular_common_http__ = __webpack_require__("./node_modules/@angular/common/esm5/http.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__common_CustomsHttpClient__ = __webpack_require__("./src/app/common/CustomsHttpClient.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__components_services_api_chat_service__ = __webpack_require__("./src/app/components/services/api-chat.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__services_auth_auth_service__ = __webpack_require__("./src/app/services/auth/auth.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__services_auth_auth_guard_service__ = __webpack_require__("./src/app/services/auth/auth-guard.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__angular_router__ = __webpack_require__("./node_modules/@angular/router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__services_auth_can_deactivate_guard_service__ = __webpack_require__("./src/app/services/auth/can-deactivate-guard.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__services_auth_role_login_guard_service__ = __webpack_require__("./src/app/services/auth/role-login-guard.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__components_services_api_user_service__ = __webpack_require__("./src/app/components/services/api-user.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__components_contents_register_register_component__ = __webpack_require__("./src/app/components/contents/register/register.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__components_contents_contents_routing_modules__ = __webpack_require__("./src/app/components/contents/contents-routing.modules.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25__components_contents_login_login_component__ = __webpack_require__("./src/app/components/contents/login/login.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_26__components_contents_logout_logout_component__ = __webpack_require__("./src/app/components/contents/logout/logout.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_27__components_contents_forgot_forgot_component__ = __webpack_require__("./src/app/components/contents/forgot/forgot.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_28__components_contents_chat_chat_component__ = __webpack_require__("./src/app/components/contents/chat/chat.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_29__components_contents_home_home_component__ = __webpack_require__("./src/app/components/contents/home/home.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_30__components_contents_errors_page_error_page_error_component__ = __webpack_require__("./src/app/components/contents/errors/page-error/page-error.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_31__components_contents_errors_page404_page404_component__ = __webpack_require__("./src/app/components/contents/errors/page404/page404.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_32__app_routing_module__ = __webpack_require__("./src/app/app-routing.module.ts");
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes}
 * tslint:disable
 */ 

































var AppModuleNgFactory = __WEBPACK_IMPORTED_MODULE_0__angular_core__["_10" /* ɵcmf */](__WEBPACK_IMPORTED_MODULE_1__app_module__["a" /* AppModule */], [__WEBPACK_IMPORTED_MODULE_2__app_component__["a" /* AppComponent */]], function (_l) { return __WEBPACK_IMPORTED_MODULE_0__angular_core__["_20" /* ɵmod */]([__WEBPACK_IMPORTED_MODULE_0__angular_core__["_21" /* ɵmpd */](512, __WEBPACK_IMPORTED_MODULE_0__angular_core__["k" /* ComponentFactoryResolver */], __WEBPACK_IMPORTED_MODULE_0__angular_core__["_6" /* ɵCodegenComponentFactoryResolver */], [[8, [__WEBPACK_IMPORTED_MODULE_3__components_contents_register_register_component_ngfactory__["a" /* RegisterComponentNgFactory */], __WEBPACK_IMPORTED_MODULE_4__components_contents_login_login_component_ngfactory__["a" /* LoginComponentNgFactory */], __WEBPACK_IMPORTED_MODULE_5__components_contents_logout_logout_component_ngfactory__["a" /* LogoutComponentNgFactory */], __WEBPACK_IMPORTED_MODULE_6__components_contents_forgot_forgot_component_ngfactory__["a" /* ForgotComponentNgFactory */], __WEBPACK_IMPORTED_MODULE_7__components_contents_chat_chat_component_ngfactory__["a" /* ChatComponentNgFactory */], __WEBPACK_IMPORTED_MODULE_8__components_contents_home_home_component_ngfactory__["a" /* HomeComponentNgFactory */], __WEBPACK_IMPORTED_MODULE_9__components_contents_errors_page_error_page_error_component_ngfactory__["a" /* PageErrorComponentNgFactory */], __WEBPACK_IMPORTED_MODULE_10__components_contents_errors_page404_page404_component_ngfactory__["a" /* Page404ComponentNgFactory */], __WEBPACK_IMPORTED_MODULE_11__app_component_ngfactory__["a" /* AppComponentNgFactory */]]], [3, __WEBPACK_IMPORTED_MODULE_0__angular_core__["k" /* ComponentFactoryResolver */]], __WEBPACK_IMPORTED_MODULE_0__angular_core__["E" /* NgModuleRef */]]), __WEBPACK_IMPORTED_MODULE_0__angular_core__["_21" /* ɵmpd */](5120, __WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* LOCALE_ID */], __WEBPACK_IMPORTED_MODULE_0__angular_core__["_27" /* ɵq */], [[3, __WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* LOCALE_ID */]]]), __WEBPACK_IMPORTED_MODULE_0__angular_core__["_21" /* ɵmpd */](4608, __WEBPACK_IMPORTED_MODULE_12__angular_common__["k" /* NgLocalization */], __WEBPACK_IMPORTED_MODULE_12__angular_common__["j" /* NgLocaleLocalization */], [__WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* LOCALE_ID */], [2, __WEBPACK_IMPORTED_MODULE_12__angular_common__["o" /* ɵa */]]]), __WEBPACK_IMPORTED_MODULE_0__angular_core__["_21" /* ɵmpd */](5120, __WEBPACK_IMPORTED_MODULE_0__angular_core__["c" /* APP_ID */], __WEBPACK_IMPORTED_MODULE_0__angular_core__["_15" /* ɵi */], []), __WEBPACK_IMPORTED_MODULE_0__angular_core__["_21" /* ɵmpd */](5120, __WEBPACK_IMPORTED_MODULE_0__angular_core__["y" /* IterableDiffers */], __WEBPACK_IMPORTED_MODULE_0__angular_core__["_22" /* ɵn */], []), __WEBPACK_IMPORTED_MODULE_0__angular_core__["_21" /* ɵmpd */](5120, __WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* KeyValueDiffers */], __WEBPACK_IMPORTED_MODULE_0__angular_core__["_24" /* ɵo */], []), __WEBPACK_IMPORTED_MODULE_0__angular_core__["_21" /* ɵmpd */](4608, __WEBPACK_IMPORTED_MODULE_13__angular_platform_browser__["b" /* DomSanitizer */], __WEBPACK_IMPORTED_MODULE_13__angular_platform_browser__["q" /* ɵe */], [__WEBPACK_IMPORTED_MODULE_12__angular_common__["c" /* DOCUMENT */]]), __WEBPACK_IMPORTED_MODULE_0__angular_core__["_21" /* ɵmpd */](6144, __WEBPACK_IMPORTED_MODULE_0__angular_core__["P" /* Sanitizer */], null, [__WEBPACK_IMPORTED_MODULE_13__angular_platform_browser__["b" /* DomSanitizer */]]), __WEBPACK_IMPORTED_MODULE_0__angular_core__["_21" /* ɵmpd */](4608, __WEBPACK_IMPORTED_MODULE_13__angular_platform_browser__["e" /* HAMMER_GESTURE_CONFIG */], __WEBPACK_IMPORTED_MODULE_13__angular_platform_browser__["f" /* HammerGestureConfig */], []), __WEBPACK_IMPORTED_MODULE_0__angular_core__["_21" /* ɵmpd */](5120, __WEBPACK_IMPORTED_MODULE_13__angular_platform_browser__["c" /* EVENT_MANAGER_PLUGINS */], function (p0_0, p0_1, p1_0, p2_0, p2_1) { return [new __WEBPACK_IMPORTED_MODULE_13__angular_platform_browser__["j" /* ɵDomEventsPlugin */](p0_0, p0_1), new __WEBPACK_IMPORTED_MODULE_13__angular_platform_browser__["n" /* ɵKeyEventsPlugin */](p1_0), new __WEBPACK_IMPORTED_MODULE_13__angular_platform_browser__["m" /* ɵHammerGesturesPlugin */](p2_0, p2_1)]; }, [__WEBPACK_IMPORTED_MODULE_12__angular_common__["c" /* DOCUMENT */], __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* NgZone */], __WEBPACK_IMPORTED_MODULE_12__angular_common__["c" /* DOCUMENT */], __WEBPACK_IMPORTED_MODULE_12__angular_common__["c" /* DOCUMENT */], __WEBPACK_IMPORTED_MODULE_13__angular_platform_browser__["e" /* HAMMER_GESTURE_CONFIG */]]), __WEBPACK_IMPORTED_MODULE_0__angular_core__["_21" /* ɵmpd */](4608, __WEBPACK_IMPORTED_MODULE_13__angular_platform_browser__["d" /* EventManager */], __WEBPACK_IMPORTED_MODULE_13__angular_platform_browser__["d" /* EventManager */], [__WEBPACK_IMPORTED_MODULE_13__angular_platform_browser__["c" /* EVENT_MANAGER_PLUGINS */], __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* NgZone */]]), __WEBPACK_IMPORTED_MODULE_0__angular_core__["_21" /* ɵmpd */](135680, __WEBPACK_IMPORTED_MODULE_13__angular_platform_browser__["l" /* ɵDomSharedStylesHost */], __WEBPACK_IMPORTED_MODULE_13__angular_platform_browser__["l" /* ɵDomSharedStylesHost */], [__WEBPACK_IMPORTED_MODULE_12__angular_common__["c" /* DOCUMENT */]]), __WEBPACK_IMPORTED_MODULE_0__angular_core__["_21" /* ɵmpd */](4608, __WEBPACK_IMPORTED_MODULE_13__angular_platform_browser__["k" /* ɵDomRendererFactory2 */], __WEBPACK_IMPORTED_MODULE_13__angular_platform_browser__["k" /* ɵDomRendererFactory2 */], [__WEBPACK_IMPORTED_MODULE_13__angular_platform_browser__["d" /* EventManager */], __WEBPACK_IMPORTED_MODULE_13__angular_platform_browser__["l" /* ɵDomSharedStylesHost */]]), __WEBPACK_IMPORTED_MODULE_0__angular_core__["_21" /* ɵmpd */](6144, __WEBPACK_IMPORTED_MODULE_0__angular_core__["N" /* RendererFactory2 */], null, [__WEBPACK_IMPORTED_MODULE_13__angular_platform_browser__["k" /* ɵDomRendererFactory2 */]]), __WEBPACK_IMPORTED_MODULE_0__angular_core__["_21" /* ɵmpd */](6144, __WEBPACK_IMPORTED_MODULE_13__angular_platform_browser__["o" /* ɵSharedStylesHost */], null, [__WEBPACK_IMPORTED_MODULE_13__angular_platform_browser__["l" /* ɵDomSharedStylesHost */]]), __WEBPACK_IMPORTED_MODULE_0__angular_core__["_21" /* ɵmpd */](4608, __WEBPACK_IMPORTED_MODULE_0__angular_core__["V" /* Testability */], __WEBPACK_IMPORTED_MODULE_0__angular_core__["V" /* Testability */], [__WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* NgZone */]]), __WEBPACK_IMPORTED_MODULE_0__angular_core__["_21" /* ɵmpd */](4608, __WEBPACK_IMPORTED_MODULE_13__angular_platform_browser__["g" /* Meta */], __WEBPACK_IMPORTED_MODULE_13__angular_platform_browser__["g" /* Meta */], [__WEBPACK_IMPORTED_MODULE_12__angular_common__["c" /* DOCUMENT */]]), __WEBPACK_IMPORTED_MODULE_0__angular_core__["_21" /* ɵmpd */](4608, __WEBPACK_IMPORTED_MODULE_13__angular_platform_browser__["h" /* Title */], __WEBPACK_IMPORTED_MODULE_13__angular_platform_browser__["h" /* Title */], [__WEBPACK_IMPORTED_MODULE_12__angular_common__["c" /* DOCUMENT */]]), __WEBPACK_IMPORTED_MODULE_0__angular_core__["_21" /* ɵmpd */](4608, __WEBPACK_IMPORTED_MODULE_14__angular_common_http__["i" /* HttpXsrfTokenExtractor */], __WEBPACK_IMPORTED_MODULE_14__angular_common_http__["o" /* ɵh */], [__WEBPACK_IMPORTED_MODULE_12__angular_common__["c" /* DOCUMENT */], __WEBPACK_IMPORTED_MODULE_0__angular_core__["J" /* PLATFORM_ID */], __WEBPACK_IMPORTED_MODULE_14__angular_common_http__["m" /* ɵf */]]), __WEBPACK_IMPORTED_MODULE_0__angular_core__["_21" /* ɵmpd */](4608, __WEBPACK_IMPORTED_MODULE_14__angular_common_http__["p" /* ɵi */], __WEBPACK_IMPORTED_MODULE_14__angular_common_http__["p" /* ɵi */], [__WEBPACK_IMPORTED_MODULE_14__angular_common_http__["i" /* HttpXsrfTokenExtractor */], __WEBPACK_IMPORTED_MODULE_14__angular_common_http__["n" /* ɵg */]]), __WEBPACK_IMPORTED_MODULE_0__angular_core__["_21" /* ɵmpd */](5120, __WEBPACK_IMPORTED_MODULE_14__angular_common_http__["a" /* HTTP_INTERCEPTORS */], function (p0_0) { return [p0_0]; }, [__WEBPACK_IMPORTED_MODULE_14__angular_common_http__["p" /* ɵi */]]), __WEBPACK_IMPORTED_MODULE_0__angular_core__["_21" /* ɵmpd */](4608, __WEBPACK_IMPORTED_MODULE_14__angular_common_http__["l" /* ɵe */], __WEBPACK_IMPORTED_MODULE_14__angular_common_http__["l" /* ɵe */], []), __WEBPACK_IMPORTED_MODULE_0__angular_core__["_21" /* ɵmpd */](6144, __WEBPACK_IMPORTED_MODULE_14__angular_common_http__["j" /* XhrFactory */], null, [__WEBPACK_IMPORTED_MODULE_14__angular_common_http__["l" /* ɵe */]]), __WEBPACK_IMPORTED_MODULE_0__angular_core__["_21" /* ɵmpd */](4608, __WEBPACK_IMPORTED_MODULE_14__angular_common_http__["h" /* HttpXhrBackend */], __WEBPACK_IMPORTED_MODULE_14__angular_common_http__["h" /* HttpXhrBackend */], [__WEBPACK_IMPORTED_MODULE_14__angular_common_http__["j" /* XhrFactory */]]), __WEBPACK_IMPORTED_MODULE_0__angular_core__["_21" /* ɵmpd */](6144, __WEBPACK_IMPORTED_MODULE_14__angular_common_http__["b" /* HttpBackend */], null, [__WEBPACK_IMPORTED_MODULE_14__angular_common_http__["h" /* HttpXhrBackend */]]), __WEBPACK_IMPORTED_MODULE_0__angular_core__["_21" /* ɵmpd */](4608, __WEBPACK_IMPORTED_MODULE_14__angular_common_http__["f" /* HttpHandler */], __WEBPACK_IMPORTED_MODULE_14__angular_common_http__["k" /* ɵc */], [__WEBPACK_IMPORTED_MODULE_14__angular_common_http__["b" /* HttpBackend */], __WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* Injector */]]), __WEBPACK_IMPORTED_MODULE_0__angular_core__["_21" /* ɵmpd */](4608, __WEBPACK_IMPORTED_MODULE_14__angular_common_http__["c" /* HttpClient */], __WEBPACK_IMPORTED_MODULE_14__angular_common_http__["c" /* HttpClient */], [__WEBPACK_IMPORTED_MODULE_14__angular_common_http__["f" /* HttpHandler */]]), __WEBPACK_IMPORTED_MODULE_0__angular_core__["_21" /* ɵmpd */](4608, __WEBPACK_IMPORTED_MODULE_15__common_CustomsHttpClient__["a" /* CustomsHttpClient */], __WEBPACK_IMPORTED_MODULE_15__common_CustomsHttpClient__["a" /* CustomsHttpClient */], [__WEBPACK_IMPORTED_MODULE_14__angular_common_http__["c" /* HttpClient */]]), __WEBPACK_IMPORTED_MODULE_0__angular_core__["_21" /* ɵmpd */](4608, __WEBPACK_IMPORTED_MODULE_16__components_services_api_chat_service__["a" /* ApiServiceChat */], __WEBPACK_IMPORTED_MODULE_16__components_services_api_chat_service__["a" /* ApiServiceChat */], [__WEBPACK_IMPORTED_MODULE_14__angular_common_http__["c" /* HttpClient */], __WEBPACK_IMPORTED_MODULE_15__common_CustomsHttpClient__["a" /* CustomsHttpClient */]]), __WEBPACK_IMPORTED_MODULE_0__angular_core__["_21" /* ɵmpd */](4608, __WEBPACK_IMPORTED_MODULE_17__services_auth_auth_service__["a" /* AuthService */], __WEBPACK_IMPORTED_MODULE_17__services_auth_auth_service__["a" /* AuthService */], []), __WEBPACK_IMPORTED_MODULE_0__angular_core__["_21" /* ɵmpd */](4608, __WEBPACK_IMPORTED_MODULE_18__services_auth_auth_guard_service__["a" /* AuthGuard */], __WEBPACK_IMPORTED_MODULE_18__services_auth_auth_guard_service__["a" /* AuthGuard */], [__WEBPACK_IMPORTED_MODULE_17__services_auth_auth_service__["a" /* AuthService */], __WEBPACK_IMPORTED_MODULE_19__angular_router__["k" /* Router */]]), __WEBPACK_IMPORTED_MODULE_0__angular_core__["_21" /* ɵmpd */](4608, __WEBPACK_IMPORTED_MODULE_20__services_auth_can_deactivate_guard_service__["a" /* CanDeactivateGuard */], __WEBPACK_IMPORTED_MODULE_20__services_auth_can_deactivate_guard_service__["a" /* CanDeactivateGuard */], []), __WEBPACK_IMPORTED_MODULE_0__angular_core__["_21" /* ɵmpd */](4608, __WEBPACK_IMPORTED_MODULE_21__services_auth_role_login_guard_service__["a" /* RoleLoginGuardService */], __WEBPACK_IMPORTED_MODULE_21__services_auth_role_login_guard_service__["a" /* RoleLoginGuardService */], [__WEBPACK_IMPORTED_MODULE_17__services_auth_auth_service__["a" /* AuthService */], __WEBPACK_IMPORTED_MODULE_19__angular_router__["k" /* Router */]]), __WEBPACK_IMPORTED_MODULE_0__angular_core__["_21" /* ɵmpd */](4608, __WEBPACK_IMPORTED_MODULE_22__components_services_api_user_service__["a" /* ApiServiceUser */], __WEBPACK_IMPORTED_MODULE_22__components_services_api_user_service__["a" /* ApiServiceUser */], [__WEBPACK_IMPORTED_MODULE_14__angular_common_http__["c" /* HttpClient */], __WEBPACK_IMPORTED_MODULE_15__common_CustomsHttpClient__["a" /* CustomsHttpClient */]]), __WEBPACK_IMPORTED_MODULE_0__angular_core__["_21" /* ɵmpd */](5120, __WEBPACK_IMPORTED_MODULE_19__angular_router__["a" /* ActivatedRoute */], __WEBPACK_IMPORTED_MODULE_19__angular_router__["w" /* ɵf */], [__WEBPACK_IMPORTED_MODULE_19__angular_router__["k" /* Router */]]), __WEBPACK_IMPORTED_MODULE_0__angular_core__["_21" /* ɵmpd */](4608, __WEBPACK_IMPORTED_MODULE_19__angular_router__["d" /* NoPreloading */], __WEBPACK_IMPORTED_MODULE_19__angular_router__["d" /* NoPreloading */], []), __WEBPACK_IMPORTED_MODULE_0__angular_core__["_21" /* ɵmpd */](6144, __WEBPACK_IMPORTED_MODULE_19__angular_router__["f" /* PreloadingStrategy */], null, [__WEBPACK_IMPORTED_MODULE_19__angular_router__["d" /* NoPreloading */]]), __WEBPACK_IMPORTED_MODULE_0__angular_core__["_21" /* ɵmpd */](135680, __WEBPACK_IMPORTED_MODULE_19__angular_router__["n" /* RouterPreloader */], __WEBPACK_IMPORTED_MODULE_19__angular_router__["n" /* RouterPreloader */], [__WEBPACK_IMPORTED_MODULE_19__angular_router__["k" /* Router */], __WEBPACK_IMPORTED_MODULE_0__angular_core__["D" /* NgModuleFactoryLoader */], __WEBPACK_IMPORTED_MODULE_0__angular_core__["j" /* Compiler */], __WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* Injector */], __WEBPACK_IMPORTED_MODULE_19__angular_router__["f" /* PreloadingStrategy */]]), __WEBPACK_IMPORTED_MODULE_0__angular_core__["_21" /* ɵmpd */](4608, __WEBPACK_IMPORTED_MODULE_19__angular_router__["e" /* PreloadAllModules */], __WEBPACK_IMPORTED_MODULE_19__angular_router__["e" /* PreloadAllModules */], []), __WEBPACK_IMPORTED_MODULE_0__angular_core__["_21" /* ɵmpd */](5120, __WEBPACK_IMPORTED_MODULE_19__angular_router__["h" /* ROUTER_INITIALIZER */], __WEBPACK_IMPORTED_MODULE_19__angular_router__["z" /* ɵi */], [__WEBPACK_IMPORTED_MODULE_19__angular_router__["x" /* ɵg */]]), __WEBPACK_IMPORTED_MODULE_0__angular_core__["_21" /* ɵmpd */](5120, __WEBPACK_IMPORTED_MODULE_0__angular_core__["b" /* APP_BOOTSTRAP_LISTENER */], function (p0_0) { return [p0_0]; }, [__WEBPACK_IMPORTED_MODULE_19__angular_router__["h" /* ROUTER_INITIALIZER */]]), __WEBPACK_IMPORTED_MODULE_0__angular_core__["_21" /* ɵmpd */](512, __WEBPACK_IMPORTED_MODULE_12__angular_common__["b" /* CommonModule */], __WEBPACK_IMPORTED_MODULE_12__angular_common__["b" /* CommonModule */], []), __WEBPACK_IMPORTED_MODULE_0__angular_core__["_21" /* ɵmpd */](1024, __WEBPACK_IMPORTED_MODULE_0__angular_core__["o" /* ErrorHandler */], __WEBPACK_IMPORTED_MODULE_13__angular_platform_browser__["p" /* ɵa */], []), __WEBPACK_IMPORTED_MODULE_0__angular_core__["_21" /* ɵmpd */](1024, __WEBPACK_IMPORTED_MODULE_0__angular_core__["F" /* NgProbeToken */], function () { return [__WEBPACK_IMPORTED_MODULE_19__angular_router__["s" /* ɵb */]()]; }, []), __WEBPACK_IMPORTED_MODULE_0__angular_core__["_21" /* ɵmpd */](512, __WEBPACK_IMPORTED_MODULE_19__angular_router__["x" /* ɵg */], __WEBPACK_IMPORTED_MODULE_19__angular_router__["x" /* ɵg */], [__WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* Injector */]]), __WEBPACK_IMPORTED_MODULE_0__angular_core__["_21" /* ɵmpd */](1024, __WEBPACK_IMPORTED_MODULE_0__angular_core__["d" /* APP_INITIALIZER */], function (p0_0, p1_0) { return [__WEBPACK_IMPORTED_MODULE_13__angular_platform_browser__["s" /* ɵh */](p0_0), __WEBPACK_IMPORTED_MODULE_19__angular_router__["y" /* ɵh */](p1_0)]; }, [[2, __WEBPACK_IMPORTED_MODULE_0__angular_core__["F" /* NgProbeToken */]], __WEBPACK_IMPORTED_MODULE_19__angular_router__["x" /* ɵg */]]), __WEBPACK_IMPORTED_MODULE_0__angular_core__["_21" /* ɵmpd */](512, __WEBPACK_IMPORTED_MODULE_0__angular_core__["e" /* ApplicationInitStatus */], __WEBPACK_IMPORTED_MODULE_0__angular_core__["e" /* ApplicationInitStatus */], [[2, __WEBPACK_IMPORTED_MODULE_0__angular_core__["d" /* APP_INITIALIZER */]]]), __WEBPACK_IMPORTED_MODULE_0__angular_core__["_21" /* ɵmpd */](131584, __WEBPACK_IMPORTED_MODULE_0__angular_core__["g" /* ApplicationRef */], __WEBPACK_IMPORTED_MODULE_0__angular_core__["g" /* ApplicationRef */], [__WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* NgZone */], __WEBPACK_IMPORTED_MODULE_0__angular_core__["_7" /* ɵConsole */], __WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* Injector */], __WEBPACK_IMPORTED_MODULE_0__angular_core__["o" /* ErrorHandler */], __WEBPACK_IMPORTED_MODULE_0__angular_core__["k" /* ComponentFactoryResolver */], __WEBPACK_IMPORTED_MODULE_0__angular_core__["e" /* ApplicationInitStatus */]]), __WEBPACK_IMPORTED_MODULE_0__angular_core__["_21" /* ɵmpd */](512, __WEBPACK_IMPORTED_MODULE_0__angular_core__["f" /* ApplicationModule */], __WEBPACK_IMPORTED_MODULE_0__angular_core__["f" /* ApplicationModule */], [__WEBPACK_IMPORTED_MODULE_0__angular_core__["g" /* ApplicationRef */]]), __WEBPACK_IMPORTED_MODULE_0__angular_core__["_21" /* ɵmpd */](512, __WEBPACK_IMPORTED_MODULE_13__angular_platform_browser__["a" /* BrowserModule */], __WEBPACK_IMPORTED_MODULE_13__angular_platform_browser__["a" /* BrowserModule */], [[3, __WEBPACK_IMPORTED_MODULE_13__angular_platform_browser__["a" /* BrowserModule */]]]), __WEBPACK_IMPORTED_MODULE_0__angular_core__["_21" /* ɵmpd */](512, __WEBPACK_IMPORTED_MODULE_14__angular_common_http__["e" /* HttpClientXsrfModule */], __WEBPACK_IMPORTED_MODULE_14__angular_common_http__["e" /* HttpClientXsrfModule */], []), __WEBPACK_IMPORTED_MODULE_0__angular_core__["_21" /* ɵmpd */](512, __WEBPACK_IMPORTED_MODULE_14__angular_common_http__["d" /* HttpClientModule */], __WEBPACK_IMPORTED_MODULE_14__angular_common_http__["d" /* HttpClientModule */], []), __WEBPACK_IMPORTED_MODULE_0__angular_core__["_21" /* ɵmpd */](1024, __WEBPACK_IMPORTED_MODULE_19__angular_router__["r" /* ɵa */], __WEBPACK_IMPORTED_MODULE_19__angular_router__["u" /* ɵd */], [[3, __WEBPACK_IMPORTED_MODULE_19__angular_router__["k" /* Router */]]]), __WEBPACK_IMPORTED_MODULE_0__angular_core__["_21" /* ɵmpd */](512, __WEBPACK_IMPORTED_MODULE_19__angular_router__["q" /* UrlSerializer */], __WEBPACK_IMPORTED_MODULE_19__angular_router__["c" /* DefaultUrlSerializer */], []), __WEBPACK_IMPORTED_MODULE_0__angular_core__["_21" /* ɵmpd */](512, __WEBPACK_IMPORTED_MODULE_19__angular_router__["b" /* ChildrenOutletContexts */], __WEBPACK_IMPORTED_MODULE_19__angular_router__["b" /* ChildrenOutletContexts */], []), __WEBPACK_IMPORTED_MODULE_0__angular_core__["_21" /* ɵmpd */](256, __WEBPACK_IMPORTED_MODULE_19__angular_router__["g" /* ROUTER_CONFIGURATION */], { useHash: false }, []), __WEBPACK_IMPORTED_MODULE_0__angular_core__["_21" /* ɵmpd */](1024, __WEBPACK_IMPORTED_MODULE_12__angular_common__["g" /* LocationStrategy */], __WEBPACK_IMPORTED_MODULE_19__angular_router__["t" /* ɵc */], [__WEBPACK_IMPORTED_MODULE_12__angular_common__["m" /* PlatformLocation */], [2, __WEBPACK_IMPORTED_MODULE_12__angular_common__["a" /* APP_BASE_HREF */]], __WEBPACK_IMPORTED_MODULE_19__angular_router__["g" /* ROUTER_CONFIGURATION */]]), __WEBPACK_IMPORTED_MODULE_0__angular_core__["_21" /* ɵmpd */](512, __WEBPACK_IMPORTED_MODULE_12__angular_common__["f" /* Location */], __WEBPACK_IMPORTED_MODULE_12__angular_common__["f" /* Location */], [__WEBPACK_IMPORTED_MODULE_12__angular_common__["g" /* LocationStrategy */]]), __WEBPACK_IMPORTED_MODULE_0__angular_core__["_21" /* ɵmpd */](512, __WEBPACK_IMPORTED_MODULE_0__angular_core__["j" /* Compiler */], __WEBPACK_IMPORTED_MODULE_0__angular_core__["j" /* Compiler */], []), __WEBPACK_IMPORTED_MODULE_0__angular_core__["_21" /* ɵmpd */](512, __WEBPACK_IMPORTED_MODULE_0__angular_core__["D" /* NgModuleFactoryLoader */], __WEBPACK_IMPORTED_MODULE_0__angular_core__["S" /* SystemJsNgModuleLoader */], [__WEBPACK_IMPORTED_MODULE_0__angular_core__["j" /* Compiler */], [2, __WEBPACK_IMPORTED_MODULE_0__angular_core__["T" /* SystemJsNgModuleLoaderConfig */]]]), __WEBPACK_IMPORTED_MODULE_0__angular_core__["_21" /* ɵmpd */](1024, __WEBPACK_IMPORTED_MODULE_19__angular_router__["i" /* ROUTES */], function () { return [[{ path: "register", component: __WEBPACK_IMPORTED_MODULE_23__components_contents_register_register_component__["a" /* RegisterComponent */], canActivate: [__WEBPACK_IMPORTED_MODULE_21__services_auth_role_login_guard_service__["a" /* RoleLoginGuardService */]], data: __WEBPACK_IMPORTED_MODULE_24__components_contents_contents_routing_modules__["b" /* ɵ0 */], pathMatch: "full" }, { path: "login", component: __WEBPACK_IMPORTED_MODULE_25__components_contents_login_login_component__["a" /* LoginComponent */], canActivate: [__WEBPACK_IMPORTED_MODULE_21__services_auth_role_login_guard_service__["a" /* RoleLoginGuardService */]], data: __WEBPACK_IMPORTED_MODULE_24__components_contents_contents_routing_modules__["c" /* ɵ1 */], pathMatch: "full" }, { path: "logout", component: __WEBPACK_IMPORTED_MODULE_26__components_contents_logout_logout_component__["a" /* LogoutComponent */], data: __WEBPACK_IMPORTED_MODULE_24__components_contents_contents_routing_modules__["d" /* ɵ2 */], pathMatch: "full" }, { path: "forgot", component: __WEBPACK_IMPORTED_MODULE_27__components_contents_forgot_forgot_component__["a" /* ForgotComponent */], canLoad: [__WEBPACK_IMPORTED_MODULE_18__services_auth_auth_guard_service__["a" /* AuthGuard */]], data: __WEBPACK_IMPORTED_MODULE_24__components_contents_contents_routing_modules__["e" /* ɵ3 */], pathMatch: "full" }, { path: "chat", component: __WEBPACK_IMPORTED_MODULE_28__components_contents_chat_chat_component__["a" /* ChatComponent */], canActivate: [__WEBPACK_IMPORTED_MODULE_18__services_auth_auth_guard_service__["a" /* AuthGuard */]], data: __WEBPACK_IMPORTED_MODULE_24__components_contents_contents_routing_modules__["f" /* ɵ4 */], pathMatch: "full" }, { path: "home", component: __WEBPACK_IMPORTED_MODULE_29__components_contents_home_home_component__["a" /* HomeComponent */], pathMatch: "full" }, { path: "", redirectTo: "/home", pathMatch: "full" }, { path: "error/:status", component: __WEBPACK_IMPORTED_MODULE_30__components_contents_errors_page_error_page_error_component__["a" /* PageErrorComponent */] }, { path: "**", component: __WEBPACK_IMPORTED_MODULE_31__components_contents_errors_page404_page404_component__["a" /* Page404Component */] }], [{ path: "", redirectTo: "/", pathMatch: "full" }, { path: "**", component: __WEBPACK_IMPORTED_MODULE_31__components_contents_errors_page404_page404_component__["a" /* Page404Component */] }]]; }, []), __WEBPACK_IMPORTED_MODULE_0__angular_core__["_21" /* ɵmpd */](1024, __WEBPACK_IMPORTED_MODULE_19__angular_router__["k" /* Router */], __WEBPACK_IMPORTED_MODULE_19__angular_router__["v" /* ɵe */], [__WEBPACK_IMPORTED_MODULE_0__angular_core__["g" /* ApplicationRef */], __WEBPACK_IMPORTED_MODULE_19__angular_router__["q" /* UrlSerializer */], __WEBPACK_IMPORTED_MODULE_19__angular_router__["b" /* ChildrenOutletContexts */], __WEBPACK_IMPORTED_MODULE_12__angular_common__["f" /* Location */], __WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* Injector */], __WEBPACK_IMPORTED_MODULE_0__angular_core__["D" /* NgModuleFactoryLoader */], __WEBPACK_IMPORTED_MODULE_0__angular_core__["j" /* Compiler */], __WEBPACK_IMPORTED_MODULE_19__angular_router__["i" /* ROUTES */], __WEBPACK_IMPORTED_MODULE_19__angular_router__["g" /* ROUTER_CONFIGURATION */], [2, __WEBPACK_IMPORTED_MODULE_19__angular_router__["p" /* UrlHandlingStrategy */]], [2, __WEBPACK_IMPORTED_MODULE_19__angular_router__["j" /* RouteReuseStrategy */]]]), __WEBPACK_IMPORTED_MODULE_0__angular_core__["_21" /* ɵmpd */](512, __WEBPACK_IMPORTED_MODULE_19__angular_router__["l" /* RouterModule */], __WEBPACK_IMPORTED_MODULE_19__angular_router__["l" /* RouterModule */], [[2, __WEBPACK_IMPORTED_MODULE_19__angular_router__["r" /* ɵa */]], [2, __WEBPACK_IMPORTED_MODULE_19__angular_router__["k" /* Router */]]]), __WEBPACK_IMPORTED_MODULE_0__angular_core__["_21" /* ɵmpd */](512, __WEBPACK_IMPORTED_MODULE_24__components_contents_contents_routing_modules__["a" /* ContentsRoutingModule */], __WEBPACK_IMPORTED_MODULE_24__components_contents_contents_routing_modules__["a" /* ContentsRoutingModule */], []), __WEBPACK_IMPORTED_MODULE_0__angular_core__["_21" /* ɵmpd */](512, __WEBPACK_IMPORTED_MODULE_32__app_routing_module__["a" /* AppRoutingModule */], __WEBPACK_IMPORTED_MODULE_32__app_routing_module__["a" /* AppRoutingModule */], []), __WEBPACK_IMPORTED_MODULE_0__angular_core__["_21" /* ɵmpd */](512, __WEBPACK_IMPORTED_MODULE_1__app_module__["a" /* AppModule */], __WEBPACK_IMPORTED_MODULE_1__app_module__["a" /* AppModule */], []), __WEBPACK_IMPORTED_MODULE_0__angular_core__["_21" /* ɵmpd */](256, __WEBPACK_IMPORTED_MODULE_14__angular_common_http__["m" /* ɵf */], "XSRF-TOKEN", []), __WEBPACK_IMPORTED_MODULE_0__angular_core__["_21" /* ɵmpd */](256, __WEBPACK_IMPORTED_MODULE_14__angular_common_http__["n" /* ɵg */], "X-XSRF-TOKEN", [])]); });



/***/ }),

/***/ "./src/app/app.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    return AppModule;
}());



/***/ }),

/***/ "./src/app/common/CustomsHttpClient.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CustomsHttpClient; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_common_http__ = __webpack_require__("./node_modules/@angular/common/esm5/http.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_add_observable_throw__ = __webpack_require__("./node_modules/rxjs/_esm5/add/observable/throw.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_catch__ = __webpack_require__("./node_modules/rxjs/_esm5/add/operator/catch.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs__ = __webpack_require__("./node_modules/rxjs/Rx.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs__);





var CustomsHttpClient = /** @class */ (function () {
    function CustomsHttpClient(httpClient) {
        this.httpClient = httpClient;
        this.headers = new __WEBPACK_IMPORTED_MODULE_0__angular_common_http__["g" /* HttpHeaders */]()
            .set("Content-type", "application/x-www-form-urlencoded")
            .set("Access-Control-Allow-Credentials", "true")
            .set("Authorization", ('Bearer ' + localStorage.getItem('idToken')))
            .set("credentials", 'same-origin');
        //https://developer.mozilla.org/en-US/docs/Web/API/Request/credentials
        //CHANGE SESSION IN SERVER NODEIJ  "credentials": 'include' | 'same-origin' | 'omit',
    }
    CustomsHttpClient.prototype.setHeader = function () {
        return this.headers;
    };
    // Implement a method to handle errors if any
    CustomsHttpClient.prototype.handleError = function (err) {
        return __WEBPACK_IMPORTED_MODULE_3_rxjs__["Observable"].throw(err);
    };
    return CustomsHttpClient;
}());



/***/ }),

/***/ "./src/app/common/chat/sokets/SendChatMessage.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SendChatMessage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__supports_ListContacts__ = __webpack_require__("./src/app/common/chat/supports/ListContacts.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__supports_LibCommonChat__ = __webpack_require__("./src/app/common/chat/supports/LibCommonChat.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__libSupports__ = __webpack_require__("./src/app/common/libSupports.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__supports_ShowContentChat__ = __webpack_require__("./src/app/common/chat/supports/ShowContentChat.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__supports_ShowProfileParticipantChat__ = __webpack_require__("./src/app/common/chat/supports/ShowProfileParticipantChat.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__supports_MenuInfoChat__ = __webpack_require__("./src/app/common/chat/supports/MenuInfoChat.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__supports_EmojiHtmlChat__ = __webpack_require__("./src/app/common/chat/supports/EmojiHtmlChat.ts");

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();







var SendChatMessage = /** @class */ (function (_super) {
    __extends(SendChatMessage, _super);
    function SendChatMessage() {
        var _this = _super.call(this) || this;
        _this.listContactYourSingleAction = [];
        _this.listContactYourSingle = [];
        _this.dataConversationProfile = {};
        _this.runInitChatMessage = function (opt, socket) {
            this.clickContactContentChat(socket);
            this.getDefaultHeightMsgBox();
            this.eventClickNotifyBoxMsg();
            this.clickRightContactContentChat();
            this.clickContactAdd();
            this.clickContactSub();
            this.clickContactSearchSingle();
            this.clickSearchContact(opt.remainTimeDefault);
            this.getListContact();
            this.clickShowParticipantProfile();
            this.clickSearchContacts(opt.remainTimeSearch);
            this.clickAddContact(socket, opt.remainTimeSearch);
            this.clickResultAddContact(socket);
            this.commonGlobalDefault(opt);
            this.eventChangeStatusUser(socket);
            //add available list contacts
            window.listContacts = opt.listContacts;
            window.widthEmoji = 300;
            window.heightEmoji = 200;
        };
        _this.commonGlobalDefault = function (opt) {
            var resetListContactDefault = {
                url: opt.urlAction.urlListContact,
                data: {
                    dataType: false,
                    isAuthenticatesSingle: false,
                    isSearch: false,
                    valSearch: null,
                    _method: 'POST'
                },
                reset: true
            };
            window.requestListContactDefault = resetListContactDefault;
        };
        _this.runInitMenuInfoChat = function (socket) {
            var menuInfoChat = new __WEBPACK_IMPORTED_MODULE_5__supports_MenuInfoChat__["a" /* MenuInfoChat */]();
            menuInfoChat.contextListener();
            menuInfoChat.clickListener(this, socket);
            menuInfoChat.keyupListener();
            menuInfoChat.resizeListener();
            this.clickShowEmoji();
        };
        _this.getDefaultHeightMsgBox = function () {
            var heightDefault = this.diffHeightBoxMsg();
            var realHeightRaw = $("#messageInput").outerHeight(true);
            var minHeightBoxChat = $('#style-box-sms').attr('min-height');
            $(".scrollbar").attr({ 'realHeightRaw': realHeightRaw, 'realHeightChange': realHeightRaw });
            $("#boxChat").attr({ 'height_default': heightDefault });
            $("#boxChat").attr({ 'auto_height_box_msg': heightDefault });
            $("#boxChat").css({ 'min-height': minHeightBoxChat + 'px' });
            var libcCommonChat = new __WEBPACK_IMPORTED_MODULE_1__supports_LibCommonChat__["a" /* LibCommonChat */]();
            var minHeightFrameListMsg = libcCommonChat.getMinHeightFrameListMsg();
            $('#frameListMsg').css({
                'min-height': minHeightFrameListMsg,
                'height': minHeightFrameListMsg
            });
            // left - bottom notification newMsgChat
            $('#newMsgChat').css({
                "bottom": parseInt(heightDefault) + 4 + 'px',
                "left": ($('#content-chat').width() / 2 - $('#newMsgChat').width() / 2) + 'px'
            });
        };
        _this.diffHeightMsg = function () {
            var minHeightBoxChat = $('#style-box-sms').attr('min-height');
            $('#boxChat').css('height', minHeightBoxChat, '!important');
            $('#boxChat').css('min-height', minHeightBoxChat);
            var libcCommonChat = new __WEBPACK_IMPORTED_MODULE_1__supports_LibCommonChat__["a" /* LibCommonChat */]();
            var minHeightFrameListMsg = libcCommonChat.getMinHeightFrameListMsg();
            $('#frameListMsg').css({ 'min-height': minHeightFrameListMsg });
            $('#frameListMsg').attr('box-change-msg', $('#frameListMsg').attr('box-raw-msg'));
            $('.scrollbar').attr('realheightchange', $('.scrollbar').attr('realHeightRaw'));
            $('#boxChat').val('');
            return false;
        };
        _this.diffHeightBoxMsg = function () {
            return $("#messageInput").outerHeight();
        };
        _this.sendMsg = function (socket, isDataFriend) {
            var self = this;
            self.delayKeyUp(function () {
                self.eventDisplayEmoji();
                var dataValueMsg = $.trim($('#boxChat').val());
                if (dataValueMsg.length) {
                    var listContact = new __WEBPACK_IMPORTED_MODULE_0__supports_ListContacts__["a" /* ListContacts */]();
                    var emojiHtmlChat = new __WEBPACK_IMPORTED_MODULE_6__supports_EmojiHtmlChat__["a" /* EmojiHtmlChat */]();
                    var messageInput = $('#messageInput');
                    var listPart = listContact.getListParticipant();
                    if (isDataFriend === true) {
                        var dataSendChat = {
                            dataConversation: messageInput.attr('data-conversation'),
                            dataChannel: messageInput.attr('data-channel'),
                            dataType: messageInput.attr('data-type'),
                            dataValueMsg: emojiHtmlChat.convertEmojiToText(emojiHtmlChat.convertEmoji(dataValueMsg)),
                            listCodePart: listPart.join(',')
                        };
                        socket.emit('sendDataMsg', dataSendChat);
                        self.diffHeightMsg();
                    }
                }
            }, 300);
        };
        _this.eventClickSend = function (socket, isDataFriend) {
            var that = this;
            $('body').on('click', '#sendMessageChat', function () {
                that.sendMsg(socket, isDataFriend);
            });
        };
        _this.eventEnterSend = function (socket, isDataFriend) {
            var that = this;
            // create trigger keyUpDown after check enter vs (shift + enter) in textarea
            $('body').on('keyUpDown', '#boxChat', function (e) {
                that.eventDisplayEmoji();
                var libCommonChat = new __WEBPACK_IMPORTED_MODULE_1__supports_LibCommonChat__["a" /* LibCommonChat */]();
                var emojiHtmlChat = new __WEBPACK_IMPORTED_MODULE_6__supports_EmojiHtmlChat__["a" /* EmojiHtmlChat */]();
                $('#boxChat').val(emojiHtmlChat.convertEmoji(libCommonChat.convertHtmlToPlainText($('#boxChat').val())));
                e.stopPropagation();
            });
            $('body').on('keypress', '#boxChat', function (evt) {
                if (evt.shiftKey && evt.keyCode == 13) {
                    $('#boxChat').on('keyup keydown cut paste', function (evt) {
                        $(this).trigger('keyUpDown');
                    });
                }
                else if (evt.keyCode == 13) {
                    that.sendMsg(socket, isDataFriend);
                    return false;
                }
                $(this).trigger('keyUpDown');
            });
        };
        _this.eventClickNotifyBoxMsg = function () {
            var that = this;
            $('body').on('click', '#notifyNewsSms', function () {
                that.scrollEndShowBoxChat(1000);
                $('#newMsgChat').delay(2000).css("display", "none");
            });
        };
        _this.eventChangeStatusUser = function (socket) {
            var that = this;
            $('body').on('click', '#status-options .channel-status', function () {
                var elem = this;
                var dataValue = $(elem).attr('data-value');
                var status = $(elem).attr('status');
                // let checkStatus = $('#status-options .channel-status').hasClass('active') ? 1: 0;
                var checkStatus = $('#status-options .channel-status').filter(function (index, elem) {
                    if ($(elem).hasClass('active')) {
                        return $(elem).attr('status');
                    }
                });
                if (checkStatus.length) {
                    if ($(checkStatus).attr('status') != status) {
                        if (typeof dataValue !== typeof undefined && dataValue !== false) {
                            var dataRequest = {
                                data: {
                                    status: dataValue,
                                    _method: 'POST'
                                }
                            };
                            socket.emit('updateUser', dataRequest);
                            socket.on('resUpdateUserPrivate', function (resData) {
                                if (resData.status) {
                                    $('#status-options .channel-status').removeClass("active");
                                    $(elem).addClass("active");
                                    $("#profile-img").removeClass(resData.data.listStatus).addClass(resData.data.classCurrentStatus);
                                    $("#user-status-current").removeClass(resData.data.listStatus + " status-hover").addClass(resData.data.classCurrentStatus);
                                }
                            });
                        }
                        $("#status-options").removeClass("active");
                    }
                }
            });
        };
        _this.scrollEndShowBoxChat = function (timeAnimal) {
            var timeAnimate = typeof timeAnimal !== 'undefined' ? parseInt(timeAnimal) : 1000;
            $("#frameListMsg").animate({ scrollTop: $("#frameListMsg")[0].scrollHeight }, timeAnimate);
        };
        _this.clickSearchContact = function (remainTime) {
            var that = this;
            var listContact = new __WEBPACK_IMPORTED_MODULE_0__supports_ListContacts__["a" /* ListContacts */]();
            $('body').on('keyup copy cut', '#search-contact', function () {
                var val = $.trim($(this).val());
                //remain time or value search length min 3 for reset list contact
                window.remainTime = that.getDateTimeNow() + remainTime;
                listContact.subscribeAfterClickListContact();
                var requestListContact = jQuery.extend(true, {}, window.requestListContactDefault);
                if (val.length > 2) {
                    requestListContact['data']['isSearch'] = true;
                    requestListContact['data']['valSearch'] = val;
                    requestListContact['reset'] = false;
                }
                listContact.searchListContactListAll(requestListContact);
            });
        };
        _this.clickRightContactContentChat = function () {
            var that = this;
            $('body').on("mousedown", "#group-participant .show-info-participants", function (ev) {
                if (ev.which == 1 || ev.which == 3) {
                    $('.show-info-participants').removeClass('check-participant');
                    $(this).addClass('check-participant');
                }
            });
        };
        _this.clickContactContentChat = function (socket) {
            var that = this;
            var click = 0, delay = 500, timer = null;
            $('body')
                .on('click', '.show-info-participants', function (e) {
                var self = this;
                e.preventDefault();
                click++;
                if (click === 1) {
                    timer = setTimeout(function () {
                        var dataAuthor = $(self).find('span[data-author]').attr('data-author');
                        var showProfileParticipantChat = new __WEBPACK_IMPORTED_MODULE_4__supports_ShowProfileParticipantChat__["a" /* ShowProfileParticipantChat */]();
                        showProfileParticipantChat.renderHtmlProfileParticipants(that.convertDataGroupToSingleParticipant(that.dataConversationProfile, dataAuthor), function () {
                            $('#myModalParticipant').modal({
                                show: 'false'
                            });
                            click = 0;
                        });
                    }, delay);
                }
                else {
                    clearTimeout(timer);
                    click = 0;
                    that.clickTaskContactChat($(this), socket);
                }
            })
                .on('dblclick', '.show-info-participants', function (e) {
                e.stopPropagation();
                e.preventDefault();
            });
        };
        _this.clickActContactConversation = function (socket, isSingle) {
            var that = this;
            $('body').on('click', '#action-friend .add, #action-friend .create', function () {
                var listContact = new __WEBPACK_IMPORTED_MODULE_0__supports_ListContacts__["a" /* ListContacts */]();
                var dataConversation = $('#messageInput').attr("data-conversation");
                var dataConversationId = (typeof dataConversation !== typeof undefined && dataConversation !== false) ? dataConversation : null;
                var listParticipant = listContact.clickActionContact();
                var nameListParticipant = listParticipant['nameAuthorId'];
                var nameUesrCurrent = $('#profile .user-name-chat')[0].childNodes[0].nodeValue;
                nameListParticipant.unshift(that.ucfirst(nameUesrCurrent));
                var reqActionConversation = {
                    conversationId: (isSingle ? null : dataConversationId),
                    userParticipant: (isSingle ? listContact.getListParticipant() : null),
                    listAuthorId: listParticipant['authorId'],
                    isSingle: isSingle,
                    act: (isSingle ? 'add' : 'update'),
                    title: (isSingle ? nameListParticipant.join(', ') : null)
                };
                socket.emit('updateActionConversationGroup', reqActionConversation);
                $('#list-your-friend').css({ display: "none" });
            });
        };
        _this.getListContact = function () {
            var that = this;
            $('body').on('click', '#list-contact-your', function () {
                window.remainTime = 1;
                var requestListContact = {
                    url: $('#box-search-contacts').attr('data-url'),
                    data: {
                        dataType: $('#messageInput').attr('data-type'),
                        isAuthenticatesSingle: true,
                        _method: 'POST'
                    }
                };
                var elem = this;
                var lisContact = new __WEBPACK_IMPORTED_MODULE_0__supports_ListContacts__["a" /* ListContacts */]();
                lisContact.callDataJS(requestListContact, function (dataResult) {
                    if (dataResult.err === '') {
                        var top_1 = $('#list-contact-your').height() * 2;
                        $('#list-your-friend').css({ display: 'block', position: 'absolute', top: top_1, right: 23 });
                        $(elem).attr({ show: true });
                        that.listContactYourSingleAction = [];
                        that.listContactYourSingle = dataResult.data;
                        $('#list-your-friend').html(lisContact.render(dataResult, that.listContactYourSingleAction));
                    }
                });
            });
        };
        _this.clickContactAdd = function () {
            var that = this;
            $('body').on('click', '#data-contact li.contact-list', function () {
                var author = $(this).find('[data-author]').attr('data-author');
                if (typeof author !== typeof undefined && author !== false) {
                    var authorId_1 = author.split('.')[1];
                    var indexFindUser = that.listContactYourSingle.findIndex(function (x) { return x.user_id === parseInt(authorId_1); });
                    if (indexFindUser !== -1) {
                        that.listContactYourSingleAction.push(that.listContactYourSingle[indexFindUser]);
                        that.listContactYourSingle.splice(indexFindUser, 1);
                    }
                    that.renderHtmlListContact();
                }
            });
        };
        _this.clickContactSearchSingle = function () {
            var that = this;
            $('body')
                .on('keyup copy cut', '#search-single', function () {
                var val = $.trim($(this).val());
                var htmlListContact = '';
                var listContact = new __WEBPACK_IMPORTED_MODULE_0__supports_ListContacts__["a" /* ListContacts */]();
                if (val.length > 2) {
                    var listContactYourSingleClone = $.extend(true, [], that.listContactYourSingle);
                    var arrayTempListContactSingle = listContact.searchLikeContact(listContactYourSingleClone, val);
                    htmlListContact = arrayTempListContactSingle.length ? listContact.supportListContact(arrayTempListContactSingle) : 'Not result';
                }
                else {
                    htmlListContact = listContact.supportListContact(that.listContactYourSingle);
                }
                $('#list-contacts').html(htmlListContact);
            })
                .on('focusout', '#search-single', function () {
                var val = $(this).val();
                if (val === '' || $.trim(val) < 3) {
                    that.renderHtmlListContact();
                }
            });
        };
        _this.clickContactSub = function () {
            var that = this;
            $('body').on('click', '#box-action-friend i.act-aptach', function () {
                var author = $(this).closest('[data-author]').attr('data-author');
                if (typeof author !== typeof undefined && author !== false) {
                    var authorId_2 = author.split('.')[1];
                    var indexFindUser = that.listContactYourSingleAction.findIndex(function (x) { return x.user_id === parseInt(authorId_2); });
                    if (indexFindUser !== -1) {
                        that.listContactYourSingle.push(that.listContactYourSingleAction[indexFindUser]);
                        that.listContactYourSingle.sort(function (a, b) {
                            return a.created_at - b.created_at;
                        });
                        that.listContactYourSingleAction.splice(indexFindUser, 1);
                    }
                    that.renderHtmlListContact();
                }
            });
        };
        _this.renderHtmlListContact = function () {
            var listContact = new __WEBPACK_IMPORTED_MODULE_0__supports_ListContacts__["a" /* ListContacts */]();
            var htmlListContactAction = listContact.supportResultContact(this.listContactYourSingleAction);
            $('#box-action-friend').html(htmlListContactAction);
            $('#action-friend .add, #action-friend .create').attr({ disabled: !this.listContactYourSingleAction.length });
            var checkInputSearch = $.trim($('#search-single').val());
            var htmlListContact = '';
            if (checkInputSearch.length > 2) {
                var listContactYourSingleClone = $.extend(true, [], this.listContactYourSingle);
                var arrayTempListContactSingle = listContact.searchLikeContact(listContactYourSingleClone, checkInputSearch);
                htmlListContact = arrayTempListContactSingle.length ? listContact.supportListContact(arrayTempListContactSingle) : 'Not result';
            }
            else {
                htmlListContact = listContact.supportListContact(this.listContactYourSingle);
            }
            $('#list-contacts').html(htmlListContact);
        };
        _this.clickTaskContactChat = function (ele, socket) {
            if (ele.length) {
                var userName = ele.find('span.status-info-part').attr("data-username");
                var dataChannelID = ele.find('span.status-info-part').attr("data-channel");
                var valAuthor = ele.find('span.status-info-part').attr("data-author");
                var dataConversation = ele.find('span.status-info-part').attr("data-conversation");
                var dataRequest = {
                    url: $('#contacts').attr('data-url'),
                    userName: userName,
                    dataChannelID: dataChannelID,
                    valAuthor: valAuthor,
                    dataConversation: dataConversation,
                };
                var self_1 = this;
                self_1.activeListContact(null);
                self_1.reloadContentBoxChatAjax(dataRequest, socket, function (resultCallback) {
                    // callback(resultCallback);
                });
            }
        };
        _this.clickListContactContentChat = function (socket, callback) {
            var that = this;
            $('body').on('click', '#contacts li.contact', function () {
                var userName = $(this).find('.meta p.name').attr('data-conversation-name');
                var dataChannelID = $(this).find('.wrap').attr("data-channel");
                var dataOwnerID = $(this).find('.wrap').attr("data-owner");
                var dataConversation = $(this).find('.wrap').attr("data-conversation");
                var valAuthor = $(this).find('.wrap').attr("data-author");
                var dataRequest = {
                    url: $('#contacts').attr('data-url'),
                    userName: userName,
                    dataChannelID: dataChannelID,
                    dataOwnerID: dataOwnerID,
                    dataConversation: dataConversation,
                    valAuthor: valAuthor
                };
                var elem = this;
                that.reloadContentBoxChatAjax(dataRequest, socket, function (resultCallback) {
                    that.activeListContact(elem);
                    // callback(resultCallback);
                    that.readyChatParticipant(socket, resultCallback, function () { return callback(resultCallback); });
                });
            });
        };
        _this.readyChatParticipant = function (socket, resultReadyChat, callback) {
            if (callback === void 0) { callback = false; }
            jQuery.extend(window.dataGlobal.urlAction, resultReadyChat.dataResult.urlAction);
            if (resultReadyChat.isDataFriend === true) {
                var isDataFriend = true;
                this.eventClickSend(socket, isDataFriend);
                this.eventEnterSend(socket, isDataFriend);
                this.runInitMenuInfoChat(socket);
                this.renderShowEmoji();
            }
            if (resultReadyChat.isSingle !== null) {
                var isSingle = true;
                this.clickActContactConversation(socket, isSingle);
            }
            this.scrollListener(socket);
            this.scrollContentChat();
            if (typeof callback === "function")
                callback(resultReadyChat);
        };
        _this.reloadContentBoxChatAjax = function (request, socket, callback) {
            var self = this;
            var dataRequest = {
                url: request.hasOwnProperty('url') && request.url ? request.url : '',
                data: {
                    userName: request.hasOwnProperty('userName') && request.userName ? request.userName : 'undefined user',
                    dataChannelID: request.hasOwnProperty('dataChannelID') && request.dataChannelID ? request.dataChannelID : null,
                    dataOwnerID: request.hasOwnProperty('dataOwnerID') && request.dataOwnerID ? request.dataOwnerID : null,
                    dataConversation: request.hasOwnProperty('dataConversation') && request.dataConversation ? request.dataConversation : null,
                    valAuthor: request.hasOwnProperty('valAuthor') && request.valAuthor ? request.valAuthor : null,
                    _method: 'POST'
                }
            };
            this.callDataJS(dataRequest, function (dataResult) {
                self.renderHtmlContentBoxChat(socket, dataResult, function () {
                    if (dataResult.booleanConversation) {
                        socket.emit('msgContentChat', dataRequest);
                        self.getDefaultHeightMsgBox();
                    }
                    var isSingle = dataResult.hasOwnProperty('isTypeSingle') ? dataResult.isTypeSingle : null;
                    callback({ isDataFriend: dataResult.isFriendCurrentSingle, isSingle: isSingle, dataResult: dataResult });
                });
            });
        };
        _this.clickShowParticipantProfile = function () {
            var self = this;
            $('body').on('click', '#participant-profile', function () {
                var showProfileParticipantChat = new __WEBPACK_IMPORTED_MODULE_4__supports_ShowProfileParticipantChat__["a" /* ShowProfileParticipantChat */]();
                showProfileParticipantChat.renderHtmlProfileParticipants(self.dataConversationProfile, function () {
                    $('#myModalParticipant').modal({
                        show: 'false'
                    });
                });
            });
        };
        _this.clickAddContact = function (socket, remainTime) {
            var self = this;
            $('body').on('click', '#add-contact-user, #resend-contact-request', function () {
                var checkParticopantId = $('#extend-participant i[code-participant-id]').attr('code-participant-id');
                var participantID = typeof checkParticopantId !== "undefined" ? checkParticopantId : null;
                var userName = $('#participant-user-name').text();
                var resendRequest = $(this).attr('data-act-request');
                var conversationID = $(this).attr('data-conversation');
                var requestData = {
                    url: window.dataGlobal.urlAction.hasOwnProperty('actionAddContact') ? window.dataGlobal.urlAction.actionAddContact : null,
                    data: {
                        participantID: participantID,
                        infoParticipant: { userName: userName },
                        resendRequest: (typeof resendRequest !== "undefined" ? resendRequest : null),
                        conversationID: (typeof conversationID !== "undefined" ? conversationID : null),
                        _method: "POST"
                    }
                };
                var elem = this;
                if (requestData.url) {
                    var listContact_1 = new __WEBPACK_IMPORTED_MODULE_0__supports_ListContacts__["a" /* ListContacts */]();
                    self.callDataJS(requestData, function (result) {
                        var dataResult = result.data;
                        window.remainTime = self.getDateTimeNow() + remainTime;
                        window.valSearchAnonymous = true;
                        if (dataResult.resendRequest == 1) {
                            var dataRequest = {
                                url: dataResult.url,
                                userName: dataResult.userName,
                                dataChannelID: dataResult.dataChannelID,
                                dataOwnerID: dataResult.dataOwnerID,
                                dataConversation: dataResult.dataConversation,
                                valAuthor: dataResult.valAuthor
                            };
                            self.reloadContentBoxChatAjax(dataRequest, socket, function () {
                                listContact_1.subscribeAfterClickListContact(function () { return self.activeListContact(elem, dataResult.dataChannelID); });
                            });
                        }
                        else {
                            $(elem).attr({ 'disabled': true });
                            listContact_1.subscribeAfterClickListContact(function () { return self.activeListContact(elem, dataResult.dataChannelID); });
                        }
                    });
                }
            });
        };
        _this.clickResultAddContact = function (socket) {
            var self = this;
            $('body').on('click', '#reply-accept-user, #reply-decline-user', function () {
                var dataActResult = $(this).attr('data-act-result');
                var userName = $('#participant-user-name').text();
                var userRequest = $('#extend-participant').find('i[code-participant-id]').attr('code-participant-id');
                var conversationID = $('#request-area-contact').attr('data-conversation');
                var reqResultAddContact = {
                    url: window.dataGlobal.urlAction.hasOwnProperty('actionAcceptContact') ? window.dataGlobal.urlAction.actionAcceptContact : null,
                    data: {
                        dataActResult: dataActResult,
                        userRequest: userRequest,
                        userName: userName,
                        conversationID: conversationID,
                        _method: "POST"
                    }
                };
                if (reqResultAddContact.url) {
                    var listContact = new __WEBPACK_IMPORTED_MODULE_0__supports_ListContacts__["a" /* ListContacts */]();
                    self.callDataJS(reqResultAddContact, function (resultContact) {
                        socket.emit('resultAcceptDeclineContact', resultContact);
                        if (resultContact.option.hasOwnProperty('activeResult')) {
                            var opt = {
                                userName: userName,
                                booleanActiveResult: resultContact.option.activeResult,
                            };
                            self.reloadContentChatBox(resultContact, opt, socket);
                        }
                    });
                }
            });
        };
        _this.renderShowEmoji = function () {
            var self = this;
            $('#boxChat').emojiPicker({
                width: window.widthEmoji + "px",
                height: window.heightEmoji + "px",
                button: false,
                position: 'right',
                fadeTime: 100,
                container: '#show-emoji-chat',
            });
            $('#show-emoji-chat').css({ display: 'none' });
        };
        _this.clickShowEmoji = function () {
            var self = this;
            $('body').on('click', '#click-emoji-chat', function () {
                // $('#boxChat').emojiPicker({
                //     width: `${window.widthEmoji}px`,
                //     height: `${window.heightEmoji}px`,
                //     button: false,
                //     position: 'right',
                //     fadeTime: 100,
                //     container: '#show-emoji-chat',
                // });
                self.eventPositionEmoji();
            });
        };
        _this.eventDisplayEmoji = function () {
            $('#show-emoji-chat').css({ display: "none" });
        };
        _this.eventPositionEmoji = function (isResize) {
            if (isResize === void 0) { isResize = false; }
            if (isResize && $('#show-emoji-chat').css('display') == 'block' || !isResize && $('#show-emoji-chat').css('display') == 'none') {
                var offsetEmoji = $('#click-emoji-chat').offset();
                $('#show-emoji-chat').css({
                    display: 'block',
                    width: window.widthEmoji,
                    height: window.heightEmoji,
                    position: "absolute",
                    // bottom: (offsetEmoji.top - 20),
                    top: (offsetEmoji.top - 2 * window.heightEmoji + 15),
                    left: ($('#frameListMsg').width() - window.widthEmoji + $('#click-emoji-chat').position().left)
                });
                $('.emojiPicker').css({ display: "block", position: "unset" });
            }
            else {
                this.eventDisplayEmoji();
            }
        };
        _this.eventScrollEndBoxChat = function () {
            //     $('#newMsgChat').delay(10).css("display", "none");
            console.log('-------------------------- lam cai day');
        };
        _this.eventScrollTopBoxChat = function (socket) {
            var page = $('#frameListMsg').has('page') ? $('#frameListMsg').attr('page') : 1;
            var dataRequest = {
                data: {
                    dataChannelID: $('#messageInput').has('data-channel') ? $('#messageInput').attr('data-channel') : null,
                    page: $('#frameListMsg').has('page') ? $('#frameListMsg').attr('page') : 1,
                    dataConversation: $('#messageInput').has('data-conversation') ? $('#messageInput').attr('data-conversation') : null,
                    isScrollTop: true
                }
            };
            setTimeout(function () {
                socket.emit('msgContentChat', dataRequest);
            }, 1000);
        };
        _this.renderHtmlContentBoxChat = function (socket, dataRequest, callback) {
            var showContentChat = new __WEBPACK_IMPORTED_MODULE_3__supports_ShowContentChat__["a" /* ShowContentChat */]();
            this.dataConversationProfile = dataRequest;
            $('#content-chat').html(showContentChat.getShowContentChat(dataRequest));
            //------------------XXXXXXXXXX---------------------------
            $('#boxChat').css({
                "max-height": parseInt(dataRequest.maxHeightInputBoxChat),
                "height": parseInt(dataRequest.minHeightBoxChat)
            });
            $('#style-box-sms').css({ "max-height": parseInt(dataRequest.maxHeightBoxChat) });
            $('#create-tooltip .tooltiptext').css({ display: 'none' });
            $('#list-your-friend').css({ 'display': 'none' });
            /// ACCEPTED
            if (dataRequest.booleanConversation) {
                if (!dataRequest.isFriendCurrentSingle) {
                    $("#messageInput").addClass("disabled-element");
                    $("#frameListMsg").addClass("remove-scrollbar");
                    $("#boxChat").attr("placeholder", 'Messsaging disabled until request is accepted');
                    //css box chat with not friend
                    $('#messageInput .btn-controler-act').remove();
                    $('#boxChat').addClass('cuts-box-chat-clear center-placeholder');
                }
            }
            else {
                // REQUEST
                $("#messageInput").addClass("disabled-element");
                $("#frameListMsg").addClass("remove-scrollbar");
                $("#boxChat").attr("placeholder", 'Messsaging disabled until request is accepted');
                //css box chat with not friend
                $('#messageInput .btn-controler-act').remove();
                $('#boxChat').addClass('cuts-box-chat-clear center-placeholder');
            }
            //---------------------------------------------
            callback();
        };
        _this.htmlContentBoxChat = function (resultDataMsg) {
            var libCommonChat = new __WEBPACK_IMPORTED_MODULE_1__supports_LibCommonChat__["a" /* LibCommonChat */]();
            resultDataMsg.listMsg.forEach(function (element) {
                var lengthMsg = element.data.length;
                var msgLastElementsMsg = $('#boxMsgChat li:last-child');
                var msgFirstElementsMsg = $('#boxMsgChat li:first-child');
                if (lengthMsg) {
                    var option_1 = {
                        isSingle: element.isSingle,
                        isUserCurrent: element.isUserCurrent
                    };
                    var resultHtml_1 = '';
                    var dataListContactTemp = resultDataMsg.isLoadTop ? element.data.reverse() : element.data;
                    var isExitsElementEnd_1 = resultDataMsg.isLoadTop === false ? element.isUserCurrent ? msgLastElementsMsg.hasClass('replies') : msgLastElementsMsg.hasClass('author-' + element.contactMessage.id) : false;
                    var isExitsElementFirst_1 = resultDataMsg.isLoadTop === true ? (element.isUserCurrent ? msgFirstElementsMsg.hasClass('replies') : msgFirstElementsMsg.hasClass('author-' + element.contactMessage.id)) : false;
                    dataListContactTemp.forEach(function (ele, indx) {
                        var isExitsTypeMsg = resultDataMsg.inverseTypeMsg[ele.message_type];
                        if (isExitsTypeMsg) {
                            var reqOption = {
                                isUserCurrent: option_1.isUserCurrent,
                                isSingle: option_1.isSingle,
                                isLoad: resultDataMsg.option.isLoad,
                                isUserFuture: (indx < (lengthMsg - 1) || isExitsElementFirst_1) ? true : false,
                                isUserPass: ((indx && indx <= (lengthMsg - 1)) || isExitsElementEnd_1) ? true : false,
                            };
                            switch (parseInt(isExitsTypeMsg)) {
                                case 1:
                                    resultHtml_1 += libCommonChat.supportHtmlTextAppend(ele, reqOption);
                                    break;
                                case 2:
                                    resultHtml_1 += libCommonChat.renderHtmlMessageImage();
                                    break;
                                case 3:
                                    resultHtml_1 += libCommonChat.renderHtmlMessageVideo();
                                    break;
                                case 4:
                                    resultHtml_1 += libCommonChat.renderHtmlMessageAudio();
                                    break;
                                default:
                                    resultHtml_1 += "";
                            }
                        }
                    });
                    if (resultDataMsg.isLoadTop === true) {
                        if (option_1.isUserCurrent === true) {
                            if (msgFirstElementsMsg.hasClass('replies')) {
                                msgFirstElementsMsg.find('p').addClass('top-right');
                                msgFirstElementsMsg.find('._ua2').prepend(resultHtml_1);
                                var tempFirstEle = $('#boxMsgChat li:first-child').find('._ua2 ._5wd4:first-child');
                                tempFirstEle.find('p').addClass('bottom-right');
                                tempFirstEle.addClass('bottom-m1');
                            }
                            else {
                                var htmlTextTopPrivate = libCommonChat.supportHtmlTextPrivate(element.contactMessage, option_1);
                                $('#boxMsgChat').prepend(htmlTextTopPrivate.htmlOpen + resultHtml_1 + htmlTextTopPrivate.htmlClose);
                            }
                        }
                        else {
                            if (msgFirstElementsMsg.hasClass('author-' + element.contactMessage.id)) {
                                msgFirstElementsMsg.find('p').addClass('top-left');
                                var get_4tdx = msgFirstElementsMsg.find('._ua2 ._4tdx');
                                msgFirstElementsMsg.find('._ua2 ._4tdx').remove();
                                msgFirstElementsMsg.find('._ua2').prepend(resultHtml_1);
                                msgFirstElementsMsg.find('._ua2').prepend(get_4tdx);
                            }
                            else {
                                option_1['lastCreatedAt'] = element.data[element.data.length - 1].created_at;
                                var htmlTextTopOther = libCommonChat.supportHtmlTextOther(element.contactMessage, option_1);
                                $('#boxMsgChat').prepend(htmlTextTopOther.htmlOpen + resultHtml_1 + htmlTextTopOther.htmlClose);
                            }
                        }
                    }
                    else {
                        if (option_1.isUserCurrent === true) {
                            if (msgLastElementsMsg.hasClass('replies')) {
                                msgLastElementsMsg.find('p').addClass('bottom-right');
                                msgLastElementsMsg.find('._ua2').append(resultHtml_1);
                            }
                            else {
                                var htmlTextEndPrivate = libCommonChat.supportHtmlTextPrivate(element.contactMessage, option_1);
                                $('#boxMsgChat').append(htmlTextEndPrivate.htmlOpen + resultHtml_1 + htmlTextEndPrivate.htmlClose);
                            }
                        }
                        else {
                            if (msgLastElementsMsg.hasClass('author-' + element.contactMessage.id)) {
                                msgLastElementsMsg.find('p').addClass('bottom-left');
                                msgLastElementsMsg.find('._ua2').append(resultHtml_1);
                            }
                            else {
                                option_1['lastCreatedAt'] = element.data[element.data.length - 1].created_at;
                                var htmlTextEndOther = libCommonChat.supportHtmlTextOther(element.contactMessage, option_1);
                                $('#boxMsgChat').append(htmlTextEndOther.htmlOpen + resultHtml_1 + htmlTextEndOther.htmlClose);
                            }
                        }
                    }
                    // resultHtml += htmlText.htmlOpen + resultHtml + htmlText.htmlClose;
                }
            });
            return true;
        };
        _this.scrollListener = function (socket) {
            var that = this;
            var elem = document.getElementById('frameListMsg');
            if (elem) {
                elem.addEventListener("scroll", function (e) {
                    var frameListMsg = document.getElementById('frameListMsg');
                    var scrollTop = frameListMsg.scrollTop;
                    if (scrollTop === 0) {
                        frameListMsg.setAttribute('page', (parseInt(frameListMsg.getAttribute('page')) + 1).toString());
                        that.eventScrollTopBoxChat(socket);
                    }
                    if (scrollTop + $('#frameListMsg').innerHeight() >= $('#frameListMsg')[0].scrollHeight) {
                        that.eventScrollEndBoxChat();
                    }
                }, false);
            }
        };
        _this.clickSearchContacts = function (remainTimeSearch) {
            var that = this;
            $('body').on('click', '#searchContacts', function () {
                window.remainTime = that.getDateTimeNow() + remainTimeSearch;
                var listContact = new __WEBPACK_IMPORTED_MODULE_0__supports_ListContacts__["a" /* ListContacts */]();
                listContact.searchOnContacts(window.listContacts);
            });
        };
        // clickEmojiBoxChat = function () {
        //     $('body').on('click', '#call-emoji-chat', function () {
        //         let emojiHtmlChat = new EmojiHtmlChat();
        //
        //     });
        // };
        _this.sendDataBroadCast = function (messageSent) {
            var searchDomChannel = $('[channel="status.' + messageSent.channelId + '"]');
            if (searchDomChannel.closest('li').hasClass('active')) {
                this.htmlContentBoxChat(messageSent);
                if ($('#boxMsgChat').is(':focus')) {
                    this.scrollEndShowBoxChat(1000);
                    // $('#frameListMsg').trigger('changeBoxMsg');
                    //     $("#frameListMsg").animate({scrollTop: $("#frameListMsg")[0].scrollHeight}, 200);
                }
                else {
                    $('#newMsgChat').delay(100).css("display", "block");
                }
            }
            else {
                var badgesNotify = searchDomChannel.closest('.wrap').find('i.badges-notify');
                if (badgesNotify.length) {
                    badgesNotify.addClass('badges-color').text('211');
                }
            }
        };
        _this.msgContent = function (dataMessage) {
            if (dataMessage.isLength) {
                var oldScrollHeight = $("#frameListMsg")[0].scrollHeight;
                this.htmlContentBoxChat(dataMessage);
                this.getDefaultHeightMsgBox();
                if (dataMessage.isLoadTop === false) {
                    this.scrollEndShowBoxChat(0);
                }
                else {
                    $('#frameListMsg').animate({ scrollTop: ($('#frameListMsg')[0].scrollHeight - oldScrollHeight) }, 100);
                }
            }
        };
        _this.createConversationGroup = function (resultConversationGroup, socket) {
            if (resultConversationGroup.done == true) {
                var opt = {
                    userName: resultConversationGroup.option.userNameGroup,
                    booleanActiveResult: true,
                };
                this.reloadContentChatBox(resultConversationGroup, opt, socket);
                // let listContact = new ListContacts();
                // window.remainTime = 1;//that.getDateTimeNow() + remainTime;
                // window.valSearchAnonymous = true;
                // listContact.subscribeAfterClickListContact();
            }
        };
        _this.reloadContentChatBox = function (resultContact, opt, socket) {
            var _this = this;
            window.remainTime = 1;
            window.valSearchAnonymous = true;
            var listContact = new __WEBPACK_IMPORTED_MODULE_0__supports_ListContacts__["a" /* ListContacts */]();
            var dataRequest = {
                url: window.dataGlobal.urlAction.hasOwnProperty('urlChangeContent') ? window.dataGlobal.urlAction.urlChangeContent : null,
                userName: opt.userName,
                dataChannelID: opt.booleanActiveResult && resultContact.data.hasOwnProperty('dataChannelID') ? resultContact.data.dataChannelID : null,
                dataOwnerID: resultContact.data.valAuthor,
                dataConversation: opt.booleanActiveResult && resultContact.data.hasOwnProperty('dataConversation') ? resultContact.data.dataConversation : null,
                valAuthor: resultContact.option.activeResult ? null : resultContact.data.valAuthor
            };
            if (dataRequest.url) {
                this.reloadContentBoxChatAjax(dataRequest, socket, function (resultReload) {
                    _this.readyChatParticipant(socket, resultReload, function (result) {
                        listContact.subscribeAfterClickListContact(function () {
                            var dataChannelID = (result.dataResult.hasOwnProperty('dataChannelId')) ? result.dataResult.dataChannelId : null;
                            _this.activeListContact(null, dataChannelID);
                        });
                    });
                });
            }
        };
        _this.activeListContact = function (elem, channelId) {
            if (channelId === void 0) { channelId = null; }
            $('#contacts li.contact').removeClass('active');
            if (channelId)
                $('[channel="status.' + channelId + '"]').closest('li').addClass('active');
            else if (elem)
                $(elem).closest('li').addClass('active');
            else {
            }
        };
        _this.getAttributesJavaScript = function (elementJavaScript, attr) {
            return elementJavaScript.attributes[attr].nodeValue || null;
        };
        _this.hasClassJavaScript = function (elementJavaScript, className) {
            return elementJavaScript.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
        };
        _this.addClassJavaScript = function (elementJavaScript, className) {
            if (!this.hasClassJavaScript(elementJavaScript, className))
                elementJavaScript.className += " " + className;
        };
        _this.removeClassJavaScript = function (elementJavaScript, className) {
            if (this.hasClassJavaScript(elementJavaScript, className)) {
                var reg = new RegExp('(\\s|^)' + elementJavaScript + '(\\s|$)');
                elementJavaScript.className = elementJavaScript.className.replace(reg, ' ');
            }
        };
        _this.scrollContentChat = function () {
            $('#content-chat').css({ "width": ($('#frame').width() - $('#sidepanel').width()) });
        };
        return _this;
    }
    return SendChatMessage;
}(__WEBPACK_IMPORTED_MODULE_2__libSupports__["a" /* libSupports */]));



/***/ }),

/***/ "./src/app/common/chat/supports/EmojiHtmlChat.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EmojiHtmlChat; });

var emojiText = __webpack_require__("../node_modules/emoji-text/index.js");
var emoji = __webpack_require__("../node_modules/node-emoji/index.js");
var EmojiHtmlChat = /** @class */ (function () {
    function EmojiHtmlChat() {
    }
    EmojiHtmlChat.prototype.convertEmojiToText = function (str) {
        return typeof str != 'undefined' ? str.length ? emojiText.convert(str, { delimiter: ':' }) : str : '';
    };
    EmojiHtmlChat.prototype.convertEmoji = function (stringMsg) {
        return typeof stringMsg != 'undefined' ? stringMsg.length
            ? emoji.emojify(stringMsg, function (name) {
                return name;
            })
            : stringMsg
            : '';
    };
    EmojiHtmlChat.prototype.convertEmojiFormat = function (stringMsg) {
        return typeof stringMsg != 'undefined' ? stringMsg.length
            ? emoji.emojify(stringMsg, function (name) {
                return name;
            }, function (code, nameSrc) {
                return '<img alt="' + code + '" src="./' + nameSrc + '.png" />';
            })
            : stringMsg
            : '';
    };
    return EmojiHtmlChat;
}());



/***/ }),

/***/ "./src/app/common/chat/supports/LibCommonChat.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LibCommonChat; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__libSupports__ = __webpack_require__("./src/app/common/libSupports.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ListContacts__ = __webpack_require__("./src/app/common/chat/supports/ListContacts.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__EmojiHtmlChat__ = __webpack_require__("./src/app/common/chat/supports/EmojiHtmlChat.ts");

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



var LibCommonChat = /** @class */ (function (_super) {
    __extends(LibCommonChat, _super);
    function LibCommonChat() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LibCommonChat.prototype.swap = function (json) {
        var ret = {};
        for (var key in json) {
            ret[json[key]] = key;
        }
        return ret;
    };
    ;
    LibCommonChat.prototype.convertHtmlToPlainText = function (strHtml) {
        var stringHtml = strHtml !== undefined ? strHtml : "";
        if (stringHtml == '')
            return;
        return stringHtml.replace(/&/g, '&amp;')
            .replace(/>/g, '&gt;')
            .replace(/</g, '&lt;')
            .replace(/\n/g, '<br>');
    };
    ;
    LibCommonChat.prototype.regExpString = function (strSearch) {
        var stringSearch = strSearch !== 'undefined' ? strSearch : '';
        return new RegExp(stringSearch, "g");
    };
    ;
    LibCommonChat.prototype.renderHtmlMessageVideo = function () {
    };
    ;
    LibCommonChat.prototype.renderHtmlMessageAudio = function () {
    };
    ;
    LibCommonChat.prototype.renderHtmlMessageImage = function () {
    };
    ;
    LibCommonChat.prototype.supportHtmlTextOther = function (contactMessage, reqOption) {
        var htmlOpen = '<li class="_4tdt sent author-' + contactMessage.id + '">'
            + '<div class="js_hn _31o4">'
            + '<a aria-label="" class="_4tdw" href="#" class-tooltip-hover="js_hn" data-hover="tooltip" data-tooltip-position="left"'
            + 'data-tooltip-content="' + contactMessage.middle_name + ' <br>' + this.checkTimeActiveLastWeek(reqOption.lastCreatedAt) + '" >'
            + '<img src="http://emilcarlsson.se/assets/donnapaulsen.png" alt="" class="img"></a></div>'
            + '<div class="_ua2">'
            + ((reqOption.isSingle === false) ? ('<div class="_4tdx">' + contactMessage.middle_name.split(' ')[0] + '</div>') : "");
        var htmlClose = '</div></li>';
        return { htmlOpen: htmlOpen, htmlClose: htmlClose };
    };
    ;
    LibCommonChat.prototype.supportHtmlTextPrivate = function (contactMessage, reqOption) {
        var htmlOpen = '<li class="_4tdt replies">'
            + '<div class="_ua2">';
        var htmlClose = '</div></li>';
        return { htmlOpen: htmlOpen, htmlClose: htmlClose };
    };
    ;
    LibCommonChat.prototype.supportHtmlTextAppend = function (obj, reqOption) {
        var listClass = '';
        var emojiHtmlChat = new __WEBPACK_IMPORTED_MODULE_2__EmojiHtmlChat__["a" /* EmojiHtmlChat */]();
        if (reqOption.isUserCurrent === false) {
            if (reqOption.isUserFuture === true) {
                listClass = 'bottom-left';
                if (reqOption.isUserPass === true) {
                    listClass += ' top-left';
                }
            }
            else if (reqOption.isUserPass === true) {
                listClass += ' top-left';
            }
        }
        else {
            if (reqOption.isUserFuture === true) {
                listClass = 'bottom-right';
                if (reqOption.isUserPass === true) {
                    listClass += ' top-right';
                }
            }
            else if (reqOption.isUserPass === true) {
                listClass += ' top-right';
            }
        }
        var dataAttr = (reqOption.isUserCurrent) ? ('data-msg="' + obj.id + '"') : "";
        var classTooltipHover = (reqOption.isUserCurrent) ? ('class-tooltip-hover="js_hn"') : "";
        var dataTooltipContent = (reqOption.isUserCurrent)
            ? ("data-tooltip-private=\"1\" data-tooltip-position=\"right\" data-hover=\"tooltip\" data-tooltip-content=\"" + this.checkTimeActiveLastWeek(obj.created_at) + "\"")
            : "";
        return "<div " + dataAttr + " class=\"_5wd4 " + (reqOption.isUserCurrent ? "js_hn _1nc6 " : "") + " " + (reqOption.isUserFuture ? "bottom-m1" : "") + "\">\n            <p " + dataTooltipContent + " " + classTooltipHover + " class=\"" + listClass + "\">" + emojiHtmlChat.convertEmoji(this.convertHtmlToPlainText(obj.message)) + "</p></div>";
    };
    ;
    LibCommonChat.prototype.checkTimeActiveLastWeek = function (lastCreatedAt) {
        var now = new Date();
        var timestampLastWeek = now.getTime() - (7 * 24 * 60 * 60 * 1000);
        if (lastCreatedAt === undefined || lastCreatedAt === null)
            return '';
        var listContact = new __WEBPACK_IMPORTED_MODULE_1__ListContacts__["a" /* ListContacts */]();
        return listContact.customDateTime(lastCreatedAt, timestampLastWeek);
    };
    LibCommonChat.prototype.getMinHeightFrameListMsg = function () {
        var outerHeightParticipant = $("#group-participant").hasClass('display-show') ? $("#group-participant").outerHeight() : 0;
        return $(".content").outerHeight() - $(".contact-profile").outerHeight() - outerHeightParticipant - $("#messageInput").outerHeight() - 1;
    };
    return LibCommonChat;
}(__WEBPACK_IMPORTED_MODULE_0__libSupports__["a" /* libSupports */]));



/***/ }),

/***/ "./src/app/common/chat/supports/ListContacts.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ListContacts; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash__ = __webpack_require__("./node_modules/lodash/lodash.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__libSupports__ = __webpack_require__("./src/app/common/libSupports.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ShowContentChat__ = __webpack_require__("./src/app/common/chat/supports/ShowContentChat.ts");

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



var ListContacts = /** @class */ (function (_super) {
    __extends(ListContacts, _super);
    function ListContacts() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.appendNotFoundListSearchContact = function () {
            return "<li id=\"search-box-contacts\" class=\"search-contact\">\n            <div class=\"wrap\">\n                <div class=\"box-sreach-contact not-found\">\n                   Contact not found \n                </div>\n            </div></li>";
        };
        _this.appendCloseListSearchContact = function (option) {
            return "<li id=\"search-box-contacts\" class=\"search-contact\">\n            <div class=\"wrap\">\n                <div class=\"box-sreach-contact\">\n                    <input id=\"searchContacts\" data-url=\"" + option.dataUrlSearchAll + "\" type=\"button\" class=\"btn btn-primary\" value=\"Search contacts\" />\n                </div>\n            </div></li>";
        };
        _this.searchOnContacts = function (listContacts) {
            var listUnsetAuthor = $.map(listContacts, function (elem) {
                if (elem.isSingle === true) {
                    return elem.users_id;
                }
            });
            var listUnsetAuthorSearchDynamic = $.map(window.listContactSearchDynamic, function (elem) {
                if (elem.isSingle === true) {
                    return elem.users_id;
                }
            });
            var request = {
                url: $('#searchContacts').attr('data-url'),
                data: {
                    listContactParticipant: __WEBPACK_IMPORTED_MODULE_0_lodash__["union"](listUnsetAuthor, listUnsetAuthorSearchDynamic),
                    // listContactParticipant: [],
                    valSearchContact: $.trim($('#search-contact').val()),
                    _method: "POST"
                }
            };
            var self = this;
            this.callDataJS(request, function (resultListContactSearch) {
                var listContactSearch = JSON.parse(resultListContactSearch.data);
                var lengthContacts = $('#contacts-your li').length - 1;
                if (listContactSearch.contactList.length) {
                    $($("#contacts-your li")[lengthContacts]).before($(self.showContactListAll(listContactSearch, true)));
                }
                else {
                    $($("#contacts-your li")[lengthContacts]).before($(self.appendNotFoundListSearchContact()));
                }
                $('#searchContacts').attr({ disabled: true });
            });
        };
        _this.updateListUserConversation = function (listConversation) {
            var elemFind = $('[channel="status.' + listConversation.channel_id + '"]');
            elemFind.removeClass(listConversation.listStatus).addClass(listConversation.classCurrentStatus);
            //not show profile
            if (listConversation.hasOwnProperty('mood_message') && listConversation.mood_message) {
                elemFind.closest('div.wrap').find('.mood_message').text(listConversation.mood_message);
                $('#resend-contact-request').attr({ disabled: true });
            }
            if (listConversation.hasOwnProperty('moreMoodMessage') && listConversation.moreMoodMessage) {
                var showContentChat = new __WEBPACK_IMPORTED_MODULE_2__ShowContentChat__["a" /* ShowContentChat */]();
                elemFind.closest('#extend-participant').find('.info-group').html(showContentChat.supportHeaderHtmlMoodMessageChat(listConversation.moreMoodMessage, true));
            }
        };
        return _this;
    }
    ListContacts.prototype.renderResult = function (data) {
        if (data === void 0) { data = ''; }
        var htmlOpen = '<div class="search-results-contacts"><div class="box-action-friend" id="box-action-friend">';
        var htmlClose = '</div></div>';
        return { htmlOpen: htmlOpen, htmlClose: htmlClose };
    };
    ;
    ListContacts.prototype.renderSearch = function () {
        return "<div class=\"search-contacts\"><input class=\"search-single\" id=\"search-single\" type=\"text\" value=\"\" maxlength=\"20\"></div>";
    };
    ;
    ListContacts.prototype.renderListContact = function () {
        var htmlOpen = '<div class="data-contact" id="data-contact"><ul id="list-contacts">';
        var htmlClose = '</ul></div>';
        return { htmlOpen: htmlOpen, htmlClose: htmlClose };
    };
    ;
    ListContacts.prototype.actionContact = function (option) {
        var html = '<div class="clearfix"></div><div class="action-friend" id="action-friend">';
        html += (option !== undefined ? (option === false ?
            '<button class="btn btn-primary add" title="Add users" disabled>Add</button>' :
            '<button class="btn btn-primary create" title="Create group" disabled>Create</button>') : '');
        html += '<button class="btn btn-primary cancel">Cancel</button></div>';
        return html;
    };
    ;
    ListContacts.prototype.supportResultContact = function (obj) {
        var htmlListContactAction = '';
        obj.forEach(function (element) {
            htmlListContactAction += "<div class=\"name-contact\" data-act-freind=\"" + element.user_id + "\" data-author=\"author." + element.user_id + "\">\n                    <span class=\"name-act\">" + (element.middle_name ? element.middle_name : element.user_name) + "</span>\n                    <i class=\"act-aptach fa fa-close\" aria-hidden=\"true\"></i>\n                </div>";
        });
        return htmlListContactAction;
    };
    ;
    ListContacts.prototype.supportListContact = function (obj) {
        var listParticipant = this.getListParticipant();
        var htmlListContact = '';
        obj.forEach(function (element) {
            if (listParticipant.includes(element.user_id)) {
                return false;
            }
            htmlListContact += "<li class=\"contact-list\">\n                <div class=\"wap-contact\" data-author=\"author." + element.user_id + "\">\n                    <img src=\"" + (element.path_img ? element.path_img : element.path_img_default) + "\" alt=\"\">\n                    <div class=\"meta-contact\">\n                        <p class=\"\">" + (element.hasOwnProperty('textSearch') ? element.textSearch : element.showUser) + "</p>\n                        <p class=\"\">" + (element.mood_message ? element.mood_message : '') + "</p>\n                    </div>\n                 </div></li>";
        });
        return htmlListContact;
    };
    ;
    ListContacts.prototype.render = function (obj, objAction) {
        var resultHtml = '<div class="list-contact">';
        resultHtml += this.renderResult().htmlOpen + this.supportResultContact(objAction) + this.renderResult().htmlClose;
        resultHtml += this.renderSearch();
        resultHtml += this.renderListContact().htmlOpen + this.supportListContact(obj.data) + this.renderListContact().htmlClose;
        resultHtml += this.actionContact(obj.option.isConversationSingle);
        resultHtml += '</div>';
        return resultHtml;
    };
    ;
    ListContacts.prototype.searchLikeContact = function (obj, strSearch) {
        var stringSearch = strSearch !== 'undefined' ? strSearch : '';
        var search = new RegExp(stringSearch, "i");
        var listContactSingleSearch = jQuery.grep(obj, function (items) {
            var middle_name = search.test(items.middle_name);
            var email = search.test(items.email);
            var user_name = search.test(items.user_name);
            var textSearch = items.showUser;
            var textSearchOption = '';
            if (middle_name) {
                textSearch = items.middle_name.replace(search, "<mark>" + strSearch + "</mark>");
            }
            if (email) {
                textSearchOption += items.email.replace(search, "<mark>" + strSearch + "</mark>");
            }
            if (user_name) {
                textSearchOption += items.user_name.replace(search, "<mark>" + strSearch + "</mark>");
            }
            items.textSearch = textSearch + (textSearchOption ? (' (' + textSearchOption + ')') : '');
            return middle_name || email || user_name;
        });
        return listContactSingleSearch;
    };
    ;
    ListContacts.prototype.clickActionContact = function () {
        var listParticipant = {};
        var tempAuthorId = [];
        var tempNameAuthorId = [];
        var that = this;
        $('.name-contact[data-act-freind]').each(function (index, element) {
            var authorId = $(element).attr('data-act-freind');
            var nameAuthorId = $(element).find('.name-act')[0].childNodes[0].nodeValue;
            if (typeof authorId !== typeof undefined && authorId !== false) {
                tempAuthorId.push(parseInt(authorId));
                tempNameAuthorId.push(that.ucfirst(nameAuthorId));
            }
        });
        listParticipant['authorId'] = tempAuthorId;
        listParticipant['nameAuthorId'] = tempNameAuthorId;
        return listParticipant;
    };
    ;
    ListContacts.prototype.getListParticipant = function () {
        return $.map($('[code-participant-id]'), function (ele) {
            var codeParticipant = $(ele).attr("code-participant-id");
            if (typeof codeParticipant !== typeof undefined && codeParticipant !== false) {
                return parseInt(codeParticipant);
            }
            return false;
        });
    };
    ;
    ListContacts.prototype.renderContactSingle = function (element, option) {
        var statusPart = option.cfgChat.chatStatus[element.status] ? option.cfgChat.chatStatus[element.status] : "";
        var classStatusPart = statusPart ? ((statusPart == option.cfgChat.cfg_chat.status_hidden_name) ? option.cfgChat.cfg_chat.status_hidden_name_replace : statusPart) : statusPart;
        var valAuthor = element.hasOwnProperty('listContactParticipant') && element.hasOwnProperty('users_id') ? "data-author=\"" + element.users_id + "\"" : '';
        var htmlSingleAll = "<li class=\"contact\">\n            <div class=\"wrap\" data-conversation=\"" + element.idConversation + "\" data-type=\"" + element.type + "\" \n                data-channel=\"" + element.channel_id + "\" data-owner=\"" + element.creator_id + "\" " + valAuthor + ">\n                <span channel=\"status." + element.channel_id + "\" \n                    class=\"list-icon-status contact-status " + (element.is_accept_single ? option.cfgChat.cfg_chat.class_undefined : (element.is_life && classStatusPart) ? classStatusPart : "") + "\"></span>\n                <img src=\"" + (element.path_img ? element.path_img : option.cfgChat.cfg_chat.img_single_user) + "\" alt=\"\"/>\n                <div class=\"meta\">\n                    <span class=\"name-notify\"><p class=\"name\" data-conversation-name=\"" + element.showUser + "\">\n                        " + (element.hasOwnProperty('textSearch') ? element.textSearch : (element.middle_name ? element.middle_name : "&nbsp;")) + " </p>\n                        <i class=\"badges-notify\">132</i></span>\n                <p class=\"preview mood_message\">" + (element.hasOwnProperty('mood_message') && element.mood_message ? element.mood_message : "") + " </p>\n                </div>\n                </div>\n            </li>";
        return htmlSingleAll;
    };
    ;
    ListContacts.prototype.renderContactGroup = function (element, option) {
        var htmlGroupAll = "<li class=\"contact\">\n            <div class=\"wrap\" data-conversation=\"" + element.idConversation + "\" data-type=\"" + element.type + "\" data-channel=\"" + element.channel_id + "\" data-owner=\"" + element.creator_id + "\">\n                <span channel=\"status." + element.channel_id + "\" class=\"\"></span>\n                <img src=\"" + (element.path_img_group ? element.path_img_group : option.cfgChat.cfg_chat.img_group_user) + "\" alt=\"\"/>\n                <div class=\"meta\">\n                    <span class=\"name-notify\"><p class=\"name\" data-conversation-name=\"" + element.title + "\">\n                        " + (element.hasOwnProperty('textSearch') ? element.textSearch : element.title) + "</p>\n                        <i class=\"badges-notify\">132</i></span>\n                    <p class=\"preview\">" + element.count + " participants</p>\n                </div>\n            </div>\n            </li>";
        return htmlGroupAll;
    };
    ;
    ListContacts.prototype.showContactListAll = function (dataResult, otpReplace) {
        if (otpReplace === void 0) { otpReplace = false; }
        var _this = this;
        var htmlListContact = '';
        var option = {
            cfgChat: dataResult.cfgChat
        };
        dataResult.contactList.forEach(function (element) {
            if (element.isSingle === true) {
                htmlListContact += _this.renderContactSingle(element, option);
            }
            else {
                htmlListContact += _this.renderContactGroup(element, option);
            }
        });
        if (otpReplace === false)
            $('#contacts-your').html(htmlListContact);
        return htmlListContact;
    };
    ;
    ListContacts.prototype.subscribeAfterClickListContact = function (callback) {
        if (callback === void 0) { callback = false; }
        var _this = this;
        var valSearch = $.trim($('#search-contact').val());
        var runRemainTime = setInterval(function () {
            if (window.remainTime && window.requestListContactDefault) {
                if (window.remainTime < _this.getDateTimeNow() && (valSearch || window.valSearchAnonymous)) {
                    clearInterval(runRemainTime);
                    window.valSearchAnonymous = false;
                    window.remainTime = 0;
                    window.listContactSearchDynamic = [];
                    $('#search-contact').val('');
                    _this.searchListContactListAll(window.requestListContactDefault, function () {
                        if (typeof callback === "function")
                            callback();
                    });
                }
            }
            else {
                clearInterval(runRemainTime);
            }
        }, 1000);
    };
    ;
    ListContacts.prototype.searchListContactListAll = function (requestListContact, callback) {
        if (callback === void 0) { callback = false; }
        var _this = this;
        this.callDataJS(requestListContact, function (dataResult) {
            if (dataResult.err) {
                console.log('ERROR: ', dataResult.err);
            }
            else {
                _this.showContactListAll(dataResult.data);
                window.listContactSearchDynamic = $.extend(true, [], dataResult.data.contactList);
                $('#contacts-your').append(requestListContact.reset ? '' : _this.appendCloseListSearchContact(dataResult.option));
            }
            if (typeof callback === "function")
                callback();
        });
    };
    ;
    return ListContacts;
}(__WEBPACK_IMPORTED_MODULE_1__libSupports__["a" /* libSupports */]));



/***/ }),

/***/ "./src/app/common/chat/supports/MenuInfoChat.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MenuInfoChat; });

var MenuInfoChat = /** @class */ (function () {
    function MenuInfoChat() {
        this.contextMenuClassName = "context-menu";
        // var contextMenuItemClassName : any = "context-menu__item";
        this.contextMenuLinkClassName = "context-menu__link";
        this.contextMenuActive = "context-menu--active";
        this.taskItemClassName = "task";
        this.menu = document.querySelector("#" + this.contextMenuClassName);
        // var menuItems : any = menu.querySelectorAll("." + contextMenuLinkClassName);
        this.menuState = 0;
        this.clickInsideElement = function (e, className) {
            var el = e.srcElement || e.target;
            if (el.classList.contains(className)) {
                return el;
            }
            else {
                while (el = el.parentNode) {
                    if (el.classList && el.classList.contains(className)) {
                        return el;
                    }
                }
            }
            return false;
        };
        this.getPosition = function (event) {
            var posx = 0;
            var posy = 0;
            var e = event ? event : window.event;
            if (e.pageX || e.pageY) {
                posx = e.pageX;
                posy = e.pageY;
            }
            else if (e.clientX || e.clientY) {
                posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
            }
            return { x: posx, y: posy };
        };
        this.contextListener = function () {
            var self = this;
            document.addEventListener("contextmenu", function (e) {
                self.taskItemInContext = self.clickInsideElement(e, self.taskItemClassName);
                if (self.taskItemInContext) {
                    e.preventDefault();
                    self.toggleMenuOn();
                    self.positionMenu(e);
                }
                else {
                    self.taskItemInContext = null;
                    self.toggleMenuOff();
                }
            });
        };
        this.clickListener = function (sendChatMessage, socket) {
            var self = this;
            document.addEventListener("click", function (e) {
                var clickElIsLink = self.clickInsideElement(e, self.contextMenuLinkClassName);
                if (clickElIsLink) {
                    e.preventDefault();
                    self.menuItemListener(sendChatMessage, socket, clickElIsLink);
                }
                else {
                    var button = e.which || e.button;
                    if (button === 1) {
                        self.toggleMenuOff();
                    }
                }
            });
        };
        this.keyupListener = function () {
            var self = this;
            window.onkeyup = function (e) {
                if (e.keyCode === 27) {
                    self.toggleMenuOff();
                }
            };
        };
        this.resizeListener = function () {
            var self = this;
            window.onresize = function (e) {
                self.toggleMenuOff();
            };
        };
        this.toggleMenuOn = function () {
            if (this.menuState !== 1) {
                this.menuState = 1;
                this.menu.classList.add(this.contextMenuActive);
            }
        };
        this.toggleMenuOff = function () {
            if (this.menuState !== 0) {
                this.menuState = 0;
                this.menu.classList.remove(this.contextMenuActive);
                this.menu.style = "";
            }
        };
        this.positionMenu = function (e) {
            this.clickCoords = this.getPosition(e);
            this.clickCoordsX = this.clickCoords.x;
            this.clickCoordsY = this.clickCoords.y;
            this.menuWidth = this.menu.offsetWidth + 4;
            this.menuHeight = this.menu.offsetHeight + 4;
            this.windowWidth = window.innerWidth;
            this.windowHeight = window.innerHeight;
            if ((this.windowWidth - this.clickCoordsX) < this.menuWidth) {
                this.menu.style.left = this.windowWidth - this.menuWidth + "px";
            }
            else {
                this.menu.style.left = (this.clickCoordsX - 100) + "px";
            }
            if ((this.windowHeight - this.clickCoordsY) < this.menuHeight) {
                this.menu.style.top = this.windowHeight - this.menuHeight + "px";
            }
            else {
                this.menu.style.top = (this.clickCoordsY - 50) + "px";
            }
            this.menu.style.display = 'block';
            this.menu.style['z-index'] = 990;
        };
        this.menuItemListener = function (sendChatMessage, socket, link) {
            var action = link.getAttribute("data-action");
            switch (action) {
                case 'view':
                    sendChatMessage.clickTaskContactChat($('li[data-id="' + this.taskItemInContext.getAttribute("data-id") + '"]'), socket);
                    break;
                default:
            }
            console.log("Task ID - " + this.taskItemInContext.getAttribute("data-id") + ", Task action - " + link.getAttribute("data-action"));
            this.toggleMenuOff();
        };
    }
    return MenuInfoChat;
}());



/***/ }),

/***/ "./src/app/common/chat/supports/ShowContentChat.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ShowContentChat; });

var ShowContentChat = /** @class */ (function () {
    function ShowContentChat() {
    }
    ShowContentChat.prototype.supportHeaderHtmlMoodMessageChat = function (element, isFriend) {
        var htmlProfileMoodMessage = "<div class=\"info-group\"><span class=\"status-name\">" + element.moodMessageShow + "</span>";
        if (isFriend == true) {
            if (element.hasOwnProperty('dataListMoodMessage') && element.dataListMoodMessage) {
                element.dataListMoodMessage.forEach(function (elem) {
                    if (elem.exits)
                        htmlProfileMoodMessage += "<span class=\"status-space\">|</span><span class=\"status-other\">" + elem.moreMoodMsg + "</span>";
                    // supportHtmlProfile += `<div class="info-group">
                    //         <span class="status-name">${element.moodMessageShow}</span>
                    //         <span class="status-space">|</span>
                    //         <span class="status-other">fsgsgsgs</span>
                    //     </div>`;
                });
            }
        }
        htmlProfileMoodMessage += "</div>";
        return htmlProfileMoodMessage;
    };
    ShowContentChat.prototype.supportHeaderHtmlContentChat = function (dataHeaderContentChat, isFriend) {
        var _this = this;
        if (isFriend === void 0) { isFriend = false; }
        var supportHtmlProfile = '';
        if (dataHeaderContentChat.listParticipant.hasOwnProperty('length') && dataHeaderContentChat.listParticipant.length) {
            dataHeaderContentChat.listParticipant.forEach(function (element) {
                supportHtmlProfile += "<i channel=\"status." + dataHeaderContentChat.dataChannelId + "\" class=\"favorite-conversation " + element.classStatus + "\"\n                    codePartId=\"" + element.codePartId + "\" code-participant-id=\"" + element.users_id + "\" aria-hidden=\"true\"></i>";
                supportHtmlProfile += _this.supportHeaderHtmlMoodMessageChat(element, isFriend);
            });
        }
        return supportHtmlProfile;
    };
    ShowContentChat.prototype.headerHtmlContentChat = function (reqDataContentChat) {
        var htmlProfile = "<div class=\"contact-profile\">\n            <img id=\"participant-profile\" src=\"" + reqDataContentChat.urlImagesAvatar + "\" alt=\"\" data-toggle=\"modal\" data-target=\"#show-information-conversation\"/>\n            <div class=\"info-conversation-participant\">";
        htmlProfile += "<div class=\"info-participant\">\n            <input class=\"star favorite-participant\" type=\"checkbox\" title=\"bookmark users\" checked/>\n            <p id=\"participant-user-name\">" + reqDataContentChat.userName + "</p></div>";
        htmlProfile += "<div id=\"extend-participant\" class=\"info-conversation " + (reqDataContentChat.hasOwnProperty('isTypeSingle') ? reqDataContentChat.isTypeSingle ? "" : " cursor" : "") + "\">";
        if (reqDataContentChat.booleanConversation) {
            if (reqDataContentChat.isTypeSingle) {
                htmlProfile += this.supportHeaderHtmlContentChat(reqDataContentChat, true);
            }
            else {
                htmlProfile += "<i class=\"favorite-conversation fa fa-plus\" aria-hidden=\"true\"></i>\n                    <div class=\"info-group\">\n                    <span>" + reqDataContentChat.countParticipants + " Participants</span>\n                    <span class=\"status-space\">|</span>\n                    <span class=\"status-other\">fsgsgsgs</span></div>";
            }
        }
        else {
            htmlProfile += this.supportHeaderHtmlContentChat(reqDataContentChat);
        }
        htmlProfile += '</div></div>';
        htmlProfile += "<div class=\"social-media\">\n            <div class=\"social-media\">\n                <i class=\"fa fa-facebook\" aria-hidden=\"true\"></i>\n                <i class=\"fa fa-twitter\" aria-hidden=\"true\"></i>\n                <i class=\"fa fa-instagram\" aria-hidden=\"true\"></i>";
        if (reqDataContentChat.booleanConversation) {
            htmlProfile += "<i id=\"list-contact-your\" class=\"fa " + (reqDataContentChat.isTypeSingle ? (reqDataContentChat.isFriendCurrentSingle ? "plus-group" : "") : "plus-user") + "\"\n                aria-hidden=\"true\" title=\"" + (reqDataContentChat.isTypeSingle ? "Create group" : "Add user") + "\" data-toggle=\"modal\" data-target=\"#list-friend-yours\"></i>";
        }
        htmlProfile += '</div></div>';
        htmlProfile += '</div>';
        if (reqDataContentChat.booleanConversation) {
            if (!reqDataContentChat.isTypeSingle) {
                htmlProfile += "<div class=\"clearfix\"></div><div id=\"group-participant\" class=\"display-none\">\n                    <ul class=\"list-group-part\">";
                if (reqDataContentChat.listParticipant.hasOwnProperty('length') && reqDataContentChat.listParticipant.length) {
                    reqDataContentChat.listParticipant.forEach(function (ele) {
                        htmlProfile += "<li data-id=\"" + ele.conversationID + "\" class=\"task info-contextmenu info-part show-info-participants\">\n                            <span data-conversation=\"" + ele.conversationID + "\" data-channel=\"" + ele.channelID + "\" data-author=\"" + ele.users_id + "\" data-username=\"" + ele.middle_name + "\"\n                            codePartId=\"" + ele.codePartId + "\" code-participant-id=\"" + ele.users_id + "\" channel=\"status." + (ele.isFriendCurrent ? ele.channelID : "") + "\"\n                            class=\"status-info-part stype-list " + ele.classStatus + "\"></span>\n                            <span class=\"status-info-name\">" + ele.middle_name + "</span></li>";
                    });
                }
                htmlProfile += '</ul></div>';
            }
        }
        return htmlProfile;
    };
    ShowContentChat.prototype.htmlBoxContentChat = function (reqBoxContentChat) {
        var optUrl = reqBoxContentChat.urlAction;
        var htmlBoxContentChat = "<div class=\"messages\" id=\"frameListMsg\" box-raw-msg=\"" + reqBoxContentChat.minHeightBoxChat + "\"\n            page=\"" + reqBoxContentChat.page + "\" box-change-msg=\"" + reqBoxContentChat.minHeightBoxChat + "\">";
        if (reqBoxContentChat.booleanConversation) {
            if (reqBoxContentChat.isFriendCurrentSingle) {
                htmlBoxContentChat += '<ul id="boxMsgChat"></ul>';
            }
            else {
                if (reqBoxContentChat.isCurrentOwnerId) {
                    htmlBoxContentChat += "<div class=\"clearfix\"></div>\n                        <div class=\"mr-t20 col-md-12\" id=\"request-area\">\n                            <div class=\"send-request-user col-md-offset-4\">\n                                <span>contact request sent - <button data-act-request=\"0\" data-conversation=\"" + reqBoxContentChat.dataConversation + "\" id=\"resend-contact-request\" class=\"btn btn-primary\">Resend contact request</button></span>\n                            </div>\n                        </div>";
                }
                else {
                    htmlBoxContentChat += "<div class=\"clearfix\"></div>\n                        <div class=\"request-area-contact\"><div class=\"accept-request-user\">\n                            <div class=\"mr-t20 col-md-12\" id=\"request-area-contact\" align=\"center\" data-conversation=\"" + reqBoxContentChat.dataConversation + "\">\n                                <span>Sent you a friend request</span>\n                                <button class=\"btn btn-primary\" data-act-result=\"0\" id=\"reply-decline-user\">decline</button>\n                                <button class=\"btn btn-primary\" data-act-result=\"1\" id=\"reply-accept-user\">accept</button>\n                            </div>\n                        </div></div>";
                }
            }
        }
        else {
            //NOT FRIEND
            htmlBoxContentChat += "<div class=\"clearfix\"></div>\n                <div class=\"\" id=\"request-area\"><div class=\"accept-request-user\">\n                    <div class=\"mr-t20 col-md-12\" align=\"center\">\n                        <span><p class=\"name-partici-req\">" + reqBoxContentChat.userName + "</p> is not in your contacts</span>\n                        <button data-url=\"" + optUrl.actionAddContact + "\" class=\"btn btn-primary\" data-act-request=\"1\" id=\"add-contact-user\">Add to contacts</button>\n                    </div>\n                </div></div>";
        }
        htmlBoxContentChat += '</div>';
        return htmlBoxContentChat;
    };
    ShowContentChat.prototype.htmlActionContentChat = function (reqData) {
        var htmlActionContentChat = "<div class=\"message-input\" id=\"messageInput\" data-conversation=\"" + reqData.dataConversation + "\"\n            data-channel=\"" + reqData.dataChannelId + "\" data-owner=\"" + reqData.dataOwnerId + "\" data-type=\"" + reqData.dataType + "\">";
        htmlActionContentChat += '<div class="wrap">';
        htmlActionContentChat += "<div class=\"scrollbar\" id=\"style-box-sms\" max-height=\"" + reqData.maxHeightBoxChat + "\" min-height=\"" + reqData.minHeightBoxChat + "\">\n            <textarea id=\"boxChat\" class=\"box_msg\" type=\"text\" placeholder=\"Write your message...\"></textarea></div>";
        //--------------------------
        if (reqData.booleanConversation) {
            htmlActionContentChat += "<div class=\"btn-controler-act\"><ul class=\"_552n\">";
            htmlActionContentChat += "<li class=\"_13gd \">\n                <form action=\"#\" class=\"_vzk\" title=\"Add Files\" method=\"post\">\n                    <input type=\"hidden\" name=\"attach_id\" value=\"\">\n                    <input type=\"hidden\" name=\"images_only\" value=\"false\">\n                    <div class=\"ms_img\"><input id=\"add_f\" type=\"file\" class=\"\" name=\"attachment[]\" multiple=\"\" accept=\"*\" title=\"Add Files\">\n                        <label for=\"add_f\" class=\"_4q61 _6gb _6gg attachment-cst r_file90\" tabindex=\"-1\" href=\"#\"><i class=\"hidden_elem\" alt=\"Camera\"></i></label>\n                    </div>\n                </form></li>";
            htmlActionContentChat += "<li class=\"_13f- \">\n                <form action=\"#\" class=\"_vzk\" title=\"Add Photos\" method=\"post\">\n                    <input type=\"hidden\" name=\"attach_id\" value=\"\">\n                    <input type=\"hidden\" name=\"images_only\" value=\"true\">\n                    <div class=\"ms_img\"><input id=\"add_i\" type=\"file\" class=\"\" name=\"attachment[]\" multiple=\"\" accept=\"image/*\" title=\"Add Photos\">\n                        <label for=\"add_i\" class=\"_4q61 _6gb _6ge attachment-cst r_img70\" tabindex=\"-1\" href=\"#\"><i class=\"hidden_elem\" alt=\"Camera\"></i></label>\n                    </div>\n                </form></li>";
            htmlActionContentChat += "<li class=\"_13gg\">\n                <a class=\"_6gb _3oxr attachment-cst r_emoji50\" id=\"click-emoji-chat\" role=\"button\" title=\"Choose an emoji\"><i class=\"\" aria-hidden=\"true\"></i></a>\n                </li>";
            htmlActionContentChat += "<li class=\"_13gg \">\n                    <a id=\"sendMessageChat\" class=\"sms-send\"><div class=\"submit attachment-cst r_bt25\"><i class=\"fa fa-paper-plane\" aria-hidden=\"true\"></i></div></a>\n                </li>";
            htmlActionContentChat += '</ul></div>';
        }
        //-------------------------------
        htmlActionContentChat += '</div></div>';
        htmlActionContentChat += '<div id="show-emoji-chat"></div>';
        htmlActionContentChat += '<div id="newMsgChat" style="display: none"><div class="bs"><a id="notifyNewsSms" title="news message">news message</a></div></div>';
        htmlActionContentChat += '<div id="create-tooltip" class="cus-tooltip"><div class="uiContextualLayer"><span class="tooltiptext" style="display: none"></span></div></div>';
        htmlActionContentChat += '<div id="list-your-friend"></div>';
        return htmlActionContentChat;
    };
    ShowContentChat.prototype.htmlActionMenuContentChat = function () {
        return "<div id=\"menu\">\n                <a href=\"#\"><img src=\"http://puu.sh/nr60s/42df867bf3.png\"/> AdBlock Plus <span>Ctrl + ?!</span></a>\n                <a href=\"#\"><img src=\"http://puu.sh/nr5Z6/4360098fc1.png\"/> SNTX <span>Ctrl + ?!</span></a>\n                <hr/>\n                <a href=\"#\"><i class=\"fa fa-fort-awesome\"></i> Fort Awesome <span>Ctrl + ?!</span></a>\n                <a href=\"#\"><i class=\"fa fa-flag\"></i> Font Awesome <span>Ctrl + ?!</span></a>\n            </div>";
    };
    ShowContentChat.prototype.getShowContentChat = function (dataResult) {
        return this.headerHtmlContentChat(dataResult)
            + this.htmlBoxContentChat(dataResult)
            + this.htmlActionContentChat(dataResult)
            + this.htmlActionMenuContentChat();
    };
    return ShowContentChat;
}());



/***/ }),

/***/ "./src/app/common/chat/supports/ShowProfileParticipantChat.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ShowProfileParticipantChat; });

var ShowProfileParticipantChat = /** @class */ (function () {
    function ShowProfileParticipantChat() {
        this.htmlHeadProfile = function (dataParticipants) {
            var htmlHead = '<div class="show-avatar">'
                + '<div class="img-avatar">'
                + '<div class="b-img">';
            htmlHead += '<img class="img-av" src="' + (dataParticipants.isTypeSingle ? dataParticipants.listParticipant[0].urlImagesAvatarSingle : dataParticipants.urlImagesAvatar) + '" alt=""/>';
            htmlHead += '</div>';
            if (dataParticipants.isTypeSingle === false) {
                htmlHead += '<a href="#" title="Update avatar" class="avatar-group">Change avatar</a>';
            }
            htmlHead += '</div></div>';
            return htmlHead;
        };
        this.htmlContentProfile = function (dataParticipants) {
            var htmlContentProfie = '<div class="box-show-info">'
                + '<div class="info-profile">'
                + '<ul class="data-show-label">';
            htmlContentProfie += dataParticipants.isTypeSingle === true
                ? this.htmlSingle(dataParticipants) : this.htmlGroup(dataParticipants);
            htmlContentProfie += '</ul>';
            htmlContentProfie += '</div></div>';
            return htmlContentProfie;
        };
        this.htmlCloseShowProfile = function () {
            return "<div class=\"clearfix\"></div>\n            <div class=\"modal-footer act-box\">\n            <button type=\"button\" class=\"btn btn-primary\" data-dismiss=\"modal\">Close</button>\n            </div>";
        };
        this.htmlGroup = function (dataParticipants) {
            var htmlGroupBoxProfile = "<li class=\"label-profile title-name\">" + dataParticipants.userName + "</li>";
            return htmlGroupBoxProfile;
        };
        this.htmlSingle = function (dataParticipants) {
            var profiltPart = dataParticipants.listParticipant[0];
            var htmlSingleBoxProfile = '<li class="label-profile title-name">' + profiltPart.middle_name + '</li>';
            htmlSingleBoxProfile += '<li class="label-profile title-mood">' + profiltPart.mood_message + '</li>';
            htmlSingleBoxProfile += '<li class="label-profile title-country">' + profiltPart.country + '</li>';
            htmlSingleBoxProfile += '<hr>';
            htmlSingleBoxProfile += profiltPart.user_name ? '<li class="label-profile title-nick">' + profiltPart.user_name + '</li>' : '';
            htmlSingleBoxProfile += profiltPart.email ? '<li class="label-profile title-email">' + profiltPart.email + '</li>' : '';
            htmlSingleBoxProfile += profiltPart.phone ? '<li class="label-profile title-phone">' + profiltPart.phone + '</li>' : '';
            htmlSingleBoxProfile += '<hr>';
            htmlSingleBoxProfile += profiltPart.gender ? '<li class="label-profile title-sex">' + profiltPart.gender + '</li>' : '';
            // htmlSingleBoxProfile += '<li class="label-profile title-language">' + profiltPart.middle_name + '</li>';
            // htmlSingleBoxProfile += '<li class="label-profile title-birth">' + profiltPart.middle_name + '</li>';
            // <li class="label-profile"> country </li>
            // <li class="label-profile"></li>
            // <hr>
            // <li class="label-profile"> nick </li>
            // <li class="label-profile"> email </li>
            // <li class="label-profile">num telephone</li>
            // <hr>
            // <li class="label-profile">Sex</li>
            // <li class="label-profile">language</li>
            return htmlSingleBoxProfile;
        };
        this.renderHtmlProfileParticipants = function (dataParticipant, callback) {
            $('#html-profile-participants').html(this.htmlHeadProfile(dataParticipant)
                + this.htmlContentProfile(dataParticipant)
                + this.htmlCloseShowProfile());
            callback();
        };
    }
    return ShowProfileParticipantChat;
}());



/***/ }),

/***/ "./src/app/common/libSupports.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return libSupports; });

var mainAng = __webpack_require__("../proxy.conf.json");
var pjson = __webpack_require__("./package.json");
var bundles = __webpack_require__("./bundles.angular.json");
var libSupports = /** @class */ (function () {
    function libSupports() {
        this.delayKeyUp = function () {
            var timer = 0;
            return function (callback, ms) {
                clearTimeout(timer);
                timer = setTimeout(callback, ms);
            };
        }();
    }
    libSupports.prototype.urlSide = function () {
        return mainAng['/api/*'].target;
    };
    libSupports.prototype.intiLoadCss = function (isCheckWebsite) {
        if (isCheckWebsite === void 0) { isCheckWebsite = true; }
        var nameWebsite = isCheckWebsite ? 'main' : 'admin_main';
        this.loadCss(bundles.styles[nameWebsite].files);
    };
    libSupports.prototype.intiLoadScript = function (isCheckWebsite) {
        if (isCheckWebsite === void 0) { isCheckWebsite = true; }
        var nameWebsite = isCheckWebsite ? 'main' : 'admin_main';
        this.loadScript(bundles.scripts[nameWebsite].files.head);
        this.appendMyScript(bundles.scripts[nameWebsite].files.body);
    };
    libSupports.prototype.loadScript = function (urlArray) {
        if (urlArray.length) {
            urlArray.forEach(function (url, index) {
                // console.clear();
                // console.log(`preparing to load script...  ${index} of ${urlArray.length}`);
                var node = document.createElement('script');
                node.src = "assets/" + url + "?v=" + pjson.version;
                node.type = 'text/javascript';
                document.getElementsByTagName('head')[0].appendChild(node);
            });
            // console.clear();
            // console.log(`Javascript is loaded successfull`);
        }
    };
    libSupports.prototype.loadCss = function (urlArray) {
        if (urlArray.length) {
            urlArray.forEach(function (url, index) {
                // console.clear();
                // console.log(`preparing to load css...  ${index} of ${urlArray.length}`);
                var node = document.createElement('link');
                node.href = "assets/" + url + "?v=" + pjson.version;
                node.rel = 'stylesheet';
                node.type = 'text/css';
                document.getElementsByTagName('head')[0].appendChild(node);
            });
            // console.clear();
            // console.log(`Css is loaded successfull`);
        }
    };
    libSupports.prototype.appendMyScript = function (urlArray) {
        if (urlArray.length) {
            urlArray.forEach(function (url) {
                var script = document.createElement('script');
                script.src = "assets/" + url + "?v=" + pjson.version;
                script.async = true;
                script.defer = true;
                document.body.appendChild(script);
            });
        }
    };
    libSupports.prototype.activeLastWeek = function (dateCheck, nowTimestampLastWeek) {
        var timestemp = new Date(dateCheck);
        return timestemp.getTime() >= nowTimestampLastWeek;
    };
    libSupports.prototype.getDateTimeNow = function () {
        var timestemp = new Date();
        return timestemp.getTime();
    };
    libSupports.prototype.customDateTime = function (dateTime, timestampLastWeek) {
        if (dateTime == undefined)
            return '';
        var weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        var objDate = new Date(dateTime);
        var strTime = '';
        if (this.activeLastWeek(dateTime, timestampLastWeek)) {
            strTime = weekday[objDate.getDay()];
        }
        else {
            strTime = objDate.toLocaleString("en-us", { month: "short" }) + ' ' + objDate.getDate();
        }
        strTime += ', ' + objDate.toLocaleString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        });
        return strTime;
    };
    libSupports.prototype.callDataJS = function (dataRequest, callback) {
        $.ajax({
            method: "POST",
            headers: {
                "Authorization": ('Bearer ' + (localStorage.getItem('idToken') || '')),
                "Content-type": "application/x-www-form-urlencoded",
                "Access-Control-Allow-Credentials": true,
                "withCredentials": true,
                "credentials": 'same-origin',
                'Access-Control-Allow-Origin': '*'
            },
            url: dataRequest.url,
            data: dataRequest.data,
            async: true,
            dataType: "json",
            success: function (dataResult) {
                callback(dataResult);
            },
            error: function (jqXHR, exception, error) {
                console.log('ERR Ajax 1: =>', jqXHR);
                console.log('ERR Ajax 2: =>', exception);
                console.log('ERR Ajax 3: =>', error);
                var msg = '';
                if (jqXHR.status === 0) {
                    msg = 'Not connect.\n Verify Network.';
                }
                else if (jqXHR.status == 404) {
                    msg = 'Requested page not found. [404]';
                }
                else if (jqXHR.status == 401) {
                    // localStorage.removeItem('idToken');
                    msg = 'Login Failed. [401]';
                    if (jqXHR.responseJSON !== undefined) {
                        if (jqXHR.responseJSON.hasOwnProperty('url')) {
                            window.location.href = jqXHR.responseJSON.url;
                        }
                    }
                }
                else if (jqXHR.status == 500) {
                    msg = 'Internal Server Error [500].';
                }
                else if (exception === 'parsererror') {
                    msg = 'Requested JSON parse failed.';
                }
                else if (exception === 'timeout') {
                    msg = 'Time out error.';
                }
                else if (exception === 'abort') {
                    msg = 'Ajax request aborted.';
                }
                else {
                    msg = 'Uncaught Error.\n' + jqXHR.responseText;
                }
            }
        });
    };
    //convert html tag to plain text
    libSupports.prototype.convertHtmlToPlainText = function (strHtml) {
        var stringHtml = strHtml !== undefined ? strHtml : '';
        if (stringHtml === '')
            return;
        return stringHtml.replace(/&/g, '&amp;')
            .replace(/>/g, '&gt;')
            .replace(/</g, '&lt;')
            .replace(/\n/g, '<br>');
    };
    libSupports.prototype.cnMessagesShow = function (arrNotify, notify, optionMultis) {
        if (optionMultis === void 0) { optionMultis = false; }
        var optionMulti = optionMultis !== undefined ? optionMultis : false;
        var delay = 7500;
        var result = '';
        var date = new Date();
        if (arrNotify.length == 0) {
            return result;
        }
        var type = 'notify';
        if (notify == 'e') {
            type = 'error';
        }
        else if (notify == 'w') {
            type = 'warnings';
        }
        else if (notify == 's') {
            type = 'sussce';
        }
        else if (notify == 'i') {
            // type = 'notification';
        }
        result += '<div class="cn_' + type + '_list">';
        $.each(arrNotify, function (key, value) {
            var nID = 'notify_' + key + date.getSeconds();
            result += '<div class="cn_' + type + '_item" id="' + nID + '"><div><b><a id="alert_pattern-number">' + value + '</a></b></div></div>';
            result += '<script type="text/javascript">this.notify_auto_hide("' + nID + '", "' + type + '", ' + delay + ');<\/script>';
            delay += 1000;
        });
        result += '</div>';
        if (optionMulti) {
            $('[id="message"]:not(#message:first)').remove();
        }
        $('#message').css('display', 'block');
        return result;
    };
    libSupports.prototype.notify_auto_hide = function (id, type, delay) {
        var gs = setTimeout(function () {
            $('#' + id).remove();
            if ($('.cn_' + type + '_item').length == 0) {
                $('#message').css('display', 'none');
                $('.cn_' + type + '_list').hide();
            }
        }, delay);
    };
    libSupports.prototype.ucfirst = function (str) {
        var string = (str !== undefined ? str : '');
        if (str === '')
            return '';
        return string.charAt(0).toUpperCase() + string.slice(1);
    };
    libSupports.prototype.imageToBase64 = function (img) {
        var canvas, ctx, dataURL, base64;
        canvas = document.createElement("canvas");
        ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        dataURL = canvas.toDataURL("image/png");
        base64 = dataURL.replace(/^data:image\/png;base64,/, "");
        return base64;
    };
    libSupports.prototype.swap = function (json) {
        var ret = {};
        for (var key in json) {
            ret[json[key]] = key;
        }
        return ret;
    };
    libSupports.prototype.convertDataGroupToSingleParticipant = function (dataRequest, dataAuthor) {
        console.log(dataRequest, dataAuthor);
        var dataResult = $.extend(true, {}, dataRequest);
        dataResult.listParticipant = [];
        dataResult.isTypeSingle = true;
        dataRequest.listParticipant.forEach(function (elem) {
            if (dataAuthor && elem.users_id == dataAuthor) {
                dataResult.listParticipant.push(elem);
            }
        });
        return dataResult;
    };
    return libSupports;
}());



/***/ }),

/***/ "./src/app/components/contents/chat/chat.component.css.ngstyle.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return styles; });
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes}
 * tslint:disable
 */ 
var styles = ["#frame p {\r\n    clear: unset;\r\n    margin: 0;\r\n    padding: 0;\r\n}\r\n\r\n#frame ul, ol {\r\n    margin: 0;\r\n    padding: 0;\r\n}\r\n\r\n#frame {\r\n    width: 100%;\r\n    min-width: 360px;\r\n    height: 85vh;\r\n    min-height: 300px;\r\n    max-height: 720px;\r\n    background: #E6EAEA;\r\n}\r\n\r\n#frame #sidepanel {\r\n    float: left;\r\n    min-width: 280px;\r\n    max-width: 340px;\r\n    width: 40%;\r\n    height: 100%;\r\n    background: #2c3e50;\r\n    color: #f5f5f5;\r\n    overflow: hidden;\r\n    position: relative;\r\n}\r\n\r\n#frame #sidepanel #profile {\r\n    width: 80%;\r\n    margin: 25px auto;\r\n}\r\n\r\n#frame #sidepanel #profile.expanded .wrap {\r\n    height: 210px;\r\n    line-height: initial;\r\n}\r\n\r\n#frame #sidepanel #profile.expanded .wrap p.user-name-chat {\r\n    margin-top: 0px;\r\n}\r\n\r\n#frame #sidepanel #profile.expanded .wrap i.expand-button {\r\n    -webkit-transform: scaleY(-1);\r\n    transform: scaleY(-1);\r\n    -webkit-filter: FlipH;\r\n            filter: FlipH;\r\n    -ms-filter: \"FlipH\";\r\n}\r\n\r\n#frame #sidepanel #profile .wrap {\r\n    height: 60px;\r\n    line-height: 60px;\r\n    overflow: hidden;\r\n    -webkit-transition: 0.3s height ease;\r\n    transition: 0.3s height ease;\r\n}\r\n\r\n#frame #sidepanel #profile .wrap img {\r\n    width: 50px;\r\n    border-radius: 50%;\r\n    display: block;\r\n    padding: 3px;\r\n    border: 2px solid #e74c3c;\r\n    height: auto;\r\n    float: left;\r\n    cursor: pointer;\r\n    -webkit-transition: 0.3s border ease;\r\n    transition: 0.3s border ease;\r\n}\r\n\r\n#frame #sidepanel #profile .wrap #accCurrent {\r\n    position: relative;\r\n}\r\n\r\n#profile .wrap #accCurrent .btn-status-use {\r\n    width: 15px;\r\n    height: 15px;\r\n    position: absolute;\r\n    margin: 45px 0 0 45px;\r\n    border-radius: 50%;\r\n    cursor: pointer;\r\n}\r\n\r\n#profile .wrap #accCurrent .status-hover,\r\n#profile .wrap #accCurrent .btn-status-use:hover {\r\n    background-image: url(\"data:image/png;base64,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\") !important;\r\n\r\n}\r\n\r\n#frame #sidepanel #profile .wrap img.online {\r\n    border: 2px solid #2ecc71;\r\n}\r\n\r\n#frame #sidepanel #profile .wrap img.away {\r\n    border: 2px solid #f1c40f;\r\n}\r\n\r\n#frame #sidepanel #profile .wrap img.busy {\r\n    border: 2px solid #e74c3c;\r\n}\r\n\r\n#frame #sidepanel #profile .wrap img.offline {\r\n    border: 2px solid #95a5a6;\r\n}\r\n\r\n#frame #sidepanel #profile .wrap .info-current {\r\n    white-space: nowrap;\r\n    float: left;\r\n    margin-top: 14px;\r\n    width: 65%;\r\n}\r\n\r\n#frame #sidepanel #profile .wrap p {\r\n    clear: unset;\r\n    margin-left: 15px;\r\n}\r\n\r\n#frame #sidepanel #profile .wrap .info-current p.user-name-chat {\r\n    line-height: initial;\r\n    cursor: pointer;\r\n    white-space: nowrap;\r\n    overflow: hidden;\r\n    width: 100%;\r\n    text-overflow: ellipsis;\r\n}\r\n\r\n#frame #sidepanel #profile .wrap .info-current .mood-msg-current {\r\n    clear: unset;\r\n    float: left;\r\n    line-height: normal;\r\n    margin-left: 15px;\r\n    white-space: nowrap;\r\n    margin-top: 7px;\r\n    overflow: hidden;\r\n    width: 100%;\r\n    text-overflow: ellipsis;\r\n}\r\n\r\n#frame #sidepanel #profile .wrap i.expand-button {\r\n    float: right;\r\n    margin-top: 23px;\r\n    font-size: 0.8em;\r\n    cursor: pointer;\r\n    color: #435f7a;\r\n}\r\n\r\n#frame #sidepanel #profile .wrap #status-options {\r\n    position: absolute;\r\n    opacity: 0;\r\n    visibility: hidden;\r\n    width: 150px;\r\n    margin: 70px 0 0 0;\r\n    border-radius: 6px;\r\n    z-index: 99;\r\n    line-height: initial;\r\n    background: #435f7a;\r\n    -webkit-transition: 0.3s all ease;\r\n    transition: 0.3s all ease;\r\n}\r\n\r\n#frame #sidepanel #profile .wrap #status-options.active {\r\n    opacity: 1;\r\n    visibility: visible;\r\n    margin: 75px 0 0 0;\r\n}\r\n\r\n#frame #sidepanel #profile .wrap #status-options:before {\r\n    content: '';\r\n    position: absolute;\r\n    width: 0;\r\n    height: 0;\r\n    border-left: 6px solid transparent;\r\n    border-right: 6px solid transparent;\r\n    border-bottom: 8px solid #435f7a;\r\n    margin: -8px 0 0 24px;\r\n}\r\n\r\n#frame #sidepanel #profile .wrap #status-options ul {\r\n    overflow: hidden;\r\n    border-radius: 6px;\r\n}\r\n\r\n#frame #sidepanel #profile .wrap #status-options ul li {\r\n    padding: 10px 0 10px 18px;\r\n    display: block;\r\n    cursor: pointer;\r\n}\r\n\r\n#frame #sidepanel #profile .wrap #status-options ul li:hover {\r\n    background: #496886;\r\n}\r\n\r\n#frame #sidepanel #profile .wrap #status-options ul li span.status-circle {\r\n    position: absolute;\r\n    width: 10px;\r\n    height: 10px;\r\n    border-radius: 50%;\r\n    margin: 5px 0 0 0;\r\n}\r\n\r\n#frame #sidepanel #profile .wrap #status-options ul li span.status-circle:before {\r\n    content: '';\r\n    position: absolute;\r\n    width: 14px;\r\n    height: 14px;\r\n    margin: -3px 0 0 -3px;\r\n    background: transparent;\r\n    border-radius: 50%;\r\n    z-index: 0;\r\n}\r\n\r\n#frame #sidepanel #profile .wrap #status-options ul li p {\r\n    padding-left: 12px;\r\n}\r\n\r\n#frame #sidepanel #profile .wrap #status-options ul li#status-online span.status-circle {\r\n    background: #2ecc71;\r\n}\r\n\r\n#frame #sidepanel #profile .wrap #status-options ul li#status-online.active span.status-circle:before {\r\n    border: 1px solid #2ecc71;\r\n}\r\n\r\n#frame #sidepanel #profile .wrap #status-options ul li#status-away span.status-circle {\r\n    background: #f1c40f;\r\n}\r\n\r\n#frame #sidepanel #profile .wrap #status-options ul li#status-away.active span.status-circle:before {\r\n    border: 1px solid #f1c40f;\r\n}\r\n\r\n#frame #sidepanel #profile .wrap #status-options ul li#status-busy span.status-circle {\r\n    background: #e74c3c;\r\n}\r\n\r\n#frame #sidepanel #profile .wrap #status-options ul li#status-busy.active span.status-circle:before {\r\n    border: 1px solid #e74c3c;\r\n}\r\n\r\n#frame #sidepanel #profile .wrap #status-options ul li#status-hidden span.status-circle,\r\n#frame #sidepanel #profile .wrap #status-options ul li#status-offline span.status-circle {\r\n    background: #95a5a6;\r\n}\r\n\r\n#frame #sidepanel #profile .wrap #status-options ul li#status-hidden.active span.status-circle:before,\r\n#frame #sidepanel #profile .wrap #status-options ul li#status-offline.active span.status-circle:before {\r\n    border: 1px solid #95a5a6;\r\n}\r\n\r\n#frame #sidepanel #profile .wrap #expanded {\r\n    padding: 100px 0 0 0;\r\n    display: block;\r\n    line-height: initial !important;\r\n}\r\n\r\n#frame #sidepanel #profile .wrap #expanded label {\r\n    float: left;\r\n    clear: both;\r\n    margin: 0 8px 5px 0;\r\n    padding: 5px 0;\r\n}\r\n\r\n#frame #sidepanel #profile .wrap #expanded input {\r\n    border: none;\r\n    margin-bottom: 6px;\r\n    background: #32465a;\r\n    border-radius: 3px;\r\n    color: #f5f5f5;\r\n    padding: 7px;\r\n    width: calc(100% - 43px);\r\n}\r\n\r\n#frame #sidepanel #profile .wrap #expanded input:focus {\r\n    outline: none;\r\n    background: #435f7a;\r\n}\r\n\r\n#frame #sidepanel #box-search-contacts {\r\n    border-top: 1px solid #32465a;\r\n    border-bottom: 1px solid #32465a;\r\n    font-weight: 300;\r\n}\r\n\r\n#frame #sidepanel #box-search-contacts label {\r\n    position: absolute;\r\n    margin: 10px 0 0 20px;\r\n}\r\n\r\n#frame #sidepanel #box-search-contacts input {\r\n    font-family: \"proxima-nova\", \"Source Sans Pro\", sans-serif;\r\n    padding: 8px 16px 8px 44px;\r\n    width: calc(100% - 60px);\r\n    border: none;\r\n    background: #32465a;\r\n    color: #f5f5f5;\r\n    margin-bottom: 1px;\r\n    \r\n}\r\n\r\n#frame #sidepanel #box-search-contacts input:focus {\r\n    outline: none;\r\n    background: #435f7a;\r\n}\r\n\r\n#frame #sidepanel #box-search-contacts input::-webkit-input-placeholder {\r\n    color: #f5f5f5;\r\n}\r\n\r\n#frame #sidepanel #box-search-contacts input::-moz-placeholder {\r\n    color: #f5f5f5;\r\n}\r\n\r\n#frame #sidepanel #box-search-contacts input:-ms-input-placeholder {\r\n    color: #f5f5f5;\r\n}\r\n\r\n#frame #sidepanel #box-search-contacts input:-moz-placeholder {\r\n    color: #f5f5f5;\r\n}\r\n\r\n#frame #sidepanel #contacts {\r\n    height: calc(100% - 177px);\r\n    overflow-y: scroll;\r\n    overflow-x: hidden;\r\n}\r\n\r\n#frame #sidepanel #contacts.expanded {\r\n    height: calc(100% - 334px);\r\n}\r\n\r\n#frame #sidepanel #contacts::-webkit-scrollbar {\r\n    width: 8px;\r\n    background: #2c3e50;\r\n}\r\n\r\n#frame #sidepanel #contacts::-webkit-scrollbar-thumb {\r\n    background-color: #243140;\r\n}\r\n\r\n#frame #sidepanel #contacts ul li.contact, #frame #sidepanel #contacts ul li.search-contact {\r\n    position: relative;\r\n    padding: 7px 0;\r\n    font-size: 0.9em;\r\n    cursor: pointer;\r\n    display: -webkit-box;\r\n}\r\n\r\n#contacts ul li.search-contact .box-sreach-contact {\r\n    text-align: center;\r\n    margin-top: 10px;\r\n}\r\n\r\n#contacts ul li.search-contact .box-sreach-contact input.btn {\r\n    -webkit-box-sizing: border-box;\r\n            box-sizing: border-box;\r\n    -webkit-box-shadow: 2px 1px #0054CC;\r\n            box-shadow: 2px 1px #0054CC;\r\n}\r\n\r\n#frame #sidepanel #contacts ul li.contact:hover {\r\n    background: #32465a;\r\n}\r\n\r\n#frame #sidepanel #contacts ul li.contact.active {\r\n    background: #32465a;\r\n    border-right: 5px solid #435f7a;\r\n}\r\n\r\n#frame #sidepanel #contacts ul li.contact.active span.contact-status {\r\n    border: 1px solid #32465a !important;\r\n}\r\n\r\n#frame #sidepanel #contacts ul li.contact .wrap, #contacts ul li.search-contact .wrap {\r\n    width: 88%;\r\n    margin: 0 auto;\r\n    position: relative;\r\n}\r\n\r\n#frame #sidepanel #contacts ul li.contact .wrap span.list-icon-status {\r\n    position: absolute;\r\n    left: 0;\r\n    margin: -2px 0px 0 -2px;\r\n    width: 12px;\r\n    height: 12px;\r\n    border-radius: 50%;\r\n    border: 1px solid #2c3e50;\r\n}\r\n\r\n\r\n\r\n#profile .wrap #accCurrent span.offline,\r\n#frame #sidepanel #contacts ul li.contact .wrap span.list-icon-status,\r\n#frame .content .contact-profile .info-conversation i.offline,\r\n#frame .content #group-participant .list-group-part .info-part span.offline {\r\n    \r\n    background-image: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAADNFJREFUeNrUWllsHPUZ/2YPr4/1+oidOLbjOLZDYnI5p8MDBBrI0YK4KgHqQ/tAH6qiBBWJVgXKAwIKFSQhqKhqUeuXhocClSDkIE0VqSokJPiKA/Gu7SS+7XXseHdt7zn9fv+Z8Rw7azsufehI/8xk5/p91+87xpIsy/T/vLnwz8GDBxf9gNrauhKHw/GMLKe+l0gka6PRmaKpqSnP9PS0FI/HJbfbLefk5Mi5ublRjyd73OVydkmS42wqlXq3qysQXOx7jxw5oguwmK2uru7XbL2nQqHJ1fn5Pk9lZSWVlZVRSUkpFRUVUl6el7KysigWi0mRSFgaH5/ICQZHc4aGhsr7+vru5vt+VVtb65ck6VggEHjtdt/P9y1OgNWr73glkYj/OBaLV6xbt85xxx1raMWKFTQ2Nk7T0zOUTCbo228DxCDJ4/FQOByhZcvKaOnSUsrNLaSNGyvowQcfwnlPZ+fV9R0dHa9UV1f/zOl0NbFFXrxtQRADC3Eh1vgevvYtdpP6HTt2ODdtaiA+pmg0RoFApwDOriSuLS1dylYowuN5yTQxMU6jo6OEd+GecHiali+vEJZaurSYWltb6MKFC0l2r29Ys8+xRU7Ph+edd96xF0A7YdyOHj36Fmv36Q0bNvgaGxsZqIuCwTEaGOgl9mVas2Ytud0uYVYsCKKZWNvwHm0lk0li7dPU1AyfcbMFK1mQIjp//jy1tbWFc3Ky/3jgwIFfWHHwb2k453Who0ff/Sgej31///79HnYf1uYt6un5lrzefAHc5XKR06kAhjDJJFacrOzGgSuuwbWIjfXr1wtrjI4Gqbf3uthv395IHEve06dPPXP48JHaZ589+PB8+Bxzm+noiby83IeeeOJJT01NHQ0NDdONG9eopqaWyssrKDvbI7TNbMPanKaZmRk+jjGwhNCyshSh8BvOIU6YpfjamHCxsrJltHnzRn6Wg5qb24VFnnzyKXd+vvcHhw4d/nzRAkDzXm/e/Y888pirqKiYuru7KBIJMfgaEZwADv9numRgCeHrlvCajQGmWGEdZSmCMTuxIBEhDDY8d+XKMurv76Pr14fo0Ucfd/p8+fe9/fahT29bAPg83Gbv3n0ut9tDXV1dxBphbS1nX3cLwAAOrcLVze6uAIcL6aAV4NhrwmCPxYwmBInForRkSQmtW7eGFRNmJuumffv2O/maPW+++ebvFywAB8ceBOwDD+zx+HyFrPkAg88XC/47MxMVLpMOnNKAGzVv/7s8u2BNCAK3rK2tpvHxIFPzJO3Zs9fNLviTF1548fEFCQCqBNsgYDnpCI1D+06nU4CHJu2AK/eatWu2gPabAlhhpJRpIagjkSkWIofzzSqOtz62egU1NDTkFBT4fsfKzZlTACVJJetBlSMjo6yFmyIBAXw0GhUvsfPzTFrXhZENeyNw2bKUeyKRCBUUFHCuKKaWlsukULdz5csvv3yIhXBkFAAZFkmKyMmu001VVVWC3xFweHB6gJLFHeyAL2al2NrTVFFRzu46zZ4wBiEcXE/9kF9ZbCsAahv2tQpk2N7ePpElPR63MCtYwwrcyC6ZNWp0F1nNDbIqOJF9JSzPZmzEGlwpEOgh4GIrFD///C9fYSu40wRAYYbaBgwzONjP5isTyQcPMQNXNk3jOlCzq2jAFcDyLOB0QYy/mQWB5b1exF+KrRBE8pNYsQ8areDQSuJQKLQahdnERIgzpVtkWIC3U5LRRRSg6X6uaVLX9Px9h50gwFBZWS4CGviYustY0RsIfq4JgHoeJTGqyvb2NrrzznqRqGBGvRRQlhGkEheK/xsBaxrXtG8GOXeJbK2hIEBxcSEFudSoqKgkn6/Adf/9D/yUT+XO1kJoRlDPoySW5aTQvhW85jZGTWu/WcFrLmAmiETaMZQEhsOGvQYee6sl8rweztB9qJXo1q2JzfwTyt2wS3lgshbNyORkWPgcHsz1vonv7ekvZQCvBydyBUAqBJAwkIDWiEiqRfXj2RZRFIdOscfCNXhWaekSGh4aEU1TZ2fnMr60hFefEABtIDqpcDjMSSRLretlk9kzsYp2Du4EcyPwNMBGLWruobuJdkwmglDIITEbf0ikoHIw4vBwkNaurYaCctRAdokYQA8L2rx27YaQ0JywJBum0I9Ry6AuYhJQO7KkiSK1/sC6UJYox87Z/0PzylJ+xzGeh+eiChgaGhT0zlUvFO/j5RECoAFHD8udEBUWFqh+LaWBN9NkUmRMpH64mx68euAqGjYCd5oWAGpxoAmiXaed085zEqNvvrkqem3gVYM4y6VGuoQmY3IyJF5ojB8jJWKvFF4zamlh5XqzyyidGUBIsw2NvSuRJc/IBsZSnot4CIdCohlSchNliZDBEUYfmB5wKyeaD7zQCl7LjqjfFTeRLcJRBvAOU5upWUXzf7tA1h8nmyjbV+ATMYa4UFOAUwiAuQ1GH1VVK5mibgk/UzhffwBuRMelcL85sxoD1gpe074ugENVkNESlJbpjc/FGhsboSrOU4xT4NUuEwJg6IS5DdpEjEOWLCk2aRnAIYBdKWAFr2hX93tjEBsFsLLRXJkZa3h4hKqr0SdMMFNmI5GA6lIiiDExCwZHue7PE4xi1DB6XYXSjC5jn/YVsPoyg7cyUXogG5cxgMFKN4PjtLx8GQEn34dxRhTh61CSh7MLzUtJSRENDAzNsg+EAdtYmSiz9qUMVrAD70gDqS2jQNr1w6KUKBNN1vT01E2wP6+YQx15nIXrVFYuZ1dRJghgGQS0Ffhc2jcHqGSYE0mmWDDmAh20Hb0q1+FdHnc2N1clwsX7+we6+ZW3ZgXAoDUUmoziZH39nfTll+fVesUM1Fzr2GnfYWsJq0XsrGEUxmwJB128eJF23XcP9ym9TPW3Ep9++sk5fu0Y8qgQAFNibtr9mJatXFnJCe2aoWAzc/1cVaRZ6w5TPJhBS4Zs60iLA2OM4Fl9vUO0atUKMc3j7ebw8HC/KkDKYQBxrKOjI1VaWsTNTKUwlV5hkmmf3nxIJl431zpmy6QL4zBk4/SYGBwcpjVr6wk56vLlyzJXC5h+IVAnTB0ZRtx8Qz8Grdu2NtClS22znG/sqsxZkkw8nrlg08GbXUqyCWaniXa/+OIr2rJloxgAx+OxUFNT0wl+8A1UQGlNvcvlbsKUuKS0kND0tLe3qxonmxpftlhAT0bpWdY+qK3Arf7f2trGzfwOxiVh8Jvq6upuQQmtrlSaAH5/50sYcWNK3Ni4lWJRiWl1YM5OyppJ9aRkdKlMcWKMFTMTjYwMU3QmweXzajG1ZuoMvv/+nz7hB19VGch+sIX5PGs+hNH5tu1bqKenn/uE0HyfGWzB6+WB0c3shDGzD4OlK1c6aUfjNiYYPzU3N0fPnDlzCjrm1XPgwIFkRgHwcQHz+c8/Px0rKMilzZu3UHvbVa73J+f55JPpWMrgZvpvxqyNYvHcuX/Tzp07+ThMp06dTPb23vj63Llz/+Ib2nhNzjvc9fv9z3E8fHby5IlkXV0Vbdm6lSnsGjPC4P/0iyOy7MWLzXTvvfewJSQ6ceKz1Oho0P/ee+99yKebefWz9uUFjdcDAf+j4XDkzMcff5gsLy+hu+66i10pTh0dV0w9rt20Ib2foAwsJqs9tEwtLa1M3cP8HkXzH330t1R3d0/3G2/89s984SVeVxh87LY+cHCC2xcKhY9/8MGxeDI5Q7t330vl5dX01VfNIk/o40Z5TrDG/1sHXHjOyZOnuQ5bRg0NG/FOOnbsr0m/P9D52muv/oFv+hraZ/CRjN+J59q6u7serqmpOXz8+PGnN23alIdBa1UVsqKfLpy/RFncbDc0bBJfWOyEMDb+xm9kTNdc20eprq6WFbObS5cYnT17RgQsfJ7d5gNV820MPjTnh+75heh+trJyxekrVzoOcbauw6D17rt3cq6oZ7oLsvlbGMCMmO17PFlcNVaIjyHaFxpQIup5jC3RV6At3LZtOxVwh4UAbm1tFjwPqgTbcMD+U9X8VQY/8518ZlU/fjhef/31tzjp/IiprwSzSoz7MGwaHBzhbm5STA/6+vrp+vVrKNOFEHV1dVxjVYlyAHOnwsJ8UZihtkF5gAyLJMU8/3eVKtvVgE3c9mfWBQgBtWa/9NJvXvV68x5jjVZg3DfHl3rRBqKTQjMCpoHfo6pEYRYIdLU1Nf0F38F6eXXyuo6Jm5VtvjMBjNZAO93YuLN+165dP/f58ncy9S5PJhO5mNuofyshGnD0sGgD0UmhGRkYGAxwSfwPFgYlwaBaGmAfYuCpBb5fF8CccG57k9RY8vIqVCdmBRhnwlLqFBnXQOOgwYiajMbVhQCNa7XNov7U4L8UwO7bqsuwHAauTRhWakEz93m2/wgwAI6HK97tLA9uAAAAAElFTkSuQmCC\");\r\n    background-size: 12px 12px;\r\n    background-repeat: no-repeat;\r\n}\r\n\r\n#profile .wrap #accCurrent span.online,\r\n#frame #sidepanel #contacts ul li.contact .wrap span.online,\r\n#frame .content .contact-profile .info-conversation i.online,\r\n#frame .content #group-participant .list-group-part .info-part span.online {\r\n    \r\n    background-image: url(\"data:image/png;base64,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\");\r\n    background-size: 12px 12px;\r\n    background-repeat: no-repeat;\r\n}\r\n\r\n#profile .wrap #accCurrent span.away,\r\n#frame #sidepanel #contacts ul li.contact .wrap span.away,\r\n#frame .content .contact-profile .info-conversation i.away,\r\n#frame .content #group-participant .list-group-part .info-part span.away {\r\n    \r\n    background-image: url(\"data:image/png;base64,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\");\r\n    background-size: 12px 12px;\r\n    background-repeat: no-repeat;\r\n}\r\n\r\n#profile .wrap #accCurrent span.busy,\r\n#frame #sidepanel #contacts ul li.contact .wrap span.busy,\r\n#frame .content .contact-profile .info-conversation i.busy,\r\n#frame .content #group-participant .list-group-part .info-part span.busy {\r\n    \r\n    background-image: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAHpElEQVRoQ81Za2wc1RX+ZnZ212uvH3FiJwYSIKDmSQKkgYRnBYKqIQIKgiBKSKDQIBDtj6ZEUFVAK9T+AFE1EvwqEigtEhJCSLwrFVkIUKmAgAixGuLYcYITO45fu17PzuP2O3fH8S67Hjv2Ot7POvLMvTP3nnPPe9ZQBKYLvqqUDzhZqMyIDOhrGCZUehgqNQgjFoPR2Ax4fM6yYMSrOG8AiRr+M3PrzAAzE0DgZuH+72s4n3xAIdLwO9rgey5lIHPCKFfXQnLMOnsprDUbgLoGxK7cFCwwM0xLAGVn4J84Dvtfr0H19UK5DtRImjNkNEsNCNc/hAxFo9RAQgtmzlsAUDPRFesQXUuhponTFsB+6x+w334VSk5ZmIlEcic9Zg5yPRFkK70dyaewvsfDsGHWzUNk2VpUP/C78XWmiCk/7XUfhvPVf+C1t8GoroVZUw/Don0bEfA8eRJyGiRfTUwyr//4vEl/sOJ6LSMag6JGs63vBrtNHZNqwO/vg9/dicxLf9VmouikBk0h9KRPF2RBNCqKiVywEtHVlyJ+053BZDhCBVB9PRh64mGok70wknXUV+CYswVhxXWhhgaQuGcHzGWrtTBhCDUh95u9VDd5TtJcyLy+5iazRrK+hNraergH9sP96r85oULA94qfcI90wu9sx8juP/MJMi6OeoYhpiqhN37zFiS27iAfpTVfUgP+kcN01gMMObY2G5HxTBMs8TMTXsdBKB2aS6NIA373UaQe/7V2XiPGRbRi5w4qnUJ8yzZYy+kPl18ZjI6jQADni8/gtP4b9rtvjqf8uYZkcXJotpyF5LMvwKxvCCZyKDAht20ffGZWUZ1IJbLNOdEClMeEN5yC6j+ZYzQPpzQgTtN/9Y9hNjTqDFkRpz8GcqhGM6j6xb2I33oHzIWLgok8AUZ2P4/Rl19iyEzKsAxVFBTzQ+ScxUBNDer//kowmmdC/vHjuq4RcbTqKozEIlQqxQjZFXCcg+Gn08pr24/0n56C19WVKxMqFIoFoN/bg8bWj2EuXqLHTHEQr7Mj13CIMbHoqlTShSALSP/Y95p5geF2d6vUzp3w2w/Bp4p0vRMGezQnbLkh+8Zj5Ch8f8kLiQceRM2ux/S94ba3q4Hrb2RZW00VeVrKiaBGRxHb9DOYjfPKK4RJ+x4ZQfbDVv1fd3MTQHiIXrERdXtyjmy4B9tV//rLYTY3ya0enAj+4CCSzz8La+UqZj0nGC0DJHh0d2P4qT+y8mUFELGCiWJIAxRduwZ1b7yu743svm/VwIZrYCyYrwfC4B89imZ7OLgrPwY3/xzO3r1ALB6MlEDWZl+9Bg3vvKmjk+l3HuYoDcejk0xCcGfB9vMgUQZu6b3HSNpuZDJwOzp1sWmKd8uLUyMuMJvg8qX3zSP6ntKC5A7TtFatgO+4WrDJSE0WoaYJYUzg2VnuYxTtW0By4DXVsJaeD6OqiibkelSCyk0y24WRSiRYqb7PJ8sLiTruvm/h9fRCWZGSe4+REgoEFhhO+yF14lqGUYkErDfCijjFyGOdfx7MeQ26QiwPuB9LZjVqs3mhXQtzYTyMZBC/8To0/vNlfc9EdkwN7Po9sp9/ySZmgEY1SfvoMnyWO5EJv5LAohI+w0O5Gh5C/R8eR+1vf6PvTcmAZgvLU9330jlOfeCZgGSTKmbMcpJk4BjX1YKU2DOPxHzyQ77h27YS2+u9ezvcA98FbWSFgpp3j36Pc9MndOUgMOXrsXXO2YituwRe1oGnjMokMduFCxG99JJTzAtOxcXo8h+x+7d5JU5UWn1zSfLlLtI0H7H1hR+6Cpr6Q4svhJmsZcWXFt0EoxUAcig1UOOTT6DuoQcZpMZ5K8hM1pIlMNiy6SaaaqsU8uVzI6NjpLm5gHlBgQCLXtuD5Jbb4PIFn7HZ57NzTZ7P3FSbROyydUjedkvA6TiKP2yx++/afDuybHDm/OsEOfPZH7S88DdUXbwWsQuXBhPjKCpuzKoEoqwzrIXN8DN2SZWeKZIaTSKOMG6d1RJwWIgiDQi8wSE4nZ3o2vpLXZ9I0XSmIe2thPiW5/6C+rvuCEaLUVKAMWQ+/wJd238F5+RJmFxskixfHpAbj8zPv28bEhezcbl7SzBRGkUmlI/YeedSfRfAamqiOY2y2Jvl6MSGyaPNm6x6E7T5OEv9yRCqAYE3nIJ7vAfHnn4G9qEOZOXbUUjPOl1I6I40NGDB/VsRX74MdT+9IZgJR6gGBBGGsDidqOaqjTDpUG7vCfjM2PLTqta3mNV0iO/K78eSYf3MCLyBfi3EgkcfRu1PrpYHpoRJNfBDDLz1Dnp2v0hHH6Q2jlAYBwYrVP3TkJTEkZAzYSWpzVBqfvmEQ7+KNNQjuXEDatasRtMjDwUPTh2nLYBAGhu3rw8Db7+HbPcxsKdAZn8bw54Dh9cllyTTUZbBcWmI4nFUs3iMsYyvWrkC1RetDh46fUxLgHy4DLmp1o/Q+8oeXg8i9elnWhD9u5r00FxelyYcS0pU2bwJ0eYmNO9gTcP2caaYsQBhcIeGtd+YZWB0IsyOADxtffq6y5tdzEwAMqqcICJlR7W55CjomaWOktVFGLmOxVmqsBmRMFyWUAz8HwoW0rhaI1RyAAAAAElFTkSuQmCC\");\r\n    background-size: 12px 12px;\r\n    background-repeat: no-repeat;\r\n}\r\n\r\n#frame #sidepanel #contacts ul li.contact .wrap span.undefined,\r\n#frame .content .contact-profile .info-conversation i.undefined,\r\n#frame .content #group-participant .list-group-part .info-part span.undefined {\r\n    background-image: url(\"data:image/png;base64,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\");\r\n    background-size: 12px 12px;\r\n    background-repeat: no-repeat;\r\n}\r\n\r\n#frame #sidepanel #contacts ul li.contact .wrap img {\r\n    width: 40px;\r\n    border-radius: 50%;\r\n    float: left;\r\n    margin-right: 10px;\r\n}\r\n\r\n#frame #sidepanel #contacts ul li.contact .wrap .meta {\r\n    width: calc(100% - 50px);\r\n    display: block;\r\n    float: left;\r\n}\r\n\r\n#contacts ul li.contact .wrap .name-notify {\r\n    position: relative;\r\n    float: left;\r\n    width: 90%;\r\n}\r\n\r\n#contacts ul li.contact .wrap .meta .name {\r\n    font-weight: 600;\r\n    width: 77%;\r\n    white-space: nowrap;\r\n    overflow: hidden;\r\n    text-overflow: ellipsis;\r\n}\r\n\r\n#contacts ul li.contact .wrap .meta .name-notify .badges-notify {\r\n    height: 15px;\r\n    border-radius: 50%;\r\n    padding: 0px 10px;\r\n    text-align: center;\r\n    margin-left: 0px;\r\n    position: absolute;\r\n    left: 80%;\r\n    bottom: 2pt;\r\n}\r\n\r\n#contacts ul li.active .wrap .meta .name-notify .badges-notify {\r\n    \r\n}\r\n\r\n#frame #sidepanel #contacts ul li.contact .wrap .meta .name-notify .badges-color {\r\n    background: red;\r\n}\r\n\r\n#frame #sidepanel #contacts ul li.active .wrap .meta .name-notify .badges-notify {\r\n    \r\n}\r\n\r\n#frame #sidepanel #contacts ul li.contact .wrap .meta .preview {\r\n    font-weight: 400;\r\n    white-space: nowrap;\r\n    overflow: hidden;\r\n    text-overflow: ellipsis;\r\n    -webkit-transition: 1s all ease;\r\n    transition: 1s all ease;\r\n    clear: both;\r\n}\r\n\r\n#frame #sidepanel #contacts ul li.contact .wrap .meta .preview span {\r\n    position: initial;\r\n    border-radius: initial;\r\n    background: none;\r\n    border: none;\r\n    padding: 0 2px 0 0;\r\n    margin: 0 0 0 1px;\r\n    opacity: .5;\r\n}\r\n\r\n#frame #sidepanel #bottom-bar {\r\n    position: absolute;\r\n    width: 100%;\r\n    bottom: 0;\r\n}\r\n\r\n#frame #sidepanel #bottom-bar button {\r\n    float: left;\r\n    border: none;\r\n    width: 50%;\r\n    padding: 10px 0;\r\n    background: #32465a;\r\n    color: #f5f5f5;\r\n    cursor: pointer;\r\n    font-size: 0.85em;\r\n    font-family: \"proxima-nova\", \"Source Sans Pro\", sans-serif;\r\n}\r\n\r\n#frame #sidepanel #bottom-bar button:focus {\r\n    outline: none;\r\n}\r\n\r\n#frame #sidepanel #bottom-bar button:nth-child(1) {\r\n    border-right: 1px solid #2c3e50;\r\n}\r\n\r\n#frame #sidepanel #bottom-bar button:hover {\r\n    background: #435f7a;\r\n}\r\n\r\n#frame #sidepanel #bottom-bar button i {\r\n    margin-right: 3px;\r\n    font-size: 1em;\r\n}\r\n\r\n#frame .content {\r\n    float: right;\r\n    \r\n    height: 100%;\r\n    \r\n    position: relative;\r\n}\r\n\r\n#frame .content .contact-profile {\r\n    position: relative;\r\n    width: 100%;\r\n    height: 60px;\r\n    line-height: 60px;\r\n    background: #f5f5f5;\r\n    border-top: 1px solid darkgray;\r\n}\r\n\r\n#frame .content .contact-profile .info-conversation-participant {\r\n    float: left;\r\n    width: 60%;\r\n    position: relative;\r\n    margin-top: 12px;\r\n}\r\n\r\n#frame .content .contact-profile img {\r\n    width: 40px;\r\n    border-radius: 50%;\r\n    float: left;\r\n    margin: 9px 12px 0 9px;\r\n    cursor: pointer;\r\n}\r\n\r\n#frame .content .contact-profile .info-participant, #frame .content .contact-profile .info-conversation {\r\n    width: 100%;\r\n}\r\n\r\n#frame .content .contact-profile .info-participant .star {\r\n    visibility: hidden;\r\n    font-size: 30px;\r\n    cursor: pointer;\r\n    margin: 0;\r\n    padding: 0;\r\n    line-height: 16px;\r\n    color: tomato;\r\n}\r\n\r\n#frame .content .contact-profile .info-participant .star:before {\r\n    content: \"\\2605\";\r\n    position: absolute;\r\n    visibility: visible;\r\n}\r\n\r\n#frame .content .contact-profile .info-participant .star:checked:before {\r\n    content: \"\\2606\";\r\n    position: absolute;\r\n    color: #eca70c\r\n}\r\n\r\n#frame .content .contact-profile .info-participant {\r\n    line-height: normal;\r\n    line-height: 0px;\r\n    display: block;\r\n}\r\n\r\n#frame .content .contact-profile .info-participant .favorite-participant {\r\n    float: left;\r\n    width: 25px;\r\n    margin-right: 5px;\r\n}\r\n\r\n#frame .content .contact-profile .info-conversation .favorite-conversation {\r\n    position: absolute;\r\n    top: 25px;\r\n    margin-left: 4px;\r\n}\r\n\r\n#frame .content .contact-profile .info-conversation i.favorite-conversation {\r\n    margin: -2px 0 0 6px !important;\r\n    color: saddlebrown;\r\n    font-size: 16px;\r\n}\r\n\r\n#frame .content .contact-profile .info-conversation span.status-name {\r\n    text-transform: capitalize;\r\n}\r\n\r\n#frame .content .contact-profile p {\r\n    line-height: initial;\r\n    font-size: 130%;\r\n    margin-left: 32px;\r\n    left: 25px;\r\n    margin-bottom: inherit;\r\n    white-space: nowrap;\r\n}\r\n\r\n#frame .content .contact-profile .info-participant p {\r\n    overflow: hidden;\r\n    width: calc(100% - 35px);\r\n    text-overflow: ellipsis;\r\n}\r\n\r\n#frame .content .contact-profile .cursor {\r\n    cursor: pointer;\r\n    height: 24px;\r\n}\r\n\r\n#frame .content .contact-profile .info-conversation {\r\n    position: unset;\r\n    left: 60px;\r\n    font-size: small;\r\n    line-height: normal;\r\n}\r\n\r\n#frame .content .contact-profile .info-conversation span {\r\n    display: block;\r\n    float: left;\r\n    line-height: normal;\r\n}\r\n\r\n#frame .content .contact-profile .info-conversation span:first-of-type, #frame .content .contact-profile .info-conversation a {\r\n    color: #0c0d0e;\r\n    white-space: nowrap;\r\n    margin-left: 25px;\r\n}\r\n\r\n#frame .content .contact-profile .info-conversation .info-group {\r\n    \r\n    padding: 0;\r\n    display: -webkit-inline-box;\r\n    display: -ms-inline-flexbox;\r\n    display: inline-flex;\r\n    margin: 3px 0px 0px 7px;\r\n    overflow: hidden;\r\n    width: calc(100% - 35px);\r\n    text-overflow: ellipsis;\r\n}\r\n\r\n#frame .content .contact-profile .info-conversation span.status-space {\r\n    margin: 0 5px;\r\n}\r\n\r\n#frame .content .contact-profile .info-conversation a:hover {\r\n    text-decoration: none;\r\n}\r\n\r\n#frame .content .contact-profile .social-media {\r\n    float: right;\r\n}\r\n\r\n#frame .content .contact-profile .social-media i {\r\n    margin-left: 14px;\r\n    cursor: pointer;\r\n    font-size: 20px;\r\n}\r\n\r\n#frame .content .contact-profile .social-media i:nth-last-child(1) {\r\n    margin-right: 20px;\r\n}\r\n\r\n#frame .content .contact-profile .social-media i:hover {\r\n    color: #435f7a;\r\n}\r\n\r\n#frame .content .contact-profile .social-media .plus-user {\r\n    background-image: url(\"data:image/png;base64,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\");\r\n    background-size: 19px 19px;\r\n    background-repeat: round;\r\n    width: 19px;\r\n    height: 19px;\r\n}\r\n\r\n#frame .content .contact-profile .social-media .plus-group {\r\n    background-image: url(data:image/png;base64,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);\r\n    background-size: 19px 19px;\r\n    background-repeat: round;\r\n    width: 19px;\r\n    height: 19px;\r\n}\r\n\r\n#frame .content #group-participant {\r\n    background: white;\r\n    \r\n    \r\n    border-bottom: 1px solid brown;\r\n    border-top: 1px solid brown;\r\n    position: absolute;\r\n    width: 100%;\r\n    overflow-y: scroll;\r\n    overflow-x: hidden;\r\n}\r\n\r\n#frame .content #group-participant .list-group-part {\r\n    \r\n    display: block;\r\n    width: 100%;\r\n    padding: 5px 10px 0px 10px;\r\n    float: left;\r\n    max-height: 100px;\r\n}\r\n\r\n#frame .content #group-participant .list-group-part .info-part {\r\n    margin-left: 6px;\r\n}\r\n\r\n#frame .content #group-participant .list-group-part .info-part:first-child {\r\n    \r\n}\r\n\r\n#frame .content #group-participant .list-group-part .show-info-participants {\r\n    border: 1px solid aquamarine;\r\n    background: aquamarine;\r\n    border-radius: 9px 10px;\r\n    padding: 2px 13px 2px 11px;\r\n    font-weight: 500;\r\n    display: block;\r\n    float: left;\r\n    margin-bottom: 5px;\r\n}\r\n\r\n#frame .content #group-participant .list-group-part .check-participant {\r\n    background: #077db4 !important;\r\n    color: white;\r\n    border: 1px solid #077db4;\r\n}\r\n\r\n#frame .content #group-participant .list-group-part li {\r\n    padding: 0px 17px 0 11px;\r\n    list-style: none;\r\n    position: relative;\r\n    cursor: pointer;\r\n}\r\n\r\n#profile .wrap #accCurrent .btn-status-use,\r\n#frame .content .contact-profile .info-conversation .favorite-conversation,\r\n#frame .content #group-participant .list-group-part .status-info-part {\r\n    width: 15px;\r\n    height: 15px;\r\n    border-radius: 50%;\r\n    background-size: 15px 15px !important;\r\n    display: block;\r\n}\r\n\r\n#frame .content #group-participant .list-group-part .info-part .stype-list {\r\n    position: absolute;\r\n    left: 0px;\r\n    margin-left: 3px;\r\n}\r\n\r\n#frame .content #group-participant .list-group-part .info-part span.status-info-name {\r\n    margin-left: 12px;\r\n}\r\n\r\n#frame .content .messages {\r\n    height: auto;\r\n    \r\n    \r\n    overflow-y: scroll;\r\n    overflow-x: hidden;\r\n    width: 100%;\r\n}\r\n\r\n#frame .content .messages::-webkit-scrollbar {\r\n    width: 8px;\r\n    background: transparent;\r\n}\r\n\r\n#frame .content .messages::-webkit-scrollbar-thumb {\r\n    background-color: rgba(0, 0, 0, 0.3);\r\n}\r\n\r\n#frame .content .messages ul li {\r\n    \r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    clear: both;\r\n    float: left;\r\n    margin: 15px 15px 5px 15px;\r\n    width: calc(100% - 25px);\r\n    font-size: 0.9em;\r\n}\r\n\r\n#frame .content .messages ul li:nth-last-child(1) {\r\n    margin-bottom: 20px;\r\n}\r\n\r\n#frame .content .messages ul li.sent img {\r\n    \r\n}\r\n\r\n#frame .content .messages ul li.sent p {\r\n    background: #435f7a;\r\n    color: #f5f5f5;\r\n    margin: 0;\r\n    clear: inherit;\r\n    word-wrap: break-word;\r\n    word-break: break-all;\r\n}\r\n\r\n#frame .content .messages ul {\r\n    margin: 0;\r\n}\r\n\r\n#frame .content .messages ul li.replies img {\r\n    float: right;\r\n    margin: 6px 0 0 8px;\r\n}\r\n\r\n#frame .content .messages ul li.replies p {\r\n    background: #f5f5f5;\r\n    float: right;\r\n    clear: unset;\r\n    margin: 0;\r\n    word-wrap: break-word;\r\n    word-break: break-all;\r\n}\r\n\r\n#frame .content .messages ul li img {\r\n    width: 33px;\r\n    border-radius: 50%;\r\n    float: left;\r\n}\r\n\r\n#frame .content .messages ul li p {\r\n    display: inline-block;\r\n    padding: 10px 15px;\r\n    border-radius: 20px;\r\n    max-width: 72%;\r\n    line-height: 130%;\r\n}\r\n\r\n#frame .content .message-input {\r\n    position: absolute;\r\n    bottom: 0;\r\n    width: 100%;\r\n    z-index: 99;\r\n    border-top: 1px solid brown;\r\n    background: whitesmoke;\r\n    border-bottom: 1px solid darkgray;\r\n    display: block;\r\n}\r\n\r\n#frame .content .message-input .wrap {\r\n    position: relative;\r\n    \r\n    display: block;\r\n}\r\n\r\n#frame .content .message-input .wrap .box_msg {\r\n    font-family: \"proxima-nova\", \"Source Sans Pro\", sans-serif;\r\n    float: left;\r\n    border: none;\r\n    display: block;\r\n    width: 82%;\r\n    font-size: 1em;\r\n    resize: none;\r\n    color: #32465a;\r\n    margin: 5px 0px 5px 15px;\r\n    padding: 9px 113px 9px 3px;\r\n    overflow-y: scroll;\r\n    overflow-x: hidden;\r\n    word-wrap: break-word;\r\n    -webkit-box-shadow: none;\r\n    box-shadow: none;\r\n}\r\n\r\n#frame .content .message-input .wrap .box_msg:focus {\r\n    outline: none;\r\n}\r\n\r\n#frame .content .message-input .wrap .attachment {\r\n    position: absolute;\r\n    right: 60px;\r\n    z-index: 4;\r\n    margin-top: 14px;\r\n    font-size: 1.1em;\r\n    color: #435f7a;\r\n    opacity: .5;\r\n    cursor: pointer;\r\n}\r\n\r\n#frame .content .message-input .wrap .attachment:hover {\r\n    opacity: 1;\r\n}\r\n\r\n#frame .content .message-input .wrap .sms-send {\r\n    float: right;\r\n    border: none;\r\n    width: 33px;\r\n    height: 33px;\r\n    cursor: pointer;\r\n    background: #32465a;\r\n    color: #f5f5f5;\r\n    border-radius: 50%;\r\n    margin-right: 14px;\r\n}\r\n\r\n#frame .content .message-input .wrap .sms-send:hover {\r\n    background: #435f7a;\r\n}\r\n\r\n#frame .content .message-input .wrap .sms-send:focus {\r\n    outline: none;\r\n}\r\n\r\n\r\n\r\n.list-contact {\r\n    position: relative;\r\n    width: 290px;\r\n    display: block;\r\n    z-index: 999;\r\n    border: 1px solid;\r\n    background: #cdcdde;\r\n    font-size: 12px;\r\n    padding: 5px;\r\n}\r\n\r\n.search-results-contacts {\r\n    display: inline-block;\r\n    float: left;\r\n    width: 100%;\r\n}\r\n\r\n.search-contacts {\r\n    display: block;\r\n    float: left;\r\n    width: 100%;\r\n    margin: 0 !important;\r\n}\r\n\r\n.search-contacts .search-single {\r\n    width: calc(100% - 26px);\r\n    padding: 5px 12px;\r\n    margin: 0;\r\n}\r\n\r\n.box-action-friend {\r\n    width: calc(100% - 6px);\r\n    background: #f2f3ec;\r\n    display: inline-block;\r\n    padding: 4px 3px;\r\n    border-radius: 5px;\r\n    float: left;\r\n    min-height: 35px;\r\n    max-height: 60px;\r\n    overflow-y: scroll;\r\n    margin-bottom: 1px;\r\n}\r\n\r\n.name-contact {\r\n    width: auto;\r\n    float: left;\r\n    margin: 5px 6px 6px 0;\r\n    position: relative;\r\n}\r\n\r\nspan.name-act {\r\n    background: #00aeef;\r\n    padding: 3px 18px 3px 4px;\r\n    border: 1px solid #41849c;\r\n    color: white;\r\n    font-weight: 500;\r\n    border-radius: 12px;\r\n}\r\n\r\n.name-contact .act-aptach {\r\n    position: absolute;\r\n    right: 4px;\r\n    top: 2px;\r\n    cursor: pointer;\r\n    color: snow;\r\n}\r\n\r\nul li.contact-list:hover {\r\n    background: #b0c5da;\r\n    color: white;\r\n}\r\n\r\n.data-contact {\r\n    overflow-y: scroll;\r\n    background: lavender;\r\n    padding: 5px 7px;\r\n    height: 130px;\r\n}\r\n\r\nli.contact-list {\r\n    width: 100%;\r\n    float: left;\r\n    z-index: 9999;\r\n    overflow: visible;\r\n    margin: 2px 0;\r\n    padding: 3px 0;\r\n    display: block;\r\n}\r\n\r\n.wap-contact .meta-contact p {\r\n    white-space: nowrap;\r\n    width: 77%;\r\n    text-overflow: ellipsis;\r\n    word-wrap: break-word;\r\n    overflow: hidden;\r\n    word-spacing: normal;\r\n}\r\n\r\n.wap-contact img {\r\n    width: 27px;\r\n    float: left;\r\n    display: inline;\r\n    margin-right: 10px;\r\n    border-radius: 50%;\r\n    border: 1px solid darkorange;\r\n}\r\n\r\n.action-friend {\r\n    margin-top: 7px;\r\n    text-align: right;\r\n}\r\n\r\n.action-friend .btn {\r\n    margin-right: 2px;\r\n}\r\n\r\n.action-friend .btn:last-child {\r\n    margin-right: 0px;\r\n}\r\n\r\n#contacts .not-found {\r\n    color: #90e358;\r\n    text-align: justify;\r\n    font-style: italic;\r\n}\r\n\r\n\r\n\r\n@media screen and (max-width: 360px) {\r\n    #frame {\r\n        width: 100%;\r\n        height: 100vh;\r\n    }\r\n}\r\n\r\n@media screen and (min-width: 735px) {\r\n    #frame .content .messages ul li p {\r\n        max-width: 72%;\r\n    }\r\n\r\n    #frame .content .contact-profile .info-conversation-participant {\r\n        width: 65%;\r\n    }\r\n}\r\n\r\n@media screen and (min-width: 768px) {\r\n    .container {\r\n        width: 800px;\r\n    }\r\n\r\n    #contacts ul li.contact .wrap .name-notify {\r\n        width: 95%;\r\n    }\r\n}\r\n\r\n@media screen and (min-width: 900px) {\r\n    #frame .content {\r\n        width: calc(100% - 340px);\r\n    }\r\n}\r\n\r\n@media (min-width: 992px) {\r\n    .container {\r\n        width: 970px;\r\n    }\r\n\r\n    #contacts ul li.contact .wrap .name-notify {\r\n        width: 100%;\r\n    }\r\n}\r\n\r\n@media (min-width: 1200px) {\r\n    .container {\r\n        width: 1170px;\r\n    }\r\n}\r\n\r\n@media screen and (min-width: 735px) and (max-width: 992px) {\r\n    #frame .content .contact-profile .info-conversation-participant {\r\n        width: 58%;\r\n    }\r\n\r\n}\r\n\r\n@media screen and (max-width: 735px) {\r\n\r\n    #frame #sidepanel {\r\n        width: 58px;\r\n        min-width: 58px;\r\n    }\r\n\r\n    #frame #sidepanel #profile {\r\n        width: 100%;\r\n        margin: 0 auto;\r\n        padding: 5px 0 0 0;\r\n        background: #32465a;\r\n    }\r\n\r\n    #frame #sidepanel #profile .wrap {\r\n        height: 65px;\r\n    }\r\n\r\n    #frame .content .contact-profile {\r\n        height: 70px !important;\r\n    }\r\n\r\n    #frame #sidepanel #profile .wrap img {\r\n        width: 52px !important;\r\n    }\r\n\r\n    #frame #sidepanel #profile .wrap img {\r\n        width: 40px;\r\n        margin-left: 4px;\r\n    }\r\n\r\n    #frame #sidepanel #profile .wrap p {\r\n        display: none;\r\n    }\r\n\r\n    #profile .wrap #accCurrent .btn-status-use {\r\n        margin: 38px 0 0 38px;\r\n    }\r\n\r\n    #frame #sidepanel #profile .wrap i.expand-button {\r\n        display: none;\r\n    }\r\n\r\n    #frame #sidepanel #profile .wrap #status-options {\r\n        width: 58px;\r\n        margin-top: 57px;\r\n    }\r\n\r\n    #frame #sidepanel #profile .wrap #status-options.active {\r\n        margin-top: 62px;\r\n    }\r\n\r\n    #frame #sidepanel #profile .wrap #status-options:before {\r\n        margin-left: 23px;\r\n    }\r\n\r\n    #frame #sidepanel #profile .wrap #status-options ul li {\r\n        padding: 15px 0 35px 22px;\r\n    }\r\n\r\n    #frame #sidepanel #profile .wrap #status-options ul li span.status-circle {\r\n        width: 14px;\r\n        height: 14px;\r\n    }\r\n\r\n    #frame #sidepanel #profile .wrap #status-options ul li span.status-circle:before {\r\n        height: 18px;\r\n        width: 18px;\r\n    }\r\n\r\n    #frame #sidepanel #profile .wrap #status-options ul li p {\r\n        display: none;\r\n    }\r\n\r\n    #frame #sidepanel #box-search-contacts {\r\n        display: none;\r\n    }\r\n\r\n    #frame #sidepanel #contacts {\r\n        height: calc(100% - 149px);\r\n        overflow-y: scroll;\r\n        overflow-x: hidden;\r\n    }\r\n\r\n    #frame #sidepanel #contacts::-webkit-scrollbar {\r\n        display: none;\r\n    }\r\n\r\n    #frame #sidepanel #contacts ul li.contact {\r\n        padding: 6px 0 9px 8px;\r\n    }\r\n\r\n    #frame #sidepanel #contacts ul li.contact .wrap {\r\n        width: 100%;\r\n    }\r\n\r\n    #frame #sidepanel #contacts ul li.contact .wrap img {\r\n        margin-right: 0px;\r\n    }\r\n\r\n    #frame #sidepanel #contacts ul li.contact .wrap .meta {\r\n        display: none;\r\n    }\r\n\r\n    #frame #sidepanel #bottom-bar button {\r\n        float: none;\r\n        width: 100%;\r\n        padding: 15px 0;\r\n    }\r\n\r\n    #frame #sidepanel #bottom-bar button:nth-child(1) {\r\n        border-right: none;\r\n        border-bottom: 1px solid #2c3e50;\r\n    }\r\n\r\n    #frame #sidepanel #bottom-bar button i {\r\n        font-size: 1.3em;\r\n    }\r\n\r\n    #frame #sidepanel #bottom-bar button span {\r\n        display: none;\r\n    }\r\n\r\n    #frame .content {\r\n        width: calc(100% - 58px);\r\n        min-width: 300px !important;\r\n    }\r\n\r\n    #frame .content .messages {\r\n        max-height: calc(100% - 105px);\r\n    }\r\n\r\n    #frame .content .message-input .wrap .box_msg {\r\n        width: 87%;\r\n    }\r\n\r\n    #frame .content .message-input .wrap .attachment {\r\n        margin-top: 17px;\r\n        right: 65px;\r\n    }\r\n\r\n    #frame .content .message-input .wrap .sms-send {\r\n        \r\n    }\r\n}\r\n\r\n@media screen and (max-width: 1200px) {\r\n    #frame .content .contact-profile .social-media i {\r\n        margin-left: 2px;\r\n    }\r\n}\r\n\r\n"];



/***/ }),

/***/ "./src/app/components/contents/chat/chat.component.ngfactory.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export RenderType_ChatComponent */
/* unused harmony export View_ChatComponent_0 */
/* unused harmony export View_ChatComponent_Host_0 */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ChatComponentNgFactory; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__chat_component_css_ngstyle__ = __webpack_require__("./src/app/components/contents/chat/chat.component.css.ngstyle.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__pipes_pipes_keys_pipe__ = __webpack_require__("./src/app/pipes/pipes-keys.pipe.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_common__ = __webpack_require__("./node_modules/@angular/common/esm5/common.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__chat_component__ = __webpack_require__("./src/app/components/contents/chat/chat.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__services_api_chat_service__ = __webpack_require__("./src/app/components/services/api-chat.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__angular_router__ = __webpack_require__("./node_modules/@angular/router/esm5/router.js");
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes}
 * tslint:disable
 */ 







var styles_ChatComponent = [__WEBPACK_IMPORTED_MODULE_0__chat_component_css_ngstyle__["a" /* styles */]];
var RenderType_ChatComponent = __WEBPACK_IMPORTED_MODULE_1__angular_core__["_11" /* ɵcrt */]({ encapsulation: 2, styles: styles_ChatComponent, data: {} });

function View_ChatComponent_1(_l) { return __WEBPACK_IMPORTED_MODULE_1__angular_core__["_31" /* ɵvid */](0, [(_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](0, 0, null, null, 1, "div", [], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](1, null, ["", ""]))], null, function (_ck, _v) { var _co = _v.component; var currVal_0 = _co.messageError; _ck(_v, 1, 0, currVal_0); }); }
function View_ChatComponent_2(_l) { return __WEBPACK_IMPORTED_MODULE_1__angular_core__["_31" /* ɵvid */](0, [(_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](0, 0, null, null, 5, "li", [], [[8, "id", 0], [1, "status", 0], [1, "data-value", 0], [8, "className", 0]], [[null, "click"]], function (_v, en, $event) { var ad = true; var _co = _v.component; if (("click" === en)) {
        var pd_0 = (_co.ngClickChangeStatusUser($event, _v.context.$implicit.key) !== false);
        ad = (pd_0 && ad);
    } return ad; }, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](2, 0, null, null, 0, "span", [["class", "status-circle"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](4, 0, null, null, 1, "p", [], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](5, null, ["", ""]))], null, function (_ck, _v) { var _co = _v.component; var currVal_0 = __WEBPACK_IMPORTED_MODULE_1__angular_core__["_16" /* ɵinlineInterpolate */](1, "status-", _v.context.$implicit.value, ""); var currVal_1 = _v.context.$implicit.value; var currVal_2 = _v.context.$implicit.key; var currVal_3 = __WEBPACK_IMPORTED_MODULE_1__angular_core__["_16" /* ɵinlineInterpolate */](1, "channel-status", ((_v.context.$implicit.value == _co.resultData.status) ? " active" : ""), ""); _ck(_v, 0, 0, currVal_0, currVal_1, currVal_2, currVal_3); var currVal_4 = _v.context.$implicit.value; _ck(_v, 5, 0, currVal_4); }); }
function View_ChatComponent_0(_l) { return __WEBPACK_IMPORTED_MODULE_1__angular_core__["_31" /* ɵvid */](0, [__WEBPACK_IMPORTED_MODULE_1__angular_core__["_25" /* ɵpid */](0, __WEBPACK_IMPORTED_MODULE_2__pipes_pipes_keys_pipe__["a" /* KeysPipe */], []), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_8" /* ɵand */](16777216, null, null, 1, null, View_ChatComponent_1)), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_12" /* ɵdid */](2, 16384, null, 0, __WEBPACK_IMPORTED_MODULE_3__angular_common__["i" /* NgIf */], [__WEBPACK_IMPORTED_MODULE_1__angular_core__["X" /* ViewContainerRef */], __WEBPACK_IMPORTED_MODULE_1__angular_core__["U" /* TemplateRef */]], { ngIf: [0, "ngIf"] }, null), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](5, 0, null, null, 2, "div", [["id", "question-header"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n\n"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](9, 0, null, null, 87, "div", [["id", "frame"]], null, [["window", "resize"]], function (_v, en, $event) { var ad = true; var _co = _v.component; if (("window:resize" === en)) {
        var pd_0 = (_co.onResize() !== false);
        ad = (pd_0 && ad);
    } return ad; }, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](11, 0, null, null, 82, "div", [["id", "sidepanel"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](13, 0, null, null, 50, "div", [["id", "profile"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](15, 0, null, null, 47, "div", [["class", "wrap"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](17, 0, null, null, 5, "div", [["class", "aboutCurrent"], ["id", "accCurrent"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](19, 0, null, null, 0, "span", [["id", "user-status-current"], ["title", "Change status"]], [[8, "className", 0]], null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](21, 0, null, null, 0, "img", [["alt", "your profile"], ["id", "profile-img"], ["title", "your profile"]], [[1, "user-code-id", 0], [8, "src", 4], [8, "className", 0]], null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](24, 0, null, null, 7, "div", [["class", "info-current"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](26, 0, null, null, 1, "p", [["class", "user-name-chat"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](27, null, ["", ""])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](29, 0, null, null, 1, "span", [["class", "mood-msg-current"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](30, null, ["", ""])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](33, 0, null, null, 0, "i", [["aria-hidden", "true"], ["class", "fa fa-chevron-down expand-button"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](35, 0, null, null, 8, "div", [["id", "status-options"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](37, 0, null, null, 5, "ul", [], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_8" /* ɵand */](16777216, null, null, 2, null, View_ChatComponent_2)), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_12" /* ɵdid */](40, 802816, null, 0, __WEBPACK_IMPORTED_MODULE_3__angular_common__["h" /* NgForOf */], [__WEBPACK_IMPORTED_MODULE_1__angular_core__["X" /* ViewContainerRef */], __WEBPACK_IMPORTED_MODULE_1__angular_core__["U" /* TemplateRef */], __WEBPACK_IMPORTED_MODULE_1__angular_core__["y" /* IterableDiffers */]], { ngForOf: [0, "ngForOf"] }, null), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_26" /* ɵppd */](41, 1), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](45, 0, null, null, 16, "div", [["id", "expanded"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](47, 0, null, null, 1, "label", [["for", "fa-facebook"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](48, 0, null, null, 0, "i", [["aria-hidden", "true"], ["class", "fa fa-facebook fa-fw"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](50, 0, null, null, 0, "input", [["id", "fa-facebook"], ["name", "twitter"], ["type", "text"], ["value", "mikeross"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](52, 0, null, null, 1, "label", [["for", "fa-twitter"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](53, 0, null, null, 0, "i", [["aria-hidden", "true"], ["class", "fa fa-twitter fa-fw"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](55, 0, null, null, 0, "input", [["id", "fa-twitter"], ["name", "twitter"], ["type", "text"], ["value", "ross81"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](57, 0, null, null, 1, "label", [["for", "fa-instagram"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](58, 0, null, null, 0, "i", [["aria-hidden", "true"], ["class", "fa fa-instagram fa-fw"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](60, 0, null, null, 0, "input", [["id", "fa-instagram"], ["name", "twitter"], ["type", "text"], ["value", "mike.ross"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](65, 0, null, null, 6, "div", [["id", "box-search-contacts"]], [[1, "data-url", 0]], null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](67, 0, null, null, 1, "label", [["for", "search-contact"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](68, 0, null, null, 0, "i", [["aria-hidden", "true"], ["class", "fa fa-search"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](70, 0, null, null, 0, "input", [["id", "search-contact"], ["maxlength", "40"], ["placeholder", "Search contacts..."], ["type", "text"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](73, 0, null, null, 3, "div", [["id", "contacts"]], [[1, "data-url", 0]], null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](75, 0, null, null, 0, "ul", [["id", "contacts-your"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](78, 0, null, null, 14, "div", [["id", "bottom-bar"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](80, 0, null, null, 5, "button", [["id", "addcontact"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](81, 0, null, null, 0, "i", [["aria-hidden", "true"], ["class", "fa fa-user-plus fa-fw"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](83, 0, null, null, 1, "span", [], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["Add contact"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](87, 0, null, null, 4, "button", [["id", "settings"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](88, 0, null, null, 0, "i", [["aria-hidden", "true"], ["class", "fa fa-cog fa-fw"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, [" "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](90, 0, null, null, 1, "span", [], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["Settings"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n\n    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](95, 0, null, null, 0, "div", [["class", "content"], ["id", "content-chat"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n\n"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](98, 0, null, null, 25, "nav", [["class", "context-menu"], ["id", "context-menu"], ["style", "display: none"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](100, 0, null, null, 22, "ul", [["class", "context-menu__items"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](102, 0, null, null, 5, "li", [["class", "context-menu__item"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](104, 0, null, null, 2, "a", [["class", "context-menu__link"], ["data-action", "view"], ["href", "#"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](105, 0, null, null, 0, "i", [["class", "fa fa-eye"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["Show profile"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](109, 0, null, null, 5, "li", [["class", "context-menu__item"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](111, 0, null, null, 2, "a", [["class", "context-menu__link"], ["data-action", "edit"], ["href", "#"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](112, 0, null, null, 0, "i", [["class", "fa fa-edit"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, [" Edit Task"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](116, 0, null, null, 5, "li", [["class", "context-menu__item"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](118, 0, null, null, 2, "a", [["class", "context-menu__link"], ["data-action", "delete"], ["href", "#"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](119, 0, null, null, 0, "i", [["class", "fa fa-times"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, [" Delete Task"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n\n"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](125, 0, null, null, 9, "div", [["class", "modal fade"], ["id", "myModalParticipant"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](127, 0, null, null, 6, "div", [["class", "modal-dialog"], ["id", "modal-box-profile"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](129, 0, null, null, 3, "div", [["class", "modal-content"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](131, 0, null, null, 0, "div", [["class", "modal-show-info"], ["id", "html-profile-participants"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n"]))], function (_ck, _v) { var _co = _v.component; var currVal_0 = _co.messageError; _ck(_v, 2, 0, currVal_0); var currVal_7 = __WEBPACK_IMPORTED_MODULE_1__angular_core__["_30" /* ɵunv */](_v, 40, 0, _ck(_v, 41, 0, __WEBPACK_IMPORTED_MODULE_1__angular_core__["_23" /* ɵnov */](_v, 0), _co.resultData.listStatus)); _ck(_v, 40, 0, currVal_7); }, function (_ck, _v) { var _co = _v.component; var currVal_1 = __WEBPACK_IMPORTED_MODULE_1__angular_core__["_16" /* ɵinlineInterpolate */](1, "btn-status-use ", _co.resultData.classStatusCurrent, ""); _ck(_v, 19, 0, currVal_1); var currVal_2 = _co.resultData.userID; var currVal_3 = __WEBPACK_IMPORTED_MODULE_1__angular_core__["_16" /* ɵinlineInterpolate */](1, "", (_co.resultData.pathImgCurrent ? _co.resultData.pathImgCurrent : ""), ""); var currVal_4 = __WEBPACK_IMPORTED_MODULE_1__angular_core__["_16" /* ɵinlineInterpolate */](1, "", _co.resultData.classStatusCurrent, ""); _ck(_v, 21, 0, currVal_2, currVal_3, currVal_4); var currVal_5 = _co.resultData.userName; _ck(_v, 27, 0, currVal_5); var currVal_6 = _co.resultData.moodMessage; _ck(_v, 30, 0, currVal_6); var currVal_8 = _co.resultData.urlListContact; _ck(_v, 65, 0, currVal_8); var currVal_9 = _co.resultData.urlChangeContent; _ck(_v, 73, 0, currVal_9); }); }
function View_ChatComponent_Host_0(_l) { return __WEBPACK_IMPORTED_MODULE_1__angular_core__["_31" /* ɵvid */](0, [(_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](0, 0, null, null, 1, "app-contents-chat", [], null, null, null, View_ChatComponent_0, RenderType_ChatComponent)), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_12" /* ɵdid */](1, 245760, null, 0, __WEBPACK_IMPORTED_MODULE_4__chat_component__["a" /* ChatComponent */], [__WEBPACK_IMPORTED_MODULE_5__services_api_chat_service__["a" /* ApiServiceChat */], __WEBPACK_IMPORTED_MODULE_6__angular_router__["k" /* Router */]], null, null)], function (_ck, _v) { _ck(_v, 1, 0); }, null); }
var ChatComponentNgFactory = __WEBPACK_IMPORTED_MODULE_1__angular_core__["_9" /* ɵccf */]("app-contents-chat", __WEBPACK_IMPORTED_MODULE_4__chat_component__["a" /* ChatComponent */], View_ChatComponent_Host_0, {}, {}, []);



/***/ }),

/***/ "./src/app/components/contents/chat/chat.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ChatComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_router__ = __webpack_require__("./node_modules/@angular/router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__services_api_chat_service__ = __webpack_require__("./src/app/components/services/api-chat.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_socket_io_client__ = __webpack_require__("./node_modules/socket.io-client/lib/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_socket_io_client___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_socket_io_client__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__common_libSupports__ = __webpack_require__("./src/app/common/libSupports.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__common_chat_supports_ListContacts__ = __webpack_require__("./src/app/common/chat/supports/ListContacts.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__common_chat_sokets_SendChatMessage__ = __webpack_require__("./src/app/common/chat/sokets/SendChatMessage.ts");

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();






var ChatComponent = /** @class */ (function (_super) {
    __extends(ChatComponent, _super);
    function ChatComponent(apiServiceChat, router) {
        var _this = _super.call(this) || this;
        _this.apiServiceChat = apiServiceChat;
        _this.router = router;
        _this.resultData = {};
        _this.text = '';
        _this.url = _this.urlSide();
        return _this;
    }
    ChatComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.remainTimeDefault = (0.3 * 60 * 1000);
        this.remainTimeSearch = (1 * 60 * 1000);
        this.sendChatMessage = new __WEBPACK_IMPORTED_MODULE_5__common_chat_sokets_SendChatMessage__["a" /* SendChatMessage */]();
        this.loadCss([
            // 'css/chat/chat.custom.css',
            'css/chat/chat.test.css',
            "css/fix-bst2-to-bst3-angular5.css",
            "css/chat/jquery.emojipicker.css",
            "css/chat/jquery.emojipicker.tw.css",
        ]);
        this.appendMyScript([
            //     // 'js/common.js',
            //     // "js/support/menu-info-chat.js",
            //     // "js/support/libCommonChat.js",
            //     // "js/support/listContacts.js",
            //     // 'js/socket/client.js',
            'js/socket/chat.js',
            'js/socket/jquery.emojipicker.js',
            'js/socket/jquery.emojis.js'
        ]);
        var self = this;
        var rsData = this.apiServiceChat
            .getIndexChat()
            .subscribe(function (resp) {
            if (resp.err == '' && resp.code == null) {
                _this.resultData = resp.data;
                var dataFriend = resp.data.listStatus;
                var resultListContacts = JSON.parse(resp.data.dataContactList);
                var listContact = new __WEBPACK_IMPORTED_MODULE_4__common_chat_supports_ListContacts__["a" /* ListContacts */]();
                listContact.showContactListAll(resultListContacts);
                var socket = __WEBPACK_IMPORTED_MODULE_2_socket_io_client__(_this.url);
                _this.socket = socket;
                window.dataGlobal = {
                    urlAction: {
                        urlListContact: _this.resultData.urlListContact,
                        urlChangeContent: _this.resultData.urlChangeContent
                    }
                };
                var optionInit = {
                    remainTimeDefault: _this.remainTimeDefault,
                    remainTimeSearch: _this.remainTimeSearch,
                    listContacts: resultListContacts.contactList,
                    urlAction: window.dataGlobal.urlAction
                };
                _this.sendChatMessage.runInitChatMessage(optionInit, socket);
                _this.sendChatMessage.clickListContactContentChat(socket, function (resultCallback) {
                });
                socket.on('expiresTime60', function (str) {
                    console.log('-----------------------', str);
                });
                socket.on('message', function (message) {
                    $('#showmsg').text('The server has a message for you: ' + message);
                });
                _this.reload(socket);
                _this.sendDataPrivate(socket);
                _this.sendDataBroadCast(socket);
                _this.listUserConversation(socket);
                _this.createConversationGroup(socket);
                _this.sendDataTest(socket);
                _this.msgContent(socket);
                _this.eventSocketAntiSpam();
                //C1 CLICK-STRATUS - bo click in template chat
                // this.sendChatMessage.eventChangeStatusUser(socket);
            }
        }, function (err) {
            _this.error = err;
            console.log(_this.error);
            if (err.error.hasOwnProperty('url')) {
                window.location.href = err.error.url;
            }
            else {
                // this.router.navigate([`error/${err.status}`]);
                // window.location.href = `error/${err.status}`;
                self.messageError = JSON.stringify(err);
            }
        });
    };
    //C2 CLICK-STRATUS -
    ChatComponent.prototype.ngClickChangeStatusUser = function (event, elem) {
        this.sendChatMessage.eventChangeStatusUser(this.socket);
    };
    ;
    ChatComponent.prototype.onResize = function () {
        this.sendChatMessage.getDefaultHeightMsgBox();
        // let libcCommonChat = new LibCommonChat();
        // $("#frameListMsg").animate({scrollTop: libcCommonChat.getMinHeightFrameListMsg()}, 500);
        // scroll box chat content
        this.sendChatMessage.scrollContentChat();
        this.sendChatMessage.eventPositionEmoji(true);
    };
    ;
    ChatComponent.prototype.keys = function (obj) {
        return obj ? Object.keys(obj) : null;
    };
    ;
    ChatComponent.prototype.reload = function (socket) {
        var that = this;
        socket.on('reload', function (data) {
            location.reload();
        });
    };
    ChatComponent.prototype.sendDataPrivate = function (socket) {
        var sendChatMessage = new __WEBPACK_IMPORTED_MODULE_5__common_chat_sokets_SendChatMessage__["a" /* SendChatMessage */]();
        socket.on('sendDataPrivate', function (messageReplies) {
            sendChatMessage.htmlContentBoxChat(messageReplies);
            sendChatMessage.scrollEndShowBoxChat(1000);
            // $('#frameListMsg').trigger('changeBoxMsg');
        });
    };
    ;
    ChatComponent.prototype.eventSocketAntiSpam = function () {
        this.socket.on('messageDataSpam', function (dataSpam) {
            console.log('messageDataSpam => ', dataSpam);
        });
    };
    ;
    ChatComponent.prototype.sendDataBroadCast = function (socket) {
        var sendChatMessage = new __WEBPACK_IMPORTED_MODULE_5__common_chat_sokets_SendChatMessage__["a" /* SendChatMessage */]();
        socket.on('sendDataBroadCast', function (messageSent) { return sendChatMessage.sendDataBroadCast(messageSent); });
    };
    ;
    ChatComponent.prototype.listUserConversation = function (socket) {
        var listContact = new __WEBPACK_IMPORTED_MODULE_4__common_chat_supports_ListContacts__["a" /* ListContacts */]();
        socket.on('listUserConversation', function (listConversation) { return listContact.updateListUserConversation(listConversation); });
    };
    ;
    ChatComponent.prototype.createConversationGroup = function (socket) {
        var sendChatMessage = new __WEBPACK_IMPORTED_MODULE_5__common_chat_sokets_SendChatMessage__["a" /* SendChatMessage */]();
        socket.on('resultUpdateActionConversationGroup', function (listConversationGroup) { return sendChatMessage.createConversationGroup(listConversationGroup, socket); });
    };
    ;
    ChatComponent.prototype.sendDataTest = function (socket) {
        var that = this;
        socket.on('send-data-test', function (listConversation) {
            console.log(listConversation);
        });
    };
    ;
    ChatComponent.prototype.msgContent = function (socket) {
        var sendChatMessage = new __WEBPACK_IMPORTED_MODULE_5__common_chat_sokets_SendChatMessage__["a" /* SendChatMessage */]();
        socket.on('msgContent', function (dataMessage) { return sendChatMessage.msgContent(dataMessage); });
    };
    ;
    ChatComponent.prototype.onEnterFunction = function () {
    };
    ChatComponent.prototype.bindedVariable = function () {
    };
    ChatComponent.prototype.setPopupAction = function (fn) {
        this.openPopup = fn;
    };
    ChatComponent.prototype.ngOnDestroy = function () {
        this.rsData.unsubscribe();
    };
    ;
    return ChatComponent;
}(__WEBPACK_IMPORTED_MODULE_3__common_libSupports__["a" /* libSupports */]));



/***/ }),

/***/ "./src/app/components/contents/contents-routing.modules.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ContentsRoutingModule; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return ɵ0; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return ɵ1; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return ɵ2; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return ɵ3; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return ɵ4; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__chat_chat_component__ = __webpack_require__("./src/app/components/contents/chat/chat.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__login_login_component__ = __webpack_require__("./src/app/components/contents/login/login.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__register_register_component__ = __webpack_require__("./src/app/components/contents/register/register.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__errors_page404_page404_component__ = __webpack_require__("./src/app/components/contents/errors/page404/page404.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__home_home_component__ = __webpack_require__("./src/app/components/contents/home/home.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__forgot_forgot_component__ = __webpack_require__("./src/app/components/contents/forgot/forgot.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__errors_page_error_page_error_component__ = __webpack_require__("./src/app/components/contents/errors/page-error/page-error.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__logout_logout_component__ = __webpack_require__("./src/app/components/contents/logout/logout.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__services_auth_auth_guard_service__ = __webpack_require__("./src/app/services/auth/auth-guard.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__services_auth_role_login_guard_service__ = __webpack_require__("./src/app/services/auth/role-login-guard.service.ts");











var ɵ0 = { title: 'Register' }, ɵ1 = { title: 'Login' }, ɵ2 = { title: 'Logout' }, ɵ3 = { title: 'Login' }, ɵ4 = { title: 'Home chat' };
var contentsRoutes = [
    {
        path: 'register',
        component: __WEBPACK_IMPORTED_MODULE_2__register_register_component__["a" /* RegisterComponent */],
        canActivate: [__WEBPACK_IMPORTED_MODULE_9__services_auth_role_login_guard_service__["a" /* RoleLoginGuardService */]],
        data: ɵ0,
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: __WEBPACK_IMPORTED_MODULE_1__login_login_component__["a" /* LoginComponent */],
        canActivate: [__WEBPACK_IMPORTED_MODULE_9__services_auth_role_login_guard_service__["a" /* RoleLoginGuardService */]],
        data: ɵ1,
        pathMatch: 'full'
    },
    { path: 'logout', component: __WEBPACK_IMPORTED_MODULE_7__logout_logout_component__["a" /* LogoutComponent */], data: ɵ2, pathMatch: 'full' },
    { path: 'forgot', component: __WEBPACK_IMPORTED_MODULE_5__forgot_forgot_component__["a" /* ForgotComponent */], canLoad: [__WEBPACK_IMPORTED_MODULE_8__services_auth_auth_guard_service__["a" /* AuthGuard */]], data: ɵ3, pathMatch: 'full' },
    { path: 'chat', component: __WEBPACK_IMPORTED_MODULE_0__chat_chat_component__["a" /* ChatComponent */], canActivate: [__WEBPACK_IMPORTED_MODULE_8__services_auth_auth_guard_service__["a" /* AuthGuard */]], data: ɵ4, pathMatch: 'full' },
    { path: 'home', component: __WEBPACK_IMPORTED_MODULE_4__home_home_component__["a" /* HomeComponent */], pathMatch: 'full' },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    // {path: 'error', component: PageErrorComponent},
    { path: 'error/:status', component: __WEBPACK_IMPORTED_MODULE_6__errors_page_error_page_error_component__["a" /* PageErrorComponent */] },
    { path: '**', component: __WEBPACK_IMPORTED_MODULE_3__errors_page404_page404_component__["a" /* Page404Component */] }
];
var ContentsRoutingModule = /** @class */ (function () {
    function ContentsRoutingModule() {
    }
    return ContentsRoutingModule;
}());




/***/ }),

/***/ "./src/app/components/contents/contents.component.css.ngstyle.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return styles; });
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes}
 * tslint:disable
 */ 
var styles = [".background-blue {\r\n    margin: 0 auto;\r\n    max-width: 420px;\r\n}\r\n\r\n#login-form label, #register-form label {\r\n    display: block;\r\n}"];



/***/ }),

/***/ "./src/app/components/contents/contents.component.ngfactory.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RenderType_ContentsComponent; });
/* harmony export (immutable) */ __webpack_exports__["b"] = View_ContentsComponent_0;
/* unused harmony export View_ContentsComponent_Host_0 */
/* unused harmony export ContentsComponentNgFactory */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__contents_component_css_ngstyle__ = __webpack_require__("./src/app/components/contents/contents.component.css.ngstyle.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_router__ = __webpack_require__("./node_modules/@angular/router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__contents_component__ = __webpack_require__("./src/app/components/contents/contents.component.ts");
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes}
 * tslint:disable
 */ 




var styles_ContentsComponent = [__WEBPACK_IMPORTED_MODULE_0__contents_component_css_ngstyle__["a" /* styles */]];
var RenderType_ContentsComponent = __WEBPACK_IMPORTED_MODULE_1__angular_core__["_11" /* ɵcrt */]({ encapsulation: 2, styles: styles_ContentsComponent, data: {} });

function View_ContentsComponent_0(_l) { return __WEBPACK_IMPORTED_MODULE_1__angular_core__["_31" /* ɵvid */](0, [(_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](0, 16777216, null, null, 1, "router-outlet", [], null, null, null, null, null)), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_12" /* ɵdid */](1, 212992, null, 0, __WEBPACK_IMPORTED_MODULE_2__angular_router__["m" /* RouterOutlet */], [__WEBPACK_IMPORTED_MODULE_2__angular_router__["b" /* ChildrenOutletContexts */], __WEBPACK_IMPORTED_MODULE_1__angular_core__["X" /* ViewContainerRef */], __WEBPACK_IMPORTED_MODULE_1__angular_core__["k" /* ComponentFactoryResolver */], [8, null], __WEBPACK_IMPORTED_MODULE_1__angular_core__["i" /* ChangeDetectorRef */]], null, null), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n"]))], function (_ck, _v) { _ck(_v, 1, 0); }, null); }
function View_ContentsComponent_Host_0(_l) { return __WEBPACK_IMPORTED_MODULE_1__angular_core__["_31" /* ɵvid */](0, [(_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](0, 0, null, null, 1, "app-contents", [], null, null, null, View_ContentsComponent_0, RenderType_ContentsComponent)), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_12" /* ɵdid */](1, 114688, null, 0, __WEBPACK_IMPORTED_MODULE_3__contents_component__["a" /* ContentsComponent */], [], null, null)], function (_ck, _v) { _ck(_v, 1, 0); }, null); }
var ContentsComponentNgFactory = __WEBPACK_IMPORTED_MODULE_1__angular_core__["_9" /* ɵccf */]("app-contents", __WEBPACK_IMPORTED_MODULE_3__contents_component__["a" /* ContentsComponent */], View_ContentsComponent_Host_0, {}, { LoginChanged: "LoginChanged" }, []);



/***/ }),

/***/ "./src/app/components/contents/contents.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ContentsComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");

var ContentsComponent = /** @class */ (function () {
    function ContentsComponent() {
        this.isPageLoginChild = true;
        // @Input() isPageLoginContent: boolean;
        this.LoginChanged = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["p" /* EventEmitter */]();
    }
    ContentsComponent.prototype.ngOnInit = function () {
        this.LoginChanged.emit(this.isPageLoginChild);
    };
    return ContentsComponent;
}());



/***/ }),

/***/ "./src/app/components/contents/errors/page-error/page-error.component.css.shim.ngstyle.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return styles; });
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes}
 * tslint:disable
 */ 
var styles = [""];



/***/ }),

/***/ "./src/app/components/contents/errors/page-error/page-error.component.ngfactory.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export RenderType_PageErrorComponent */
/* unused harmony export View_PageErrorComponent_0 */
/* unused harmony export View_PageErrorComponent_Host_0 */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PageErrorComponentNgFactory; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__page_error_component_css_shim_ngstyle__ = __webpack_require__("./src/app/components/contents/errors/page-error/page-error.component.css.shim.ngstyle.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__page_error_component__ = __webpack_require__("./src/app/components/contents/errors/page-error/page-error.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_router__ = __webpack_require__("./node_modules/@angular/router/esm5/router.js");
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes}
 * tslint:disable
 */ 




var styles_PageErrorComponent = [__WEBPACK_IMPORTED_MODULE_0__page_error_component_css_shim_ngstyle__["a" /* styles */]];
var RenderType_PageErrorComponent = __WEBPACK_IMPORTED_MODULE_1__angular_core__["_11" /* ɵcrt */]({ encapsulation: 0, styles: styles_PageErrorComponent, data: {} });

function View_PageErrorComponent_0(_l) { return __WEBPACK_IMPORTED_MODULE_1__angular_core__["_31" /* ɵvid */](0, [(_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](0, 0, null, null, 1, "p", [], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n    page-error works!.....\n"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](3, 0, null, null, 5, "p", [], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n    This is what I'm all about. "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](5, 0, null, null, 2, "a", [["href", ""]], null, [[null, "click"]], function (_v, en, $event) { var ad = true; var _co = _v.component; if (("click" === en)) {
        var pd_0 = (_co.sendMeHome() !== false);
        ad = (pd_0 && ad);
    } return ad; }, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](6, 0, null, null, 1, "strong", [], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["Take me back"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, [".\n"]))], null, null); }
function View_PageErrorComponent_Host_0(_l) { return __WEBPACK_IMPORTED_MODULE_1__angular_core__["_31" /* ɵvid */](0, [(_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](0, 0, null, null, 1, "app-contents-error", [], null, null, null, View_PageErrorComponent_0, RenderType_PageErrorComponent)), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_12" /* ɵdid */](1, 114688, null, 0, __WEBPACK_IMPORTED_MODULE_2__page_error_component__["a" /* PageErrorComponent */], [__WEBPACK_IMPORTED_MODULE_3__angular_router__["a" /* ActivatedRoute */], __WEBPACK_IMPORTED_MODULE_3__angular_router__["k" /* Router */]], null, null)], function (_ck, _v) { _ck(_v, 1, 0); }, null); }
var PageErrorComponentNgFactory = __WEBPACK_IMPORTED_MODULE_1__angular_core__["_9" /* ɵccf */]("app-contents-error", __WEBPACK_IMPORTED_MODULE_2__page_error_component__["a" /* PageErrorComponent */], View_PageErrorComponent_Host_0, {}, {}, []);



/***/ }),

/***/ "./src/app/components/contents/errors/page-error/page-error.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PageErrorComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_router__ = __webpack_require__("./node_modules/@angular/router/esm5/router.js");


var PageErrorComponent = /** @class */ (function () {
    function PageErrorComponent(route, router) {
        var _this = this;
        this.route = route;
        this.router = router;
        this.route.params.subscribe(function (res) {
            _this.statusCode = res.id;
            console.log(res.id);
        });
    }
    PageErrorComponent.prototype.ngOnInit = function () {
    };
    PageErrorComponent.prototype.sendMeHome = function () {
        this.router.navigate(['']);
    };
    return PageErrorComponent;
}());



/***/ }),

/***/ "./src/app/components/contents/errors/page404/page404.component.css.shim.ngstyle.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return styles; });
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes}
 * tslint:disable
 */ 
var styles = [".container[_ngcontent-%COMP%] {\r\n    text-align: center;\r\n    display: table-cell;\r\n    vertical-align: middle;\r\n}\r\n\r\n.content[_ngcontent-%COMP%] {\r\n    text-align: center;\r\n    display: inline-block;\r\n}\r\n\r\n.title[_ngcontent-%COMP%] {\r\n    font-size: 72px;\r\n    margin-bottom: 40px;\r\n}"];



/***/ }),

/***/ "./src/app/components/contents/errors/page404/page404.component.ngfactory.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export RenderType_Page404Component */
/* unused harmony export View_Page404Component_0 */
/* unused harmony export View_Page404Component_Host_0 */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Page404ComponentNgFactory; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__page404_component_css_shim_ngstyle__ = __webpack_require__("./src/app/components/contents/errors/page404/page404.component.css.shim.ngstyle.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__page404_component__ = __webpack_require__("./src/app/components/contents/errors/page404/page404.component.ts");
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes}
 * tslint:disable
 */ 



var styles_Page404Component = [__WEBPACK_IMPORTED_MODULE_0__page404_component_css_shim_ngstyle__["a" /* styles */]];
var RenderType_Page404Component = __WEBPACK_IMPORTED_MODULE_1__angular_core__["_11" /* ɵcrt */]({ encapsulation: 0, styles: styles_Page404Component, data: {} });

function View_Page404Component_0(_l) { return __WEBPACK_IMPORTED_MODULE_1__angular_core__["_31" /* ɵvid */](0, [(_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](0, 0, null, null, 7, "div", [["class", "container"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](2, 0, null, null, 4, "div", [["class", "content"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](4, 0, null, null, 1, "div", [["class", "title"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["Be right back. Error 404."])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n"]))], null, null); }
function View_Page404Component_Host_0(_l) { return __WEBPACK_IMPORTED_MODULE_1__angular_core__["_31" /* ɵvid */](0, [(_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](0, 0, null, null, 1, "app-contents-page404", [], null, null, null, View_Page404Component_0, RenderType_Page404Component)), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_12" /* ɵdid */](1, 114688, null, 0, __WEBPACK_IMPORTED_MODULE_2__page404_component__["a" /* Page404Component */], [], null, null)], function (_ck, _v) { _ck(_v, 1, 0); }, null); }
var Page404ComponentNgFactory = __WEBPACK_IMPORTED_MODULE_1__angular_core__["_9" /* ɵccf */]("app-contents-page404", __WEBPACK_IMPORTED_MODULE_2__page404_component__["a" /* Page404Component */], View_Page404Component_Host_0, {}, {}, []);



/***/ }),

/***/ "./src/app/components/contents/errors/page404/page404.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Page404Component; });
var Page404Component = /** @class */ (function () {
    function Page404Component() {
    }
    Page404Component.prototype.ngOnInit = function () {
    };
    return Page404Component;
}());



/***/ }),

/***/ "./src/app/components/contents/forgot/forgot.component.ngfactory.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export RenderType_ForgotComponent */
/* unused harmony export View_ForgotComponent_0 */
/* unused harmony export View_ForgotComponent_Host_0 */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ForgotComponentNgFactory; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__login_login_component_css_ngstyle__ = __webpack_require__("./src/app/components/contents/login/login.component.css.ngstyle.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__forgot_component__ = __webpack_require__("./src/app/components/contents/forgot/forgot.component.ts");
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes}
 * tslint:disable
 */ 



var styles_ForgotComponent = [__WEBPACK_IMPORTED_MODULE_0__login_login_component_css_ngstyle__["a" /* styles */]];
var RenderType_ForgotComponent = __WEBPACK_IMPORTED_MODULE_1__angular_core__["_11" /* ɵcrt */]({ encapsulation: 2, styles: styles_ForgotComponent, data: {} });

function View_ForgotComponent_0(_l) { return __WEBPACK_IMPORTED_MODULE_1__angular_core__["_31" /* ɵvid */](0, [(_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](0, 0, null, null, 27, "div", [["class", "background-blue"], ["cz-shortcut-listen", "true"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](2, 0, null, null, 24, "div", [["class", "login-box"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](4, 0, null, null, 21, "form", [["action", "/forgot"], ["enctype", "application/x-www-form-urlencoded"], ["id", "j_idt9"], ["method", "post"], ["name", "j_idt9"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](6, 0, null, null, 0, "input", [["name", "j_idt9"], ["type", "hidden"], ["value", "j_idt9"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](8, 0, null, null, 1, "p", [["class", "title center"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["QU\u00CAN M\u1EACT KH\u1EA8U"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](11, 0, null, null, 1, "p", [["class", "padding color-gray"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["Nh\u1EADp \u0111\u1ECBa ch\u1EC9 email b\u1EA1n \u0111\u00E3 \u0111\u0103ng k\u00FD, ch\u00FAng t\u00F4i s\u1EBD gi\u00FAp b\u1EA1n l\u1EA5y l\u1EA1i m\u1EADt kh\u1EA9u"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](14, 0, null, null, 3, "p", [["class", "input-code"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](16, 0, null, null, 0, "input", [["class", "width-box80 box"], ["name", "j_idt9:j_idt12"], ["placeholder", "\u0110\u1ECBa ch\u1EC9 email b\u1EA1n \u0111\u00E3 \u0111\u0103ng k\u00FD"], ["type", "text"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](19, 0, null, null, 3, "p", [["class", "input-code center"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](21, 0, null, null, 0, "input", [["class", "btn btn-primary"], ["type", "submit"], ["value", "G\u1EEDi m\u1EADt kh\u1EA9u"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](24, 0, null, null, 0, "input", [["autocomplete", "off"], ["id", "j_id1:javax.faces.ViewState:0"], ["name", "javax.faces.ViewState"], ["type", "hidden"], ["value", "-7257382977386360165:5414477074278608902"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n"]))], null, null); }
function View_ForgotComponent_Host_0(_l) { return __WEBPACK_IMPORTED_MODULE_1__angular_core__["_31" /* ɵvid */](0, [(_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](0, 0, null, null, 1, "content-forgot", [], null, null, null, View_ForgotComponent_0, RenderType_ForgotComponent)), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_12" /* ɵdid */](1, 114688, null, 0, __WEBPACK_IMPORTED_MODULE_2__forgot_component__["a" /* ForgotComponent */], [], null, null)], function (_ck, _v) { _ck(_v, 1, 0); }, null); }
var ForgotComponentNgFactory = __WEBPACK_IMPORTED_MODULE_1__angular_core__["_9" /* ɵccf */]("content-forgot", __WEBPACK_IMPORTED_MODULE_2__forgot_component__["a" /* ForgotComponent */], View_ForgotComponent_Host_0, {}, {}, []);



/***/ }),

/***/ "./src/app/components/contents/forgot/forgot.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ForgotComponent; });
var ForgotComponent = /** @class */ (function () {
    function ForgotComponent() {
    }
    ForgotComponent.prototype.ngOnInit = function () {
    };
    return ForgotComponent;
}());



/***/ }),

/***/ "./src/app/components/contents/home/home.component.css.ngstyle.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return styles; });
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes}
 * tslint:disable
 */ 
var styles = [""];



/***/ }),

/***/ "./src/app/components/contents/home/home.component.ngfactory.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export RenderType_HomeComponent */
/* unused harmony export View_HomeComponent_0 */
/* unused harmony export View_HomeComponent_Host_0 */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HomeComponentNgFactory; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__home_component_css_ngstyle__ = __webpack_require__("./src/app/components/contents/home/home.component.css.ngstyle.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__sidebar_sidebar_component_ngfactory__ = __webpack_require__("./src/app/components/contents/sidebar/sidebar.component.ngfactory.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__sidebar_sidebar_component__ = __webpack_require__("./src/app/components/contents/sidebar/sidebar.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_router__ = __webpack_require__("./node_modules/@angular/router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__home_component__ = __webpack_require__("./src/app/components/contents/home/home.component.ts");
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes}
 * tslint:disable
 */ 






var styles_HomeComponent = [__WEBPACK_IMPORTED_MODULE_0__home_component_css_ngstyle__["a" /* styles */]];
var RenderType_HomeComponent = __WEBPACK_IMPORTED_MODULE_1__angular_core__["_11" /* ɵcrt */]({ encapsulation: 2, styles: styles_HomeComponent, data: {} });

function View_HomeComponent_0(_l) { return __WEBPACK_IMPORTED_MODULE_1__angular_core__["_31" /* ɵvid */](0, [(_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](1, 0, null, null, 2, "div", [["id", "question-header"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n\n"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](5, 0, null, null, 4, "div", [["aria-label", "question and answers"], ["id", "mainbar"], ["role", "main"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](12, 0, null, null, 4, "div", [["aria-label", "sidebar"], ["class", "show-votes"], ["id", "sidebar"], ["role", "complementary"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](14, 0, null, null, 1, "contents-home-sidebar", [], null, null, null, __WEBPACK_IMPORTED_MODULE_2__sidebar_sidebar_component_ngfactory__["b" /* View_SidebarComponent_0 */], __WEBPACK_IMPORTED_MODULE_2__sidebar_sidebar_component_ngfactory__["a" /* RenderType_SidebarComponent */])), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_12" /* ɵdid */](15, 114688, null, 0, __WEBPACK_IMPORTED_MODULE_3__sidebar_sidebar_component__["a" /* SidebarComponent */], [], null, null), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](19, 0, null, null, 2, "div", [["id", "feed-link"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n\n"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](24, 16777216, null, null, 1, "router-outlet", [], null, null, null, null, null)), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_12" /* ɵdid */](25, 212992, null, 0, __WEBPACK_IMPORTED_MODULE_4__angular_router__["m" /* RouterOutlet */], [__WEBPACK_IMPORTED_MODULE_4__angular_router__["b" /* ChildrenOutletContexts */], __WEBPACK_IMPORTED_MODULE_1__angular_core__["X" /* ViewContainerRef */], __WEBPACK_IMPORTED_MODULE_1__angular_core__["k" /* ComponentFactoryResolver */], [8, null], __WEBPACK_IMPORTED_MODULE_1__angular_core__["i" /* ChangeDetectorRef */]], null, null)], function (_ck, _v) { _ck(_v, 15, 0); _ck(_v, 25, 0); }, null); }
function View_HomeComponent_Host_0(_l) { return __WEBPACK_IMPORTED_MODULE_1__angular_core__["_31" /* ɵvid */](0, [(_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](0, 0, null, null, 1, "app-contents-home", [], null, null, null, View_HomeComponent_0, RenderType_HomeComponent)), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_12" /* ɵdid */](1, 114688, null, 0, __WEBPACK_IMPORTED_MODULE_5__home_component__["a" /* HomeComponent */], [], null, null)], function (_ck, _v) { _ck(_v, 1, 0); }, null); }
var HomeComponentNgFactory = __WEBPACK_IMPORTED_MODULE_1__angular_core__["_9" /* ɵccf */]("app-contents-home", __WEBPACK_IMPORTED_MODULE_5__home_component__["a" /* HomeComponent */], View_HomeComponent_Host_0, {}, {}, []);



/***/ }),

/***/ "./src/app/components/contents/home/home.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HomeComponent; });
var HomeComponent = /** @class */ (function () {
    function HomeComponent() {
    }
    HomeComponent.prototype.ngOnInit = function () {
    };
    return HomeComponent;
}());



/***/ }),

/***/ "./src/app/components/contents/login/login.component.css.ngstyle.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return styles; });
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes}
 * tslint:disable
 */ 
var styles = ["\r\n.logo-login {\r\n    padding: 5px 0 25px;\r\n    max-width: 121px;\r\n}\r\n\r\n.logo-login img {\r\n    width: 100%;\r\n}\r\n\r\n.slogan {\r\n    font-family: fslogan;\r\n    \r\n    color: #829db3;\r\n}\r\n\r\n.login-box {\r\n    background-color: gainsboro;;\r\n    max-width: 100%;\r\n    padding: 20px 10px 25px;\r\n    margin: 0px 5px 0px 5px;\r\n}\r\n\r\n.title {\r\n    font-family: fsemibold;\r\n    font-size: 150%;\r\n    color: #303030;\r\n}\r\n\r\n.center {\r\n    text-align: center;\r\n}\r\n\r\n.color-gray {\r\n    color: #333;\r\n}\r\n\r\n.padding {\r\n    padding: 1px 0;\r\n}\r\n\r\n.margin {\r\n    margin: 1px 0;\r\n}\r\n\r\n.font80 {\r\n    font-size: 80%;\r\n}\r\n\r\n.input-code {\r\n    width: 100%;\r\n}\r\n\r\n.mg-top10 {\r\n    margin-top: 10px;\r\n}\r\n\r\n.width-box80 {\r\n    background-color: #fff;\r\n    font-size: 90%;\r\n    width: calc(100% - 20px);\r\n}\r\n\r\n.box {\r\n    border: 1px solid #a4a4a4;\r\n    padding: 10px;\r\n    margin: 5px 0 0 10px;\r\n    text-align: left;\r\n}\r\n\r\n.footer {\r\n    font-family: fregular;\r\n    font-size: 80%;\r\n    color: #ccc;\r\n    padding: 20px 5px 30px 5px;\r\n}\r\n\r\n.login-box form p:first-of-type {\r\n    margin-bottom: 15px;\r\n}\r\n\r\n.login-box .msg-noti {\r\n    text-align: left;\r\n    margin: 0 auto;\r\n    display: block;\r\n    clear: both;\r\n    padding: 0px 0px 4px 0px;\r\n}\r\n\r\n.position {\r\n    position: absolute;\r\n    bottom: 0;\r\n    width: 100%;\r\n}\r\n\r\n.login-box-social {\r\n    display: -webkit-box;\r\n}\r\n\r\n#fb-login {\r\n    float: left;\r\n    padding-left: 10px;\r\n}\r\n\r\n#google-login {\r\n    float: right;\r\n    padding-right: 10px;\r\n}"];



/***/ }),

/***/ "./src/app/components/contents/login/login.component.ngfactory.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export RenderType_LoginComponent */
/* unused harmony export View_LoginComponent_0 */
/* unused harmony export View_LoginComponent_Host_0 */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LoginComponentNgFactory; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__login_component_css_ngstyle__ = __webpack_require__("./src/app/components/contents/login/login.component.css.ngstyle.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__login_component__ = __webpack_require__("./src/app/components/contents/login/login.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__services_auth_auth_service__ = __webpack_require__("./src/app/services/auth/auth.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_router__ = __webpack_require__("./node_modules/@angular/router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_common_http__ = __webpack_require__("./node_modules/@angular/common/esm5/http.js");
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes}
 * tslint:disable
 */ 






var styles_LoginComponent = [__WEBPACK_IMPORTED_MODULE_0__login_component_css_ngstyle__["a" /* styles */]];
var RenderType_LoginComponent = __WEBPACK_IMPORTED_MODULE_1__angular_core__["_11" /* ɵcrt */]({ encapsulation: 2, styles: styles_LoginComponent, data: {} });

function View_LoginComponent_0(_l) { return __WEBPACK_IMPORTED_MODULE_1__angular_core__["_31" /* ɵvid */](0, [(_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](0, 0, null, null, 61, "div", [["class", "background-blue"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](2, 0, null, null, 58, "div", [["class", "login-box"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](4, 0, null, null, 55, "form", [["enctype", "application/x-www-form-urlencoded"], ["id", "login-form"], ["method", "post"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](6, 0, null, null, 0, "input", [["name", "_method"], ["type", "hidden"], ["value", "post"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](8, 0, null, null, 0, "input", [["class", "width-box80 box"], ["name", "action"], ["type", "hidden"], ["value", "local"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](10, 0, null, null, 1, "p", [["class", "title center"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\u0110\u0102NG NH\u1EACP"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](13, 0, null, null, 3, "p", [["class", "input-code"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](15, 0, null, null, 0, "input", [["class", "width-box80 box"], ["name", "loginId"], ["placeholder", "Username ho\u1EB7c Email"], ["type", "text"], ["value", "bqngoc119"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](18, 0, null, null, 3, "p", [["class", "input-code"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](20, 0, null, null, 0, "input", [["class", "width-box80 box"], ["name", "pwd"], ["placeholder", "M\u1EADt kh\u1EA9u"], ["type", "password"], ["value", "bqngoc119"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](23, 0, null, null, 2, "div", [["id", "message"], ["style", "display:block"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](29, 0, null, null, 29, "div", [["class", "center"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](31, 0, null, null, 3, "p", [["class", "input-code"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](33, 0, null, null, 0, "input", [["class", "btn btn-primary"], ["id", "btn-login-form"], ["type", "button"], ["value", "\u0110\u0102NG NH\u1EACP"]], null, [[null, "click"]], function (_v, en, $event) { var ad = true; var _co = _v.component; if (("click" === en)) {
        var pd_0 = (_co.clickLogin() !== false);
        ad = (pd_0 && ad);
    } return ad; }, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](36, 0, null, null, 1, "p", [["class", "color-gray slogan font80 padding margin"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["ho\u1EB7c"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](39, 0, null, null, 8, "div", [["class", "input-code"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](41, 0, null, null, 0, "input", [["class", "btn btn btn-info"], ["type", "button"], ["value", "\u0110\u0103ng nh\u1EADp qua facebook"]], null, [[null, "click"]], function (_v, en, $event) { var ad = true; var _co = _v.component; if (("click" === en)) {
        var pd_0 = (_co.loginFacebook() !== false);
        ad = (pd_0 && ad);
    } return ad; }, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](43, 0, null, null, 3, "div", [["id", "google-login"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](45, 0, null, null, 0, "input", [["class", "btn btn-info"], ["name", ""], ["type", "button"], ["value", "\u0110\u0103ng nh\u1EADp qua Google"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](49, 0, null, null, 7, "p", [["class", "padding mg-top10"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](51, 0, null, null, 1, "a", [["class", "link"], ["href", "/forgot"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["Qu\u00EAn m\u1EADt kh\u1EA9u"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, [" |\n                    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](54, 0, null, null, 1, "a", [["class", "link"], ["href", "/register"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\u0110\u0103ng k\u00FD"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](57, 0, null, null, 0, "input", [["autocomplete", "off"], ["id", ""], ["name", ""], ["type", "hidden"], ["value", ""]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n\n"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n"]))], null, null); }
function View_LoginComponent_Host_0(_l) { return __WEBPACK_IMPORTED_MODULE_1__angular_core__["_31" /* ɵvid */](0, [(_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](0, 0, null, null, 1, "contents-login", [], null, null, null, View_LoginComponent_0, RenderType_LoginComponent)), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_12" /* ɵdid */](1, 114688, null, 0, __WEBPACK_IMPORTED_MODULE_2__login_component__["a" /* LoginComponent */], [__WEBPACK_IMPORTED_MODULE_3__services_auth_auth_service__["a" /* AuthService */], __WEBPACK_IMPORTED_MODULE_4__angular_router__["k" /* Router */], __WEBPACK_IMPORTED_MODULE_5__angular_common_http__["c" /* HttpClient */]], null, null)], function (_ck, _v) { _ck(_v, 1, 0); }, null); }
var LoginComponentNgFactory = __WEBPACK_IMPORTED_MODULE_1__angular_core__["_9" /* ɵccf */]("contents-login", __WEBPACK_IMPORTED_MODULE_2__login_component__["a" /* LoginComponent */], View_LoginComponent_Host_0, { isLoginChild: "isLoginChild" }, { LoginChangedChild: "LoginChangedChild" }, []);



/***/ }),

/***/ "./src/app/components/contents/login/login.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LoginComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__services_auth_auth_service__ = __webpack_require__("./src/app/services/auth/auth.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_router__ = __webpack_require__("./node_modules/@angular/router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__common_libSupports__ = __webpack_require__("./src/app/common/libSupports.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_common_http__ = __webpack_require__("./node_modules/@angular/common/esm5/http.js");

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();





var LoginComponent = /** @class */ (function (_super) {
    __extends(LoginComponent, _super);
    function LoginComponent(authService, router, http) {
        var _this = _super.call(this) || this;
        _this.authService = authService;
        _this.router = router;
        _this.http = http;
        _this.isLoginChild = true;
        _this.LoginChangedChild = new __WEBPACK_IMPORTED_MODULE_1__angular_core__["p" /* EventEmitter */]();
        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement(s);
            js.id = id;
            js.src = '//connect.facebook.net/en_US/sdk.js';
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
        window.fbAsyncInit = function () {
            console.log("fbasyncinit");
            FB.init({
                appId: '183473242451708',
                autoLogAppEvents: true,
                xfbml: true,
                cookie: true,
                version: 'v2.6'
            });
            FB.AppEvents.logPageView();
        };
        return _this;
    }
    LoginComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.urlLogin = 'api/login';
        if (window.FB) {
            window.FB.XFBML.parse();
        }
        FB.getLoginStatus(function (response) {
            _this.statusChangeCallback(response);
        });
    };
    LoginComponent.prototype.clickLogin = function () {
        var attrFromLogin = $('#login-form');
        var dataRequest = {
            url: this.urlLogin,
            data: attrFromLogin.serialize()
        };
        var self = this;
        localStorage.removeItem('idToken');
        // AuthService
        this.callDataJS(dataRequest, function (result) {
            self.authService.login().subscribe(function () {
                if (result) {
                    if (result.validate) {
                        result.validate.forEach(function (val) {
                            // console.log(val);
                            $('input[name="' + val.param + '"]').addClass('error');
                        });
                    }
                    if (result.status) {
                        // AuthToken
                        localStorage.setItem('idToken', result.token);
                        var navigationExtras = {
                            queryParamsHandling: 'preserve',
                            preserveFragment: true
                        };
                        self.router.navigate([result.url], navigationExtras);
                    }
                    else {
                        if (result.msg.length)
                            $('#message').html(self.cnMessagesShow([result.msg], 'e'));
                    }
                }
            });
        });
    };
    LoginComponent.prototype.loginFacebook = function () {
        FB.login(function (result) {
            this.loged = true;
            this.token = result;
        }, { scope: 'user_friends' });
    };
    LoginComponent.prototype.statusChangeCallback = function (response) {
        if (response.status === 'connected') {
            console.log('connected');
        }
        else {
            this.loginFacebook();
        }
    };
    LoginComponent.prototype.me = function () {
        FB.api('/me?fields=id,name,first_name,last_name,gender,picture.width(150).height(150),age_range,friends', function (result) {
            if (result && !result.error) {
                this.user = result;
                console.log(this.user);
            }
            else {
                console.log(result.error);
            }
        });
    };
    return LoginComponent;
}(__WEBPACK_IMPORTED_MODULE_3__common_libSupports__["a" /* libSupports */]));



/***/ }),

/***/ "./src/app/components/contents/logout/logout.component.ngfactory.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export RenderType_LogoutComponent */
/* unused harmony export View_LogoutComponent_0 */
/* unused harmony export View_LogoutComponent_Host_0 */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LogoutComponentNgFactory; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__logout_component__ = __webpack_require__("./src/app/components/contents/logout/logout.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services_auth_auth_service__ = __webpack_require__("./src/app/services/auth/auth.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_router__ = __webpack_require__("./node_modules/@angular/router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__services_api_user_service__ = __webpack_require__("./src/app/components/services/api-user.service.ts");
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes}
 * tslint:disable
 */ 





var styles_LogoutComponent = [];
var RenderType_LogoutComponent = __WEBPACK_IMPORTED_MODULE_0__angular_core__["_11" /* ɵcrt */]({ encapsulation: 2, styles: styles_LogoutComponent, data: {} });

function View_LogoutComponent_0(_l) { return __WEBPACK_IMPORTED_MODULE_0__angular_core__["_31" /* ɵvid */](0, [(_l()(), __WEBPACK_IMPORTED_MODULE_0__angular_core__["_13" /* ɵeld */](0, 0, null, null, 0, "div", [], null, null, null, null, null))], null, null); }
function View_LogoutComponent_Host_0(_l) { return __WEBPACK_IMPORTED_MODULE_0__angular_core__["_31" /* ɵvid */](0, [(_l()(), __WEBPACK_IMPORTED_MODULE_0__angular_core__["_13" /* ɵeld */](0, 0, null, null, 1, "ng-component", [], null, null, null, View_LogoutComponent_0, RenderType_LogoutComponent)), __WEBPACK_IMPORTED_MODULE_0__angular_core__["_12" /* ɵdid */](1, 114688, null, 0, __WEBPACK_IMPORTED_MODULE_1__logout_component__["a" /* LogoutComponent */], [__WEBPACK_IMPORTED_MODULE_2__services_auth_auth_service__["a" /* AuthService */], __WEBPACK_IMPORTED_MODULE_3__angular_router__["k" /* Router */], __WEBPACK_IMPORTED_MODULE_4__services_api_user_service__["a" /* ApiServiceUser */]], null, null)], function (_ck, _v) { _ck(_v, 1, 0); }, null); }
var LogoutComponentNgFactory = __WEBPACK_IMPORTED_MODULE_0__angular_core__["_9" /* ɵccf */]("ng-component", __WEBPACK_IMPORTED_MODULE_1__logout_component__["a" /* LogoutComponent */], View_LogoutComponent_Host_0, {}, {}, []);



/***/ }),

/***/ "./src/app/components/contents/logout/logout.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LogoutComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_router__ = __webpack_require__("./node_modules/@angular/router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__services_api_user_service__ = __webpack_require__("./src/app/components/services/api-user.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services_auth_auth_service__ = __webpack_require__("./src/app/services/auth/auth.service.ts");




var LogoutComponent = /** @class */ (function () {
    function LogoutComponent(authService, router, apiUser) {
        this.authService = authService;
        this.router = router;
        this.apiUser = apiUser;
    }
    LogoutComponent.prototype.ngOnInit = function () {
        var _this = this;
        var self = this;
        localStorage.removeItem('idToken');
        this.apiUser.logout().subscribe(function () {
            self.authService.logout();
            _this.router.navigate(['/login']);
        }, function (error) {
            if (error.error.hasOwnProperty('url')) {
                window.location.href = error.error.url;
            }
            else {
                self.messageError = JSON.stringify(error);
            }
        });
    };
    return LogoutComponent;
}());



/***/ }),

/***/ "./src/app/components/contents/register/register.component.css.ngstyle.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return styles; });
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes}
 * tslint:disable
 */ 
var styles = [".fb_hidden {\r\n    position: absolute;\r\n    top: -10000px;\r\n    z-index: 10001\r\n}\r\n\r\n.fb_reposition {\r\n    overflow: hidden;\r\n    position: relative\r\n}\r\n\r\n.fb_invisible {\r\n    display: none\r\n}\r\n\r\n.fb_reset {\r\n    background: none;\r\n    border: 0;\r\n    border-spacing: 0;\r\n    color: #000;\r\n    cursor: auto;\r\n    direction: ltr;\r\n    font-family: \"lucida grande\", tahoma, verdana, arial, sans-serif;\r\n    font-size: 11px;\r\n    font-style: normal;\r\n    font-variant: normal;\r\n    font-weight: normal;\r\n    letter-spacing: normal;\r\n    line-height: 1;\r\n    margin: 0;\r\n    overflow: visible;\r\n    padding: 0;\r\n    text-align: left;\r\n    text-decoration: none;\r\n    text-indent: 0;\r\n    text-shadow: none;\r\n    text-transform: none;\r\n    visibility: visible;\r\n    white-space: normal;\r\n    word-spacing: normal\r\n}\r\n\r\n.fb_reset > div {\r\n    overflow: hidden\r\n}\r\n\r\n.fb_link img {\r\n    border: none\r\n}\r\n\r\n@-webkit-keyframes fb_transform {\r\n    from {\r\n        opacity: 0;\r\n        -webkit-transform: scale(.95);\r\n                transform: scale(.95)\r\n    }\r\n    to {\r\n        opacity: 1;\r\n        -webkit-transform: scale(1);\r\n                transform: scale(1)\r\n    }\r\n}\r\n\r\n@keyframes fb_transform {\r\n    from {\r\n        opacity: 0;\r\n        -webkit-transform: scale(.95);\r\n                transform: scale(.95)\r\n    }\r\n    to {\r\n        opacity: 1;\r\n        -webkit-transform: scale(1);\r\n                transform: scale(1)\r\n    }\r\n}\r\n\r\n.fb_animate {\r\n    -webkit-animation: fb_transform .3s forwards;\r\n            animation: fb_transform .3s forwards\r\n}\r\n\r\n.fb_dialog {\r\n    background: rgba(82, 82, 82, .7);\r\n    position: absolute;\r\n    top: -10000px;\r\n    z-index: 10001\r\n}\r\n\r\n.fb_reset .fb_dialog_legacy {\r\n    overflow: visible\r\n}\r\n\r\n.fb_dialog_advanced {\r\n    padding: 10px;\r\n    border-radius: 8px\r\n}\r\n\r\n.fb_dialog_content {\r\n    background: #fff;\r\n    color: #333\r\n}\r\n\r\n.fb_dialog_close_icon {\r\n    background: url(https://static.xx.fbcdn.net/rsrc.php/v3/yq/r/IE9JII6Z1Ys.png) no-repeat scroll 0 0 transparent;\r\n    cursor: pointer;\r\n    display: block;\r\n    height: 15px;\r\n    position: absolute;\r\n    right: 18px;\r\n    top: 17px;\r\n    width: 15px\r\n}\r\n\r\n.fb_dialog_mobile .fb_dialog_close_icon {\r\n    top: 5px;\r\n    left: 5px;\r\n    right: auto\r\n}\r\n\r\n.fb_dialog_padding {\r\n    background-color: transparent;\r\n    position: absolute;\r\n    width: 1px;\r\n    z-index: -1\r\n}\r\n\r\n.fb_dialog_close_icon:hover {\r\n    background: url(https://static.xx.fbcdn.net/rsrc.php/v3/yq/r/IE9JII6Z1Ys.png) no-repeat scroll 0 -15px transparent\r\n}\r\n\r\n.fb_dialog_close_icon:active {\r\n    background: url(https://static.xx.fbcdn.net/rsrc.php/v3/yq/r/IE9JII6Z1Ys.png) no-repeat scroll 0 -30px transparent\r\n}\r\n\r\n.fb_dialog_loader {\r\n    background-color: #f6f7f9;\r\n    border: 1px solid #606060;\r\n    font-size: 24px;\r\n    padding: 20px\r\n}\r\n\r\n.fb_dialog_top_left, .fb_dialog_top_right, .fb_dialog_bottom_left, .fb_dialog_bottom_right {\r\n    height: 10px;\r\n    width: 10px;\r\n    overflow: hidden;\r\n    position: absolute\r\n}\r\n\r\n.fb_dialog_top_left {\r\n    background: url(https://static.xx.fbcdn.net/rsrc.php/v3/ye/r/8YeTNIlTZjm.png) no-repeat 0 0;\r\n    left: -10px;\r\n    top: -10px\r\n}\r\n\r\n.fb_dialog_top_right {\r\n    background: url(https://static.xx.fbcdn.net/rsrc.php/v3/ye/r/8YeTNIlTZjm.png) no-repeat 0 -10px;\r\n    right: -10px;\r\n    top: -10px\r\n}\r\n\r\n.fb_dialog_bottom_left {\r\n    background: url(https://static.xx.fbcdn.net/rsrc.php/v3/ye/r/8YeTNIlTZjm.png) no-repeat 0 -20px;\r\n    bottom: -10px;\r\n    left: -10px\r\n}\r\n\r\n.fb_dialog_bottom_right {\r\n    background: url(https://static.xx.fbcdn.net/rsrc.php/v3/ye/r/8YeTNIlTZjm.png) no-repeat 0 -30px;\r\n    right: -10px;\r\n    bottom: -10px\r\n}\r\n\r\n.fb_dialog_vert_left, .fb_dialog_vert_right, .fb_dialog_horiz_top, .fb_dialog_horiz_bottom {\r\n    position: absolute;\r\n    background: #525252;\r\n    filter: alpha(opacity=70);\r\n    opacity: .7\r\n}\r\n\r\n.fb_dialog_vert_left, .fb_dialog_vert_right {\r\n    width: 10px;\r\n    height: 100%\r\n}\r\n\r\n.fb_dialog_vert_left {\r\n    margin-left: -10px\r\n}\r\n\r\n.fb_dialog_vert_right {\r\n    right: 0;\r\n    margin-right: -10px\r\n}\r\n\r\n.fb_dialog_horiz_top, .fb_dialog_horiz_bottom {\r\n    width: 100%;\r\n    height: 10px\r\n}\r\n\r\n.fb_dialog_horiz_top {\r\n    margin-top: -10px\r\n}\r\n\r\n.fb_dialog_horiz_bottom {\r\n    bottom: 0;\r\n    margin-bottom: -10px\r\n}\r\n\r\n.fb_dialog_iframe {\r\n    line-height: 0\r\n}\r\n\r\n.fb_dialog_content .dialog_title {\r\n    background: #6d84b4;\r\n    border: 1px solid #365899;\r\n    color: #fff;\r\n    font-size: 14px;\r\n    font-weight: bold;\r\n    margin: 0\r\n}\r\n\r\n.fb_dialog_content .dialog_title > span {\r\n    background: url(https://static.xx.fbcdn.net/rsrc.php/v3/yd/r/Cou7n-nqK52.gif) no-repeat 5px 50%;\r\n    float: left;\r\n    padding: 5px 0 7px 26px\r\n}\r\n\r\nbody.fb_hidden {\r\n    -webkit-transform: none;\r\n    height: 100%;\r\n    margin: 0;\r\n    overflow: visible;\r\n    position: absolute;\r\n    top: -10000px;\r\n    left: 0;\r\n    width: 100%\r\n}\r\n\r\n.fb_dialog.fb_dialog_mobile.loading {\r\n    background: url(https://static.xx.fbcdn.net/rsrc.php/v3/ya/r/3rhSv5V8j3o.gif) white no-repeat 50% 50%;\r\n    min-height: 100%;\r\n    min-width: 100%;\r\n    overflow: hidden;\r\n    position: absolute;\r\n    top: 0;\r\n    z-index: 10001\r\n}\r\n\r\n.fb_dialog.fb_dialog_mobile.loading.centered {\r\n    width: auto;\r\n    height: auto;\r\n    min-height: initial;\r\n    min-width: initial;\r\n    background: none\r\n}\r\n\r\n.fb_dialog.fb_dialog_mobile.loading.centered #fb_dialog_loader_spinner {\r\n    width: 100%\r\n}\r\n\r\n.fb_dialog.fb_dialog_mobile.loading.centered .fb_dialog_content {\r\n    background: none\r\n}\r\n\r\n.loading.centered #fb_dialog_loader_close {\r\n    color: #fff;\r\n    display: block;\r\n    padding-top: 20px;\r\n    clear: both;\r\n    font-size: 18px\r\n}\r\n\r\n#fb-root #fb_dialog_ipad_overlay {\r\n    background: rgba(0, 0, 0, .45);\r\n    position: absolute;\r\n    bottom: 0;\r\n    left: 0;\r\n    right: 0;\r\n    top: 0;\r\n    width: 100%;\r\n    min-height: 100%;\r\n    z-index: 10000\r\n}\r\n\r\n#fb-root #fb_dialog_ipad_overlay.hidden {\r\n    display: none\r\n}\r\n\r\n.fb_dialog.fb_dialog_mobile.loading iframe {\r\n    visibility: hidden\r\n}\r\n\r\n.fb_dialog_content .dialog_header {\r\n    -webkit-box-shadow: white 0 1px 1px -1px inset;\r\n    background: -webkit-gradient(linear, 0% 0%, 0% 100%, from(#738ABA), to(#2C4987));\r\n    border-bottom: 1px solid;\r\n    border-color: #1d4088;\r\n    color: #fff;\r\n    font: 14px Helvetica, sans-serif;\r\n    font-weight: bold;\r\n    text-overflow: ellipsis;\r\n    text-shadow: rgba(0, 30, 84, .296875) 0 -1px 0;\r\n    vertical-align: middle;\r\n    white-space: nowrap\r\n}\r\n\r\n.fb_dialog_content .dialog_header table {\r\n    -webkit-font-smoothing: subpixel-antialiased;\r\n    height: 43px;\r\n    width: 100%\r\n}\r\n\r\n.fb_dialog_content .dialog_header td.header_left {\r\n    font-size: 12px;\r\n    padding-left: 5px;\r\n    vertical-align: middle;\r\n    width: 60px\r\n}\r\n\r\n.fb_dialog_content .dialog_header td.header_right {\r\n    font-size: 12px;\r\n    padding-right: 5px;\r\n    vertical-align: middle;\r\n    width: 60px\r\n}\r\n\r\n.fb_dialog_content .touchable_button {\r\n    background: -webkit-gradient(linear, 0% 0%, 0% 100%, from(#4966A6), color-stop(.5, #355492), to(#2A4887));\r\n    border: 1px solid #29487d;\r\n    -webkit-background-clip: padding-box;\r\n    -webkit-border-radius: 3px;\r\n    -webkit-box-shadow: rgba(0, 0, 0, .117188) 0 1px 1px inset, rgba(255, 255, 255, .167969) 0 1px 0;\r\n    display: inline-block;\r\n    margin-top: 3px;\r\n    max-width: 85px;\r\n    line-height: 18px;\r\n    padding: 4px 12px;\r\n    position: relative\r\n}\r\n\r\n.fb_dialog_content .dialog_header .touchable_button input {\r\n    border: none;\r\n    background: none;\r\n    color: #fff;\r\n    font: 12px Helvetica, sans-serif;\r\n    font-weight: bold;\r\n    margin: 2px -12px;\r\n    padding: 2px 6px 3px 6px;\r\n    text-shadow: rgba(0, 30, 84, .296875) 0 -1px 0\r\n}\r\n\r\n.fb_dialog_content .dialog_header .header_center {\r\n    color: #fff;\r\n    font-size: 16px;\r\n    font-weight: bold;\r\n    line-height: 18px;\r\n    text-align: center;\r\n    vertical-align: middle\r\n}\r\n\r\n.fb_dialog_content .dialog_content {\r\n    background: url(https://static.xx.fbcdn.net/rsrc.php/v3/y9/r/jKEcVPZFk-2.gif) no-repeat 50% 50%;\r\n    border: 1px solid #555;\r\n    border-bottom: 0;\r\n    border-top: 0;\r\n    height: 150px\r\n}\r\n\r\n.fb_dialog_content .dialog_footer {\r\n    background: #f6f7f9;\r\n    border: 1px solid #555;\r\n    border-top-color: #ccc;\r\n    height: 40px\r\n}\r\n\r\n#fb_dialog_loader_close {\r\n    float: left\r\n}\r\n\r\n.fb_dialog.fb_dialog_mobile .fb_dialog_close_button {\r\n    text-shadow: rgba(0, 30, 84, .296875) 0 -1px 0\r\n}\r\n\r\n.fb_dialog.fb_dialog_mobile .fb_dialog_close_icon {\r\n    visibility: hidden\r\n}\r\n\r\n#fb_dialog_loader_spinner {\r\n    -webkit-animation: rotateSpinner 1.2s linear infinite;\r\n            animation: rotateSpinner 1.2s linear infinite;\r\n    background-color: transparent;\r\n    background-image: url(https://static.xx.fbcdn.net/rsrc.php/v3/yD/r/t-wz8gw1xG1.png);\r\n    background-repeat: no-repeat;\r\n    background-position: 50% 50%;\r\n    height: 24px;\r\n    width: 24px\r\n}\r\n\r\n@-webkit-keyframes rotateSpinner {\r\n    0% {\r\n        -webkit-transform: rotate(0deg);\r\n                transform: rotate(0deg)\r\n    }\r\n    100% {\r\n        -webkit-transform: rotate(360deg);\r\n                transform: rotate(360deg)\r\n    }\r\n}\r\n\r\n@keyframes rotateSpinner {\r\n    0% {\r\n        -webkit-transform: rotate(0deg);\r\n                transform: rotate(0deg)\r\n    }\r\n    100% {\r\n        -webkit-transform: rotate(360deg);\r\n                transform: rotate(360deg)\r\n    }\r\n}\r\n\r\n.fb_iframe_widget {\r\n    display: inline-block;\r\n    position: relative\r\n}\r\n\r\n.fb_iframe_widget span {\r\n    display: inline-block;\r\n    position: relative;\r\n    text-align: justify\r\n}\r\n\r\n.fb_iframe_widget iframe {\r\n    position: absolute\r\n}\r\n\r\n.fb_iframe_widget_fluid_desktop, .fb_iframe_widget_fluid_desktop span, .fb_iframe_widget_fluid_desktop iframe {\r\n    max-width: 100%\r\n}\r\n\r\n.fb_iframe_widget_fluid_desktop iframe {\r\n    min-width: 220px;\r\n    position: relative\r\n}\r\n\r\n.fb_iframe_widget_lift {\r\n    z-index: 1\r\n}\r\n\r\n.fb_hide_iframes iframe {\r\n    position: relative;\r\n    left: -10000px\r\n}\r\n\r\n.fb_iframe_widget_loader {\r\n    position: relative;\r\n    display: inline-block\r\n}\r\n\r\n.fb_iframe_widget_fluid {\r\n    display: inline\r\n}\r\n\r\n.fb_iframe_widget_fluid span {\r\n    width: 100%\r\n}\r\n\r\n.fb_iframe_widget_loader iframe {\r\n    min-height: 32px;\r\n    z-index: 2;\r\n    zoom: 1\r\n}\r\n\r\n.fb_iframe_widget_loader .FB_Loader {\r\n    background: url(https://static.xx.fbcdn.net/rsrc.php/v3/y9/r/jKEcVPZFk-2.gif) no-repeat;\r\n    height: 32px;\r\n    width: 32px;\r\n    margin-left: -16px;\r\n    position: absolute;\r\n    left: 50%;\r\n    z-index: 4\r\n}\r\n\r\n.fb_invisible_flow {\r\n    display: inherit;\r\n    height: 0;\r\n    overflow-x: hidden;\r\n    width: 0\r\n}\r\n\r\n.fb_mobile_overlay_active {\r\n    height: 100%;\r\n    overflow: hidden;\r\n    position: fixed;\r\n    width: 100%\r\n}\r\n\r\n.fb_shrink_active {\r\n    opacity: 1;\r\n    -webkit-transform: scale(1, 1);\r\n            transform: scale(1, 1);\r\n    -webkit-transition-duration: 200ms;\r\n            transition-duration: 200ms;\r\n    -webkit-transition-timing-function: ease-out;\r\n            transition-timing-function: ease-out\r\n}\r\n\r\n.fb_shrink_active:active {\r\n    opacity: .5;\r\n    -webkit-transform: scale(.75, .75);\r\n            transform: scale(.75, .75)\r\n}"];



/***/ }),

/***/ "./src/app/components/contents/register/register.component.ngfactory.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export RenderType_RegisterComponent */
/* unused harmony export View_RegisterComponent_0 */
/* unused harmony export View_RegisterComponent_Host_0 */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RegisterComponentNgFactory; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__login_login_component_css_ngstyle__ = __webpack_require__("./src/app/components/contents/login/login.component.css.ngstyle.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__register_component_css_ngstyle__ = __webpack_require__("./src/app/components/contents/register/register.component.css.ngstyle.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__register_component__ = __webpack_require__("./src/app/components/contents/register/register.component.ts");
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes}
 * tslint:disable
 */ 




var styles_RegisterComponent = [__WEBPACK_IMPORTED_MODULE_0__login_login_component_css_ngstyle__["a" /* styles */], __WEBPACK_IMPORTED_MODULE_1__register_component_css_ngstyle__["a" /* styles */]];
var RenderType_RegisterComponent = __WEBPACK_IMPORTED_MODULE_2__angular_core__["_11" /* ɵcrt */]({ encapsulation: 2, styles: styles_RegisterComponent, data: {} });

function View_RegisterComponent_0(_l) { return __WEBPACK_IMPORTED_MODULE_2__angular_core__["_31" /* ɵvid */](0, [(_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_29" /* ɵted */](-1, null, ["\n\n"])), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_13" /* ɵeld */](1, 0, null, null, 109, "div", [["class", "background-blue"], ["cz-shortcut-listen", "true"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_29" /* ɵted */](-1, null, ["\n    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_13" /* ɵeld */](3, 0, null, null, 106, "div", [["class", "login-box"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_29" /* ɵted */](-1, null, ["\n        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_13" /* ɵeld */](5, 0, null, null, 84, "form", [["enctype", "application/x-www-form-urlencoded"], ["id", "register-form"], ["method", "post"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_13" /* ɵeld */](7, 0, null, null, 0, "input", [["name", "_method"], ["type", "hidden"], ["value", "post"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_13" /* ɵeld */](9, 0, null, null, 0, "input", [["class", "width-box80 box"], ["name", "action"], ["type", "hidden"], ["value", "local"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_13" /* ɵeld */](11, 0, null, null, 1, "p", [["class", "title center"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_29" /* ɵted */](-1, null, ["\u0110\u0102NG K\u00DD T\u00C0I KHO\u1EA2N"])), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_13" /* ɵeld */](14, 0, null, null, 5, "p", [["class", "input-code"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_13" /* ɵeld */](16, 0, null, null, 0, "input", [["class", "width-box80 box"], ["name", "name"], ["placeholder", "H\u1ECD v\u00E0 t\u00EAn"], ["type", "text"], ["value", ""]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_13" /* ɵeld */](18, 0, null, null, 0, "label", [["class", "name-msg"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_29" /* ɵted */](-1, null, ["\n\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_13" /* ɵeld */](26, 0, null, null, 5, "p", [["class", "input-code"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_13" /* ɵeld */](28, 0, null, null, 0, "input", [["class", "width-box80 box"], ["name", "email"], ["placeholder", "Email"], ["type", "text"], ["value", ""]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_13" /* ɵeld */](30, 0, null, null, 0, "label", [["class", "email-msg"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_13" /* ɵeld */](37, 0, null, null, 5, "p", [["class", "input-code"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_13" /* ɵeld */](39, 0, null, null, 0, "input", [["class", "width-box80 box"], ["name", "phone"], ["placeholder", "Mobile"], ["type", "text"], ["value", ""]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_13" /* ɵeld */](41, 0, null, null, 0, "label", [["class", "phone-msg"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_13" /* ɵeld */](48, 0, null, null, 5, "p", [["class", "input-code"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_13" /* ɵeld */](50, 0, null, null, 0, "input", [["class", "width-box80 box"], ["name", "password"], ["placeholder", "M\u1EADt kh\u1EA9u"], ["type", "password"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_13" /* ɵeld */](52, 0, null, null, 0, "label", [["class", "password-msg"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_13" /* ɵeld */](60, 0, null, null, 5, "p", [["class", "input-code"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_13" /* ɵeld */](62, 0, null, null, 0, "input", [["class", "width-box80 box"], ["name", "repassword"], ["placeholder", "Nh\u1EADp l\u1EA1i m\u1EADt kh\u1EA9u"], ["type", "password"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_13" /* ɵeld */](64, 0, null, null, 0, "label", [["class", "repassword-msg"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_13" /* ɵeld */](72, 0, null, null, 16, "div", [["class", "center"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_13" /* ɵeld */](74, 0, null, null, 0, "p", [["class", "input-code"], ["id", "msg-com-error"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_13" /* ɵeld */](76, 0, null, null, 3, "p", [["class", "input-code"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_29" /* ɵted */](-1, null, ["\n                    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_13" /* ɵeld */](78, 0, null, null, 0, "input", [["class", "buttonDN btn btn-primary"], ["id", "btn-register-form"], ["type", "button"], ["value", "\u0110\u0102NG K\u00DD"]], null, [[null, "click"]], function (_v, en, $event) { var ad = true; var _co = _v.component; if (("click" === en)) {
        var pd_0 = (_co.clickRegister() !== false);
        ad = (pd_0 && ad);
    } return ad; }, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_13" /* ɵeld */](81, 0, null, null, 6, "p", [["class", "input-code"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_29" /* ɵted */](-1, null, ["\n                    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_13" /* ɵeld */](83, 0, null, null, 0, "br", [], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_29" /* ɵted */](-1, null, [" B\u1EA1n \u0111\u00E3 c\u00F3 t\u00E0i kho\u1EA3n?\n                    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_13" /* ɵeld */](85, 0, null, null, 1, "a", [["href", "/login"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_29" /* ɵted */](-1, null, ["\u0110\u0103ng nh\u1EADp"])), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_29" /* ɵted */](-1, null, ["\n        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_29" /* ɵted */](-1, null, ["\n        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_13" /* ɵeld */](91, 0, null, null, 1, "p", [["class", "slogan center margin"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_29" /* ɵted */](-1, null, ["ho\u1EB7c"])), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_29" /* ɵted */](-1, null, ["\n        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_13" /* ɵeld */](94, 0, null, null, 14, "div", [["class", "login-box-social"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_13" /* ɵeld */](96, 0, null, null, 11, "div", [["class", "input-code"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_13" /* ɵeld */](98, 0, null, null, 3, "div", [["id", "fb-login"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_29" /* ɵted */](-1, null, ["\n                    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_13" /* ɵeld */](100, 0, null, null, 0, "input", [["class", "buttonDN backgroud-fb btn btn btn-info"], ["type", "button"], ["value", "\u0110\u0103ng nh\u1EADp qua facebook"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_13" /* ɵeld */](103, 0, null, null, 3, "div", [["id", "google-login"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_29" /* ɵted */](-1, null, ["\n                    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_13" /* ɵeld */](105, 0, null, null, 0, "input", [["class", "buttonDN backgroud-fb btn btn-info"], ["type", "button"], ["value", "\u0110\u0103ng nh\u1EADp qua Google"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_29" /* ɵted */](-1, null, ["\n        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_29" /* ɵted */](-1, null, ["\n    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_29" /* ɵted */](-1, null, ["\n"])), (_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_29" /* ɵted */](-1, null, ["\n"]))], null, null); }
function View_RegisterComponent_Host_0(_l) { return __WEBPACK_IMPORTED_MODULE_2__angular_core__["_31" /* ɵvid */](0, [(_l()(), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_13" /* ɵeld */](0, 0, null, null, 1, "contents-register", [], null, null, null, View_RegisterComponent_0, RenderType_RegisterComponent)), __WEBPACK_IMPORTED_MODULE_2__angular_core__["_12" /* ɵdid */](1, 114688, null, 0, __WEBPACK_IMPORTED_MODULE_3__register_component__["a" /* RegisterComponent */], [], null, null)], function (_ck, _v) { _ck(_v, 1, 0); }, null); }
var RegisterComponentNgFactory = __WEBPACK_IMPORTED_MODULE_2__angular_core__["_9" /* ɵccf */]("contents-register", __WEBPACK_IMPORTED_MODULE_3__register_component__["a" /* RegisterComponent */], View_RegisterComponent_Host_0, {}, {}, []);



/***/ }),

/***/ "./src/app/components/contents/register/register.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RegisterComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_libSupports__ = __webpack_require__("./src/app/common/libSupports.ts");
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var RegisterComponent = /** @class */ (function (_super) {
    __extends(RegisterComponent, _super);
    function RegisterComponent() {
        return _super.call(this) || this;
    }
    RegisterComponent.prototype.ngOnInit = function () {
        this.urlRegister = 'api/register';
    };
    RegisterComponent.prototype.clickRegister = function () {
        var attrFromLogin = $('#register-form');
        var dataRequest = {
            url: this.urlRegister,
            data: attrFromLogin.serialize()
        };
        var self = this;
        this.callDataJS(dataRequest, function (result) {
            if (result) {
                if (result.validate) {
                    result.validate.forEach(function (val) {
                        console.log(val);
                        $('input[name="' + val.param + '"]').addClass('error');
                        $('label.' + val.param + '-msg').html(self.cnMessagesShow([val.msg], 'e'));
                    });
                }
                if (result.status) {
                    window.location = result.url;
                }
                else {
                    $('#msg-com-error').text(result.msg);
                }
            }
        });
    };
    return RegisterComponent;
}(__WEBPACK_IMPORTED_MODULE_0__common_libSupports__["a" /* libSupports */]));



/***/ }),

/***/ "./src/app/components/contents/sidebar/sidebar.component.css.shim.ngstyle.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return styles; });
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes}
 * tslint:disable
 */ 
var styles = [""];



/***/ }),

/***/ "./src/app/components/contents/sidebar/sidebar.component.ngfactory.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RenderType_SidebarComponent; });
/* harmony export (immutable) */ __webpack_exports__["b"] = View_SidebarComponent_0;
/* unused harmony export View_SidebarComponent_Host_0 */
/* unused harmony export SidebarComponentNgFactory */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__sidebar_component_css_shim_ngstyle__ = __webpack_require__("./src/app/components/contents/sidebar/sidebar.component.css.shim.ngstyle.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__sidebar_component__ = __webpack_require__("./src/app/components/contents/sidebar/sidebar.component.ts");
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes}
 * tslint:disable
 */ 



var styles_SidebarComponent = [__WEBPACK_IMPORTED_MODULE_0__sidebar_component_css_shim_ngstyle__["a" /* styles */]];
var RenderType_SidebarComponent = __WEBPACK_IMPORTED_MODULE_1__angular_core__["_11" /* ɵcrt */]({ encapsulation: 0, styles: styles_SidebarComponent, data: {} });

function View_SidebarComponent_0(_l) { return __WEBPACK_IMPORTED_MODULE_1__angular_core__["_31" /* ɵvid */](0, [(_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](0, 0, null, null, 370, "div", [["aria-label", "sidebar"], ["class", "show-votes"], ["id", "sidebar"], ["role", "complementary"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](2, 0, null, null, 31, "div", [["class", "module newuser newuser-greeting"], ["id", "newuser-box"], ["style", "display:none;"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](4, 0, null, null, 1, "h4", [], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["Hello World!"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](7, 0, null, null, 25, "div", [], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](9, 0, null, null, 4, "p", [], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["This is a collaboratively edited question and answer site for "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](11, 0, null, null, 1, "b", [], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["professional and enthusiast\n                programmers"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, [".\n                It's 100% free."])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](15, 0, null, null, 4, "p", [], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["Got a question about the site itself? "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](17, 0, null, null, 1, "a", [["href", "https://meta.stackoverflow.com"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["meta"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, [" is the place to\n                talk\n                about things like what questions are appropriate, what tags we should use, etc."])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](21, 0, null, null, 10, "p", [["class", "ar"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](23, 0, null, null, 1, "a", [["href", "/tour?mnu=1"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["about \u00BB"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\u00A0\u00A0\u00A0\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](26, 0, null, null, 1, "a", [["href", "/help?mnu=1"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["help \u00BB"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                \u00A0 "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](29, 0, null, null, 1, "a", [["href", "https://meta.stackoverflow.com"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["meta \u00BB"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](36, 0, null, null, 58, "div", [["class", "module question-stats"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](38, 0, null, null, 55, "table", [["id", "qinfo"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](40, 0, null, null, 52, "tbody", [], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](42, 0, null, null, 14, "tr", [], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](44, 0, null, null, 4, "td", [], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](46, 0, null, null, 1, "p", [["class", "label-key"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["asked"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](50, 0, null, null, 5, "td", [["style", "padding-left: 10px"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](52, 0, null, null, 2, "p", [["class", "label-key"], ["title", "2009-04-24 04:38:11Z"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](53, 0, null, null, 1, "b", [], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["8 years, 6 months ago"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](58, 0, null, null, 16, "tr", [], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](60, 0, null, null, 4, "td", [], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](62, 0, null, null, 1, "p", [["class", "label-key"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["viewed"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](66, 0, null, null, 7, "td", [["style", "padding-left: 10px"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](68, 0, null, null, 4, "p", [["class", "label-key"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](70, 0, null, null, 1, "b", [], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["283,854 times"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](76, 0, null, null, 15, "tr", [], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](78, 0, null, null, 4, "td", [], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](80, 0, null, null, 1, "p", [["class", "label-key"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["active"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](84, 0, null, null, 6, "td", [["style", "padding-left: 10px"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](86, 0, null, null, 3, "p", [["class", "label-key"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](87, 0, null, null, 2, "b", [], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](88, 0, null, null, 1, "a", [["class", "lastactivity-link"], ["href", "?lastactivity"], ["title", "2017-11-10 11:03:29Z"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["7\n                        days ago"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](96, 0, null, null, 86, "div", [["class", "module community-bulletin"], ["data-tracker", "cb=1"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](98, 0, null, null, 83, "div", [["class", "related"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](100, 0, null, null, 1, "div", [["class", "bulletin-title"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                Featured on Meta\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](103, 0, null, null, 0, "hr", [], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](105, 0, null, null, 17, "div", [["class", "spacer"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](107, 0, null, null, 6, "div", [["class", "bulletin-item-type"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](109, 0, null, null, 3, "a", [["class", "question-hyperlink"], ["href", "https://meta.stackoverflow.com/questions/357951/what-can-we-put-in-a-question-template-to-help-people-ask-better-questions?cb=1"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](111, 0, null, null, 0, "div", [["class", "favicon favicon-stackoverflowmeta"], ["title", "Meta Stack Overflow"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](115, 0, null, null, 4, "div", [["class", "bulletin-item-content"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](117, 0, null, null, 1, "a", [["class", "question-hyperlink"], ["href", "https://meta.stackoverflow.com/questions/357951/what-can-we-put-in-a-question-template-to-help-people-ask-better-questions?cb=1"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["What can we put in a question template to help people ask better\n                        questions?"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](121, 0, null, null, 0, "br", [["class", "cbt"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](124, 0, null, null, 17, "div", [["class", "spacer"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](126, 0, null, null, 6, "div", [["class", "bulletin-item-type"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](128, 0, null, null, 3, "a", [["class", "question-hyperlink"], ["href", "https://meta.stackoverflow.com/questions/358943/what-s-happening-with-channels?cb=1"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](130, 0, null, null, 0, "div", [["class", "favicon favicon-stackoverflowmeta"], ["title", "Meta Stack Overflow"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](134, 0, null, null, 4, "div", [["class", "bulletin-item-content"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](136, 0, null, null, 1, "a", [["class", "question-hyperlink"], ["href", "https://meta.stackoverflow.com/questions/358943/what-s-happening-with-channels?cb=1"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["What\u2019s Happening With Channels?"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](140, 0, null, null, 0, "br", [["class", "cbt"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](143, 0, null, null, 1, "div", [["class", "bulletin-title"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                Hot Meta Posts\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](146, 0, null, null, 0, "hr", [], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](148, 0, null, null, 15, "div", [["class", "spacer"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](150, 0, null, null, 4, "div", [["class", "bulletin-item-type"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](152, 0, null, null, 1, "span", [["title", "Vote score (upvotes - downvotes)"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["35"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](156, 0, null, null, 4, "div", [["class", "bulletin-item-content"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](158, 0, null, null, 1, "a", [["class", "question-hyperlink"], ["href", "https://meta.stackoverflow.com/questions/359476/why-am-i-earning-documentation-privileges?cb=1"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["Why am I earning documentation privileges?"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](162, 0, null, null, 0, "br", [["class", "cbt"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](165, 0, null, null, 15, "div", [["class", "spacer"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](167, 0, null, null, 4, "div", [["class", "bulletin-item-type"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](169, 0, null, null, 1, "span", [["title", "Vote score (upvotes - downvotes)"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["16"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](173, 0, null, null, 4, "div", [["class", "bulletin-item-content"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](175, 0, null, null, 1, "a", [["class", "question-hyperlink"], ["href", "https://meta.stackoverflow.com/questions/359408/audit-questions-also-teach-so-why-arent-they-manually-cultivated?cb=1"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["Audit questions also teach, so why aren't they manually\n                        cultivated?"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](179, 0, null, null, 0, "br", [["class", "cbt"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](184, 0, null, null, 0, "div", [["class", "everyonelovesstackoverflow"], ["id", "dfp-tsb"], ["style", "display: none;"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](186, 0, null, null, 34, "div", [["class", "blue tagged tex2jax_ignore x-rem clc-jobs-multi"], ["id", "hireme"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](187, 0, null, null, 19, "a", [["class", "top "], ["data-clc-click", "https://clc.stackoverflow.com/click?an=48r_xeV1Uveqh27lG78wJiaW2R_1L2y_zbh-i5l2cP4102zGj363A44HMkgy9GxgYGiwZ2RkYJFmWvGffeNZzunHBLklGVIO5AsssnRKZLaXZlq9gmNzE9f5dUKyIPHjzBsto4-bAMV3zeI4_IFzZ7eQAkg8rXeFJV-JLFB8fhvH1Y-cV3uFnEHidn5zLZe8k7dnWDHLlDHH-ty9QCEA&cr=10439&ct=1&url=https%3A%2F%2Fstackoverflow.com%2Fjobs%2Fremote-developer-jobs%3Fmed=clc&sig=rjSgb5uTCXxEmA"], ["href", "https://stackoverflow.com/jobs/remote-developer-jobs"], ["target", "_blank"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](189, 0, null, null, 14, ":svg:svg", [["height", "46"], ["viewBox", "0 0 46 46"], ["width", "46"], ["xmlns", "http://www.w3.org/2000/svg"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](191, 0, null, null, 11, ":svg:g", [["fill", "#FFF"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](193, 0, null, null, 0, ":svg:path", [["d", "M33.35 25.265H11.955c-3.036.182-5.642-2.15-5.823-5.211-.18-3.06 2.133-5.69 5.168-5.871.323-4.711 3.746-8.615 8.343-9.514 4.597-.9 9.22 1.43 11.266 5.677a7.54 7.54 0 0 1 7.96 2.15 7.694 7.694 0 0 1 1.313 8.204 7.58 7.58 0 0 1-6.887 4.565h.055z"], ["opacity", ".3"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](195, 0, null, null, 0, ":svg:path", [["d", "M39.181 18.453a7.301 7.301 0 0 0-1.245-7.784 7.148 7.148 0 0 0-7.546-2.04.392.392 0 0 1-.477-.205c-1.948-4.128-6.418-6.405-10.868-5.536-4.45.87-7.755 4.664-8.035 9.229a.393.393 0 0 1-.368.368c-2.819.169-4.968 2.611-4.8 5.456.168 2.844 2.59 5.011 5.43 4.841h21.381a7.188 7.188 0 0 0 6.528-4.33zm-.66-8.309a8.087 8.087 0 0 1 1.38 8.624 7.973 7.973 0 0 1-7.244 4.8h-21.36c-3.253.194-6.045-2.305-6.239-5.581-.186-3.16 2.113-5.892 5.194-6.256.44-4.77 3.95-8.698 8.643-9.614 4.692-.916 9.404 1.407 11.578 5.667 2.9-.81 6.019.095 8.048 2.36z"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](197, 0, null, null, 0, ":svg:path", [["d", "M18.948 5.75l.614-.151a.393.393 0 0 0-.188-.763l-.613.151a.393.393 0 0 0 .187.763zm-4.977 5.15a7.252 7.252 0 0 1 2.807-4.083.393.393 0 0 0-.456-.64 8.038 8.038 0 0 0-3.11 4.525.393.393 0 0 0 .759.198zm14.841 18.6v7.659a2.346 2.346 0 0 1-2.335 2.357h-9.695a2.346 2.346 0 0 1-2.335-2.357V29.5a.393.393 0 1 0-.785 0v7.659c0 1.735 1.396 3.143 3.12 3.143h9.695c1.724 0 3.12-1.408 3.12-3.143V29.5a.393.393 0 1 0-.785 0z"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](199, 0, null, null, 0, ":svg:path", [["d", "M16.904 29.431v-6.256a.393.393 0 1 0-.785 0v6.256a.393.393 0 1 0 .785 0zm9.419 0v-6.256a.393.393 0 1 0-.785 0v6.256a.393.393 0 1 0 .785 0zm-4.7 8.052c-.978 0-1.77-.798-1.77-1.782 0-.983.792-1.781 1.77-1.781s1.77.798 1.77 1.781c0 .984-.792 1.782-1.77 1.782zm0-.786a.99.99 0 0 0 .985-.996.99.99 0 0 0-.985-.996.99.99 0 0 0-.985.996c0 .55.441.996.985.996z"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](201, 0, null, null, 0, ":svg:path", [["d", "M11.955 29.631h19.322a.393.393 0 0 0 0-.786H11.955a.393.393 0 0 0 0 .786zm28.295 8.455h-2.073c-1.723 0-3.12 1.408-3.12 3.143v1.375a2.346 2.346 0 0 1-2.334 2.357h-8.346a2.346 2.346 0 0 1-2.335-2.357v-2.75a.393.393 0 1 0-.784 0v2.75c0 1.735 1.396 3.143 3.12 3.143h8.345c1.723 0 3.12-1.408 3.12-3.143v-1.375a2.346 2.346 0 0 1 2.334-2.357h2.073a.393.393 0 0 0 0-.786z"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](205, 0, null, null, 1, "span", [], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["Work from anywhere"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](208, 0, null, null, 10, "div", [["class", "middle"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](210, 0, null, null, 7, "ul", [["class", "jobs"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](212, 0, null, null, 4, "li", [["class", "x-rem-footer"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](213, 0, null, null, 1, "p", [], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["Work remotely - from home or wherever you choose."])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](215, 0, null, null, 1, "a", [["class", "x-rem-cta"], ["data-clc-click", "https://clc.stackoverflow.com/click?an=48r_xeV1Uveqh27lG78wJiaW2R_1L2y_zbh-i5l2cP4102zGj363A44HMkgy9GxgYGiwZ2RkYJFmWvGffeNZzunHBLklGVIO5AsssnRKZLaXZlq9gmNzE9f5dUKyIPHjzBsto4-bAMV3zeI4_IFzZ7eQAkg8rXeFJV-JLFB8fhvH1Y-cV3uFnEHidn5zLZe8k7dnWDHLlDHH-ty9QCEA&cr=10439&ct=2&url=https%3A%2F%2Fstackoverflow.com%2Fjobs%2Fremote-developer-jobs%3Fmed=clc&sig=g90VKURYjXnGvg"], ["href", "https://stackoverflow.com/jobs/remote-developer-jobs"], ["target", "_blank"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["Browse\n                    remote jobs"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](220, 0, null, null, 0, "img", [["class", "impression"], ["src", "https://clc.stackoverflow.com/impression.gif?an=48r_xeV1Uveqh27lG78wJiaW2R_1L2y_zbh-i5l2cP4102zGj363A44HMkgy9GxgYGiwZ2RkYJFmWvGffeNZzunHBLklGVIO5AsssnRKZLaXZlq9gmNzE9f5dUKyIPHjzBsto4-bAMV3zeI4_IFzZ7eQAkg8rXeFJV-JLFB8fhvH1Y-cV3uFnEHidn5zLZe8k7dnWDHLlDHH-ty9QCEA&md=693"], ["style", "display: none;"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n\n    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n\n    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](224, 0, null, null, 44, "div", [["style", "margin-bottom: 10px;"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](226, 0, null, null, 41, "div", [["id", "newsletter-ad"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](228, 0, null, null, 4, "p", [["id", "newsletter-ad-header"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["Get the "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](230, 0, null, null, 1, "b", [], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["weekly newsletter!"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, [" In it, you'll get:"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](234, 0, null, null, 10, "ul", [], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](236, 0, null, null, 1, "li", [], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["The week's top questions and answers"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](239, 0, null, null, 1, "li", [], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["Important community announcements"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](242, 0, null, null, 1, "li", [], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["Questions that need answers"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](246, 0, null, null, 1, "div", [["id", "newsletter-signup-container"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](247, 0, null, null, 0, "input", [["id", "newsletter-signup"], ["type", "button"], ["value", "Sign up for the newsletter"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](249, 0, null, null, 3, "p", [["id", "newsletter-preview-container"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["see an "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](251, 0, null, null, 1, "a", [["href", "https://stackexchange.com/newsletters/newsletter?site=stackoverflow.com"], ["id", "newsletter-preview"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["example\n                newsletter"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](254, 0, null, null, 12, "div", [["class", "dno"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](256, 0, null, null, 7, "p", [["class", "privacy-policy-agreement"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                    By subscribing, you agree to the "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](258, 0, null, null, 1, "a", [["href", "https://stackexchange.com/legal/privacy-policy"], ["name", "privacy"], ["target", "_blank"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["privacy policy"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, [" and "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](261, 0, null, null, 1, "a", [["href", "https://stackexchange.com/legal/terms-of-service"], ["name", "tos"], ["target", "_blank"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["terms of\n                    service"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["."])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](265, 0, null, null, 0, "input", [["name", "legalLinksShown"], ["type", "hidden"], ["value", "1"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n\n    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n\n\n    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](270, 0, null, null, 99, "div", [["class", "module sidebar-related"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](272, 0, null, null, 1, "h4", [["id", "h-related"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["Related"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](275, 0, null, null, 93, "div", [["class", "related js-gps-related-questions"], ["data-tracker", "rq=1"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](277, 0, null, null, 7, "div", [["class", "spacer js-gps-track"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](278, 0, null, null, 4, "a", [["href", "https://stackoverflow.com/q/154059?rq=1"], ["title", "Vote score (upvotes - downvotes)"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](280, 0, null, null, 1, "div", [["class", "answer-votes answered-accepted extra-large"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["1896"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](283, 0, null, null, 1, "a", [["class", "question-hyperlink"], ["href", "https://stackoverflow.com/questions/154059/how-do-you-check-for-an-empty-string-in-javascript?rq=1"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["How do you check for an empty string in JavaScript?"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](286, 0, null, null, 7, "div", [["class", "spacer js-gps-track"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](287, 0, null, null, 4, "a", [["href", "https://stackoverflow.com/q/263965?rq=1"], ["title", "Vote score (upvotes - downvotes)"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](289, 0, null, null, 1, "div", [["class", "answer-votes answered-accepted extra-large"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["1552"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](292, 0, null, null, 1, "a", [["class", "question-hyperlink"], ["href", "https://stackoverflow.com/questions/263965/how-can-i-convert-a-string-to-boolean-in-javascript?rq=1"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["How can I convert a string to boolean in JavaScript?"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](295, 0, null, null, 7, "div", [["class", "spacer js-gps-track"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](296, 0, null, null, 4, "a", [["href", "https://stackoverflow.com/q/646628?rq=1"], ["title", "Vote score (upvotes - downvotes)"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](298, 0, null, null, 1, "div", [["class", "answer-votes answered-accepted extra-large"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["1455"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](301, 0, null, null, 1, "a", [["class", "question-hyperlink"], ["href", "https://stackoverflow.com/questions/646628/how-to-check-if-a-string-startswith-another-string?rq=1"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["How to check if a string \u201CStartsWith\u201D another string?"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](304, 0, null, null, 7, "div", [["class", "spacer js-gps-track"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](305, 0, null, null, 4, "a", [["href", "https://stackoverflow.com/q/784313?rq=1"], ["title", "Vote score (upvotes - downvotes)"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](307, 0, null, null, 1, "div", [["class", "answer-votes answered-accepted default"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["14"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](310, 0, null, null, 1, "a", [["class", "question-hyperlink"], ["href", "https://stackoverflow.com/questions/784313/read-line-break-in-a-string-with-javascript?rq=1"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["Read line break in a string with JavaScript"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](313, 0, null, null, 7, "div", [["class", "spacer js-gps-track"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](314, 0, null, null, 4, "a", [["href", "https://stackoverflow.com/q/901115?rq=1"], ["title", "Vote score (upvotes - downvotes)"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](316, 0, null, null, 1, "div", [["class", "answer-votes answered-accepted extra-large"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["2706"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](319, 0, null, null, 1, "a", [["class", "question-hyperlink"], ["href", "https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript?rq=1"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["How can I get query string values in JavaScript?"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](322, 0, null, null, 8, "div", [["class", "spacer js-gps-track"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](323, 0, null, null, 4, "a", [["href", "https://stackoverflow.com/q/1026069?rq=1"], ["title", "Vote score (upvotes - downvotes)"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](325, 0, null, null, 1, "div", [["class", "answer-votes extra-large"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["2586"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](328, 0, null, null, 1, "a", [["class", "question-hyperlink"], ["href", "https://stackoverflow.com/questions/1026069/how-do-i-make-the-first-letter-of-a-string-uppercase-in-javascript?rq=1"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["How do I make the first letter of a string uppercase in JavaScript?"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](332, 0, null, null, 7, "div", [["class", "spacer js-gps-track"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](333, 0, null, null, 4, "a", [["href", "https://stackoverflow.com/q/1144783?rq=1"], ["title", "Vote score (upvotes - downvotes)"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](335, 0, null, null, 1, "div", [["class", "answer-votes answered-accepted extra-large"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["2700"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](338, 0, null, null, 1, "a", [["class", "question-hyperlink"], ["href", "https://stackoverflow.com/questions/1144783/how-to-replace-all-occurrences-of-a-string-in-javascript?rq=1"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["How to replace all occurrences of a string in JavaScript?"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](341, 0, null, null, 8, "div", [["class", "spacer js-gps-track"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](342, 0, null, null, 4, "a", [["href", "https://stackoverflow.com/q/1789945?rq=1"], ["title", "Vote score (upvotes - downvotes)"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](344, 0, null, null, 1, "div", [["class", "answer-votes answered-accepted extra-large"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["6874"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](347, 0, null, null, 1, "a", [["class", "question-hyperlink"], ["href", "https://stackoverflow.com/questions/1789945/how-to-check-whether-a-string-contains-a-substring-in-javascript?rq=1"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["How to check whether a string contains a substring in JavaScript?"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](351, 0, null, null, 7, "div", [["class", "spacer js-gps-track"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](352, 0, null, null, 4, "a", [["href", "https://stackoverflow.com/q/5062614?rq=1"], ["title", "Vote score (upvotes - downvotes)"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](354, 0, null, null, 1, "div", [["class", "answer-votes answered-accepted extra-large"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["2201"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](357, 0, null, null, 1, "a", [["class", "question-hyperlink"], ["href", "https://stackoverflow.com/questions/5062614/how-to-decide-when-to-use-node-js?rq=1"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["How to decide when to use Node.js?"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](360, 0, null, null, 7, "div", [["class", "spacer js-gps-track"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](361, 0, null, null, 4, "a", [["href", "https://stackoverflow.com/q/23740548?rq=1"], ["title", "Vote score (upvotes - downvotes)"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](363, 0, null, null, 1, "div", [["class", "answer-votes answered-accepted large"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["476"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](366, 0, null, null, 1, "a", [["class", "question-hyperlink"], ["href", "https://stackoverflow.com/questions/23740548/how-to-pass-variables-and-data-from-php-to-javascript?rq=1"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["How to pass variables and data from PHP to JavaScript?"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n"]))], null, null); }
function View_SidebarComponent_Host_0(_l) { return __WEBPACK_IMPORTED_MODULE_1__angular_core__["_31" /* ɵvid */](0, [(_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](0, 0, null, null, 1, "contents-home-sidebar", [], null, null, null, View_SidebarComponent_0, RenderType_SidebarComponent)), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_12" /* ɵdid */](1, 114688, null, 0, __WEBPACK_IMPORTED_MODULE_2__sidebar_component__["a" /* SidebarComponent */], [], null, null)], function (_ck, _v) { _ck(_v, 1, 0); }, null); }
var SidebarComponentNgFactory = __WEBPACK_IMPORTED_MODULE_1__angular_core__["_9" /* ɵccf */]("contents-home-sidebar", __WEBPACK_IMPORTED_MODULE_2__sidebar_component__["a" /* SidebarComponent */], View_SidebarComponent_Host_0, {}, {}, []);



/***/ }),

/***/ "./src/app/components/contents/sidebar/sidebar.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SidebarComponent; });
var SidebarComponent = /** @class */ (function () {
    function SidebarComponent() {
    }
    SidebarComponent.prototype.ngOnInit = function () {
    };
    return SidebarComponent;
}());



/***/ }),

/***/ "./src/app/components/layouts/footer/footer.component.css.ngstyle.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return styles; });
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes}
 * tslint:disable
 */ 
var styles = [""];



/***/ }),

/***/ "./src/app/components/layouts/footer/footer.component.ngfactory.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RenderType_FooterComponent; });
/* harmony export (immutable) */ __webpack_exports__["b"] = View_FooterComponent_0;
/* unused harmony export View_FooterComponent_Host_0 */
/* unused harmony export FooterComponentNgFactory */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__footer_component_css_ngstyle__ = __webpack_require__("./src/app/components/layouts/footer/footer.component.css.ngstyle.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__footer_component__ = __webpack_require__("./src/app/components/layouts/footer/footer.component.ts");
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes}
 * tslint:disable
 */ 



var styles_FooterComponent = [__WEBPACK_IMPORTED_MODULE_0__footer_component_css_ngstyle__["a" /* styles */]];
var RenderType_FooterComponent = __WEBPACK_IMPORTED_MODULE_1__angular_core__["_11" /* ɵcrt */]({ encapsulation: 2, styles: styles_FooterComponent, data: {} });

function View_FooterComponent_0(_l) { return __WEBPACK_IMPORTED_MODULE_1__angular_core__["_31" /* ɵvid */](0, [(_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](0, 0, null, null, 45, "div", [["class", "-container"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](2, 0, null, null, 42, "div", [["class", "g-row"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](4, 0, null, null, 39, "div", [["class", "-copyright g-row jc-end"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](6, 0, null, null, 36, "div", [["class", "g-column jc-sp-between"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](8, 0, null, null, 18, "ul", [["class", "-list"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](10, 0, null, null, 2, "li", [["class", "-item"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](11, 0, null, null, 1, "a", [["class", "js-gps-track -link"], ["data-gps-track", "footer.click({ location: 2, link:4 })"], ["href", "https://stackoverflow.blog?blb=1"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["Blog"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](14, 0, null, null, 2, "li", [["class", "-item"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](15, 0, null, null, 1, "a", [["class", "-link"], ["href", "https://www.facebook.com/officialstackoverflow/"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["Facebook"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](18, 0, null, null, 2, "li", [["class", "-item"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](19, 0, null, null, 1, "a", [["class", "-link"], ["href", "https://twitter.com/stackoverflow"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["Twitter"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](22, 0, null, null, 3, "li", [["class", "-item"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](23, 0, null, null, 1, "a", [["class", "-link"], ["href", "https://linkedin.com/company/stack-overflow"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["LinkedIn"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](28, 0, null, null, 13, "div", [], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](30, 0, null, null, 10, "p", [], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                        site design / logo \u00A9 2017 Stack Exchange Inc; user contributions licensed under "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](32, 0, null, null, 1, "a", [["class", "-link"], ["href", "https://creativecommons.org/licenses/by-sa/3.0/"], ["rel", "license"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["cc by-sa\n                        3.0"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                        with "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](35, 0, null, null, 1, "a", [["class", "-link"], ["href", "https://stackoverflow.blog/2009/06/25/attribution-required/"], ["rel", "license"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["attribution required"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, [".\n                        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](38, 0, null, null, 1, "span", [["id", "svnrev"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["rev\u00A02017.11.16.27769"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n\n"]))], null, null); }
function View_FooterComponent_Host_0(_l) { return __WEBPACK_IMPORTED_MODULE_1__angular_core__["_31" /* ɵvid */](0, [(_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](0, 0, null, null, 1, "app-footer", [], null, null, null, View_FooterComponent_0, RenderType_FooterComponent)), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_12" /* ɵdid */](1, 114688, null, 0, __WEBPACK_IMPORTED_MODULE_2__footer_component__["a" /* FooterComponent */], [], null, null)], function (_ck, _v) { _ck(_v, 1, 0); }, null); }
var FooterComponentNgFactory = __WEBPACK_IMPORTED_MODULE_1__angular_core__["_9" /* ɵccf */]("app-footer", __WEBPACK_IMPORTED_MODULE_2__footer_component__["a" /* FooterComponent */], View_FooterComponent_Host_0, {}, {}, []);



/***/ }),

/***/ "./src/app/components/layouts/footer/footer.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FooterComponent; });
var FooterComponent = /** @class */ (function () {
    function FooterComponent() {
    }
    FooterComponent.prototype.ngOnInit = function () {
    };
    return FooterComponent;
}());



/***/ }),

/***/ "./src/app/components/layouts/header/header.component.css.shim.ngstyle.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return styles; });
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes}
 * tslint:disable
 */ 
var styles = [""];



/***/ }),

/***/ "./src/app/components/layouts/header/header.component.ngfactory.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RenderType_HeaderComponent; });
/* harmony export (immutable) */ __webpack_exports__["b"] = View_HeaderComponent_0;
/* unused harmony export View_HeaderComponent_Host_0 */
/* unused harmony export HeaderComponentNgFactory */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__header_component_css_shim_ngstyle__ = __webpack_require__("./src/app/components/layouts/header/header.component.css.shim.ngstyle.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__header_component__ = __webpack_require__("./src/app/components/layouts/header/header.component.ts");
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes}
 * tslint:disable
 */ 



var styles_HeaderComponent = [__WEBPACK_IMPORTED_MODULE_0__header_component_css_shim_ngstyle__["a" /* styles */]];
var RenderType_HeaderComponent = __WEBPACK_IMPORTED_MODULE_1__angular_core__["_11" /* ɵcrt */]({ encapsulation: 0, styles: styles_HeaderComponent, data: {} });

function View_HeaderComponent_0(_l) { return __WEBPACK_IMPORTED_MODULE_1__angular_core__["_31" /* ɵvid */](0, [(_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](0, 0, null, null, 295, "header", [["class", "top-bar js-top-bar _fixed"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](2, 0, null, null, 292, "div", [["class", "-container"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](4, 0, null, null, 37, "div", [["class", "-main"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](6, 0, null, null, 4, "a", [["class", "-logo js-gps-track"], ["data-gps-track", "top_nav.click({is_current:false, location:2, destination:8})"], ["href", "#"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](8, 0, null, null, 1, "span", [["class", "-img _glyph"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["Stack Overflow"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](12, 0, null, null, 28, "nav", [["aria-label", "site navigation"], ["class", "navigation"], ["role", "navigation"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](14, 0, null, null, 25, "ol", [["class", "-list"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](16, 0, null, null, 4, "li", [["class", "-item _current"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](18, 0, null, null, 1, "a", [["class", "-link js-gps-track"], ["data-gps-track", "top_nav.click({is_current:true, location:2, destination:1})"], ["href", "/questions"], ["id", "nav-questions"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["Questions"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](22, 0, null, null, 4, "li", [["class", "-item"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](24, 0, null, null, 1, "a", [["class", "-link js-gps-track"], ["data-gps-track", "top_nav.click({is_current:false, location:2, destination:6})"], ["href", "/jobs?med=site-ui&ref=jobs-tab"], ["id", "nav-jobs"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["Developer\n                            Jobs"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](28, 0, null, null, 4, "li", [["class", "-item"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](30, 0, null, null, 1, "a", [["class", "-link js-gps-track"], ["data-gps-track", "top_nav.click({is_current:false, location:2, destination:2})"], ["href", "/tags"], ["id", "nav-tags"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["Tags"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](34, 0, null, null, 4, "li", [["class", "-item"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](36, 0, null, null, 1, "a", [["class", "-link js-gps-track"], ["data-gps-track", "top_nav.click({is_current:false, location:2, destination:3})"], ["href", "/users"], ["id", "nav-users"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["Users"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n\n        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](43, 0, null, null, 11, "form", [["action", "/search"], ["autocomplete", "off"], ["class", "searchbar"], ["id", "search"], ["method", "get"], ["role", "search"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](45, 0, null, null, 0, "input", [["autocomplete", "off"], ["class", "f-input js-search-field"], ["maxlength", "240"], ["name", "q"], ["placeholder", "Search\u2026"], ["tabindex", "1"], ["type", "text"], ["value", ""]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](47, 0, null, null, 6, "button", [["aria-label", "Search..."], ["class", "btn-topbar-primary js-search-submit"], ["type", "submit"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](49, 0, null, null, 3, ":svg:svg", [["aria-hidden", "true"], ["class", "svg-icon iconSearch"], ["height", "18"], ["viewBox", "0 0 18 18"], ["width", "18"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](51, 0, null, null, 0, ":svg:path", [["d", ""]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](56, 0, null, null, 237, "div", [["class", "-actions"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](58, 0, null, null, 10, "a", [["class", "my-profile js-gps-track"], ["data-gps-track", "profile_summary.click()"], ["href", "/users/3000159/user3000159"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](60, 0, null, null, 1, "div", [["class", "gravatar-wrapper-24"], ["title", "user3000159"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](61, 0, null, null, 0, "img", [["alt", ""], ["class", "-avatar js-avatar-me"], ["height", "24"], ["src", "#"], ["width", "24"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](63, 0, null, null, 1, "div", [["class", "-rep js-header-rep"], ["title", "your reputation: 1"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["1"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](66, 0, null, null, 1, "div", [["class", "-badges"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](70, 0, null, null, 222, "nav", [["class", "secondary-nav"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](72, 0, null, null, 170, "div", [["class", "-dialog-container js-topbar-dialog-corral"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](74, 0, null, null, 113, "div", [["class", "topbar-dialog siteSwitcher-dialog dno"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](76, 0, null, null, 6, "div", [["class", "header"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](78, 0, null, null, 3, "h3", [], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](79, 0, null, null, 1, "a", [["href", "#"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["current community"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](84, 0, null, null, 37, "div", [["class", "modal-content current-site-container"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](86, 0, null, null, 34, "ul", [["class", "current-site"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](88, 0, null, null, 18, "li", [], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                                    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](90, 0, null, null, 10, "div", [["class", "related-links"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                                        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](92, 0, null, null, 1, "a", [["class", "js-gps-track"], ["data-gps-track", "site_switcher.click({ item_type:14 })"], ["href", "#"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["help"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                                        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](95, 0, null, null, 1, "a", [["class", "js-gps-track"], ["data-gps-track", "site_switcher.click({ item_type:6 })"], ["href", "#"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["chat"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                                        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](98, 0, null, null, 1, "a", [["class", "js-gps-track"], ["data-gps-track", "site_switcher.click({ item_type:8 })"], ["href", "#"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["log out"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                                    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                                    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](102, 0, null, null, 3, "a", [["class", "current-site-link site-link js-gps-track"], ["data-gps-track", "site_switcher.click({ item_type:3 })"], ["data-id", "1"], ["href", "#"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                                        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](104, 0, null, null, 0, "div", [["class", "favicon favicon-stackoverflow site-icon"], ["title", "Stack Overflow"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                                        Stack Overflow\n                                    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n\n                                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](108, 0, null, null, 11, "li", [["class", "related-site"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                                    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](110, 0, null, null, 3, "div", [["class", "L-shaped-icon-container"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                                        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](112, 0, null, null, 0, "span", [["class", "L-shaped-icon"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                                    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n\n                                    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](115, 0, null, null, 3, "a", [["class", "site-link js-gps-track"], ["data-gps-track", "site.switch({ target_site:552, item_type:3 }),site_switcher.click({ item_type:4 })"], ["data-id", "552"], ["href", "#"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                                        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](117, 0, null, null, 0, "div", [["class", "favicon favicon-stackoverflowmeta site-icon"], ["title", "Meta Stack Overflow"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                                        Meta Stack Overflow\n                                    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n\n                                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n\n                        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](123, 0, null, null, 13, "div", [["class", "header"], ["id", "your-communities-header"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](125, 0, null, null, 4, "h3", [], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](127, 0, null, null, 1, "a", [["href", "#"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["your communities"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n\n                            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](131, 0, null, null, 1, "a", [["href", "#"], ["id", "edit-pinned-sites"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["edit"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](134, 0, null, null, 1, "a", [["href", "#"], ["id", "cancel-pinned-sites"], ["style", "display: none;"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["cancel"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](138, 0, null, null, 32, "div", [["class", "modal-content"], ["id", "your-communities-section"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n\n                            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](140, 0, null, null, 12, "ul", [["class", "my-sites"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](142, 0, null, null, 9, "li", [], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                                    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](144, 0, null, null, 6, "a", [["class", "site-link js-gps-track"], ["data-gps-track", "site.switch({ target_site:1, item_type:3 }),site_switcher.click({ item_type:1 })"], ["data-id", "1"], ["href", "#"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                                        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](146, 0, null, null, 0, "div", [["class", "favicon favicon-stackoverflow site-icon"], ["title", "Stack Overflow"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                                        Stack Overflow\n                                        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](148, 0, null, null, 1, "span", [["class", "rep-score"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["1"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                                    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n\n                                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](154, 0, null, null, 15, "div", [["class", "pinned-site-editor-container"], ["style", "display: none;"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](156, 0, null, null, 0, "input", [["class", "site-filter-input"], ["id", "js-site-search-txt"], ["placeholder", "Add a Stack Exchange community"], ["type", "text"], ["value", ""]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](158, 0, null, null, 0, "input", [["disabled", "disabled"], ["id", "pin-site-btn"], ["type", "submit"], ["value", "Add"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](160, 0, null, null, 0, "ul", [["class", "js-found-sites found-sites"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](162, 0, null, null, 1, "ul", [["class", "pinned-site-list sortable"], ["data-custom-list", "False"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](165, 0, null, null, 0, "input", [["disabled", "disabled"], ["id", "save-pinned-sites-btn"], ["type", "submit"], ["value", "Save"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](167, 0, null, null, 1, "a", [["href", "#"], ["id", "reset-pinned-sites"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["reset to default list"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n\n                        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](172, 0, null, null, 9, "div", [["class", "header"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](174, 0, null, null, 3, "h3", [], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](175, 0, null, null, 1, "a", [["href", "#"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["more stack exchange communities"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](179, 0, null, null, 1, "a", [["class", "fr"], ["href", "#"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["company blog"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](183, 0, null, null, 3, "div", [["class", "modal-content"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](185, 0, null, null, 0, "div", [["class", "child-content"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](189, 0, null, null, 52, "div", [["class", "topbar-dialog help-dialog js-help-dialog dno"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](191, 0, null, null, 49, "div", [["class", "modal-content"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](193, 0, null, null, 46, "ul", [], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](195, 0, null, null, 7, "li", [], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                                    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](197, 0, null, null, 4, "a", [["class", "js-gps-track"], ["data-gps-track", "help_popup.click({ item_type:1 })"], ["href", "/tour"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                                        Tour\n                                        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](199, 0, null, null, 1, "span", [["class", "item-summary"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                                Start here for a quick overview of the site\n                            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                                    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](204, 0, null, null, 7, "li", [], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                                    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](206, 0, null, null, 4, "a", [["class", "js-gps-track"], ["data-gps-track", "help_popup.click({ item_type:4 })"], ["href", "/help"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                                        Help Center\n                                        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](208, 0, null, null, 1, "span", [["class", "item-summary"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                            Detailed answers to any questions you might have\n                        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                                    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](213, 0, null, null, 7, "li", [], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                                    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](215, 0, null, null, 4, "a", [["class", "js-gps-track"], ["data-gps-track", "help_popup.click({ item_type:2 })"], ["href", "#"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                                        Meta\n                                        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](217, 0, null, null, 1, "span", [["class", "item-summary"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                                    Discuss the workings and policies of this site\n                                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                                    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](222, 0, null, null, 7, "li", [], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                                    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](224, 0, null, null, 4, "a", [["class", "js-gps-track"], ["data-gps-track", "help_popup.click({ item_type:6 })"], ["href", "#"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                                        About Us\n                                        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](226, 0, null, null, 1, "span", [["class", "item-summary"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                                    Learn more about Stack Overflow the company\n                                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                                    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](231, 0, null, null, 7, "li", [], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                                    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](233, 0, null, null, 4, "a", [["class", "js-gps-track"], ["data-gps-track", "help_popup.click({ item_type:7 })"], ["href", "#"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                                        Business\n                                        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](235, 0, null, null, 1, "span", [["class", "item-summary"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                                    Learn more about hiring developers or posting ads with us\n                                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                                    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](244, 0, null, null, 47, "ol", [["class", "-list"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](246, 0, null, null, 11, "li", [["class", "-item"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](248, 0, null, null, 8, "a", [["class", "-link js-inbox-button"], ["href", "#"], ["title", "Recent inbox messages"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](250, 0, null, null, 3, ":svg:svg", [["aria-hidden", "true"], ["class", "svg-icon iconInbox"], ["height", "18"], ["viewBox", "0 0 20 18"], ["width", "20"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](252, 0, null, null, 0, ":svg:path", [["d", ""]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](255, 0, null, null, 0, "span", [["class", "indicator-badge js-unread-count _important"], ["style", "display: none;"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](259, 0, null, null, 11, "li", [["class", "-item"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](261, 0, null, null, 8, "a", [["class", "-link js-achievements-button"], ["data-unread-class", "_highlighted-positive"], ["href", "#"], ["title", "Recent achievements: reputation, badges, and privileges earned"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](263, 0, null, null, 3, ":svg:svg", [["aria-hidden", "true"], ["class", "svg-icon iconAchievements"], ["height", "18"], ["viewBox", "0 0 18 18"], ["width", "18"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](265, 0, null, null, 0, ":svg:path", [["d", ""]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](268, 0, null, null, 0, "span", [["class", "indicator-badge js-unread-count _positive"], ["style", "display: none;"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](272, 0, null, null, 7, "li", [["class", "-item"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](273, 0, null, null, 6, "a", [["class", "-link js-help-button"], ["href", "#"], ["title", "Help Center and other resources"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](275, 0, null, null, 3, ":svg:svg", [["aria-hidden", "true"], ["class", "svg-icon iconHelp"], ["height", "18"], ["viewBox", "0 0 18 18"], ["width", "18"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](277, 0, null, null, 0, ":svg:path", [["d", ""]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](281, 0, null, null, 9, "li", [["class", "-item"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](283, 0, null, null, 6, "a", [["class", "-link js-site-switcher-button js-gps-track"], ["data-gps-track", "site_switcher.show"], ["href", "#"], ["title", "A list of all 171 Stack Exchange sites"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](285, 0, null, null, 3, ":svg:svg", [["aria-hidden", "true"], ["class", "svg-icon iconStackExchange"], ["height", "18"], ["viewBox", "0 0 18 18"], ["width", "18"]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](287, 0, null, null, 0, ":svg:path", [["d", ""]], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n                    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n\n                "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n            "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n        "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n    "])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n"]))], null, null); }
function View_HeaderComponent_Host_0(_l) { return __WEBPACK_IMPORTED_MODULE_1__angular_core__["_31" /* ɵvid */](0, [(_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](0, 0, null, null, 1, "app-header", [], null, null, null, View_HeaderComponent_0, RenderType_HeaderComponent)), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_12" /* ɵdid */](1, 114688, null, 0, __WEBPACK_IMPORTED_MODULE_2__header_component__["a" /* HeaderComponent */], [], null, null)], function (_ck, _v) { _ck(_v, 1, 0); }, null); }
var HeaderComponentNgFactory = __WEBPACK_IMPORTED_MODULE_1__angular_core__["_9" /* ɵccf */]("app-header", __WEBPACK_IMPORTED_MODULE_2__header_component__["a" /* HeaderComponent */], View_HeaderComponent_Host_0, {}, {}, []);



/***/ }),

/***/ "./src/app/components/layouts/header/header.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HeaderComponent; });
var HeaderComponent = /** @class */ (function () {
    function HeaderComponent() {
    }
    HeaderComponent.prototype.ngOnInit = function () {
    };
    return HeaderComponent;
}());



/***/ }),

/***/ "./src/app/components/layouts/nav/nav.component.css.shim.ngstyle.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return styles; });
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes}
 * tslint:disable
 */ 
var styles = [""];



/***/ }),

/***/ "./src/app/components/layouts/nav/nav.component.ngfactory.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RenderType_NavComponent; });
/* harmony export (immutable) */ __webpack_exports__["b"] = View_NavComponent_0;
/* unused harmony export View_NavComponent_Host_0 */
/* unused harmony export NavComponentNgFactory */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__nav_component_css_shim_ngstyle__ = __webpack_require__("./src/app/components/layouts/nav/nav.component.css.shim.ngstyle.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__nav_component__ = __webpack_require__("./src/app/components/layouts/nav/nav.component.ts");
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes}
 * tslint:disable
 */ 



var styles_NavComponent = [__WEBPACK_IMPORTED_MODULE_0__nav_component_css_shim_ngstyle__["a" /* styles */]];
var RenderType_NavComponent = __WEBPACK_IMPORTED_MODULE_1__angular_core__["_11" /* ɵcrt */]({ encapsulation: 0, styles: styles_NavComponent, data: {} });

function View_NavComponent_0(_l) { return __WEBPACK_IMPORTED_MODULE_1__angular_core__["_31" /* ɵvid */](0, [(_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](0, 0, null, null, 1, "p", [], null, null, null, null, null)), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n    nav works!\n"])), (_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_29" /* ɵted */](-1, null, ["\n"]))], null, null); }
function View_NavComponent_Host_0(_l) { return __WEBPACK_IMPORTED_MODULE_1__angular_core__["_31" /* ɵvid */](0, [(_l()(), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_13" /* ɵeld */](0, 0, null, null, 1, "app-nav", [], null, null, null, View_NavComponent_0, RenderType_NavComponent)), __WEBPACK_IMPORTED_MODULE_1__angular_core__["_12" /* ɵdid */](1, 114688, null, 0, __WEBPACK_IMPORTED_MODULE_2__nav_component__["a" /* NavComponent */], [], null, null)], function (_ck, _v) { _ck(_v, 1, 0); }, null); }
var NavComponentNgFactory = __WEBPACK_IMPORTED_MODULE_1__angular_core__["_9" /* ɵccf */]("app-nav", __WEBPACK_IMPORTED_MODULE_2__nav_component__["a" /* NavComponent */], View_NavComponent_Host_0, {}, {}, []);



/***/ }),

/***/ "./src/app/components/layouts/nav/nav.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return NavComponent; });
var NavComponent = /** @class */ (function () {
    function NavComponent() {
    }
    NavComponent.prototype.ngOnInit = function () {
    };
    return NavComponent;
}());



/***/ }),

/***/ "./src/app/components/services/api-chat.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ApiServiceChat; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_common_http__ = __webpack_require__("./node_modules/@angular/common/esm5/http.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_add_observable_of__ = __webpack_require__("./node_modules/rxjs/_esm5/add/observable/of.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_catch__ = __webpack_require__("./node_modules/rxjs/_esm5/add/operator/catch.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_operators__ = __webpack_require__("./node_modules/rxjs/_esm5/operators.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_operators_tap__ = __webpack_require__("./node_modules/rxjs/_esm5/operators/tap.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__common_CustomsHttpClient__ = __webpack_require__("./src/app/common/CustomsHttpClient.ts");







var ApiServiceChat = /** @class */ (function () {
    function ApiServiceChat(httpClient, customsHttpClient) {
        this.httpClient = httpClient;
        this.customsHttpClient = customsHttpClient;
    }
    ApiServiceChat.prototype.getIndexChat = function () {
        return this.httpClient
            .get('/api/chat', { headers: this.customsHttpClient.setHeader() })
            .pipe(Object(__WEBPACK_IMPORTED_MODULE_4_rxjs_operators_tap__["a" /* tap */])(function (data) { return data; }), Object(__WEBPACK_IMPORTED_MODULE_3_rxjs_operators__["a" /* catchError */])(this.customsHttpClient.handleError));
    };
    ApiServiceChat.prototype.hack = function (myObj) {
        if (myObj) {
            return Object.keys(myObj).map(function (x) { return myObj[x]; });
        }
    };
    // Create a shared method that shows an alert when someone buys a deal
    ApiServiceChat.prototype.purchase = function (item) {
        alert("You bought the: " + item);
    };
    return ApiServiceChat;
}());



/***/ }),

/***/ "./src/app/components/services/api-user.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ApiServiceUser; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_CustomsHttpClient__ = __webpack_require__("./src/app/common/CustomsHttpClient.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_operators_tap__ = __webpack_require__("./node_modules/rxjs/_esm5/operators/tap.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_operators_catchError__ = __webpack_require__("./node_modules/rxjs/_esm5/operators/catchError.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_common_http__ = __webpack_require__("./node_modules/@angular/common/esm5/http.js");





var ApiServiceUser = /** @class */ (function () {
    function ApiServiceUser(httpClient, customsHttpClient) {
        this.httpClient = httpClient;
        this.customsHttpClient = customsHttpClient;
    }
    ApiServiceUser.prototype.logout = function () {
        return this.httpClient
            .post('/api/logout', null, { headers: this.customsHttpClient.setHeader() })
            .pipe(Object(__WEBPACK_IMPORTED_MODULE_1_rxjs_operators_tap__["a" /* tap */])(function (data) { return data; }), Object(__WEBPACK_IMPORTED_MODULE_2_rxjs_operators_catchError__["a" /* catchError */])(this.customsHttpClient.handleError));
    };
    return ApiServiceUser;
}());



/***/ }),

/***/ "./src/app/pipes/pipes-keys.pipe.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return KeysPipe; });

var KeysPipe = /** @class */ (function () {
    function KeysPipe() {
    }
    KeysPipe.prototype.transform = function (value, args) {
        var keys = [];
        for (var key in value) {
            keys.push({ key: key, value: value[key] });
        }
        return keys;
    };
    return KeysPipe;
}());



/***/ }),

/***/ "./src/app/services/auth/auth-guard.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AuthGuard; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_router__ = __webpack_require__("./node_modules/@angular/router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__auth_service__ = __webpack_require__("./src/app/services/auth/auth.service.ts");



var AuthGuard = /** @class */ (function () {
    function AuthGuard(authService, router) {
        this.authService = authService;
        this.router = router;
    }
    AuthGuard.prototype.canActivate = function (route, state) {
        var url = state.url;
        return this.checkLogin(url);
    };
    AuthGuard.prototype.canActivateChild = function (route, state) {
        return this.canActivate(route, state);
    };
    AuthGuard.prototype.canLoad = function (route) {
        var url = "/" + route.path;
        return this.checkLogin(url);
    };
    AuthGuard.prototype.checkLogin = function (url) {
        if (this.authService.isLoggedIn || localStorage.getItem('idToken')) {
            return true;
        }
        // Store the attempted URL for redirecting
        this.authService.redirectUrl = url ? url : '/';
        //------------------------------------------------
        // // Create a dummy session id
        // let sessionId = 123456789;
        // // Set our navigation extras object
        // // that contains our global query params and fragment
        // let navigationExtras: NavigationExtras = {
        //     queryParams: {'session_id': sessionId},
        //     fragment: 'anchor'
        // };
        //
        // // Navigate to the login page with extras
        // this.router.navigate(['/login'], navigationExtras);
        //------------------------------------------------
        this.router.navigate(['/login']);
        return false;
    };
    return AuthGuard;
}());



/***/ }),

/***/ "./src/app/services/auth/auth.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AuthService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rxjs_add_observable_of__ = __webpack_require__("./node_modules/rxjs/_esm5/add/observable/of.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_add_operator_do__ = __webpack_require__("./node_modules/rxjs/_esm5/add/operator/do.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_delay__ = __webpack_require__("./node_modules/rxjs/_esm5/add/operator/delay.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__ = __webpack_require__("./node_modules/rxjs/_esm5/Observable.js");




// import {JwtHelperService } from '@auth0/angular-jwt';

var AuthService = /** @class */ (function () {
    function AuthService() {
        this.isLoggedIn = false;
    }
    // constructor(public jwtHelper: JwtHelperService ) {
    // }
    AuthService.prototype.login = function () {
        var _this = this;
        return __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__["a" /* Observable */].of(true).delay(1000).do(function (val) {
            _this.isLoggedIn = true;
        });
    };
    AuthService.prototype.logout = function () {
        this.isLoggedIn = false;
    };
    AuthService.prototype.isAuthenticated = function () {
        // Check whether the token is expired and return
        // true or false
        // return !this.jwtHelper.isTokenExpired(localStorage.getItem('idToken'));
        return true;
    };
    return AuthService;
}());



/***/ }),

/***/ "./src/app/services/auth/can-deactivate-guard.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CanDeactivateGuard; });
var CanDeactivateGuard = /** @class */ (function () {
    function CanDeactivateGuard() {
    }
    CanDeactivateGuard.prototype.canDeactivate = function (component) {
        return component.canDeactivate ? component.canDeactivate() : true;
    };
    return CanDeactivateGuard;
}());



/***/ }),

/***/ "./src/app/services/auth/role-login-guard.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RoleLoginGuardService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_router__ = __webpack_require__("./node_modules/@angular/router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__auth_service__ = __webpack_require__("./src/app/services/auth/auth.service.ts");



var RoleLoginGuardService = /** @class */ (function () {
    function RoleLoginGuardService(authService, router) {
        this.authService = authService;
        this.router = router;
    }
    // private jwtHelper: JwtHelper = new JwtHelper();
    RoleLoginGuardService.prototype.canActivate = function (route) {
        var idToken = localStorage.getItem('idToken');
        if (idToken) {
            // const expectedRole = route.data.expectedRole;
            // const tokenPayload = this.jwtHelper.decodeToken(idToken);
            // if (this.authService.isAuthenticated() || tokenPayload.role === expectedRole) {
            if (this.authService.isAuthenticated()) {
                this.router.navigate(['/']);
                return false;
            }
            else {
                return true;
            }
        }
        else {
            return true;
        }
    };
    return RoleLoginGuardService;
}());



/***/ }),

/***/ "./src/environments/environment.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return environment; });
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
var environment = {
    production: false
};


/***/ }),

/***/ "./src/main.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__environments_environment__ = __webpack_require__("./src/environments/environment.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_module_ngfactory__ = __webpack_require__("./src/app/app.module.ngfactory.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_platform_browser__ = __webpack_require__("./node_modules/@angular/platform-browser/esm5/platform-browser.js");




if (__WEBPACK_IMPORTED_MODULE_1__environments_environment__["a" /* environment */].production) {
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_1" /* enableProdMode */])();
}
__WEBPACK_IMPORTED_MODULE_3__angular_platform_browser__["i" /* platformBrowser */]().bootstrapModuleFactory(__WEBPACK_IMPORTED_MODULE_2__app_app_module_ngfactory__["a" /* AppModuleNgFactory */])
    .catch(function (err) { return console.log(err); });


/***/ }),

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("./src/main.ts");


/***/ }),

/***/ 1:
/***/ (function(module, exports) {

/* (ignored) */

/***/ })

},[0]);
//# sourceMappingURL=main.bundle.js.map