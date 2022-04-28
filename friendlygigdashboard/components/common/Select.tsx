import React, { FC } from "react";

interface selectProps {
  options: any[];
  onChange?: any;
}
const Select: FC<selectProps> = ({ options, onChange }) => {
  return (
    <select
      onChange={onChange}
      defaultValue={options[0]}
      className={`form-select appearance-none block w-full px-3 py-1.5 bg-white bg-clip-padding bg-no-repeat thinBorder rounded h-full transition ease-in-out m-0 focus:outline-none`}
    >
      {options.map((item: any, index: number) => (
        <option key={index} className={`h-[44px] `}>
          {item}
        </option>
      ))}
    </select>
  );
};
export default Select;
