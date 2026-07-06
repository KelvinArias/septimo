import { NextResponse } from "next/server";
import { toApiErrorResponse } from "@/lib/api-errors";
import { createTask, getTasks } from "@/services/task.service";
import type { Task } from "@/app/tasks/types/task";

export async function GET() {
  try {
    return NextResponse.json(await getTasks());
  } catch (error) {
    return toApiErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const task = (await request.json()) as Task;
    return NextResponse.json(await createTask(task), { status: 201 });
  } catch (error) {
    return toApiErrorResponse(error);
  }
}
