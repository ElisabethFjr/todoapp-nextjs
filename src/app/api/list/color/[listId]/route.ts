import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// PATCH "/api/list/color/[listId]" Update Color List
export async function PATCH(
  req: NextRequest,
  { params }: { params: { listId: string } }
) {
  const listId = params.listId;
  try {
    const body = await req.json();
    const { color } = body;

    // Check if the list ID is present in the URL
    if (!listId) {
      return NextResponse.json(
        { message: "ID non présent dans l'URL." },
        { status: 400 }
      );
    }

    // Update list color
    const updatedListColor = await prisma.list.update({
      where: {
        id: listId,
      },
      data: {
        color: color,
      },
    });
    return NextResponse.json(updatedListColor, { status: 200 });
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
