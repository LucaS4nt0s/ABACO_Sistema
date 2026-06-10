import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { AcademicoLayoutComponent } from './components/academico-layout/academico-layout';

export const ACADEMICO_ROUTES: Routes = [
	{
		path: '',
		canActivate: [authGuard],
		component: AcademicoLayoutComponent,
		children: [
			{ path: '', pathMatch: 'full', loadComponent: () => import('./pages/home/home').then(m => m.AcademicoHome) },
			{ path: 'turmas', loadComponent: () => import('./pages/turmas/turmas').then(m => m.TurmasPage) },
			{ path: 'alunos', loadComponent: () => import('./pages/alunos/alunos').then(m => m.AlunosPage) },
			{ path: 'presencas', loadComponent: () => import('./pages/presencas/presencas').then(m => m.PresencasPage) },
			{ path: 'notas', loadComponent: () => import('./pages/notas/notas').then(m => m.NotasPage) },
		]
	}
];
