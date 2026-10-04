import React from 'react';
import { render } from '../../../tests/util';
import mountTest from '../../../tests/mountTest';
import componentConfigTest from '../../../tests/componentConfigTest';
import Avatar from '..';
import IconEdit from '../../../icon/react-icon/IconEdit';

const AvatarGroup = Avatar.Group;

let container: HTMLDivElement | null;

mountTest(Avatar);
componentConfigTest(Avatar, 'Avatar');
componentConfigTest(Avatar.Group, 'Avatar.Group');

describe('Avatar', () => {
  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container && document.body.removeChild(container);
    container = null;
  });

  it('size', () => {
    render(<Avatar size={100}>B</Avatar>, { container });
    const text = container?.querySelector<HTMLDivElement>('.suzume-avatar');
    expect(text?.style.width).toBe('100px');
  });

  it('avatar group', () => {
    render(
      <AvatarGroup size={60} shape="square" autoFixFontSize={false}>
        <Avatar>B</Avatar>
        <Avatar>Suzume</Avatar>
        <Avatar>Design</Avatar>
      </AvatarGroup>,
      { container }
    );

    const component = container?.querySelector('.suzume-avatar-group');

    expect(component?.childElementCount).toBe(3);

    const avatars = Array.from(container?.querySelectorAll('.suzume-avatar') || []);

    const texts = ['B', 'Suzume', 'Design'];

    avatars.forEach((avatar, index) => {
      expect(avatar.classList.contains('suzume-avatar-square')).toBe(true);
      expect(avatar.getAttribute('style')).toBe(
        `width: 60px; height: 60px; font-size: 30px; z-index: ${
          avatars.length - index
        }; margin-left: ${index === 0 ? 0 : -15}px;`
      );
      expect(avatar?.querySelector('.suzume-avatar-text')?.innerHTML).toBe(texts[index]);
    });
  });

  it('triggerIcon button', () => {
    render(<Avatar triggerIcon={<IconEdit />}>A</Avatar>, { container });

    const component = container?.querySelector('.suzume-avatar');
    const triggerButton = component?.querySelector('.suzume-avatar-trigger-icon-button');

    expect(triggerButton?.childElementCount).toBe(1);
    expect(triggerButton?.childNodes[0].nodeName).toBe('svg');
  });

  it('triggerIcon mask', () => {
    render(
      <Avatar triggerIcon={<IconEdit />} triggerType="mask">
        A
      </Avatar>,
      { container }
    );

    const component = container?.querySelector('.suzume-avatar');
    const triggerButton = component?.querySelector('.suzume-avatar-trigger-icon-mask');

    expect(triggerButton?.childElementCount).toBe(1);
    expect(triggerButton?.childNodes[0].nodeName).toBe('svg');
  });
});
