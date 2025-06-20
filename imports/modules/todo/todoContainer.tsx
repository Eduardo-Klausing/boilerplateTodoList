import React from 'react';
import { IDefaultContainerProps } from '/imports/typings/BoilerplateDefaultTypings';
import { useParams } from 'react-router-dom';
import TodoListController from '/imports/modules/todo/pages/todoList/todoListController';
import TodoDetailController from '/imports/modules/todo/pages/todoDetail/todoDetailContoller';

export interface ITodoModuleContext {
	state?: string;
	id?: string;
}

export const TodoModuleContext = React.createContext<ITodoModuleContext>({});

export default (props: IDefaultContainerProps) => {
	let { screenState, todoId } = useParams();
	const state = screenState ?? props.screenState;
	const id = todoId ?? props.id;

	const validState = ['view', 'edit', 'create'];

	const renderPage = () => {
		if (!state || !validState.includes(state)) return <TodoListController />;
		return <TodoDetailController />;
	};

	const providerValue = {
		state,
		id
	};
	return <TodoModuleContext.Provider value={providerValue}>{renderPage()}</TodoModuleContext.Provider>;
};
