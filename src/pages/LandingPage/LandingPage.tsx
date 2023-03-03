import { FC } from 'react';

import { Switch } from '../../components/Switch/Switch';

const LandingPage: FC = () => {
  return (
    <main className="landing-page">
      <Switch
        buttons={['кино', 'театр', 'наука', 'спорт', 'литература', 'искусство']}
      />
    </main>
  );
};

export { LandingPage };
