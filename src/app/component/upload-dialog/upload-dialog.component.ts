import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {FileService} from '../../service/file.service';
import {forkJoin} from 'rxjs';

@Component({
  selector: 'app-upload-dialog',
  templateUrl: './upload-dialog.component.html',
  styleUrls: ['./upload-dialog.component.css']
})
export class UploadDialogComponent implements OnInit {

  @ViewChild('file', { static: false }) file;
  public files: Set<File> = new Set();

  progress;
  canBeClosed = true;
  primaryButtonText = 'Upload';
  showCancelButton = true;
  uploading = false;
  uploadSuccessful = false;

  constructor( public dialog: MatDialogRef<UploadDialogComponent>, public fileService: FileService) { }

  ngOnInit() {
  }

  onFilesAdded() {
    const files: { [key: string]: File } = this.file.nativeElement.files;
    // const files: Map<string, File> = this.file.nativeElement.files;
    // files.forEach((value: File, key: string) => {
    //   this.files.add(value);
    // });
    for (const key in files) {
      if (!isNaN(parseInt(key))) {
        this.files.add(files[key]);
      }
    }
  }

  addFiles() {
    this.file.nativeElement.click();
  }

  closeDialog() {
    if (this.uploadSuccessful) {
      return this.dialog.close();
    }

    this.uploading = true;
    this.progress = this.fileService.uploadPGN(this.files);

    console.log(this.progress);

    for (const key in this.progress) {
      this.progress[key].progress.subscribe(val => console.log(val));
    }

    const progressObservables = [];
    // tslint:disable-next-line:forin
    for (const key in this.progress) {
      progressObservables.push(this.progress[key].progress);
    }

    // progressObservables = Array.from(this.progress);

    this.primaryButtonText = 'Finish';
    this.canBeClosed = false;
    this.dialog.disableClose = true;
    this.showCancelButton = false;

    forkJoin(progressObservables).subscribe(end => {
      this.canBeClosed = true;
      this.dialog.disableClose = false;
      this.uploadSuccessful = true;
      this.uploading = false;
    });
  }

}
