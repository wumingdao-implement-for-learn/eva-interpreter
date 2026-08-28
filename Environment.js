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
   * Updates existing variable
   */
  assign(name, value) {
    this.resolve(name).record[name] = value;
    return value;
  }

  /**
   * returns the value of a variable, or throws
   * if the variable is not defined
   */
  lookup(name) {
    return this.resolve(name).record[name];
  }

  resolve(name) {
    if (!this.record.hasOwnProperty(name)) {
      if (this.parent) {
        return this.parent.resolve(name);
      }
      throw new ReferenceError(`Variable "${name}" is not defined`);
    }

    return this;
  }
}
