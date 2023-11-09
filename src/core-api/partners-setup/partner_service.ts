import USER from '../../db/schemas/UserSchema'

async function getPartnersByEmail(email:String){
    const partner = await USER.findOne({"email":email}).populate('partners').lean();
    return partner?.partners;
}

export {getPartnersByEmail};