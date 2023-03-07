/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable max-len */
import { FC } from 'react';
import { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

// eslint-disable-next-line import/no-unresolved
import 'swiper/css/navigation';

import './Slider.scss';
// eslint-disable-next-line import/no-unresolved
import 'swiper/css';

type Props = {
  slides: { index: number; year: number; description: string }[];
};

const Slider: FC<Props> = ({ slides }) => {
  return (
    <div className="slider">
      <button
        type="button"
        className="slider__button slider__button_type_prev"
      />
      <button
        type="button"
        className="slider__button slider__button_type_next"
      />
      <Swiper
        spaceBetween={50}
        slidesPerView={3}
        modules={[Navigation]}
        navigation={{
          prevEl: '.slider__button_type_prev',
          nextEl: '.slider__button_type_next',
        }}
      >
        {slides.map(({ index, year, description }) => (
          <SwiperSlide key={index}>
            <div className="slider__slide">
              <span className="slider__slide-label">{year}</span>
              <p className="slider__slide-description">{description}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export { Slider };
