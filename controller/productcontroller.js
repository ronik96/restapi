import productmodel from '../model/productmodel.js';
import Joi from 'joi';
import multer from 'multer';


import fs from 'fs';
import customerrorhandler from '../service/customerrorhandler.js';
const storage = multer.diskStorage({
    destination: (req, file, callback) => callback(null, './uploads'),
    filename: (req, file, callback) => {

        callback(null, `${Date.now()}-${file.originalname}`)
    }
})
const handleMultipartfile = multer({
    storage, limits: { fileSize: 1000000 * 50 }
}).single('image')
const productController = {
    async store(req, res, next) {
        // multipart form data
        handleMultipartfile(req, res, async (err) => {
            if (err) {
                return next(customerrorhandler.serverError(err.message));
            }
            console.log(req.file)
            const filepath = req.file.path;
            const productSchema = Joi.object({
                name: Joi.string().required(),
                price: Joi.number().required(),
                size: Joi.string().required(),
            })
            const { error } = productSchema.validate(req.body);
            if (error) {
                // Validation Fail(Delete the upload image)
                fs.unlink(`${AppRoot}/${filepath}`, () => {
                    return next(customerrorhandler.serverError(err.message));
                });
                return next(error);
            }
            const { name, price, size } = req.body;
            let document;
            try {
                document = await productmodel.create({
                    name,
                    price,
                    size,
                    image: filepath
                });
            } catch (err) {
                return next(err);
            }
            res.json({ product_details: document });
        })
    },


    //update code


    async update(req, res, next) {
        // multipart form data
        handleMultipartfile(req, res, async (err) => {
            if (err) {
                return next(customerrorhandler.serverError(err.message));
            }
            console.log(req.file)
            let filepath;
            if (req.file) {
                filepath = req.file.path;
            }
            const productSchema = Joi.object({
                name: Joi.string().required(),
                price: Joi.number().required(),
                size: Joi.string().required(),
            })
            const { error } = productSchema.validate(req.body);
            if (error) {
                // Validation Fail(Delete the upload image)
                if (req.file) {
                    fs.unlink(`${AppRoot}/${filepath}`, () => {
                        return next(customerrorhandler.serverError(err.message));
                    });
                }
                return next(error);
            }
            const { name, price, size } = req.body;
            let document;
            try {
                document = await productmodel.findByIdAndUpdate({ _id: req.params.id }, {
                    name,
                    price,
                    size,
                    image: filepath
                });
            } catch (err) {
                return next(err);
            }
            res.json({ product_details: document });
        })
    },



    //delete code




    async delete(req, res, next) {
        const document = await productmodel.findByIdAndDelete({ _id: req.params.id })
        if (!document) {
            return next(new Error('nothing to delete...'))
        }

        const imagepath = document.image;
        fs.unlink(`${AppRoot}/${imagepath}`, () => {
            return next(customerrorhandler.serverError(err.message));
        });
        res.json(document);
    },
    async show(req, res, next) {
        const data = await productmodel.find();

        res.json(data)
    }



}
export default productController;