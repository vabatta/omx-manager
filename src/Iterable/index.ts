
/**
 * @description Class representing an iterable array.
 * @private
 * @export
 * @class Iterable
 */
export class Iterable {
  /**
   * @description Array to iterate.
   * @private
   * @type {Array<any>}
   * @memberof Iterable
   */
  private array: Array<any>

  /**
   * @description Flag to enable the loop wrap when reaching the end of the array.
   * @private
   * @type {boolean}
   * @memberof Iterable
   */
  private loop: boolean

  /**
   * @description Current pointing index.
   * @private
   * @type {number}
   * @memberof Iterable
   */
  private current: number

  /**
   *Creates an instance of Iterable.
   * @param {Array<any>} array
   * @param {boolean} [loop=false]
   * @memberof Iterable
   */
  constructor (array: Array<any>, loop: boolean = false) {
    // initialize class members
    // the underlaying array
    this.array = array
    // if we need to loop, defaults to false
    this.loop = loop
    // initial pointer to item
    this.current = 0
  }

  /**
   * @description Get the current item in array.
   * @returns {?any}
   * @memberof Iterable
   */
  public get (): any | null {
    // If we are a the end, wrap around if loop or return null
    if (this.current === this.array.length) {
      if (this.loop) this.current = 0
      else return null
    }

    // Return the item in case we loop
    return this.array[this.current]
  }

  /**
   * @description Move the pointer to the next video.
   * @memberof Iterable
   */
  public next (): void {
    this.current += 1
  }

  /**
   * @description Returns a new copy of the underlaying array.
   * @returns {Array<any>}
   * @memberof Iterable
   */
  public toArray (): Array<any> {
    return this.array.slice()
  }

  /**
   * @description Returns current index of the array.
   * @returns {number}
   * @memberof Iterable
   */
  public getCurrentIndex (): number {
    return this.current
  }

  /**
   * @description Set to loop wrap around the array when reaching the end.
   * @memberof Iterable
   */
  public setLoop (): void {
    this.loop = true
  }
}
