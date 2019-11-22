import {AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {MatDialog, MatSort, MatTableDataSource} from '@angular/material';
import {FileService} from '../../service/file.service';
import {UploadDialogComponent} from '../upload-dialog/upload-dialog.component';
import {Game} from '../../model/Game';
import {GameService} from '../../service/game.service';

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

  @Output() selectedGame = new EventEmitter<any>();
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  constructor(public dialog: MatDialog, private fileService: FileService, private gameService: GameService) {
  }

  ngOnInit() {
    this.getAllGames();
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
    this.selectedGame.emit(game);
    this.selectedRowIndex = game.id;
  }
}
