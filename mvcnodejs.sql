-- MySQL Script generated by MySQL Workbench
-- Wed Nov 25 08:59:59 2015
-- Model: New Model    Version: 1.0.1
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema mvcnodejs
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `mvcnodejs` ;

-- -----------------------------------------------------
-- Schema messenger
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `mvcnodejs` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci ;
SHOW WARNINGS;
USE `mvcnodejs` ;

-- -----------------------------------------------------
-- Table `users`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `users` ;

SHOW WARNINGS;
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `phone` VARCHAR(16) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NULL,
  `verification_code` CHAR(6) NULL,
  `is_active` TINYINT(1) NULL DEFAULT 0,
  `is_reported` TINYINT(1) NULL DEFAULT 0,
  `is_blocked` TINYINT(1) NULL DEFAULT 0,
  `bookmarks` tinytext NULL,
  `lastactive` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;

SHOW WARNINGS;
CREATE UNIQUE INDEX `phone_UNIQUE` ON `users` (`phone` ASC);

SHOW WARNINGS;
CREATE UNIQUE INDEX `email_UNIQUE` ON `users` (`email` ASC);

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `contacts`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `contacts` ;

SHOW WARNINGS;
CREATE TABLE IF NOT EXISTS `contacts` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT 'Sync the contacts to this table',
  `users_id` INT NOT NULL,
  `first_name` VARCHAR(20) NULL,
  `middle_name` VARCHAR(20) NULL,
  `last_name` VARCHAR(20) NULL,
  `user_name` VARCHAR(255) NULL,
  `country` varchar(100) DEFAULT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `mood_message` varchar(100) DEFAULT NULL,
  `status` TINYINT(1) NULL DEFAULT 0,
  `is_life` TINYINT(1) NULL DEFAULT 0,
  `path_img` text,
  `path_img_group` text,
  `cfg_chat` text NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `contacts_users_id_UNIQUE` (`users_id`),
  CONSTRAINT `contacts` FOREIGN KEY (`users_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
)ENGINE = InnoDB;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `conversation`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `conversation` ;

SHOW WARNINGS;
CREATE TABLE IF NOT EXISTS `conversation` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(40) NULL,
  `creator_id` INT NOT NULL,
  `channel_id` VARCHAR(45) NULL,
  `deleted_users_id` int(11) NOT NULL,
  `is_deleted` tinyint(1) NULL DEFAULT 0,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `participants`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `participants` ;

SHOW WARNINGS;
CREATE TABLE IF NOT EXISTS `participants` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `conversation_id` INT NOT NULL,
  `users_id` INT NOT NULL,
  `type` ENUM('single', 'group') NULL,
  `is_accept_single` tinyint(1) NULL DEFAULT 1,
  `is_accept_group` tinyint(1) NULL DEFAULT 0,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `conversation_users_id_UNIQUE` (`conversation_id`, `users_id`))
ENGINE = InnoDB;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `messages`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `messages` ;

SHOW WARNINGS;
CREATE TABLE IF NOT EXISTS `messages` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `conversation_id` INT NOT NULL,
  `sender_id` INT NOT NULL,
  `participants_id` tinytext NOT NULL,
  `message_type` ENUM('text', 'image', 'vedio', 'audio') NULL,
  `message` VARCHAR(255) NULL,
  `attachment_thumb_url` VARCHAR(255) NULL,
  `attachment_url` VARCHAR(255) NULL,
  `guid` ENUM('single', 'group') NULL,
  `is_single_group` tinyint(1) NULL DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
ENGINE = InnoDB;

SHOW WARNINGS;


-- -----------------------------------------------------
-- Table `groupmembers`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `groupmembers` ;


CREATE TABLE IF NOT EXISTS `groupmembers` (
  `user_id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL,
  `last_id` int(11) NOT NULL,
  PRIMARY KEY (`user_id`,`group_id`),
  UNIQUE KEY `group_id_user_last_reports_UNIQUE` (`group_id`, `user_id`, `last_id`))
  ENGINE=InnoDB;
SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `groups`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `groups` ;

CREATE TABLE IF NOT EXISTS `groups` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(256) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `reports`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `reports` ;

SHOW WARNINGS;
CREATE TABLE IF NOT EXISTS `reports` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `users_id` INT NOT NULL,
  `participants_id` INT NOT NULL,
  `report_type` VARCHAR(45) NULL,
  `notes` TEXT NULL,
  `is_deleted` tinyint(1) NULL DEFAULT 0,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `participantsId_user_reports_UNIQUE` (`participants_id`, `users_id`))
ENGINE = InnoDB;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `block_list`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `block_list` ;

SHOW WARNINGS;
CREATE TABLE IF NOT EXISTS `block_list` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `users_id` INT NOT NULL,
  `prevent_participant` INT NOT NULL,
  `conversation_id` INT NOT NULL,
  `is_deleted` tinyint(1) NULL DEFAULT 1,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `participantsId_user_UNIQUE` (`participants_id`, `users_id`))
ENGINE = InnoDB;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `deleted_conversations`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `deleted_conversations` ;

SHOW WARNINGS;
CREATE TABLE IF NOT EXISTS `deleted_conversations` (
  `id` INT NOT NULL,
  `conversation_id` INT NOT NULL,
  `users_id` INT NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `is_deleted` tinyint(1) NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `conversationId_user_UNIQUE` (`conversation_id`, `users_id`))
ENGINE = InnoDB;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `devices`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `devices` ;

SHOW WARNINGS;
CREATE TABLE IF NOT EXISTS `devices` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `users_id` INT NOT NULL,
  `device_id` VARCHAR(120) NULL,
  `type` ENUM('APPLE') NULL,
  `device_token` VARCHAR(120) NULL,
  `is_deleted` tinyint(1) NULL DEFAULT 0,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (`id`),
   UNIQUE KEY `devicesId_user_UNIQUE` (`device_id`, `users_id`))
ENGINE = InnoDB;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `access`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `access` ;

SHOW WARNINGS;
CREATE TABLE IF NOT EXISTS `access` (
  `id` INT NOT NULL,
  `users_id` INT NOT NULL,
  `token` VARCHAR(60) NULL,
  `devices_id` INT NOT NULL,
  `is_deleted` tinyint(1) NULL DEFAULT 0,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (`id`),
   UNIQUE KEY `devicesId_UNIQUE` (`devices_id`))
ENGINE = InnoDB;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `deleted_messages`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `deleted_messages` ;

SHOW WARNINGS;
CREATE TABLE IF NOT EXISTS `deleted_messages` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `messages_id` INT NOT NULL,
  `users_id` INT NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `is_deleted` tinyint(1) NULL DEFAULT 0,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;

SHOW WARNINGS;


--
-- Table structure for table `product_counts`
--

DROP TABLE IF EXISTS `product_counts`;

SHOW WARNINGS;

CREATE TABLE `product_counts` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `color_id` int(10) unsigned NOT NULL,
  `size_id` int(10) unsigned NOT NULL,
  `product_id` int(10) unsigned NOT NULL,
  `soluong` int(11) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `product_counts_color_id_foreign` (`color_id`) USING BTREE,
  KEY `product_counts_size_id_foreign` (`size_id`) USING BTREE,
  KEY `product_counts_product_id_foreign` (`product_id`) USING BTREE,
  CONSTRAINT `product_counts_ibfk_1` FOREIGN KEY (`color_id`) REFERENCES `product_colors` (`id`) ON DELETE CASCADE,
  CONSTRAINT `product_counts_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `product_counts_ibfk_3` FOREIGN KEY (`size_id`) REFERENCES `product_sizes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

SHOW WARNINGS;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
