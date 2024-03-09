import React, { useState } from "react";
import JSZip from "jszip";

import { CurrentFile } from "./types";

interface ZipDownloadProps {
  currentZipFilename: string;
  currentFiles: CurrentFile[];
  shouldDisable: boolean;
}

const ZipDownload: React.FC<ZipDownloadProps> = ({
  currentZipFilename,
  currentFiles,
  shouldDisable,
}) => {
  const [fileDownloadError, setFileDownloadError] = useState<string>("");

  const handleZipDownload = async () => {
    try {
      const newZip = new JSZip();

      for (let i = 0; i < currentFiles.length; i++) {
        const file = currentFiles[i];
        newZip.file(
          file.content.name,
          (file.content as any)._data.compressedContent
        );
      }

      const blob = await newZip.generateAsync({ type: "blob" });

      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.setAttribute("download", currentZipFilename);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      setFileDownloadError("Failed to download files");
    }
  };

  return (
    <>
      <button onClick={handleZipDownload} disabled={shouldDisable}>
        Save to directory
      </button>
      <p>{fileDownloadError}</p>
    </>
  );
};

export default ZipDownload;
