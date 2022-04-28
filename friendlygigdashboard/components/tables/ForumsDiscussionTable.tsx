import { ChevronUpIcon, PencilAltIcon, SearchIcon } from "@heroicons/react/outline"
import Link from "next/link"
import Router, { useRouter } from "next/router"
import React, { FC } from "react"

interface forumsTableProps {}

const ForumsDiscussionTable: FC<forumsTableProps> = () => {
  const router = useRouter()

  const navigateAdd = () => {
    router.push("/forums/topics/add?params=22")
  }
  return (
    <>
      <div className={`lg:flex lg:flex-row items-center justify-between`}>
        <div className={`grid grid-cols-2  basis-full gap-5 `}>
          <div className="col-span-2 md:col-span-1 lg:col-span-1 flex flex-row ">
            <h1 className="flex items-center lg:text-xl justify-center">Sample Forum</h1>
          </div>
          <div
            className={`col-span-2 md:col-span-1 lg:col-span-1 float-right  flex flex-row md:justify-end lg:justify-end`}
          >
            <button
              onClick={navigateAdd}
              className="flex items-center justify-center lg:my-0 my-3 px-6 text-white font-bold rounded-md overflow-hidden h-[44px] bg-primarygreen"
            >
              <span>{`Start Discussion`}</span>
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col mt-8">
        <div className="overflow-x-auto rounded-lg">
          <div className="align-middle inline-block min-w-full">
            <div className="shadow overflow-hidden sm:rounded-lg">
              <table className="min-w-full  divide-y divide-gray-200">
                <thead>
                  <tr className="min-w-full p-7">
                    <th className="text-left font-medium text-gray-500 ">Discussion</th>
                    <th className="text-left font-medium text-gray-500 ">Last Active</th>
                  </tr>
                </thead>
                <tbody className="bg-white p-7">
                  <tr>
                    <td className="whitespace-nowrap  font-normal text-gray-900">
                      <div className="kb-name flex align-center">
                        <div className="icon-wrapper mr-2 flex flex-col w-[40px]">
                          <ChevronUpIcon className="w-3.5 h-4"></ChevronUpIcon>
                          <span className={` text-lightgreen cursor-pointer`}>0</span>
                        </div>
                        <div>
                          <span
                            className={`w-full flex flex-center justify-start hover:underline text-lightgreen hover:cursor-pointer`}
                          >
                            <Link href="/forums/topic/detail">
                              <a> Feature Request 002</a>
                            </Link>
                          </span>
                          <div className={`flex flex-row`}>
                            <span
                              className={`hover:underline hover:text-lightgreen hover:cursor-pointer text-xs `}
                            >{`Start By T`}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap  font-normal text-gray-900">
                      <span
                        className={`w-full flex flex-center justify-start hover:underline text-md  hover:cursor-pointer`}
                      >
                        {`2022/03/06T 15:14`}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ForumsDiscussionTable
