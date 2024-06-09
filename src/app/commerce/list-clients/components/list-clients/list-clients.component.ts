import {Component, OnInit} from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {Client} from '../../model/list-clients.model';
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatSortModule } from "@angular/material/sort";
import { FormsModule } from "@angular/forms";
import {ListClientsService} from "../../services/list-clients.service";
import {BrowserModule} from "@angular/platform-browser";
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
    //BrowserModule,
    HttpClientModule,

  ],
  templateUrl: './list-clients.component.html',
  styleUrls: ['./list-clients.component.css']
})

export class ListClientsComponent implements OnInit {
  searchTerm = '';
  clients: Client[] = [];
  displayedColumns: string[] = ['name', 'dni', 'actions'];
  dataSource = new MatTableDataSource<Client>(this.clients);

  constructor(private clientService: ListClientsService) {}

  ngOnInit(): void {
    this.getAllClients();
  }

  getAllClients(): void {
    this.clientService.getAllClients().subscribe((clients: Client[]) => {
      this.clients = clients;
      this.dataSource.data = clients;
    });
  }

  deleteUser(client: Client): void {
    if (confirm(`Are you sure you want to delete ${client.firstname} ${client.lastname}?`)) {
      this.clientService.deleteClient(client.dni).subscribe(() => {
        this.clients = this.clients.filter(c => c.dni !== client.dni);
        this.dataSource.data = this.clients;
        alert('Client deleted successfully');
      }, error => {
        alert('Failed to delete client');
      });
    }
  }

  viewDetails(client: Client): void {
    console.log('Ver detalles:', client);
  }

  search(): void {
    console.log('Buscar:', this.searchTerm);
  }
}
