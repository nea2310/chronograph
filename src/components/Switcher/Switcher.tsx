import { FC, MouseEvent, useLayoutEffect, useRef, useState } from 'react';

import './Switcher.scss';

type Props = {
  switcherButtonsItems: string[];
};

const Switcher: FC<Props> = ({ switcherButtonsItems }) => {
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

  useLayoutEffect(() => {
    const switchDiameter = ref.current?.offsetHeight;
    const buttons = ref.current?.querySelectorAll('.switcher__button');
    let shift = 0;
    if (buttons?.[0] instanceof HTMLButtonElement) {
      shift = buttons[0].offsetHeight / 2;
      setSingleAngle(360 / buttons.length);
    }

    if (switchDiameter && buttons) {
      const radius = switchDiameter / 2;
      setSwitcherRadius(radius);
      setSwitcherMiddle(
        Number(ref.current?.getBoundingClientRect().x) + radius
      );
      if (buttons[0] instanceof HTMLButtonElement)
        setButtonRadius(buttons[0].offsetWidth / 2);
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i <= buttons.length; i++) {
        const button = buttons[i];
        if (!(button instanceof HTMLElement)) break;
        const angle = (2 / buttons.length) * i * Math.PI + 2.618;

        const left = `${radius * Math.sin(angle) + radius - shift}px`;
        const top = `${radius * Math.cos(angle) + radius - shift}px`;
        button.style.left = left;
        button.style.top = top;
      }
    }

    if (buttons?.[0] instanceof HTMLButtonElement) {
      const buttonDimensions = buttons[0].getBoundingClientRect();
      setTargetPositionX(buttonDimensions.x + shift);
      setTargetPositionY(buttonDimensions.y + shift);
    }
  }, []);

  const handleButtonClick = (
    event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    const selectedButton = event.currentTarget;
    const selectedButtonDimensions = selectedButton.getBoundingClientRect();
    const selectedButtonX = selectedButtonDimensions.x + buttonRadius;
    const selectedButtonY = selectedButtonDimensions.y + buttonRadius;

    if (ref.current) {
      const switcher = ref.current;

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
        angle = 360 - angle;
      }

      switcher.style.transform = `rotate(${newRotationValue}deg)`;
      switcher.style.transition = `all ${Math.abs(angle) * 10}ms linear`;
      Array.from(switcher.children).forEach((item) => {
        if (!(item instanceof HTMLButtonElement)) return;
        const button = item;
        button.style.transform = `rotate(${newRotationValue * -1}deg)`;
        button.style.transition = `all ${Math.abs(angle) * 10}ms linear`;
      });
    }
  };

  const ref = useRef<HTMLDivElement>(null);
  return (
    <div className="switcher" ref={ref}>
      {switcherButtons.map((item) => (
        <button
          className="switcher__button"
          type="button"
          key={item}
          onClick={(event) => handleButtonClick(event)}
        >
          {item}
        </button>
      ))}
    </div>
  );
};

export { Switcher };
