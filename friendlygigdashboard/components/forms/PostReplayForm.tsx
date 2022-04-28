import React, { FC } from "react"
import MyEditor from "../common/MyEditor"

// const MegadraftEditor = require("megadraft")

interface formProps {
  formData?: any
}
const PostReplayForm: FC<formProps> = ({ formData }) => {
  return (
    <div className={"flex flex-col w-full"}>
      <form className={`w-full flex flex-col`}>
        <span className={`text-base`}>{`Forum Sample`}</span>

        <div
          className={"flex flex-row justify-start px-5 py-3 rounded-sm bg-primarygreen text-white"}
        >
          <h2>Question</h2>
        </div>
        <div className="m-5 w-full flex flex-col justify-start">
          <div className="flex flex-row justify-start items-center mb-5">
            <span className="w-12 h-12 bg-orange-500 text-white flex flex-row justify-center items-center rounded-full">
              G
            </span>
            <span className="px-2">G Wrote...</span>
          </div>
          <div className="flex flex-col  md:ml-12 lg:ml-12">
            <div className="flex flex-row justify-start items-center px-2">
              <span className="flex flex-row justify-center items-center text-sm font-bold text-darkgray ">
                Forums Example
              </span>
              <span className="bg-lightgrey p-1.5 mx-2 rounded-sm text-sm">Upvote | 0 </span>
            </div>
            <p className="text-sm text-darkgray my-1 px-2">This is simple text for example</p>
            <p className="text-lg my-6 px-2 text-md">Replay To This Ticket</p>

            <div className="ml-7">
              <MyEditor />
            </div>
          </div>
        </div>

        <div className={"flex flex-row justify-start p-5 mt-5"}>
          <button
            className={`flex items-center justify-center lg:my-0 my-3 px-6 text-white rounded-md overflow-hidden h-[38px] bg-lightgreen`}
          >{`POST REPLAY`}</button>
          {formData && <button className={`deleteButton mx-2`}>{`Archive`}</button>}
        </div>
      </form>

      <div className="flex flex-row justify-between items-center  lg:m-10 lg:mt-16 border-t-[1px] border-t-gray">
        <div className="flex flex-col my-5 ">
          <div className="flex flex-row justify-start items-center mb-5">
            <span className="w-12 h-12 bg-orange-500 text-white flex flex-row justify-center items-center rounded-full">
              G
            </span>
            <span className="px-2">G Replayed...</span>
          </div>
          <div className="flex flex-row justify-start items-center px-2">
            <span className="flex flex-row justify-center items-center text-sm font-bold text-darkgray ">
              Forums Example
            </span>
            <span className="bg-lightgrey p-1.5 mx-2 rounded-sm text-sm">Upvote | 0 </span>
          </div>
        </div>
        <div className="text-primarygreen text-sm">{`Flag For Review`}</div>
      </div>
    </div>
  )
}

export default PostReplayForm
