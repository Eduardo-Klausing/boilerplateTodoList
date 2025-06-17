// region Imports
import { ProductBase } from '../../../api/productBase';
import { TodoListSch, ITodoList } from './TodoListSch';

class TodoListApi extends ProductBase<ITodoList> {
	constructor() {
		super('TodoList', TodoListSch, {
			enableCallMethodObserver: true,
			enableSubscribeObserver: true
		});
	}
}

export const TodoListApi = new TodoListApi();
