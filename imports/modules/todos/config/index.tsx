import { todosRouterList } from './todosRouters';
import { todosMenuItemList } from './todosAppMenu';
import { IModuleHub } from '../../modulesTypings';

const Todos: IModuleHub = {
	pagesRouterList: todosRouterList,
	pagesMenuItemList: todosMenuItemList
};

export default Todos;
