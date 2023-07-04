import express from 'express'
import { deleteProduct, getASingleProduct, getAllProducts, getBrainTreeToken, getFilteredProducts, getProductBasedOnCategory, getProductBasedOnSearch, getProductCount, getProductCreated, getProductListPerPage, getProductPhoto, getProductUpdated, getSimilarProduct, paymentController } from '../controllers/productController.js';
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';
import formidable from 'express-formidable';


const router  = express.Router();


// routes to create product

router.post('/create-product',requireSignIn,isAdmin,formidable(),getProductCreated);

//update a product
router.put('/update-product/:productId',requireSignIn,isAdmin,formidable(),getProductUpdated);

//get pproduct

router.get('/getproducts',getAllProducts);
// get single produxt

router.get('/getaproduct/:slug',getASingleProduct);

//get product photo

router.get('/productphoto/:pid' , getProductPhoto)

//delete a product
router.delete('/productdelete/:productId',deleteProduct);


//filter router

router.post('/products-filters',getFilteredProducts);


//pagination

router.get('/product-count',getProductCount);

//products per page 

router.get('/product-list/:page',getProductListPerPage)

//search product 

router.get('/search/:keyword',getProductBasedOnSearch)

//similar product

router.get('/similar-products/:productId/:categoryId',getSimilarProduct);

//category wise product

router.get(`/product-category/:slug`,getProductBasedOnCategory);







//payment Route
//get token

router.get('/braintree/gettoken',getBrainTreeToken);

//verify

router.post('/braintree/payment',requireSignIn,paymentController)

export default router;