
import fs from 'fs'
import Product from '../models/productModel.js';
import slugify from 'slugify';
import Category from '../models/categoryModel.js';
import braintree from 'braintree';
import Order from '../models/orderModel.js';

var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: "7r5b4djpqpkpd298",
    publicKey: "m42gwg8b7fc3jfpc",
    privateKey: "856ebf6ffbc9e3fe981037eb85d666dd",
});





export const getProductCreated = async (req, res, next) => {
    try {
        const { name, slug, description, price, category, quantity, shipping } = req.fields;
        const { photo } = req.files;


        //return if any one of them is missing
        switch (true) {
            case !name:
                return res.status(500).send({ error: ' Name is must ' })
            // case !slug:
            //     return res.status(500).send({ error: ' slug is must ' })
            case !description:
                return res.status(500).send({ error: ' description is must ' })
            case !price:
                return res.status(500).send({ error: ' price is must ' })
            case !category:
                return res.status(500).send({ error: ' category is must ' })
            case !quantity:
                return res.status(500).send({ error: ' quantity is must ' })
            case photo && photo > 1000000:
                return res.status(500).send({ error: ' photo is must and < than a mb ' })
        }

        const product = new Product({ ...req.fields, slug: slugify(name) })
        if (photo) {
            product.photo.data = fs.readFileSync(photo.path);
            product.photo.contentType = photo.type;
        }
        await product.save();

        res.status(201).send({
            success: true,
            message: ' product created successfully',
            product
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'some thing wrong with creating product'
        })
    }
}



export const getAllProducts = async (req, res, next) => {

    try {
        const products = await Product.find({}).populate('category').select("-photo").limit(12).sort({ createdAt: -1 });
        res.status(200).send({
            success: true,
            message: 'fetched all products ',
            count: products.length,
            products
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Failed in fetching all products',
            error: error.message,
        })
    }
}


export const getASingleProduct = async (req, res, next) => {
    try {

        const product = await Product.find({ slug: req.params.slug }).select("-photo").populate("category");
        res.status(200).send({
            success: true,
            message: 'product fetched',
            product,
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error while fetchiing a single product',
            error,

        })
    }
}



//get product photo 


export const getProductPhoto = async (req, res, next) => {

    try {
        const product = await Product.findById(req.params.pid).select("photo");

        if (product.photo.data) {
            res.set('Content-type', product.photo.contentType);
            res.status(200).send(product.photo.data)
        }

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: error.message,
        })
    }
}



//delete a product

export const deleteProduct = async (req, res, next) => {

    try {
        await Product.findByIdAndDelete(req.params.productId).select('-photo');
        res.status(200).send({
            success: true,
            message: 'product deleted succefully ',

        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: ' deletion of a product failed',
        })
    }

}


//update a product


export const getProductUpdated = async (req, res, next) => {
    try {
        const { name, slug, description, price, category, quantity } = req.fields;
        const { photo } = req.files;


        //return if any one of them is missing
        switch (true) {
            case !name:
                return res.status(500).send({ error: ' Name is must ' })
            // case !slug:
            //     return res.status(500).send({ error: ' slug is must ' })
            case !description:
                return res.status(500).send({ error: ' description is must ' })
            case !price:
                return res.status(500).send({ error: ' price is must ' })
            case !category:
                return res.status(500).send({ error: ' category is must ' })
            case !quantity:
                return res.status(500).send({ error: ' quantity is must ' })
            // case photo && photo > 1000000:
            //     return res.status(500).send({ error: ' photo is must and < than a mb ' })
        }

        const product = await Product.findByIdAndUpdate(req.params.productId, { ...req.fields, slug: slugify(name) }, { new: true })
        if (photo) {
            product.photo.data = fs.readFileSync(photo.path);
            product.photo.contentType = photo.type;
        }
        await product.save();

        res.status(201).send({
            success: true,
            message: ' product updated successfully',
            product
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'some thing wrong with updating product'
        })
    }
}



export const getFilteredProducts = async (req, res, next) => {

    try {
        const { selectedCategory, selectedPrice } = req.body;
        let query = {};
        if (selectedCategory.length > 0) query.category = selectedCategory;
        // console.log(typeof(selectedPrice));
        // if(selectedPrice==='All') console.log('YES');
        if (selectedPrice.length) query.price = { $gte: selectedPrice[0], $lte: selectedPrice[1] };

        const products = await Product.find(query);
        res.status(200).send({
            success: true,
            message: 'products filtered',
            products
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: error.message,
        })
    }
}




export const getProductCount = async (req, res, next) => {
    try {
        const totalCount = await Product.find({}).estimatedDocumentCount();
        res.status(200).send({
            success: true,
            message: 'ProductCount',
            totalCount
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: ' something wrong in product count ',
            error
        })
    }
}



export const getProductListPerPage = async (req, res, next) => {
    try {
        const perPage = 4;
        const page = req.params.page ? req.params.page : 1
        const products = await Product.find({}).select("-photo").skip((page - 1) * perPage).limit(perPage).sort({ createdAt: -1 });
        res.status(200).send({
            success: true,
            message: ' Product per page fetched',
            products
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'something wrong in  Productlsit per Page',
        })
    }
}


export const getProductBasedOnSearch = async (req, res, next) => {
    try {
        const { keyword } = req.params;
        console.log(keyword);
        const result = await Product.find({
            $or: [
                { name: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } }
            ]
        }).select('-photo');
        res.json(result);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: 'Product not found'
        })
    }
}



export const getSimilarProduct = async (req, res, next) => {
    try {
        const { productId, categoryId } = req.params;
        const products = await Product.find({
            category: categoryId,
            _id: { $ne: productId },

        }).select('-photo').limit(3).populate('category');
        res.status(200).send({
            success: true,
            message: 'similar products',
            products
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'similar product failed',
            error
        })
    }
}




export const getProductBasedOnCategory = async (req, res, next) => {
    try {
        const category = await Category.findOne({ slug: req.params.slug });
        const products = await Product.find({ category }).populate('category');

        res.status(200).send({
            success: true,
            message: 'products based on category are here',
            products,
            category
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'something wrong with product based on category route'
        })
    }
}










//payment gateway toke reciever

export const getBrainTreeToken = async(req, res, next) => {
    try {
        gateway.clientToken.generate({}, function (err, response) {
            if (err) {
                res.status(500).send(err);
            }
            else {
                res.send(response);
            }
        });
    } catch (error) {
        console.log(error)
    }
}


//payment 
export const paymentController = async (req, res, next) => {
    try {
        const { cart, nonce } = req.body;
        let total = 0;
        cart.map((i) => {
            total += i.price
        })
        let newTransaction = gateway.transaction.sale({
            amount: total,
            paymentMethodNonce: nonce,
            options: {
                submitForSettlement: true
            }
        },
        function (error, result) {
            if (result) {
                const order = new Order({
                    products: cart,
                    payment: result,
                    buyer: req.user._id
                }).save();
                res.json({
                    success: true,
                })
            }
            else {
                res.status(500).send(error);
            }
        }
    )
    } catch (error) {
        console.log(error);
    }
}




