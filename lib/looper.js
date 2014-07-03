/** @constructor
 * @param array {Array} - The array to iterate over
 * @param [loop=false] {Boolean} - If must loop over the array
 */
function Looper(array, loop) {
  if (!(array instanceof Array)) throw new TypeError('Argument "array" must be an Array!');
  if (typeof loop !== 'boolean') loop = false;

  this.array = array;
  this.loop = loop;
  this.currentIndex = 0;
};

/**
 * Get the next item in array and move the cursor forward.
 * @returns {Object}
 */
Looper.prototype.getNext = function() {
  if (this.currentIndex === this.array.length) {
    if (this.loop) {
      this.currentIndex = 0;
    } else {
      return null;
    }
  }
  return this.array[this.currentIndex++];
};

module.exports = Looper;
