import { FC } from "react";
import Input from "../common/Input";
import SwitchComponent from "../common/Switch";
interface formProps {
  formData?: any;
}

const OrganizationForm: FC<formProps> = ({ formData }) => {
  return (
    <>
      <form>
        <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
          <div>
            <Input title={"Name"} className={"my-4"} />
          </div>
          <div className={`form-floating my-4`}>
            <select
              className="form-control block  w-full px-3 py-1.5  text-gray-700 bg-white 
                  transition ease-in-out  focus:text-gray-700 focus:bg-white  outline-white  border-b-[1px] border-b-red-gray-100 focus:border-b-[3px] focus:border-b-red-500"
            >
              <option></option>
            </select>
            <label htmlFor="title" className={"text-gray-700 font-medium"}>
              {`SHARED ORGANIZATION *`}
            </label>
          </div>
        </div>
        <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
          <div className={`form-floating my-4`}>
            <select
              className="form-control block  w-full px-3 py-1.5  text-gray-700 bg-white 
                  transition ease-in-out  focus:text-gray-700 focus:bg-white  outline-white  border-b-[1px] border-b-red-gray-100 focus:border-b-[3px] focus:border-b-red-500"
            >
              <option></option>
            </select>
            <label htmlFor="title" className={"text-gray-700 font-medium"}>
              {`DOMAIN BASED ASSIGNMENT *`}
            </label>
          </div>
          <div>
            <Input title={"DOMAIN"} className={"my-4"} />
          </div>
        </div>
        <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
          <div>
            <div className={`form-floating my-4`}>
              <textarea
                className="form-control block  w-full px-3 py-1.5  text-gray-700 bg-white 
                  transition ease-in-out  focus:text-gray-700 focus:bg-white  outline-white  border-b-[1px] border-b-red-gray-100 focus:border-b-[3px] focus:border-b-red-500"
              ></textarea>
              <label className={"text-gray-700 font-medium"}>{`Note`}</label>
            </div>
          </div>
        </div>
        <div
          className={
            "flex flex-col justify-items-start items-start justify-start"
          }
        >
          <label htmlFor="title" className={"text-gray-700"}>
            {`Active *`}
          </label>
          <SwitchComponent />
        </div>
      </form>
      <div className={`p-4 pb-0 flex flex-row-reverse mt-5`}>
        <button
          className={`flex items-center justify-center lg:my-0 my-3 px-6 text-white font-bold rounded-md overflow-hidden h-[44px] bg-primarygreen`}
        >{`Save`}</button>
        {formData && (
          <button className={`deleteButton mx-2`}>{`Archive`}</button>
        )}
      </div>
    </>
  );
};

export default OrganizationForm;
