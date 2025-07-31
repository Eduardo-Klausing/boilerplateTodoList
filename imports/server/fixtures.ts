import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import { userprofileServerApi } from '../modules/userprofile/api/userProfileServerApi';

async function createDefautUser() {
	// if (Meteor.isDevelopment && Meteor.users.find().count() === 0) {
	const count = await Meteor.users.find({}).countAsync();
		const usersToCreate = [
		{
			username: 'Administrador',
			email: 'admin@mrb.com',
			password: 'admin@mrb.com',
			roles: ['Administrador']
		},
		{
			username: 'Usuário 1',
			email: 'usuario1@mrb.com',
			password: 'usuario1@mrb.com',
			roles: ['Usuario']
		},
		{
			username: 'Usuário 2',
			email: 'usuario2@mrb.com',
			password: 'usuario2@mrb.com',
			roles: ['Usuario']
		},
	]

		for (const user of usersToCreate) {
			const existingUser = await Meteor.users.findOneAsync({ 'emails.address': user.email });

			if(!existingUser){
				const createdUserId = await Accounts.createUserAsync({
					username: user.username,
					email: user.email,
					password: user.password,
				});

				await Meteor.users.upsertAsync(
					{ _id: createdUserId },
					{
						$set: {
							'emails.0.verified': true,
							profile: {
								name: user.username,
								email: user.email,
								roles: user.roles
							}
						}
					}
				);

				await userprofileServerApi.getCollectionInstance().insertAsync({
					_id: createdUserId,
					username: user.username,
					email: user.email,
					roles: ['Administrador']
				});
			}
		}
}

// if the database is empty on server start, create some sample data.
Meteor.startup(async () => {
	console.log('fixtures Meteor.startup');
	// Add default admin account
	await createDefautUser();
});

