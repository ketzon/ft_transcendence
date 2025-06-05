-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Game" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "player1Id" INTEGER,
    "player2Name" TEXT NOT NULL DEFAULT 'Player2schema',
    "player1Name" TEXT NOT NULL DEFAULT 'Player1schema',
    "score1" INTEGER NOT NULL,
    "score2" INTEGER NOT NULL,
    "totalMoves" INTEGER NOT NULL,
    "avgMoveTime" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Game_player1Id_fkey" FOREIGN KEY ("player1Id") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Game" ("avgMoveTime", "date", "duration", "id", "player1Id", "player2Name", "score1", "score2", "totalMoves") SELECT "avgMoveTime", "date", "duration", "id", "player1Id", "player2Name", "score1", "score2", "totalMoves" FROM "Game";
DROP TABLE "Game";
ALTER TABLE "new_Game" RENAME TO "Game";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
