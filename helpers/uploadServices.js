((uploadServices, cloudinary, fs, Response) => {

  cloudinary.config({ 
    cloud_name: 'occupapp', 
    api_key: '244724553472383', 
    api_secret: 'iB70jQB9zCb-VBSybiH0s9jkd_0'
  });

  uploadServices.uploadImage = async (file, folder) => {
    const res = new Response();
    res.success = false;
    if (file) {
      const options = { folder, use_filename: true };
      try {
        const result = await cloudinary.v2.uploader.upload(file.path, options);
        if (result) {
          const fileName = `${result.original_filename}.${result.original_extension ? result.original_extension : result.format}`;
          try {
            fs.unlinkSync(`./uploads/${fileName}`);
            res.success = true;
            res.output = result;
            return res;
          } catch (err) { res.message = err; return res; }
        } else return res;
      } catch (error) { res.message = error; return res; }
    } else return res;
  }

  uploadServices.deleteImage = async (publicId) => {
    const res = new Response();
    res.success = false;
    if (publicId) {
      try {
        const result = await cloudinary.v2.uploader.destroy(publicId);
        if (result) {
          res.success = true;
          res.output = result;
          return res;
        } else return res;
      } catch (error) { res.message = error; return res; }
    } else return res;
  }

})(
  module.exports,
  require('cloudinary'),
  require('fs'),
  require('../dtos/Response'),
);
