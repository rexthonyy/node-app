import React, { FC } from "react"
import InputIcon from "../InputIcon"

const list = [
  "Articles Archived",
  "Articles Created",
  "Articles Restored",
  "Title Changed",
  "Body Changed",
  "Published",
  "UnPublished",
  "Section Changed"
]
interface TableHeaderProps {
  columns?: any[]
}
const HistoryList: FC<TableHeaderProps> = ({ columns }) => (
  <div className={"w-full grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 bg-lightgrey"}>
    <div className={`w-full flex flex-col col-span-1 items-center justify-start thinBorderBottom`}>
      <div className={"mb-4 w-[90%] max-w-[90%]"}>
        {" "}
        <InputIcon cat={"categories"} title={"Filter by User"} />
      </div>
      <ul className={`cursor-grab flex flex-col items-start w-[90%] w-full`}>
        <li className="my-1  w-full text-left text-darkgray">{`Filter by event type`}</li>
        {list.map((item, i) => (
          <li key={i} className={`w-full bg-white mb-1 p-3`}>
            <span className={"p-2 text-darkgray"}>{item}</span>
          </li>
        ))}
      </ul>
    </div>
    <div className="w-full flex flex-row md:col-span-2 lg:col-span-3 bg-white"></div>
  </div>
)
export default HistoryList
