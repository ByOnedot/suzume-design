import React from 'react';
import { render } from '../../../tests/util';
import mountTest from '../../../tests/mountTest';
import componentConfigTest from '../../../tests/componentConfigTest';
import Comment from '..';
import Avatar from '../../Avatar';
import Button from '../../Button';

mountTest(Comment);
componentConfigTest(Comment, 'Comment');

describe('Comment', () => {
  it('render basic Comment', () => {
    const actions = new Array(5).fill(5).map((_, index) => (
      <Button key={index} className="customer-actions">
        {index}
      </Button>
    ));
    const wrapper = render(
      <Comment
        actions={actions}
        author="Socrates"
        avatar={
          <Avatar>
            <img
              alt="avatar"
              src="data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%27640%27%20height%3D%27360%27%3E%3Crect%20width%3D%27640%27%20height%3D%27360%27%20fill%3D%27%23F77234%27%2F%3E%3Crect%20width%3D%27640%27%20height%3D%27140%27%20y%3D%27220%27%20fill%3D%27%2300000022%27%2F%3E%3C%2Fsvg%3E"
            />
          </Avatar>
        }
        content={<div>Comment body content.</div>}
        datetime="1 hour"
      />
    );
    expect(wrapper.find('.suzume-avatar')).toHaveLength(1);
    expect(wrapper.find('.suzume-comment-actions')[0].querySelectorAll('.suzume-btn')).toHaveLength(
      5
    );
    expect(wrapper.find('.suzume-comment-datetime')[0].innerHTML).toEqual('1 hour');
    expect(wrapper.find('.suzume-comment-content')[0].textContent).toEqual('Comment body content.');
  });

  it('render align right actions', () => {
    const wrapper = render(
      <Comment
        actions={[<Button key={1}>actions</Button>]}
        content={<div>Comment body content.</div>}
        datetime="1 hour"
      />
    );
    expect(wrapper.find('.suzume-comment-actions')[0].className).toContain(
      'suzume-comment-actions-align-left'
    );

    expect(wrapper.find('.suzume-comment-title')[0].className).toContain(
      'suzume-comment-title-align-left'
    );

    wrapper.rerender(
      <Comment
        actions={[<Button key={1}>actions</Button>]}
        content={<div>Comment body content.</div>}
        datetime="1 hour"
        align={{ datetime: 'right' }}
      />
    );

    expect(wrapper.find('.suzume-comment-title-align-right')).toHaveLength(1);

    wrapper.rerender(
      <Comment
        actions={[<Button key={1}>actions</Button>]}
        content={<div>Comment body content.</div>}
        datetime="1 hour"
        align="right"
      />
    );

    expect(wrapper.find('.suzume-comment-actions-align-right')).toHaveLength(1);
  });

  it('render children Node correctly', () => {
    const wrapper = render(
      <Comment>
        <Comment>
          <Comment />
        </Comment>
      </Comment>
    );
    expect(wrapper.find('.suzume-comment-inner-content')).toHaveLength(3);
  });
});
