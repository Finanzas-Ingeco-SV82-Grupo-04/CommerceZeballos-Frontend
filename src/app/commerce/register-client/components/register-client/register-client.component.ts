import {LoaderComponent} from './../../../../../shared/components/loader/loader.component';
import {Component} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {Router} from '@angular/router';
import {NgbDropdownModule} from '@ng-bootstrap/ng-bootstrap';
import {RegisterAccountService} from '../../services/register-account.service';
import {MatSnackBar,} from '@angular/material/snack-bar';
import {PaymentPlan, TypeDescription, typeFrecuency, TypeTransactionType} from "../../model/current-account.model";
import {RegisterPaymentPlanService} from "../../services/register-payment-plan.service";
import {switchMap} from "rxjs/operators";


@Component({
  selector: 'app-register-client',
  standalone: true,
  imports: [
    FormsModule, ReactiveFormsModule,MatInputModule,
    MatFormFieldModule, NgbDropdownModule,MatButtonModule,
    LoaderComponent
  ],
  templateUrl: './register-client.component.html',
  styleUrl: './register-client.component.css'
})
export class RegisterClientComponent{
  loading: boolean = false;

  typeInterest = [
    //{value: 'NOMINAL', viewValue: 'NOMINAL'},
    {value: 'EFFECTIVE', viewValue: 'EFECTIVA'}
  ];

  typeFrecuency = [
    {value: 'WEEKLY', viewValue: 'SEMANAL'},
    {value: 'BIWEEKLY', viewValue: 'QUINCENAL'}
  ];

  registerClientForm: FormGroup = new FormGroup({});
  registerAccountForm: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder,  private router:Router,
               private registerClient: RegisterAccountService,
              private _snackBar: MatSnackBar,
              private registerPaymentPlan: RegisterPaymentPlanService) { }

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
      typeInterest: ['', Validators.required],////
      creditLimit: ['', Validators.required],//
      //paymentTerm: ['', Validators.required],//
      numberOfMonths: ['', Validators.required],//
      paymentFrequency: ['', Validators.required],
      interestRate: ['', Validators.required],//
      moratoriumRate: ['', Validators.required],//
      //dniClient: ['', Validators.required],
      //paymentDate: ['', Validators.required],
      //accountClosingDate: ['', Validators.required],
    },{ validators: [this.limitCreditValidator, this.paymentTermValidator] })

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
    if (creditLimit.value > 200 || creditLimit.value < 50) {
      creditLimit.setErrors({ limitCreditValidator: true });
      return { limitCreditValidator: true };
    } else {
      creditLimit.setErrors(null);
      return null;
    }
  }




  paymentTermValidator: ValidatorFn = (control: AbstractControl): { [key: string]: any } | null => {
    const paymentTerm = control.get('numberOfMonths');
    if (!paymentTerm) {
      return null;
    }
    if (paymentTerm.value < 1 || paymentTerm.value > 3) {
      paymentTerm.setErrors({ paymentTermValidator: true });
      return { paymentTermValidator: true };
    } else {
      paymentTerm.setErrors(null);
      return null;
    }
  }


  selectTypeInterest(value: string): void {
    this.registerAccountForm.get('typeInterest')?.setValue(value);
  }

  selectTypeFrecuency(value: string): void {
    this.registerAccountForm.get('paymentFrequency')?.setValue(value);
  }

  onSubmit() { //onSumitRegisterAccount
    // Validar el primer formulario
    if (this.registerClientForm.valid) {
      // Validar el segundo formulario\
      console.log(this.registerAccountForm.value);
      if(this.registerAccountForm.valid){
        this.loading = true;

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


        //convertir a local date
        const paymentTerm = this.registerAccountForm.get('numberOfMonths')?.value;
       

      const dataCurrentAccount: any = {
          typeInterest: this.registerAccountForm.get('typeInterest')?.value,
          creditLimit: this.registerAccountForm.get('creditLimit')?.value,
          numberOfMonths: this.registerAccountForm.get('numberOfMonths')?.value,
          //paymentTerm: paymentDate,
          typeCredit: 'Tipo de credito',
          paymentFrequency: this.registerAccountForm.get('paymentFrequency')?.value,
          interestRate: this.registerAccountForm.get('interestRate')?.value,
          moratoriumRate: this.registerAccountForm.get('moratoriumRate')?.value,
          dniClient: this.registerClientForm.get('dni')?.value,
        };

        if(this.tabTypePayment =='Proxima compra'){
          dataCurrentAccount.typeCredit = 'AMERICANO';
        }
        if(this.tabTypePayment =='En cuotas'){
          dataCurrentAccount.typeCredit = 'FRANCES';
        }
        if(this.registerAccountForm.get('paymentFrequency')?.value == 'WEEKLY'){
          dataCurrentAccount.paymentFrequency = 'SEMANAL';
        }
        if(this.registerAccountForm.get('paymentFrequency')?.value == 'BIWEEKLY'){
          dataCurrentAccount.paymentFrequency = 'QUINCENAL';
        }


          console.log(dataClient);
          console.log(dataCurrentAccount);
       this.registerClient.registerClient(dataClient).pipe(
         switchMap((clientResult: any) => {
           // Una vez que el cliente esté registrado, procedemos a registrar la cuenta
           return this.registerClient.registerCurrentAccount(dataCurrentAccount);
         }),/*
         switchMap((accountResult: any) => {
           return this.registerPaymentPlan.registerPaymentPlan(paymentPlan);
         })*/
       ).subscribe({
         next: (accountResult: any) => {
           if(accountResult.success){
             this.openSnackBar('Cuenta registrada exitosamente');
             this.loading = false;
           // Realizar la navegación solo si se ha completado con éxito el registro de cliente y cuenta
            this.router.navigate(['/admin/all-clients']);
           }
         },
         error: (error: any) => {
           this.loading = false;
           this.openSnackBar('Error al registrar');
         }
       });




        
      } else {
       
        this.markFormGroupTouched(this.registerAccountForm);
        console.log('El segundo formulario no es válido');
      }

 




    } else {
      this.markFormGroupTouched(this.registerClientForm);
      console.log('El primer formulario no es válido');
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

  

  tabTypePayment: string='Proxima compra';
  totalAmount: number=0;
  countInstallments: number=0;

  setTabTypePayment(type: string){
    this.tabTypePayment = type;
  }

  showMessageSnackBar(message: string){
    this._snackBar.open(message, 'OK', {
      duration: 2000,
    });
  }

  openSnackBar(message:string) {
    this._snackBar.open(message, 'Cerrar', {
      duration: 3000,
    });
  }
}
