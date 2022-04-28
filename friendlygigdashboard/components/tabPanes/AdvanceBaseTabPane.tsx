import { Tab } from "@headlessui/react";
import { useRouter } from "next/router";
import { FC, useState } from "react";
import ModalList from "../common/ModalList";
import AdvancePartsTabPane from "./AdvancePartsTabPane";

interface componentProps {
  tabs: string[];
  categoriesLevel: string[];
}

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

const AdvanceBaseTabPane: FC<componentProps> = ({ categoriesLevel, tabs }) => {
  const router = useRouter();
  // List modal
  const [displayListModal, setDisplayListModal] = useState(false);
  const handleListOPenModel = () => {
    setDisplayListModal(true);
  };
  const handleListModalClose = () => {
    setDisplayListModal(false);
  };
  return (
    <>
      <Tab.Group defaultIndex={router?.query?.view === "category" ? 0 : 1}>
        <Tab.List className="flex flex-row border-b-[1px] items-start justify-start  w-full  ">
          {categoriesLevel.map((tab) => (
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
              {categoriesLevel}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className=" w-full mt-5">
          <div className={`w-full flex flex-col h-full`}>
            <div className="flex flex-col items-start w-full">
              <Tab.Group
                defaultIndex={router?.query?.view === "category" ? 0 : 1}
              >
                <div className="md:flex flex-row w-full mb-4">
                  <Tab.List className="flex  w-full  ">
                    {tabs.map((tab) => (
                      <Tab
                        key={tab}
                        className={({ selected }) =>
                          classNames(
                            " w-fit-content md:min-w-[120px] py-2.5 md:px-2  px-5 text-[11px] md:text-sm leading-5 font-medium ",
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
                  <div className="w-full flex flex-row justify-end col-span-1 m-0 lg:m-1 lg:col-span-3">
                    <input
                      type="button"
                      className="flex items-center justify-center lg:my-0 my-3 px-6 mr-2 text-white font-bold rounded-md overflow-hidden h-[44px] bg-primarygreen"
                      id="title"
                      placeholder="title"
                      value={"MANAGE LISTS"}
                      onClick={(e) => handleListOPenModel()}
                    />
                    <input
                      type="button"
                      className="flex items-center justify-center lg:my-0 my-3 px-6 text-white font-bold rounded-md overflow-hidden h-[44px] bg-primarygreen"
                      id="title"
                      placeholder="title"
                      value={"SAVE SEARCH AS LIST"}
                      // onClick={(e) => handleListOPenModel()}
                    />
                  </div>
                </div>
                <Tab.Panels className=" w-full">
                  {tabs.map((tab, idx) => (
                    <Tab.Panel key={idx} className={classNames(" rounded-xl ")}>
                      {tab.toLowerCase() === "categories" && (
                        <div>
                          <AdvancePartsTabPane tabs={[`List`, "History"]} />
                        </div>
                      )}
                      {tab.toLowerCase() === "articles" && (
                        <div>
                          <AdvancePartsTabPane tabs={[`List`, "History"]} />
                        </div>
                      )}
                    </Tab.Panel>
                  ))}
                </Tab.Panels>
              </Tab.Group>
            </div>
            <ModalList
              isOpen={displayListModal}
              openModalList={() => handleListOPenModel}
              closeModalList={() => handleListModalClose()}
            />
          </div>
        </Tab.Panels>
      </Tab.Group>
    </>
  );
};

export default AdvanceBaseTabPane;
