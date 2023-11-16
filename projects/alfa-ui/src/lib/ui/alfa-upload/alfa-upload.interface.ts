import { HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * UploadService.
 *
 * Abstract service with one method upload
 *
 */
@Injectable()
export abstract class UploadService {
    constructor() {}
    abstract upload(file: File): Observable<HttpEvent<any>>;
}

/** AttachedFile */
export interface AttachedFile {
    name: string;
    url: string;
    progress: number;
}
