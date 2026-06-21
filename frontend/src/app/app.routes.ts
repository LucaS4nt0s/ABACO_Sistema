import { Routes } from '@angular/router';

export const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'login' },
	{
		path: 'login',
		loadComponent: () => import('./features/auth/pages/login/login').then(m => m.Login)
	},
	{
		path: 'register',
		loadComponent: () => import('./features/auth/pages/register/register').then(m => m.Register)
	},
	{
		path: 'forgot-password',
		loadComponent: () => import('./features/auth/pages/forgot-password/forgot-password').then(m => m.ForgotPassword)
	},
	{
		path: 'reset-password',
		loadComponent: () => import('./features/auth/pages/reset-password/reset-password').then(m => m.ResetPassword)
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
