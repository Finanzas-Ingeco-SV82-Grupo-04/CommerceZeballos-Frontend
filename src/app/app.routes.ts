import { Routes } from '@angular/router';
import { AdminSigninComponent } from './commerce/security/components/admin-signin/admin-signin.component';
import { ClientSigninComponent } from './commerce/security/components/client-signin/client-signin.component';
import { RegisterClientComponent } from './commerce/register-client/components/register-client/register-client.component';
import { HeaderAdminComponent } from './commerce/header-admin/components/header-admin/header-admin.component';
import { ListProductComponent } from './commerce/products/components/list-product/list-product.component';
import { AddProductComponent } from './commerce/products/components/add-product/add-product.component';
import { EditProductComponent } from './commerce/products/components/edit-product/edit-product.component';
import { ListClientsComponent } from './commerce/list-clients/components/list-clients/list-clients.component';
import { ClientDetailComponent } from './commerce/list-clients/components/client-detail/client-detail.component';
import { TransactionDetailComponent } from './commerce/current-account/components/transaction-detail/transaction-detail.component';
import { RegisterTransactionComponent } from './commerce/current-account/components/register-transaction/register-transaction.component';
import {
  AccountDetailComponent
} from "./commerce/customer-account-detail/components/account-detail/account-detail.component";
import {HomeComponent} from "./public/pages/home/home.component";

export const routes: Routes = [

  {path: 'home', component: HomeComponent},
  {path: 'client-login', component: ClientSigninComponent},
  {path: 'admin-login', component: AdminSigninComponent},
  {path: '', redirectTo: 'home', pathMatch: 'full'},//default route






/**
  {path: 'account-detail', component: AccountDetailComponent},




  {path: '', redirectTo: 'account-detail', pathMatch: 'full'},//default route
**/





  {path: 'admin', component: HeaderAdminComponent,
    children: [
      {path: '', redirectTo:'register-client', pathMatch: 'full'},
      {path: 'register-client', component: RegisterClientComponent},
      {path: 'products', component: ListProductComponent},
      {path: 'add-product', component: AddProductComponent}, {path: 'edit-product/:id', component: EditProductComponent},
      {path: 'all-clients', component: ListClientsComponent},
      {path: 'client-details/:dni/:name', component: ClientDetailComponent},
      { path: 'client-details/:dni/:name/transaction/:id/detail', component: TransactionDetailComponent },
      {path: 'client-details/:dni/:name/transaction/register', component: RegisterTransactionComponent},


            //aqui iran las rutas hijas
    ]
  },

  {path:'**', redirectTo: 'home', pathMatch: 'full'},

];
