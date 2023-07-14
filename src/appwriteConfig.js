import { Client, Databases, Account } from "appwrite";

export const PROJECT_ID = "64a690c6205686a607bd";
export const DATABASE_ID = "64a691de70a4cbc1243b";
export const COLLECTION_ID = "64a691f965394769f57c";
export const COLLECTION_ID2 = "64aa94d4c45c152b56d9";

export const API_KEY =
  "5365f54bf2239a707d967d01cf67f7cd1dbe2fb963015f76c89a10475d17b72c9966caefcdfa3f87d5b4c91bb2b087c921635f31c2a8503b58ba592bb8b53b496d135f9a4db71a865759936344eebb985041b530774a3c1eba75e7880eaabe70c6dd82b3710ab4052d998a556bcb8451bb2cfd31d94cca836388b20c29942a1a";

const client = new Client();

client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("64a690c6205686a607bd");

export const databases = new Databases(client);
export const account = new Account(client);
export default client;
