import { EyeIcon, PencilAltIcon } from "@heroicons/react/outline"
import Link from "next/link"
import Router from "next/router"
import React, { useRef } from "react"
import { SortableElement } from "react-sortable-hoc"
import { usePage } from "../../context/PageContext"
import { knowledgeBase } from "../../interfaces/KnowledgeBase"
import DragHandle from "../common/DragHandle"
import Select from "../common/Select"

const KnowledgeBaseItem: any = SortableElement(({ value }: any) => {
  const nodeRef = useRef(null)
  const { setPageData }: any = usePage()

  const navigateEdit = (data: any, openFor: string) => {
    // setPageData({
    //   link: { title: data.name },
    //   subLink: { title: "" },
    //   formData: data,
    //   openFor
    // })
    // Router.push(`/knowledge-base/kb/detail${data.id}`)
    Router.push(`/knowledge-base/kb/detail1`)
  }

  // const navigateDetail = (data: any, openFor: string) => {
  //   setPageData({
  //     link: { title: data.name },
  //     subLink: { title: data.name },
  //     formData: data,
  //     openFor
  //   })
  //   Router.push(`/knowledge-base/kb/detail/${data.id}`)
  // }

  // const navigateWithParam = (data: any, openFor: string, view: string) => {
  //   setPageData({
  //     link: { title: data.name },
  //     // subLink: { title: data.name },
  //     formData: data,
  //     openFor
  //   })
  //   Router.push({
  //     pathname: `/knowledge-base/categories/detail/${data.id}`,
  //     query: { view }
  //   })
  // }

  const item: knowledgeBase = value
  return (
    <tr>
      <td className="whitespace-nowrap  font-normal text-gray-900">
        <DragHandle ref={undefined} />
      </td>
      <td className="whitespace-nowrap  font-normal text-gray-900">
        <Select options={[1, 2, 3, 4]} />
      </td>
      <td className="whitespace-nowrap  font-normal text-gray-900">
        <div className="kb-name flex align-center">
          <div className="icon-wrapper mr-2">
            <PencilAltIcon className={`w-[40px] text-lightgreen cursor-pointer`} />
          </div>
          <div>
            <span
              className={`w-full flex flex-center justify-start hover:underline hover:text-lightgreen hover:cursor-pointer`}
            >
              <Link href="/knowledge-base/kb/detail/12312">
                <a> Knowledge Base Name 01</a>
              </Link>
            </span>
            <div className={`flex flex-row`}>
              <span
                className={`hover:underline hover:text-lightgreen hover:cursor-pointer text-xs `}
              >{`${"Categories"}`}</span>
              &nbsp;&nbsp;
              <span
                className={`hover:underline hover:text-lightgreen hover:cursor-pointer text-xs `}
              >{`15 Articles`}</span>
            </div>
          </div>
        </div>
      </td>
      <td className="whitespace-nowrap  font-normal text-gray-500">Apr 23 ,2021</td>
      <td className={`whitespace-nowrap`}>
        <div className="icon-center">
          <span
            className={`h-[16px] w-[16px] bg-blue-600 border-black border-1 rounded-full cursor-pointer `}
          ></span>
        </div>
      </td>
      <td>
        <div className="icon-center">
          <EyeIcon className={`h-5 w-5 text-gray-500 mx-2 cursor-pointer`} />
        </div>
      </td>
      <td>
        <span className={`icon-center`}>
          <PencilAltIcon
            className={`h-5 w-5 text-gray-500 cursor-pointer`}
            onClick={() => navigateEdit(value, "edit")}
          />
        </span>
      </td>
    </tr>
  )
})

export default KnowledgeBaseItem
