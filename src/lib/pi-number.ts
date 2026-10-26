export const getPINumber = (): string => {
  const dateStr = new Date().toLocaleDateString().replace(/\//g, "");
  const base36Time = Date.now().toString(36);
  const piNumber = `MMF-${dateStr}-${base36Time}`;

  return piNumber;
};
