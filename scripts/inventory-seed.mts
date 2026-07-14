import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { closeMongoClient, getAppCollections, withoutMongoId } from "../src/lib/mongodb.ts";
import {
  GENERIC_BAR_INVENTORY_SEED_SOURCE,
  genericBarInventorySeed,
} from "../src/app/inventory/seeds/generic-bar-inventory.ts";

type InventorySeedCommand = "seed" | "reset" | "delete";

function parseEnvLine(line: string) {
  const trimmedLine = line.trim();

  if (!trimmedLine || trimmedLine.startsWith("#")) {
    return null;
  }

  const separatorIndex = trimmedLine.indexOf("=");

  if (separatorIndex === -1) {
    return null;
  }

  const key = trimmedLine.slice(0, separatorIndex).trim();
  const rawValue = trimmedLine.slice(separatorIndex + 1).trim();
  const value =
    (rawValue.startsWith("\"") && rawValue.endsWith("\"")) ||
    (rawValue.startsWith("'") && rawValue.endsWith("'"))
      ? rawValue.slice(1, -1)
      : rawValue;

  return { key, value };
}

function loadLocalEnvFiles() {
  const protectedKeys = new Set(Object.keys(process.env));

  for (const fileName of [".env", ".env.local"]) {
    const filePath = resolve(process.cwd(), fileName);

    if (!existsSync(filePath)) {
      continue;
    }

    for (const line of readFileSync(filePath, "utf8").split(/\r?\n/)) {
      const envPair = parseEnvLine(line);

      if (!envPair || protectedKeys.has(envPair.key)) {
        continue;
      }

      process.env[envPair.key] = envPair.value;
    }
  }
}

function getCommand(): InventorySeedCommand {
  const command = process.argv[2];

  if (command === "seed" || command === "reset" || command === "delete") {
    return command;
  }

  throw new Error(
    `Unknown inventory seed command "${command ?? ""}". Use seed, reset, or delete.`,
  );
}

async function deleteSeededInventory() {
  const collections = await getAppCollections();

  return collections.inventory.deleteMany({
    isSeed: true,
    seedSource: GENERIC_BAR_INVENTORY_SEED_SOURCE,
  });
}

async function deleteObsoleteSeededInventory() {
  const collections = await getAppCollections();
  const currentSeedIds = genericBarInventorySeed.map((item) => item.seedId);

  return collections.inventory.deleteMany({
    isSeed: true,
    seedSource: GENERIC_BAR_INVENTORY_SEED_SOURCE,
    seedId: { $nin: currentSeedIds },
  });
}

async function seedInventory() {
  const collections = await getAppCollections();
  const deleteResult = await deleteObsoleteSeededInventory();

  if (genericBarInventorySeed.length === 0) {
    return {
      deletedCount: deleteResult.deletedCount,
      upsertedCount: 0,
      modifiedCount: 0,
      matchedCount: 0,
    };
  }

  const result = await collections.inventory.bulkWrite(
    genericBarInventorySeed.map((item) => ({
      updateOne: {
        filter: {
          seedSource: GENERIC_BAR_INVENTORY_SEED_SOURCE,
          seedId: item.seedId,
        },
        update: {
          $set: withoutMongoId(item),
        },
        upsert: true,
      },
    })),
  );

  return {
    deletedCount: deleteResult.deletedCount,
    upsertedCount: result.upsertedCount,
    modifiedCount: result.modifiedCount,
    matchedCount: result.matchedCount,
  };
}

async function run() {
  loadLocalEnvFiles();

  const command = getCommand();

  if (command === "delete") {
    const result = await deleteSeededInventory();
    console.log(`Deleted ${result.deletedCount} seeded inventory items.`);
    return;
  }

  if (command === "reset") {
    const deleteResult = await deleteSeededInventory();
    const seedResult = await seedInventory();
    console.log(
      `Reset inventory seed: deleted ${deleteResult.deletedCount}, inserted ${seedResult.upsertedCount}, updated ${seedResult.modifiedCount}.`,
    );
    return;
  }

  const seedResult = await seedInventory();
  console.log(
    `Seeded inventory: deleted obsolete ${seedResult.deletedCount}, inserted ${seedResult.upsertedCount}, matched ${seedResult.matchedCount}, updated ${seedResult.modifiedCount}.`,
  );
}

run()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closeMongoClient();
  });
