import "../imports/server/index";
import { Meteor } from 'meteor/meteor';

if (Meteor.isServer) {
  Meteor.publish('users.usernames', function() {
    if (this.userId) {
      return Meteor.users.find({}, { fields: { username: 1 } });
    }
    return this.ready();
  });
}
