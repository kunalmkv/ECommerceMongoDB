const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/user');

const errorController = require('./controllers/error');


const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');


/*db.execute('SELECT * FROM products').then(result => {
    console.log(result[0]);

}).catch(err => {
    console.log(err);
})*/
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findById('641f2a099e0885bed80680b1').then(user => {
        req.user = user;
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


mongoose.connect(process.env.MONGODB_URI).then(result => {

    User.findOne().then(user => {
        if (!user) {
            const user = new User({
                name: 'Kunal Mishra',
                email: 'kunal@gmail.com',
                cart: {
                    items: []
                }
            });
            user.save();
        }
    })

    app.listen(3000);
    console.log('connected and listening at 3000')
}).catch(err => {
    console.log(err);
})