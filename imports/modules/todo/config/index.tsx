import { todoRouterList } from './todoRouters';
import { todoMenuItemList } from './todoAppMenu';
import { IModuleHub } from '../../modulesTypings';

const Todo: IModuleHub = {
	pagesRouterList: todoRouterList,
	pagesMenuItemList: todoMenuItemList
};

export default Todo;
