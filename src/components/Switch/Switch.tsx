import { FC, MouseEvent, useLayoutEffect, useRef, useState } from 'react';

import './Switch.scss';

type Props = {
  buttons: string[];
};

const Switch: FC<Props> = ({ buttons }) => {
  const [x1, setX1] = useState(0);
  const [y1, setY1] = useState(0);
  const [middle, setMiddle] = useState(0);
  const [radius, setRadius] = useState(0);
  const [singleAngle, setSingleAngle] = useState(0);

  useLayoutEffect(() => {
    const diameter = ref.current?.offsetHeight;
    const children = ref.current?.querySelectorAll('.switch__button');
    let shift = 0;
    if (children?.[0] instanceof HTMLButtonElement) {
      shift = children[0].offsetHeight / 2;
      setSingleAngle(360 / children.length);

      console.log(middle);
    }

    if (diameter && children) {
      setRadius(diameter / 2);
      setMiddle(Number(ref.current?.getBoundingClientRect().x) + diameter / 2);
      const rad = diameter / 2;
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i <= children.length; i++) {
        const digit = children[i] as HTMLElement;
        if (digit === undefined) break;
        const angle = (2 / children.length) * i * Math.PI + 2.618;

        const left = `${rad * Math.sin(angle) + rad - shift}px`;
        const top = `${rad * Math.cos(angle) + rad - shift}px`;
        digit.style.left = left;
        digit.style.top = top;
      }
    }

    if (children?.[0] instanceof HTMLButtonElement) {
      setX1(children[0].getBoundingClientRect().x + shift);
      setY1(children[0].getBoundingClientRect().y + shift);
      console.log('x1>>>', x1);
    }
  }, []);

  const handleButtonClick = (
    event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    const target = event.currentTarget;
    const x2 = target.getBoundingClientRect().x + 20;
    const y2 = target.getBoundingClientRect().y + 20;

    console.log('x1: ', x1, 'middle: ', middle);
    const side = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    let cos = (radius ** 2 * 2 - side ** 2) / (radius ** 2 * 2);
    if (cos < -1) cos = -1;

    const angle = (Math.acos(cos) * 180) / Math.PI;
    let testAngle = Math.round(angle / singleAngle) * singleAngle;

    if (x2 > middle) {
      testAngle *= -1;
    }

    console.log('testAngle', testAngle);

    if (ref.current) {
      const currentRotation = ref.current.style.transform;
      let value = 0;
      if (currentRotation) {
        const valueTest = currentRotation.match(/rotate\(([-\d]*)/);
        if (valueTest) value = Number(valueTest[1]);
        console.log('valueTest>>', valueTest);
      }

      const resultAngle = value ? testAngle + value : testAngle;

      console.log('resultAngle>>>', resultAngle);

      ref.current.style.transform = `rotate(${resultAngle}deg)`;
    }
  };

  const ref = useRef<HTMLDivElement>(null);
  return (
    <div className="switch" ref={ref}>
      {buttons.map((item) => (
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

export { Switch };
