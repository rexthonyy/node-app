import React, { FC } from "react"
import Dropdown from "../Dropdown"
import InputIcon from "../InputIcon"
import { Status } from "../Modal/Status"

interface ArticlesListProps {
  columns?: any[]
}
const list = [
  new Status("bg-slate-400", "Pending Action", 2),
  new Status("bg-red-400", "Drafts", 0),
  new Status("bg-slate-400", "Publish Scheduled", 4),
  new Status("bg-zinc-400", "Published", 2),
  new Status("bg-stone-400", " Update Scheduled", 3),
  new Status("bg-orange-400", " Archive Scheduled", 0),
  new Status("bg-blue-400", " Archived", 1)
]
const ArticlesList: FC<ArticlesListProps> = ({ columns }: ArticlesListProps) => (
  <div className={"w-full grid grid-cols-1 lg:grid-cols-4 bg-white"}>
    <div className={`w-full flex flex-col col-span-1  justify-start`}>
      <ul className={`cursor-grab flex flex-col items-center justify-start m-4`}>
        <li className={`w-full text-darkgray mb-2 `}>{"All Categories"}</li>
        {list.map((item, i) => (
          <li key={i} className={`w-full flex flex-row  text-darkgray justify-between m-1.5 `}>
            <div className={"flex flex-row justify-center items-center"}>
              <span className={`w-2 h-2 ${item.color} rounded-ful rounded-3xl p-1.5`}></span>
              <p className={"p-2 text-sm"}>{item.title}</p>
            </div>
            <span className={"p-2"}>{item.level}</span>
          </li>
        ))}
      </ul>
    </div>
    <div className="w-full flex flex-row md:col-span-2 lg:col-span-3 bg-white"></div>
  </div>
)
export default ArticlesList
