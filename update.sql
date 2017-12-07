ALTER TABLE `conversation`
ADD COLUMN `is_deleted`  tinyint(1) NULL DEFAULT 0 AFTER `channel_id`;
