import { createContext } from 'react';
import { ConfigProviderProps } from './interface';
import defaultLocale from '../locale/default';
import Empty from '../Empty';

function renderEmpty(componentName?: string) {
  switch (componentName) {
    default:
      return <Empty />;
  }
}

export const DefaultConfigProviderProps: ConfigProviderProps = {
  locale: defaultLocale,
  prefixCls: 'suzume',
  getPopupContainer: () => document.body,
  size: 'default',
  renderEmpty,
  focusLock: {
    modal: { autoFocus: true },
    drawer: { autoFocus: true },
  },
};

export const ConfigContext = createContext<ConfigProviderProps>({
  getPrefixCls: (componentName: string, customPrefix?: string) =>
    `${customPrefix || 'suzume'}-${componentName}`,
  ...DefaultConfigProviderProps,
});
