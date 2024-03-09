import React, { useState } from "react";
import JSZip from "jszip";

import { CurrentFile } from "../types";

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

      // Zip all updated files
      for (let i = 0; i < currentFiles.length; i++) {
        const file = currentFiles[i];

        newZip.file(
          file.content.name,
          (file.content as any)._data.compressedContent
        );
      }

      const blob = await newZip.generateAsync({ type: "blob" });

      // Simulate download action
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.setAttribute("download", currentZipFilename);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setFileDownloadError("");
    } catch (error) {
      setFileDownloadError("Failed to download files");
    }
  };

  return (
    <>
      <button
        className="save-to-directory-button"
        onClick={handleZipDownload}
        disabled={shouldDisable}
      >
        🢃 Save to directory
      </button>
      <p className="error-message center">{fileDownloadError}</p>
    </>
  );
};

export default ZipDownload;
