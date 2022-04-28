import { ChevronRightIcon } from "@heroicons/react/outline";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { FC } from "react";
import { usePage } from "../../context/PageContext";

interface HeaderProps {
  baseUrl: any;
  onClick: any;
  activeUrl?: any;
  siderbarOpen?: any;
  setSiderbarOpen?: any;
}

const Header: FC<HeaderProps> = ({
  siderbarOpen,
  setSiderbarOpen,
  baseUrl,
  activeUrl,
  onClick,
}: HeaderProps) => {
  const router = useRouter();
  const { link, subLink, setPageData }: any = usePage();
  const navigate = () => {
    setPageData({ link: null, subLink: null });
    router.push("/knowledge-base/kb");
  };
  const handleSidebar = () => {
    setSiderbarOpen(true);
  };
  return (
    <header className="header bg-white shadow py-4 px-6">
      <div className="header-content flex items-center flex-row">
        <button
          type="button"
          className="px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
        >
          <span className="sr-only">Open sidebar</span>
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h7"
            />
          </svg>
        </button>
        <div className="flex-1 flex flex-row justify-start items-center">
          <span
            onClick={navigate}
            className={` ${
              link ? " text-black " : "text-lightgreen"
            } hover:underline cursor-pointer`}
          >
            {baseUrl.label}
          </span>
          {link && (
            <>
              <ChevronRightIcon
                className={`h-5 w-5 text-gray-500 cursor-pointer mx-1`}
              />
              <span className={` text-lightgreen  cursor-auto`}>
                {link.title}
              </span>
            </>
          )}
          {subLink?.title && (
            <>
              <ChevronRightIcon
                className={`h-5 w-5 text-gray-500 cursor-pointer mx-1`}
              />
              <span className={` text-lightgreen  cursor-auto`}>
                {subLink.title}
              </span>
            </>
          )}
        </div>
        <div className="flex ml-auto">
          <button
            type="button"
            className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </button>
          <div className="ml-3 relative">
            <div>
              <span className="sr-only">Open Profile menu</span>
              <div className="h-8 w-8 rounded-full">
                <Image
                  layout={`fill`}
                  className="h-8 w-8 rounded-full"
                  src={`/images/people/profile.jpeg`}
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
