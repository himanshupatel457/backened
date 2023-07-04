import slugify from "slugify";
import Category from "../models/categoryModel.js";

export const getcreateCategory = async (req, res, next) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(201).send({
                message: 'name required'
            });
        }
        const existingCategory = await Category.findOne({ name });

        if (existingCategory) {
            return res.status(200).send({
                success: true,
                message: 'Category already exists !'
            })
        }


        const category = await new Category({ name,slug: slugify(name)}).save();

        res.status(201).send({
            success: true,
            message: 'new category found',
            category
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: `something wrong in category controller`
        })
    }
}


export const getCategoryUpdate = async (req, res, next) => {
    try {
        const { name } = req.body;
        const { id } = req.params;
        const category = await Category.findByIdAndUpdate(id, { name, slug: slugify(name) }, { new: true });

        res.status(200).send({
            success: true,
            category,
            message: 'Category updated'
        })
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: ' Error in updating category : '
        });
    }
}




export const getAllCategories = async (req, res, next) => {
    try {
        const categories = await Category.find({});

        if(!categories){
            return res.status(200).send({
                message : 'No categories',
                success : true
            });
        }

        res.status(200).send({
            success : true,
            categories,
            message : ' Error in fetching all categories'
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success : false,
            error,
            message : 'Error in getting categories'
        })
    }
}



export const getCatgory = async(req,res,next) =>{

    try {
        const {slug} = req.params;
        const category = await Category.findOne({slug : slug});
        res.status(200).send({
            success :true,
            message : 'category single one fetched',
            category
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success :  false,
            message : ' Some error in getting a category',
            error,
        })
    }
}


export const getOneCategoryDelete = async(req,res,next)=>{

    try {
        const {id} = req.params;
        await Category.findByIdAndDelete(id);
        res.status(200).send({
            message : 'category deleted',
            success : true,
        })
    } catch (error) {
        console.log(error);

        res.status(500).send({
            error,
            success :false,
            message : 'deleting a catefory failed'
        })
    }
}