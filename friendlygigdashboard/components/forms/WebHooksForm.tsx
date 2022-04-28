import { FC } from "react";
import Input from "../common/Input";
import SwitchComponent from "../common/Switch";
interface formProps {
  formData?: any;
}

const WebHooksForm: FC<formProps> = ({ formData }) => {
  return (
    <>
      <div className="font-semibold text-2xl mb-4">Create webhook</div>
      <div className="font-medium text-sm">
        Slect your connection method and details to create your workbook.
      </div>
      <form className="mt-5">
        <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
          <div>
            <Input title={"Name"} className={"my-4"} />
          </div>
          <div>
            <Input title={"`EndPoint"} className={"my-4"} />
          </div>
        </div>
        <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
          <div>
            <Input title={"HMAC SHA1 SIGNATURE TOKEN"} className={"my-4"} />
          </div>
          <div className={`form-floating my-4`}>
            <select
              className="form-control block  w-full px-3 py-1.5  text-gray-700 bg-white 
                  transition ease-in-out  focus:text-gray-700 focus:bg-white  outline-white  border-b-[1px] border-b-red-gray-100 focus:border-b-[3px] focus:border-b-red-500"
            >
              <option></option>
            </select>
            <label htmlFor="title" className={"text-gray-700 font-medium"}>
              {`SSL VERIFY`}
            </label>
          </div>
        </div>
        <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
          <div>
            <Input title={"Note"} className={"my-4"} />
          </div>
          <div className={`form-floating my-4`}>
            <select
              className="form-control block  w-full px-3 py-1.5  text-gray-700 bg-white 
                  transition ease-in-out  focus:text-gray-700 focus:bg-white  outline-white  border-b-[1px] border-b-red-gray-100 focus:border-b-[3px] focus:border-b-red-500"
            >
              <option></option>
            </select>
            <label htmlFor="title" className={"text-gray-700 font-medium"}>
              {`Active*`}
            </label>
          </div>
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

export default WebHooksForm;
