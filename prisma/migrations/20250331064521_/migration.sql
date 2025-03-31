/*
  Warnings:

  - You are about to drop the `Permission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_BoardPermissions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_RolePermissions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `roleType` on the `Role` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Permission_action_entity_key";

-- DropIndex
DROP INDEX "_BoardPermissions_B_index";

-- DropIndex
DROP INDEX "_BoardPermissions_AB_unique";

-- DropIndex
DROP INDEX "_RolePermissions_B_index";

-- DropIndex
DROP INDEX "_RolePermissions_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Permission";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_BoardPermissions";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_RolePermissions";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Role" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT
);
INSERT INTO "new_Role" ("description", "id", "name") SELECT "description", "id", "name" FROM "Role";
DROP TABLE "Role";
ALTER TABLE "new_Role" RENAME TO "Role";
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
