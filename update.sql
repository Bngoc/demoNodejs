ALTER TABLE `conversation`
ADD COLUMN `is_deleted`  tinyint(1) NULL DEFAULT 0 AFTER `channel_id`;


CREATE TRIGGER `after_insert_type_single_goup` BEFORE INSERT ON `participants`
FOR EACH ROW
BEGIN
	CASE new.type
		WHEN 'single' THEN
			SET NEW.is_accept_single = 1, NEW.is_accept_group = 0;
		WHEN 'group' THEN
			SET NEW.is_accept_single = 0;
		ELSE
			begin end;
	END CASE;
END