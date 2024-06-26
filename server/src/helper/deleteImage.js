const fs = require('fs/promises');


const deleteImage = async(imagePath) => {
    try{
        //console.log('delete image')
        await fs.access(imagePath);
        await fs.unlink(imagePath);
        console.log('image was deleted')
    }catch(error){
        console.error('Image doesnot exist');
        throw error;
    }
}

module.exports = {deleteImage};