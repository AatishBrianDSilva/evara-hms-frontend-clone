export const sortColumnWithStringPrefix = (a: string, b: string) => {
  const a1 = a.split("-")[1];
  const b1 = b.split("-")[1];
  return a1.localeCompare(b1);
};
