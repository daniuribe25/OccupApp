((mongoConection, mongoose) => {

  mongoConection.connect = () => {
    const options = {
      reconnectTries: 30,
      reconnectInterval: 500,
      poolSize: 10,
      bufferMaxEntries: 0,
      useNewUrlParser: true,
    };
    const connectWithRetry = () => {
      mongoose.connect(`mongodb://localhost:27017/${process.env.MONGO_DB}`, options)
      .then(() => console.log(`${process.env.MONGO_DB} database is connected`))
      .catch(err => {
          console.log('MongoDB connection unsuccessful')
          console.log(err);
          setTimeout(connectWithRetry, 5000);
      }); 
    };

    connectWithRetry();
  }
})(
  module.exports,
  require('mongoose'),
)

        