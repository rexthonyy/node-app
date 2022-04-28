import React, { FC } from "react"
import Input from "../common/Input"
import MyEditor from "../common/MyEditor"

// const MegadraftEditor = require("megadraft")

interface formProps {
  formData?: any
}
const DiscussionForm: FC<formProps> = ({ formData }) => {
  return (
    <div className={"flex flex-col w-full"}>
      <form className={`w-full flex flex-col `}>
        <div className={"fle flex-col mb-6"}>{"Topic (Sample Forum)"}</div>
        <Input title={"Subject"} className={"my-8 lg:w-[60%]"} />
        <div
          className={
            "my-o lg:w-[60%]  border-b-[1px] border-gray-100 focus:border-b-[3px] focus:border-b-red-500"
          }
        >
          <label htmlFor="title" className={"text-gray-200 text-gray text-sm "}>
            {`Message *`}
          </label>
          <MyEditor />
        </div>
      </form>
      <div className={"flex flex-row justify-end lg:mt-5"}>
        <button
          className={`flex items-center justify-center lg:my-0 my-3 px-6 text-white font-bold rounded-md overflow-hidden h-[44px] bg-primarygreen`}
        >{`Save`}</button>
      </div>
    </div>
  )
}

export default DiscussionForm
