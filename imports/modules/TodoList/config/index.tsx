import { TodoListRouterList } from './TodoListRouters';
import { TodoListMenuItemList } from './TodoListAppMenu';
import { IModuleHub } from '../../modulesTypings';

const TodoList: IModuleHub = {
	pagesRouterList: TodoListRouterList,
	pagesMenuItemList: TodoListMenuItemList
};

export default TodoList;
