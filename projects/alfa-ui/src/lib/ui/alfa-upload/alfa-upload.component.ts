import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Input,
    OnChanges,
    OnDestroy,
    Optional,
    Self,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgControl } from '@angular/forms';
import { AlfaAbstractFormControl } from '../abstract-control';
import { Observable } from 'rxjs';
import { AlfaProgressComponent } from '../alfa-progress/alfa-progress.component';
import { AlfaDirectivesModule } from '../../directives/alfa-directives.module';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { HttpEvent, HttpEventType, HttpProgressEvent, HttpResponse } from '@angular/common/http';
// import { AlfaIconsModule } from '$components/Alfa-icons';
import { AlfaPipesModule } from '../../pipes/alfa-pipes.module';
import { UploadService } from './alfa-upload.interface';
import { AlfaUploadDefaultService } from './alfa-upload.default.service';

/**
 * Uploader.
 *
 * Use for upload files, must use with input service for upload files
 */
@Component({
    selector: 'alfa-upload',
    templateUrl: './alfa-upload.component.html',
    styleUrls: ['./alfa-upload.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        class: 'alfa-upload',
    },
    standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AlfaProgressComponent,
    AlfaDirectivesModule,
    // AlfaIconsModule,
    AlfaPipesModule,
    DragDropModule,
    AlfaPipesModule,
  ],
})
export class AlfaUploadComponent extends AlfaAbstractFormControl<any> implements OnChanges, OnDestroy {
    @Input()
    requiredFileTypes: string[] = [];

    @Input()
    label: string = '';

    @Input()
    helperText: string = '';

    @Input()
    multiple: boolean = false;

    /** Necessary abstract service*/
    @Input()
    uploadService: UploadService | null = null;

    files: any[] = [];

    get notIncludeValue() {
        if (this.value && this.value.length > 0 && typeof this.value === 'object') {
            if (this.files && this.files.length > 0) {
                const valueArr = this.value.filter((val: string) =>
                    this.files.filter((file) => file.url === val).length > 0 ? false : true,
                );
                return valueArr;
            } else {
                return this.value;
            }
        }
        if (this.value && this.value.length > 0 && typeof this.value === 'string') {
            if (this.files && this.files.length > 0) {
                return this.files.filter((file) => file.url === this.value) ? [] : [this.value];
            } else {
                return [this.value];
            }
        }
        return [];
    }

    @ViewChild('fileDropRef') public inputRef!: ElementRef<HTMLInputElement>;
    /** @ignore */
    constructor(
        protected override changeDetectorRef: ChangeDetectorRef,
        // private serviceToast: ToastService,
        @Self() @Optional() public override ngControl: NgControl,

        public AlfaUploadDefaultService: AlfaUploadDefaultService,
    ) {
        super(changeDetectorRef, ngControl);
    }

    /**
     * on file drop handler
     */
    onFileDropped($event: any) {
        if (!this.multiple && $event && $event.length === 1) {
            this.prepareFilesList($event);
        } else if (!this.multiple && $event && $event.length > 1) {
            // this.serviceToast.show('Warning', 'Choose only one file', ToastType.Warning);
        } else if (this.multiple) {
            this.prepareFilesList($event);
        }
    }

    /**
     * handle file from browsing
     */
    fileBrowseHandler(target: any) {
        this.prepareFilesList(target.files);
    }

    /**
     * Delete file from files list
     * @param index (File index)
     */
    deleteFile(index: number) {
        if (this.inputRef && this.inputRef.nativeElement) {
            this.inputRef.nativeElement.value = '';
        }
        this.files.splice(index, 1);
        if (!this.multiple) {
            this.value = '';
        } else {
            this.value = this.files.filter((file) => (file.progress = 100)).map((file) => file.url);
        }
        this.valueChanged.emit(this.value);
        this.onChange(this.value);
        this.changeDetectorRef.markForCheck();
    }

    /**
     * Simulate the upload process
     */
    uploadFilesSimulator(index: number) {
        // delete file before start upload if not multiple
        if (!this.multiple) {
            const file = this.files[this.files.length - 1];
            this.files = [file];
        }
        const arr: Observable<HttpEvent<any>>[] = [];
        for (const file of this.files) {
            if (file.progress !== 100) {
                if (!this.uploadService) {
                    this.uploadService = this.AlfaUploadDefaultService;
                }
                this.uploadService.upload(file).subscribe({
                    next: (res) => {
                        if (this.isHttpProgressEvent(res)) {
                            file.progress = res.total
                                ? Math.round((100 * res.loaded) / res.total)
                                : file.progress;
                        }
                        if (this.isHttpResponse(res)) {
                            file.progress = 100;
                            file.url = res.body.image;
                            // this.serviceToast.show('Success', 'File loaded', ToastType.Success);
                            if (!this.multiple) {
                                this.value = this.files
                                    .filter((_file) => _file.progress === 100)
                                    .map((_file) => _file.url)[0];
                            } else {
                                this.value = this.files
                                    .filter((_file) => _file.progress === 100)
                                    .map((_file) => _file.url);
                            }
                            this.valueChanged.emit(this.value);
                            this.onChange(this.value);
                            this.changeDetectorRef.markForCheck();
                        }
                        this.changeDetectorRef.markForCheck();
                    },
                    error: (_) => {
                        file.error = true;
                        // this.serviceToast.show('Error', 'File not loaded', ToastType.Error);
                        this.files = this.files.filter((f) => !f.error);
                        this.changeDetectorRef.markForCheck();
                    },
                });
                arr.push(this.uploadService.upload(file));
            }
        }
    }

    /**
     * Convert Files list to normal array list
     * @param files (Files List)
     */
    prepareFilesList(files: Array<any>) {
        for (const item of files) {
            item.progress = 0;
            this.files.push(item);
        }
        this.uploadFilesSimulator(0);
    }

    /**
     * format bytes
     * @param bytes (File size in bytes)
     * @param decimals (Decimals point)
     */
    formatBytes(bytes: any, decimals?: any) {
        if (bytes === 0) {
            return '0 Bytes';
        }
        const k = 1024;
        const dm = decimals <= 0 ? 0 : decimals || 2;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    /** Function to check event end upload */
    isHttpResponse<T>(event: HttpEvent<T>): event is HttpResponse<T> {
        return event.type === HttpEventType.Response;
    }

    /** Function to check event for progress bar */
    isHttpProgressEvent(event: HttpEvent<unknown>): event is HttpProgressEvent {
        return (
            event.type === HttpEventType.DownloadProgress ||
            event.type === HttpEventType.UploadProgress
        );
    }

    clickToUpload() {
        this.inputRef.nativeElement.disabled = false;
        this.inputRef.nativeElement.click();
        this.inputRef.nativeElement.disabled = true;
    }

    deleteValue(val: string) {
        if (!this.multiple) {
            this.value = '';
        } else {
            if (this.value && this.value.length > 0) {
                this.value = this.value.filter((file: string) => file !== val);
            }
        }
        this.valueChanged.emit(this.value);
        this.onChange(this.value);
        this.changeDetectorRef.markForCheck();
    }

    drop(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.files, event.previousIndex, event.currentIndex);
    }
}
