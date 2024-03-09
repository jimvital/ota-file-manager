import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

import { CurrentFile, RenameFile } from "./types";
import { defaultRenameFile } from "./constants";

import { useTimeout } from "./hooks/useTimeout";

interface FileRowRenameProps {
  currentFiles: CurrentFile[];
  setCurrentFiles: Dispatch<SetStateAction<CurrentFile[]>>;
  renameFile: RenameFile;
  setRenameFile: Dispatch<SetStateAction<RenameFile>>;
  fileRowError: string;
  setFileRowError: Dispatch<SetStateAction<string>>;
  setShouldDisable: Dispatch<SetStateAction<boolean>>;
}

const FileRowRename: React.FC<FileRowRenameProps> = ({
  currentFiles,
  setCurrentFiles,
  renameFile,
  setRenameFile,
  fileRowError,
  setFileRowError,
  setShouldDisable,
}) => {
  const [didClick, setDidClick] = useState<boolean>(false);

  const { isRunning, resumeTimeout, pauseTimeout } = useTimeout(() => {
    const updatedFiles = currentFiles.map((file) => {
      if (file.id === renameFile.id) {
        return {
          ...file,
          filename: renameFile.updatedValue,
          content: {
            ...file.content,
            date: new Date(),
            name: file.content.name.replace(
              file.filename,
              renameFile.updatedValue
            ),
          },
        };
      }

      return file;
    });

    setCurrentFiles(updatedFiles);
    setRenameFile(defaultRenameFile);
  }, 3000);

  useEffect(() => {
    setShouldDisable(isRunning);
  }, [isRunning, setShouldDisable]);

  return (
    <div style={{ display: "flex" }}>
      <button
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
        {didClick ? "Saving..." : "Save"}
      </button>
      {didClick ? (
        isRunning ? (
          <button onClick={pauseTimeout}>Pause</button>
        ) : (
          <button onClick={resumeTimeout}>Resume</button>
        )
      ) : null}
    </div>
  );
};

export default FileRowRename;
