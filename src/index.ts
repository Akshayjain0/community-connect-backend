import app from "./app";
import connectToDatabase from "./config/database";

const PORT = process.env.PORT || 3001;

const startServer = async () => {
	try {
		await connectToDatabase();

		app.listen(PORT, () => {
			console.log(`Server is running on port http://localhost:${PORT}`);
		});
	} catch (error) {
		console.log("Error starting the server", error);
		process.exit(1);
	}
};

startServer();

//fCHTWn8083hdSPkq
