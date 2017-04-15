import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Tasks = new Mongo.Collection('tasks');

if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish tasks that are public or belong to the current user
  Meteor.publish('tasks', function tasksPublication() {
    return Tasks.find({
      $or: [
        { senderId: this.userId },
        { receiverId: this.userId },
      ],
    });
  });

Meteor.methods({
  'tasks.insert'(text) {
    check(text, String);

    // Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
    if(Meteor.userId() == '3DKjW7hzpekG4Zwg2')
    {
      Tasks.insert({
        text,
        createdAt: new Date(),
        owner: Meteor.userId(),
        username: Meteor.user().username,
        private: true,
        senderId: '3DKjW7hzpekG4Zwg2',
        receiverId: 'jXNfHyhRxPtLHz2hD'
      });
    }
    else if(Meteor.userId() == 'jXNfHyhRxPtLHz2hD')
    {
      Tasks.insert({
        text,
        createdAt: new Date(),
        owner: Meteor.userId(),
        username: Meteor.user().username,
        private: true,
        senderId: 'jXNfHyhRxPtLHz2hD',
        receiverId: '3DKjW7hzpekG4Zwg2'
      });
    }
  },
  'tasks.remove'(taskId) {
    check(taskId, String);

    const task = Tasks.findOne(taskId);

    if (task.private && task.owner !== Meteor.userId()) {
      // If the task is private, make sure only the owner can delete it
      throw new Meteor.Error('not-authorized');
    }

    Tasks.remove(taskId);
  },
  'tasks.setChecked'(taskId, setChecked) {
    check(taskId, String);
    check(setChecked, Boolean);

    const task = Tasks.findOne(taskId);

    if (task.private && task.owner !== Meteor.userId()) {
      // If the task is private, make sure only the owner can check it off
      throw new Meteor.Error('not-authorized');
    }

    Tasks.update(taskId, { $set: { checked: setChecked } });
  },
  'tasks.setPrivate'(taskId, setToPrivate) {
    check(taskId, String);
    check(setToPrivate, Boolean);

    const task = Tasks.findOne(taskId);

    // Make sure only the task owner can make a task private
    if (task.owner !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Tasks.update(taskId, { $set: { private: setToPrivate } });
  },
});

}
