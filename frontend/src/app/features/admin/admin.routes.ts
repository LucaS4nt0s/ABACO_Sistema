import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { adminGuard, directorGuard } from '../../core/guards/role.guard';

export const ADMIN_ROUTES: Routes = [
	{
		path: '',
		canActivate: [authGuard],
		loadComponent: () => import('./components/admin-layout/admin-layout').then(m => m.AdminLayoutComponent),
		children: [
			{ path: '', pathMatch: 'full', redirectTo: 'home' },
			{
				path: 'home',
				canActivate: [adminGuard],
				loadComponent: () => import('./pages/home/home').then(m => m.AdminHome)
			},
			{
				path: 'usuarios',
				canActivate: [adminGuard, directorGuard],
				loadComponent: () =>
					import('../users/pages/users-management/users-management').then(m => m.UsersManagementComponent)
			},
			{
				path: 'alunos',
				canActivate: [adminGuard],
				loadComponent: () =>
					import('../students/pages/students-management/students-management').then(m => m.StudentsManagementComponent)
			},
			{
				path: 'cursos',
				canActivate: [adminGuard],
				loadComponent: () =>
					import('../courses/pages/courses-management/courses-management').then(m => m.CoursesManagementComponent)
			}
		]
	}
];