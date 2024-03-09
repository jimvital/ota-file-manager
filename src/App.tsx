import React, { ChangeEvent, useState } from "react";
import * as jszip from "jszip";

import { CurrentFile } from "./types";

import FileRow from "./FileRow";
import ZipDownload from "./ZipDownload";

import "./App.css";

const App: React.FC = () => {
  const [currentFiles, setCurrentFiles] = useState<CurrentFile[]>([]);
  const [currentZipFilename, setCurrentZipFilename] = useState<string>("");
  const [filePickerError, setFilePickerError] = useState<string>("");
  const [shouldDisable, setShouldDisable] = useState<boolean>(false);

  const handleFilePick = async (event: ChangeEvent<HTMLInputElement>) => {
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
    } catch (error) {
      setFilePickerError("Failed to load zip file");
    }
  };

  return (
    <div className="app">
      <header className="app-header">OTA File Manager</header>
      <input type="file" name="file-picker" onChange={handleFilePick} />
      <p>{filePickerError}</p>
      {currentFiles.map((file) => (
        <FileRow
          key={file.id}
          file={file}
          currentFiles={currentFiles}
          setCurrentFiles={setCurrentFiles}
          setShouldDisable={setShouldDisable}
        />
      ))}
      {currentFiles.length > 0 ? (
        <ZipDownload
          currentZipFilename={currentZipFilename}
          currentFiles={currentFiles}
          shouldDisable={shouldDisable}
        />
      ) : null}
    </div>
  );
};

export default App;
