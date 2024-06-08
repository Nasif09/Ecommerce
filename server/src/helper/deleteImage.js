const fs = require('fs/promises');


const deleteImage = async(imagePath) => {
    try{
        console.log('delete image')
        await fs.access(imagePath);
        await fs.unlink(imagePath);
        console.log('user image was deleted')
    }catch(error){
        console.error('user image doesnot exist');
        throw error;
    }
}

module.exports = {deleteImage};