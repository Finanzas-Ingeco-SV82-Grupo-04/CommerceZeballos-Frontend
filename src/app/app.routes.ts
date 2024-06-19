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

export const routes: Routes = [

    {path: 'client-login', component: ClientSigninComponent},

    {path: 'admin-login', component: AdminSigninComponent},
    {path: '', redirectTo: 'admin-login', pathMatch: 'full'},//default route



    {path: 'admin', component: HeaderAdminComponent,
        children: [
            {path: '', redirectTo:'register-client', pathMatch: 'full'},
            {path: 'register-client', component: RegisterClientComponent},
            {path: 'products', component: ListProductComponent},
            {path: 'add-product', component: AddProductComponent},
            {path: 'edit-product/:id', component: EditProductComponent},
            {path: 'all-clients', component: ListClientsComponent},
            {path: 'client-details/:dni', component: ClientDetailComponent }
            //aqui iran las rutas hijas
        ]
    },


];
