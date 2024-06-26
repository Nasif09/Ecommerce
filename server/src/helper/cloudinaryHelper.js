const cloudinary = require("../config/cloudinary");

const publicIdWithoutExtensionFormUrl = async (imageUrl) => {
    const pathSegments = imageUrl.split('/');
    // Get the last segment of the URL path
    const lastSegment = pathSegments[pathSegments.length - 1];
    // Remove the extension (e.g., .jpg, .png) using a regex to handle different extensions
    const valueWithoutExtension = lastSegment.replace(/\.[^/.]+$/, '');
    return valueWithoutExtension;
};

const deleteFileFromCloudinary = async(folderName, publicId, modelName)=> {
    try{
        const {result} = await cloudinary.uploader.destroy(`${folderName}/${publicId}`);

            if(result != 'ok'){
                throw new Error(`${modelName} image is not deleted from cloudinary. Please try again.`);
            }
    }catch(error){
        throw error;
    }
}

module.exports = { publicIdWithoutExtensionFormUrl, deleteFileFromCloudinary};