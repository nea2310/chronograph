import {
  FC,
  MouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import classnames from 'classnames';

import './Switcher.scss';

type Props = {
  switcherButtonsItems: { index: number; label: string }[];
  activeIndex?: number;
  onClick?: (activeIndex: number) => void;
};

const Switcher: FC<Props> = ({
  switcherButtonsItems,
  activeIndex = 1,
  onClick,
}) => {
  const switcherButtons =
    switcherButtonsItems.length <= 6
      ? switcherButtonsItems
      : switcherButtonsItems.slice(0, 6);
  const [targetPositionX, setTargetPositionX] = useState(0);
  const [targetPositionY, setTargetPositionY] = useState(0);
  const [switcherMiddle, setSwitcherMiddle] = useState(0);
  const [switcherRadius, setSwitcherRadius] = useState(0);
  const [buttonRadius, setButtonRadius] = useState(0);
  const [singleAngle, setSingleAngle] = useState(0);
  const [activeButton, setActiveButton] = useState(activeIndex);
  const [isTransitionEnd, setIsTransitionEnd] = useState(true);

  const rotate = useCallback(
    (selectedButton: HTMLElement) => {
      setIsTransitionEnd(false);
      setActiveButton(Number(selectedButton.getAttribute('data-index')));
      const selectedButtonDimensions = selectedButton.getBoundingClientRect();
      const selectedButtonX = selectedButtonDimensions.x + buttonRadius;
      const selectedButtonY = selectedButtonDimensions.y + buttonRadius;

      if (switcherWrapperRef.current) {
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

        if (selectedButtonX > switcherMiddle) {
          angle *= -1;
        }

        const rotationPropertyValue = switcher.style.transform;
        let newRotationValue = 0;
        if (rotationPropertyValue) {
          const currentRotationValue =
            rotationPropertyValue.match(/rotate\(([-\d]*)/);
          if (currentRotationValue)
            newRotationValue = Number(currentRotationValue[1]);
        }

        newRotationValue = newRotationValue ? angle + newRotationValue : angle;
        if (newRotationValue >= 360) {
          newRotationValue -= 360;
          angle = 360 - angle;
        }
        if (newRotationValue <= -360) {
          newRotationValue += 360;
          angle = -360 - angle;
        }

        switcher.style.transform = `rotate(${newRotationValue}deg)`;
        switcher.style.transition = `transform ${
          Math.abs(angle) * 10
        }ms linear`;
        Array.from(switcher.children).forEach((item) => {
          if (!(item instanceof HTMLDivElement)) return;
          const button = item;
          button.style.transform = `rotate(${newRotationValue * -1}deg)`;
          button.style.transition = `transform ${
            Math.abs(angle) * 10
          }ms linear`;
        });
      }
    },
    [
      buttonRadius,
      singleAngle,
      switcherMiddle,
      switcherRadius,
      targetPositionX,
      targetPositionY,
    ]
  );

  const handleActiveIndexChange = useCallback(
    (index: number) => {
      if (index > 6 || index < 1) return;
      const switcher = switcherWrapperRef.current;
      if (!switcher) return;
      const buttons = switcher.querySelectorAll('.switcher__button-wrapper');
      const selectedButton =
        Array.from(buttons)[index - 1].querySelector('.switcher__button');
      if (selectedButton instanceof HTMLElement) rotate(selectedButton);
    },
    [rotate]
  );

  useEffect(() => {
    if (activeIndex !== activeButton) handleActiveIndexChange(activeIndex);
  }, [activeButton, activeIndex, handleActiveIndexChange]);

  useEffect(() => {
    const switcher = switcherWrapperRef.current;
    const switcherWrapper = switcherRef.current;
    if (!switcher || !switcherWrapper) return;

    const buttons = switcher.querySelectorAll('.switcher__button-wrapper');
    let shift = 0;
    if (buttons?.[0] instanceof HTMLDivElement) {
      shift = buttons[0].offsetHeight / 2;
      setSingleAngle(360 / buttons.length);
      setButtonRadius(shift);
      switcherWrapper.style.paddingLeft = `${shift}px`;
      switcherWrapper.style.paddingRight = `${shift}px`;
    }
    const switchDiameter = switcher.offsetHeight;

    if (switchDiameter) {
      const radius = switchDiameter / 2;
      setSwitcherRadius(radius);
      setSwitcherMiddle(Number(switcher.getBoundingClientRect().x) + radius);
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i <= buttons.length; i++) {
        const button = buttons[i];
        if (!(button instanceof HTMLElement)) break;
        const angle = (2 / buttons.length) * i * Math.PI * -1 + 2.618;
        const left = `${radius * Math.sin(angle) + radius - shift}px`;
        const top = `${radius * Math.cos(angle) + radius - shift}px`;
        button.style.left = left;
        button.style.top = top;
      }
    }

    if (buttons?.[0] instanceof HTMLDivElement) {
      const buttonDimensions = buttons[0].getBoundingClientRect();
      setTargetPositionX(buttonDimensions.x + shift);
      setTargetPositionY(buttonDimensions.y + shift);
    }
  }, []);

  const handleTransitionEnd = (
    event: React.TransitionEvent<HTMLDivElement>
  ) => {
    if (event.target !== event.currentTarget) return;
    setIsTransitionEnd(true);
  };

  const handleButtonClick = (
    event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    const selectedButton = event.currentTarget;
    rotate(selectedButton);
    onClick?.(Number(selectedButton.getAttribute('data-index')));
  };

  const switcherWrapperRef = useRef<HTMLDivElement>(null);
  const switcherRef = useRef<HTMLDivElement>(null);
  return (
    <div ref={switcherRef} className="switcher">
      <div
        className="switcher__wrapper"
        ref={switcherWrapperRef}
        onTransitionEnd={(event) => handleTransitionEnd(event)}
      >
        {switcherButtons.map(({ index, label }) => (
          <div
            key={index}
            className={classnames('switcher__button-wrapper', {
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
              className={classnames('switcher__button-label', {
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
