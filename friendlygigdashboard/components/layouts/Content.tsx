import React, { FC, ReactNode } from "react";

interface ContentProps {
  children?: ReactNode;
}
const Content: FC<ContentProps> = ({ children }: ContentProps) => {
  return (
    <div className="main-content flex flex-col flex-grow px-6 py-6 h-screen">
      <div className="rounded-sm p-5 shadow overflow-hidden">
        {children}
      </div>
    </div>
  );
};

export default Content;
