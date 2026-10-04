import { InteractivePanel } from './interactive';
import { ServerPanel } from './server-panel';

export default function Page() {
  return (
    <main style={{ maxWidth: 960, margin: '0 auto', padding: 32 }}>
      <h1>Suzume Design consumer</h1>
      <ServerPanel />
      <InteractivePanel />
    </main>
  );
}
