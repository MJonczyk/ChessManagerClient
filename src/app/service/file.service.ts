import {Injectable} from '@angular/core';
import {HttpClient, HttpEventType, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';

const url = 'http://localhost:8080';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient) { }

  public uploadPGN(files: Set<File>): { [key: string]: {progress: Observable<number> } } {
    const uploadUrl = `${url}/upload`;
    const status: { [key: string]: {progress: Observable<number> } } = {};

    files.forEach(file => {
      const formData: FormData = new FormData();
      formData.append('file', file, file.name);

      const req = new HttpRequest('POST', uploadUrl, formData, { reportProgress: true});
      const progress = new Subject<number>();

      this.http.request(req).subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          const percentDone = Math.round(100 * event.loaded / event.total);

          progress.next(percentDone);
        } else if (event instanceof HttpResponse) {
          progress.complete();
        }
      });

      status[file.name] = {
        progress: progress.asObservable()
      };
    });

    return status;
  }

  public downloadPGN(id: number): void {
    const downloadUrl = `${url}/download/${id}`;
    this.http.get(downloadUrl, {responseType: 'blob' as 'json', observe: 'response'}).subscribe(
      (response: HttpResponse<Blob>) => {
        const blob = new Blob([response.body], { type: 'text/plain'});
        const downloadLink = document.createElement('a');

        downloadLink.href = window.URL.createObjectURL(blob);
        const filename = response.headers.get('content-disposition')
          .substring(response.headers.get('content-disposition').indexOf('=') + 1);

        downloadLink.setAttribute('download', filename);
        document.body.appendChild(downloadLink);
        downloadLink.click();
      }
    );
  }
}
