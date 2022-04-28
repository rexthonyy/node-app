import React, { FC } from "react"

const Loading: any = () => {
  return (
    <div className="p-4 max-w-full w-full mx-auto">
      <div className="animate-pulse flex space-x-4">
        <div className="rounded-sm bg-slate-200 h-14 w-[370px]"></div>
      </div>
    </div>
  )
}

export default Loading
