ALTER TABLE `conversation`
ADD COLUMN `deleted_at`  tinyint(1) NULL DEFAULT 0 AFTER `channel_id`;
