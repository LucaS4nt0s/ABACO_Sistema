import { Routes } from '@angular/router';
import { adminGuard, directorGuard } from '../../core/guards/role.guard';

export const ADMIN_ROUTES: Routes = [
	{
		path: '',
		canActivate: [adminGuard],
		children: [
			{ path: '', pathMatch: 'full', redirectTo: 'usuarios' },
			{
				path: 'home',
				loadComponent: () => import('./pages/home/home').then(m => m.AdminHome)
			},
			{
				path: 'usuarios',
				canActivate: [directorGuard],
				loadComponent: () =>
					import('../users/pages/users-management/users-management').then(m => m.UsersManagementComponent)
			},
			{
				path: 'alunos',
				loadComponent: () =>
					import('../students/pages/students-management/students-management').then(m => m.StudentsManagementComponent)
			}
		]
	}
];