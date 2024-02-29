import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { Task, List } from "@/@types";

// GET "/api/list" All Lists with Tasks
export async function GET(req: NextRequest) {
  try {
    const lists = await prisma.list.findMany({
      include: {
        tasks: true, // Include tasks associated with the list
      },
    });
    // Sort Lists by position ASC
    const sortedLists = lists.sort((a, b) => a.position - b.position);
    return NextResponse.json(sortedLists);
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

// PATCH "/api/lists" Update Lists with new positions (Drag N Drop)
export async function PATCH(req: NextRequest) {
  try {
    const updatedLists = await req.json();

    // Update all list's position in the database
    await Promise.all(
      updatedLists.map(async (list: List) => {
        await prisma.list.update({
          where: { id: list.id },
          data: { position: list.position },
        });
      })
    );
    // Return the JSON updated List with new position
    return NextResponse.json(updatedLists, { status: 200 });
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

// POST "/api/list" Create List with Tasks
export async function POST(req: NextRequest) {
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

    // Checking validation schemas
    const validationResult = FormSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          message: "Le format de données n'est pas respecté.",
        },
        { status: 400 }
      );
    }

    // Check if title is provided in the request body
    if (!title) {
      return NextResponse.json(
        { message: "Veuillez renseigner un titre !" },
        { status: 400 }
      );
    }

    // Create the new List with Prisma
    const newList = await prisma.list.create({
      data: {
        title,
        tasks: {
          createMany: {
            data: tasks
              ? tasks.map((task: Task) => ({
                  text: task.text,
                  is_completed: task.is_completed || false,
                }))
              : [],
          },
        },
      },
      include: { tasks: true },
    });

    // Return the JSON new List
    return NextResponse.json(newList, { status: 201 });
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
