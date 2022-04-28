import { Dialog, Transition } from "@headlessui/react"
import { XIcon } from "@heroicons/react/outline"
import Link from "next/link"
import { FC, Fragment, useState } from "react"
import * as yup from "yup"

export interface ModalListProps {
  isOpen: boolean
  openModalList: any
  closeModalList: any
}
const options = [
  "Plumber",
  "Electrician",
  "Carpenter",
  "Roofer",
  "Mechanic",
  "Front Page",
  "Plumber",
  "Electrician",
  "Carpenter",
  "Roofer",
  "Mechanic",
  "Front Page",
  "Plumber",
  "Electrician",
  "Carpenter",
  "Roofer",
  "Mechanic",
  "Front Page",
  "Plumber",
  "Electrician",
  "Carpenter",
  "Roofer",
  "Mechanic",
  "Front Page",
  "Plumber",
  "Electrician",
  "Carpenter",
  "Roofer",
  "Mechanic",
  "Front Page",
  "Plumber",
  "Electrician",
  "Carpenter",
  "Roofer",
  "Mechanic",
  "Front Page"
]
const ModalList: FC<ModalListProps> = ({ isOpen, closeModalList }: ModalListProps) => {
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-[1000px] overflow-y-auto p-10"
          onClose={closeModalList}
        >
          <div className="min-h-screen  text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 top-0" />
            </Transition.Child>

            <span className="inline-block h-screen align-middle" aria-hidden="true">
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
              <div className="inline-block w-full h-[300px] max-w-md z-50 overflow-hidden text-left align-middle transition-all transform shadow-xl p-2 bg-white">
                <div className={`w-full flex flex-row justify-between py-3 `}>
                  <h4 className="text-center text-lg font-mono text-gray-900 p-3">{"List"}</h4>
                  <Link href={"#"}>
                    <a
                      className="font-semibold hover:bg-lightgrey p-2 h-9"
                      onClick={(e) => closeModalList()}
                    >
                      <XIcon className="pointer-events-none w-5 h-5 " />
                    </a>
                  </Link>
                </div>
                <div className={`w-full flex flex-row justify-between py-3 border-b-[1px]`}>
                  <div className={"flex flex-row"}>
                    <span className={"mr-7"}>#</span>
                    <span>List</span>
                  </div>
                  <button
                    className={`submitButton w-fit font-thin`}
                    onClick={(e) => console.log("")}
                  >{`Add`}</button>
                </div>
                <div className={"flex flex-row py-3"}>
                  <span className={"text-gray"}>No Record</span>
                </div>
                <div className="bg-white sm:rounded-lg sm:px-10">
                  <div className={`grid grid-cols-1 max-h-[240px] overflow-y-scroll`}></div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default ModalList
