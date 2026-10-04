import type { Metadata } from 'next';
import '@suzume-design/web-react/dist/css/suzume.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'Suzume Design - Next.js consumer',
  description: 'Clean App Router consumer used to validate @suzume-design/web-react.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
