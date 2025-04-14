-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Sprint" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'NOT_STARTED',
    "boardId" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    CONSTRAINT "Sprint_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Sprint" ("boardId", "endDate", "id", "startDate", "title") SELECT "boardId", "endDate", "id", "startDate", "title" FROM "Sprint";
DROP TABLE "Sprint";
ALTER TABLE "new_Sprint" RENAME TO "Sprint";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
