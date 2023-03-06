/* eslint-disable jsx-a11y/control-has-associated-label */
import {
  FC,
  MouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import classnames from 'classnames';

import { Switcher } from '../Switcher/Switcher';

import './Controller.scss';

type Props = {
  data: {
    index: number;
    label: string;
    years: number[];
    eventsList: { index: number; year: number; description: string }[];
  }[];
};

const Controller: FC<Props> = ({ data }) => {
  const [currentCategory, setCurrentCategory] = useState(data[0].index);
  // console.log('currentCategory>>>', currentCategory);

  const handleNextButtonClick = () => {
    const index = currentCategory + 1;
    console.log(
      'handleNextButtonClick currentCategory>>>',
      currentCategory,
      'index>>>',
      index
    );
    if (index > 6 || index < 1) return;
    if (currentCategory !== index) setCurrentCategory(index);
  };
  const handlePrevButtonClick = () => {
    const index = currentCategory - 1;
    console.log(
      'handlePrevButtonClick currentCategory>>>',
      currentCategory,
      'index>>>',
      index
    );
    if (index > 6 || index < 1) return;
    if (currentCategory !== index) setCurrentCategory(index);
  };

  const handleSwitcherClick = useCallback((activeButton: number) => {
    setCurrentCategory(activeButton);
  }, []);

  return (
    <div className="controller">
      <Switcher
        switcherButtonsItems={data}
        activeIndex={currentCategory}
        onClick={handleSwitcherClick}
      />
      <button
        type="button"
        className="controller__button controller__button-prev"
        onClick={handlePrevButtonClick}
      />
      <button
        type="button"
        className="controller__button controller__button-next"
        onClick={handleNextButtonClick}
      />
    </div>
  );
};

export { Controller };
