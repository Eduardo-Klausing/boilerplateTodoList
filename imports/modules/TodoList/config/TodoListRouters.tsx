import TodoListContainer from '../TodoListContainer';
import { Recurso } from './recursos';
import { IRoute } from '/imports/modules/modulesTypings';

export const TodoListRouterList: (IRoute | null)[] = [
	{
		path: '/TodoList/:screenState/:TodoListId',
		component: TodoListContainer,
		isProtected: true,
		resources: [Recurso.EXAMPLE_VIEW]
	},
	{
		path: '/TodoList/:screenState',
		component: TodoListContainer,
		isProtected: true,
		resources: [Recurso.EXAMPLE_CREATE]
	},
	{
		path: '/TodoList',
		component: TodoListContainer,
		isProtected: true,
		resources: [Recurso.EXAMPLE_VIEW]
	}
];
