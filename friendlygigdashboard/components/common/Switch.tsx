import React, { FC } from "react"

interface SwitchProps {
  title?: string
}

const SwitchComponent: FC<SwitchProps> = ({ title }: SwitchProps) => {
  return (
    <div className="flex justify-center my-4">
      <div className="form-check form-switch">
        <input
          className="form-check-input appearance-none w-9 -ml-10 rounded-full float-left h-5 align-top  bg-no-repeat bg-contain bg-lightgreen text-lightgreen focus:outline-none cursor-pointer shadow-sm"
          type="checkbox"
          role="switch"
          id="flexSwitchCheckDefault"
        />
        {title && (
          <label
            className="form-check-label inline-block text-gray-800"
            htmlFor="flexSwitchCheckDefault"
          >
            {title}
          </label>
        )}
      </div>
    </div>
  )
}

export default SwitchComponent
