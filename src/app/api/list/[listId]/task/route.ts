import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET "/api/list/[listId]/task" All Tasks from a list
export async function GET(
  req: NextRequest,
  { params }: { params: { listId: string } }
) {
  const listId = params.listId;

  try {
    // Check the id on the URL
    if (!listId) {
      return NextResponse.json(
        { message: "ID non présent dans l'URL." },
        { status: 400 }
      );
    }
    // Find all tasks
    const tasks = await prisma.task.findMany({
      where: {
        listId: listId,
      },
    });
    return NextResponse.json(tasks);
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

// POST "/api/list/[listId]/task" Add a task in a list
export async function POST(
  req: NextRequest,
  { params }: { params: { listId: string } }
) {
  const listId = params.listId;
  try {
    const body = await req.json();
    const { text, is_completed } = body;
    // Check if the list ID is present in the URL
    if (!listId) {
      return NextResponse.json(
        { message: "ID non présent dans l'URL." },
        { status: 400 }
      );
    }
    // Create the new Task in the List with Prisma
    const newTask = await prisma.task.create({
      data: {
        text,
        is_completed,
        listId: listId,
      },
    });
    // Return the new Task
    return NextResponse.json(newTask, { status: 201 });
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
