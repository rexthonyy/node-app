import { Dialog, Transition } from "@headlessui/react"
import Link from "next/link"
import { FC, Fragment } from "react"
import RadioButton from "./RadioButton"

export interface ModalRadioListProps {
  isOpen: boolean
  openModal: any
  closeModal: any
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
const ModalRadioList: FC<ModalRadioListProps> = ({ isOpen, closeModal }: ModalRadioListProps) => {
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={closeModal}>
          <div className="min-h-screen text-center">
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
              <div className="inline-block w-full max-w-md  overflow-hidden text-left align-middle transition-all transform shadow-xl ">
                <div className="bg-white shadow sm:rounded-lg sm:px-10">
                  <h2 className=" text-center text-2xl font-bold font-mono border-b-[1px] py-3 border-b-gray text-gray-900">
                    {"Parent Category"}
                  </h2>
                  <div className={`grid grid-cols-1 max-h-[240px] overflow-y-auto`}>
                    <ul className={"w-full flex flex-col justify-center"}>
                      {options.map((item, i) => (
                        <li className={""} key={i}>
                          <RadioButton title={item} />
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div
                    className={`w-full flex flex-row justify-end py-3 border-t-[1px] border-t-gray`}
                  >
                    <Link href={"#"}>
                      <a
                        className="text-friendly-blue font-semibold text-lightgreen px-2"
                        onClick={(e) => closeModal()}
                      >
                        <span>{`CANCEL`}</span>
                      </a>
                    </Link>

                    <Link href={"#"}>
                      <a className="text-friendly-blue font-semibold text-lightgreen px-2">
                        <span>{`OK`}</span>
                      </a>
                    </Link>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default ModalRadioList
