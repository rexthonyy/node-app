import Head from "next/head";
import React, { FC, ReactNode } from "react";
import { ToastContainer } from "react-toastify";
import Content from "./Content";
import DesktopAside from "./DesktopAside";
import Header from "./Header";

type LayoutProps = {
  children?: ReactNode;
  baseUrl: any;
  title?: string;
};

const Layout: FC<LayoutProps> = ({ title, children, baseUrl }: LayoutProps) => (
  <>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <link
        href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
        rel="stylesheet"
      />
    </Head>
    <div>
      <div className="flex overflow-hidden bg-white">
        <div className="h-full w-full bg-gray-50 relative overflow-y-auto lg:ml-64">
          <ToastContainer />
          <DesktopAside menu={[]} />
          <main>
            <Header baseUrl={baseUrl} onClick={undefined} />
            <Content>{children}</Content>
          </main>
        </div>
      </div>
    </div>
  </>
);

export default Layout;
