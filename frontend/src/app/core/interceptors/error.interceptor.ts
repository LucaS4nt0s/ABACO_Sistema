import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { NotificationService } from '../services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notifications = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if ([401, 403, 409].includes(error.status)) {
        notifications.error(error.error?.detail || error.message || 'Erro ao processar a requisição.');
      }

      return throwError(() => error);
    })
  );
};