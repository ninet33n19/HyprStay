/*
  Warnings:

  - You are about to drop the `hotels` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `hotelId` on the `amenities` table. All the data in the column will be lost.
  - You are about to drop the column `hotelId` on the `rooms` table. All the data in the column will be lost.
  - Added the required column `listingId` to the `amenities` table without a default value. This is not possible if the table is not empty.
  - Added the required column `listingId` to the `rooms` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "hotels";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "listings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "bedrooms" INTEGER NOT NULL,
    "bathrooms" INTEGER NOT NULL,
    "ownerId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "listings_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "bookings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "listingId" TEXT NOT NULL,
    "guestId" TEXT NOT NULL,
    "checkIn" DATETIME NOT NULL,
    "checkOut" DATETIME NOT NULL,
    "totalPrice" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "bookings_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "listings" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "bookings_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_amenities" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    CONSTRAINT "amenities_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "listings" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_amenities" ("id", "name") SELECT "id", "name" FROM "amenities";
DROP TABLE "amenities";
ALTER TABLE "new_amenities" RENAME TO "amenities";
CREATE TABLE "new_rooms" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "capacity" INTEGER NOT NULL,
    "listingId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "rooms_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "listings" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_rooms" ("capacity", "createdAt", "description", "id", "name", "price") SELECT "capacity", "createdAt", "description", "id", "name", "price" FROM "rooms";
DROP TABLE "rooms";
ALTER TABLE "new_rooms" RENAME TO "rooms";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
