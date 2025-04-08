-- CreateTable
CREATE TABLE `Role` (
    `role_id` CHAR(36) NOT NULL,
    `roleName` ENUM('Admin', 'Customer', 'Owner') NOT NULL DEFAULT 'Customer',

    PRIMARY KEY (`role_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `user_id` CHAR(36) NOT NULL,
    `username` VARCHAR(30) NOT NULL,
    `passWord` VARCHAR(191) NOT NULL,
    `email` VARCHAR(30) NOT NULL,
    `phone_number` VARCHAR(10) NOT NULL,
    `create_at` DATE NOT NULL,
    `roleID` CHAR(36) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Bank_account` (
    `bank_id` CHAR(36) NOT NULL,
    `bank_account_number` INTEGER NOT NULL,
    `bank_account_name` VARCHAR(30) NOT NULL,
    `UserID` CHAR(36) NOT NULL,

    PRIMARY KEY (`bank_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Payments` (
    `payment_id` CHAR(36) NOT NULL,
    `total_price` DECIMAL(65, 30) NOT NULL,
    `payment_date` DATETIME(3) NOT NULL,
    `method` ENUM('Banking', 'Cash') NOT NULL DEFAULT 'Cash',
    `status` ENUM('Success', 'Failed') NOT NULL DEFAULT 'Success',
    `isDeposit` BOOLEAN NOT NULL,
    `BookingID` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`payment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Booking` (
    `booking_id` CHAR(36) NOT NULL,
    `booking_date` DATE NOT NULL,
    `time_start` DATETIME NOT NULL,
    `time_end` DATETIME NOT NULL,
    `total_price` DECIMAL(65, 30) NOT NULL,
    `deposit` DECIMAL(65, 30) NOT NULL,
    `Status` ENUM('Pending', 'Confirmed', 'Cancelled') NOT NULL DEFAULT 'Pending',
    `prove_payment` VARCHAR(30) NOT NULL,
    `UserID` VARCHAR(36) NOT NULL,
    `FieldID` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`booking_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Category` (
    `category_id` VARCHAR(36) NOT NULL,
    `category_name` VARCHAR(30) NOT NULL,

    PRIMARY KEY (`category_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Option_Fields` (
    `option_field_id` VARCHAR(36) NOT NULL,
    `number_of_field` VARCHAR(30) NOT NULL,
    `CategoryID` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`option_field_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Fields` (
    `field_id` VARCHAR(36) NOT NULL,
    `field_name` VARCHAR(30) NOT NULL,
    `half_hour` BOOLEAN NOT NULL,
    `location` VARCHAR(30) NOT NULL,
    `description` VARCHAR(30) NOT NULL,
    `status` ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Inactive',
    `image_url` VARCHAR(30) NOT NULL,
    `create_at` DATETIME(3) NOT NULL,
    `OwnerID` VARCHAR(36) NOT NULL,
    `CategoryID` VARCHAR(36) NOT NULL,
    `OptionID` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`field_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Reviews` (
    `review_id` VARCHAR(36) NOT NULL,
    `rating` DOUBLE NOT NULL,
    `comment` VARCHAR(30) NOT NULL,
    `create_at` DATETIME(3) NOT NULL,
    `UserID` VARCHAR(36) NOT NULL,
    `FieldID` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`review_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Space_Per_Hour` (
    `space_per_hour_id` VARCHAR(36) NOT NULL,
    `from_hour_value` VARCHAR(30) NOT NULL,
    `to_hour_value` VARCHAR(30) NOT NULL,
    `price` DOUBLE NOT NULL,
    `FieldID` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`space_per_hour_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Hours` (
    `hours_id` VARCHAR(36) NOT NULL,
    `hour_value` DOUBLE NOT NULL,
    `status_hour_on` ENUM('Enable') NOT NULL DEFAULT 'Enable',
    `status_hour_off` ENUM('Booked', 'Out_of_time') NOT NULL DEFAULT 'Booked',
    `FieldID` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`hours_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Fields_Schedules` (
    `schedule_id` VARCHAR(36) NOT NULL,
    `day_of_week` ENUM('Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun') NOT NULL,
    `open_time` TIME NOT NULL,
    `close_time` TIME NOT NULL,
    `FieldID` VARCHAR(36) NOT NULL,

    UNIQUE INDEX `Fields_Schedules_FieldID_key`(`FieldID`),
    PRIMARY KEY (`schedule_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Promotions` (
    `promotion_id` VARCHAR(36) NOT NULL,
    `discount` DECIMAL(65, 30) NOT NULL,
    `start_date` DATETIME(3) NOT NULL,
    `end_date` DATETIME(3) NOT NULL,
    `FieldID` VARCHAR(36) NOT NULL,

    UNIQUE INDEX `Promotions_FieldID_key`(`FieldID`),
    PRIMARY KEY (`promotion_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_roleID_fkey` FOREIGN KEY (`roleID`) REFERENCES `Role`(`role_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Bank_account` ADD CONSTRAINT `Bank_account_UserID_fkey` FOREIGN KEY (`UserID`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Payments` ADD CONSTRAINT `Payments_BookingID_fkey` FOREIGN KEY (`BookingID`) REFERENCES `Booking`(`booking_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_UserID_fkey` FOREIGN KEY (`UserID`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_FieldID_fkey` FOREIGN KEY (`FieldID`) REFERENCES `Fields`(`field_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Option_Fields` ADD CONSTRAINT `Option_Fields_CategoryID_fkey` FOREIGN KEY (`CategoryID`) REFERENCES `Category`(`category_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Fields` ADD CONSTRAINT `Fields_OwnerID_fkey` FOREIGN KEY (`OwnerID`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Fields` ADD CONSTRAINT `Fields_CategoryID_fkey` FOREIGN KEY (`CategoryID`) REFERENCES `Category`(`category_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Fields` ADD CONSTRAINT `Fields_OptionID_fkey` FOREIGN KEY (`OptionID`) REFERENCES `Option_Fields`(`option_field_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Reviews` ADD CONSTRAINT `Reviews_UserID_fkey` FOREIGN KEY (`UserID`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Reviews` ADD CONSTRAINT `Reviews_FieldID_fkey` FOREIGN KEY (`FieldID`) REFERENCES `Fields`(`field_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Space_Per_Hour` ADD CONSTRAINT `Space_Per_Hour_FieldID_fkey` FOREIGN KEY (`FieldID`) REFERENCES `Fields`(`field_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Hours` ADD CONSTRAINT `Hours_FieldID_fkey` FOREIGN KEY (`FieldID`) REFERENCES `Fields`(`field_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Fields_Schedules` ADD CONSTRAINT `Fields_Schedules_FieldID_fkey` FOREIGN KEY (`FieldID`) REFERENCES `Fields`(`field_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Promotions` ADD CONSTRAINT `Promotions_FieldID_fkey` FOREIGN KEY (`FieldID`) REFERENCES `Fields`(`field_id`) ON DELETE CASCADE ON UPDATE NO ACTION;
