import { Tab } from "@headlessui/react"
import { useRouter } from "next/router"
import { FC, useState } from "react"
import { ALL_STATUS } from "../../constants/AllStatus"
import Dropdown from "../common/Dropdown"
import InputIcon from "../common/InputIcon"
import ArticlesList from "../common/list/ArticlesList"
import HistoryList from "../common/list/HistoryList"

interface componentProps {
  tabs: string[]
}

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ")
}

const AdvancePartsTabPane: FC<componentProps> = ({ tabs }) => {
  const [selectTab, setSelectTab] = useState(0)
  const router = useRouter()

  return (
    <div className={`w-full flex flex-col bg-white h-full`}>
      <div className="flex flex-col items-start w-full sm:px-0  bg-friendly-background-gray">
        <Tab.Group
          defaultIndex={router?.query?.view === "category" ? 0 : 1}
          onChange={(e: any) => setSelectTab(e)}
        >
          <div className={"w-full grid grid-cols-1 lg:grid-cols-4"}>
            <Tab.List className="flex flex-row  col-span-1 items-end justify-start bg-lightgrey ">
              {tabs.map((tab) => (
                <Tab
                  onClick={(e: any) => console.log("selected tab si", tab)}
                  key={tab}
                  className={({ selected }) =>
                    classNames(
                      "min-w-half py-3 px-2  text-[11px] md:text-sm leading-5 font-medium ",
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
            <div className="w-full col-span-1 my-4 lg:m-0 lg:col-span-3">
              {selectTab === 0 ? (
                <div className={"lg:w-full grid grid-cols-1 lg:grid-cols-3 lg:gap-4"}>
                  <div className={`col-span-1 mb-3 lg:mb-0 lg:col-span-2 px-3`}>
                    <InputIcon cat={"categories"} />
                  </div>
                  <div className={`col-span-1 md:p-3 lg:mr-3`}>
                    <Dropdown title="filter" />
                  </div>
                </div>
              ) : (
                <div className="sm:hidden">
                  {" "}
                  <p className="text-darkgray mx-2  my-4 sm:hidden lg:my-0">
                    {"Comments enabled! How can agent leverage knowledge to help custom."}
                  </p>
                </div>
              )}
            </div>
          </div>
          <Tab.Panels className=" w-full">
            {tabs.map((tab, idx) => (
              <Tab.Panel
                onClick={(e: any) => console.log("selected tab si", tab)}
                key={idx}
                className={classNames(" rounded-xl ")}
              >
                {tab.toLowerCase() === "list" && (
                  <div>
                    <ArticlesList columns={ALL_STATUS} />
                  </div>
                )}
                {tab.toLowerCase() === "history" && (
                  <div>
                    <HistoryList columns={ALL_STATUS} />
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

export default AdvancePartsTabPane
