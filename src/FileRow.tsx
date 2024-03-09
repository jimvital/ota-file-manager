import React, { Dispatch, SetStateAction, useState } from "react";

import { CurrentFile, RenameFile } from "./types";
import { defaultRenameFile } from "./constants";

import FileRowRename from "./FileRowRename";
import FileRowCreateCopy from "./FileRowCreateCopy";

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
    <div>
      {renameFile.id === file.id ? (
        <div>
          <input
            name="rename"
            value={renameFile.updatedValue}
            placeholder="Enter new file name"
            onChange={(event) => {
              const updatedValue = event.target.value;

              if (!updatedValue) {
                setFileRowError("Please enter file name");
              } else {
                setFileRowError("");
              }

              const hasDuplicate = currentFiles.some(
                (file) =>
                  file.id !== renameFile.id && updatedValue === file.filename
              );

              if (hasDuplicate) {
                setFileRowError("Duplicate file name detected");
              } else {
                setFileRowError("");
              }

              setRenameFile((prev) => ({ ...prev, updatedValue }));
            }}
          />
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
        <div style={{ display: "flex" }}>
          {file.filename}
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
      <p>{fileRowError}</p>
    </div>
  );
};

export default FileRow;
