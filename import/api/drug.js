import { Mongo } from 'meteor/mongo';

export const Drugs = new Mongo.Collection('drugs');

Drugs.allow({
	insert: function (userId, doc) {
		return true;
	},
	remove: function (userId, doc) {
		return true;
	},

});


if (Meteor.isServer) {
	// This code only runs on the server
	Meteor.publish('drugs', function tasksPublication() {
		return Drugs.find();
	});

	Meteor.methods({
		search: function (query, options) {
			console.log(query);
			options = options || {};

			// guard against client-side DOS: hard limit to 50
			if (options.limit) {
				options.limit = Math.min(50, Math.abs(options.limit));
			} else {
				options.limit = 50;
			}

			// TODO fix regexp to support multiple tokens
			var regex = new RegExp("^" + query);
			return Drugs.find({ name: { $regex: regex } }, options).fetch();
		}
	});

}

if (Meteor.isClient) {
	Meteor.subscribe("drugs");
}