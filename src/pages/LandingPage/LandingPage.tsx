import { FC } from 'react';

import { Switcher } from '../../components/Switcher/Switcher';

const LandingPage: FC = () => {
  return (
    <main className="landing-page">
      <Switcher
        switcherButtonsItems={[
          'кино',
          'театр',
          'наука',
          'спорт',
          'литература',
          'искусство',
          'спорт',
          'литература',
          'искусство',
          'спорт',
          'литература',
          'искусство',
          'спорт',
          'литература',
          'искусство',
        ]}
      />
    </main>
  );
};

export { LandingPage };
