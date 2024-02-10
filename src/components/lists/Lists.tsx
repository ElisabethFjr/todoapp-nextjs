import NoList from "./noList/NoList";
import List from "./list/List";
import styles from "./Lists.module.scss";
import { List as ListType } from "@/@types";

interface ListsProps {
  lists: ListType[];
}

function Lists({ lists }: ListsProps) {
  return (
    <div className={styles.container}>
      {/* Lists or Nolist */}
      {lists.length > 0 ? (
        <div className={styles.lists}>
          {lists.map((list: ListType) => (
            <List key={list.id} list={list} />
          ))}
        </div>
      ) : (
        <div className={styles.nolist}>
          <NoList />
        </div>
      )}
    </div>
  );
}

export default Lists;
