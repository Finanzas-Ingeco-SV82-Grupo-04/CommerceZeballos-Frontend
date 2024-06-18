import { Component } from '@angular/core';
import { FormControl,FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { RegisterAccountService } from '../../services/register-account.service';
import { switchMap } from 'rxjs/operators';
import {
  MatSnackBar,
  MatSnackBarAction,
  MatSnackBarActions,
  MatSnackBarLabel,
  MatSnackBarRef,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-register-client',
  standalone: true,
  imports: [
    FormsModule, ReactiveFormsModule,MatInputModule,
    MatFormFieldModule, NgbDropdownModule,MatButtonModule
  ],
  templateUrl: './register-client.component.html',
  styleUrl: './register-client.component.css'
})
export class RegisterClientComponent {

  typeInterest = [
    {value: 'NOMINAL', viewValue: 'NOMINAL'},
    {value: 'EFFECTIVE', viewValue: 'EFECTIVA'}
  ];

  registerClientForm: FormGroup = new FormGroup({});

  registerAccountForm: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder,  private router:Router,
               private registerClient: RegisterAccountService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {

    this.registerClientForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['',[Validators.required, Validators.email]],
      phone: ['', [Validators.required,Validators.pattern(/^[0-9]*$/),Validators.minLength(9), Validators.maxLength(9)]],
      dni: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8),Validators.pattern(/^[0-8]*$/)]],
      password: ['', [Validators.required,Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],

    }, { validators: this.passwordMatchValidator })







    this.registerAccountForm = this.fb.group({
      typeInterest: ['', Validators.required],//
      creditLimit: ['', Validators.required],//
      paymentDate: ['', Validators.required],
      accountClosingDate: ['', Validators.required],
      paymentDay: ['', Validators.required],//
      interestRate: ['', Validators.required],//
      moratoriumRate: ['', Validators.required],//
      dniClient: ['', Validators.required],
    },{ validators: [this.limitCreditValidator, this.limitPaymentDayValidator] })

  }

  passwordMatchValidator: ValidatorFn = (control: AbstractControl): { [key: string]: any } | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }
    if (confirmPassword.errors && !confirmPassword.errors['mustBeEqual']) {
      // Return if another validator has already found an error on the confirmPassword
      return null;
    }
    if (password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ mustBeEqual: true });
      return { mustBeEqual: true };
    } else {
      confirmPassword.setErrors(null);
      return null;
    }
  }

  limitCreditValidator: ValidatorFn = (control: AbstractControl): { [key: string]: any } | null => {
    const creditLimit = control.get('creditLimit');
    if (!creditLimit) {
      return null;
    }
    if (creditLimit.errors && !creditLimit.errors['limitCreditValidator']) {
      // Return if another validator has already found an error on the confirmPassword
      return null;
    }
    if (creditLimit.value > 200 || creditLimit.value == 0) {
      creditLimit.setErrors({ limitCreditValidator: true });
      return { limitCreditValidator: true };
    } else {
      creditLimit.setErrors(null);
      return null;
    }
  }

  limitPaymentDayValidator: ValidatorFn = (control: AbstractControl): { [key: string]: any } | null => {
    const paymentDay = control.get('paymentDay');
    if (!paymentDay) {
      return null;
    }
    if (paymentDay.errors && !paymentDay.errors['limitPaymentDayValidator']) {
      // Return if another validator has already found an error on the confirmPassword
      return null;
    }
    if (paymentDay.value > 28) {
      paymentDay.setErrors({ limitPaymentDayValidator: true });
      return { limitPaymentDayValidator: true };
    } else {
      paymentDay.setErrors(null);
      return null;
    }
  }


  selectTypeInterest(value: string): void {
    this.registerAccountForm.get('typeInterest')?.setValue(value);
  }



  onSumitRegisterAccount() {
    // Validar el primer formulario
    if (this.registerClientForm.valid) {
      // Validar el segundo formulario
      if (this.registerAccountForm.valid) {
        const dataClient: any = {
          firstname: this.registerClientForm.get('firstname')?.value,
          lastname: this.registerClientForm.get('lastname')?.value,
          email: this.registerClientForm.get('email')?.value,
          phone: this.registerClientForm.get('phone')?.value,
          dni: this.registerClientForm.get('dni')?.value,
          password: this.registerClientForm.get('password')?.value,
        };

        //convertir los valores a double
        this.registerAccountForm.get('creditLimit')?.setValue(parseFloat(this.registerAccountForm.get('creditLimit')?.value));
        this.registerAccountForm.get('interestRate')?.setValue(parseFloat(this.registerAccountForm.get('interestRate')?.value));
        this.registerAccountForm.get('moratoriumRate')?.setValue(parseFloat(this.registerAccountForm.get('moratoriumRate')?.value));
        this.registerAccountForm.get('paymentDay')?.setValue(parseFloat(this.registerAccountForm.get('paymentDay')?.value));

        //convertir a local date
        const paymentDate = new Date(this.registerAccountForm.get('paymentDate')?.value);
        const accountClosingDate = new Date(this.registerAccountForm.get('accountClosingDate')?.value);
        this.registerAccountForm.get('paymentDate')?.setValue(paymentDate);
        this.registerAccountForm.get('accountClosingDate')?.setValue(accountClosingDate);

        const dataCurrentAccount: any = {
          typeInterest: this.registerAccountForm.get('typeInterest')?.value,
          creditLimit: this.registerAccountForm.get('creditLimit')?.value,
          paymentDate: this.registerAccountForm.get('paymentDate')?.value,
          accountClosingDate: this.registerAccountForm.get('accountClosingDate')?.value,
          paymentDay: this.registerAccountForm.get('paymentDay')?.value,
          interestRate: this.registerAccountForm.get('interestRate')?.value,
          moratoriumRate: this.registerAccountForm.get('moratoriumRate')?.value,
          dniClient: this.registerAccountForm.get('dniClient')?.value,
        };


        //registro de cliente
       //  Dentro del método donde se realiza el registro del cliente
        this.registerClient.registerClient(dataClient).pipe(
          switchMap((clientResult: any) => {
            // Una vez que el cliente esté registrado, procedemos a registrar la cuenta
            return this.registerClient.registerCurrentAccount(this.registerAccountForm.value);
          })
        ).subscribe({
          next: (accountResult: any) => {
            this.openSnackBar('Cuenta registrada con éxito');
            this.registerClientForm.reset(); //Limpiar formulario una vez registrado al cliente
            this.registerAccountForm.reset();
            // Realizar la navegación solo si se ha completado con éxito el registro de cliente y cuenta
            // this.router.navigate(['/login']);
          },
          error: (error: any) => {
            this.openSnackBar(error.error.message);
          }
        });



      } else {
        console.log('El segundo formulario no es válido');
      }
    } else {
      console.log('El primer formulario no es válido');
    }
  }




 onSubmit(): void {
    if (this.registerClientForm.valid ) {

      //tomar dni
      const dni = this.registerClientForm.get('dni')?.value;
       //quiero que se tome la fecha actual, verifique el mes, y con el paymentDay, cambie al otro mes para ese dia, en este formato: 2021-09-28
       const date = new Date();
       const month = date.getMonth() + 1;//porque enero es 0
       const year = date.getFullYear();
       const paymentDay = this.registerAccountForm.get('paymentDay')?.value;

       let newMonth = month;
       let newYear = year;

         newMonth = month + 1;
         if (newMonth > 12) {
           newMonth = 1;
           newYear = year + 1;
         }


       const paymentDate = `${newYear}-${newMonth}-${paymentDay}`;

       //cambiar el valor de paymentDate
        this.registerAccountForm.get('paymentDate')?.setValue(paymentDate);
        this.registerAccountForm.get('accountClosingDate')?.setValue(paymentDate);
        this.registerAccountForm.get('dniClient')?.setValue(dni);


      if(this.registerAccountForm.valid){

        this.onSumitRegisterAccount();
      }
    } else {
        // Si algún formulario no es válido, marca todos los campos como "touched" para que se muestren los mensajes de error.
        this.markFormGroupTouched(this.registerClientForm);
        this.markFormGroupTouched(this.registerAccountForm);
    }
}

markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
        if (control instanceof FormGroup) {
            this.markFormGroupTouched(control);
        } else {
            control.markAsTouched();
        }
    });
}

openSnackBar(message:string) {
  this._snackBar.open(message, 'Cerrar', {
    duration: 3*3000,
  });
}

}
