import { Routes } from '@angular/router';
import { directorGuard } from '../../core/guards/role.guard';

export const ADMIN_ROUTES: Routes = [
	{
		path: '',
		canActivate: [directorGuard],
		children: [
			{ path: '', pathMatch: 'full', redirectTo: 'usuarios' },
			{
				path: 'home',
				loadComponent: () => import('./pages/home/home').then(m => m.AdminHome)
			},
			{
				path: 'usuarios',
				loadComponent: () =>
					import('../users/pages/users-management/users-management').then(m => m.UsersManagementComponent)
			}
		]
	}
];