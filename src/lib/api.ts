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
    throw new Error(
      "Une erreur est survenue, les listes n'ont pas pu être recupérées."
    );
  }
  return response.json();
}

// GET A list
export async function getListById(listId: string) {
  const response = await fetch(`${baseURL}/api/list/${listId}`, {
    method: "GET",
    headers: headers,
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(
      "Une erreur est survenue, la liste n'a pas pu être récupérée."
    );
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
export async function updateList(listId: string, formDataJSON: string) {
  const response = await fetch(`${baseURL}/api/list/${listId}`, {
    method: "PATCH",
    headers: headers,
    body: formDataJSON,
  });
  if (!response.ok) {
    throw new Error(
      "Une erreur est survenue, la liste n'a pas pu être modifiée."
    );
  }
}

// UPDATE Color List
export async function updateColorList(listId: string, colorJSON: string) {
  const response = await fetch(`${baseURL}/api/list/color/${listId}`, {
    method: "PATCH",
    headers: headers,
    body: colorJSON,
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

// GET All tasks
export async function getAllTasks(listId: string) {
  const response = await fetch(`${baseURL}/api/list/${listId}/task`, {
    method: "GET",
    headers: headers,
  });
  if (!response.ok) {
    throw new Error(
      "Une erreur est survenue, les tâches n'ont pas pu être recupérées."
    );
  }
  return response.json();
}

// ADD Task
export async function addTask(listId: string, formDataJSON: string) {
  const response = await fetch(`${baseURL}/api/list/${listId}/task`, {
    method: "POST",
    headers: headers,
    body: formDataJSON,
  });
  if (!response.ok) {
    throw new Error(
      "Une erreur est survenue, la tâche n'a pas pu être ajoutée."
    );
  }
}

// UPDATE Task
export async function updateTask(
  listId: string,
  taskId: string,
  formDataJSON: string
) {
  const response = await fetch(`${baseURL}/api/list/${listId}/task/${taskId}`, {
    method: "PATCH",
    headers: headers,
    body: formDataJSON,
  });
  if (!response.ok) {
    throw new Error(
      "Une erreur est survenue, la tâche n'a pas pu être modifiée."
    );
  }
}

// UPDATE status Task
export async function updateStatusTask(listId: string, taskId: string) {
  const response = await fetch(`${baseURL}/api/list/${listId}/task/${taskId}`, {
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
export async function deleteTask(listId: string, taskId: string) {
  const response = await fetch(`${baseURL}/api/list/${listId}/task/${taskId}`, {
    method: "DELETE",
    headers: headers,
  });
  if (!response.ok) {
    throw new Error(
      "Une erreur est survenue, la liste n'a pas pu être supprimée."
    );
  }
}
