import {
    AfterViewInit,
    Component,
    EventEmitter,
    forwardRef,
    Host,
    Input,
    OnInit,
    Optional,
    Output,
    SkipSelf,
    ViewChild,
} from '@angular/core';
import { AbstractControl, ControlContainer, ControlValueAccessor, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FileUpload } from 'primeng/fileupload';

import { handleFile } from '../../../../utils/handlefile.utils';
import { UIFileInterface } from '../../../../interfaces/file.interface';

@Component({
    selector: 'ui-file-upload',
    templateUrl: './ui-file-upload.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => UIFileUpload),
            multi: true
        }
    ]
})
export class UIFileUpload implements ControlValueAccessor, OnInit, AfterViewInit {
    control: AbstractControl;

    @Input()
    disabled = false;

    @Input()
    isBase64 = true;

    @Input()
    formControlName: string;
    @Input('group')
    formGroup: FormGroup;
    @Input()
    fileType = 'image/*';
    @Input()
    multiple = false;
    @Input()
    chooseLabel: string;
    @Input()
    uploadLabel: string;
    @Input()
    cancelLabel: string;
    @Input()
    showDownloadButton = false;

    @Input('showRemoveButton')
    showRemoveButton = true;
    @Input()
    autoDownload = true;
    @Input()
    previewWidth = 50;
    @Output()
    onRemove: EventEmitter<any> = new EventEmitter<any>();
    @Output()
    onDownload: EventEmitter<any> = new EventEmitter<any>();
    @Output()
    onAdd: EventEmitter<any> = new EventEmitter<any>();

    @ViewChild('fileUploader', { static: true }) fileUploader: FileUpload;

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

    ngAfterViewInit() {
        this._file = !this.multiple ? { base64: '', mimeType: '', filename: '' } : [];
        this.fileUploader.files = [];
    }

    propagateChange = (_: any) => { };

    writeValue(obj: UIFileInterface | Array<UIFileInterface>): void {

        if (!(obj instanceof Array) && obj && obj.mimeType) {
            setTimeout(() => {
                this.fileUploader.files = [Object.assign(this.getFile(obj, (obj.filename && obj.filename != '') ? obj.filename : 'File'), { external: obj })];
                this._file = obj as UIFileInterface;
            }, 0);
        } else if (obj instanceof Array && obj.length > 0) {
            for (let index = 0; index < obj.length; index++) {
                this.fileUploader.files = [];
                setTimeout(() => {
                    const element = obj[index];
                    this.fileUploader.files = [...this.fileUploader.files, Object.assign(this.getFile(element, (element.filename && element.filename != '') ? element.filename : index + 1 + ' file'), { external: element })];
                    this._file = obj;
                }, 0);
            }
        }
    }

    registerOnChange(fn: any): void {
        this.propagateChange = fn;
    }

    registerOnTouched(fn: any): void { }

    setDisabledState?(isDisabled: boolean): void { }

    async onSelect(event: { currentFiles: File[] }) {
        if (event.currentFiles) {
            if (!this.multiple) {
                const element = event.currentFiles[0];
                this.file = <UIFileInterface>{ base64: await this.readUploadedFile(element), mimeType: element.type, filename: element.name };
                this.onAdd.emit(this.file);
            } else {
                const arrayFiles = this.extractFiles(event.currentFiles);
                let lastFiles: UIFileInterface[] = [];
                for (let index = 0; index < arrayFiles.length; index++) {
                    const element = arrayFiles[index];
                    let currentfile;
                    if(element.external != undefined){
                        currentfile = Object.assign(element.external);
                    }else{
                        currentfile = <UIFileInterface>{ base64: await this.readUploadedFile(element), mimeType: element.type, filename: element.name };
                    }
                    lastFiles = <UIFileInterface[]>[...<UIFileInterface[]>lastFiles, currentfile];
                    // const currentfile = <UIFileInterface>{ base64: await this.readUploadedFile(element), mimeType: element.type, filename: element.name, hasChanged: false };
                    // lastFiles = <UIFileInterface[]>[...<UIFileInterface[]>lastFiles, currentfile];
                }
                this.file = Object.assign(lastFiles);
                this.onAdd.emit(this.file);
                this.propagateChange(lastFiles);
            }
        }
    }

    extractFiles(files: File[]): Array<any> {
        const filesArray = [];
        const filesCount = files.length;
        for (let index = 0; index < filesCount; index++) {
            filesArray.push(files[index]);
        }
        return filesArray;
    }

    removeFile(file: File) {
        const index = this.fileUploader.files.indexOf(file);
        this.fileUploader.remove(null, index);
        this.onRemove.emit(file);
        if (!this.multiple) {
            this.file = null;
        } else {
            this.file = (<UIFileInterface[]>this.file).filter((elem, i) => i !== index);
        }
    }

    donwload(file: File & { external: UIFileInterface | null }) {
        const index = this.fileUploader.files.indexOf(file);
        this.onDownload.emit(file);
        if (this.autoDownload) {
            if (file.external) {
                handleFile(file, file.external.filename ? file.external.filename : file.name);

            } else {
                handleFile(file, file.name);
            }
        }
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

    private decodeFileUri(dataURI: string): string{
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
