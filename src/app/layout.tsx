import { ReactNode } from "react";

import "@fontsource/kiwi-maru/300.css";
import "@fontsource/kiwi-maru/400.css";
import "@fontsource/kiwi-maru/500.css";

export type LayoutProps = {
  children: ReactNode
};

export default function Layout({ children }: LayoutProps) {
  return (
    <html lang="ja">
      <head />
      <body>
        {children}
      </body>
    </html>
  );
}
