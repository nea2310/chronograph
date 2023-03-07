/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { FC, useCallback, useState } from 'react';

import {
  MAX_BUTTONS_AMOUNTS,
  MIN_BUTTONS_AMOUNTS,
} from '../../shared/constants';
import { getYears } from '../../shared/helpers/getYears';
import { Slider } from '../Slider/Slider';
import { Switcher } from '../Switcher/Switcher';
import { Years } from '../Years/Years';

import './Controller.scss';

type Props = {
  data: {
    index: number;
    label: string;
    eventsList: { index: number; year: number; description: string }[];
  }[];
};

const Controller: FC<Props> = ({ data }) => {
  const [currentCategory, setCurrentCategory] = useState(data[0].index);
  const [currentEventsList, setCurrentEventsList] = useState(
    data[0].eventsList
  );
  const [isNextButtonActive, setIsNextButtonActive] = useState(true);
  const [isPrevButtonActive, setIsPrevButtonActive] = useState(false);
  const [from, setFrom] = useState(Math.min(...getYears(data[0].eventsList)));
  const [to, setTo] = useState(Math.max(...getYears(data[0].eventsList)));

  const handleNextButtonClick = () => {
    const index = currentCategory + 1;
    if (index > MAX_BUTTONS_AMOUNTS) return;
    if (index > MAX_BUTTONS_AMOUNTS - 1) setIsNextButtonActive(false);
    if (currentCategory !== index) {
      setCurrentCategory(index);
      const itemIndex = data.findIndex((item) => item.index === index);
      const { eventsList } = data[itemIndex];
      setCurrentEventsList(eventsList);
      setFrom(Math.min(...getYears(eventsList)));
      setTo(Math.max(...getYears(eventsList)));
    }
    if (!isPrevButtonActive) setIsPrevButtonActive(true);
  };

  const handlePrevButtonClick = () => {
    const index = currentCategory - 1;
    if (index < MIN_BUTTONS_AMOUNTS - 1) return;
    if (index < MIN_BUTTONS_AMOUNTS) setIsPrevButtonActive(false);
    if (currentCategory !== index) {
      setCurrentCategory(index);
      const itemIndex = data.findIndex((item) => item.index === index);
      const { eventsList } = data[itemIndex];
      setCurrentEventsList(eventsList);
      setFrom(Math.min(...getYears(eventsList)));
      setTo(Math.max(...getYears(eventsList)));
    }
    if (!isNextButtonActive) setIsNextButtonActive(true);
  };

  const handleSwitcherClick = useCallback(
    (activeButton: number) => {
      setCurrentCategory(activeButton);
      if (activeButton > MIN_BUTTONS_AMOUNTS - 1 && !isPrevButtonActive)
        setIsPrevButtonActive(true);
      if (activeButton < MAX_BUTTONS_AMOUNTS && !isNextButtonActive)
        setIsNextButtonActive(true);
      const { eventsList } = data[activeButton - 1];
      setCurrentEventsList(eventsList);
      setFrom(Math.min(...getYears(eventsList)));
      setTo(Math.max(...getYears(eventsList)));

      if (activeButton > MAX_BUTTONS_AMOUNTS - 1) setIsNextButtonActive(false);
      if (activeButton < MIN_BUTTONS_AMOUNTS) setIsPrevButtonActive(false);
    },
    [data, isNextButtonActive, isPrevButtonActive]
  );

  return (
    <div className="controller">
      <h1 className="controller__header">Исторические даты</h1>
      {data.length >= MIN_BUTTONS_AMOUNTS &&
        data.length <= MAX_BUTTONS_AMOUNTS && (
          <div className="controller__switcher">
            <Switcher
              switcherButtonsItems={data}
              activeButtonIndex={currentCategory}
              onClick={handleSwitcherClick}
            />
          </div>
        )}
      <span className="controller__counter">{`${
        currentCategory < 10
          ? `0${String(currentCategory)}`
          : String(currentCategory)
      }/${
        data.length < 10 ? `0${String(data.length)}` : String(data.length)
      }`}</span>
      <div className="controller__buttons">
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
      <div className="controller__years">
        <Years from={from} to={to} />
      </div>
      <div className="controller__slider">
        <Slider slides={currentEventsList} />
      </div>
    </div>
  );
};

export { Controller };
