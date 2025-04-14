-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Task" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "priority" TEXT NOT NULL DEFAULT 'LOW',
    "creatorId" TEXT NOT NULL,
    "columnId" TEXT,
    "sectionId" TEXT,
    "assigneeId" TEXT,
    "sprintId" TEXT,
    "startDate" DATETIME,
    "endDate" DATETIME,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Task_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Task_columnId_fkey" FOREIGN KEY ("columnId") REFERENCES "BoardColumn" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Task_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Task_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Task_sprintId_fkey" FOREIGN KEY ("sprintId") REFERENCES "Sprint" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Task" ("approved", "assigneeId", "columnId", "creatorId", "description", "endDate", "id", "priority", "sectionId", "sprintId", "startDate", "title") SELECT "approved", "assigneeId", "columnId", "creatorId", "description", "endDate", "id", "priority", "sectionId", "sprintId", "startDate", "title" FROM "Task";
DROP TABLE "Task";
ALTER TABLE "new_Task" RENAME TO "Task";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
