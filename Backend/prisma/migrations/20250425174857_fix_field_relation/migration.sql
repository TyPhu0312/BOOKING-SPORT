-- DropIndex
DROP INDEX `fields_schedules_FieldID_key` ON `fields_schedules`;

-- CreateIndex
CREATE INDEX `fields_schedules_fieldID_fkey` ON `fields_schedules`(`FieldID`);

-- AddForeignKey
ALTER TABLE `fields_schedules` ADD CONSTRAINT `fields_schedules_FieldID_fkey` FOREIGN KEY (`FieldID`) REFERENCES `fields`(`field_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
