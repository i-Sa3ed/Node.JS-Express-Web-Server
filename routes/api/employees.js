const express = require('express');
const router = express();
// to apply MVC pattern: 
const employeeController = require('../../controllers/employeeController')
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');

// we can use the url once and chain all methods to it:
router.route('/')
    .get(employeeController.getAllEmployees) // accessable for all roles
    .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), employeeController.addNewEmployee) // only for admin and editor
    .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), employeeController.updateEmployee) // only for admin and editor
    .delete(verifyRoles(ROLES_LIST.Admin), employeeController.deleteEmployee); // only admin can delete

router.route('/:id')
    .get(employeeController.getEmployee);

// Note that these method implementations are just to understand the concept of routing
// The actual api should be different

module.exports = router;