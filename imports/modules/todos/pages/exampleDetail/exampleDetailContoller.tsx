import React, { createContext, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { TodosModuleContext } from '../../todosContainer';
import { useTracker } from 'meteor/react-meteor-data';
import { todosApi } from '../../api/todosApi';
import { ITodos } from '../../api/todosSch';
import { ISchema } from '/imports/typings/ISchema';
import { IMeteorError } from '/imports/typings/BoilerplateDefaultTypings';


interface ITodosDetailContollerContext {
	closePage: () => void;
	document: ITodos;
	loading: boolean;
	schema: ISchema<ITodos>;
	onSubmit: (doc: ITodos) => void;
	changeToEdit: (id: string) => void;
}

export const TodosDetailControllerContext = createContext<ITodosDetailContollerContext>(
	{} as ITodosDetailContollerContext
);

const TodosDetailController = () => {
	const navigate = useNavigate();
	const { id, state } = useContext(TodosModuleContext);
	const { showNotification } = useContext(SysAppLayoutContext);

	const { document, loading } = useTracker(() => {
		const subHandle = !!id ? todosApi.subscribe('todosDetail', { _id: id }) : null;
		const document = id && subHandle?.ready() ? todosApi.findOne({ _id: id }) : {};
		return {
			document: (document as ITodos) ?? ({ _id: id } as ITodos),
			loading: !!subHandle && !subHandle?.ready()
		};
	}, [id]);

	const closePage = useCallback(() => {
		navigate(-1);
	}, []);
	const changeToEdit = useCallback((id: string) => {
		navigate(`/todos/edit/${id}`);
	}, []);

	const onSubmit = useCallback((doc: ITodos) => {
		const selectedAction = state === 'create' ? 'insert' : 'update';
		todosApi[selectedAction](doc, (e: IMeteorError) => {
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
		<TodosDetailControllerContext.Provider
			value={{
				closePage,
				document: { ...document, _id: id },
				loading,
				schema: todosApi.getSchema(),
				onSubmit,
				changeToEdit
			}}>
			{<TodosDetailView />}
		</TodosDetailControllerContext.Provider>
	);
};

export default TodosDetailController;
