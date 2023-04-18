import "@entur/tokens/dist/styles.css";
import "@shared/styles/themes/default.css";
import "@shared/styles/themes/dark.css";
import "@shared/styles/themes/light.css";
import "@shared/styles/global.css";
import "@shared/styles/reset.css";
import "@shared/styles/fonts.css";
import "@shared/styles/spacing.css";

import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
