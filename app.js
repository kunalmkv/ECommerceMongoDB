const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const User = require('./models/user')

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
    User.findById('6416db5e52ffdc80b19baddf').then(user => {
        req.user = new User(user.name, user.email, user.cart, user._id);
        next();
    }).catch(err => {
        console.log(err)
        next();
    });
})
app.use('/admin', adminRoutes);
app.use(shopRoutes);



app.use(errorController.get404);

//server starts from here. Above are middleawre functions that will be executed ionly after incoming requests


mongoConnect(() => {

    app.listen(3000)
});