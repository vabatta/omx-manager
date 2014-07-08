/*---- Prototype ----*/
var _this = {};


/*---- Members ----*/
var _array;
var _loop;
var _current;


/*---- Functions ----*/
/**
 * @function Looper.getNext
 * @description Get the next item in array and move the cursor forward.
 * @returns {Object}
 */
_this.getNext = function () {
  if (_current === _array.length) {
    if (_loop) {
      _current = 0;
    } else {
      return null;
    }
  }
  return _array[_current++];
};


/** 
 * @class
 * @static
 * @description 
 * This class is used to iterate over an array. <br />
 * This class is <b>static</b>.
 * @param array {Array} - The array to iterate over
 * @param [loop=false] {Boolean} - If must loop over the array
 * @throws {TypeError} Argument "array" must be an Array
 */
var Looper = function (array, loop) {
  if (!(array instanceof Array)) throw new TypeError('Argument "array" must be an Array!');
  if (typeof loop === 'undefined') loop = false;

  _array = array;
  _loop = loop;
  _current = 0;

  return _this;
};

module.exports = Looper;
