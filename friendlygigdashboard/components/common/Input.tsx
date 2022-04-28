import React, { FC } from "react";

interface SwitchProps {
  title?: string;
  className?: string;
  value?: string;
  borderStyle?: string;
}

const Input: FC<SwitchProps> = ({
  title,
  value,
  className,
  borderStyle,
}: SwitchProps) => {
  return (
    <div className={`form-floating ${className}`}>
      <input
        type="text"
        className="form-control block  w-full px-3 py-1.5  text-gray-700 bg-white 
        transition ease-in-out  focus:text-gray-700 focus:bg-white  outline-white  border-b-[1px] border-b-red-gray-100 focus:border-b-[3px] focus:border-b-red-500"
        id="title"
        placeholder="title"
        value={value || ""}
      />
      <label htmlFor="title" className={"text-gray-700 font-medium"}>
        {`${title} *`}
      </label>
    </div>
  );
};

export default Input;
