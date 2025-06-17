import React, { createContext, useCallback, useContext } from 'react';
import TodoListDetailView from './TodoListDetailView';
import { useNavigate } from 'react-router-dom';
import { TodoListModuleContext } from '../../TodoListContainer';
import { useTracker } from 'meteor/react-meteor-data';
import { TodoListApi } from '../../api/TodoListApi';
import { ITodoList } from '../../api/TodoListSch';
import { ISchema } from '/imports/typings/ISchema';
import { IMeteorError } from '/imports/typings/BoilerplateDefaultTypings';
import { SysAppLayoutContext } from '/imports/app/appLayout';

interface ITodoListDetailContollerContext {
	closePage: () => void;
	document: ITodoList;
	loading: boolean;
	schema: ISchema<ITodoList>;
	onSubmit: (doc: ITodoList) => void;
	changeToEdit: (id: string) => void;
}

export const TodoListDetailControllerContext = createContext<ITodoListDetailContollerContext>(
	{} as ITodoListDetailContollerContext
);

const TodoListDetailController = () => {
	const navigate = useNavigate();
	const { id, state } = useContext(TodoListModuleContext);
	const { showNotification } = useContext(SysAppLayoutContext);

	const { document, loading } = useTracker(() => {
		const subHandle = !!id ? TodoListApi.subscribe('TodoListDetail', { _id: id }) : null;
		const document = id && subHandle?.ready() ? TodoListApi.findOne({ _id: id }) : {};
		return {
			document: (document as ITodoList) ?? ({ _id: id } as ITodoList),
			loading: !!subHandle && !subHandle?.ready()
		};
	}, [id]);

	const closePage = useCallback(() => {
		navigate(-1);
	}, []);
	const changeToEdit = useCallback((id: string) => {
		navigate(`/TodoList/edit/${id}`);
	}, []);

	const onSubmit = useCallback((doc: ITodoList) => {
		const selectedAction = state === 'create' ? 'insert' : 'update';
		TodoListApi[selectedAction](doc, (e: IMeteorError) => {
			if (!e) {
				closePage();
				showNotification({
					type: 'success',
					title: 'Operação realizada!',
					message: `O exemplo foi ${selectedAction === 'update' ? 'atualizado' : 'cadastrado'} com sucesso!`
				});
			} else {
				showNotification({
					type: 'error',
					title: 'Operação não realizada!',
					message: `Erro ao realizar a operação: ${e.reason}`
				});
			}
		});
	}, []);

	return (
		<TodoListDetailControllerContext.Provider
			value={{
				closePage,
				document: { ...document, _id: id },
				loading,
				schema: TodoListApi.getSchema(),
				onSubmit,
				changeToEdit
			}}>
			{<TodoListDetailView />}
		</TodoListDetailControllerContext.Provider>
	);
};

export default TodoListDetailController;
