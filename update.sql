ALTER TABLE `conversation`
ADD COLUMN `is_deleted` TINYINT (1) NULL DEFAULT 0 AFTER `channel_id`;


CREATE TRIGGER `after_insert_type_single_goup` BEFORE INSERT ON `participants`
FOR EACH ROW
BEGIN
  CASE new.type
    WHEN 'single'
    THEN
      SET NEW.is_accept_single = 1, NEW.is_accept_group = 0;
    WHEN 'group'
    THEN
      SET NEW.is_accept_single = 0;
  ELSE
    BEGIN END;
  END CASE;
END

CREATE DEFINER = CURRENT_USER TRIGGER `mvcnodejs`.`messages_BEFORE_INSERT` BEFORE INSERT ON `messages` FOR EACH ROW
BEGIN
  CASE new.guid
    WHEN 'single'
    THEN
      SET NEW.is_single_group = 0;
    WHEN 'group'
    THEN
      SET NEW.is_single_group = 1;
  ELSE
    BEGIN END;
  END CASE;
END


# ---------------------------
SELECT *
FROM participants p LEFT JOIN block_list b ON (p.id = b.participants_id)
WHERE conversation_id IN (
  SELECT conversation_id
  FROM participants
  WHERE users_id = 12 AND type = 'single' AND is_accept_single = 0)

      AND (b.is_deleted != 1 OR b.is_deleted IS NULL) AND p.users_id != 12