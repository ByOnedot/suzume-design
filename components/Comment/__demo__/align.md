---
order: 1
title:
  zh-CN: 对齐
  en-US: Alignment
---

## zh-CN

通过 `align` 属性可以设置 `datetime` 和 `actions` 的对齐方式.

## en-US

Alignment of datetime and actions.

```js
import React from 'react';
import { Comment, Avatar } from '@suzume-design/web-react';
import {
  IconHeartFill,
  IconMessage,
  IconStarFill,
  IconHeart,
  IconStar,
} from '@suzume-design/web-react/icon';

const App = () => {
  const [like, setLike] = React.useState(true);
  const [star, setStar] = React.useState(true);
  const actions = [
    <button className="custom-comment-action" key="heart" onClick={() => setLike(!like)}>
      {like ? (
        <IconHeartFill style={{ color: '#f53f3f' }}/>
      ) : (
        <IconHeart />
      )}
      {83 + (like ? 1 : 0)}
    </button>,
    <button className="custom-comment-action" key="star" onClick={() => setStar(!star)}>
      {star ? (
        <IconStarFill style={{ color: '#ffb400' }}/>
      ) : (
        <IconStar />
      )}
      {3 + (star ? 1 : 0)}
    </button>,
    <button className="custom-comment-action" key="reply">
      <IconMessage /> Reply
    </button>,
  ];
  return (
    <Comment
      actions={actions}
      align="right"
      author="Balzac"
      avatar={
        <Avatar>
          <img
            alt="avatar"
            src="data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%27160%27%20height%3D%27160%27%3E%3Crect%20width%3D%27160%27%20height%3D%27160%27%20fill%3D%27%2386909C%27%2F%3E%3Ccircle%20cx%3D%2780%27%20cy%3D%2762%27%20r%3D%2730%27%20fill%3D%27%23ffffffdd%27%2F%3E%3Cpath%20d%3D%27M36%20160a44%2044%200%200188%200z%27%20fill%3D%27%23ffffffdd%27%2F%3E%3C%2Fsvg%3E"
          />
        </Avatar>
      }
      content={
        <div>
          A design is a plan or specification for the construction of an object or system or for the
          implementation of an activity or process, or the result of that plan or specification in
          the form of a prototype, product or process.
        </div>
      }
      datetime="1 hour"
    />
  );
};

export default App;
```

```css:silent
.custom-comment-action {
  padding: 0 4px;
  line-height: 24px;
  border-radius: 2px;
  background: transparent;
  transition: all 0.1s ease;
  color: var(--color-text-1);
  cursor: pointer;
  display: inline-block;
  border: none;
}

.custom-comment-action:focus-visible {
  box-shadow: inset 0 0 0 2px var(--color-primary-light-3);
}

.custom-comment-action:hover {
  background: var(--color-fill-3);
}
```
