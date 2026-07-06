// Set environment variables for the server
process.env.PORT = process.env.PORT || '3000';
process.env.MONGO_URI = process.env.MONGO_URI || 'mongodb://brknsgn123_db_user:<db_password>@ac-lpffjoo-shard-00-00.ky5o7ir.mongodb.net:27017,ac-lpffjoo-shard-00-01.ky5o7ir.mongodb.net:27017,ac-lpffjoo-shard-00-02.ky5o7ir.mongodb.net:27017/?ssl=true&replicaSet=atlas-9xm51e-shard-0&authSource=admin&appName=brknsgn';

module.exports = {
	PORT: Number(process.env.PORT),
	MONGO_URI: process.env.MONGO_URI,
};