const getSlidesAmount = () => {
  if (window.innerWidth < 991) return 2;
  return 3;
};

export { getSlidesAmount };
