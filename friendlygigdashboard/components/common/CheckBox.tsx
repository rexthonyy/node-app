import React, { FC } from "react"

interface CheckBoxProps {
  title?: string
  className?: string
  value?: string
}

const CheckBox: FC<CheckBoxProps> = ({ title, value, className }: CheckBoxProps) => {
  return (
    <fieldset className={`space-y-5 ${className} `}>
      <legend className="sr-only">Notifications</legend>
      <div className="relative flex items-start hover:bg-lightgrey py-3 w-fit pr-2">
        <div className="flex items-center">
          <input
            id="comments"
            aria-describedby="comments-description"
            name="comments"
            type="checkbox"
            className="focus:ring-lightgreen h-4.5 w-4.5 bg-white border-gray-300 rounded accent-lightgreen"
          />
        </div>
        <div className="ml-3 text-sm">
          <label htmlFor="comments" className="font-medium text-gray-700">
            {title}
          </label>
        </div>
      </div>
    </fieldset>
  )
}
export default CheckBox
