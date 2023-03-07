const getYears = (
  eventsList: {
    index: number;
    year: number;
    description: string;
  }[]
) => Object.values(eventsList).map((item) => item.year);

export { getYears };
