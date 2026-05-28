import { Routes } from '@angular/router';

export const LOGISTICO_ROUTES: Routes = [
	{
		path: '',
		loadComponent: () => import('./pages/home/home').then(m => m.LogisticoHome)
	}
];