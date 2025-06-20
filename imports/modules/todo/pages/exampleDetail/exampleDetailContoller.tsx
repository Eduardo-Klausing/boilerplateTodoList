import React, { createContext, useCallback, useContext } from 'react';
import TodoDetailView from './todoDetailView';
import { useNavigate } from 'react-router-dom';
import { TodoModuleContext } from '../../todoContainer';
import { useTracker } from 'meteor/react-meteor-data';
import { todoApi } from '../../api/todoApi';
import { ITodo } from '../../api/todoSch';
import { ISchema } from '/imports/typings/ISchema';
import { IMeteorError } from '/imports/typings/BoilerplateDefaultTypings';
import { SysAppLayoutContext } from '/imports/app/appLayout';

interface ITodoDetailContollerContext {
	closePage: () => void;
	document: ITodo;
	loading: boolean;
	schema: ISchema<ITodo>;
	onSubmit: (doc: ITodo) => void;
	changeToEdit: (id: string) => void;
}

export const TodoDetailControllerContext = createContext<ITodoDetailContollerContext>(
	{} as ITodoDetailContollerContext
);

const TodoDetailController = () => {
	const navigate = useNavigate();
	const { id, state } = useContext(TodoModuleContext);
	const { showNotification } = useContext(SysAppLayoutContext);

	const { document, loading } = useTracker(() => {
		const subHandle = !!id ? todoApi.subscribe('todoDetail', { _id: id }) : null;
		const document = id && subHandle?.ready() ? todoApi.findOne({ _id: id }) : {};
		return {
			document: (document as ITodo) ?? ({ _id: id } as ITodo),
			loading: !!subHandle && !subHandle?.ready()
		};
	}, [id]);

	const closePage = useCallback(() => {
		navigate(-1);
	}, []);
	const changeToEdit = useCallback((id: string) => {
		navigate(`/todo/edit/${id}`);
	}, []);

	const onSubmit = useCallback((doc: ITodo) => {
		const selectedAction = state === 'create' ? 'insert' : 'update';
		todoApi[selectedAction](doc, (e: IMeteorError) => {
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
		<TodoDetailControllerContext.Provider
			value={{
				closePage,
				document: { ...document, _id: id },
				loading,
				schema: todoApi.getSchema(),
				onSubmit,
				changeToEdit
			}}>
			{<TodoDetailView />}
		</TodoDetailControllerContext.Provider>
	);
};

export default TodoDetailController;
