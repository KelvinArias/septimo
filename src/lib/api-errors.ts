import { NextResponse } from "next/server";
import { MongoConfigurationError } from "./mongodb";

export class DuplicateInventoryNameError extends Error {
  constructor(name: string) {
    super(`An inventory item named "${name}" already exists.`);
    this.name = "DuplicateInventoryNameError";
  }
}

type ApiErrorBody = {
  error: string;
};

export function toApiErrorResponse(error: unknown) {
  if (error instanceof MongoConfigurationError) {
    return NextResponse.json<ApiErrorBody>({ error: error.message }, { status: 503 });
  }

  if (error instanceof DuplicateInventoryNameError) {
    return NextResponse.json({ error: error.message }, { status: 409 });
  }

  if (isMongoConnectionError(error)) {
    console.error(error);

    return NextResponse.json<ApiErrorBody>(
      {
        error:
          "Unable to connect to MongoDB. Check the selected URI, network access, and database credentials.",
      },
      { status: 503 },
    );
  }

  console.error(error);

  return NextResponse.json<ApiErrorBody>(
    { error: "The database request could not be completed." },
    { status: 500 },
  );
}

function isMongoConnectionError(error: unknown) {
  if (!(error instanceof Error)) {
    return false;
  }

  const networkErrorNames = [
    "MongoNetworkError",
    "MongoServerSelectionError",
    "MongoTopologyClosedError",
  ];
  const networkErrorMessages = ["ECONNREFUSED", "ENOTFOUND", "ETIMEOUT", "querySrv"];

  return (
    networkErrorNames.includes(error.name) ||
    networkErrorMessages.some((message) => error.message.includes(message))
  );
}
