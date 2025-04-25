/*
  Warnings:

  - You are about to alter the column `time_start` on the `booking` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `time_end` on the `booking` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- DropIndex
DROP INDEX `Bank_account_UserID_fkey` ON `bank_account`;

-- DropIndex
DROP INDEX `Booking_FieldID_fkey` ON `booking`;

-- DropIndex
DROP INDEX `Booking_UserID_fkey` ON `booking`;

-- DropIndex
DROP INDEX `Fields_CategoryID_fkey` ON `fields`;

-- DropIndex
DROP INDEX `Fields_OptionID_fkey` ON `fields`;

-- DropIndex
DROP INDEX `Fields_OwnerID_fkey` ON `fields`;

-- DropIndex
DROP INDEX `Hours_FieldID_fkey` ON `hours`;

-- DropIndex
DROP INDEX `Option_Fields_CategoryID_fkey` ON `option_fields`;

-- DropIndex
DROP INDEX `Payments_BookingID_fkey` ON `payments`;

-- DropIndex
DROP INDEX `Reviews_FieldID_fkey` ON `reviews`;

-- DropIndex
DROP INDEX `Reviews_UserID_fkey` ON `reviews`;

-- DropIndex
DROP INDEX `Space_Per_Hour_FieldID_fkey` ON `space_per_hour`;

-- DropIndex
DROP INDEX `User_roleID_fkey` ON `user`;

-- AlterTable
ALTER TABLE `booking` MODIFY `time_start` DATETIME NOT NULL,
    MODIFY `time_end` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `space_per_hour` ADD COLUMN `day_of_week` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_roleID_fkey` FOREIGN KEY (`roleID`) REFERENCES `role`(`role_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `bank_account` ADD CONSTRAINT `bank_account_UserID_fkey` FOREIGN KEY (`UserID`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `payments` ADD CONSTRAINT `payments_BookingID_fkey` FOREIGN KEY (`BookingID`) REFERENCES `booking`(`booking_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `booking` ADD CONSTRAINT `booking_UserID_fkey` FOREIGN KEY (`UserID`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `booking` ADD CONSTRAINT `booking_FieldID_fkey` FOREIGN KEY (`FieldID`) REFERENCES `fields`(`field_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `option_fields` ADD CONSTRAINT `option_fields_CategoryID_fkey` FOREIGN KEY (`CategoryID`) REFERENCES `category`(`category_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `fields` ADD CONSTRAINT `fields_OwnerID_fkey` FOREIGN KEY (`OwnerID`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `fields` ADD CONSTRAINT `fields_CategoryID_fkey` FOREIGN KEY (`CategoryID`) REFERENCES `category`(`category_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `fields` ADD CONSTRAINT `fields_OptionID_fkey` FOREIGN KEY (`OptionID`) REFERENCES `option_fields`(`option_field_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_UserID_fkey` FOREIGN KEY (`UserID`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_FieldID_fkey` FOREIGN KEY (`FieldID`) REFERENCES `fields`(`field_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `space_per_hour` ADD CONSTRAINT `space_per_hour_FieldID_fkey` FOREIGN KEY (`FieldID`) REFERENCES `fields`(`field_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `hours` ADD CONSTRAINT `hours_FieldID_fkey` FOREIGN KEY (`FieldID`) REFERENCES `fields`(`field_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `fields_schedules` ADD CONSTRAINT `fields_schedules_FieldID_fkey` FOREIGN KEY (`FieldID`) REFERENCES `fields`(`field_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `promotions` ADD CONSTRAINT `promotions_FieldID_fkey` FOREIGN KEY (`FieldID`) REFERENCES `fields`(`field_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- RenameIndex
ALTER TABLE `fields_schedules` RENAME INDEX `Fields_Schedules_FieldID_key` TO `fields_schedules_FieldID_key`;

-- RenameIndex
ALTER TABLE `promotions` RENAME INDEX `Promotions_FieldID_key` TO `promotions_FieldID_key`;

-- RenameIndex
ALTER TABLE `user` RENAME INDEX `User_email_key` TO `user_email_key`;
