import { Injectable } from '@angular/core';
import { UploadService } from './alfa-upload.interface';
import { Observable } from 'rxjs';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';


@Injectable({
    providedIn: 'root',
})
export class AlfaUploadDefaultService implements UploadService {
    constructor(private readonly http: HttpClient) {}

    upload(image: File): Observable<HttpEvent<any>> {
        const formData: FormData = new FormData();

        formData.append('image', image);

        const req = new HttpRequest(
            'POST',
            `$environment.httpPath/`,
            formData,
            {
                reportProgress: true,
                responseType: 'json',
            },
        );

        return this.http.post(`$environment.httpPath/public-file/v2`, formData, {
          reportProgress: true,
          // responseType: 'json'
          observe: 'events',
        });
    }
}
