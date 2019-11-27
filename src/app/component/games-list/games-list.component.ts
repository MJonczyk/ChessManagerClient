import {AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {MatDialog, MatSort, MatTableDataSource} from '@angular/material';
import {FileService} from '../../service/file.service';
import {UploadDialogComponent} from '../upload-dialog/upload-dialog.component';
import {Game} from '../../model/Game';
import {GameService} from '../../service/game.service';
import {AuthenticationService} from '../../service/authentication.service';
import {Observable} from 'rxjs';

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
    this.dialog.open(UploadDialogComponent, {
      width: '50%',
      height: '50%',
    });
  }

  public async downloadFile(id: number) {
    this.fileService.downloadPGN(id);
  }

  public delete(id: number) {
    this.gameService.deleteGame(id).subscribe();
    this.gameService.getGames().subscribe(games => { this.dataSource.data = games; });
  }

  public filterGames(value: string) {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  public setGame(game: Game) {
    this.selectedGame = game;
    this.selectedRowIndex = game.id;
  }
}
