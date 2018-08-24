import { Drugs } from '../import/api/drug.js';
import { Ingredients } from '../import/api/ingredient.js';
import { Template } from 'meteor/templating';

const XLSX = require('xlsx');
let sidenav;



Meteor.startup(function () {
  Meteor.AdminAccountsConfig = {
    adminAccountsCreateUserErrorCallback: function (error) {
    },
    adminAccountsCreateUserSuccessCallback: function (user) {
    }
  };
});

Template.nav.onRendered(function(){
  $('.sidenav').sidenav();
  sidenav = M.Sidenav.init($('.sidenav')[0]);
  $('.sidenav a').on('click',function(){
    sidenav.close();
  });
  $('[data-target=nav-mobile]').on('click',function(){
    if(sidenav.isOpen){
      sidenav.close();
    }else{
      sidenav.open();
    }
  });
});

Template.sideNav.onRendered(function () {
  // $('.sidenav').sidenav();
});

Template.sideNav.events({
  'click .sign-out'() {
    AccountsTemplates.logout();
    $('.sidenav').sidenav('close');

  }
});

Template.druglist.onRendered(function () {
  Meteor.subscribe('drugs');
})

Template.druglist.helpers({
  druglist() {

    return Drugs.find().fetch();
  },
  drugdelete() {
    Drugs.remove(this._id);
    M.toast({ html: this.Product_Name + " has been removed." });
  }
});
Template.druglist.events({

  "click .drugdelete": function (e, tmpl) {
    if (!confirm("Are you sure? This record will be removed permanently.")) {
      return false;
    }
    var x = Template.druglist.__helpers.get('drugdelete').call(this);

  }
});


Template.read.events({
  'change input'(evt, instance) {

    const file = evt.currentTarget.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
      const data = e.target.result;
      const name = file.name;

      Meteor.call('upload', data, name, function (err, wb) {
        if (err) console.error(err);
        else {
          let keys = ['Product_Name', 'Price', 'Amount', 'Active_ingredients', 'Description',
            'Special_caution', 'Contraindication'];

          var list = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 1 });
          for (var i = 1; i < list.length; i++) {
            var local = list[i].associate(keys);

            Drugs.insert(local);
          }
          M.toast({ html: 'File Uploaded Sucessfully' })
        }
      });
    };
    reader.readAsBinaryString(file);
  },
});

Array.prototype.associate = function (keys) {
  var result = {};
  this.forEach(function (el, i) {
    result[keys[i]] = el;
  });
  return result;
};
Template.home.onRendered(function () {
  Meteor.typeahead.inject();
});


Template.home.helpers({
  drug: function (query, sync, callback) {
    var regex = new RegExp("^" + query);

    callback(Ingredients.find({ Product_Name: { $regex: regex } }, { _id: 0, Product_Name: 1 }).fetch().map(function (v) {

      return v.Product_Name;
    }));

  },
  selected: function (event, suggestion, datasetName) {
    Router.go('/drugdetail/' + suggestion.value);
  },
  settings: function () {
    return {
      position: "bottom",
      limit: 10,
      rules: [
        {
          token: '',
          collection: Ingredients,
          field: "serchkey",
          template: Template.userPill,
          matchAll: true,
        }
      ]
    };
  }
});

Template.home.events({
  "autocompleteselect input": function (e, t, doc) {

    Router.go('/drugdetail/' + doc.Product_Name);
  }

});

Template.detail.onCreated(function () {
  this.drug = new ReactiveVar();
  this.drug2 = new ReactiveVar();
  this.drug.set([]);
  this.drug2.set([]);

})

Template.detail.onRendered(function () {
  Meteor.typeahead.inject();
  Meteor.subscribe('ingredients');
  var listdata = [];



});

druglist = [];
druglength = 100;
Template.detail.helpers({

  drug: function () {
    let list = Template.instance().drug.get();
    if (druglist.length == 0) {
      let localdata = Ingredients.findOne({ "Product_Name": Router.current().params._id });
      if (localdata) {
        druglist.push(localdata);
      }
    }
    druglength = 100 / druglist.length;
    return druglist;
  },
  drugadd: function () {
    return Ingredients.find().fetch().map(function (it) { return it.Product_Name; });
  },

  selected: function (event, suggestion, datasetName) {
    var list2 = Template.instance().drug.get();
    let localdata = Ingredients.findOne({ "Product_Name": suggestion.value });
    if (localdata) {
      druglist.push(localdata);
    }
    Template.instance().drug.set(druglist);

  },
  druglength: function () {
    return (100 / druglist.length) - 4;
  },
  iconconvert: function (data) {

    var html = '';
    if (data.includes('Pill')) {
      html += "<img src='/medical-drug-pill.png'>";
    }
    if (data.includes('Liquid')) {
      html += "<img src='/drop-silhouette.png'>";
    }

    return new Handlebars.SafeString(html);
  },
  settings: function () {
    return {
      position: "bottom",
      limit: 10,
      rules: [
        {
          token: '',
          collection: Ingredients,
          field: "serchkey",
          template: Template.userPill,
          matchAll: true,
        }
      ]
    };
  }


})

Template.detail.rendered = function(){
  $('.chip').chips();
};
Template.detail.events({
  "onChipDelete":function(e){

  },
  "click .chipclose": function (e) {

    var index = druglist.findIndex(o => o._id === e.currentTarget.getAttribute('dataattr'));

    druglist.splice(index, 1);
    Template.instance().drug.set(druglist);

  },
  "autocompleteselect input": function (e, t, doc) {

    var list2 = Template.instance().drug.get();
    let localdata = Ingredients.findOne({ "Product_Name": doc.Product_Name });
    if (localdata) {
      druglist.push(localdata);
    }
    Template.instance().drug.set(druglist);
    $('.input-xlarge').val('');
  }

});



Template.readingredient.events({
  'change input'(evt, instance) {
    /* "Browser file upload form element" from SheetJS README */
    const file = evt.currentTarget.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
      const data = e.target.result;
      const name = file.name;
      /* Meteor magic */
      Meteor.call('upload', data, name, function (err, wb) {
        if (err) console.error(err);
        else {
          /* do something here -- this just dumps an array of arrays to console */
          let keys = ['Product_Name', 'Classification', 'General_description', 'Upsides',
            'Downsides', 'Used_for', 'Dosage_forms', 'Side_Effects', 'Contraindication', 'Risk_and_Risk_Factors', 'Advise'];
          var list = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 1 });

          for (var i = 1; i < list.length; i++) {
            var local = list[i].associate(keys);
            var searchStr = local['Product_Name'];
            if (typeof local['Used_for'] != 'undefined') {
              searchStr += ' ' + local['Used_for'];
            }
            local['serchkey'] = searchStr;

            Ingredients.insert(local);

            ///Router.go('/ingredientlist');
          }
          M.toast({ html: 'File Uploaded Sucessfully' })
        }
      });
    };
    reader.readAsBinaryString(file);
  },
});

Template.ingredientlist.onRendered(function () {
  Meteor.subscribe('ingredients');
})

Template.ingredientlist.helpers({
  ingredientlist() {
    return Ingredients.find().fetch();
  },
  ingredientdelete() {
    Ingredients.remove(this._id);
    M.toast({ html: this.Product_Name + " has been removed." });
  }
});
Template.ingredientlist.helpers({
  completedelete(){
    Ingredients.remove({})
  }
})
Template.ingredientlist.events({
  "click .ingredientdelete": function (e, tmpl) {
    if (!confirm("Are you sure? This record will be removed permanently.")) {
      return false;
    }
    var x = Template.ingredientlist.__helpers.get('ingredientdelete').call(this);

    // Template.instance().drugdelete(this._id);
    // console.log(this,e,tmpl);
  }
});


Template.product.onRendered(function () {
  Meteor.subscribe('drugs');
})

Template.product.helpers({
  drug() {
    var regex = new RegExp(Router.current().params._id);
    var sort={};

    if(typeof (Router.current().params.query.sort_by)!= 'undefined'){
      if(Router.current().params.query.sort_by=='low'){
        sort= {Price: 1};
      }
      if(Router.current().params.query.sort_by=='high'){
        sort= {Price: -1};
      }


    }

    return Drugs.find({'Active_ingredients': { $regex: regex } },{sort:sort}).fetch();
  },
  ingre(){
    return Router.current().params._id;
  }

});



Template.ingredientdetail.onRendered(function () {
  Meteor.subscribe('ingredients');
})

Template.ingredientdetail.helpers({
  ingredientlist() {
    return Ingredients.findOne({ "_id": Router.current().params._id });
  },
})
