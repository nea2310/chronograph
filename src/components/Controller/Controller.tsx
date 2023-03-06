/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { FC, useCallback, useState } from 'react';

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
  const [isNextButtonActive, setIsNextButtonActive] = useState(true);
  const [isPrevButtonActive, setIsPrevButtonActive] = useState(false);

  const handleNextButtonClick = () => {
    const index = currentCategory + 1;
    if (index > 6) return;
    if (index > 5) setIsNextButtonActive(false);
    if (currentCategory !== index) setCurrentCategory(index);
    if (!isPrevButtonActive) setIsPrevButtonActive(true);
  };

  const handlePrevButtonClick = () => {
    const index = currentCategory - 1;
    if (index < 1) return;
    if (index < 2) setIsPrevButtonActive(false);
    if (currentCategory !== index) setCurrentCategory(index);
    if (!isNextButtonActive) setIsNextButtonActive(true);
  };

  const handleSwitcherClick = useCallback(
    (activeButton: number) => {
      setCurrentCategory(activeButton);
      if (activeButton > 1 && !isPrevButtonActive) setIsPrevButtonActive(true);
      if (activeButton < 6 && !isNextButtonActive) setIsNextButtonActive(true);
      if (activeButton > 5) setIsNextButtonActive(false);
      if (activeButton < 2) setIsPrevButtonActive(false);
    },
    [isNextButtonActive, isPrevButtonActive]
  );

  return (
    <div className="controller">
      <Switcher
        switcherButtonsItems={data}
        activeIndex={currentCategory}
        onClick={handleSwitcherClick}
      />
      <span className="controller__counter">{`${currentCategory}/${data.length}`}</span>
      <button
        type="button"
        disabled={!isPrevButtonActive}
        className="controller__button controller__button-prev"
        onClick={handlePrevButtonClick}
      />
      <button
        type="button"
        disabled={!isNextButtonActive}
        className="controller__button controller__button-next"
        onClick={handleNextButtonClick}
      />
    </div>
  );
};

export { Controller };
