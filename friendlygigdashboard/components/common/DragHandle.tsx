import Image from "next/image";
import React from "react";
import { SortableHandle } from "react-sortable-hoc";

const DragHandle: any = SortableHandle(() => {
  const nodeRef = React.useRef(null)
  return (
    <>
      <span ref={nodeRef}>
        <Image
          width={"25px"}
          height={"25px"}
          src="/svg/tableHandler.svg"
          alt="table handler"
          className="cursor-grab"
        />
      </span>
    </>
  );
});
export default DragHandle;
