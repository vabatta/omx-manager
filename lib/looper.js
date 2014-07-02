var Looper = function(array, loop) {
	var that = {};

	var current = 0;
  var getNext = function() {
    if (current === array.length) {
      if (loop) {
        current = 0;
      } else {
        return null;
      }
    }
    return array[current++];
  };

  that.getNext = getNext;
  return that;
}

module.exports = Looper;
