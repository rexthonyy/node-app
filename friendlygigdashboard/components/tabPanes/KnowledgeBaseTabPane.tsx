import { Tab } from "@headlessui/react"
import { useRouter } from "next/router"
import { FC, useEffect, useState } from "react"
import KnowledgeBaseDetailsTabPane from "./KnowledgeBaseDetailsTabPane"

interface ManagedOrdersTabPaneProps {
  tabs: string[]
}

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ")
}

const KnowledgeBaseTabPane: FC<ManagedOrdersTabPaneProps> = ({ tabs }) => {
  return (
    <div className="flex flex-col items-start w-full  ">
      <Tab.Group>
        <Tab.List
          className="flex flex-row px-1 items-start justify-start w-full border-b-[1px]"
          onSelect={() => console.log("hey i am here")}
        >
          {tabs.map((tab) => (
            <Tab
              key={tab}
              className={({ selected }) =>
                classNames(
                  "mr-2 w-fit-content min-w-[150px] max-w-fit py-2.5 text-[11px] md:text-sm leading-5 font-medium hover:bg-friendly-gray  ",
                  selected
                    ? " text-lightgreen border-b-lightgreen border-b-[2px] border-solid"
                    : "  "
                )
              }
            >
              <span className={`w-full text-center align-center`}>{tab}</span>
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className=" w-full border-t-friendly-gray ">
          {tabs.map((tab, idx) => (
            <Tab.Panel key={idx} className={classNames(" rounded-xl ")}>
              <div className={`w-full pt-6 lg:px-5`}>
                <KnowledgeBaseDetailsTabPane tabs={[`Categories`, "Articles"]} />
              </div>
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  )
}

export default KnowledgeBaseTabPane
