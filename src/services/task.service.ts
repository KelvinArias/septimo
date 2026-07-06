import { getAppCollections, withoutMongoId } from "@/lib/mongodb";
import type { Task } from "@/app/tasks/types/task";

export async function getTasks(): Promise<Task[]> {
  const collections = await getAppCollections();

  return await collections.tasks
    .find({}, { projection: { _id: 0 } })
    .sort({ createdAt: -1 })
    .toArray();
}

export async function createTask(task: Task) {
  const collections = await getAppCollections();

  await collections.tasks.insertOne(task);

  return task;
}

export async function updateTask(id: string, task: Task) {
  const collections = await getAppCollections();

  await collections.tasks.updateOne(
    { id },
    { $set: withoutMongoId(task) },
    { upsert: true },
  );

  return task;
}

export async function deleteTask(id: string) {
  const collections = await getAppCollections();

  await collections.tasks.deleteOne({ id });

  return { deleted: true };
}
