// Base URL
const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
const headers = {
  "Content-Type": "application/json",
};

// GET All Lists
export async function getAllLists() {
  const response = await fetch(`${baseURL}/api/list`, {
    method: "GET",
    headers: headers,
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error("Impossible de recupérer les listes.");
  }
  return response.json();
}

// ADD list
export async function addList(formDataJSON: string) {
  const response = await fetch("/api/list", {
    method: "POST",
    headers: headers,
    body: formDataJSON,
  });
  if (!response.ok) {
    throw new Error(
      "Une erreur est survenue, la liste n'a pas pu être ajoutée."
    );
  }
}

// UPDATE List
export async function editList(listId: string) {
  const response = await fetch(`${baseURL}/api/list/${listId}`, {
    method: "PATCH",
    headers: headers,
  });
  if (!response.ok) {
    throw new Error(
      "Une erreur est survenue, la liste n'a pas pu être modifiée."
    );
  }
}

// UPDATE Color List
export async function editColorList(listId: string) {
  const response = await fetch(`${baseURL}/api/list/color/${listId}`, {
    method: "PATCH",
    headers: headers,
  });
  if (!response.ok) {
    throw new Error(
      "Une erreur est survenue, la couleur n'a pas pu être modifiée."
    );
  }
}

// DELETE List
export async function deleteList(listId: string) {
  const response = await fetch(`${baseURL}/api/list/${listId}`, {
    method: "DELETE",
    headers: headers,
  });
  if (!response.ok) {
    throw new Error(
      "Une erreur est survenue, la liste n'a pas pu être supprimée."
    );
  }
}

// UPDATE Task
export async function editTask(taskId: string) {
  const response = await fetch(`${baseURL}/api/task/${taskId}`, {
    method: "PATCH",
    headers: headers,
  });
  if (!response.ok) {
    throw new Error(
      "Une erreur est survenue, la tâche n'a pas pu être modifiée."
    );
  }
}

// DELETE Task
export async function deleteTask(taskId: string) {
  const response = await fetch(`${baseURL}/api/task/${taskId}`, {
    method: "DELETE",
    headers: headers,
  });
  if (!response.ok) {
    throw new Error(
      "Une erreur est survenue, la liste n'a pas pu être supprimée."
    );
  }
}
