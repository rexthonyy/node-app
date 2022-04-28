import Link from "next/link"
import React, { FC } from "react"
import { useRouter } from "next/router"
interface AsideProps {
  menu: any[]
}
const DesktopAside: FC<AsideProps> = ({ menu }: AsideProps) => {
  const router = useRouter()

  return (
    <aside className="fixed hidden z-20 h-full top-0 left-0 flex lg:flex flex-shrink-0 flex-col w-64 transition-width duration-75">
      <div className="relative flex-1 flex flex-col min-h-0 border-r border-gray-200 pt-0 bg-lightgrey">
        <div className="flex-1 flex flex-col pb-4 overflow-y-auto">
          <div className="flex-1 px-3 space-y-1">
            <a className="flex items-center lg:ml-2.5 mt-4 mb-5">
              <img src="/svg/logo-black.svg" className="h-8 mr-2" alt="Windster Logo" />
            </a>
            <ul className="space-y-2 pb-2">
              <li>
                <select className="block border-b-[1px] dark:border-gray-600 p-2.5 rounded-lg w-full text-[17px]">
                  <option>Knowledge Base</option>
                  <option>Help Desk</option>
                </select>
              </li>
              <li>
                <Link href="/dashboard">
                  <a
                    className={
                      router.pathname == "/dashboard"
                        ? "text-lightgreen font-normal rounded-lg flex items-center p-2  bg-tint"
                        : "text-gray-700 font-normal rounded-lg flex items-center p-2  hover:bg-tint hover:text-lightgreen "
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 text-gray-500 transition duration-75"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                      />
                    </svg>
                    <span className="ml-3">{"Dashboard"}</span>
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/knowledge-base/kb">
                  <a
                    className={
                      router.pathname == "/knowledge-base/kb"
                        ? "text-lightgreen font-normal rounded-lg flex items-center p-2  bg-tint"
                        : "text-gray-700 font-normal rounded-lg flex items-center p-2  hover:bg-tint hover:text-lightgreen "
                    }
                  >
                    <svg
                      className="w-6 h-6 flex-shrink-0 transition duration-75"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                    </svg>
                    <span className="ml-3 flex-1 whitespace-nowrap">{"Knowledge Base"}</span>
                    <span className="bg-gray-200 ml-3 text-sm font-medium inline-flex items-center justify-center px-2 rounded-full">
                      12
                    </span>
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/forums">
                  <a
                    className={
                      router.pathname == "/forums"
                        ? "text-lightgreen font-normal rounded-lg flex items-center p-2  bg-tint"
                        : "text-gray-700 font-normal rounded-lg flex items-center p-2  hover:bg-tint hover:text-lightgreen "
                    }
                  >
                    <svg
                      className="w-6 h-6 flex-shrink-0 transition duration-75"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                      />
                    </svg>
                    <span className="ml-3 flex-1 whitespace-nowrap">{"Forums"}</span>
                    <span className="bg-gray-200 ml-3 text-sm font-medium inline-flex items-center justify-center px-2 rounded-full">
                      12
                    </span>
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/users">
                  <a
                    className={
                      router.pathname == "/users"
                        ? "text-lightgreen font-normal rounded-lg flex items-center p-2  bg-tint"
                        : "text-gray-700 font-normal rounded-lg flex items-center p-2  hover:bg-tint hover:text-lightgreen "
                    }
                  >
                    <svg
                      className="w-6 h-6 flex-shrink-0 transition duration-75"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                    <span className="ml-3">{"Users"}</span>
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/groups">
                  <a
                    className={
                      router.pathname == "/groups"
                        ? "text-lightgreen font-normal rounded-lg flex items-center p-2  bg-tint"
                        : "text-gray-700 font-normal rounded-lg flex items-center p-2  hover:bg-tint hover:text-lightgreen "
                    }
                  >
                    <svg
                      className="w-6 h-6 flex-shrink-0 transition duration-75"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <span className="ml-3">{"Groups"}</span>
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/roles">
                  <a
                    className={
                      router.pathname == "/roles"
                        ? "text-lightgreen font-normal rounded-lg flex items-center p-2  bg-tint"
                        : "text-gray-700 font-normal rounded-lg flex items-center p-2  hover:bg-tint hover:text-lightgreen "
                    }
                  >
                    <svg
                      className="w-6 h-6 flex-shrink-0 transition duration-75"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="ml-3">{"Roles"}</span>
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/organizations">
                  <a
                    className={
                      router.pathname == "/organizations"
                        ? "text-lightgreen font-normal rounded-lg flex items-center p-2  bg-tint"
                        : "text-gray-700 font-normal rounded-lg flex items-center p-2  hover:bg-tint hover:text-lightgreen "
                    }
                  >
                    <svg
                      className="w-6 h-6 flex-shrink-0 transition duration-75"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                    <span className="ml-3">{"Organizations"}</span>
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/overviews">
                  <a
                    className={
                      router.pathname == "/overviews"
                        ? "text-lightgreen font-normal rounded-lg flex items-center p-2  bg-tint"
                        : "text-gray-700 font-normal rounded-lg flex items-center p-2  hover:bg-tint hover:text-lightgreen "
                    }
                  >
                    <svg
                      className="w-6 h-6 flex-shrink-0 transition duration-75"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                    <span className="ml-3">{"Overviews"}</span>
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/text-modules">
                  <a
                    className={
                      router.pathname == "/text-modules"
                        ? "text-lightgreen font-normal rounded-lg flex items-center p-2  bg-tint"
                        : "text-gray-700 font-normal rounded-lg flex items-center p-2  hover:bg-tint hover:text-lightgreen "
                    }
                  >
                    <svg
                      className="w-6 h-6 flex-shrink-0 transition duration-75"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <span className="ml-3">{"Text Modules"}</span>
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/macros">
                  <a
                    className={
                      router.pathname == "/macros"
                        ? "text-lightgreen font-normal rounded-lg flex items-center p-2  bg-tint"
                        : "text-gray-700 font-normal rounded-lg flex items-center p-2  hover:bg-tint hover:text-lightgreen "
                    }
                  >
                    <svg
                      className="w-6 h-6 flex-shrink-0 transition duration-75"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="ml-3">{"Macros"}</span>
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/tags">
                  <a
                    className={
                      router.pathname == "/tags"
                        ? "text-lightgreen font-normal rounded-lg flex items-center p-2  bg-tint"
                        : "text-gray-700 font-normal rounded-lg flex items-center p-2  hover:bg-tint hover:text-lightgreen "
                    }
                  >
                    <svg
                      className="w-6 h-6 flex-shrink-0 transition duration-75"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                      />
                    </svg>
                    <span className="ml-3">{"Tags"}</span>
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/calendars">
                  <a
                    className={
                      router.pathname == "/calendars"
                        ? "text-lightgreen font-normal rounded-lg flex items-center p-2  bg-tint"
                        : "text-gray-700 font-normal rounded-lg flex items-center p-2  hover:bg-tint hover:text-lightgreen "
                    }
                  >
                    <svg
                      className="w-6 h-6 flex-shrink-0 transition duration-75"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="ml-3">{"Calendars"}</span>
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/slas">
                  <a
                    className={
                      router.pathname == "/slas"
                        ? "text-lightgreen font-normal rounded-lg flex items-center p-2  bg-tint"
                        : "text-gray-700 font-normal rounded-lg flex items-center p-2  hover:bg-tint hover:text-lightgreen "
                    }
                  >
                    <svg
                      className="w-6 h-6 flex-shrink-0 transition duration-75"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="ml-3">{"SLAs"}</span>
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/triggers">
                  <a
                    className={
                      router.pathname == "/triggers"
                        ? "text-lightgreen font-normal rounded-lg flex items-center p-2  bg-tint"
                        : "text-gray-700 font-normal rounded-lg flex items-center p-2  hover:bg-tint hover:text-lightgreen "
                    }
                  >
                    <svg
                      className="w-6 h-6 flex-shrink-0 transition duration-75"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                    <span className="ml-3">{"Trigger"}</span>
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/web-hooks">
                  <a
                    className={
                      router.pathname == "/web-hooks"
                        ? "text-lightgreen font-normal rounded-lg flex items-center p-2  bg-tint"
                        : "text-gray-700 font-normal rounded-lg flex items-center p-2  hover:bg-tint hover:text-lightgreen "
                    }
                  >
                    <svg
                      className="w-6 h-6 flex-shrink-0 transition duration-75"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                      />
                    </svg>
                    <span className="ml-3">{"Web Hook"}</span>
                  </a>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default DesktopAside
