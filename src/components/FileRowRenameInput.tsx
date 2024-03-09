import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

import { CurrentFile, RenameFile } from "../types";
import { defaultRenameFile } from "../constants";

import { useTimeout } from "../hooks/useTimeout";

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
    <>
      <input
        className="rename-input"
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
        disabled={didClick}
      />
      <div className="file-rename-actions">
        <button
          className="rename-apply-button"
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
          {didClick ? "Applying..." : "Apply"}
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
        ) : (
          <button
            className="rename-cancel-button"
            onClick={() => {
              setRenameFile(defaultRenameFile);
              setFileRowError("");
            }}
          >
            Cancel
          </button>
        )}
      </div>
    </>
  );
};

export default FileRowRename;
