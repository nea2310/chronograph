import { FC } from 'react';

import { Controller } from '../../components/Controller/Controller';

import { data } from './data';
import './LandingPage.scss';

const LandingPage: FC = () => {
  return (
    <main className="landing-page">
      <Controller data={data} />
    </main>
  );
};

export { LandingPage };
