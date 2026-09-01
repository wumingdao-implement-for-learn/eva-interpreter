export class Type {
  constructor(name) {
    this.name = name;
  }

  /**
   * Returns name
   */
  getName() {
    return this.name;
  }

  /**
   * String representation
   */
  to_string() {
    return this.getName();
  }

  /**
   * Equal
   */
  equals(other) {
    return this.name === other.name;
  }
}

/**
 * Number Type
 */
Type.number = new Type("number");

/**
 * String Type
 */
Type.string = new Type("string");
