import Router from "next/router";
import React, { FC, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { LANGUAGES } from "../../constants/languages";
import { usePage } from "../../context/PageContext";
import Select from "../common/Select";
import IconUploader from "../icon-uploader/IconUploader";

interface formProps {
  formData?: any;
}

const KnowledgeBaseForm: FC<formProps> = ({ formData }) => {
  const { setPageData } = usePage();
  const [data, setData] = useState();
  const [languages, setLanguages] = useState([LANGUAGES[0]]);
  const handleLanguage = (e: any) => {
    setLanguages((prev) => [...prev, e.target.value]);
  };

  const handleSave = async () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Your work has been saved",
      showConfirmButton: false,
      timer: 1500,
    }).then(() => {
      setPageData({
        link: { title: null },
        subLink: { title: "" },
        formData: null,
        openFor: "",
      });
      Router.push(`/knowledge-base/kb`);
    });
  };

  useEffect(() => {
    if (!formData) {
      return;
    }
    setData(formData);
  }, [formData]);
  return (
    <form className={`flex flex-col w-full pt-5`}>
      <div className="lg:max-w-4xl xl:max-w-5xl">
        <div className={`w-full flex flex-col`}>
          <div
            className={`thinBorderBottom p-4 flex flex-row justify-between bg-tint text-lightgreen`}
          >
            <div className={`flex-grow w-full`}>
              <span>{`Language`}</span>
            </div>
            <div
              className={`flex-grow-0 w-52 flex flex-row justify-between ml-16`}
            >
              <div className="w-1/2 flex flex-col items-center">
                <span>{`Default`}</span>
              </div>
              <div className="w-1/2 flex flex-col items-center">
                <span>{`Delete`}</span>
              </div>
            </div>
          </div>
          {languages.map((item: any, index: any) => (
            <div
              key={index}
              className={`thinBorderBottom p-4 flex flex-row justify-between items-center`}
            >
              <div className={`flex-grow w-full`}>
                <Select options={["English"]} />
              </div>
              <div
                className={`flex-grow-0 w-52 flex flex-row justify-between md:ml-16`}
              >
                <div className="w-1/2 flex flex-col items-center">
                  <input
                    className="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-lightgreen checked:border-lightgreen focus:outline-none transition duration-200 my-1 align-top bg-no-repeat bg-center bg-contain float-left cursor-pointer"
                    type="checkbox"
                    id="flexCheckDefault3"
                  />
                </div>
                <div className="form-check w-1/2 flex flex-col items-center ">
                  <input
                    className="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-lightgreen checked:border-lightgreen focus:outline-none transition duration-200 my-1 align-top bg-no-repeat bg-center bg-contain float-left cursor-pointer"
                    type="checkbox"
                    id="flexCheckChecked3"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={`lg:max-w-4xl xl:max-w-3xl`}>
        <div className="flex justify-center">
          <div className={`flex flex-col w-full py-6`}>
            <div className="form-floating my-4 ">
              <input
                type="text"
                className="form-control block  w-full px-3 py-1.5  text-gray-700 bg-white 
                  transition ease-in-out  focus:text-gray-700 focus:bg-white  outline-white  border-b-[1px] border-b-red-gray-100 focus:border-b-[3px] focus:border-b-red-500"
                id="title"
                placeholder="title"
                onChange={(e) =>
                  setData({ ...(data as any), name: e.target.value })
                }
                value={formData?.name || ""}
              />
              <label htmlFor="title" className="text-gray-700">
                {`Title *`}
              </label>
            </div>
            <div className="form-floating my-4 ">
              <textarea
                className="form-control block  w-full px-3 py-1.5  text-gray-700 bg-white 
                     transition ease-in-out h-10  focus:text-gray-700 focus:bg-white  outline-white  border-b-[1px] border-b-red-gray-100 focus:border-b-[3px] focus:border-b-lightgreen"
                id="footer"
                placeholder="Footer"
                onChange={(e) =>
                  setData({ ...(data as any), footer: e.target.value })
                }
                value={formData?.footer || ""}
              ></textarea>
              <label htmlFor="footer" className="text-gray-700">
                {`Footer `}
              </label>
            </div>
            <div className="kb-icon-uploader">
              <label className={`text-gray-700`}>{`Knowledge Base File`}</label>
              <div className="mt-2">
                <IconUploader  />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={`p-4 h-[80px] flex flex-row-reverse`}>
        <button
          className={`flex items-center justify-center lg:my-0 my-3 px-6 text-white font-bold rounded-md overflow-hidden h-[44px] bg-primarygreen`}
          onClick={handleSave}
        >{`Save`}</button>
        {formData && (
          <button className={`deleteButton mx-2`}>{`Archive`}</button>
        )}
      </div>
    </form>
  );
};

export default KnowledgeBaseForm;
