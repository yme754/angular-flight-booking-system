import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { RegisterComponent } from './register/register';
import { SearchFlightsComponent } from './search-flights/search-flights';
import { BookFlightComponent } from './book-flight/book-flight';
import { HomeComponent } from './home/home';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'search', component: SearchFlightsComponent },
  { path: 'book-flights', component: BookFlightComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];