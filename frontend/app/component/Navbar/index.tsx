import React from "react";
import { Menubar } from "primereact/menubar";
import { Image } from "primereact/image";
import styles from "./styles.module.css";
import { Button } from "primereact/button";
import { handleLogout } from "../../api/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Navbar() {
  const router = useRouter();
  const menuItems = [
    {
      label: "Home",
      icon: "pi pi-fw pi-home",
      url: "/home",
    },
    {
      label: "Expenses",
      icon: "pi pi-fw pi-money-bill",
      url: "/expense",
    },
    {
      label: "Expense Categories",
      icon: "pi pi-fw pi-list",
      url: "/expenseCategory",
    },
    {
      label: "Reports",
      icon: "pi pi-fw pi-chart-bar",
      url: "/dashboard",
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

  const menu = (
    <div className="p-mr-4">
      {menuItems.map((menuItem) => (
        <Link
          key={menuItem.label}
          href={menuItem.url}
          className={styles.navLink}
        >
          <p className={`${menuItem.icon} menuIcon`} />
          {" " + menuItem.label}
        </Link>
      ))}
      <Button data-testid="logoutButton" onClick={() => handleLogout(router)}>
        Logout
      </Button>
    </div>
  );

  return (
    <div data-testid="navbar">
      <Menubar
        start={logo}
        hidden={true}
        end={menu}
        className={styles.menubar}
      />
    </div>
  );
}
