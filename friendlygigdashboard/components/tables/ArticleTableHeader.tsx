import React, { FC } from "react"

interface TableHeaderProps {
  columns: any[]
}
const ArticleTableHeader: FC<TableHeaderProps> = ({ columns }) => (
  <thead className="bg-gray-50 thinBorderBottom ">
    <tr>
      <th scope="col" className="text-center font-medium text-gray-500 w-[40px]"></th>
      <th scope="col" className="w-[80px] text-center font-medium text-gray-500  ">
        #
      </th>
      <th scope="col" className="text-left font-medium text-gray-500  ">
        {`Article`}
      </th>
      <th scope="col" className="text-left font-medium text-gray-500  ">
        {`Date`}
      </th>
      <th scope="col" className="w-[100px] text-center font-medium text-gray-500  ">
        Status
      </th>
      <th scope="col" className="w-[100px] text-center font-medium text-gray-500  ">
        Edit
      </th>
    </tr>
  </thead>
)
export default ArticleTableHeader
