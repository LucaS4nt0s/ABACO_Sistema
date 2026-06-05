import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const LOGISTICO_ROUTES: Routes = [
	{
		path: '',
		canActivate: [authGuard],
		loadComponent: () => import('./pages/home/home').then(m => m.LogisticoHome)
	}
];