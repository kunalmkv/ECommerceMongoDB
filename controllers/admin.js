const Product = require('../models/product');
const mongodb = require('mongodb');
const product = require('../models/product');

const ObjectId = mongodb.ObjectId;

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false

  });
};

/*exports.postAddProduct = (req, res, next) => {
  console.log(req);
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(null, title, imageUrl, description, price);
  product.save().then(() => {
    res.redirect('/');
  }).catch(err => console.log(err));

};*/
exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product({ title: title, price: price, description: description, imageUrl: imageUrl, userId: req.user });
  product
    .save()
    .then(result => {
      console.log('Created Product');
      res.redirect('/admin/products');
    }).catch(err => {
      console.log(err);
    })
}

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;

  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    //req.user.getProducts({ where: { id: prodId } })
    // Product.findByPk(prodId)
    .then(product => {
      //const product = products[0];
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/add-product',
        editing: editMode,
        product: product
      });
    }).catch(err => console.log(err))
};
exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;

  Product.findById(prodId)
    .then(product => {
      product.title = updatedTitle;
      product.price = updatedPrice,
        product.description = updatedDesc,
        product.imageUrl = updatedImageUrl;

      return product.save();
    }).then(result => {
      console.log('Product Updated!!');
      res.redirect('/admin/products');

    })
    .catch(err => console.log(err))

};

/*exports.getProducts = (req, res, next) => {
  Product.findAll().then(products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  }).catch(err => console.log(err));
};*/
exports.getProducts = (req, res, next) => {
  Product.find()
    // .select('title price -_id')
    // .populate('userId', 'name')
    .then(products => {
      console.log(products)
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    }).catch(err => console.log(err));
};
// exports.getProducts = (req, res, next) => {
//   Product.findAll().then(products => {
//     res.json(products);
//   }).catch(err => console.log(err));
// };
/*exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.json({
      data: [{ id: 1, name: 'kunal mishra' }, { id: 2, name: 'paras mishra' }]
    })
  })
};*/
exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByIdAndRemove(prodId)
    .then(() => {
      console.log('Product Deleted!!');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err))
  // res.redirect('/admin/products');

}// done with code