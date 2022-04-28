import { Tab } from "@headlessui/react"
import { useRouter } from "next/router"
import { FC } from "react"
import ArticleTable from "../tables/ArticleTable"
import CategoryTable from "../tables/CategoryTable"

interface componentProps {
  tabs: string[]
}

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ")
}

const KnowledgeBaseDetailsTabPane: FC<componentProps> = ({ tabs }) => {
  const router = useRouter()
  return (
    <div className={`w-full flex flex-col`}>
      <div className="flex flex-col items-start w-full sm:px-0  bg-friendly-background-gray">
        <Tab.Group defaultIndex={router?.query?.view === "category" ? 0 : 1}>
          <Tab.List className="flex flex-row px-1 items-start justify-start  w-full  ">
            {tabs.map((tab) => (
              <Tab
                key={tab}
                className={({ selected }) =>
                  classNames(
                    " w-fit-content min-w-[120px] max-w-fit py-2.5 px-2 text-[11px] md:text-sm leading-5 font-medium ",
                    selected
                      ? " text-lightgreen border-b-lightgreen border-b-[2px] border-solid"
                      : "  "
                  )
                }
              >
                {tab}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels className=" w-full">
            {tabs.map((tab, idx) => (
              <Tab.Panel key={idx} className={classNames(" rounded-xl ")}>
                {tab.toLowerCase() === "categories" && (
                  <div>
                    <CategoryTable />
                  </div>
                )}
                {tab.toLowerCase() === "articles" && (
                  <div>
                    <ArticleTable />
                  </div>
                )}
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  )
}

export default KnowledgeBaseDetailsTabPane
