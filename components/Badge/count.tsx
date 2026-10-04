import { useState } from 'react';
import cs from '../_util/classNames';
import usePrevious from '../_util/hooks/usePrevious';
import SuzumeCSSTransition from '../_util/CSSTransition';

function Count({ prefixCls, maxCount, count, className, style }) {
  const [isEntered, setIsEntered] = useState(false);
  const oldCount = usePrevious(count);
  const isChanged = count !== oldCount;

  return (
    <SuzumeCSSTransition
      classNames="badge-zoom"
      in={count > 0}
      timeout={300}
      appear
      mountOnEnter
      unmountOnExit
      onEntered={() => {
        setIsEntered(true);
      }}
    >
      <span className={className} style={style}>
        <span key={count} className={cs({ [`${prefixCls}-number-text`]: isEntered && isChanged })}>
          {maxCount && count > maxCount ? `${maxCount}+` : count}
        </span>
      </span>
    </SuzumeCSSTransition>
  );
}

export default Count;
