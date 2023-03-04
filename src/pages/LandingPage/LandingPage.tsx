import { FC } from 'react';

import { Switcher } from '../../components/Switcher/Switcher';

const LandingPage: FC = () => {
  return (
    <main className="landing-page">
      <Switcher
        switcherButtonsItems={[
          { index: 1, label: 'кино' },
          { index: 2, label: 'театр' },
          { index: 3, label: 'наука' },
          { index: 4, label: 'спорт' },
          { index: 5, label: 'литература' },
          { index: 6, label: 'искусство' },
          { index: 7, label: 'спорт' },
        ]}
      />
    </main>
  );
};

export { LandingPage };
