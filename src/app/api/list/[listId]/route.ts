import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

// PATCH "/api/list/[listId]" Update List
export async function PATCH(
  req: NextRequest,
  { params }: { params: { listId: string } }
) {
  const listId = params.listId;

  // Validation schema
  const FormSchema = z.object({
    title: z.string(),
    tasks: z
      .array(
        z.object({
          text: z.string(),
          is_completed: z.boolean(),
        })
      )
      .nullable(),
  });

  try {
    const body = await req.json();
    const { title, tasks } = body;

    // Check the id on the URL
    if (!listId) {
      return NextResponse.json(
        { message: "ID non présent dans l'URL." },
        { status: 400 }
      );
    }

    // Checking validation schemas
    const validationResult = FormSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          message: "User didn't respect the expected format.",
        },
        { status: 400 }
      );
    }

    // Update the list with Prisma
    // Update List title
    await prisma.list.update({
      where: {
        id: listId,
      },
      data: {
        title,
      },
    });
    // Update Tasks : checked, update text, delete task, add task
    const updatedList = await prisma.list.findUnique({
      where: {
        id: listId,
      },
      include: { tasks: true },
    });

    // Return the JSON updated List
    return NextResponse.json(updatedList);
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

// DELETE "/api/list/[listId]" Delete a list
export async function DELETE(
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
    // Delete the list with tasks
    await prisma.task.deleteMany({
      where: {
        listId: listId,
      },
    });
    await prisma.list.delete({
      where: {
        id: listId,
      },
    });
    return NextResponse.json({ message: "Liste supprimée." });
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
