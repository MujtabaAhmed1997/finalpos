
function signupvalidtion(values){
    let error={};
    const email_pattern=/^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const password_pattern=/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/
    const name_pattern=/^[a-zA-Z][a-zA-Z0-9.'\-\s]*$/

    
      
    if(values.name==="")
    {
        error.name="Name shouldn't be empty";
    }else if(!name_pattern.test(values.name)){
        error.name="Please enter a valid name";
    }else{
        error.name="";
    }

    if(values.email==="")
    {
        error.email="Email shouldn't be empty";
    }else if(!email_pattern.test(values.email)){
        error.email="Please enter a valid email address";
    }else{
        error.email="";
    }
    
    if(values.password==="")
    {
        error.password="Password shouldn't be empty";
    }else if(!password_pattern.test(values.password)){
        error.password="Password must be at least 8 characters with one capital letter (A-Z), lowercase and a number";
    }else{
        error.password="";
    }
    return error;
    }

   
    module.exports = { signupvalidtion}