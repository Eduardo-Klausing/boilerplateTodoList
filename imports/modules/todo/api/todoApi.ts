// region Imports
import { ProductBase } from '../../../api/productBase';
import { todoSch, ITodo } from './todoSch';

class TodoApi extends ProductBase<ITodo> {
	constructor() {
		super('todo', todoSch, {
			enableCallMethodObserver: true,
			enableSubscribeObserver: true
		});
	}
}

export const todoApi = new TodoApi();
