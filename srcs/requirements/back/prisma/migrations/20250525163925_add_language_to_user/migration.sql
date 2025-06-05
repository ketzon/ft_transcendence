-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "avatar" TEXT NOT NULL DEFAULT 'public/avatar.png',
    "language" TEXT NOT NULL DEFAULT 'en',
    "otp" INTEGER,
    "otp_expire" BIGINT
);
INSERT INTO "new_User" ("avatar", "email", "id", "otp", "otp_expire", "password", "username") SELECT "avatar", "email", "id", "otp", "otp_expire", "password", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
