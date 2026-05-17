import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export function errorInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  return next(req).pipe(
    catchError((err) => {
      console.error('HTTP error:', err);
      return throwError(() => err);
    }),
  );
}
