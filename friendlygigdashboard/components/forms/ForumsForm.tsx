import React, { FC, useState } from "react"
import Flatpickr from "react-flatpickr"
import CheckBox from "../common/CheckBox"
import ComboBtnCategories from "../common/ComboBtnCategories"
import ComboBtnList from "../common/ComboBtnList"
import Input from "../common/Input"
import ModalList from "../common/ModalList"
import ModalTiming from "../common/ModalTime"
import RadioButton from "../common/RadioButton"
import SwitchComponent from "../common/Switch"
import TextArea from "../common/TextArea"
import IconUploader from "../icon-uploader/IconUploader"

interface formProps {
  formData?: any
  isEdit?: boolean
}
const ForumsForm: FC<formProps> = ({ formData, isEdit }) => {
  // List modal
  const [displayAlertModal, setDisplayAlertModal] = useState(false)
  const handleListOPenModel = () => {
    setDisplayAlertModal(true)
  }
  const handleListModalClose = () => {
    setDisplayAlertModal(false)
  }
  //Timing
  const [isCalendar, setIsCalendar] = useState(true)
  const calendarHandel = () => {
    setIsCalendar(true)
  }
  const calendarHandelNow = () => {
    setIsCalendar(false)
  }
  // Modal Timing
  const [displayTimeModal, setDisplayTimeModal] = useState(false)
  const handleTimeOPenModel = () => {
    setDisplayTimeModal(true)
  }
  const handleTimeModalClose = () => {
    setDisplayTimeModal(false)
  }
  // Date
  const [date, setDate] = useState()

  return (
    <div className={"flex flex-col w-full"}>
      <form className={`w-full flex flex-col `}>
        <Input title={"Name"} className={"my-8 lg:w-[49%]"} />
        <TextArea title={"Description"} className={"my-8 lg:w-[70%]"} />

        <CheckBox title={"Allow topic voting?"} className={""} />
        <CheckBox title={"Allow post voting?"} className={""} />
        <div className={"flex flex-col justify-items-start items-start justify-start"}>
          <div className={"grid grid-cols-1 md:grid-cols-2 gap-4 my-3 lg:my-8"}>
            <div>
              <label htmlFor="title" className={"text-gray-700 text-sm"}>
                {`TIMING *`}
              </label>
              <div className="flex flex-col form-floating my-4">
                <RadioButton title={"Now"} className={""} action={calendarHandelNow} />
                <RadioButton title={"Schedule For"} action={calendarHandel} />
              </div>
            </div>
            {isCalendar && (
              <div>
                <Flatpickr data-enable-time value={new Date()} className={"text-darkgray"} />
              </div>
            )}
          </div>
          <div className="kb-icon-uploader">
            <label className={`text-gray-700`}>{`Knowledge Base File`}</label>
            <div className="my-5">
              <IconUploader />
            </div>
          </div>
          <label htmlFor="title" className={"text-gray-700"}>
            {`Publish *`}
          </label>
          <SwitchComponent />
        </div>
      </form>
      <div className={"flex flex-row justify-end border-t-[1px] lg:p-5 border-t-gray lg:mt-5"}>
        <button
          className={`flex items-center justify-center lg:my-0 my-3 px-6 text-white font-bold rounded-md overflow-hidden h-[44px] bg-primarygreen`}
        >{`Save`}</button>
        {isEdit && <button className={`deleteButton mx-2`}>{`Archive`}</button>}
      </div>
    </div>
  )
}

export default ForumsForm
