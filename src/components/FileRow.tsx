import React, { Dispatch, SetStateAction, useState } from "react";

import { CurrentFile, RenameFile } from "../types";
import { defaultRenameFile } from "../constants";

import FileRowRename from "./FileRowRenameInput";
import FileRowCreateCopy from "./FileRowActions";

interface FileRowProps {
  file: CurrentFile;
  currentFiles: CurrentFile[];
  setCurrentFiles: Dispatch<SetStateAction<CurrentFile[]>>;
  setShouldDisable: Dispatch<SetStateAction<boolean>>;
}

const FileRow: React.FC<FileRowProps> = ({
  file,
  currentFiles,
  setCurrentFiles,
  setShouldDisable,
}) => {
  const [renameFile, setRenameFile] = useState<RenameFile>(defaultRenameFile);
  const [fileRowError, setFileRowError] = useState<string>("");

  return (
    <div className="file-row">
      {renameFile.id === file.id ? (
        <div className="file-row-rename-container">
          <FileRowRename
            currentFiles={currentFiles}
            setCurrentFiles={setCurrentFiles}
            renameFile={renameFile}
            setRenameFile={setRenameFile}
            fileRowError={fileRowError}
            setFileRowError={setFileRowError}
            setShouldDisable={setShouldDisable}
          />
        </div>
      ) : (
        <div className="file-row-default-container">
          <p className="file-row-name">{file.content.name}</p>
          <FileRowCreateCopy
            file={file}
            currentFiles={currentFiles}
            setCurrentFiles={setCurrentFiles}
            setRenameFile={setRenameFile}
            fileRowError={fileRowError}
            setFileRowError={setFileRowError}
            setShouldDisable={setShouldDisable}
          />
        </div>
      )}
      <p className="error-message">{fileRowError}</p>
    </div>
  );
};

export default FileRow;
