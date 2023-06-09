
var CryptoJS = require("crypto-js");

// // Encrypt
// var ciphertext = CryptoJS.AES.encrypt('my message', 'secret key 123').toString();
// console.log(ciphertext)
// // Decrypt
// var bytes  = CryptoJS.AES.decrypt(ciphertext, 'secret key 123');
// var originalText = bytes.toString(CryptoJS.enc.Utf8);

// console.log(originalText); // 'my message'

function postUser(db1,db2,data){
    Object.entries(data).forEach(entry=>{
        const [key,value] = entry
        data[key] = CryptoJS.AES.encrypt(value, 'secret key 123').toString();
    })
    db1.insert(data).into('users').catch(err=>console.log(err))
    db2.insert(data).into('users').catch(error=>console.log(error))
}
function arrayEquals(a, b) {
    return Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === b.length &&
        a.every((val, index) => JSON.stringify(val) === JSON.stringify(b[index]));
}
async function getUser(db1,db2,query){
    let Data = {
        data:[],damaged:false
    }
    let data = await db1.select(query[0]).from('users').where(query[1]?query[1]:true).limit(query[2]?query[2]:20)
    let data2 = await db2.select(query[0]).from('users').where(query[1]?query[1]:true).limit(query[2]?query[2]:20)
    if(!arrayEquals(data,data2)){
        Data.damaged = true
    }
    data.map(data=>Object.entries(data).forEach(entry=>{
        const [key,value] = entry
        data[key] = CryptoJS.AES.decrypt(value, 'secret key 123').toString(CryptoJS.enc.Utf8);
    }))
    
    Data.data = data
    
    return Data
}
module.exports={postUser,getUser}