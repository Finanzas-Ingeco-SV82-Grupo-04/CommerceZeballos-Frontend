import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  AccountDetailComponent
} from "./commerce/customer-account-detail/components/account-detail/account-detail.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AccountDetailComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'CommerceZeballosFrontend';
}
