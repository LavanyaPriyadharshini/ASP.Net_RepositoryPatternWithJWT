import { Routes } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { UserCreationComponent } from './component/user-creation/user-creation.component';
import { AccessDeniedComponent } from './component/access-denied/access-denied.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },

   { path: 'user-creation', component: UserCreationComponent },
      { path: 'access-denied',component: AccessDeniedComponent },


  // Catch all
  { path: '**', redirectTo: '/login' }
];
