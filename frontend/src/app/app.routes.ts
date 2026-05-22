import { Routes } from '@angular/router';

export const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'login' },
	{
		path: 'login',
		loadComponent: () => import('./features/auth/pages/login/login').then(m => m.Login)
	},
	{
		path: 'admin',
		children: [
			{ path: '', pathMatch: 'full', redirectTo: 'alunos' },
			{
				path: 'alunos',
				loadComponent: () => import('./features/dashboard/pages/home/home').then(m => m.Home)
			},
			{
				path: 'dashboards',
				loadComponent: () => import('./features/dashboard/pages/home/home').then(m => m.Home)
			}
		]
	},
	{
		path: 'academico',
		children: [
			{ path: '', pathMatch: 'full', redirectTo: 'presenca' },
			{
				path: 'presenca',
				loadComponent: () => import('./features/dashboard/pages/home/home').then(m => m.Home)
			}
		]
	}
];
