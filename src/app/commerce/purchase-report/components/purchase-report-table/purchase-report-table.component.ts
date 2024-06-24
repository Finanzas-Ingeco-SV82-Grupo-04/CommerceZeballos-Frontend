import { Component } from '@angular/core';
import {MatColumnDef, MatHeaderCell, MatHeaderRow, MatHeaderRowDef, MatTable} from "@angular/material/table";

@Component({
  selector: 'app-purchase-report-table',
  standalone: true,
    imports: [
        MatColumnDef,
        MatHeaderCell,
        MatHeaderRow,
        MatHeaderRowDef,
        MatTable
    ],
  templateUrl: './purchase-report-table.component.html',
  styleUrl: './purchase-report-table.component.css'
})
export class PurchaseReportTableComponent {
  displayedColumns: string[] = ['fecha', 'compras', 'pagos', 'saldo'];
}
