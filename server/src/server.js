const app = require('./app');
const connectDataBase = require('./config/db');
const { serverPort } = require('./secrect');

app.listen(serverPort, async() => {
    console.log(`server running at http://localhost:${serverPort}`);
    await connectDataBase();
})