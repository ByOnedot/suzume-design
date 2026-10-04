import React, { useState, useImperativeHandle, forwardRef, ReactElement, useContext } from 'react';
import { ConfigContext, ConfigProviderProps } from '../ConfigProvider';
import { flushNoticeUpdate } from './react-dom';

export type HolderRef = {
  addInstance?: (ins: ReactElement) => void;
  removeInstance?: (ins: ReactElement) => void;
  getContextConfig?: () => ConfigProviderProps;
};

const ContextHolderElement = forwardRef<HolderRef>((_props, ref) => {
  const configContext = useContext(ConfigContext);
  const [instances, setInstances] = useState([]);

  // Imperative API: flush so `useModal` / `useMessage` callers observe the
  // change synchronously, the way React 16 did.
  function addInstance(ins) {
    flushNoticeUpdate(() => setInstances((originInstances) => [...originInstances, ins]));
  }

  function removeInstance(ins) {
    flushNoticeUpdate(() =>
      setInstances((originInstances) => originInstances.filter((originIns) => ins !== originIns))
    );
  }

  function getContextConfig() {
    return configContext;
  }

  useImperativeHandle(ref, () => ({
    addInstance,
    removeInstance,
    getContextConfig,
  }));

  return (
    <>
      {React.Children.map(instances, (child, index) => React.cloneElement((child) as ReactElement<any>, { key: index }))}
    </>
  );
});

export default ContextHolderElement;
