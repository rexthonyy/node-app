import { EyeIcon, PencilAltIcon } from "@heroicons/react/outline";
import Image from "next/image";
import Router from "next/router";
import { SortableElement } from "react-sortable-hoc";
import { usePage } from "../../context/PageContext";
import { knowledgeBase } from "../../interfaces/KnowledgeBase";
import Select from "../common/Select";
import DragHandle from "../common/DragHandle";
import Link from "next/link";

const CategoryTableItem: any = SortableElement(({ value }: any) => {
  const { setPageData }: any = usePage();
  const navigateEdit = (data: any, openFor: string) => {
    setPageData({
      link: { title: data.name },
      subLink: { title: "" },
      formData: data,
      openFor,
    });
    // Router.push(`/knowledge-base/kb/${data.id}`);
    Router.push(`/knowledge-base/categories/${data.id}/${data.id}`);
  };

  const navigateCategoryDetail = (data: any, openFor: string) => {
    setPageData({
      link: { title: data.name },
      subLink: { title: data.name },
      formData: data,
      openFor,
    });
    Router.push(`/knowledge-base/categories/detail/${data.id}`);
  };
  const item: knowledgeBase = value;
  return (
    <tr>
      <td className="whitespace-nowrap  font-normal text-gray-900">
        <DragHandle ref={undefined} />
      </td>
      <td className="whitespace-nowrap  font-normal text-gray-900">
        <Select options={[1, 2, 3, 4]} />
      </td>
      <td className="whitespace-nowrap  font-normal text-gray-900">
        <div className="kb-name flex align-center">
          <div className="icon-wrapper mr-2">
            <PencilAltIcon
              className={`w-[40px] text-lightgreen cursor-pointer`}
            />
          </div>
          <div>
            <span
              className={`w-full flex flex-center justify-start hover:underline hover:text-lightgreen hover:cursor-pointer`}
            >
              <Link href="/knowledge-base/categories/detail/12312">
                <a> {item.name}</a>
              </Link>
            </span>
            <div className={`flex flex-row`}>
              <Link href="/knowledge-base/categories/detail/12312">
                <a>
                  <span
                    className={`hover:underline hover:text-lightgreen hover:cursor-pointer text-xs `}
                  >{`${"Categories"}`}</span>
                </a>
              </Link>
              &nbsp;&nbsp;
              <Link href="/knowledge-base/categories/12312/12312">
                <a>
                  <span
                    className={`hover:underline hover:text-lightgreen hover:cursor-pointer text-xs `}
                  >{`15 Categories`}</span>
                </a>
              </Link>
            </div>
          </div>
        </div>
      </td>
      <td className="whitespace-nowrap  font-normal text-gray-500">
        {item.updated_at}
      </td>
      <td className={`whitespace-nowrap`}>
        <div className="icon-center">
          <span
            className={`h-[16px] w-[16px] bg-blue-600 border-black border-1 rounded-full cursor-pointer `}
          ></span>
        </div>
      </td>
      <td>
        <div className="icon-center">
          <PencilAltIcon
            className={`h-5 w-5 text-gray-500 cursor-pointer`}
            onClick={() => navigateEdit(value, "edit")}
          />
        </div>
      </td>
    </tr>
  );
});

export default CategoryTableItem;
