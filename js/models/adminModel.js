//------------------ ADMIN CLASS ----------------------
//----------------------------------------------------------
class Admin{
    id = ''
    name = ''
    email = ''
    password = ''
    priority = 3
    constructor(id, name, email, password, priority){
        this.id = id
        this.name = name
        this.email = email
        this.password = password
        this.priority = priority
    }
}

const admins = []

function addAdmin(id, name, email, password){
    const priority = 3
    const admin = new Admin (id, name, email, password, priority)
    admins.push(admin)
    return admin
}

export { addAdmin }