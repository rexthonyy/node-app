import { PencilAltIcon, SearchIcon } from "@heroicons/react/outline"
import Link from "next/link"
import Router, { useRouter } from "next/router"
import React, { FC } from "react"

interface forumsTableProps {}

const ForumsBaseTable: FC<forumsTableProps> = () => {
  const router = useRouter()

  const navigateAdd = () => {
    router.push("/forums/add")
  }
  return (
    <>
      <div className={`lg:flex lg:flex-row items-center justify-between`}>
        <div className={`grid grid-cols-2  basis-full gap-5 `}>
          <div className="col-span-2 md:col-span-1 lg:col-span-1 flex flex-row rounded-md overflow-hidden shadow-sm thinBorder ">
            <button className="flex items-center justify-center px-1 border-r  border-none h-[44px]">
              <SearchIcon className={`h-5 w-5 text-gray-500 mx-2 cursor-pointer`} />
            </button>
            <input
              type="text"
              className="py-2  outline-none  w-full  h-[44px] rounded-br-md rounded-tr-md "
              placeholder={"Search for Knowledge Base"}
            />
          </div>
          <div
            className={`col-span-2 md:col-span-1 lg:col-span-1 float-right  flex flex-row md:justify-end lg:justify-end`}
          >
            <button
              onClick={navigateAdd}
              className="flex items-center justify-center lg:my-0 my-3 px-6 text-white font-bold rounded-md overflow-hidden h-[44px] bg-primarygreen"
            >
              <span>{`ADD`}</span>
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
                    <th className="text-left font-medium text-gray-500 ">Forum</th>
                    <th className="text-right font-medium text-gray-500 ">Edit</th>
                  </tr>
                </thead>
                <tbody className="bg-white p-7">
                  <tr>
                    <td className="whitespace-nowrap  font-normal text-gray-900">
                      <div className="kb-name flex align-center">
                        <div>
                          <span
                            className={`w-full flex flex-center justify-start hover:underline text-md text-lightgreen hover:cursor-pointer`}
                          >
                            <Link href="/forums/topics?params=22">
                              <a> Sample Forum </a>
                            </Link>
                          </span>
                          <span
                            className={` hover:cursor-pointer text-xs `}
                          >{`${"This is description for sample forum"}`}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className={`float-right `}>
                        <PencilAltIcon
                          className={`h-5 w-5 text-gray-500 cursor-pointer`}
                          onClick={() => Router.push(`forums/22`)}
                        />
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

export default ForumsBaseTable
