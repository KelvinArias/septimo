import { NextResponse } from "next/server";
import { toApiErrorResponse } from "@/lib/api-errors";
import { createPreparationItem, getPreparationItems } from "@/services/preparation.service";
import type { PreparationItem } from "@/types";

export async function GET() {
  try {
    return NextResponse.json(await getPreparationItems());
  } catch (error) {
    return toApiErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const item = (await request.json()) as PreparationItem;
    return NextResponse.json(await createPreparationItem(item), { status: 201 });
  } catch (error) {
    return toApiErrorResponse(error);
  }
}
