import React, { FC } from "react"

interface SwitchProps {
  title?: string
  className?: string
  value?: string
  borderStyle?: string
}

const TextArea: FC<SwitchProps> = ({ title, value, className, borderStyle }: SwitchProps) => {
  return (
    <div className={`${className}`}>
      <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
        {`${title} *`}
      </label>
      <div className="mt-1">
        <textarea
          rows={10}
          name="comment"
          id="comment"
          className="border shadow-sm block w-full sm:text-sm border-gray-300 focus:border-gray-300 rounded-md focus:text-gray-700 focus:bg-white  outline-white  focus:border-[3px]"
          defaultValue={value}
        />
      </div>
    </div>
  )
}
export default TextArea
