import { SearchIcon } from "@heroicons/react/outline"
import { FC } from "react"

interface inputIconProps {
  title?: string
  icon?: string
  cat?: string
}
const InputIcon: FC<inputIconProps> = ({ title, cat }: inputIconProps) => {
  return (
    <div className={"w-full"}>
      {title && (
        <label htmlFor="search" className="block text-sm font-medium text-darkgray p-2 mt-5">
          {title}
        </label>
      )}

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon className="h-5 w-5 text-gray-400 text-darkgray" aria-hidden="true" />
        </div>
        <input
          type="text"
          name="search"
          id="search"
          className={`form-control block w-full p-2.5  text-gray-700 bg-white 
          transition ease-in-out focus:text-gray-700 focus:bg-white  outline-white shadow-shadowInput focus:shadow-shadowInput pl-10`}
          placeholder={`Search for ${cat}`}
        />
      </div>
    </div>
  )
}
export default InputIcon
