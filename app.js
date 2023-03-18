const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');


const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const mongoConnect = require('./util/database').mongoConnect

/*db.execute('SELECT * FROM products').then(result => {
    console.log(result[0]);

}).catch(err => {
    console.log(err);
})*/
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => { //req is not a normal request but a sequelised object having SQL properties
    // User.findByPk(1).then(user => {
    //     req.user = user;
    next();
    // }).catch(err => console.log(err));
})
app.use('/admin', adminRoutes);
app.use(shopRoutes);



app.use(errorController.get404);

//server starts from here. Above are middleawre functions that will be executed ionly after incoming requests


mongoConnect(() => {
    app.listen(3000)
});