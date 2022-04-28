import { Dialog, Tab, Transition } from "@headlessui/react";
import { PencilAltIcon, SearchIcon } from "@heroicons/react/outline";
import Link from "next/link";
import React, { FC, Fragment, useState } from "react";

interface WebHooksTableProps {}
function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

const WebHooksTable: FC<WebHooksTableProps> = () => {
  let [isOpenDescription, setIsOpenDescription] = useState(true);

  function closeDescriptionModal() {
    setIsOpenDescription(false);
  }

  function openDescriptionModal() {
    setIsOpenDescription(true);
  }

  return (
    <>
      <div
        className={`border-b-[1px] items-center justify-between lg:flex lg:flex-row mb-4`}
      >
        <div className={`grid md:grid-cols-3 lg:basis-1/2 basis-full gap-5 `}>
          <div className="md:col-span-2 flex flex-row rounded-md overflow-hidden shadow-sm thinBorder ">
            <button className="flex items-center justify-center px-1 border-r  border-none h-[44px]">
              <SearchIcon
                className={`h-5 w-5 text-gray-500 mx-2 cursor-pointer`}
              />
            </button>
            <input
              type="text"
              className="py-2  outline-none  w-full  h-[44px] rounded-br-md rounded-tr-md "
              placeholder={"Search for Web Hooks"}
            />
          </div>
        </div>
        <div
          className={`flex flex-row lg:basis-1/2 basis-full justify-end pb-4`}
        >
          <button
            onClick={openDescriptionModal}
            className="flex items-center justify-center lg:my-0 my-3 px-6 text-white font-bold rounded-md overflow-hidden h-[44px] bg-stone-400 mr-3"
          >
            <span>{`Description`}</span>
          </button>
          <button className="flex items-center justify-center lg:my-0 my-3 px-6 text-white font-bold rounded-md overflow-hidden h-[44px] bg-primarygreen mr-3">
            <span>{`Example Payload`}</span>
          </button>
          <Link href={"/web-hooks/add"}>
            <a>
              <button className="flex items-center justify-center lg:my-0 my-3 px-6 text-white font-bold rounded-md overflow-hidden h-[44px] bg-primarygreen">
                <span>{`ADD`}</span>
              </button>
            </a>
          </Link>
        </div>
      </div>
      <div className="flex flex-col mt-8">
        <div className="overflow-x-auto rounded-lg">
          <div className="align-middle inline-block min-w-full">
            <div className="shadow overflow-hidden sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-200 border-b-[1px]">
                  <tr>
                    <th
                      scope="col"
                      className="text-left font-medium text-gray-500  min-w-[150px]"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="text-left font-medium text-gray-500  min-w-[150px]"
                    >
                      End Point
                    </th>
                    <th
                      scope="col"
                      className="text-right font-medium text-gray-500  "
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b-[1px]">
                    <td>Web Hook 01</td>
                    <td>https://test.com</td>
                    <td className="text-right">
                      <span className={`icon-right`}>
                        <PencilAltIcon
                          className={`h-5 w-5 text-gray-500 cursor-pointer`}
                        />
                      </span>
                    </td>
                  </tr>
                  <tr className="border-b-[1px]">
                    <td>Web Hook 02</td>
                    <td>https://test.com</td>
                    <td className="text-right">
                      <span className={`icon-right`}>
                        <PencilAltIcon
                          className={`h-5 w-5 text-gray-500 cursor-pointer`}
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

      <Transition appear show={isOpenDescription} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={closeDescriptionModal}
        >
           <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Description
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Webhooks make it easy to send information about events
                    within Zammad to third-party systems via HTTP(S).
                  </p>
                  <p className="text-sm text-gray-500">
                    You can use webhooks in Zammad to send ticket, article, and
                    attachment data whenever a trigger is performed. Just create
                    and configure your webhook with an HTTP(S) endpoint and
                    relevant security settings, then configure a trigger to
                    perform it.
                  </p>
                </div>

                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                    onClick={closeDescriptionModal}
                  >
                    Close
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default WebHooksTable;
