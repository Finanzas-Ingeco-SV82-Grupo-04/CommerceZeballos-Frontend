import { Component } from '@angular/core';
import {MatTableModule} from '@angular/material/table';
@Component({
  selector: 'app-table-report',
  standalone: true,
  imports: [
    MatTableModule
  ],
  templateUrl: './table-report.component.html',
  styleUrl: './table-report.component.css'
})
export class TableReportComponent {
  displayedColumns: string[] = ['fecha', 'compras', 'pagos', 'saldo'];
}
