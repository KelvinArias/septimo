import { MongoClient, ServerApiVersion } from "mongodb";
import type { InventoryItem } from "@/app/inventory/types/inventory";
import type { PreparationItem } from "@/app/preparation/types/preparation";
import type { Task } from "@/app/tasks/types/task";

type MongoRuntimeConfig = {
  databaseName: string;
  environment: "development" | "production";
  uri: string;
};

type DocumentWithMongoId<T extends object> = T & {
  _id?: unknown;
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

export function withoutMongoId<T extends object>(document: DocumentWithMongoId<T>) {
  const documentWithoutMongoId = { ...document };
  delete documentWithoutMongoId._id;

  return documentWithoutMongoId;
}

export async function getAppCollections() {
  const connectedClient = await getMongoClient();
  const { databaseName } = getMongoRuntimeConfig();
  const db = connectedClient.db(databaseName);

  return {
    inventory: db.collection<InventoryItem>("raw_inventory"),
    preparations: db.collection<PreparationItem>("inventory"),
    tasks: db.collection<Task>("tasks"),
  };
}
