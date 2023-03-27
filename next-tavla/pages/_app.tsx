import "@/styles/global.css";
import "@/styles/reset.css";
import "@/styles/fonts.css";
import "@/styles/spacing.css";

export default function App({
  Component,
  pageProps,
}: {
  Component: any;
  pageProps: any;
}) {
  return <Component {...pageProps} />;
}
