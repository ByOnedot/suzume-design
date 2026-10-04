import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ConfigProvider from '../components/ConfigProvider';

const render = (node: React.ReactElement) => renderToStaticMarkup(node);

// make sure ConfigProvider componentConfig work correctly
export default function componentConfigTest(
  Component: React.ComponentType<any>,
  componentName: string,
  componentProps: Record<string, unknown> = {}
) {
  describe(`ConfigProvider componentConfig.${componentName}`, () => {
    it(`default`, () => {
      const component = render(<Component {...componentProps} />);
      expect(component).toMatchSnapshot();
    });

    it(`set className globally`, () => {
      const component = render(
        <ConfigProvider
          componentConfig={{ [componentName]: { className: 'global-default-class' } } as any}
        >
          <Component {...componentProps} />
        </ConfigProvider>
      );
      expect(component).toMatchSnapshot();
    });

    it(`set className globally and component set className itself.`, () => {
      const component = render(
        <ConfigProvider
          componentConfig={{ [componentName]: { className: 'global-default-class' } } as any}
        >
          <Component {...componentProps} className="component-class" />
        </ConfigProvider>
      );
      expect(component).toMatchSnapshot();
    });

    it(`set data-* property`, () => {
      const component = render(<Component {...componentProps} data-test-name={componentName} />);
      expect(component).toMatchSnapshot();
    });
  });
}
