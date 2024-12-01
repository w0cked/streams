const {
	express,
} = require('./src/utils/modules');

const app = express();

module.exports = {
	app: app
};

const {
	errorHandler,
	notFoundHandler,
	serverwideFunctions,
} = require('./src/utils/middleware');

const v1 = require('./src/routes/v1/spotify')

app.use('/v1/', v1);

app.use(notFoundHandler);

app.use(errorHandler);

app.listen(6969, () => {
	console.log(`Server running on port 6969`);
}); 