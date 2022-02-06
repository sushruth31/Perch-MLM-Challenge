//deep recursive function to compare if objects are truly equal

export default function areObjectsEqual(o1, o2) {
  if (o1 === o2) return true;

  if (o1 === null || o2 === null || typeof o1 !== "object" || typeof o2 !== "object") return false;

  const o1Keys = Object.keys(o1);
  const o2Keys = Object.keys(o2);

  if (o1Keys.length !== o2Keys.length) return false;

  if (!o1Keys.every(key => o2Keys.includes(key))) return false;

  //recursively call this function to keep compare the values of every key until something gets returned

  for (const key of o1Keys) {
    if (!areObjectsEqual(o1[key], o2[key])) return false;
  }

  return true;
}
