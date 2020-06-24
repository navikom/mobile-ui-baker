export function insertSubstring(str: string, index: number, value: string) {
  return str.substr(0, index) + value + str.substr(index);
}

export function findStem(arr: string[]) {
  const n = arr.length;

  if(!n) {
    return '';
  }

  // Take first word from array as reference
  const s = arr[0];
  const len = s.length;

  let res = '';

  for (let i = 0; i < len; i++) {
    for (let j = i + 1; j <= len; j++) {

      // generating all possible substrings
      // of our reference string arr[0] i.e s
      const stem = s.substring(i, j);
      let k = 1;
      for (k = 1; k < n; k++)

        // Check if the generated stem is
        // common to all words
        if (!arr[k].includes(stem))
          break;

      // If current substring is present in
      // all strings and its length is greater
      // than current result
      if (k === n && res.length < stem.length) {
        res = stem;
      }
    }
  }

  return res;
}

export function uniqueNameDefinition(arr: string[], name: string, depth: number): string {
  const newName = name + depth;
  const index = arr.indexOf(newName);
  if(index > -1) {
    return uniqueNameDefinition(arr, name, depth + 1);
  }
  return newName;
}
