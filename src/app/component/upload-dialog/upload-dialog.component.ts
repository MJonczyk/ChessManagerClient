import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {FileService} from '../../service/file.service';
import {forkJoin} from 'rxjs';
import {AlertService} from '../../service/alert.service';

@Component({
  selector: 'app-upload-dialog',
  templateUrl: './upload-dialog.component.html',
  styleUrls: ['./upload-dialog.component.css']
})
export class UploadDialogComponent implements OnInit {

  @ViewChild('file', { static: false }) file;
  public files: Set<File> = new Set();

  progress;
  canBeClosed = false;
  primaryButtonText = 'Upload';
  showCancelButton = true;
  uploading = false;
  uploadSuccessful = false;
  wrongFormat = false;
  tooBigFile = false;

  constructor( public dialog: MatDialogRef<UploadDialogComponent>, public fileService: FileService, private alertService: AlertService) { }

  ngOnInit() {
  }

  onFilesAdded() {
    const files: { [key: string]: File } = this.file.nativeElement.files;

    for (const key in files) {
      if (!isNaN(parseInt(key))) {
        this.files.add(files[key]);
      }
    }

    for (const file of this.files.values()) {
      console.log(file);
      let errorMessage = '';

      if (file.name.substring(file.name.length - 3) !== 'pgn') {
        this.wrongFormat = true;
        errorMessage += 'Game with wrong format. ';
      }

      if (file.size > 500000000) {
        this.tooBigFile = true;
        errorMessage += 'File size is too big.';
      }

      if (errorMessage !== '')
        this.alertService.error(errorMessage);
    }
    this.canBeClosed = true;
  }

  deleteFile(file: File) {
    this.files.delete(file);

    this.wrongFormat = false;
    this.tooBigFile = false;
    this.alertService.clear();

    for (const f of this.files.values()) {
      if (f.name.substring(f.name.length - 3) !== 'pgn') {
        this.wrongFormat = true;
        this.alertService.error('You added game with wrong format.');
      }
      if (f.size > 1000000) {
        this.tooBigFile = true;
        this.alertService.error('File size is too big.');
      }
    }

    if(this.files.size === 0) {
      this.canBeClosed = false;
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
