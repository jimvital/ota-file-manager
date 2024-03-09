import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

import { CurrentFile, RenameFile } from "../types";

import { useTimeout } from "../hooks/useTimeout";

interface FileRowCreateCopyProps {
  file: CurrentFile;
  currentFiles: CurrentFile[];
  setCurrentFiles: Dispatch<SetStateAction<CurrentFile[]>>;
  setRenameFile: Dispatch<SetStateAction<RenameFile>>;
  fileRowError: string;
  setFileRowError: Dispatch<SetStateAction<string>>;
  setShouldDisable: Dispatch<SetStateAction<boolean>>;
}

const FileRowCreateCopy: React.FC<FileRowCreateCopyProps> = ({
  file,
  currentFiles,
  setCurrentFiles,
  setRenameFile,
  fileRowError,
  setFileRowError,
  setShouldDisable,
}) => {
  const [didClick, setDidClick] = useState<boolean>(false);

  const { isRunning, resumeTimeout, pauseTimeout } = useTimeout(() => {
    const filenameCopy = `(copy) ${file.filename}`;

    const fileCopy = {
      id: currentFiles.length + 1,
      filename: filenameCopy,
      content: {
        ...file.content,
        date: new Date(),
        name: file.content.name.replace(file.filename, filenameCopy),
      },
    };

    setCurrentFiles((prev) => [...prev, fileCopy]);
    setDidClick(false);
  }, 3000);

  useEffect(() => {
    setShouldDisable(isRunning);
  }, [isRunning, setShouldDisable]);

  return (
    <div className="file-row-actions-container">
      {!didClick ? (
        <button
          className="rename-button"
          onClick={() => {
            setRenameFile({ id: file.id, updatedValue: file.filename });
          }}
        >
          ✎ Rename
        </button>
      ) : null}

      <button
        className="create-copy-button"
        disabled={!!fileRowError || didClick}
        onClick={() => {
          try {
            setDidClick(true);
            resumeTimeout();
          } catch (error) {
            setFileRowError("Something went wrong");
          }
        }}
      >
        {didClick ? "Creating copy..." : "❏ Create a copy"}
      </button>
      {didClick ? (
        isRunning ? (
          <button className="pause-button" onClick={pauseTimeout}>
            ❚❚
          </button>
        ) : (
          <button className="resume-button" onClick={resumeTimeout}>
            ▶
          </button>
        )
      ) : null}
    </div>
  );
};

export default FileRowCreateCopy;
