import { Dial } from "../common/interfaces/dial.interface";
import { MongoClient, Db } from "mongodb";

const uri = `mongodb+srv://marceloclp2:rafael40@discord-tzvfs.mongodb.net/test?retryWrites=true&w=majority`;

interface MongoOptions {
    readonly uri: string;

    readonly dbName: string;
}

export class MongoDial {
    static async registerAsync(options?: MongoOptions) {
        const client = await MongoClient.connect(uri);
        const db = client.db("discord");

        await MongoDial.test(db);
        await client.close();
    }

    static async test(db: Db) {
        const x = await db.collection("users").insertOne({
            name: "asdsadsa"
        });
        console.log(x.ops[0]);
    }
}