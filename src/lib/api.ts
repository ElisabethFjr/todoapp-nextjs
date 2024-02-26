// Base URL
const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// GET All Lists
export async function getAllLists() {
  const response = await fetch(`${baseURL}/api/list`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store", // Désactiver la mise en cache
  });
  if (!response.ok) {
    throw new Error("Failed to fetch lists");
  }
  return response.json();
}

// ADD list
export async function addList(formDataJSON: string) {
  const response = await fetch("/api/list", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: formDataJSON,
  });
  if (!response.ok) {
    throw new Error("Failed to add list");
  }
}

// DELETE List
export async function deleteList(listId: string) {
  const response = await fetch(`${baseURL}/api/list/${listId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to delete list");
  }
}
