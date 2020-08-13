var bodyParser = require('body-parser');

var urlencodedParser = bodyParser.urlencoded({extended: false});

var mongoose =  require('mongoose');

//connect to the database

const uri = "mongodb+srv://amu97:mongodb@9@todo.cvqkn.mongodb.net/<dbname>?retryWrites=true&w=majority"
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('Mongodb connected...')
  })
  .catch(err => console.log(err))


var todoSchema = new mongoose.Schema({
    item: String
});

var Todo = mongoose.model('Todo',todoSchema);

module.exports = function(app){
    app.get('/todo',function(req,res){
        //get data from mongodb and pass it to the view
        Todo.find({},function(err,data){
            if(err) throw err;
            res.render('todo',{todos: data});   
        });
    });

    app.post('/todo',urlencodedParser,function(req,res){
        //console.log(req);
        //get data from the view and add it to mongodb
        var newToDo = Todo(req.body).save(function(err,data){
            if(err) throw err;
            res.json(data);
        })
    });

    app.delete('/todo/:item',function(req,res){
        // delete the requested item from mongodb
        Todo.find({item: req.params.item.replace(/\-/g," ")}).remove(function(err,data){
            if(err) throw err;
            res.json(data);
        }); 
    });
}