import { ControlValueAccessor, NG_VALUE_ACCESSOR, ControlContainer, AbstractControl, FormGroup } from '@angular/forms';
import { Component, OnInit, forwardRef, Optional, Host, SkipSelf, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { UIFileInterface } from '../../exports/lib';

@Component({
  selector: 'ui-file-box',
  templateUrl: './ui-file-box.component.html',
  styleUrls: ['./ui-file-box.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UIFileBoxComponent),
      multi: true
    }
  ]
})
export class UIFileBoxComponent implements OnInit, ControlValueAccessor {

  control: AbstractControl;

  @Input()
  disabled = true;
  @Input()
  bindLabel: string;
  @Input()
  formControlName: string;
  @Input('group')
  formGroup: FormGroup;
  @Output()
  change: EventEmitter<any> = new EventEmitter();
  @Output()
  onRemove: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  onDownload: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  onAdd: EventEmitter<any> = new EventEmitter<any>();

  @Input()
  height = 148;

  @Input()
  width = 154;

  value: File & { objectURL: SafeUrl, urlFile: string };
  previewUrl: any = null;

  private _file: UIFileInterface | UIFileInterface[];

  public get file(): UIFileInterface | UIFileInterface[] {
    return this._file;
  }

  public set file(file: UIFileInterface | UIFileInterface[]) {
    this._file = file;
    this.propagateChange(file);
  }

  constructor(@Optional() @Host() @SkipSelf() private controlContainer: ControlContainer, private domSanitizer: DomSanitizer) { }

  ngOnInit() {
    if (this.formControlName && this.controlContainer) {
      this.control = this.controlContainer.control.get(this.formControlName);
    }
  }

  propagateChange = (_: any) => { };

  writeValue(obj: UIFileInterface): void {

    if (obj != null) {
      this._file = obj;
      this.value = this.getFile(this._file, obj.filename);
    }

  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void { }

  setDisabledState?(isDisabled: boolean): void { }

  async onSelect(event: { currentFiles: File[] }) {
    if (event.currentFiles) {
      const element = event.currentFiles[0];
      this.file = <UIFileInterface>{ base64: await this.readUploadedFile(element), mimeType: element.type, filename: element.name };
      this.onAdd.emit(this.file);
    }
  }

  async fileProgress(fileInput: any) {

    const element = <File>fileInput.target.files[0];

    this.file = <UIFileInterface>{ base64: await this.readUploadedFile(element), mimeType: element.type, filename: element.name };
    this.value = this.getFile(this.file, element.name);
  }

  extractFiles(files: File[]): Array<any> {
    const filesArray = [];
    const filesCount = files.length;
    for (let index = 0; index < filesCount; index++) {
      filesArray.push(files[index]);
    }
    return filesArray;
  }

  preview(): void {

    const nimeType = this.value.type;

    if (nimeType.match(/image\/*/) == null) {
      return;
    }

    const reader = new FileReader();

    reader.readAsDataURL(this.value);
    reader.onload = (_event) => {

      this.previewUrl = reader.result;
    };
  }

  removeFile() {

    this.file = null;
    this.previewUrl = null;
    this.value = null;
  }

  formatSize(bytes: number) {
    if (bytes == 0) {
      return '0 B';
    }

    const k = 1000,
      dm = 2,
      sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
      i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  private readUploadedFile(inputFile: File | Blob): Promise<string> {
    const temporaryFileReader = new FileReader();

    return new Promise((resolve, reject) => {
      temporaryFileReader.onload = () => {
        resolve(<string>temporaryFileReader.result);
      };

      temporaryFileReader.readAsDataURL(inputFile);
    });
  }

  private dataURItoBlob(dataURI: string, type: string): Blob {
    if (dataURI) {
      dataURI = this.decodeFileUri(dataURI);
    }
    const byteString = atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([arrayBuffer], { type: type });
    return blob;
  }

  private decodeFileUri(dataURI: string): string {
    let substrStart = dataURI.indexOf(";base64,");
    substrStart = substrStart != -1 ? substrStart + 8 : 0;
    return dataURI.substr(substrStart);
  }

  private getFile(file: UIFileInterface, fileName: string): File & { objectURL: SafeUrl, urlFile: string } {
    const imageBlob = this.dataURItoBlob(file.base64, file.mimeType);
    const imageObjectUrl = this.domSanitizer.bypassSecurityTrustUrl(URL.createObjectURL(imageBlob));
    const imageFile = new File([imageBlob], fileName, { type: imageBlob.type });

    return Object.assign(imageFile, { objectURL: imageObjectUrl, urlFile: URL.createObjectURL(imageBlob) });
  }
}
