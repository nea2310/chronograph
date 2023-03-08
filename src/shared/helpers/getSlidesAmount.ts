const getSlidesAmount = () => {
  if (window.innerWidth < 991) return 2;
  if (window.innerWidth < 320) return 1;
  return 3;
};

export { getSlidesAmount };
