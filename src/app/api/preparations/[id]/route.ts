import { NextResponse } from "next/server";
import { toApiErrorResponse } from "@/lib/api-errors";
import {
  deletePreparationItem,
  updatePreparationItem,
} from "@/services/preparation.service";
import type { PreparationItem } from "@/app/preparation/types/preparation";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const item = (await request.json()) as PreparationItem;
    return NextResponse.json(await updatePreparationItem(id, item));
  } catch (error) {
    return toApiErrorResponse(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    return NextResponse.json(await deletePreparationItem(id));
  } catch (error) {
    return toApiErrorResponse(error);
  }
}
