import { SearchIcon } from "@heroicons/react/outline"
import { useRouter } from "next/router"
import React, { FC, useEffect, useState } from "react"
import { arrayMove, SortableContainer } from "react-sortable-hoc"
import { usePage } from "../../context/PageContext"
import { knowledgeBase } from "../../interfaces/KnowledgeBase"
import { getKnowledgeBase } from "../../requests/KnowledgeBase"
import Loading from "../common/Loading"
import Select from "../common/Select"
import ArticleTableHeader from "./ArticleTableHeader"
import ArticleTableItem from "./ArticleTableItem"

interface tableProps {}
const tableDatas = [{ name: "Alcides", updated_at: "2022-04-12T21:14:44.942Z" }]
const SortableContainerWidget: any = SortableContainer(({ children }: any) => {
  return <table className={`w-full `}>{children}</table>
})

const ArticleTable: FC<tableProps> = () => {
  const router = useRouter()
  const [load, setLoad] = useState<boolean>(true)
  const [tableData, setTableData] = useState<knowledgeBase[]>()
  const { setPageData, formData }: any = usePage()

  const navigateArticleSetting = () => {
    setPageData({
      link: { title: "manage Article" },
      openFor: "add"
    })
    router.push({
      pathname: `/knowledge-base/manage/categories/${33}/${33}`,
      query: { local_id: 2, type: "article" }
    })
  }
  const navigateAdd = () => {
    setPageData({
      link: { title: "Add Article" },
      openFor: "add"
    })
    router.push("/knowledge-base/articles/34/add")
  }
  const loadData = async () => {
    const result: any = await getKnowledgeBase(1, 30)
    if (result.data) {
      let data: knowledgeBase[] = result.data.results
      setTableData(data)
    }
  }
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoad(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])
  useEffect(() => {
    // loadData()
  }, [])

  const onSortEnd = ({ oldIndex, newIndex }: any) => {
    setTableData(arrayMove(tableData as any, oldIndex, newIndex))
  }
  return (
    <div className={`w-full flex flex-col  items-start`}>
      <div
        className={`w-full grid grid-cols-1 md:grid-cols-2 my-5 lg:grid-cols-3 basis-full gap-5 `}
      >
        <div className={`grid col-span-2 md:grid-cols-3  lg:basis-1/2 basis-full gap-5 `}>
          <div className="md:col-span-2 flex flex-row rounded-md overflow-hidden shadow-sm thinBorder ">
            <button className="flex items-center justify-center px-1 border-r mb-1 border-none h-[44px]">
              <SearchIcon className={`h-5 w-5 text-gray-500 mx-2 cursor-pointer`} />
            </button>
            <input
              type="text"
              className="py-2  outline-none  w-full h-[44px] rounded-br-md rounded-tr-md "
              placeholder={"Search for Knowledge Base"}
            />
          </div>
          <div className={`md:col-span-1`}>
            <Select options={["Filter"]} />
          </div>
        </div>
        <div className={`w-full col-span-2 lg:col-span-1 flex flex-row`}>
          <div className="md:col-span-2 flex flex-row w-full justify-end ">
          <button
              onClick={navigateArticleSetting}
              className="flex items-center md:mr-2 justify-center lg:my-0 my-3 px-6 text-white font-bold rounded-md overflow-hidden h-[44px] bg-primarygreen"
            >
              <span>{`ADVANCED SETTINGS`}</span>
            </button>
            <button
              onClick={navigateAdd}
              className="flex items-center justify-center lg:my-0 my-3 px-6 text-white font-bold rounded-md overflow-hidden h-[44px] bg-primarygreen"
            >
              <span>{`ADD`}</span>
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full mt-8">
        <div className="overflow-x-auto rounded-lg">
          <div className="align-middle inline-block min-w-full">
            <div className="shadow overflow-hidden sm:rounded-lg">
              {load ? (
                <Loading></Loading>
              ) : tableDatas ? (
                <SortableContainerWidget onSortEnd={onSortEnd} useDragHandle>
                  <ArticleTableHeader columns={[]} />
                  <tbody>
                    {tableDatas?.map((value: any, index: number) => (
                      <ArticleTableItem key={index} index={index} value={value} />
                    ))}
                  </tbody>
                </SortableContainerWidget>
              ) : (
                <div>{"No Records Found."}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ArticleTable
