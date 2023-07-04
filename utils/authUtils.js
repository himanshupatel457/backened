import bcrypt from "bcrypt";

export const hashPassword = async (password) =>{
    try{
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password,saltRounds);
        return hashedPassword;
    }
    catch(err){
        console.log(`Some Error in Hashing Password : ${err}`)
    }
};



export const comparePassword = async (password,hashedPassword)=>{
    const result = bcrypt.compare(password,hashedPassword);
    return result;
};

