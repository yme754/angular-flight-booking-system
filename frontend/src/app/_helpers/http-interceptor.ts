import { HttpInterceptorFn } from '@angular/common/http';
import { StorageService } from '../_services/storage';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const token = sessionStorage.getItem('auth-token');
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  return next(req);
};
