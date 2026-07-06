import { MongoClient, ServerApiVersion } from "mongodb";
import type { PreparationItem, Task } from "@/types";

type MongoRuntimeConfig = {
  databaseName: string;
  environment: "development" | "production";
  uri: string;
};

export class MongoConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MongoConfigurationError";
  }
}

const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
};

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

function getMongoRuntimeConfig(): MongoRuntimeConfig {
  const environment = process.env.NODE_ENV === "production" ? "production" : "development";
  const uri =
    environment === "production"
      ? process.env.MONGODB_URI_PRODUCTION ?? process.env.MONGODB_URI
      : process.env.MONGODB_URI_DEVELOPMENT ?? process.env.MONGODB_URI;
  const databaseName =
    environment === "production"
      ? process.env.MONGODB_DB_PRODUCTION ?? process.env.MONGODB_DB ?? "septimo_pi"
      : process.env.MONGODB_DB_DEVELOPMENT ?? process.env.MONGODB_DB ?? "septimo_pi_dev";

  if (!uri) {
    throw new MongoConfigurationError(
      `MongoDB URI is not configured for ${environment}. Set ${environment === "production" ? "MONGODB_URI_PRODUCTION" : "MONGODB_URI_DEVELOPMENT"
      } or MONGODB_URI.`,
    );
  }

  return { databaseName, environment, uri };
}

export function getMongoClient() {
  const { uri } = getMongoRuntimeConfig();

  if (!clientPromise) {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }

  return clientPromise;
}

export async function getAppCollections() {
  const connectedClient = await getMongoClient();
  const { databaseName } = getMongoRuntimeConfig();
  const db = connectedClient.db(databaseName);

  return {
    preparations: db.collection<PreparationItem>("inventory"),
    tasks: db.collection<Task>("tasks"),
  };
}
