import * as FileSaver from "file-saver"

export const handleFile = (response: Blob, filename: string) => {
  FileSaver.saveAs(response, filename)
}