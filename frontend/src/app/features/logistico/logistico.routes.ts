import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const LOGISTICO_ROUTES: Routes = [
	{
		path: '',
		canActivate: [authGuard],
		loadComponent: () => import('./pages/home/home').then(m => m.LogisticoHome)
	},
	{
		path: 'estoque',
		canActivate: [authGuard],
		loadComponent: () => import('./pages/estoque-management/estoque-management').then(m => m.EstoqueManagementComponent)
	},
	{
		path: 'pedidos',
		canActivate: [authGuard],
		loadComponent: () => import('./pages/pedido-list/pedido-list').then(m => m.PedidoListComponent)
	},
	{
		path: 'pedidos/novo',
		canActivate: [authGuard],
		loadComponent: () => import('./pages/pedido-form/pedido-form').then(m => m.PedidoFormPageComponent)
	}
];
