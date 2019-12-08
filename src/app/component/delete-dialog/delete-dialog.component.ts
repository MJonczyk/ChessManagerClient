import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {GameService} from '../../service/game.service';

export interface GameToDelete {
  id: number;
}

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.css']
})
export class DeleteDialogComponent implements OnInit {

  constructor(public dialog: MatDialogRef<DeleteDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
              public gameService: GameService) { }

  ngOnInit() {
  }

  delete() {
    this.gameService.deleteGame(this.data.id).subscribe();
    this.dialog.close();
  }

  cancel() {
    this.dialog.close();
  }
}
