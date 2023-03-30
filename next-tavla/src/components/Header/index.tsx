import Image from "next/image";
import TavlaLogo from "@/assets/logos/Tavla-white.svg";
import classes from "./styles.module.css";

function Header() {
  return (
    <div className={classes.header}>
      <img src={TavlaLogo} alt="Entur Tavla logo" height={35} />
      <p className="tag-text">Finn din rute på entur.no eller i Entur-appen</p>
    </div>
  );
}

export { Header };
