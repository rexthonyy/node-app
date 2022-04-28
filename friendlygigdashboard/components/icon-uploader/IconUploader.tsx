import React from "react";
import { PencilAltIcon } from "@heroicons/react/outline";

const IconUploader: any = () => {
  return (
    <>
      <div className="input-file-wrapper">
        <div className="upload-placeholder">
          <img src={`/images/placeholder.png`} />
          <React.Fragment>
            <div className="overlay">
              <PencilAltIcon className="icon" />
              &nbsp;&nbsp; Change Icon
            </div>
            <input type="file" id="upload-image" />
          </React.Fragment>
        </div>
      </div>
    </>
  );
};

export default IconUploader;
