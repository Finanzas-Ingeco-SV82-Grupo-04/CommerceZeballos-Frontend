import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LoaderComponent } from '../../../../../shared/components/loader/loader.component';
import { ProductService } from '../../services/product.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    LoaderComponent,
    RouterLink
  ],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.css'
})
export class EditProductComponent {

  @ViewChild('fileInput') fileInput: any;

  editProductForm: FormGroup = new FormGroup({});
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  loading: boolean = false;

  maxFileSize = 1 * 1024 * 1024; // 3MB

  editProductSelected: Product | null = null;

  constructor(private fb: FormBuilder, private productService: ProductService, private _snackBar: MatSnackBar, private router:Router) { }

  ngOnInit(): void {
    this.editProductSelected = this.productService.getProductToEditService();

    if (this.editProductSelected == null) {
      this.router.navigate(['/admin/products']);
    } 

    this.editProductForm = this.fb.group({
      name: [this.editProductSelected?.name,[Validators.required]],
      description: [this.editProductSelected?.description,[Validators.required]],
      price: [this.editProductSelected?.price,[Validators.required]],
      imageFile: ['',[Validators.required]],
  
    });
  
  }

 
  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      
      if (file.size > this.maxFileSize) {
        this._snackBar.open('El tamaño del archivo excede el límite permitido.', 'Cerrar', {
          duration: 3000,
        });
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          this.imagePreview = reader.result;
        };
        reader.readAsDataURL(file);
        this.selectedFile = file;
      }
    }
  }
  
  
  submitEditProduct(){
    if (this.editProductForm.valid) {
      this.loading = true;

      //Enviar los datos al servicio
      const productRequest = {
        name: this.editProductForm.value.name,
        description: this.editProductForm.value.description,
        price: this.editProductForm.value.price
      }
      const productId = this.editProductSelected?.id as number;

      const imageFile= this.selectedFile as File;

      this.productService.updateProduct(productRequest, imageFile,productId).subscribe(
        {
          next: (response) => {
            console.log(response);
            this._snackBar.open("Producto actualizado", "Cerrar", {
              duration: 2000,
            });
            this.router.navigate(['/admin/products']);

            this.loading = false;
          },
          error: (error) => {
            console.error(error);
            let errorMessage = 'Error al actualizar el producto';
            if (error.error && error.error.data && error.error.data.message === 'Maximum upload size exceeded') {
              errorMessage = 'El tamaño del archivo excede el límite permitido.';
            }
            this._snackBar.open(errorMessage, 'Cerrar', {
              duration: 2000,
            });
            this.loading = false; // Ocultar el loader
          }
        
        }
      );

    } else {
      // Marca todos los controles como tocados para activar la validación
      this.editProductForm.markAllAsTouched();
    }
  }

  

}
