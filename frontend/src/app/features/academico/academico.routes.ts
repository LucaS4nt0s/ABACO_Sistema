import { Routes } from '@angular/router';

export const ACADEMICO_ROUTES: Routes = [
	{
		path: '',
		loadComponent: () => import('./pages/home/home').then(m => m.AcademicoHome)
	}
];