import { hello } from "@/api/auth/hello";
import Header from "@/components/Header";
import { hiddenHeader } from "@/constants/hiddenHeader";
import { publicRoutes } from "@/constants/publicRoutes";
import "@/public/styles/globals.css";
import { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const [load, setLoad] = useState(false);
  const router = useRouter();
  const pageLoad = useMemo(
    () => load || publicRoutes.includes(router.pathname),
    [load, router.pathname]
  );

  useEffect(() => {
    hello().then((res) => {
      setLoad(res.status === 200);
    });
  }, [router.pathname]);

  return (
    <>
      {!hiddenHeader.includes(router.pathname) && pageLoad && <Header />}
      {pageLoad && <Component {...pageProps} />}
    </>
  );
}
