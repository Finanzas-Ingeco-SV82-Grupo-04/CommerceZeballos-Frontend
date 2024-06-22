import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../../products/models/product.model';
import { MatPaginator } from '@angular/material/paginator';
import { Observable, OperatorFunction, Subject, debounceTime, distinctUntilChanged, filter, map, merge, switchMap } from 'rxjs';
import { NgbDropdownModule, NgbTypeahead, NgbTypeaheadModule, NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';
import { ProductService } from '../../../products/services/product.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TransactionsService } from '../../services/transactions.service';
import { TransactionRequest } from '../../model/transaction.model';
import { LoaderComponent } from '../../../../../shared/components/loader/loader.component';

@Component({
  selector: 'app-register-transaction',
  standalone: true,
  imports: [
    MatButtonModule,FormsModule ,MatButtonModule,
    MatTableModule, NgbTypeaheadModule, NgbDropdownModule,
    MatFormFieldModule, LoaderComponent
  ],
  templateUrl: './register-transaction.component.html',
  styleUrl: './register-transaction.component.css'
})
export class RegisterTransactionComponent   {

  model: any;
  productsSearchList: Product[] = [];
  noResults: boolean = false;  // Add a flag for no results
  query: string='';
  currentPageSearch: number=0;
  pageSize: number=10;


  nameClient: string='';

  tabTypePayment: string='Proxima compra';
  listInstallments: number[] = [1,2,3,4,5,6,7,8,9,10,11,12];
  totalAmount: number=0;
  countInstallments: number=0;
  selectedInstallment: boolean = false;

  ELEMENT_DATA: Product[] = [];
  displayedColumns: string[] = ['position','name' ,'price', 'button'];
  dataSource = new MatTableDataSource<Product>(this.ELEMENT_DATA);
  totalElements = this.ELEMENT_DATA.length;

  loading: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator|null=null;

  @ViewChild('instance', { static: true }) instance!: NgbTypeahead;//obtener la instancia del componente ngbTypeahead, instance es la referencia al componente NgbTypeahead y permite acceder a sus métodos y propiedades.
  focus$ = new Subject<string>();
  click$ = new Subject<string>();  
  

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(
    private route: ActivatedRoute,
    private router:Router,
    private productService: ProductService,
    private _snackBar: MatSnackBar,
    private transactionService: TransactionsService
  ){}

  ngOnInit(){
    const nameRoute= this.route.snapshot.paramMap.get('name')
    if(nameRoute){
      this.nameClient = nameRoute
    }
  }


  search: OperatorFunction<string, readonly any[]> = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
    const inputFocus$ = this.focus$;
    
    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      switchMap(term => {
      if (term === '') {
        return [];
      }
      this.query = term;
      this.currentPageSearch = 0;
      return this.productService.searchProductsByName(this.query, this.currentPageSearch, this.pageSize).pipe(
        map(response => {
          this.productsSearchList = response.data.content;
          this.noResults = this.productsSearchList.length === 0;  // Update the flag based on search results
          return this.productsSearchList.map(product => product.name);
        })
        );
      })
    );
    };
  onProductSelected(selectedItem: NgbTypeaheadSelectItemEvent<Product>) {

    const selectedProduct: any = selectedItem.item;
    const foundProduct = this.productsSearchList.find(product => product.name === selectedProduct);
    //no agregar productos repetidos
    const foundProductInTable = this.ELEMENT_DATA.find(product => product.id === foundProduct?.id);
    if (foundProduct && !foundProductInTable) {
      //agregar a la tabla

      this.ELEMENT_DATA.push(foundProduct);

      //sumar el precio de los productos
      this.totalAmount += foundProduct.price;
    


      this.dataSource = new MatTableDataSource<Product>(this.ELEMENT_DATA);
      this.totalElements = this.ELEMENT_DATA.length;

    } 
  }
    
  clearSearch() {
    this.query = '';
    this.model = '';
    this.productsSearchList = [];
    this.noResults = false;
  }

  deleteProductOfTable(id:number){
    //eliminar de la tabla
    this.ELEMENT_DATA = this.ELEMENT_DATA.filter(product => {
      
      if(product.id === id){
        this.totalAmount -= product.price;
      }
      return product.id !== id;
    });
    this.dataSource = new MatTableDataSource<Product>(this.ELEMENT_DATA);
    this.totalElements = this.ELEMENT_DATA.length;

    //restar el precio de los productos
  
  }

  setTabTypePayment(type: string){
    this.tabTypePayment = type;
  }

  setCountInstallments(count: number){
    this.countInstallments = count;
  }
  goBack(): void {
    this.router.navigate(['../../'], { relativeTo: this.route });
  }
  
  sendTransaction(){
    if(this.ELEMENT_DATA.length === 0){
      this.showMessageSnackBar('Debe agregar productos');
      return;
    }else{
      if(this.tabTypePayment === 'En cuotas'){
        if(this.countInstallments === 0){
          this.showMessageSnackBar('Debe seleccionar la cantidad de cuotas');
          return;
        }else{
          //sumar el precio de los productos
          let totalAmount = 0;
          this.ELEMENT_DATA.forEach(product => {
            totalAmount += product.price;
          });

          //monto por cuota
          const installmentAmount = totalAmount / this.countInstallments;

          //dni del cliente de la ruta
          const dniClient = this.route.snapshot.paramMap.get('dni');
          if(dniClient){
  
            const transaction:TransactionRequest = {
              transactionAmountNotInterest: totalAmount,
              transactionAmountWithInterest: totalAmount,//AGREGAR LA LOGICA PAR ACALCULAR EL INTERES, RECOMINEDO QUE LO HAGS EN EL BACKEND
              transactionType: 'CUOTAS',
              transactionDescription: 'NO DESCRIPTION',
              installments: this.countInstallments,
              installmentAmount: installmentAmount,//AGREGAR LA LOGICA PARA CALCULAR EL MONTO DE LAS CUOTAS, RECOMINEDO QUE LO HAGS EN EL BACKEND
              dniClient: dniClient,
              productsIds: this.ELEMENT_DATA.map(product => product.id)
            
              //recomiendo que el monto total se haga en el backend, osea en el abcked sumar los precios de los productos y calcular el interes y el monto de las cuotas
            }
            this.registerTransaction(transaction);
          }

        }

      }
      if(this.tabTypePayment === 'Proxima compra'){
        this.countInstallments = 1;
        //sumar el precio de los productos
        let totalAmount = 0;
        this.ELEMENT_DATA.forEach(product => {
          totalAmount += product.price;
        });
        //monto por cuota
        const installmentAmount = totalAmount / this.countInstallments;
        //dni del cliente de la ruta
        const dniClient = this.route.snapshot.paramMap.get('dni');

        if(dniClient){
          const transaction:TransactionRequest = {
            transactionAmountNotInterest: totalAmount,
            transactionAmountWithInterest: totalAmount,//AGREGAR LA LOGICA PAR ACALCULAR EL INTERES, RECOMINEDO QUE LO HAGS EN EL BACKEND
            transactionType: 'PROXIMA_FECHA',
            transactionDescription: 'NO DESCRIPTION',
            installments: this.countInstallments,
            installmentAmount: installmentAmount,//AGREGAR LA LOGICA PARA CALCULAR EL MONTO DE LAS CUOTAS, RECOMINEDO QUE LO HAGS EN EL BACKEND
            dniClient: dniClient,
            productsIds: this.ELEMENT_DATA.map(product => product.id)
          
            //recomiendo que el monto total se haga en el backend, osea en el abcked sumar los precios de los productos y calcular el interes y el monto de las cuotas
          }
          console.log(transaction);
          this.registerTransaction(transaction);

        }
        
      }

    }
  
  }

  registerTransaction(transaction: TransactionRequest){
    if(transaction){
      this.loading = true;
      this.transactionService.registerTransaction(transaction).subscribe(
      {
        next: (response) => {
          if(response.success){
            this.loading = false;
            this.showMessageSnackBar('Transacción registrada correctamente');
            this.router.navigate(['../../'], { relativeTo: this.route });
          }
        },
        error: (error) => {
          this.loading = false;
          this.showMessageSnackBar('Error al registrar la transacción');
        }

       }
       )
    }
  }

  showMessageSnackBar(message: string){
    this._snackBar.open(message, 'OK', {
      duration: 2000,
    });
  }



}
