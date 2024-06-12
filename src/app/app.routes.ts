import { Routes } from '@angular/router';
import { AdminSigninComponent } from './commerce/security/components/admin-signin/admin-signin.component';
import { ClientSigninComponent } from './commerce/security/components/client-signin/client-signin.component';
import { RegisterClientComponent } from './commerce/register-client/components/register-client/register-client.component';
import { HeaderAdminComponent } from './commerce/header-admin/components/header-admin/header-admin.component';
import { ListProductComponent } from './commerce/products/components/list-product/list-product.component';

export const routes: Routes = [

    {path: 'client-login', component: ClientSigninComponent},
    
    {path: 'admin-login', component: AdminSigninComponent},
    {path: '', redirectTo: 'admin-login', pathMatch: 'full'},//default route



    {path: 'admin', component: HeaderAdminComponent,
        children: [
            {path: '', redirectTo:'register-client', pathMatch: 'full'},
            {path: 'register-client', component: RegisterClientComponent},
            {path: 'products', component: ListProductComponent}
            //aqui iran las rutas hijas
        ]
    },

   
];
