import { Client, Databases, Account } from "appwrite";

export const PROJECT_ID = "64a690c6205686a607bd";
export const DATABASE_ID = "64a691de70a4cbc1243b";
export const COLLECTION_ID = "64a691f965394769f57c";
export const COLLECTION_ID2 = "64aa94d4c45c152b56d9";

const client = new Client();

client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("64a690c6205686a607bd");

export const databases = new Databases(client);
export const account = new Account(client);
export default client;
