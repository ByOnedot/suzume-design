import { useEffect, useRef } from 'react';
import { scenarios, responsiveIds, type Scenario } from './scenarios';

export function findScenario(id: string | null): Scenario | undefined {
  return scenarios.find((s) => s.id === id);
}

export const isResponsiveScenario = (id: string) => responsiveIds.has(id);

const READY_FALLBACK_MS = 8000;

function signalReady(stage: HTMLDivElement) {
  // Two frames: one to flush layout, one so transitions started by the
  // freshly mounted tree settle before Playwright freezes animations.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      stage.dataset.ready = '1';
      document.documentElement.dataset.ready = '1';
    });
  });
}

function markReady(stage: HTMLDivElement | null) {
  if (!stage) return;
  // Absolute fallback: the harness must always reach the ready flag so a
  // failure shows up as a screenshot/console mismatch rather than a hang.
  const fallback = setTimeout(() => signalReady(stage), READY_FALLBACK_MS);

  const done = () => {
    clearTimeout(fallback);
    signalReady(stage);
  };

  if (document.fonts && document.fonts.status !== 'loaded') {
    let settled = false;
    const finish = () => {
      if (!settled) {
        settled = true;
        done();
      }
    };
    document.fonts.ready.then(finish).catch(finish);
    setTimeout(finish, READY_FALLBACK_MS);
  } else {
    done();
  }
}

export function App() {
  const stageRef = useRef<HTMLDivElement>(null);
  const params = new URLSearchParams(location.search);
  const id = params.get('s') || '';
  const variant = params.get('v') || 'default';
  const theme = params.get('t') === 'dark' ? 'dark' : 'light';
  const scenario = findScenario(id);

  useEffect(() => {
    const body = document.body;
    if (theme === 'dark') body.setAttribute('suzume-theme', 'dark');
    else body.removeAttribute('suzume-theme');
    body.dataset.theme = theme;
    markReady(stageRef.current);
  }, [theme, id, variant]);

  if (!scenario) {
    return (
      <div id="stage" ref={stageRef} data-scenario="missing">
        <p>Unknown scenario: {id}</p>
      </div>
    );
  }

  return (
    <div id="stage" ref={stageRef} data-scenario={scenario.id} data-variant={variant}>
      {scenario.render(variant)}
    </div>
  );
}
