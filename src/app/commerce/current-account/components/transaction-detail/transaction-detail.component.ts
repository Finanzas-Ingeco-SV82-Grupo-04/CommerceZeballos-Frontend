import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { LoaderComponent } from '../../../../../shared/components/loader/loader.component';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { Client } from '../../../list-clients/model/list-clients.model';
import { CurrentAccount } from '../../model/current-account.model';
import { Transaction } from '../../model/transaction.model';
import { TransactionsService } from '../../services/transactions.service';
import { ProductService } from '../../../products/services/product.service';
import { Product } from '../../../products/models/product.model';





@Component({
  selector: 'app-transaction-detail',
  standalone: true,
  imports: [
    LoaderComponent,
    MatButtonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule
  ],
  templateUrl: './transaction-detail.component.html',
  styleUrl: './transaction-detail.component.css'
})
export class TransactionDetailComponent {
  constructor(
    private route:ActivatedRoute,
    private router:Router,
    private transactionService: TransactionsService,
    private productService: ProductService,
    private cdr: ChangeDetectorRef
    ) { }
  ELEMENT_DATA: Product[] = [];
  displayedColumns: string[] = ['position','name' ,'price'];
  dataSource = new MatTableDataSource<Product>(this.ELEMENT_DATA);
  totalElements = this.ELEMENT_DATA.length;

  @ViewChild(MatPaginator) paginator: MatPaginator|null=null;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadingToTransaction: boolean = false;
  loadingToProducts: boolean = false;

  errorDetectedToTransaction: boolean = false;
  errorDetectedToProducts: boolean = false;



  nameClient: string = ''
  transaction: Transaction | null = null
  amountTotalOfInstallments: number = 0



  ngOnInit(): void {

    this.loadingToTransaction = true;
    this.loadingToProducts = true;


    const nameRoute= this.route.snapshot.paramMap.get('name')
    if(nameRoute){
      this.nameClient = nameRoute
    }

    const transactionId = this.route.snapshot.paramMap.get('id')
    if(transactionId){
      this.getTransactionById(parseInt(transactionId))
    }

  }

  getTransactionById(transactionId: number): void {

    this.transactionService.getTransactionById(transactionId).subscribe(
      {
        next: (response) => {
          if(response.data){
            this.transaction = response.data
            this.loadingToTransaction = false;
            this.amountTotalOfInstallments = this.transaction.transactionAmountWithInterest - this.transaction.transactionAmountNotInterest
            this.getProductsByIds(this.transaction.productIds)
          }
        },
        error: (error) => {
          this.errorDetectedToTransaction = true;
          this.loadingToTransaction = false;
        }
      }
    );
  }

  getProductsByIds(productsIds: number[]): void {

    productsIds.map((productId) => {
      this.productService.getProductById(productId).subscribe(
        {
          next: (response) => {
            if(response.data){
              this.dataSource.data.push(response.data)
              this.totalElements = this.dataSource.data.length
              this.loadingToProducts = false;
              this.assignPaginator()
            }
          },
          error: (error) => {
            this.errorDetectedToProducts = true;
            this.loadingToProducts = false;
          }
        }
      );

    })



  }


  assignPaginator() {
    // This ensures the paginator is assigned after the view has been updated
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.cdr.detectChanges();
    });
  }

  goBack(): void {
    this.router.navigate(['../../../'], { relativeTo: this.route });
  }


}
