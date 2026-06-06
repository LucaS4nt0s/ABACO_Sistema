import { Routes } from '@angular/router';

export const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'login' },
	{
		path: 'login',
		loadComponent: () => import('./features/auth/pages/login/login').then(m => m.Login)
	},
	{
		path: 'academico',
		loadChildren: () => import('./features/academico/academico.routes').then(m => m.ACADEMICO_ROUTES)
	},
	{
		path: 'admin',
		loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES)
	},
	{ path: '**', redirectTo: 'login' }
];
