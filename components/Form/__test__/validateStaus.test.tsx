import React from 'react';
import mountTest from '../../../tests/mountTest';
import { Form, Input } from '../..';
import { render } from '../../../tests/util';

mountTest(Form);

function mountForm(component: React.ReactElement) {
  return render(component);
}

describe('form validate status', () => {
  it('success', async () => {
    const wrapper = mountForm(
      <Form>
        <Form.Item label="name" field="name" validateStatus="success">
          <Input />
        </Form.Item>
      </Form>
    );

    expect(wrapper.find('.suzume-form-item')[0]).toHaveClass('suzume-form-item-status-success');
  });
  it('error', async () => {
    const wrapper = mountForm(
      <Form>
        <Form.Item label="name" field="name" validateStatus="error">
          <Input />
        </Form.Item>
      </Form>
    );
    expect(wrapper.find('.suzume-form-item')[0]).toHaveClass('suzume-form-item-status-error');
  });
  it('warning', async () => {
    const wrapper = mountForm(
      <Form>
        <Form.Item label="name" field="name" validateStatus="warning">
          <Input />
        </Form.Item>
      </Form>
    );

    expect(wrapper.find('.suzume-form-item')[0]).toHaveClass('suzume-form-item-status-warning');
  });

  it('help', async () => {
    const wrapper = mountForm(
      <Form>
        <Form.Item label="name" field="name" validateStatus="warning" help="this is warning status">
          <Input />
        </Form.Item>
      </Form>
    );

    expect(wrapper.find('.suzume-form-message')[0]).toHaveClass('suzume-form-message-help');
  });

  it('dont under Form', async () => {
    const wrapper = mountForm(
      <div>
        <Form.Item label="name" field="name" validateStatus="error" help="this is error status">
          <Input />
        </Form.Item>
      </div>
    );
    expect(wrapper.find('.suzume-form-item')[0]).toHaveClass('suzume-form-item-status-error');
    expect(wrapper.find('.suzume-form-message')[0]).toHaveClass('suzume-form-message-help');
  });
});
