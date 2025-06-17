import React, { useCallback, useMemo } from 'react';
import TodoListListView from './TodoListListView';
import { nanoid } from 'nanoid';
import { useNavigate } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import { ISchema } from '/imports/typings/ISchema';
import { ITodoList } from '../../api/TodoListSch';
import { TodoListApi } from '../../api/TodoListApi';

interface IInitialConfig {
	sortProperties: { field: string; sortAscending: boolean };
	filter: Object;
	searchBy: string | null;
	viewComplexTable: boolean;
}

interface ITodoListListContollerContext {
	onAddButtonClick: () => void;
	onDeleteButtonClick: (row: any) => void;
	todoList: ITodoList[];
	schema: ISchema<any>;
	loading: boolean;
	onChangeTextField: (event: React.ChangeEvent<HTMLInputElement>) => void;
	onChangeCategory: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const TodoListListControllerContext = React.createContext<ITodoListListContollerContext>(
	{} as ITodoListListContollerContext
);

const initialConfig = {
	sortProperties: { field: 'createdat', sortAscending: true },
	filter: {},
	searchBy: null,
	viewComplexTable: false
};

const TodoListListController = () => {
	const [config, setConfig] = React.useState<IInitialConfig>(initialConfig);

	const { title, type, typeMulti } = TodoListApi.getSchema();
	const TodoListSchReduzido = { title, type, typeMulti, createdat: { type: Date, label: 'Criado em' } };
	const navigate = useNavigate();

	const { sortProperties, filter } = config;
	const sort = {
		[sortProperties.field]: sortProperties.sortAscending ? 1 : -1
	};

	const { loading, TodoLists } = useTracker(() => {
		const subHandle = TodoListApi.subscribe('TodoListList', filter, {
			sort
		});
		const TodoLists = subHandle?.ready() ? TodoListApi.find(filter, { sort }).fetch() : [];
		return {
			TodoLists,
			loading: !!subHandle && !subHandle.ready(),
			total: subHandle ? subHandle.total : TodoLists.length
		};
	}, [config]);

	const onAddButtonClick = useCallback(() => {
		const newDocumentId = nanoid();
		navigate(`/TodoList/create/${newDocumentId}`);
	}, []);

	const onDeleteButtonClick = useCallback((row: any) => {
		TodoListApi.remove(row);
	}, []);

	const onChangeTextField = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = event.target;
		const delayedSearch = setTimeout(() => {
			setConfig((prev) => ({
				...prev,
				filter: { ...prev.filter, title: { $regex: value.trim(), $options: 'i' } }
			}));
		}, 1000);
		return () => clearTimeout(delayedSearch);
	}, []);

	const onSelectedCategory = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = event.target;
		if (!value) {
			setConfig((prev) => ({
				...prev,
				filter: {
					...prev.filter,
					type: { $ne: null }
				}
			}));
			return;
		}
		setConfig((prev) => ({ ...prev, filter: { ...prev.filter, type: value } }));
	}, []);

	const providerValues: ITodoListListContollerContext = useMemo(
		() => ({
			onAddButtonClick,
			onDeleteButtonClick,
			todoList: TodoLists,
			schema: TodoListSchReduzido,
			loading,
			onChangeTextField,
			onChangeCategory: onSelectedCategory
		}),
		[TodoLists, loading]
	);

	return (
		<TodoListListControllerContext.Provider value={providerValues}>
			<TodoListListView />
		</TodoListListControllerContext.Provider>
	);
};

export default TodoListListController;
