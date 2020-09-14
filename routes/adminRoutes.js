const express = require("express");
const AdminController = require("../controller/adminController");

const router = express.Router();

router.get("/admin/", AdminController.adminIdex);
router.get("/admin/add_product", AdminController.adminAddProduct);
router.get("/admin/product_details", AdminController.adminProductDetails);
router.get("/admin/product_list", AdminController.adminProductList);
router.post("/admin/add_product", AdminController.adminAddProductPost);
router.get("/admin/products_delete/:id", AdminController.adminProductDelete);
router.get("/admin/products_edit/:id", AdminController.adminProductEdit);
router.post('/admin/product_editConfirm/:id',AdminController.adminEditConfirm);


module.exports = router;