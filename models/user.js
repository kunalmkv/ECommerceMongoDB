const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cart: {
        items: [{ productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true }, quantity: { type: Number, required: true } }]
    }
})

userSchema.methods.addToCart = function (product) {
    {
        const cartProductIndex = this.cart.items.findIndex(cp => {
            return cp.productId == product._id.toString();
        });
        let newQuantity = 1;
        const updatedCartItems = [...this.cart.items];
        if (cartProductIndex >= 0) {
            newQuantity = this.cart.items[cartProductIndex].quantity + 1;
            updatedCartItems[cartProductIndex].quantity = newQuantity
        }
        else {
            updatedCartItems.push({ productId: product._id, quantity: newQuantity })
        }

        const updatedCart = { items: updatedCartItems }
        // console.log('addto cart****', updatedCart);
        this.cart = updatedCart
        return this.save()
    }
}
userSchema.methods.removeFromCart = function (productId) {
    const updatedCartItems = this.cart.items.filter(item => {
        return item.productId.toString() !== productId.toString();
    });
    this.cart.items = updatedCartItems;
    return this.save();
};
userSchema.methods.clearCart = function () {
    this.cart = { items: [] };
    return this.save();
}
module.exports = mongoose.model('User', userSchema);

// const mongodb = require('mongodb');
// const getDB = require('../util/database').getDB;
// const ObjectId = mongodb.ObjectId;

// class User {
//     constructor(username, email, cart, id) {
//         this.name = username;
//         this.email = email;
//         this.cart = cart;  //{items: []}
//         this._id = id;
//     }

//     save() {
//         const db = getDB();
//         return db.collection('users').insertOne(this);
//     }

//     addToCart(product) {
//         const cartProductIndex = this.cart.items.findIndex(cp => {
//             return cp.productId == product._id.toString();
//         });
//         let newQuantity = 1;
//         const updatedCartItems = [...this.cart.items];
//         if (cartProductIndex >= 0) {
//             newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//             updatedCartItems[cartProductIndex].quantity = newQuantity
//         }
//         else {
//             updatedCartItems.push({ productId: new ObjectId(product._id), quantity: newQuantity })
//         }

//         const updatedCart = { items: updatedCartItems }
//         // console.log('addto cart****', updatedCart);
//         const db = getDB();
//         return db
//             .collection('users').updateOne({ _id: new ObjectId(this._id) }, { $set: { cart: updatedCart } });
//     }
//     getCart() {
//         const db = getDB();
//         const productIds = this.cart.items.map(i => {
//             return i.productId;
//         });
//         return db.collection('products')
//             .find({ _id: { $in: productIds } })
//             .toArray()
//             .then(products => {
//                 // console.log('****getcart**', products);
//                 return products.map(p => {
//                     return {
//                         ...p,
//                         quantity: this.cart.items.find(i => {
//                             return i.productId.toString() === p._id.toString();
//                         }).quantity
//                     };
//                 });
//             });
//     }
//     /*deleteItemFromCart(productId) {
//         const updatedCartItems = this.cart.items.filter(item => {
//             return item.productId.toString() !== productId.toString();
//         })

//         const db = getDB();
//         return db
//             .collection('users').updateOne({ _id: new ObjectId(this._id) }, { $set: { cart: { items: updatedCartItems } } });

//     }*/
//     deleteItemFromCart(productId) {
//         console.log('productId:', productId);

//         const updatedCartItems = this.cart.items.filter(item => {
//             return item.productId.toString() !== productId.toString();
//         });

//         console.log('updatedCartItems before:', this.cart.items);
//         console.log('updatedCartItems after:', updatedCartItems);

//         const updatedCart = { items: updatedCartItems };
//         console.log('updatedCart:', updatedCart);

//         const db = getDB();
//         return db
//             .collection('users')
//             .updateOne(
//                 { _id: new ObjectId(this._id) },
//                 { $set: { cart: updatedCart } }
//             );
//     }

//     addOrder() {

//         console.log('<<<<<<added order>>>>>>');
//         const db = getDB();
//         return this.getCart()
//             .then(products => {
//                 const order = {
//                     items: products,
//                     user: {
//                         _id: new ObjectId(this._id),
//                         name: this.name
//                     }
//                 };
//                 return db.collection('orders').insertOne(order)
//             })
//             .then(result => {
//                 this.cart = { items: [] };
//                 return db
//                     .collection('users')
//                     .updateOne(
//                         { _id: new ObjectId(this._id) },
//                         { $set: { cart: { items: [] } } }
//                     );
//             })
//             .catch(err => console.log(err));
//     }

//     getOrders() {
//         const db = getDB();
//         return db.collection('orders').find({ 'user._id': new ObjectId(this._id) }).toArray();
//     }
//     static findById(userId) {
//         const db = getDB();
//         return db.collection('users').findOne({ _id: new ObjectId(userId) }).then(user => {
//             console.log(user)
//             return user
//         }).catch(err => {
//             console.log(err)
//         })
//     }
// }


// /* const updatedCart = { items: [{ ...product, quantity: 1 }] }
//         const db = getDB();
//         return db
//             .collection('users').updateOne({ _id: new ObjectId(this._id) }, { $set: { cart: updatedCart } });
//  */

// module.exports = User;