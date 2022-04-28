import { Dialog, Transition } from "@headlessui/react"
import Image from "next/image"
import React, { FC, Fragment } from "react"

export interface AsideProps {
  menu: any[]
  isOpen: boolean
  closeSidebar: any
}

const MobileAside: FC<AsideProps> = ({ menu, isOpen, closeSidebar }: AsideProps) => {
  return (
    <>
      <div
        className="fixed inset-0 flex z-40 md:hidden bg-lightgrey thinBorderRight"
        role="dialog"
        aria-modal="true"
      >
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" aria-hidden="true"></div>

        <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-white">
          <div className="absolute top-0 right-0 -mr-12 pt-2 ">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset  focus:ring-lightgreen"
              onClick={closeSidebar}
            >
              <span className="sr-only">Close sidebar</span>
              <svg
                className="h-6 w-6 text-lightgreen"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="flex-shrink-0 flex items-center px-4">
            <div className="h-8 w-auto ">
              <Image
                width={200}
                height={32}
                objectFit={`contain`}
                src={`/svg/logo-black.svg`}
                alt="Workflow"
              />
            </div>
          </div>
          <div className="mt-5 flex-1 h-0 overflow-y-auto">
            <nav className="px-2 space-y-1">
              <a
                href="#"
                className="bg-green-200  group flex items-center px-2 py-2 text-base font-medium rounded-md"
              >
                <svg
                  className="text-gray-300 mr-4 flex-shrink-0 h-6 w-6"
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
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                <span>{`Knowledge Base`}</span>
              </a>
            </nav>
          </div>
        </div>

        <div className="flex-shrink-0 w-14" aria-hidden="true"></div>
      </div>
    </>
  )
}

export default MobileAside
