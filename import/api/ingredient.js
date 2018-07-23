import { Mongo } from 'meteor/mongo';
 
export const Ingredients = new Mongo.Collection('ingredients');

Ingredients.allow({
    insert: function (userId, doc) {
           return true;
        }
        ,
	remove: function (userId, doc) {
		return true;
	},
});

if (Meteor.isServer) {
    // This code only runs on the server
    Meteor.publish('ingredients', function tasksPublication() {
      return Ingredients.find();
    });

    // Meteor.methods({
	// 	search: function(query, options) {
	// 		options = options || {};

	// 		// guard against client-side DOS: hard limit to 50
	// 		if (options.limit) {
	// 			options.limit = Math.min(50, Math.abs(options.limit));
	// 		} else {
	// 			options.limit = 50;
	// 		}

	// 		// TODO fix regexp to support multiple tokens
	// 		var regex = new RegExp("^" + query);
	// 		return BigCollection.find({name: {$regex:  regex}}, options).fetch();
	// 	}
	// });

    
  
}
if(Meteor.isClient) {
    Meteor.subscribe("ingredients");
}

