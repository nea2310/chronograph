/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { FC, useCallback, useState } from 'react';

import {
  MAX_BUTTONS_AMOUNTS,
  MIN_BUTTONS_AMOUNTS,
} from '../../shared/constants';
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
    if (index > MAX_BUTTONS_AMOUNTS) return;
    if (index > MAX_BUTTONS_AMOUNTS - 1) setIsNextButtonActive(false);
    if (currentCategory !== index) setCurrentCategory(index);
    if (!isPrevButtonActive) setIsPrevButtonActive(true);
  };

  const handlePrevButtonClick = () => {
    const index = currentCategory - 1;
    if (index < MIN_BUTTONS_AMOUNTS - 1) return;
    if (index < MIN_BUTTONS_AMOUNTS) setIsPrevButtonActive(false);
    if (currentCategory !== index) setCurrentCategory(index);
    if (!isNextButtonActive) setIsNextButtonActive(true);
  };

  const handleSwitcherClick = useCallback(
    (activeButton: number) => {
      setCurrentCategory(activeButton);
      if (activeButton > MIN_BUTTONS_AMOUNTS - 1 && !isPrevButtonActive)
        setIsPrevButtonActive(true);
      if (activeButton < MAX_BUTTONS_AMOUNTS && !isNextButtonActive)
        setIsNextButtonActive(true);
      if (activeButton > MAX_BUTTONS_AMOUNTS - 1) setIsNextButtonActive(false);
      if (activeButton < MIN_BUTTONS_AMOUNTS) setIsPrevButtonActive(false);
    },
    [isNextButtonActive, isPrevButtonActive]
  );

  return (
    <div className="controller">
      {data.length >= MIN_BUTTONS_AMOUNTS &&
        data.length <= MAX_BUTTONS_AMOUNTS && (
          <Switcher
            switcherButtonsItems={data}
            activeButtonIndex={currentCategory}
            onClick={handleSwitcherClick}
          />
        )}
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
