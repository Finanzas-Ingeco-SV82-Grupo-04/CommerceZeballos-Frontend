import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {Client} from '../../model/list-clients.model';
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import {MatSort, MatSortModule} from "@angular/material/sort";
import { FormsModule } from "@angular/forms";
import {ListClientsService} from "../../services/list-clients.service";
import {HttpClientModule} from "@angular/common/http";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {ConfirmationDialogComponent} from "../confirmation-dialog/confirmation-dialog.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-clients',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatSortModule,
    FormsModule,
    MatLabel,
    MatDialogModule,
    HttpClientModule,
  ],
  templateUrl: './list-clients.component.html',
  styleUrls: ['./list-clients.component.css']
})

export class ListClientsComponent implements OnInit, AfterViewInit {
  searchClients = '';
  clients: Client[] = [];
  displayedColumns: string[] = ['name', 'dni', 'actions'];
  dataSource = new MatTableDataSource<Client>(this.clients);

  @ViewChild(MatSort) sort!: MatSort;
  constructor(private clientService: ListClientsService, public dialog: MatDialog,private router:Router) {}

  ngOnInit(): void {
    localStorage.removeItem('client');
    this.getAllClients();
    this.dataSource.filterPredicate = (data: Client, filter: string) => {
      const dataStr = `${data.firstname.toLowerCase()} ${data.lastname.toLowerCase()}`;
      return dataStr.includes(filter.trim().toLowerCase());
    };
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  getAllClients(): void {
    this.clientService.getAllClients().subscribe((clients: Client[]) => {
      this.clients = clients;
      this.dataSource.data = clients;
    });
  }

  deleteUser(client: Client): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
      data: { message: `¿Estás seguro que quieres borrar a ${client.firstname} ${client.lastname}?` }
    });

    dialogRef.afterClosed().subscribe((result: boolean | undefined) => {
      if (result) {
        this.clientService.deleteClient(client.dni).subscribe(() => {
          this.clients = this.clients.filter(c => c.dni !== client.dni);
          this.dataSource.data = this.clients;
          //alert('Cliente eliminado satisfactoriamente');
        }, error => {
          alert('No se pudo eliminar al cliente');
        });
      }
    });
  }

  viewDetails(client: Client): void {
    localStorage.setItem('client', JSON.stringify(client));
    this.router.navigate(['/admin/client-details', client.dni]);
  }

  search(): void {
    this.dataSource.filter = this.searchClients.trim().toLowerCase();
  }
}
