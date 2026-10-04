import React from 'react';
import { render } from '../../../tests/util';
import Steps from '..';

const Step = Steps.Step;

describe('Steps type circle test', () => {
  it('direction horizontal', () => {
    const component = render(
      <Steps current={1}>
        <Step title="Step1" description="Description1" />
        <Step title="Step2" description="Description2" />
        <Step title="Step3" description="Description3" />
      </Steps>
    );

    expect(component.find('.suzume-steps-horizontal')).toHaveLength(1);
    expect(component.find('.suzume-steps-label-horizontal')).toHaveLength(1);

    expect(component.find('.suzume-steps-item-tail')).toHaveLength(0);

    for (let i = 0; i < 3; i++) {
      const item = component.find('.suzume-steps-item').item(i);

      if (i === 0) {
        expect(item.className).toContain('suzume-steps-item-active');
      }

      expect(item.querySelector('.suzume-steps-item-icon .suzume-steps-icon')?.innerHTML).toBe(
        String(i + 1)
      );
      expect(item.querySelector('.suzume-steps-item-title')?.innerHTML).toBe(`Step${i + 1}`);
      expect(item.querySelector('.suzume-steps-item-description')?.innerHTML).toBe(
        `Description${i + 1}`
      );
    }
  });

  it('direction vertical', () => {
    const component = render(
      <Steps direction="vertical" current={1}>
        <Step title="Step1" description="Description1" />
        <Step title="Step2" description="Description2" />
        <Step title="Step3" description="Description3" />
      </Steps>
    );

    expect(component.find('.suzume-steps-vertical')).toHaveLength(1);
    expect(component.find('.suzume-steps-label-horizontal')).toHaveLength(1);

    expect(component.find('.suzume-steps-item-tail')).toHaveLength(3);

    for (let i = 0; i < 3; i++) {
      const item = component.find('.suzume-steps-item').item(i);
      expect(item.querySelector('.suzume-steps-item-icon .suzume-steps-icon')?.innerHTML).toBe(
        String(i + 1)
      );
      expect(item.querySelector('.suzume-steps-item-title')?.innerHTML).toBe(`Step${i + 1}`);
      expect(item.querySelector('.suzume-steps-item-description')?.innerHTML).toBe(
        `Description${i + 1}`
      );
    }
  });

  it('label vertical', () => {
    const component = render(
      <Steps labelPlacement="vertical" current={1}>
        <Step title="Step1" description="Description1" />
        <Step title="Step2" description="Description2" />
        <Step title="Step3" description="Description3" />
      </Steps>
    );

    expect(component.find('.suzume-steps-label-vertical')).toHaveLength(1);

    expect(component.find('.suzume-steps-item-tail')).toHaveLength(3);

    for (let i = 0; i < 3; i++) {
      const item = component.find('.suzume-steps-item').item(i);
      expect(item.querySelector('.suzume-steps-item-icon .suzume-steps-icon')?.innerHTML).toBe(
        String(i + 1)
      );
      expect(item.querySelector('.suzume-steps-item-title')?.innerHTML).toBe(`Step${i + 1}`);
      expect(item.querySelector('.suzume-steps-item-description')?.innerHTML).toBe(
        `Description${i + 1}`
      );
    }
  });

  it('lineless', () => {
    const component = render(
      <Steps lineless labelPlacement="vertical" current={1}>
        <Step title="Step1" description="Description1" />
        <Step title="Step2" description="Description2" />
        <Step title="Step3" description="Description3" />
      </Steps>
    );

    expect(component.find('.suzume-steps-item-tail')).toHaveLength(0);
  });
});
