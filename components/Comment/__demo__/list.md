---
order: 3
title:
  zh-CN: 配合List使用
  en-US: Usage with List
---

## zh-CN

配合 List 组件展现评论列表。

## en-US

Display the comments list with List component.

```js
import React from 'react';
import { Comment, List } from '@suzume-design/web-react';
import {
  IconHeart,
  IconMessage,
  IconHeartFill,
  IconStarFill,
  IconStar,
} from '@suzume-design/web-react/icon';

const App = () => {
  const [likes, setLikes] = React.useState([]);
  const [stars, setStars] = React.useState([]);
  const data = [
    {
      id: 1,
      author: 'Socrates',
      like: 13,
      star: 3,
      avatar:
        'data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%27160%27%20height%3D%27160%27%3E%3Crect%20width%3D%27160%27%20height%3D%27160%27%20fill%3D%27%23F7BA1E%27%2F%3E%3Ccircle%20cx%3D%2780%27%20cy%3D%2762%27%20r%3D%2730%27%20fill%3D%27%23ffffffdd%27%2F%3E%3Cpath%20d%3D%27M36%20160a44%2044%200%200188%200z%27%20fill%3D%27%23ffffffdd%27%2F%3E%3C%2Fsvg%3E',
      content: 'Comment body content.',
      datetime: '1 hour',
    },
    {
      id: 2,
      author: 'Balzac',
      like: 12,
      star: 1,
      avatar:
        'data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%27160%27%20height%3D%27160%27%3E%3Crect%20width%3D%27160%27%20height%3D%27160%27%20fill%3D%27%2386909C%27%2F%3E%3Ccircle%20cx%3D%2780%27%20cy%3D%2762%27%20r%3D%2730%27%20fill%3D%27%23ffffffdd%27%2F%3E%3Cpath%20d%3D%27M36%20160a44%2044%200%200188%200z%27%20fill%3D%27%23ffffffdd%27%2F%3E%3C%2Fsvg%3E',
      content: 'Comment body content.',
      datetime: '2 hour',
    },
  ];
  return (
    <List bordered={false} header={<span>2 comments</span>}>
      {data.map((item, index) => {
        const like = likes.indexOf(item.id) > -1;
        const star = stars.indexOf(item.id) > -1;
        return (
          <List.Item key={item.id}>
            <Comment
              author={item.author}
              avatar={item.avatar}
              content={item.content}
              datetime={item.datetime}
              actions={[
                <button
                  className="custom-comment-action"
                  key="heart"
                  onClick={() =>
                    setLikes(like ? likes.filter((x) => x !== item.id) : [...likes, item.id])
                  }
                >
                  {like ? (
                    <IconHeartFill style={{ color: '#f53f3f' }}/>
                  ) : (
                    <IconHeart />
                  )}
                  {item.like + (like ? 1 : 0)}
                </button>,
                <button
                  className="custom-comment-action"
                  key="star"
                  onClick={() =>
                    setStars(star ? stars.filter((x) => x !== item.id) : [...stars, item.id])
                  }
                >
                  {star ? (
                    <IconStarFill style={{ color: '#ffb400' }}/>
                  ) : (
                    <IconStar />
                  )}
                  {item.star + (star ? 1 : 0)}
                </button>,
                <button className="custom-comment-action" key="reply">
                  <IconMessage /> Reply
                </button>,
              ]}
            />
          </List.Item>
        );
      })}
    </List>
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
