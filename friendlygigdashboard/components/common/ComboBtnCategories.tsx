import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/outline"
import React, { FC, useState } from "react"
import ModalRadioList from "./ModalRadioList"

interface SwitchProps {
  title?: string
  className?: string
  action?: any
  isOpen?: boolean
}

const ComboBtnCategories: FC<SwitchProps> = ({ title, className, action, isOpen }: SwitchProps) => {
  // category modal
  const [displayCategoriesModal, setDisplayCategoriesModal] = useState(false)
  const handleOPenModel = () => {
    setDisplayCategoriesModal(true)
  }
  const handleModalClose = () => {
    setDisplayCategoriesModal(false)
  }
  return (
    <div className={`form-floating my-4 relative ${className}`}>
      <input
        type="button"
        className={`form-control block object-left left-0  w-full px-3 py-1.5  text-gray-700 bg-white 
                  transition ease-in-out focus:text-gray-700 focus:bg-white  outline-white  border-b-[1px] border-b-gray focus:border-b-[3px] focus:border-b-lightgreen placeholder-gray-500  hover:bg-lightgrey border-transparent focus:ring-0`}
        id="title"
        placeholder={"SELECTED ONE"}
        onClick={(e) => handleOPenModel()}
      />
      {displayCategoriesModal ? (
        <ChevronDownIcon className="pointer-events-none w-4 h-6 text-gray absolute top-1/2 transform -translate-y-1/2 right-3" />
      ) : (
        <ChevronUpIcon className="pointer-events-none w-4 h-6 text-gray absolute top-1/2 transform -translate-y-1/2 right-3" />
      )}

      <label htmlFor="title" className={"text-gray-700"}>
        {`${title} *`}
      </label>
      {/* Modal Categories */}
      <ModalRadioList
        isOpen={displayCategoriesModal}
        openModal={() => handleOPenModel}
        closeModal={() => handleModalClose()}
      />
    </div>
  )
}

export default ComboBtnCategories
