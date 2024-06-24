import { Component, OnInit } from '@angular/core';
import { DataService } from '../../service/data.service';
import { MatTableModule} from "@angular/material/table";
import { RouterOutlet, RouterLink,  RouterLinkActive} from '@angular/router';
import { MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-purchase-report-table',
  standalone: true,
  imports: [MatTableModule, RouterLink, RouterLinkActive, MatButtonModule],
  templateUrl: './purchase-report-table.component.html',
  styleUrls: ['./purchase-report-table.component.css']
})
export class PurchaseReportTableComponent implements OnInit {
  displayedColumns: string[] = ['fecha', 'compras', 'pagos', 'saldo'];
  dataSource: any;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.dataService.getData().subscribe(data => {
      this.dataSource = data;
    });
  }

  sortAscending = true;
  sortPurchasesAscending = true;

  sortTableByDate() {
    const sortedDataSource = [...this.dataSource].sort((a, b) => {
      const dateA = new Date(a.fecha);
      const dateB = new Date(b.fecha);

      if (this.sortAscending) {
        return dateA.getTime() - dateB.getTime();
      } else {
        return dateB.getTime() - dateA.getTime();
      }
    });

    this.dataSource = sortedDataSource;
    this.sortAscending = !this.sortAscending;
  }

  sortTableByPurchases() {
    const sortedDataSource = [...this.dataSource].sort((a, b) => {
      if (this.sortPurchasesAscending) {
        return a.compras - b.compras;
      } else {
        return b.compras - a.compras;
      }
    });

    this.dataSource = sortedDataSource;
    this.sortPurchasesAscending = !this.sortPurchasesAscending;
  }
}
