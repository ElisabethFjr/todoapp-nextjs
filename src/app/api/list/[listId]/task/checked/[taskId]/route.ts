import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

// PATCH "/api/list/[listId]/task/checked/[taskId]" Update Task Checked status"
export async function PATCH(
  req: NextRequest,
  { params }: { params: { listId: string; taskId: string } }
) {
  // Get list and task id from params
  const listId = params.listId;
  const taskId = params.taskId;

  // Validation schema
  const TaskStatusSchema = z.object({
    is_completed: z.boolean(),
  });

  try {
    const body = await req.json();
    const { is_completed } = body;

    // Checking validation schema
    const validationResult = TaskStatusSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          message: "Le format de données n'est pas respecté.",
        },
        { status: 400 }
      );
    }

    // Check if both listId and taskId are present
    if (!listId || !taskId) {
      return NextResponse.json(
        { message: "ID non présent dans l'URL." },
        { status: 400 }
      );
    }

    // Update the task's is_completed status
    await prisma.task.update({
      where: { id: taskId },
      data: { is_completed },
    });

    return NextResponse.json({ message: "Statut de la tâche mis à jour." });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message:
          "Oops, une erreur s'est produite. Veuillez réessayer plus tard.",
      },
      { status: 500 }
    );
  }
}
