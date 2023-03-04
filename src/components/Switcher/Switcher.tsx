import { FC, MouseEvent, useLayoutEffect, useRef, useState } from 'react';

import './Switcher.scss';

type Props = {
  switcherButtons: string[];
};

const Switcher: FC<Props> = ({ switcherButtons }) => {
  const [targetPositionX, setTargetPositionX] = useState(0);
  const [targetPositionY, setTargetPositionY] = useState(0);
  const [switcherMiddle, setSwitcherMiddle] = useState(0);
  const [switcherRadius, setSwitcherRadius] = useState(0);
  const [buttonRadius, setButtonRadius] = useState(0);
  const [singleAngle, setSingleAngle] = useState(0);

  useLayoutEffect(() => {
    const switchDiameter = ref.current?.offsetHeight;
    const buttons = ref.current?.querySelectorAll('.switch__button');
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

    if (ref.current) {
      const rotationPropertyValue = ref.current.style.transform;
      let newRotationValue = 0;
      if (rotationPropertyValue) {
        const currentRotationValue =
          rotationPropertyValue.match(/rotate\(([-\d]*)/);
        if (currentRotationValue)
          newRotationValue = Number(currentRotationValue[1]);
      }

      ref.current.style.transform = `rotate(${
        newRotationValue ? angle + newRotationValue : angle
      }deg)`;
    }
  };

  const ref = useRef<HTMLDivElement>(null);
  return (
    <div className="switch" ref={ref}>
      {switcherButtons.map((item) => (
        <button
          className="switch__button"
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
