import expres from 'express';
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';
import { getAllCategories, getCategoryUpdate, getCatgory, getOneCategoryDelete, getcreateCategory } from '../controllers/categoryController.js';


const router  = expres.Router();

//route for creating category

router.post('/create-category',requireSignIn,isAdmin,getcreateCategory);


//route for updating category

router.put('/update-category/:id',requireSignIn,isAdmin,getCategoryUpdate);


//get every cateogaries

router.get('/allcategories',getAllCategories);

//get single category

router.get('/getcategory/:slug',getCatgory);

router.delete('/delete-category/:id',requireSignIn,isAdmin,getOneCategoryDelete);

export default router;