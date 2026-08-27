/**
 * Environment: names storage
 */

export class Environment {
  /**
   * Creates an environment with given record
   */
  constructor(record = {}, parent = null) {
    this.record = record;
    this.parent = parent;
  }

  /**
   * Creares a variable with given name and value
   */
  define(name, value) {
    this.record[name] = value;
    return value;
  }

  /**
   * returns the value of a variable, or throws
   * if the variable is not defined
   */
  lookup(name) {
    if (!this.record.hasOwnProperty(name)) {
      throw new ReferenceError(`Variable "${name}" is not defined`);
    }
    return this.record[name];
  }
}
