-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "photo" TEXT,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "bio" TEXT,
    "hash" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
