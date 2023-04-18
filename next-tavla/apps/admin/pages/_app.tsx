import "@shared/styles/global.css";
import "@shared/styles/reset.css";
import "@shared/styles/fonts.css";
import "@shared/styles/spacing.css";

import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
