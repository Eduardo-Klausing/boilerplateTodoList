import React from 'react';
import { IAppMenu } from '/imports/modules/modulesTypings';
import SysIcon from '/imports/ui/components/sysIcon/sysIcon';

export const TodoListMenuItemList: (IAppMenu | null)[] = [
	{
		path: '/TodoList',
		name: 'Exemplo',
		icon: <SysIcon name={'dashboard'} />
	}
];
