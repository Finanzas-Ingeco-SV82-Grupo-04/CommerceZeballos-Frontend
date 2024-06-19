import { CurrentAccount } from './../../../current-account/model/current-account.model';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { LoaderComponent } from '../../../../../shared/components/loader/loader.component';
import { Client } from '../../model/list-clients.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ListClientsService } from '../../services/list-clients.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import {MatSliderModule} from '@angular/material/slider';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {FormsModule} from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { CurrentAccountService } from '../../../current-account/services/current-account.service';
import { Transaction } from '../../../current-account/model/transaction.model';

// This is a mock of the data that should be displayed in the table
// The data should be fetched from the backend





export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}
const ELEMENT_DATA: Transaction[] = [];


@Component({
  selector: 'app-client-detail',
  standalone: true,
  imports: [
    LoaderComponent,
    MatButtonModule,
    MatDividerModule,
    MatSliderModule,
    MatProgressBarModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule
  ],
  templateUrl: './client-detail.component.html',
  styleUrl: './client-detail.component.css'
})
export class ClientDetailComponent {

  displayedColumns: string[] = ['position','date' ,'totalAmount', 'installments', 'details'];
  dataSource = new MatTableDataSource<Transaction>(ELEMENT_DATA);
  totalElements = ELEMENT_DATA.length;


  @ViewChild(MatPaginator) paginator: MatPaginator|null=null;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }



  avaiableBalance: string = '0.00'; // Saldo disponible
  balanceConsumed: string = '0.00'; // Saldo consumido
  totalAmount: string = '0.00'; // Monto total
  
  loading: boolean = false;

  loadingToClient: boolean = false;
  loadingToCurrentAccount: boolean = false;
  loadingToTransactions: boolean = false;

  clientSelected: Client | null = null
  currentAccount: CurrentAccount | null = null;

  constructor( 
    private route:ActivatedRoute,
    private listClientService: ListClientsService,
    private currentAccountService: CurrentAccountService,
    private router:Router
    ) { }

  ngOnInit(): void {
   this.selectClient();
  }

  selectClient(): void {//OJO AL ERROR DE LOCALSTORAGE, CUANDO SE PASE A PRODUCCION 
    this.loading = true;

    if (this.isLocalStorageAvailable()) {
      const storedClient = localStorage.getItem('client');
      if (storedClient) {
        this.clientSelected = JSON.parse(storedClient);
        this.loading = false;
        this.getCurrentAccount();

      } else {
        const clientDni = this.route.snapshot.paramMap.get('dni');
        if (clientDni) {
          this.listClientService.getClientByDni(clientDni).subscribe(
            {
              next: (response) => {
                if (response.data) {
                  this.clientSelected = response.data;
                  console.log(this.clientSelected);
                  this.getCurrentAccount();
                  

                }
              },
              error: (error) => {
                console.error(error);
              },
              complete: () => {
                this.loading = false;
              }
            }
          );
        }
      }
    }



  }

  getCurrentAccount(): void {

    this.currentAccountService.getCurrentAccountByDni(this.clientSelected?.dni || '').subscribe(
      {
        next: (response) => {
          if (response.data) {
            console.log(response.data);
            this.currentAccount = response.data;
            this.getBalanceConsumed();
            this.getTransactions();
          }
        },
        error: (error) => {
          console.error(error);
        }
      }
    )
  }


  getTransactions(): void {
    console.log(this.currentAccount);
    if(this.currentAccount){
      console.log(this.currentAccount.id);
      this.currentAccountService.getTransactionsByCurrentAccountId(this.currentAccount.id).subscribe(
        {
          next: (response) => {
            if (response.data) {
              console.log(response.data);
              this.dataSource.data = response.data;
              this.totalElements = response.data.length;
              console.log(this.totalElements);
            }
          },
          error: (error) => {
            console.error(error);
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
        `/admin/client-details/${this.clientSelected.dni}/transaction/${transaction.id}/detail`
      ]);


    } else {
      console.error('Missing clientSelected or transaction.id');
    }
  }




  isLocalStorageAvailable(): boolean {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }
   
}


  
  

