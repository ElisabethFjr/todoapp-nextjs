import NoList from "./noList/NoList";
import List from "./list/List";
import styles from "./Lists.module.scss";

function Lists() {
  return (
    <div className={styles.container}>
      <List />
      {/* <NoList /> */}
    </div>
  );
}

export default Lists;
