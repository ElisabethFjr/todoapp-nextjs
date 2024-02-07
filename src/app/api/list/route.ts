import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Task, List } from "@/@types";

// GET /api/list All Lists with Tasks
export async function GET() {
  try {
    const lists = await prisma.list.findMany({
      include: {
        tasks: true, // Include tasks associated with the list
      },
    });
    return NextResponse.json(lists);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Oops, an error occurs, please try again later." },
      { status: 500 }
    );
  }
}

// POST /api/list Create List with Tasks
export async function POST(req: NextRequest) {
  const body = await req.json();
  try {
    const { title, color, tasks } = body;

    // Check if color and tasks are provided in the request body
    if (!title || !color || !tasks) {
      return NextResponse.json(
        { message: "Required fields." },
        { status: 400 }
      );
    }

    const newList = await prisma.list.create({
      data: {
        title,
        color,
        tasks: {
          createMany: {
            data: tasks.map((task: Task) => ({
              text: task.text,
              is_completed: task.is_completed || false,
            })),
          },
        },
      },
      include: { tasks: true },
    });

    return NextResponse.json(newList);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Oops, an error occurs, please try again later." },
      { status: 500 }
    );
  }
}
