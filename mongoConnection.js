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
      let connectionString = ''
      if (process.env.NODE_ENV === 'development') {
        connectionString = `mongodb://localhost:27017/${process.env.MONGO_DB}`;
      } else {
        connectionString =
          `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@occupapp-zuyzw.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`;
      }
      mongoose.connect(connectionString, options)
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

        