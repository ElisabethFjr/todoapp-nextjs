import Link from "next/link";
import Lists from "@/components/lists/Lists";
import AddListForm from "@/components/modals/addListForm/AddListForm";
import { PlusCircle } from "react-bootstrap-icons";
import styles from "./page.module.scss";

interface HomeProps {
  searchParams: Record<string, string> | null | undefined;
}

async function Home({ searchParams }: HomeProps) {
  const showAddListForm = searchParams?.addlist;

  const response = await fetch("http://localhost:3000/api/list", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const lists = await response.json();

  return (
    <>
      <div className={styles.container}>
        <Link className={styles.button} href={"/?addlist=true"}>
          <PlusCircle />
          Créer une liste
        </Link>
      </div>
      <Lists lists={lists} />
      {showAddListForm && <AddListForm />}
    </>
  );
}

export default Home;
