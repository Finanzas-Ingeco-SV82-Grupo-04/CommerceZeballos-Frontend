import { Product } from './../../models/product.model';
import { Component, ViewChild } from '@angular/core';
import { NgbPaginationModule, NgbTypeahead, NgbTypeaheadModule, NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject, merge, OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ProductService } from '../../services/product.service';
import { Router, RouterLink } from '@angular/router';
import { LoaderComponent } from '../../../../../shared/components/loader/loader.component';
import { MatSnackBar } from '@angular/material/snack-bar';



@Component({
  selector: 'app-list-product',
  standalone: true,
  imports: [NgbTypeaheadModule, FormsModule, JsonPipe,MatCardModule, MatButtonModule,
			NgbPaginationModule, RouterLink, LoaderComponent],
  templateUrl: './list-product.component.html',
  styleUrl: './list-product.component.css'
})
export class ListProductComponent {
  model: any;

  currentPageSearch: number=0;
  currentPageAll:number=1;
  pageSize: number=10;
  query: string='';

  productsPage: Product[]=[];
  totalProducts: number=0;

  productsSearchList: Product[] = [];
  productSelectedSearch: Product | null= null;
  noResults: boolean = false;  // Add a flag for no results

  loading: boolean = false;
  errorDetected: boolean = false;

  isConfirmedDelete: boolean = false;
  idProductToDelete: number = 0;


  @ViewChild('instance', { static: true }) instance!: NgbTypeahead;//obtener la instancia del componente ngbTypeahead, instance es la referencia al componente NgbTypeahead y permite acceder a sus métodos y propiedades.
  focus$ = new Subject<string>();
  click$ = new Subject<string>();  
  

  constructor(
    private productService: ProductService,
	private _snackBar: MatSnackBar,
	private router: Router
  ) { }

  ngOnInit() {

	this.loadAllProducts();

  }

  loadAllProducts(){
	this.loading = true;
	this.productService.getAllProducts(this.currentPageAll-1, this.pageSize).subscribe(
		{
		  next: (response) => {
			if(response.success){
				this.productsPage = response.data.content;
				this.totalProducts = response.data.totalElements;
				this.loading = false;
			}
		  },
		  error: (error) => {
			
			this.errorDetected = true;
			this.loading = false;
		  }	

		}
	)
  }

  pageChanged(page: number) {
	console.log("El evento de la pagina es "+ page);
    this.currentPageAll = page;
    this.loadAllProducts();
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
			  console.log(this.productsSearchList)
			  this.noResults = this.productsSearchList.length === 0;  // Update the flag based on search results
			  return this.productsSearchList.map(product => product.name);
			})
		  );
	  })
	);
  };
  


  onProductSelected(selectedItem: NgbTypeaheadSelectItemEvent<Product>) {
	console.log(this.model)
	console.log(selectedItem);
	const selectedProduct: any = selectedItem.item;
		const foundProduct = this.productsSearchList.find(product => product.name === selectedProduct);
	if (foundProduct) {
	  this.productSelectedSearch = foundProduct;
	} else {
	  this.productSelectedSearch = null;

	}
  }

  clearSearch() {
	this.query = '';
	this.model = '';
	this.productSelectedSearch = null;
	this.productsSearchList = [];
	this.noResults = false;
  }

  confirmeDeleteProduct(productId: number){
	this.isConfirmedDelete = true;
	this.idProductToDelete = productId;
  }

  deleteProduct(){
	this.isConfirmedDelete = false;
	console.log(this.errorDetected)
	this.loading = true;
	this.productService.deleteProduct(this.idProductToDelete).subscribe(
		{
			next: (response) => {
				if(response.success){
					this.loadAllProducts();
					this.loading = false;

					this._snackBar.open("Producto eliminado", "Cerrar", {
						duration: 2000,
					  });
					
				}
			},
			error: (error) => {
				this.loading = false;

				this._snackBar.open("Ocurrio un error, intentalo denuevo", "Cerrar", {
					duration: 2000,
				  });
			}
		}
	)
  }
  
  cancelDelete(){
	this.isConfirmedDelete = false;
	this.idProductToDelete = 0;
  }

  editProduct(product: Product){
	this.productService.sendProductToEdit(product);

	this.router.navigate(['/admin/edit-product',product.id]);
  }
  
}
