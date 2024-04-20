import React from "react";
import { Menubar } from "primereact/menubar";
import { Image } from "primereact/image";
import styles from "./styles.module.css";

export default function Navbar() {
  const menuItems = [
    {
      label: "Home",
      icon: "pi pi-fw pi-home",
      url: "/home"
    },
    {
      label: "Expenses",
      icon: "pi pi-fw pi-money-bill",
      url: "/expense"
    },
    {
      label: "Expense Categories",
      icon: "pi pi-fw pi-list",
      url: "/expenseCategory"
    },
    {
      label: "Reports",
      icon: "pi pi-fw pi-chart-bar",
      url: "/dashboard"
    },
    {
      label: "Logout",
      icon: "pi pi-fw pi-sign-out",
      url: "/logout"
    },
  ];

  const logo = (
    <div className={styles.logo}>
      <Image
        src="/assets/logo-sahayak.png"
        alt="logo"
        height="70"
        width="210"
      />
    </div>
  );

  return (
    <div className={styles.card} data-testid="navbar">
      <Menubar start={logo} model={menuItems} hidden={true}/>
    </div>
  );
}
