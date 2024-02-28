import Link from "next/link";
import { getAllLists } from "@/lib/api";
import Lists from "@/components/lists/Lists";
import AddListForm from "@/components/modals/addListForm/AddListForm";
import { PlusCircle } from "react-bootstrap-icons";
import styles from "./page.module.scss";

interface HomeProps {
  searchParams: Record<string, string> | null | undefined;
}

async function Home({ searchParams }: HomeProps) {
  const showAddListForm = searchParams?.addlist;

  // Fetch all Lists
  const lists = await getAllLists();
  console.log("Home Page : Toutes les listes", lists);

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
