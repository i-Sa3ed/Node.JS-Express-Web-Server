const Employee = require('../model/Employee');

const getAllEmployees = async (req, res) => {
    const employees = await Employee.find();
    //^ `find` get's list of documents that match the ``filter``
    if (!employees) return res.status(204).json({'message': 'No employees found.'});
    res.json(employees);
}

const addNewEmployee = async (req, res) => {
    if (!req?.body?.name || !req?.body?.age)        
        return res.status(400).json({ 'message': 'Bad Request: both Name and Age are required.'});

    try {
        const addedEmp = await Employee.create({
            name: req.body.name,
            age: req.body.age
        });

        res.status(201).json(addedEmp);
    } catch (err) {
        console.error(err);
    }
}

const updateEmployee = async (req, res) => {
    if (!req?.body?.id)
        return res.status(400).json({'message': 'ID parameter is required.'});

    const toUpdateEmp = await Employee.findOne( {_id: req.body.id} ).exec(); //^ `_id` is the automatic id from mongoose
    if (!toUpdateEmp) 
        return res.status(204).json({ 'message': `No ID matches this ${req.body.id}!`});

    if (req.body?.name) toUpdateEmp.name = req.body.name;
    if (req.body?.age) toUpdateEmp.age = req.body.age;

    const updatedEmp = await toUpdateEmp.save();    
    res.json(updatedEmp);
}

const deleteEmployee = async (req, res) => {
    if (!req?.body?.id)
        return res.status(400).json({'message': `Bad Request: Employee ID is required.`});

    const toDeleteEmp = await Employee.findOne({ _id: req.body.id }).exec();
    if (!toDeleteEmp) 
        return res.status(204).json({ 'message': `No Employee matches ${req.body.id}!`});

    const others = await Employee.deleteOne({ _id: req.body.id }); // Note: no need for `exec` here!
    res.json(others);
}

const getEmployee = async (req, res) => {
    if (!req?.params?.id)
        return res.status(400).json({'message': 'Employee ID parameter is required.'});

    const employee = await Employee.findOne({_id: req.params.id}).exec();
    if (!employee) 
        return res.status(204).json({ 'message': `No Employee matches ${req.params.id}!`});

    res.json(employee);
}

// export as an object
module.exports = {
    getAllEmployees, 
    addNewEmployee,
    updateEmployee, 
    deleteEmployee,
    getEmployee
}