import { FC } from "react";
import Input from "../common/Input";
import RadioButton from "../common/RadioButton";

interface formProps {
  formData?: any;
}

const UserForm: FC<formProps> = ({ formData }) => {
  return (
    <>
      <form>
        <div>
          <label
            htmlFor="title"
            className={"text-gray-700 text-sm font-medium"}
          >
            {`PERMISSIONS *`}
          </label>
          <div className="flex flex-row form-floating my-4">
            <RadioButton title={"Admin"} className={"mr-5"} />
            <RadioButton title={"Manager"} className={"mr-5"} />
            <RadioButton title={"Agent"} className={"mr-5"} />
          </div>
        </div>
        <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
          <div>
            <Input title={"First Name"} className={"my-4"} />
          </div>
          <div>
            <Input title={"`Last name"} className={"my-4"} />
          </div>
        </div>
        <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
          <div>
            <Input title={"Email"} className={"my-4"} />
          </div>
        </div>
        <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
          <div>
            <Input title={"Password"} className={"my-4"} />
          </div>
        </div>
        <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
          <div>
            <Input title={"Profession"} className={"my-4"} />
          </div>
          <div>
            <Input title={"Fax"} className={"my-4"} />
          </div>
        </div>
        <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
          <div>
            <Input title={"Phone"} className={"my-4"} />
          </div>
          <div>
            <Input title={"Web"} className={"my-4"} />
          </div>
        </div>
        <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
          <div>
            <Input title={"Web"} className={"my-4"} />
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

export default UserForm;
