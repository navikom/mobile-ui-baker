export const isObject = function(obj: any) {
  const type = typeof obj;
  return type === "function" || (type === "object" && !!obj);
};
