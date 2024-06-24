import { Component } from '@angular/core';
import {MatButton, MatButtonModule} from "@angular/material/button";
import {MatCard, MatCardModule} from "@angular/material/card";
import {MatError, MatFormField, MatFormFieldModule, MatLabel} from "@angular/material/form-field";
import {MatInput, MatInputModule} from "@angular/material/input";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {SigninService} from "../../services/signin.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-client-signin',
  standalone: true,
    imports: [
      MatButton,
      MatCard,
      MatError,
      MatFormField,
      MatInput,
      MatLabel,
      MatButtonModule,
      FormsModule,
      MatFormFieldModule,
      MatInputModule,
      ReactiveFormsModule
    ],
  templateUrl: './client-signin.component.html',
  styleUrl: './client-signin.component.css'
})
export class ClientSigninComponent {

  signinFormClient: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder, private siginService: SigninService, private router:Router) { }



  ngOnInit(): void {
    this.signinFormClient= this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    })
  }


  onSumitLoginClient(){

    if(this.signinFormClient.valid){

      const requestLogin = this.signinFormClient.value;

      this.siginService.signIn(requestLogin).subscribe(
        {
          next: (response) => {

            localStorage.setItem('token', response.token);
            this.router.navigate(['/admin/register-client']);

          },
          error: (error) => {
            if(error.status === 401){
              alert('Invalid email or password');
            }
          }
        }
      )
    }

  }

}
