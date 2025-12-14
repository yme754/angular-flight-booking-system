import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { RegisterComponent } from './register/register';
import { SearchFlightsComponent } from './search-flights/search-flights';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'search', component: SearchFlightsComponent },
  { path: '', redirectTo: 'search', pathMatch: 'full' }
];