import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { Task } from "@/@types";

// GET "/api/list" All Lists with Tasks
export async function GET() {
  try {
    const lists = await prisma.list.findMany({
      include: {
        tasks: true, // Include tasks associated with the list
      },
    });
    // console.log("Lists", lists);

    return NextResponse.json(lists);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Oops, an error occurs, please try again later." },
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
          message: "User didn't respect the expected format.",
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
    return NextResponse.json(newList);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Oops, an error occurs, please try again later." },
      { status: 500 }
    );
  }
}
