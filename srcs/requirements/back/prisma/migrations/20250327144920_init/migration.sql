-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "avatar" TEXT NOT NULL DEFAULT './public/avatar.png'
);

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");
