import { Meteor } from 'meteor/meteor';
import {Drugs} from '../import/api/drug.js';
import { Ingredients } from '../import/api/ingredient.js';


/* npm install xlsx */
const XLSX = require('xlsx');

Meteor.methods({
	/* read the data and return the workbook object to the frontend */
	upload: (bstr, name) => { return XLSX.read(bstr, {type:'binary'}); },
	download: () => {
		/* this is the data we ultimately want to save */
		const data = [
			["a", "b", "c"],
			[ 1 ,  2 ,  3 ]
		];
		/* follow the README to see how to generate a workbook from the data */
		const ws = XLSX.utils.aoa_to_sheet(data);
		const wb = {SheetNames: ["Sheet1"], Sheets:{Sheet1:ws }};
		/* send workbook to client */
		return wb;
	}
});



Meteor.startup(() => {

  // code to run on server at startup
  // create an admin account if there are no accounts
  if (Meteor.users.find().count() === 0) {
    let userid = Accounts.createUser(Meteor.settings.defaultUserAccount);
    Roles.addUsersToRoles(userid, ["admin"]);    
  }
  
});
