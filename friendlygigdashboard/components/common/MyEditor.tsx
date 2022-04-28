import { EditorState } from "draft-js"
import React, { FC, useEffect, useState } from "react"
// import { MegadraftEditor, editorStateFromRaw } from "megadraft"
const megadraft = require("megadraft")

const { MegadraftEditor, editorStateFromRaw } = megadraft

const NoSsr: FC = (props) => {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])
  return <>{mounted ? props.children : null}</>
}

const MyEditor = () => {
  const [editorState, setEditorState] = React.useState(() => EditorState.createEmpty())

  return (
    <NoSsr>
      <MegadraftEditor
        className={`pl-12 h-24 m-11 border-b-[1px] lg:p-5 border-b-gray  focus:border-b-red-500`}
        editorState={editorState}
        onChange={setEditorState}
      />
    </NoSsr>
  )
}
export default MyEditor
