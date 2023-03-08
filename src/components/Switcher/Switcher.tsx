import {
  FC,
  MouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';

import { CIRCLE, MAX_BUTTONS_AMOUNTS } from '../../shared/constants';
import { throttle } from '../../shared/helpers/throttle/throttle';

import './Switcher.scss';

type Props = {
  switcherButtonsItems: { index: number; label: string }[];
  activeButtonIndex?: number;
  defaultAngleRatio?: number;
  defaultRotateSpeedRatio?: number;
  onClick?: (activeIndex: number, isResize: boolean) => void;
};

const Switcher: FC<Props> = ({
  switcherButtonsItems,
  activeButtonIndex = 1,
  defaultAngleRatio = 2.71,
  defaultRotateSpeedRatio = 10,
  onClick,
}) => {
  const switcherButtons =
    switcherButtonsItems.length <= MAX_BUTTONS_AMOUNTS
      ? switcherButtonsItems
      : switcherButtonsItems.slice(0, MAX_BUTTONS_AMOUNTS);
  const [targetPositionX, setTargetPositionX] = useState(0);
  const [targetPositionY, setTargetPositionY] = useState(0);
  const [switcherMiddle, setSwitcherMiddle] = useState(0);
  const [switcherRadius, setSwitcherRadius] = useState(0);
  const [buttonRadius, setButtonRadius] = useState(0);
  const [singleAngle, setSingleAngle] = useState(0);
  const [activeButton, setActiveButton] = useState(activeButtonIndex);
  const [isTransitionEnd, setIsTransitionEnd] = useState(true);
  const [needTransition, setNeedTransition] = useState(
    window.innerWidth >= 767
  );

  const render = useCallback(() => {
    setActiveButton(1);
    onClick?.(1, true);
    const switcher = switcherWrapperRef.current;
    const switcherWrapper = switcherRef.current;
    if (!switcher || !switcherWrapper) return;

    const buttons = switcher.querySelectorAll('.switcher__button-wrapper');
    if (!(buttons?.[0] instanceof HTMLElement)) return;
    switcher.style.transform = '';
    switcher.style.transition = '';
    Array.from(buttons).forEach((item) => {
      if (!(item instanceof HTMLDivElement)) return;
      const button = item;
      button.style.transform = '';
      button.style.transition = '';
      button.style.left = '';
      button.style.top = '';
    });

    const shift = buttons[0].offsetHeight / 2;
    setSingleAngle(CIRCLE / buttons.length);
    setButtonRadius(shift);

    const switcherDiameter = switcher.offsetHeight;

    if (switcherDiameter) {
      const radius = switcherDiameter / 2;
      setSwitcherRadius(radius);
      setSwitcherMiddle(Number(switcher.getBoundingClientRect().x) + radius);
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i <= buttons.length; i++) {
        const button = buttons[i];
        if (!(button instanceof HTMLElement)) break;
        const angle =
          (2 / buttons.length) * i * Math.PI * -1 + defaultAngleRatio;
        const left = `${radius * Math.sin(angle) + radius - shift + 2}px`;
        const top = `${radius * Math.cos(angle) + radius - shift + 2}px`;
        button.style.left = left;
        button.style.top = top;
      }
    }

    if (!(buttons?.[0] instanceof HTMLElement)) return;
    const buttonDimensions = buttons[0].getBoundingClientRect();
    setTargetPositionX(buttonDimensions.x + shift);
    setTargetPositionY(buttonDimensions.y + shift);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultAngleRatio]);

  const rotate = useCallback(
    (selectedButton: HTMLElement) => {
      setIsTransitionEnd(false);
      setActiveButton(Number(selectedButton.getAttribute('data-index')));
      const selectedButtonDimensions = selectedButton.getBoundingClientRect();
      const selectedButtonX = selectedButtonDimensions.x + buttonRadius;
      const selectedButtonY = selectedButtonDimensions.y + buttonRadius;

      if (!switcherWrapperRef.current) return;
      const switcher = switcherWrapperRef.current;
      const distance = Math.sqrt(
        (selectedButtonX - targetPositionX) ** 2 +
          (selectedButtonY - targetPositionY) ** 2
      );
      let cos =
        (switcherRadius ** 2 * 2 - distance ** 2) / (switcherRadius ** 2 * 2);
      if (cos < -1) cos = -1;

      let angle = (Math.acos(cos) * 180) / Math.PI;
      angle = Math.round(angle / singleAngle) * singleAngle;

      if (selectedButtonX > switcherMiddle) angle *= -1;

      const rotationPropertyValue = switcher.style.transform;
      let newRotationValue = 0;
      if (rotationPropertyValue) {
        const currentRotationValue =
          rotationPropertyValue.match(/rotate\(([-\d]*)/);
        if (currentRotationValue)
          newRotationValue = Number(currentRotationValue[1]);
      }

      newRotationValue = newRotationValue ? angle + newRotationValue : angle;
      if (newRotationValue >= CIRCLE) {
        newRotationValue -= CIRCLE;
        angle = CIRCLE - angle;
      }
      if (newRotationValue <= CIRCLE * -1) {
        newRotationValue += CIRCLE;
        angle = CIRCLE * -1 - angle;
      }

      if (needTransition) {
        switcher.style.transform = `rotate(${newRotationValue}deg)`;

        switcher.style.transition = `transform ${
          Math.abs(angle) * defaultRotateSpeedRatio
        }ms linear`;
      }

      Array.from(switcher.children).forEach((item) => {
        if (!(item instanceof HTMLDivElement)) return;
        const button = item;
        button.style.transform = `rotate(${newRotationValue * -1}deg)`;
        button.style.transition = `transform ${
          Math.abs(angle) * defaultRotateSpeedRatio
        }ms linear`;
      });
    },
    [
      buttonRadius,
      defaultRotateSpeedRatio,
      needTransition,
      singleAngle,
      switcherMiddle,
      switcherRadius,
      targetPositionX,
      targetPositionY,
    ]
  );

  const handleActiveIndexChange = useCallback(
    (index: number) => {
      if (index > MAX_BUTTONS_AMOUNTS || index < 1) return;
      const switcher = switcherWrapperRef.current;
      if (!switcher) return;
      const buttons = switcher.querySelectorAll('.switcher__button-wrapper');
      const selectedButton =
        Array.from(buttons)[index - 1].querySelector('.switcher__button');
      if (selectedButton instanceof HTMLElement) rotate(selectedButton);
    },
    [rotate]
  );

  useEffect(() => render(), [render]);

  useEffect(() => {
    const handleWindowResize = () => {
      render();
      if (window.innerWidth < 767) setNeedTransition(false);
      else setNeedTransition(true);
    };

    const throttledHandleWindowResize = throttle(handleWindowResize, 250);
    window.addEventListener('resize', throttledHandleWindowResize);

    return () => window.removeEventListener('resize', handleWindowResize);
  }, [activeButton, handleActiveIndexChange, render]);

  useEffect(() => {
    if (activeButtonIndex !== activeButton)
      handleActiveIndexChange(activeButtonIndex);
  }, [activeButton, activeButtonIndex, handleActiveIndexChange]);

  const handleSwitcherTransitionEnd = (
    event: React.TransitionEvent<HTMLElement>
  ) => {
    if (event.target !== event.currentTarget) return;
    setIsTransitionEnd(true);
  };

  const handleButtonClick = (
    event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    const selectedButton = event.currentTarget;
    rotate(selectedButton);
    onClick?.(Number(selectedButton.getAttribute('data-index')), false);
  };

  const switcherWrapperRef = useRef<HTMLDivElement>(null);
  const switcherRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={switcherRef} className="switcher">
      <div
        className="switcher__wrapper"
        ref={switcherWrapperRef}
        onTransitionEnd={(event) => handleSwitcherTransitionEnd(event)}
      >
        {switcherButtons.map(({ index, label }) => (
          <div
            key={index}
            className={classNames('switcher__button-wrapper', {
              'switcher__button-wrapper_active': index === activeButton,
            })}
          >
            <button
              className="switcher__button"
              type="button"
              data-index={String(index)}
              onClick={(event) => handleButtonClick(event)}
            >
              <span className="switcher__button-index">{index}</span>
            </button>
            <span
              className={classNames('switcher__button-label', {
                'switcher__button-label_visible': isTransitionEnd,
              })}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export { Switcher };
