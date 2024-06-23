// src/index.ts
import app from "./server";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import LocationsDAO from "./dao/locationsDAO";

dotenv.config();

const port = process.env.PORT || 8000;

MongoClient.connect(
    process.env.RESTLOCATIONS_DB_URI as string,
    {
        maxPoolSize: 50,
        wtimeoutMS: 2500,
    }
    )
    .catch(err => {
        console.error(err.stack);
        process.exit(1);
    })
    .then(async client => {
        await LocationsDAO.injectDB(client.db(process.env.RESTLOCATIONS_NS));
        app.listen(port, () => {
          console.log(`listening on port ${port}`);
        });
    });