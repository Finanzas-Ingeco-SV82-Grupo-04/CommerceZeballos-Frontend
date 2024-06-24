import {AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {Transaction} from "../../../current-account/model/transaction.model";
import {ActivatedRoute, Router} from "@angular/router";
import {ListClientsService} from "../../../list-clients/services/list-clients.service";
import {CurrentAccountService} from "../../../current-account/services/current-account.service";
import {TransactionsService} from "../../../current-account/services/transactions.service";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {CurrentAccount} from "../../../current-account/model/current-account.model";
import {LoaderComponent} from "../../../../../shared/components/loader/loader.component";
import { MatButtonModule} from "@angular/material/button";
import { MatSliderModule} from "@angular/material/slider";
import {FormsModule} from "@angular/forms";
import {MatDividerModule} from "@angular/material/divider";
import {Client} from "../../../list-clients/model/list-clients.model";



export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}
//tener 10 datos de ejemplo
const ELEMENT_DATA: Transaction[] = [];


@Component({
  selector: 'app-account-detail',
  standalone: true,
  imports: [
    LoaderComponent,
    MatButtonModule,
    MatDividerModule,
    MatSliderModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule
  ],
  templateUrl: './account-detail.component.html',
  styleUrl: './account-detail.component.css'
})


export class AccountDetailComponent implements AfterViewInit{

  constructor(
    private route:ActivatedRoute,
    private listClientService: ListClientsService,
    private currentAccountService: CurrentAccountService,
    private transactionService: TransactionsService,
    private router:Router,
    private cdr: ChangeDetectorRef

  ) { }


  displayedColumns: string[] = ['position','date' ,'totalAmount', 'installments', 'details'];
  dataSource = new MatTableDataSource<Transaction>(ELEMENT_DATA);
  totalElements = ELEMENT_DATA.length;
  currentPage = 0;



  @ViewChild(MatPaginator) paginator: MatPaginator | null= null;

  ngAfterViewInit() {
    this.cdr.detectChanges();  // Asegurarse de que el contenido se ha renderizado

  }



  avaiableBalance: string = '0.00'; // Saldo disponible
  balanceConsumed: string = '0.00'; // Saldo consumido
  totalAmount: string = '0.00'; // Monto total


  loadingToClient: boolean = false;
  loadingToCurrentAccount: boolean = false;
  loadingToTransactions: boolean = false;

  errorDetectedToClient: boolean = false;
  errorDetectedToCurrentAccount: boolean = false;
  errorDetectedToTransactions: boolean = false;


  clientSelected: Client | null = null;
  currentAccount: CurrentAccount | null = null;


  ngOnInit(): void {
    this.loadingToClient = true;
    this.loadingToCurrentAccount = true;
    this.loadingToTransactions = true;
    this.selectClient();
  }

  selectClient(): void {//OJO AL ERROR DE LOCALSTORAGE, CUANDO SE PASE A PRODUCCION


    const clientDni = this.route.snapshot.paramMap.get('dni');
    if (clientDni) {
      this.listClientService.getClientByDni(clientDni).subscribe(
        {
          next: (response) => {
            if (response.data) {
              this.clientSelected = response.data;
              this.getCurrentAccount();
              this.loadingToClient = false;

            }
          },
          error: (error) => {
            this.loadingToClient = false;

            this.errorDetectedToClient = true;

          }
        }
      );


    }



  }

  getCurrentAccount(): void {

    this.currentAccountService.getCurrentAccountByDni(this.clientSelected?.dni || '').subscribe(
      {
        next: (response) => {
          if (response.data) {
            this.currentAccount = response.data;
            this.loadingToCurrentAccount = false;
            this.errorDetectedToCurrentAccount = false;
            this.getBalanceConsumed();
            this.getTransactions();
          }
        },
        error: (error) => {
          this.loadingToCurrentAccount = false;
        }
      }
    )
  }


  getTransactions(): void {
    console.log(this.currentAccount);
    if(this.currentAccount){
      console.log(this.currentAccount.id);
      this.transactionService.getTransactionsByCurrentAccountId(this.currentAccount.id).subscribe(
        {
          next: (response) => {
            if (response.data) {
              this.dataSource.data = response.data;
              this.totalElements = response.data.length;
              this.loadingToTransactions = false;
              this.errorDetectedToTransactions = false;
              this.assignPaginator(); // Assign paginator after data is loaded and view is updated


            }
          },
          error: (error) => {
            this.loadingToTransactions = false;
          }
        }
      )
    }

  }


  getBalanceConsumed(): void {
    if (this.currentAccount) {
      this.totalAmount = this.currentAccount.creditLimit.toFixed(2);
      this.avaiableBalance = (this.currentAccount.creditLimit - this.currentAccount.usedCredit).toFixed(2);
      this.balanceConsumed = ((this.currentAccount.usedCredit / this.currentAccount.creditLimit) * 100).toFixed(2);
    }
  }

  viewTransactionDetails(transaction: Transaction): void {
    if (this.clientSelected && this.clientSelected.dni && transaction.id) {

      this.router.navigate([
        `/admin/client-details/${this.clientSelected.dni}/${this.clientSelected.firstname}/transaction/${transaction.id}/detail`
      ]);


    } else {
      console.error('Missing clientSelected or transaction.id');
    }
  }

  assignPaginator() {
    // This ensures the paginator is assigned after the view has been updated
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.cdr.detectChanges();
    });
  }

  newTransaction(){
    this.router.navigate([
      `/admin/client-details/${this.clientSelected?.dni}/${this.clientSelected?.firstname}/transaction/register`
    ]);
  }


}
