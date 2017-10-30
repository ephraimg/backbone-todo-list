var Todo = Backbone.Model.extend({

  defaults: {
    completed: false
  },

  markComplete: function() {
    this.set('completed', true);
    console.log(this.get('completed'));
  }

})

//==========================================

var Todos = Backbone.Collection.extend({
  
  model: Todo

});

//==========================================

var AppView = Backbone.View.extend({
  
  el: '#app',

  collection: new Todos([{description: 'wash car'}, {description: 'feed cat'}]),

  render: function() {
    this.$el.html(this.template());
    new AddView({
      el: $('#add'),
      collection: this.collection
    }).render();

    new TodosView({
      el: $('#todos'),
      collection: this.collection
    }).render();

    new CompletedView({
      el: $('#completed'),
      collection: this.collection
    }).render();
  },

  template: _.template(`<div id='add'>
    </div>
    <hr/>
    <h4>To do</h4>
    <ul id='todos'>
    </ul>
    <hr/>
    <h4>Completed</h4>
    <ul id='completed'>
    </ul>`)

});

//==========================================

var AddView = Backbone.View.extend({
  
  template: _.template(`<div>
    <input><button>Add</button>
    </div>`),

  events: {
    'click button': 'addTodo'
  },

  addTodo: function(e) {
    // console.log(this.collection);
    var newItem = new Todo({description: this.$el.find('input').val()})
    this.collection.add(newItem);
    this.collection.trigger('change');
        // console.log(this.collection);

    // console.log(this.$el.find('input').val());
  },

  render: function() {
    this.$el.html(this.template())
  }

});

//==========================================

var TodosView = Backbone.View.extend({
  
  initialize: function() {
    this.collection.on('change', this.render, this);
  },

  render: function() {
    this.$el.empty();
    this.collection.forEach(item => {
      if (!item.get('completed')) {
        this.renderTodo(item);
      }
    }, this);
  },

  renderTodo: function(todo) {
    // this.$el.html(this.template());
    var todoView = new TodoView({model: todo});
    this.$el.append(todoView.render());
  }

});

//==========================================

var TodoView = Backbone.View.extend({
  
  template: _.template(`<li><%- description %></li>`),

  events: {
    'click': 'handleClick'
  },

  handleClick: function() {
    this.model.markComplete();
  },

  render: function() {
    this.$el.html(this.template(this.model.attributes));
    return this.$el;
  }

});

//==========================================

var CompletedView = Backbone.View.extend({

  initialize: function() {
    this.collection.on('change', this.render, this);
  },

  render: function() {
    this.$el.empty();
    this.collection.forEach(item => {
      if (item.get('completed')) {
        this.renderTodo(item);
      }
    }, this);
  },

  renderTodo: function(todo) {
    // this.$el.html(this.template());
    this.$el.css({'text-decoration': 'line-through'});
    var todoView = new TodoView({model: todo});
    this.$el.append(todoView.render());
  }  

});
