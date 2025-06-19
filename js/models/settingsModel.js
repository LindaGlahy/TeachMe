//------------------ STUDENTS SETTINGS CLASS ----------------------
//----------------------------------------------------------
class StudentSettings{
    changeImg = ''
    changeEmail = ''
    changePassword = ''
    changeEEcontact = ''
    changeIncapacity = ''
    changeLocality = ''
    changeDisciplines = ''
    constructor(changeImg, changeEmail, changePassword, changeEEcontact, changeIncapacity, changeLocality, changeDisciplines){
        this.changeImg = changeImg
        this.changeEmail = changeEmail
        this.changePassword = changePassword
        this.changeEEcontact = changeEEcontact
        this.changeIncapacity = changeIncapacity
        this.changeLocality = changeLocality
        this.changeDisciplines = changeDisciplines
    }
}

//------------------ TEACHER SETTINGS CLASS ----------------------
//----------------------------------------------------------
class TeacherSettings{
    changeImg = ''
    changeEmail = ''
    changePassword = ''
    changeContact = ''
    changeIncapacity = ''
    changeLocality = ''
    changeDisciplines = ''
    changeDiplomes = ''
    constructor(changeImg, changeEmail, changePassword, changeContact, changeIncapacity, changeLocality, changeDisciplines, changeDiplomes){
        this.changeImg = changeImg
        this.changeEmail = changeEmail
        this.changePassword = changePassword
        this.changeContact = changeContact
        this.changeIncapacity = changeIncapacity
        this.changeLocality = changeLocality
        this.changeDisciplines = changeDisciplines
        this.changeDiplomes = this.changeDiplomes
    }
}

//------------------ ADMIN SETTINGS CLASS ----------------------
//----------------------------------------------------------
class AdminSettings{
    changeImg = ''
    changeEmail = ''
    changePassword = ''
    changeUsers = ''
    changeEntities = ''
    changeFilters = ''
    constructor(changeImg, changeEmail, changePassword, changeUsers, changeEntities, changeFilters){
        this.changeImg = changeImg
        this.changeEmail = changeEmail
        this.changePassword = changePassword
        this.changeUsers = changeUsers
        this.changeEntities = changeEntities
        this.changeFilters = changeFilters
    }
}
