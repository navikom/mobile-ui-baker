function createObject(object: any, keys: string[], value: any) {
  const key = keys.shift();
  if (!key) return;
  if (keys.length) {
    if (!object[key]) {
      object[key] = {};
    }
    createObject(object[key], keys, value);
    return;
  }
  object[key] = value;
}

export default function parseModel(model: any) {
  Object.keys(model).forEach((key: string) => {
    if (key.includes(".")) {
      const keys = key.split(".");
      createObject(model, keys, model[key]);
      delete model[key];
    }
  });
}
