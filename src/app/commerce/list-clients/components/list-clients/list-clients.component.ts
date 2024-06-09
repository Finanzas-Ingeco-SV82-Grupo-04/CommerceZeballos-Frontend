import {Component, OnInit, ViewChild} from '@angular/core';
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
    HttpClientModule,
  ],
  templateUrl: './list-clients.component.html',
  styleUrls: ['./list-clients.component.css']
})

export class ListClientsComponent implements OnInit {
  searchClients = '';
  clients: Client[] = [];
  displayedColumns: string[] = ['name', 'dni', 'actions'];
  dataSource = new MatTableDataSource<Client>(this.clients);

  @ViewChild(MatSort) sort!: MatSort;
  constructor(private clientService: ListClientsService) {}

  ngOnInit(): void {
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
    if (confirm(`¿estas seguro que quieres borrar a ${client.firstname} ${client.lastname}?`)) {
      this.clientService.deleteClient(client.dni).subscribe(() => {
        this.clients = this.clients.filter(c => c.dni !== client.dni);
        this.dataSource.data = this.clients;
        alert('Client eliminado satisfactoriamente');
      }, error => {
        alert('No se pudo eliminar al cliente');
      });
    }
  }

  viewDetails(client: Client): void {
    console.log('Ver detalles:', client);
  }

  search(): void {
    this.dataSource.filter = this.searchClients.trim().toLowerCase();
  }
}
