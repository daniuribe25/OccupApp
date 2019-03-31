((uploadServices, cloudinary, fs) => {

  cloudinary.config({ 
    cloud_name: 'occupapp', 
    api_key: '244724553472383', 
    api_secret: 'iB70jQB9zCb-VBSybiH0s9jkd_0'
  });

  uploadServices.uploadProfileImage = (user, cb) => {
    const options = { folder: 'ProfileImages', use_filename: true };
    cloudinary.v2.uploader.upload(user.profileImage.path, options, (error, result) => {
       if (result) {
        const fileName = `${result.original_filename}.${result.original_extension ? result.original_extension : result.format}`;
        fs.unlink(`./uploads/${fileName}`, () => {
          cb(error, result);
        })
      }
    });
  }

})(
  module.exports,
  require('cloudinary'),
  require('fs'),
);
