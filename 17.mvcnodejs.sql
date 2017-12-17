-- phpMyAdmin SQL Dump
-- version 4.6.5.2
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th12 17, 2017 lúc 06:29 CH
-- Phiên bản máy phục vụ: 10.1.21-MariaDB
-- Phiên bản PHP: 5.6.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `mvcnodejs`
--
CREATE DATABASE IF NOT EXISTS `mvcnodejs` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `mvcnodejs`;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `access`
--

DROP TABLE IF EXISTS `access`;
CREATE TABLE IF NOT EXISTS `access` (
  `id` int(11) NOT NULL,
  `users_id` int(11) NOT NULL,
  `token` varchar(60) DEFAULT NULL,
  `devices_id` int(11) NOT NULL,
  `is_deleted` tinyint(1) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `devicesId_UNIQUE` (`devices_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `block_list`
--

DROP TABLE IF EXISTS `block_list`;
CREATE TABLE IF NOT EXISTS `block_list` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `users_id` int(11) NOT NULL,
  `participants_id` int(11) NOT NULL,
  `is_deleted` tinyint(1) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `participantsId_user_UNIQUE` (`participants_id`,`users_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

--
-- Đang đổ dữ liệu cho bảng `block_list`
--

INSERT INTO `block_list` (`id`, `users_id`, `participants_id`, `is_deleted`, `created_at`, `updated_at`) VALUES
(1, 12, 8, 1, '2017-12-01 19:06:28', '2017-12-01 19:06:28'),
(2, 12, 1, 0, '2017-12-01 19:06:28', '2017-12-01 19:06:28');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `contacts`
--

DROP TABLE IF EXISTS `contacts`;
CREATE TABLE IF NOT EXISTS `contacts` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Sync the contacts to this table',
  `users_id` int(11) NOT NULL,
  `first_name` varchar(20) DEFAULT NULL,
  `middle_name` varchar(20) DEFAULT NULL,
  `last_name` varchar(20) DEFAULT NULL,
  `user_name` varchar(255) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `mood_message` varchar(100) DEFAULT NULL,
  `status` tinyint(1) DEFAULT '0',
  `is_life` tinyint(1) DEFAULT '0',
  `path_img` text,
  `path_img_group` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `contacts_users_id_UNIQUE` (`users_id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8;

--
-- Đang đổ dữ liệu cho bảng `contacts`
--

INSERT INTO `contacts` (`id`, `users_id`, `first_name`, `middle_name`, `last_name`, `user_name`, `country`, `gender`, `mood_message`, `status`, `is_life`, `path_img`, `path_img_group`, `created_at`, `updated_at`) VALUES
(1, 1, 'bqngoc119', 'bqngoc119 undefined', NULL, NULL, NULL, NULL, '23', 3, 0, '', '', '2017-11-30 01:59:17', '2017-11-30 01:59:17'),
(2, 2, 'bqngoc110', 'bqngoc110 undefined', NULL, NULL, NULL, NULL, '3', 0, 0, '', '', '2017-11-30 02:03:06', '2017-12-03 18:39:00'),
(3, 3, 'bqngoc118', 'bqngoc118 undefined', NULL, NULL, NULL, NULL, '22', 3, 0, '', '', '2017-11-30 02:04:54', '2017-11-30 02:04:54'),
(4, 4, 'bqngoc11229', 'bqngoc11229 undefine', NULL, NULL, NULL, NULL, 'r', 2, 1, '', '', '2017-11-30 02:05:28', '2017-12-17 17:04:10'),
(5, 5, 'BuiNgoc1', 'BuiNgoc1 undefined', NULL, NULL, NULL, NULL, 'ư', 1, 0, '', '', '2017-11-30 02:07:13', '2017-12-03 18:33:55'),
(6, 6, 'gsgewq', 'gsgewq undefined', NULL, NULL, NULL, NULL, '76tjk nbk bjk fh ', 0, 1, '', '', '2017-11-30 02:09:07', '2017-12-17 17:05:01'),
(7, 7, 'few4w4', 'few4w4 undefined', NULL, NULL, NULL, NULL, '65iu hgbkjvkjf', 4, 0, '', '', '2017-11-30 02:17:17', '2017-11-30 02:17:17'),
(8, 8, 'ewew434', 'ewew434 undefined', NULL, NULL, NULL, NULL, 'rrw', 2, 0, '', '', '2017-11-30 02:17:39', '2017-11-30 02:17:39'),
(9, 9, '98912315069', '98912315069 undefine', NULL, NULL, NULL, NULL, 'rưư', 4, 0, '', '', '2017-11-30 02:18:26', '2017-11-30 02:18:26'),
(10, 10, 'BuiNgocewewe', 'BuiNgocewewe undefin', NULL, NULL, NULL, NULL, 'rử', 1, 0, '', '', '2017-11-30 02:19:35', '2017-11-30 02:19:35'),
(11, 11, 'buingoc119', NULL, 'xxx-xx', NULL, NULL, NULL, '545objh87yi8', 3, 0, '', '', '2017-11-30 15:11:51', '2017-11-30 17:11:29'),
(12, 12, 'bqngoc119', 'bqngoc119 xxx-xx', 'xxx-xx', NULL, NULL, NULL, '', 1, 1, '', '', '2017-12-01 12:23:12', '2017-12-17 17:27:55'),
(13, 15, 'bqngoc119wqw', 'bqngoc119wqw xxx-xx', 'xxx-xx', NULL, NULL, NULL, NULL, 0, 0, '', '', '2017-12-13 12:03:12', '2017-12-13 12:03:12');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `conversation`
--

DROP TABLE IF EXISTS `conversation`;
CREATE TABLE IF NOT EXISTS `conversation` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(40) DEFAULT NULL,
  `creator_id` int(11) NOT NULL,
  `channel_id` varchar(45) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `is_deleted` tinyint(1) DEFAULT '0',
  `deleted_users_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

--
-- Đang đổ dữ liệu cho bảng `conversation`
--

INSERT INTO `conversation` (`id`, `title`, `creator_id`, `channel_id`, `created_at`, `updated_at`, `is_deleted`, `deleted_users_id`) VALUES
(1, 'cncnccnc', 12, 'hhhhhhhhhhhh', '2017-12-01 19:07:02', '2017-12-01 19:07:02', 0, NULL),
(2, 'nc', 8, 'ccccccc', '2017-12-01 19:07:02', '2017-12-01 19:07:02', 0, NULL),
(3, 'ncncnc', 2, '445', '2017-12-01 19:07:02', '2017-12-01 19:07:02', 0, NULL),
(4, 'hrjrjr', 12, '53636', '2017-12-01 19:07:36', '2017-12-01 19:07:36', 0, NULL),
(5, '12 channel 5', 12, 'req68675', '2017-12-01 19:07:36', '2017-12-01 19:07:36', 0, NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `deleted_conversations`
--

DROP TABLE IF EXISTS `deleted_conversations`;
CREATE TABLE IF NOT EXISTS `deleted_conversations` (
  `id` int(11) NOT NULL,
  `conversation_id` int(11) NOT NULL,
  `users_id` int(11) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `is_deleted` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `conversationId_user_UNIQUE` (`conversation_id`,`users_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `deleted_messages`
--

DROP TABLE IF EXISTS `deleted_messages`;
CREATE TABLE IF NOT EXISTS `deleted_messages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `messages_id` int(11) NOT NULL,
  `users_id` int(11) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `is_deleted` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `devices`
--

DROP TABLE IF EXISTS `devices`;
CREATE TABLE IF NOT EXISTS `devices` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `users_id` int(11) NOT NULL,
  `device_id` varchar(120) DEFAULT NULL,
  `type` enum('APPLE') DEFAULT NULL,
  `device_token` varchar(120) DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `devicesId_user_UNIQUE` (`device_id`,`users_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `groupmembers`
--

DROP TABLE IF EXISTS `groupmembers`;
CREATE TABLE IF NOT EXISTS `groupmembers` (
  `user_id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL,
  `last_id` int(11) NOT NULL,
  PRIMARY KEY (`user_id`,`group_id`),
  UNIQUE KEY `group_id_user_last_reports_UNIQUE` (`group_id`,`user_id`,`last_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `groups`
--

DROP TABLE IF EXISTS `groups`;
CREATE TABLE IF NOT EXISTS `groups` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(256) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `messages`
--

DROP TABLE IF EXISTS `messages`;
CREATE TABLE IF NOT EXISTS `messages` (
  `id` int(11) NOT NULL,
  `conversation_id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `participants_id` int(11) NOT NULL,
  `message_type` enum('text','image','vedio','audio') DEFAULT NULL,
  `message` varchar(255) DEFAULT NULL,
  `attachment_thumb_url` varchar(255) DEFAULT NULL,
  `attachment_url` varchar(255) DEFAULT NULL,
  `guid` varchar(100) DEFAULT NULL,
  `group_id` int(11) NOT NULL DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `group_sender_partic_UNIQUE` (`group_id`,`sender_id`,`participants_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `participants`
--

DROP TABLE IF EXISTS `participants`;
CREATE TABLE IF NOT EXISTS `participants` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `conversation_id` int(11) NOT NULL,
  `users_id` int(11) NOT NULL,
  `type` enum('single','group') DEFAULT NULL,
  `is_accept_single` tinyint(1) DEFAULT '1',
  `is_accept_group` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `conversation_users_id_UNIQUE` (`conversation_id`,`users_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8;

--
-- Đang đổ dữ liệu cho bảng `participants`
--

INSERT INTO `participants` (`id`, `conversation_id`, `users_id`, `type`, `is_accept_single`, `is_accept_group`, `created_at`, `updated_at`) VALUES
(1, 1, 12, 'single', 0, 0, '2017-12-01 19:08:00', '2017-12-01 19:08:00'),
(4, 2, 2, 'single', 0, 0, '2017-12-01 19:08:59', '2017-12-01 19:08:59'),
(5, 3, 12, 'group', 1, 0, '2017-12-01 19:08:59', '2017-12-01 19:08:59'),
(6, 4, 12, 'single', 0, 0, '2017-12-01 19:13:15', '2017-12-01 19:13:15'),
(7, 4, 6, 'single', 0, 0, '2017-12-01 19:13:47', '2017-12-01 19:13:47'),
(8, 1, 5, 'single', 0, 0, '2017-12-02 13:21:55', '2017-12-02 13:21:55'),
(9, 3, 5, 'group', 1, 0, '2017-12-02 13:22:57', '2017-12-02 13:22:57'),
(10, 3, 6, 'group', 1, 0, '2017-12-02 13:22:57', '2017-12-02 13:22:57'),
(11, 2, 12, 'single', 0, 0, '2017-12-02 13:23:34', '2017-12-02 13:23:34'),
(12, 5, 12, 'single', 1, 0, '2017-12-17 02:16:01', '2017-12-17 02:16:01'),
(13, 5, 4, 'single', 1, 0, '2017-12-17 02:20:59', '2017-12-17 02:20:59');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `product_counts`
--

DROP TABLE IF EXISTS `product_counts`;
CREATE TABLE IF NOT EXISTS `product_counts` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `color_id` int(10) UNSIGNED NOT NULL,
  `size_id` int(10) UNSIGNED NOT NULL,
  `product_id` int(10) UNSIGNED NOT NULL,
  `soluong` int(11) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `product_counts_color_id_foreign` (`color_id`) USING BTREE,
  KEY `product_counts_size_id_foreign` (`size_id`) USING BTREE,
  KEY `product_counts_product_id_foreign` (`product_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `reports`
--

DROP TABLE IF EXISTS `reports`;
CREATE TABLE IF NOT EXISTS `reports` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `users_id` int(11) NOT NULL,
  `participants_id` int(11) NOT NULL,
  `report_type` varchar(45) DEFAULT NULL,
  `notes` text,
  `is_deleted` tinyint(1) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `participantsId_user_reports_UNIQUE` (`participants_id`,`users_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `phone` varchar(16) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `verification_code` char(6) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '0',
  `is_reported` tinyint(1) DEFAULT '0',
  `is_blocked` tinyint(1) DEFAULT '0',
  `lastactive` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `phone_UNIQUE` (`phone`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `phone`, `email`, `password`, `verification_code`, `is_active`, `is_reported`, `is_blocked`, `lastactive`, `created_at`, `updated_at`) VALUES
(1, '989815069', 'buingoc1192@4efw.ew', '$2a$10$5GKfCX9ZmOInk8PMp4tYB.7/zCpHxet5tJ.0ie7aow.ACQV8aspJK', NULL, 0, 0, 0, '2017-11-30 15:10:55', '2017-11-29 18:59:17', '2017-11-29 18:59:17'),
(2, '9898150692', 'bqngoc110@fsfsf.fgf', '$2a$10$92N7a1eXoJpbvQfnJZ9FOukBRP8dltocDXhq.fAYCp1fWC6nw61Ba', NULL, 0, 0, 0, '2017-12-03 18:23:18', '2017-11-29 19:03:06', '2017-11-29 19:03:06'),
(3, '98981506912', 'buingoc119@hotmail.comw', '$2a$10$Cm3mNIrptlKZcq8lDrCYAeZ/aQKY8zgxSQ0DZ/zLHcXOkuxFqufmG', NULL, 0, 0, 0, '0000-00-00 00:00:00', '2017-11-29 19:04:54', '2017-11-29 19:04:54'),
(4, '989811506921', 'buingocc119', '$2a$10$92N7a1eXoJpbvQfnJZ9FOukBRP8dltocDXhq.fAYCp1fWC6nw61Ba', NULL, 0, 0, 0, '2017-12-17 17:01:11', '2017-11-29 19:05:28', '2017-11-29 19:05:28'),
(5, '9894515069', 'buins119@hotmail.com', '$2a$10$92N7a1eXoJpbvQfnJZ9FOukBRP8dltocDXhq.fAYCp1fWC6nw61Ba', NULL, 0, 0, 0, '2017-12-03 18:28:54', '2017-11-29 19:07:13', '2017-11-29 19:07:13'),
(6, '989231815069', 'buingoc119', '$2a$10$92N7a1eXoJpbvQfnJZ9FOukBRP8dltocDXhq.fAYCp1fWC6nw61Ba', NULL, 0, 0, 0, '2017-12-12 15:06:30', '2017-11-29 19:09:07', '2017-11-29 19:09:07'),
(7, '933815069', 'buineewoc119@hotmail.com', '$2a$10$2WNNLFsyVdBqJjPdT2JFWOsgT8e8AVYpt0dtVIEOqz32mU1iBAYVC', NULL, 0, 0, 0, '0000-00-00 00:00:00', '2017-11-29 19:17:17', '2017-11-29 19:17:17'),
(8, '98981321069', 'buisgoc119@hotms.com', '$2a$10$sQTyyzZ2w2wSkPB0oam82uxDATxgea62ITEowRkUw8.MtP336UGtq', NULL, 0, 0, 0, '0000-00-00 00:00:00', '2017-11-29 19:17:39', '2017-11-29 19:17:39'),
(9, '98912315069', 'buingo232c119@ho33email.com', '$2a$10$kzAiNk8wsP5TtDNll6YoJOB393mnYIss7b/Ax5Snim9Gv9BszFIiC', NULL, 0, 0, 0, '0000-00-00 00:00:00', '2017-11-29 19:18:26', '2017-11-29 19:18:26'),
(10, '989815034369', 'BuiNgoce@grgwee.ewe', '$2a$10$PWBePR13Uki2Y1eO59zGte..TH3DMvVy1bLzBMtMw.ZvsDJLcrCgy', NULL, 0, 0, 0, '0000-00-00 00:00:00', '2017-11-29 19:19:35', '2017-11-29 19:19:35'),
(11, '989815064912', 'buingoc1191', '$2a$10$92N7a1eXoJpbvQfnJZ9FOukBRP8dltocDXhq.fAYCp1fWC6nw61Ba', NULL, 0, 0, 0, '2017-12-12 15:06:04', '2017-11-30 15:11:51', '2017-11-30 15:11:51'),
(12, '989815063439', 'bqngoc119', '$2a$10$92N7a1eXoJpbvQfnJZ9FOukBRP8dltocDXhq.fAYCp1fWC6nw61Ba', NULL, 0, 0, 0, '2017-12-01 12:23:37', '2017-12-01 12:23:12', '2017-12-01 12:23:12'),
(15, '353535069', 'ngocbfdsq02@wru.vn', '$2a$10$NAuDhcXM4jY2e3jsWWxheOTAWUhop1KrpBlxdJdo/f9bFsiFGUPwa', NULL, 0, 0, 0, '0000-00-00 00:00:00', '2017-12-13 12:03:12', '2017-12-13 12:03:12');

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `contacts`
--
ALTER TABLE `contacts`
  ADD CONSTRAINT `contacts` FOREIGN KEY (`users_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
