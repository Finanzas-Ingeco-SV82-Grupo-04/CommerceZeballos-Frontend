import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
  selector: 'app-admin-signin',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, FormsModule,
             MatFormFieldModule, MatInputModule, ReactiveFormsModule
            ],
  templateUrl: './admin-signin.component.html',
  styleUrl: './admin-signin.component.css'
})
export class AdminSigninComponent {
  signinForm: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder) { }



  ngOnInit(): void {
    this.signinForm= this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    })
  }


  onSumitLogin(){

  }

}
