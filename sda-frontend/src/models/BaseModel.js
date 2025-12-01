class BaseModel {
  constructor(data = {}) {
    Object.assign(this, data);
  }

  toJSON() {
    return { ...this };
  }

  static fromJSON(data) {
    return new this(data);
  }
}

export default BaseModel;