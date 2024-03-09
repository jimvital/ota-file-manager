import React, { ChangeEvent, useState } from "react";
import * as jszip from "jszip";

import { CurrentFile } from "./types";

import FileRow from "./components/FileRow";
import ZipDownload from "./components/ZipDownload";

import "./App.css";

const App: React.FC = () => {
  const [currentFiles, setCurrentFiles] = useState<CurrentFile[]>([]);
  const [currentZipFilename, setCurrentZipFilename] = useState<string>("");
  const [filePickerError, setFilePickerError] = useState<string>("");
  const [shouldDisable, setShouldDisable] = useState<boolean>(false);

  const handleFilePick = async (event: ChangeEvent<HTMLInputElement>) => {
    setCurrentFiles([]);

    const zipNameSplit = event.target.value.split(/(\\|\/)/g).pop() || "";
    setCurrentZipFilename(zipNameSplit);

    const targetFiles = event.target.files || [];

    if (targetFiles.length === 0) {
      setFilePickerError("No zip file loaded");
      return;
    }

    try {
      const zipFile = targetFiles[0];
      const loadedZip = await jszip.loadAsync(zipFile);

      const tempCurrentFiles: CurrentFile[] = [];

      let id = 1;

      loadedZip.forEach((_, content) => {
        if (!content.dir) {
          const filename = content.name.split(/(\\|\/)/g).pop() || "";

          tempCurrentFiles.push({
            id: id++,
            filename,
            content: { ...content },
          });
        }
      });

      setCurrentFiles(tempCurrentFiles);
      setFilePickerError("");
    } catch (error) {
      setFilePickerError("Failed to load zip file");
    }
  };

  return (
    <div className="app">
      <div className="file-manager-container">
        <h1 className="file-manager-header">OTA File Manager</h1>
        <div className="file-picker-container">
          <input
            type="file"
            className="file-picker"
            name="file-picker"
            accept=".zip"
            onChange={handleFilePick}
          />
          <p className="error-message center">{filePickerError}</p>
        </div>
        <div className="file-contents">
          {currentFiles.map((file) => (
            <FileRow
              key={file.id}
              file={file}
              currentFiles={currentFiles}
              setCurrentFiles={setCurrentFiles}
              setShouldDisable={setShouldDisable}
            />
          ))}
        </div>
        {currentFiles.length > 0 ? (
          <ZipDownload
            currentZipFilename={currentZipFilename}
            currentFiles={currentFiles}
            shouldDisable={shouldDisable}
          />
        ) : null}
      </div>
    </div>
  );
};

export default App;
