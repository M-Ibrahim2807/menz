import BaseModel from './BaseModel';

class User extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.id = data.id || null;
    this.username = data.username || '';
    this.email = data.email || '';
    this.phone = data.phone || '';
    this.address = data.address || '';
    this.user_type = data.user_type || 'customer';
    this.date_joined = data.date_joined || '';
  }

  static fromJSON(data) {
    return new User(data);
  }
}

export default User;