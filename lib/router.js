Router.route('/', function () {
    this.render('main');
  });
Router.route('/register');
Router.route('/read');
Router.route('/druglist');
Router.route('/home');
Router.route('/drugdetail/:_id', function () {
    var params = this.params; // { _id: "5" }
    var id = params._id; // "5"
    this.render('detail');
  });
  Router.route('/ingredientlist');
  Router.route('/readingredient');
  Router.route('/product/:_id', function () {
    var params = this.params; // { _id: "5" }
    var id = params._id; // "5"
   
    this.render('product');

  });
  Router.route('/ingredetail/:_id', function () {
    var params = this.params; // { _id: "5" }
    var id = params._id; // "5"
    this.render('ingredientdetail');
  });   