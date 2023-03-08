import { FC, useEffect, useState } from 'react';

import './Years.scss';

type Props = {
  from: number;
  to: number;
  delay?: number;
};

const Years: FC<Props> = ({ from, to, delay = 100 }) => {
  const [yearFrom, setYearFrom] = useState(from);
  const [yearTo, setYearTo] = useState(to);

  useEffect(() => {
    setTimeout(() => {
      if (yearFrom !== from) {
        setYearFrom(yearFrom > from ? yearFrom - 1 : yearFrom + 1);
      }

      if (yearTo !== to) {
        setYearTo(yearTo > to ? yearTo - 1 : yearTo + 1);
      }
    }, delay);
  }, [delay, yearFrom, yearTo, to, from]);

  return (
    <div className="years">
      <span className="years__year years__year_type_from">{yearFrom}</span>
      <span className="years__year years__year_type_to">{yearTo}</span>
    </div>
  );
};

export { Years };
