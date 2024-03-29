import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// DELETE "/api/list/[listId]/task/[taskId]" Delete Task from a List
export async function DELETE(
  req: NextRequest,
  { params }: { params: { listId: string; taskId: string } }
) {
  const listId = params.listId;
  const taskId = params.taskId;

  try {
    // Check if both listId and taskId are present
    if (!listId || !taskId) {
      return NextResponse.json(
        { message: "ID non présent dans l'URL." },
        { status: 400 }
      );
    }

    // Delete the task from the list
    await prisma.task.delete({
      where: {
        id: taskId,
      },
    });

    return NextResponse.json({ message: "Tâche supprimée." });
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
