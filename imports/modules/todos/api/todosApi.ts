// region Imports
import { ProductBase } from '../../../api/productBase';
import { todosSch, ITodos } from './todosSch';

class TodosApi extends ProductBase<ITodos> {
	constructor() {
		super('todos', todosSch, {
			enableCallMethodObserver: true,
			enableSubscribeObserver: true
		});
	}
}

export const todosApi = new TodosApi();
