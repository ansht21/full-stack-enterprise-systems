# College Full-Stack Projects

This repository contains two complete full-stack projects built during college, each in its own folder.

## Projects

### [Academic Grade Management System](./Academic%20Grade%20Management%20System/)
Source of truth: [`StudentResultMS/`](./StudentResultMS/)

A full-stack academic grade / student result management system.
- **Backend:** Node.js + Express (REST API)
- **Frontend:** Tailwind CSS based UI
- **Database:** SQL (`schema.sql`, `seed.sql`)

See [its README](./Academic%20Grade%20Management%20System/README.md).

### [Warehouse Inventory Management System](./Warehouse%20Inventory%20Management%20System/)
Source of truth: [`warehouse-inventory-management-system/`](./warehouse-inventory-management-system/)

A full-stack warehouse inventory management application.
- **Backend:** Java + Spring Boot (Maven, `pom.xml`)
- **Frontend:** React + Vite + Tailwind CSS

See [its README](./Warehouse%20Inventory%20Management%20System/README.md).

## Layout

```
.
├── Academic Grade Management System/    # ← grade management (Node.js + SQL)
├── Warehouse Inventory Management System/  # ← inventory (Spring Boot + React)
├── StudentResultMS/                     # original source for the grade project
├── warehouse-inventory-management-system/  # original source for the warehouse project
└── README.md                            # this file
```

The two top-level folders (`Academic Grade Management System/` and `Warehouse Inventory Management System/`) are the canonical, clean copies intended for showcase. The original source folders are kept alongside them.
