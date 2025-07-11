import ToDosContainer from '../toDosContainer';
import { Recurso } from './recursos';
import { IRoute } from '/imports/modules/modulesTypings';

export const toDosRouterList: (IRoute | null)[] = [
	{
		path: '/toDos/:screenState/:toDosId',
		component: ToDosContainer,
		isProtected: true,
		resources: [Recurso.EXAMPLE_VIEW]
	},
	{
		path: '/toDos/:screenState',
		component: ToDosContainer,
		isProtected: true,
		resources: [Recurso.EXAMPLE_CREATE]
	},
	{
		path: '/toDos',
		component: ToDosContainer,
		isProtected: true,
		resources: [Recurso.EXAMPLE_VIEW]
	}
];
