-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BoardColumn" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "boardId" TEXT NOT NULL,
    CONSTRAINT "BoardColumn_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_BoardColumn" ("boardId", "id", "status", "title") SELECT "boardId", "id", "status", "title" FROM "BoardColumn";
DROP TABLE "BoardColumn";
ALTER TABLE "new_BoardColumn" RENAME TO "BoardColumn";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
