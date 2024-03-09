import * as jszip from "jszip";

export interface CurrentFile {
  id: number;
  filename: string;
  content: jszip.JSZipObject;
}

export interface RenameFile {
  id: number;
  updatedValue: string;
}
