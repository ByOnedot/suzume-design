import { Alert, Space } from '@byonedot/web-react';
import { ServerGrid } from './server-grid';

/**
 * Rendered by the React Server Component renderer. It is deliberately NOT
 * marked `"use client"`: it must keep working as a Server Component so the
 * fixture proves that importing the library from the server does not force a
 * boundary on this file.
 */
export function ServerPanel() {
  return (
    <section data-testid="server-panel">
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Alert
          type="info"
          title="Server Component"
          content="Rendered on the server without a client boundary."
        />
        <ServerGrid />
      </Space>
    </section>
  );
}
