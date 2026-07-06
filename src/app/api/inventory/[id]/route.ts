import { NextResponse } from "next/server";
import { toApiErrorResponse } from "@/lib/api-errors";
import {
  deleteInventoryItem,
  updateInventoryItem,
} from "@/services/inventory.service";
import type { InventoryItem } from "@/types";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const item = (await request.json()) as InventoryItem;
    return NextResponse.json(await updateInventoryItem(id, item));
  } catch (error) {
    return toApiErrorResponse(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    return NextResponse.json(await deleteInventoryItem(id));
  } catch (error) {
    return toApiErrorResponse(error);
  }
}
