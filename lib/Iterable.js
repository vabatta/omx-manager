/**
 * @private
 * @class Iterable
 * @desc Create an Iterable array.
 * @param  {Array<any>} array The array to iterate
 * @param  {boolean} loop If wrap around array when reaching end
 * @return {Iterable} New instance.
 */
var Iterable = function Iterable(array, loop) {
  /**
   * Array to iterate.
   * @private
   * @member {Array<any>}
   */
  this._array = array;

  /**
   * If need to wrap around when reaching array's end.
   * @private
   * @member {boolean}
   */
  this._loop = loop;

  /**
   * Current index.
   * @private
   * @member {number}
   */
  this._current = 0;

  /**
   * Length of the underlaying array.
   * @type {number}
   * @memberof Iterable
   */
  this.length = array.length;

  // Return reference for instantation
  return this;
};

/**
 * Get the current item in array.
 */
Iterable.prototype.get = function get() {
  if (this._current === this._array.length) {
    if (this._loop) {
      this._current = 0;
    }
    else {
      return null;
    }
  }

  return this._array[this._current];
};

/**
 * Move to next video.
 */
Iterable.prototype.next = function next() {
  this._current += 1;
};

/**
 * Returns the underlaying array.
 */
Iterable.prototype.toArray = function toArray() {
  return this._array;
};

/**
 * Returns current index of the array.
 */
Iterable.prototype.getCurrentIndex = function getCurrentIndex() {
  return this._current;
};

/**
 * Set loop wrap around array when reaching end.
 */
Iterable.prototype.setLoop = function setLoop() {
  this._loop = true;
};

// Expose the class
module.exports = Iterable;
