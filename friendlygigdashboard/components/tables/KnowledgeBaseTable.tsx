import { SearchIcon } from "@heroicons/react/outline"
import { useRouter } from "next/router"
import React, { FC, useEffect, useRef, useState } from "react"
import { arrayMove, SortableContainer } from "react-sortable-hoc"
import { usePage } from "../../context/PageContext"
import { knowledgeBase } from "../../interfaces/KnowledgeBase"
import { getKnowledgeBase } from "../../requests/KnowledgeBase"
import Select from "../common/Select"
import KnowledgeBaseItem from "./KnowledgeBaseItem"

interface KnowledgeBaseTableProps {}

const SortableContainerWidget: any = SortableContainer(({ children }: any) => {
  return <table className="min-w-full divide-y divide-gray-200">{children}</table>
})

const KnowledgeBaseTable: FC<KnowledgeBaseTableProps> = () => {
  const nodeRef = useRef(null)
  const router = useRouter()
  const [tableData, setTableData] = useState<knowledgeBase[]>()
  const { setPageData }: any = usePage()

  const navigateAdd = () => {
    setPageData({
      link: { title: "Add Knowledge Base" },
      openFor: "add"
    })
    router.push("/knowledge-base/kb/add")
  }

  const loadData = async () => {
    const result: any = await getKnowledgeBase(1, 30)
    if (result.data) {
      let data: knowledgeBase[] = result.data.results
      setTableData(data)
    }
  }

  useEffect(() => {
    // loadData()
  }, [])

  const onSortEnd = ({ oldIndex, newIndex }: any) => {
    setTableData(arrayMove(tableData as any, oldIndex, newIndex))
  }
  return (
    <>
      <div className={`lg:flex lg:flex-row items-center justify-between`}>
        <div className={`grid md:grid-cols-3 lg:basis-1/2 basis-full gap-5 `}>
          <div className="md:col-span-2 flex flex-row rounded-md overflow-hidden shadow-sm thinBorder ">
            <button className="flex items-center justify-center px-1 border-r  border-none h-[44px]">
              <SearchIcon className={`h-5 w-5 text-gray-500 mx-2 cursor-pointer`} />
            </button>
            <input
              type="text"
              className="py-2  outline-none  w-full  h-[44px] rounded-br-md rounded-tr-md "
              placeholder={"Search for Knowledge Base"}
            />
          </div>
          <div className={`md:col-span-1`}>
            <Select options={["Filter"]} />
          </div>
        </div>
        <div className={`flex flex-row lg:basis-1/2 basis-full justify-end`}>
          <button
            onClick={navigateAdd}
            className="flex items-center justify-center lg:my-0 my-3 px-6 text-white font-bold rounded-md overflow-hidden h-[44px] bg-primarygreen"
          >
            <span>{`ADD`}</span>
          </button>
        </div>
      </div>
      <div className="flex flex-col mt-8">
        <div className="overflow-x-auto rounded-lg">
          <div className="align-middle inline-block min-w-full">
            <div className="shadow overflow-hidden sm:rounded-lg">
              <SortableContainerWidget onSortEnd={onSortEnd} useDragHandle>
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="text-center font-medium text-gray-500 w-[40px]"></th>
                    <th scope="col" className="w-[80px] text-center font-medium text-gray-500  ">
                      #
                    </th>
                    <th scope="col" className="text-left font-medium text-gray-500  ">
                      Knowledge Base
                    </th>
                    <th scope="col" className="text-left font-medium text-gray-500  ">
                      Footer
                    </th>
                    <th scope="col" className="w-[100px] text-center font-medium text-gray-500  ">
                      Status
                    </th>
                    <th scope="col" className="w-[100px] text-center font-medium text-gray-500  ">
                      Preview
                    </th>
                    <th scope="col" className="w-[100px] text-center font-medium text-gray-500  ">
                      Edit
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  <KnowledgeBaseItem />
                </tbody>
              </SortableContainerWidget>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default KnowledgeBaseTable
