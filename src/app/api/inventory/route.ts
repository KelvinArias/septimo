import { NextResponse } from "next/server";
import { toApiErrorResponse } from "@/lib/api-errors";
import { createInventoryItem, getInventoryItems } from "@/services/inventory.service";
import type { InventoryItem } from "@/app/inventory/types/inventory";

export async function GET() {
  try {
    return NextResponse.json(await getInventoryItems());
  } catch (error) {
    return toApiErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const item = (await request.json()) as InventoryItem;
    return NextResponse.json(await createInventoryItem(item), { status: 201 });
  } catch (error) {
    return toApiErrorResponse(error);
  }
}
