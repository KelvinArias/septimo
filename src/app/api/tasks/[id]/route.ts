import { NextResponse } from "next/server";
import { toApiErrorResponse } from "@/lib/api-errors";
import { deleteTask, updateTask } from "@/services/task.service";
import type { Task } from "@/types";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const task = (await request.json()) as Task;
    return NextResponse.json(await updateTask(id, task));
  } catch (error) {
    return toApiErrorResponse(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    return NextResponse.json(await deleteTask(id));
  } catch (error) {
    return toApiErrorResponse(error);
  }
}
