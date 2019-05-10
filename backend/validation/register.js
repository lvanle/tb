const Validator = require('validator');
const isEmpty=require('./is-empty');
module.exports = function validationRegisterInput(data){
    let errors= {};
    data.name = !isEmpty(data.name) ? data.name : '';
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';

    if(!Validator.isLength(data.name,{min:2,max:10})){
        errors.name ='名字的长度不能小于两位且不能大于十位';
    }
    if(Validator.isEmpty(data.name)){
        errors.name='名字不能为空';
    }
    if(!Validator.isEmail(data.email)){
        errors.email='邮箱不合法';
    }
    if(Validator.isEmpty(data.email)){
        errors.email='邮箱不能为空';
    }
    
    if(Validator.isEmpty(data.password)){
        errors.password='密码不能为空';
    }
    if(!Validator.isLength(data.password,{min:6,max:30})){
        errors.password ='名字的长度不能小于6位且不能大于30位';
    }
    return{
        errors,
        isValid:isEmpty(errors)
    };
};