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



@Component({
  selector: 'app-list-product',
  standalone: true,
  imports: [NgbTypeaheadModule, FormsModule, JsonPipe,MatCardModule, MatButtonModule,
			NgbPaginationModule],
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


  @ViewChild('instance', { static: true }) instance!: NgbTypeahead;//obtener la instancia del componente ngbTypeahead, instance es la referencia al componente NgbTypeahead y permite acceder a sus métodos y propiedades.
  focus$ = new Subject<string>();
  click$ = new Subject<string>();  
  

  constructor(
    private productService: ProductService
  ) { }

  ngOnInit() {

	this.loadAllProducts();

  }

  loadAllProducts(){
	this.productService.getAllProducts(this.currentPageAll-1, this.pageSize).subscribe(
		{
		  next: (response) => {
			this.productsPage = response.data.content;
			this.totalProducts=response.data.totalElements;
		  },
		  error: (error) => {
			console.error(error);
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
		return this.productService.searchProducts(this.query, this.currentPageSearch, this.pageSize).pipe(
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
	console.log(selectedItem);
	const selectedProduct: any = selectedItem.item;
		const foundProduct = this.productsSearchList.find(product => product.name === selectedProduct);
	if (foundProduct) {
	  this.productSelectedSearch = foundProduct;
	} else {
	  this.productSelectedSearch = null;

	}
  }
  
  
}
