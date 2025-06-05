-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Tournament" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "players" TEXT NOT NULL,
    "results" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tournamentName" TEXT NOT NULL DEFAULT 'Tournament',
    "creatorId" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_Tournament" ("date", "id", "players", "results", "tournamentName") SELECT "date", "id", "players", "results", "tournamentName" FROM "Tournament";
DROP TABLE "Tournament";
ALTER TABLE "new_Tournament" RENAME TO "Tournament";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
