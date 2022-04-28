import React, { FC } from "react"

interface SwitchProps {
  title?: string
  className?: string
  action?: any
}

const RadioButton: FC<SwitchProps> = ({ title, className, action }: SwitchProps) => {
  return (
    <div className={`form-check flex  flex-row hover:bg-lightgrey py-3 w-fit pr-2 ${className}`}>
      <input
        className="form-check-input appearance-none rounded-full h-4 w-4 bg-white checked:bg-lightgreen checked:border-lightgreen focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer focus:border-lightgreen border-[2px] border-darkgray "
        type="radio"
        name="flexRadioDefault"
        id="flexRadioDefault1"
        onClick={action}
        checked={true}
      />
      <label className="form-check-label inline-block" htmlFor="flexRadioDefault1">
        {title}{" "}
      </label>
    </div>
  )
}

export default RadioButton
