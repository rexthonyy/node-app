import { Dialog, Transition } from "@headlessui/react"
import Link from "next/link"
import { FC, Fragment } from "react"
import RadioButton from "./RadioButton"

export interface ModalTimingProps {
  isOpen: boolean
  openModalTime: any
  closeModalTime: any
}
const options = ["Now", "Schedule For"]
const ModalTiming: FC<ModalTimingProps> = ({ isOpen, closeModalTime }: ModalTimingProps) => {
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={closeModalTime}>
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
                  <div className={`w-full flex flex-row justify-between py-3 `}>
                    <h4 className="text-center text-lg font-mono text-gray-900">
                      {"Archive Category"}
                    </h4>
                    <span>X</span>
                  </div>
                  <div className={`grid grid-cols-1 max-h-[240px] overflow-y-auto`}>
                    <label htmlFor="title" className={"text-gray-200 text-gray text-sm my-2"}>
                      {`TIMING *`}
                    </label>
                    <ul className={"w-full flex flex-col justify-center my-2"}>
                      {options.map((item, i) => (
                        <li className={"py-2"} key={i}>
                          <RadioButton title={item} />
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div
                    className={`w-full flex flex-row justify-end py-3 border-t-[1px] border-t-gray`}
                  >
                    <input
                      type="button"
                      className="form-control object-left  px-3 py-1.5  text-gray-700  
                  transition ease-in-out rounded-md p-5 text-white bg-red-500 m-1 font-thin w-fit"
                      id="title"
                      placeholder="title"
                      value={"Archive"}
                      // onClick={(e) => handleListOPenModel()}
                    />
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

export default ModalTiming
