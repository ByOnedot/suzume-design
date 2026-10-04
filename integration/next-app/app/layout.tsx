import type { Metadata } from 'next';
import '@byonedot/web-react/dist/css/suzume.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'Suzume Design - Next.js consumer',
  description: 'Clean App Router consumer used to validate @byonedot/web-react.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
