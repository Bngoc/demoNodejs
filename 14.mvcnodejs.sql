-- phpMyAdmin SQL Dump
-- version 4.6.5.2
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th12 14, 2017 lúc 01:39 CH
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
CREATE TABLE `access` (
  `id` int(11) NOT NULL,
  `users_id` int(11) NOT NULL,
  `token` varchar(60) DEFAULT NULL,
  `devices_id` int(11) NOT NULL,
  `is_deleted` tinyint(1) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- RELATIONS FOR TABLE `access`:
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `block_list`
--

DROP TABLE IF EXISTS `block_list`;
CREATE TABLE `block_list` (
  `id` int(11) NOT NULL,
  `users_id` int(11) NOT NULL,
  `participants_id` int(11) NOT NULL,
  `is_deleted` tinyint(1) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- RELATIONS FOR TABLE `block_list`:
--

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
CREATE TABLE `contacts` (
  `id` int(11) NOT NULL COMMENT 'Sync the contacts to this table',
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
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- RELATIONS FOR TABLE `contacts`:
--   `users_id`
--       `users` -> `id`
--

--
-- Đang đổ dữ liệu cho bảng `contacts`
--

INSERT INTO `contacts` (`id`, `users_id`, `first_name`, `middle_name`, `last_name`, `user_name`, `country`, `gender`, `mood_message`, `status`, `is_life`, `path_img`, `path_img_group`, `created_at`, `updated_at`) VALUES
(1, 1, 'bqngoc119', 'bqngoc119 undefined', NULL, NULL, NULL, NULL, '23', 3, 0, '', '', '2017-11-30 01:59:17', '2017-11-30 01:59:17'),
(2, 2, 'bqngoc110', 'bqngoc110 undefined', NULL, NULL, NULL, NULL, '3', 0, 0, '', '', '2017-11-30 02:03:06', '2017-12-03 18:39:00'),
(3, 3, 'bqngoc118', 'bqngoc118 undefined', NULL, NULL, NULL, NULL, '22', 3, 0, '', '', '2017-11-30 02:04:54', '2017-11-30 02:04:54'),
(4, 4, 'bqngoc11229', 'bqngoc11229 undefine', NULL, NULL, NULL, NULL, 'r', 1, 0, '', '', '2017-11-30 02:05:28', '2017-11-30 02:05:28'),
(5, 5, 'BuiNgoc1', 'BuiNgoc1 undefined', NULL, NULL, NULL, NULL, 'ư', 1, 0, '', '', '2017-11-30 02:07:13', '2017-12-03 18:33:55'),
(6, 6, 'gsgewq', 'gsgewq undefined', NULL, NULL, NULL, NULL, 'r', 2, 0, '', '', '2017-11-30 02:09:07', '2017-12-13 12:37:10'),
(7, 7, 'few4w4', 'few4w4 undefined', NULL, NULL, NULL, NULL, 'r', 4, 0, '', '', '2017-11-30 02:17:17', '2017-11-30 02:17:17'),
(8, 8, 'ewew434', 'ewew434 undefined', NULL, NULL, NULL, NULL, 'rrw', 2, 0, '', '', '2017-11-30 02:17:39', '2017-11-30 02:17:39'),
(9, 9, '98912315069', '98912315069 undefine', NULL, NULL, NULL, NULL, 'rưư', 4, 0, '', '', '2017-11-30 02:18:26', '2017-11-30 02:18:26'),
(10, 10, 'BuiNgocewewe', 'BuiNgocewewe undefin', NULL, NULL, NULL, NULL, 'rử', 1, 0, '', '', '2017-11-30 02:19:35', '2017-11-30 02:19:35'),
(11, 11, 'buingoc119', NULL, 'xxx-xx', NULL, NULL, NULL, NULL, 3, 0, '', '', '2017-11-30 15:11:51', '2017-11-30 17:11:29'),
(12, 12, 'bqngoc119', 'bqngoc119 xxx-xx', 'xxx-xx', NULL, NULL, NULL, NULL, 3, 0, '', '', '2017-12-01 12:23:12', '2017-12-13 12:36:22'),
(13, 15, 'bqngoc119wqw', 'bqngoc119wqw xxx-xx', 'xxx-xx', NULL, NULL, NULL, NULL, 0, 0, '', '', '2017-12-13 12:03:12', '2017-12-13 12:03:12');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `conversation`
--

DROP TABLE IF EXISTS `conversation`;
CREATE TABLE `conversation` (
  `id` int(11) NOT NULL,
  `title` varchar(40) DEFAULT NULL,
  `creator_id` int(11) NOT NULL,
  `channel_id` varchar(45) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `is_deleted` tinyint(1) DEFAULT '0',
  `deleted_users_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- RELATIONS FOR TABLE `conversation`:
--

--
-- Đang đổ dữ liệu cho bảng `conversation`
--

INSERT INTO `conversation` (`id`, `title`, `creator_id`, `channel_id`, `created_at`, `updated_at`, `is_deleted`, `deleted_users_id`) VALUES
(1, 'cncnccnc', 12, 'hhhhhhhhhhhh', '2017-12-01 19:07:02', '2017-12-01 19:07:02', 0, NULL),
(2, 'nc', 8, 'ccccccc', '2017-12-01 19:07:02', '2017-12-01 19:07:02', 0, NULL),
(3, 'ncncnc', 2, '445', '2017-12-01 19:07:02', '2017-12-01 19:07:02', 0, NULL),
(4, 'hrjrjr', 12, '53636', '2017-12-01 19:07:36', '2017-12-01 19:07:36', 0, NULL),
(5, 'jrjfm,h', 6, '54yrnf', '2017-12-01 19:07:36', '2017-12-01 19:07:36', 0, NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `deleted_conversations`
--

DROP TABLE IF EXISTS `deleted_conversations`;
CREATE TABLE `deleted_conversations` (
  `id` int(11) NOT NULL,
  `conversation_id` int(11) NOT NULL,
  `users_id` int(11) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `is_deleted` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- RELATIONS FOR TABLE `deleted_conversations`:
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `deleted_messages`
--

DROP TABLE IF EXISTS `deleted_messages`;
CREATE TABLE `deleted_messages` (
  `id` int(11) NOT NULL,
  `messages_id` int(11) NOT NULL,
  `users_id` int(11) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `is_deleted` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- RELATIONS FOR TABLE `deleted_messages`:
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `devices`
--

DROP TABLE IF EXISTS `devices`;
CREATE TABLE `devices` (
  `id` int(11) NOT NULL,
  `users_id` int(11) NOT NULL,
  `device_id` varchar(120) DEFAULT NULL,
  `type` enum('APPLE') DEFAULT NULL,
  `device_token` varchar(120) DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- RELATIONS FOR TABLE `devices`:
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `groupmembers`
--

DROP TABLE IF EXISTS `groupmembers`;
CREATE TABLE `groupmembers` (
  `user_id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL,
  `last_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- RELATIONS FOR TABLE `groupmembers`:
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `groups`
--

DROP TABLE IF EXISTS `groups`;
CREATE TABLE `groups` (
  `id` int(11) NOT NULL,
  `name` varchar(256) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- RELATIONS FOR TABLE `groups`:
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `messages`
--

DROP TABLE IF EXISTS `messages`;
CREATE TABLE `messages` (
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
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- RELATIONS FOR TABLE `messages`:
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `participants`
--

DROP TABLE IF EXISTS `participants`;
CREATE TABLE `participants` (
  `id` int(11) NOT NULL,
  `conversation_id` int(11) NOT NULL,
  `users_id` int(11) NOT NULL,
  `type` enum('single','group') DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- RELATIONS FOR TABLE `participants`:
--

--
-- Đang đổ dữ liệu cho bảng `participants`
--

INSERT INTO `participants` (`id`, `conversation_id`, `users_id`, `type`, `created_at`, `updated_at`) VALUES
(1, 1, 12, 'single', '2017-12-01 19:08:00', '2017-12-01 19:08:00'),
(4, 2, 2, 'single', '2017-12-01 19:08:59', '2017-12-01 19:08:59'),
(5, 3, 12, 'group', '2017-12-01 19:08:59', '2017-12-01 19:08:59'),
(6, 4, 12, 'single', '2017-12-01 19:13:15', '2017-12-01 19:13:15'),
(7, 4, 6, 'single', '2017-12-01 19:13:47', '2017-12-01 19:13:47'),
(8, 1, 5, 'single', '2017-12-02 13:21:55', '2017-12-02 13:21:55'),
(9, 3, 5, 'group', '2017-12-02 13:22:57', '2017-12-02 13:22:57'),
(10, 3, 6, 'group', '2017-12-02 13:22:57', '2017-12-02 13:22:57'),
(11, 2, 12, 'single', '2017-12-02 13:23:34', '2017-12-02 13:23:34');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `product_counts`
--

DROP TABLE IF EXISTS `product_counts`;
CREATE TABLE `product_counts` (
  `id` int(10) UNSIGNED NOT NULL,
  `color_id` int(10) UNSIGNED NOT NULL,
  `size_id` int(10) UNSIGNED NOT NULL,
  `product_id` int(10) UNSIGNED NOT NULL,
  `soluong` int(11) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- RELATIONS FOR TABLE `product_counts`:
--   `color_id`
--       `product_colors` -> `id`
--   `product_id`
--       `products` -> `id`
--   `size_id`
--       `product_sizes` -> `id`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `reports`
--

DROP TABLE IF EXISTS `reports`;
CREATE TABLE `reports` (
  `id` int(11) NOT NULL,
  `users_id` int(11) NOT NULL,
  `participants_id` int(11) NOT NULL,
  `report_type` varchar(45) DEFAULT NULL,
  `notes` text,
  `is_deleted` tinyint(1) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- RELATIONS FOR TABLE `reports`:
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `phone` varchar(16) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `verification_code` char(6) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '0',
  `is_reported` tinyint(1) DEFAULT '0',
  `is_blocked` tinyint(1) DEFAULT '0',
  `lastactive` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- RELATIONS FOR TABLE `users`:
--

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `phone`, `email`, `password`, `verification_code`, `is_active`, `is_reported`, `is_blocked`, `lastactive`, `created_at`, `updated_at`) VALUES
(1, '989815069', 'buingoc1192@4efw.ew', '$2a$10$5GKfCX9ZmOInk8PMp4tYB.7/zCpHxet5tJ.0ie7aow.ACQV8aspJK', NULL, 0, 0, 0, '2017-11-30 15:10:55', '2017-11-29 18:59:17', '2017-11-29 18:59:17'),
(2, '9898150692', 'bqngoc110@fsfsf.fgf', '$2a$10$92N7a1eXoJpbvQfnJZ9FOukBRP8dltocDXhq.fAYCp1fWC6nw61Ba', NULL, 0, 0, 0, '2017-12-03 18:23:18', '2017-11-29 19:03:06', '2017-11-29 19:03:06'),
(3, '98981506912', 'buingoc119@hotmail.comw', '$2a$10$Cm3mNIrptlKZcq8lDrCYAeZ/aQKY8zgxSQ0DZ/zLHcXOkuxFqufmG', NULL, 0, 0, 0, '0000-00-00 00:00:00', '2017-11-29 19:04:54', '2017-11-29 19:04:54'),
(4, '989811506921', 'buingocc119', '$2a$10$uQFwcNr9W5uSbDNiuwUOP.NIpJxB2YyliceXhQDsQmhIvnQUEwnHu', NULL, 0, 0, 0, '2017-11-30 15:12:54', '2017-11-29 19:05:28', '2017-11-29 19:05:28'),
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
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `access`
--
ALTER TABLE `access`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `devicesId_UNIQUE` (`devices_id`);

--
-- Chỉ mục cho bảng `block_list`
--
ALTER TABLE `block_list`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `participantsId_user_UNIQUE` (`participants_id`,`users_id`);

--
-- Chỉ mục cho bảng `contacts`
--
ALTER TABLE `contacts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `contacts_users_id_UNIQUE` (`users_id`);

--
-- Chỉ mục cho bảng `conversation`
--
ALTER TABLE `conversation`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `deleted_conversations`
--
ALTER TABLE `deleted_conversations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `conversationId_user_UNIQUE` (`conversation_id`,`users_id`);

--
-- Chỉ mục cho bảng `deleted_messages`
--
ALTER TABLE `deleted_messages`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `devices`
--
ALTER TABLE `devices`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `devicesId_user_UNIQUE` (`device_id`,`users_id`);

--
-- Chỉ mục cho bảng `groupmembers`
--
ALTER TABLE `groupmembers`
  ADD PRIMARY KEY (`user_id`,`group_id`),
  ADD UNIQUE KEY `group_id_user_last_reports_UNIQUE` (`group_id`,`user_id`,`last_id`);

--
-- Chỉ mục cho bảng `groups`
--
ALTER TABLE `groups`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `group_sender_partic_UNIQUE` (`group_id`,`sender_id`,`participants_id`);

--
-- Chỉ mục cho bảng `participants`
--
ALTER TABLE `participants`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `conversation_users_id_UNIQUE` (`conversation_id`,`users_id`);

--
-- Chỉ mục cho bảng `product_counts`
--
ALTER TABLE `product_counts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_counts_color_id_foreign` (`color_id`) USING BTREE,
  ADD KEY `product_counts_size_id_foreign` (`size_id`) USING BTREE,
  ADD KEY `product_counts_product_id_foreign` (`product_id`) USING BTREE;

--
-- Chỉ mục cho bảng `reports`
--
ALTER TABLE `reports`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `participantsId_user_reports_UNIQUE` (`participants_id`,`users_id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `phone_UNIQUE` (`phone`),
  ADD UNIQUE KEY `email_UNIQUE` (`email`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `block_list`
--
ALTER TABLE `block_list`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT cho bảng `contacts`
--
ALTER TABLE `contacts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Sync the contacts to this table', AUTO_INCREMENT=14;
--
-- AUTO_INCREMENT cho bảng `conversation`
--
ALTER TABLE `conversation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT cho bảng `deleted_messages`
--
ALTER TABLE `deleted_messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT cho bảng `devices`
--
ALTER TABLE `devices`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT cho bảng `groups`
--
ALTER TABLE `groups`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT cho bảng `participants`
--
ALTER TABLE `participants`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
--
-- AUTO_INCREMENT cho bảng `product_counts`
--
ALTER TABLE `product_counts`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT cho bảng `reports`
--
ALTER TABLE `reports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;
--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `contacts`
--
ALTER TABLE `contacts`
  ADD CONSTRAINT `contacts` FOREIGN KEY (`users_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Các ràng buộc cho bảng `product_counts`
--
ALTER TABLE `product_counts`
  ADD CONSTRAINT `product_counts_ibfk_1` FOREIGN KEY (`color_id`) REFERENCES `product_colors` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `product_counts_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `product_counts_ibfk_3` FOREIGN KEY (`size_id`) REFERENCES `product_sizes` (`id`) ON DELETE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
