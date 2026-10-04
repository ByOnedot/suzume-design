import React from 'react';
import { render } from '../../../tests/util';
import IconEdit from '../../../icon/react-icon/IconEdit';
import mountTest from '../../../tests/mountTest';
import componentConfigTest from '../../../tests/componentConfigTest';
import Layout from '..';

const { Sider, Content, Footer, Header } = Layout;

mountTest(Layout);
componentConfigTest(Layout, 'Layout');

describe('Layout', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('detect the sider as children', async () => {
    const wrapper = render(
      <Layout>
        <Sider>Sider</Sider>
        <Content>Content</Content>
      </Layout>
    );
    expect(wrapper.find('.suzume-layout')[0].className).toContain('suzume-layout-has-sider');
  });

  it('detect the sider-light when set light theme', async () => {
    const wrapper = render(
      <Layout>
        <Sider theme="light">Sider</Sider>
        <Content>Content</Content>
      </Layout>
    );
    expect(wrapper.find('.suzume-layout-sider')[0].className).toContain(
      'suzume-layout-sider-light'
    );
  });

  it('detect the sider width 50%', async () => {
    const wrapper = render(
      <Layout style={{ height: '400px' }}>
        <Header>Header</Header>
        <Layout>
          <Sider style={{ width: '50%' }}>Sider</Sider>
          <Content>Content</Content>
        </Layout>
        <Footer>Footer</Footer>
      </Layout>
    );
    expect(wrapper.find('.suzume-layout-sider').item(0).style.width).toBe('50%');
  });

  it('sider with controlled', async () => {
    const wrapper = render(
      <Sider width={200} collapsed collapsedWidth={60} collapsible>
        Sider
      </Sider>
    );

    expect(wrapper.find('.suzume-layout-sider').item(0).style.width).toEqual('60px');
    wrapper.rerender(
      <Sider width={300} collapsed={false} collapsedWidth={60} collapsible>
        Sider
      </Sider>
    );
    vi.advanceTimersByTime(1000);
    expect(wrapper.find('.suzume-layout-sider').item(0).style.width).toEqual('300px');
  });

  it('has Resize Sider', () => {
    const wrapper = render(
      <Sider
        width={200}
        resizeBoxProps={{
          directions: ['right'],
          resizeIcons: {
            right: <IconEdit />,
          },
        }}
      />
    );
    expect(wrapper.find('.suzume-resizebox')).toHaveLength(1);
    expect(wrapper.find('.suzume-icon-edit')).toHaveLength(1);
  });
});
