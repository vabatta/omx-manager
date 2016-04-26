// @flow

/**
 * @class
 * @description
 * This class is used to iterate over an array.
 */
class Iterable {
  /**
   * @private
   * Array to iterate.
   * @type {Array<any>}
   */
  _array: Array<any> = [];

  /**
   * @private
   * If need to wrap around when reaching array's end.
   * @type {boolean}
   */
  _loop: boolean = false;

  /**
   * @private
   * Current index.
   * @type {number}
   */
  _current: number = 0;

  /**
   * Length of the underlaying array.
   * @type {number}
   */
  length: number;

  /**
   * Create an Iterable array.
   * @param  {Array<any>} array The array to iterate
   * @param  {boolean} loop If wrap around array when reaching end
   * @return {Iterable}
   */
  constructor (array: Array<any>, loop: boolean = false) {
    this._array = array
    this._loop = loop
    this.length = array.length
  }

  /**
   * Get the current item in array.
   */
  get (): any {
    if (this._current === this._array.length) {
      if (this._loop) {
        this._current = 0
      } else {
        return null
      }
    }

    return this._array[this._current]
  }

  /**
   * Get the current item in array and move the cursor forward.
   */
  getNext (): any {
    let item = this.get()
    if (item === null) {
      return null
    } else {
      this._current++

      return item
    }
  }

  /**
   * Returns the underlaying array.
   */
  toArray (): Array<any> {
    return this._array
  }

  /**
   * Returns current index of the array.
   */
  getCurrentIndex (): number {
    return this._current
  }
}

// Export class
export default Iterable