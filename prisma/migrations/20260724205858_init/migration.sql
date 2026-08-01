-- CreateTable
CREATE TABLE "Room" (
    "id" SERIAL NOT NULL,
    "room_number" TEXT NOT NULL,
    "room_type" TEXT NOT NULL,
    "price_per_night" DECIMAL(65,30) NOT NULL,
    "is_available" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" SERIAL NOT NULL,
    "guest_name" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "check_in_date" TIMESTAMP(3) NOT NULL,
    "check_out_date" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "room_id" INTEGER NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Room_room_number_key" ON "Room"("room_number");

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
