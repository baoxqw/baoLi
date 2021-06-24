/**
 * 客户端数据持久化
 * @class Storage
 */
class Storage {
  constructor(type = window.localStorage) {
    this.storage = type;
  }

  get(key) {
    let result = this.storage.getItem(key);
    try {
      result = JSON.parse(result);
    } catch (err) {}

    return result;
  }

  set(key, value) {
    let setValue = value;
    try {
      setValue = JSON.stringify(value);
    } catch (err) {}

    return this.storage.setItem(key, setValue);
  }

  remove(key) {
    if (key instanceof Array) {
      key.forEach(itemKey => {
        this.storage.removeItem(itemKey);
      });
      return true;
    }
    this.storage.removeItem('key');
    return true;
  }
}

export default new Storage();
