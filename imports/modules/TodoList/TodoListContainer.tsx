import React from 'react';
import { IDefaultContainerProps } from '/imports/typings/BoilerplateDefaultTypings';
import { useParams } from 'react-router-dom';
import TodoListListController from '/imports/modules/TodoList/pages/TodoListList/TodoListListController';
import TodoListDetailController from '/imports/modules/TodoList/pages/TodoListDetail/TodoListDetailContoller';

export interface ITodoListModuleContext {
	state?: string;
	id?: string;
}

export const TodoListModuleContext = React.createContext<ITodoListModuleContext>({});

export default (props: IDefaultContainerProps) => {
	let { screenState, TodoListId } = useParams();
	const state = screenState ?? props.screenState;
	const id = TodoListId ?? props.id;

	const validState = ['view', 'edit', 'create'];

	const renderPage = () => {
		if (!state || !validState.includes(state)) return <TodoListListController />;
		return <TodoListDetailController />;
	};

	const providerValue = {
		state,
		id
	};
	return <TodoListModuleContext.Provider value={providerValue}>{renderPage()}</TodoListModuleContext.Provider>;
};
