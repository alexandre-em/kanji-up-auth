export abstract class Entity<T> {
  protected props: T;

  constructor(props: T) {
    this.props = props;
  }

  get(key: keyof T) {
    return this.props[key];
  }

  set(key: keyof T, value: T[keyof T]) {
    if (this.props[key] instanceof Array) throw new Error('the property is an array, use push/remove instead');
    this.props[key] = value;
  }

  push(key: keyof T, value: T[keyof T]) {
    if (this.props[key] instanceof Array) this.props[key].push(value);
    else throw new Error('the property is not an array');
  }

  remove(key: keyof T, value: T[keyof T]) {
    if (this.props[key] instanceof Array) this.props[key].splice(this.props[key].indexOf(value), 1);
    else throw new Error('the property is not an array');
  }
}

export * from './users';
