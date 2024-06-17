import { Router } from '@angular/router';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { LoaderComponent } from '../../../../../shared/components/loader/loader.component';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule,
    MatInputModule,MatButtonModule, LoaderComponent],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css'
})
export class AddProductComponent {
  @ViewChild('fileInput') fileInput: any;

  registerProductForm: FormGroup = new FormGroup({});
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  loading: boolean = false;

  maxFileSize = 3 * 1024 * 1024; // 3MB

  constructor(private fb: FormBuilder, private productService: ProductService, private _snackBar: MatSnackBar, private router:Router) { }

  ngOnInit(): void {
    this.registerProductForm = this.fb.group({
      name: ['',[Validators.required]],
      description: ['',[Validators.required]],
      price: ['',[Validators.required]],
      imageFile: [null,[Validators.required]],
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


  SubmitProduct(){
    if (this.registerProductForm.valid) {
      this.loading = true;

      //Enviar los datos al servicio
      const productRequest = {
        name: this.registerProductForm.value.name,
        description: this.registerProductForm.value.description,
        price: this.registerProductForm.value.price
      }

      const imageFile= this.selectedFile as File;
      console.log("Estamos en el addproduct component");

      this.productService.registerProduct(productRequest, imageFile).subscribe(
        {
          next: (response) => {
            console.log(response);
            this._snackBar.open("Producto registrado", "Cerrar", {
              duration: 2000,
            });
            this.router.navigate(['/admin/products']);

            this.loading = false;
          },
          error: (error) => {
            console.error(error);
            let errorMessage = 'Error al registrar el producto';
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
      this.registerProductForm.markAllAsTouched();
    }
  }
  cancel(){
    this.router.navigate(['/admin/products']);
  }

}
