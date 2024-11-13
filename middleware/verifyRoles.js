const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req?.roles)
            return res.sendStatus(401);

        const rolesArray = [...allowedRoles];
        
        // debug
        // console.log(rolesArray);
        // console.log(req.roles);

        const result = req.roles.map(role => rolesArray.includes(role)).find(val => val === true);
        /* Returns:
        - True if there's at least one role matches rolesArray
        - False otherwise
        */
        
        if (!result) return res.sendStatus(401);
        next();
    }
}

module.exports = verifyRoles;