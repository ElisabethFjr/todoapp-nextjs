import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// DELETE "/api/list/[id]" Delete a list
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const listId = params.id;
  console.log(listId);

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
