import * as React from "react";
import styles from "./BaseLayout.module.css";
import BasicHeader from "../component/header/Header";
import LeftSide from "../component/sider/Sider";
import Footer from "../component/footer/Footer";

function BaseLayout(props) {
  return (
    <div className={styles.main}>
      <div className={styles.top}>
        <BasicHeader />
      </div>
      <div className={styles.content}>
        <div className={styles.left}>
          <LeftSide />
        </div>
        <div className={styles.right}>{props.children}</div>
      </div>
      <div className={styles.bottom}>
        <Footer />
      </div>
    </div>
  );
}
export default BaseLayout;
