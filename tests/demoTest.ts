import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import './mockDate';

/**
 * Renders every `__demo__/<name>.md` of a component and snapshots the markup.
 *
 * `renderToStaticMarkup` produces exactly the same string the previous
 * (Enzyme `render`) helper produced, so the demo snapshots are unchanged.
 * Portals are stubbed out for the same reason they were before: a demo that
 * opens an overlay must not depend on a DOM that does not exist during static
 * rendering.
 */
const demos = import.meta.glob('../components/**/__demo__/*.md', { eager: true }) as Record<
  string,
  { default?: React.ComponentType }
>;

function demoTest(component: string) {
  const prefix = `/components/${component}/__demo__/`;
  const files = Object.keys(demos)
    .filter((file) => file.includes(prefix))
    .sort();

  files.forEach((file) => {
    const fileName = file.slice(file.lastIndexOf('/') + 1);
    it(`renders ${component}/demo/${fileName} correctly`, () => {
      const Demo = demos[file].default;
      const markup = renderToStaticMarkup(React.createElement(Demo as React.ComponentType));
      expect(markup).toMatchSnapshot();
    });
  });
}

export default demoTest;
