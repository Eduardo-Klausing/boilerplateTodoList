// region Imports
import { Recurso } from '../config/recursos';
import { TodoListSch, ITodoList } from './TodoListSch';
import { userprofileServerApi } from '/imports/modules/userprofile/api/userProfileServerApi';
import { ProductServerBase } from '/imports/api/productServerBase';

// endregion

class TodoListServerApi extends ProductServerBase<ITodoList> {
	constructor() {
		super('TodoList', TodoListSch, {
			resources: Recurso
			// saveImageToDisk: true,
		});

		const self = this;

		this.addTransformedPublication(
			'TodoListList',
			(filter = {}) => {
				return this.defaultListCollectionPublication(filter, {
					projection: { title: 1, type: 1, typeMulti: 1, createdat: 1 }
				});
			},
			(doc: ITodoList & { nomeUsuario: string }) => {
				const userProfileDoc = userprofileServerApi.getCollectionInstance().findOne({ _id: doc.createdby });
				return { ...doc };
			}
		);

		this.addPublication('TodoListDetail', (filter = {}) => {
			return this.defaultDetailCollectionPublication(filter, {
				projection: {
					contacts: 1,
					title: 1,
					description: 1,
					type: 1,
					typeMulti: 1,
					date: 1,
					files: 1,
					chip: 1,
					statusRadio: 1,
					statusToggle: 1,
					slider: 1,
					check: 1,
					address: 1
				}
			});
		});

		this.addRestEndpoint(
			'view',
			(params, options) => {
				console.log('Params', params);
				console.log('options.headers', options.headers);
				return { status: 'ok' };
			},
			['post']
		);

		this.addRestEndpoint(
			'view/:TodoListId',
			(params, _options) => {
				console.log('Rest', params);
				if (params.TodoListId) {
					return self
						.defaultCollectionPublication(
							{
								_id: params.TodoListId
							},
							{}
						)
						.fetch();
				} else {
					return { ...params };
				}
			},
			['get']
		);
	}
}

export const TodoListServerApi = new TodoListServerApi();
