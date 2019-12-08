import {AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {MatDialog, MatSort, MatTableDataSource} from '@angular/material';
import {FileService} from '../../service/file.service';
import {UploadDialogComponent} from '../upload-dialog/upload-dialog.component';
import {Game} from '../../model/Game';
import {GameService} from '../../service/game.service';
import {AuthenticationService} from '../../service/authentication.service';
import {Observable} from 'rxjs';
import {DeleteDialogComponent} from '../delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-games-list',
  templateUrl: './games-list.component.html',
  styleUrls: ['./games-list.component.css']
})
export class GamesListComponent implements OnInit, AfterViewInit {
  public orderedColumns = ['white', 'black', 'result', 'event', 'date', 'round', 'download', 'delete'];
  public dataSource = new MatTableDataSource<Game>();
  public selectedRowIndex = -1;
  checked = true;
  private isLoggedIn$: Observable<boolean>;
  private showAllGames = true;

  selectedGame = new Game();
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  constructor(public dialog: MatDialog, private fileService: FileService, private gameService: GameService,
              private auth: AuthenticationService) {
  }

  ngOnInit() {
    this.getAllGames();
    this.isLoggedIn$ = this.auth.isLoggedIn;
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  public getAllGames() {
    this.gameService.getGames().subscribe(games => { this.dataSource.data = games; });
  }

  public openUploadDialog() {
    const uploadDialog = this.dialog.open(UploadDialogComponent, {
      width: '50%',
      height: '50%',
    });

    uploadDialog.afterClosed().subscribe(() => {
      this.gameService.getGames().subscribe(games => { this.dataSource.data = games; });
    });
  }

  public async downloadFile(id: number) {
    this.fileService.downloadPGN(id);
  }

  public async downloadDatabase() {
    this.fileService.downloadDatabase();
  }

  public delete(id: number) {
    const deleteDialog = this.dialog.open(DeleteDialogComponent, {
      width: '25%',
      height: '25%',
      data: {id: id}
    });
    deleteDialog.afterClosed().subscribe(() => {
      this.gameService.getGames().subscribe(games => { this.dataSource.data = games; });
    });
  }

  public filterGames(value: string) {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  public filterGameType() {
    if (this.showAllGames) {
      this.dataSource.filter = 'private';
      this.showAllGames = false;
    } else {
      this.dataSource.filter = '';
      this.showAllGames = true;
    }
  }

  public setGame(game: Game) {
    this.selectedGame = game;
    this.selectedRowIndex = game.id;
  }

  public isGameDeletable(gameType: string) {
    if (this.auth.role === 'ROLE_ADMIN') {
      return true;
    } else {
      if (this.auth.role === 'ROLE_USER' && gameType === 'private') {
        return true;
      }
    }
    return false;
  }

  public showAllGameCheckbox() {
    return this.auth.role === 'ROLE_USER';
  }

  public showDownloadDBButton() {
    return this.auth.role === 'ROLE_USER';
  }

  public showAddButton() {
    return this.auth.role !== '';
  }
}
