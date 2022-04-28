import React, { FC, useState } from "react";
import Flatpickr from "react-flatpickr";
import ComboBtnCategories from "../common/ComboBtnCategories";
import ComboBtnList from "../common/ComboBtnList";
import Input from "../common/Input";
import ModalList from "../common/ModalList";
import ModalTiming from "../common/ModalTime";
import RadioButton from "../common/RadioButton";
import SwitchComponent from "../common/Switch";
import IconUploader from "../icon-uploader/IconUploader";

interface formProps {
  formData?: any;
}
const CategoryForm: FC<formProps> = ({ formData }) => {
  // List modal
  const [displayListModal, setDisplayListModal] = useState(false);
  const handleListOPenModel = () => {
    setDisplayListModal(true);
  };
  const handleListModalClose = () => {
    setDisplayListModal(false);
  };
  //Timing
  const [isCalendar, setIsCalendar] = useState(true);
  const calendarHandel = () => {
    setIsCalendar(true);
  };
  const calendarHandelNow = () => {
    setIsCalendar(false);
  };
  // Modal Timing
  const [displayTimeModal, setDisplayTimeModal] = useState(false);
  const handleTimeOPenModel = () => {
    setDisplayTimeModal(true);
  };
  const handleTimeModalClose = () => {
    setDisplayTimeModal(false);
  };
  // Date
  const [date, setDate] = useState();

  return (
    <div className={"flex flex-col w-full"}>
      <form className={`w-full flex flex-col`}>
        <div className={"grid grid-cols-1 md:grid-cols-2 gap-4 "}>
          <div>
            <Input title={"Name"} className={"my-4"} />
            <Input title={"`Title Tag"} className={"my-4"} />
          </div>
          <div>
            <ComboBtnCategories
              title={`Parent Category`}
              className="form-floating my-4 "
            />
            <Input title={"`Footer"} className={"my-4"} />
          </div>
        </div>
        <div className={"grid grid-cols-1 md:grid-cols-2 gap-4 "}>
          <Input title={"`Keywords"} className={"my-4"} />
        </div>
        <div>
          <input
            type="button"
            className="bg-lightgreen ease-in-out focus:border-transparent focus:ring-0 font-medium h-[36px] rounded-md text-white transition w-[160px]"
            id="title"
            placeholder="title"
            value={"MANAGE LISTS"}
            onClick={(e) => handleListOPenModel()}
          />
        </div>
        <div>
          <ComboBtnList title={`List`} className={"lg:max-w-[48%]"} />
        </div>

        <div
          className={
            "flex flex-col justify-items-start items-start justify-start"
          }
        >
          <label htmlFor="title" className={"text-gray-700"}>
            {`PERMISSIONS *`}
          </label>
          <div className="flex flex-row form-floating my-4">
            <RadioButton title={"Public"} className={"mr-6"} />
            <RadioButton title={"Internal"} />
          </div>
          <div className={"grid grid-cols-1 md:grid-cols-2 gap-4 "}>
            <div>
              <label htmlFor="title" className={"text-gray-700 text-sm"}>
                {`TIMING *`}
              </label>
              <div className="flex flex-col form-floating my-4">
                <RadioButton
                  title={"Now"}
                  className={"mb-6"}
                  action={calendarHandelNow}
                />
                <RadioButton title={"Schedule For"} action={calendarHandel} />
              </div>
            </div>
            {isCalendar && (
              <div>
                <Flatpickr
                  data-enable-time
                  value={new Date()}
                  className={"text-darkgray"}
                />
              </div>
            )}
          </div>
          <div className="kb-icon-uploader">
            <label className={`text-gray-700`}>{`Knowledge Base File`}</label>
            <div className="my-5">
              <IconUploader />
            </div>
          </div>
          <label htmlFor="title" className={"text-gray-700"}>
            {`Publish *`}
          </label>
          <SwitchComponent />
        </div>
      </form>
      <div
        className={
          "flex flex-row justify-end border-t-[1px] p-5 border-t-gray mt-5"
        }
      >
        <button
          className={`flex items-center justify-center lg:my-0 my-3 px-6 text-white font-bold rounded-md overflow-hidden h-[44px] bg-primarygreen`}
        >{`Save`}</button>
        {formData && (
          <button className={`deleteButton mx-2`}>{`Archive`}</button>
        )}
      </div>

      <ModalList
        isOpen={displayListModal}
        openModalList={() => handleListOPenModel}
        closeModalList={() => handleListModalClose()}
      />
      <ModalTiming
        isOpen={displayTimeModal}
        openModalTime={() => handleTimeOPenModel}
        closeModalTime={() => handleTimeModalClose()}
      />
    </div>
  );
};

export default CategoryForm;
