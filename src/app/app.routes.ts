import { Routes } from '@angular/router';
import { AdminSigninComponent } from './commerce/security/components/admin-signin/admin-signin.component';
import { ClientSigninComponent } from './commerce/security/components/client-signin/client-signin.component';

export const routes: Routes = [

    {path: '', redirectTo: '/login', pathMatch: 'full'},//default route

    {path: 'login', component: ClientSigninComponent},


    {path: 'dashboard-admin', 
        children: [
            {path: 'login', component: AdminSigninComponent},
            //{path: 'users', component: UsersComponent},
            //{path: 'roles', component: RolesComponent},
           // {path: 'permissions', component: PermissionsComponent},
            //{path: 'settings', component: SettingsComponent},
        ]
    },

   
];
