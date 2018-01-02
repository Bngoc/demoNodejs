/*
Navicat MySQL Data Transfer

Source Server         : LOCALHOST
Source Server Version : 50505
Source Host           : localhost:3306
Source Database       : mvcnodejs

Target Server Type    : MYSQL
Target Server Version : 50505
File Encoding         : 65001

Date: 2018-01-02 17:36:21
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for access
-- ----------------------------
DROP TABLE IF EXISTS `access`;
CREATE TABLE `access` (
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

-- ----------------------------
-- Records of access
-- ----------------------------

-- ----------------------------
-- Table structure for block_list
-- ----------------------------
DROP TABLE IF EXISTS `block_list`;
CREATE TABLE `block_list` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `users_id` int(11) NOT NULL,
  `prevent_participant` int(11) NOT NULL,
  `conversation_id` int(11) NOT NULL,
  `is_single_group` tinyint(4) NOT NULL DEFAULT '0',
  `is_deleted` tinyint(1) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `participantsId_user_UNIQUE` (`prevent_participant`,`users_id`,`conversation_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of block_list
-- ----------------------------
INSERT INTO `block_list` VALUES ('2', '2', '12', '2', '0', '0', '2017-12-01 19:06:28', '2017-12-01 19:06:28');
INSERT INTO `block_list` VALUES ('3', '2', '6', '3', '1', '0', '2018-01-02 09:34:32', '2018-01-02 09:34:32');
INSERT INTO `block_list` VALUES ('5', '2', '12', '3', '1', '0', '2018-01-02 11:48:02', '2018-01-02 11:48:02');

-- ----------------------------
-- Table structure for contacts
-- ----------------------------
DROP TABLE IF EXISTS `contacts`;
CREATE TABLE `contacts` (
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
  `path_img` varchar(255) DEFAULT NULL,
  `path_img_group` varchar(255) DEFAULT NULL,
  `bookmarks` tinytext,
  `cfg_chat` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `contacts_users_id_UNIQUE` (`users_id`),
  CONSTRAINT `contacts` FOREIGN KEY (`users_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of contacts
-- ----------------------------
INSERT INTO `contacts` VALUES ('1', '1', 'bqngoc119', 'bqngoc119 undefined', null, null, null, null, '23', '2', '1', null, null, null, '{\"color\":{\"send\":\"#435f7a\",\"replies\":\"#f5f5f5\"},\"animal\":{\"scrollEnd\":1000},\"class_undefined\":\"undefined\",\"img_single_user\":\"/images/users.png\",\"img_group_user\":\"/images/group.png\",\"mood_message_request\":\"User not share information\",\"mood_message_responsive\":\"xxxxxxxxxxxxxxxxxxxxxxxxxxxxx\",\"page_size_number\":20,\"status_single\":\"single\",\"status_hidden_name\":\"hidden\",\"status_hidden_name_replace\":\"offline\"}', '2017-11-30 01:59:17', '2017-12-29 10:04:10');
INSERT INTO `contacts` VALUES ('2', '2', 'bqngoc110', 'bqngoc110 undefined', null, null, null, null, '3', '0', '0', null, null, null, '{\"color\":{\"send\":\"#435f7a\",\"replies\":\"#f5f5f5\"},\"animal\":{\"scrollEnd\":1000},\"class_undefined\":\"undefined\",\"img_single_user\":\"/images/users.png\",\"img_group_user\":\"/images/group.png\",\"mood_message_request\":\"User not share information\",\"mood_message_responsive\":\"xxxxxxxxxxxxxxxxxxxxxxxxxxxxx\",\"page_size_number\":20,\"status_single\":\"single\",\"status_hidden_name\":\"hidden\",\"status_hidden_name_replace\":\"offline\"}', '2017-11-30 02:03:06', '2017-12-03 18:39:00');
INSERT INTO `contacts` VALUES ('3', '3', 'bqngoc118', 'bqngoc118 undefined', null, null, null, null, '22', '3', '0', null, null, null, '{\"color\":{\"send\":\"#435f7a\",\"replies\":\"#f5f5f5\"},\"animal\":{\"scrollEnd\":1000},\"class_undefined\":\"undefined\",\"img_single_user\":\"/images/users.png\",\"img_group_user\":\"/images/group.png\",\"mood_message_request\":\"User not share information\",\"mood_message_responsive\":\"xxxxxxxxxxxxxxxxxxxxxxxxxxxxx\",\"page_size_number\":20,\"status_single\":\"single\",\"status_hidden_name\":\"hidden\",\"status_hidden_name_replace\":\"offline\"}', '2017-11-30 02:04:54', '2017-11-30 02:04:54');
INSERT INTO `contacts` VALUES ('4', '4', 'bqngoc11229', 'bqngoc11229 undefine', null, null, null, null, 'r', '1', '0', null, null, null, '{\"color\":{\"send\":\"#435f7a\",\"replies\":\"#f5f5f5\"},\"animal\":{\"scrollEnd\":1000},\"class_undefined\":\"undefined\",\"img_single_user\":\"/images/users.png\",\"img_group_user\":\"/images/group.png\",\"mood_message_request\":\"User not share information\",\"mood_message_responsive\":\"xxxxxxxxxxxxxxxxxxxxxxxxxxxxx\",\"page_size_number\":20,\"status_single\":\"single\",\"status_hidden_name\":\"hidden\",\"status_hidden_name_replace\":\"offline\"}', '2017-11-30 02:05:28', '2017-11-30 02:05:28');
INSERT INTO `contacts` VALUES ('5', '5', 'BuiNgoc1', 'BuiNgoc1 undefined', null, null, null, null, 'ư', '2', '1', null, null, null, '{\"color\":{\"send\":\"#435f7a\",\"replies\":\"#f5f5f5\"},\"animal\":{\"scrollEnd\":1000},\"class_undefined\":\"undefined\",\"img_single_user\":\"/images/users.png\",\"img_group_user\":\"/images/group.png\",\"mood_message_request\":\"User not share information\",\"mood_message_responsive\":\"xxxxxxxxxxxxxxxxxxxxxxxxxxxxx\",\"page_size_number\":20,\"status_single\":\"single\",\"status_hidden_name\":\"hidden\",\"status_hidden_name_replace\":\"offline\"}', '2017-11-30 02:07:13', '2017-12-29 08:18:06');
INSERT INTO `contacts` VALUES ('6', '6', 'gsgewq', 'gsgewq undefined', null, null, null, null, 'r', '2', '1', null, null, null, '{\"color\":{\"send\":\"#435f7a\",\"replies\":\"#f5f5f5\"},\"animal\":{\"scrollEnd\":1000},\"class_undefined\":\"undefined\",\"img_single_user\":\"/images/users.png\",\"img_group_user\":\"/images/group.png\",\"mood_message_request\":\"User not share information\",\"mood_message_responsive\":\"xxxxxxxxxxxxxxxxxxxxxxxxxxxxx\",\"page_size_number\":20,\"status_single\":\"single\",\"status_hidden_name\":\"hidden\",\"status_hidden_name_replace\":\"offline\"}', '2017-11-30 02:09:07', '2017-12-29 02:36:22');
INSERT INTO `contacts` VALUES ('7', '7', 'few4w4', 'few4w4 undefined', null, null, null, null, 'r', '4', '0', null, null, null, '{\"color\":{\"send\":\"#435f7a\",\"replies\":\"#f5f5f5\"},\"animal\":{\"scrollEnd\":1000},\"class_undefined\":\"undefined\",\"img_single_user\":\"/images/users.png\",\"img_group_user\":\"/images/group.png\",\"mood_message_request\":\"User not share information\",\"mood_message_responsive\":\"xxxxxxxxxxxxxxxxxxxxxxxxxxxxx\",\"page_size_number\":20,\"status_single\":\"single\",\"status_hidden_name\":\"hidden\",\"status_hidden_name_replace\":\"offline\"}', '2017-11-30 02:17:17', '2017-11-30 02:17:17');
INSERT INTO `contacts` VALUES ('8', '8', 'ewew434', 'ewew434 undefined', null, null, null, null, 'rrw', '2', '0', null, null, null, '{\"color\":{\"send\":\"#435f7a\",\"replies\":\"#f5f5f5\"},\"animal\":{\"scrollEnd\":1000},\"class_undefined\":\"undefined\",\"img_single_user\":\"/images/users.png\",\"img_group_user\":\"/images/group.png\",\"mood_message_request\":\"User not share information\",\"mood_message_responsive\":\"xxxxxxxxxxxxxxxxxxxxxxxxxxxxx\",\"page_size_number\":20,\"status_single\":\"single\",\"status_hidden_name\":\"hidden\",\"status_hidden_name_replace\":\"offline\"}', '2017-11-30 02:17:39', '2017-11-30 02:17:39');
INSERT INTO `contacts` VALUES ('9', '9', '98912315069', '98912315069 undefine', null, null, null, null, 'rưư', '4', '0', null, null, null, '{\"color\":{\"send\":\"#435f7a\",\"replies\":\"#f5f5f5\"},\"animal\":{\"scrollEnd\":1000},\"class_undefined\":\"undefined\",\"img_single_user\":\"/images/users.png\",\"img_group_user\":\"/images/group.png\",\"mood_message_request\":\"User not share information\",\"mood_message_responsive\":\"xxxxxxxxxxxxxxxxxxxxxxxxxxxxx\",\"page_size_number\":20,\"status_single\":\"single\",\"status_hidden_name\":\"hidden\",\"status_hidden_name_replace\":\"offline\"}', '2017-11-30 02:18:26', '2017-11-30 02:18:26');
INSERT INTO `contacts` VALUES ('10', '10', 'BuiNgocewewe', 'BuiNgocewewe undefin', null, null, null, null, 'rử', '1', '0', null, null, null, '{\"color\":{\"send\":\"#435f7a\",\"replies\":\"#f5f5f5\"},\"animal\":{\"scrollEnd\":1000},\"class_undefined\":\"undefined\",\"img_single_user\":\"/images/users.png\",\"img_group_user\":\"/images/group.png\",\"mood_message_request\":\"User not share information\",\"mood_message_responsive\":\"xxxxxxxxxxxxxxxxxxxxxxxxxxxxx\",\"page_size_number\":20,\"status_single\":\"single\",\"status_hidden_name\":\"hidden\",\"status_hidden_name_replace\":\"offline\"}', '2017-11-30 02:19:35', '2017-11-30 02:19:35');
INSERT INTO `contacts` VALUES ('11', '11', 'buingoc119', '', 'xxx-xx', null, null, null, null, '3', '0', null, null, null, '{\"color\":{\"send\":\"#435f7a\",\"replies\":\"#f5f5f5\"},\"animal\":{\"scrollEnd\":1000},\"class_undefined\":\"undefined\",\"img_single_user\":\"/images/users.png\",\"img_group_user\":\"/images/group.png\",\"mood_message_request\":\"User not share information\",\"mood_message_responsive\":\"xxxxxxxxxxxxxxxxxxxxxxxxxxxxx\",\"page_size_number\":20,\"status_single\":\"single\",\"status_hidden_name\":\"hidden\",\"status_hidden_name_replace\":\"offline\"}', '2017-11-30 15:11:51', '2017-11-30 17:11:29');
INSERT INTO `contacts` VALUES ('12', '12', 'bqngoc119', 'bqngoc119 xxx-xx', 'xxx-xx', null, null, null, null, '2', '1', null, null, null, '{\"color\":{\"send\":\"#435f7a\",\"replies\":\"#f5f5f5\"},\"animal\":{\"scrollEnd\":1000},\"class_undefined\":\"undefined\",\"img_single_user\":\"/images/users.png\",\"img_group_user\":\"/images/group.png\",\"mood_message_request\":\"User not share information\",\"mood_message_responsive\":\"xxxxxxxxxxxxxxxxxxxxxxxxxxxxx\",\"page_size_number\":20,\"status_single\":\"single\",\"status_hidden_name\":\"hidden\",\"status_hidden_name_replace\":\"offline\"}', '2017-12-01 12:23:12', '2018-01-02 10:14:04');
INSERT INTO `contacts` VALUES ('13', '13', 'BuiNgoc', 'BuiNgoc xxx-xx', 'xxx-xx', null, null, null, null, '0', '0', null, null, null, '{\"color\":{\"send\":\"#435f7a\",\"replies\":\"#f5f5f5\"},\"animal\":{\"scrollEnd\":1000},\"class_undefined\":\"undefined\",\"img_single_user\":\"/images/users.png\",\"img_group_user\":\"/images/group.png\",\"mood_message_request\":\"User not share information\",\"mood_message_responsive\":\"xxxxxxxxxxxxxxxxxxxxxxxxxxxxx\",\"page_size_number\":20,\"status_single\":\"single\",\"status_hidden_name\":\"hidden\",\"status_hidden_name_replace\":\"offline\"}', '2017-12-29 04:09:23', '2017-12-29 04:09:23');
INSERT INTO `contacts` VALUES ('14', '14', 'BuiNgoc112', 'BuiNgoc112 xxx-xx', 'xxx-xx', null, null, null, null, '0', '0', null, null, null, '{\"color\":{\"send\":\"#435f7a\",\"replies\":\"#f5f5f5\"},\"animal\":{\"scrollEnd\":1000},\"class_undefined\":\"undefined\",\"img_single_user\":\"/images/users.png\",\"img_group_user\":\"/images/group.png\",\"mood_message_request\":\"User not share information\",\"mood_message_responsive\":\"xxxxxxxxxxxxxxxxxxxxxxxxxxxxx\",\"page_size_number\":20,\"status_single\":\"single\",\"status_hidden_name\":\"hidden\",\"status_hidden_name_replace\":\"offline\"}', '2017-12-29 04:11:13', '2017-12-29 04:11:13');
INSERT INTO `contacts` VALUES ('15', '15', 'BuiNgoc321', 'BuiNgoc321 xxx-xx', 'xxx-xx', null, null, null, null, '0', '0', null, null, null, '{\"color\":{\"send\":\"#435f7a\",\"replies\":\"#f5f5f5\"},\"animal\":{\"scrollEnd\":1000},\"class_undefined\":\"undefined\",\"img_single_user\":\"/images/users.png\",\"img_group_user\":\"/images/group.png\",\"mood_message_request\":\"User not share information\",\"mood_message_responsive\":\"xxxxxxxxxxxxxxxxxxxxxxxxxxxxx\",\"page_size_number\":20,\"status_single\":\"single\",\"status_hidden_name\":\"hidden\",\"status_hidden_name_replace\":\"offline\"}', '2017-12-29 04:12:30', '2017-12-29 04:12:30');
INSERT INTO `contacts` VALUES ('16', '17', 'BuiNgoc123', 'BuiNgoc123 xxx-xx', 'xxx-xx', null, null, null, null, '0', '0', null, null, null, '{\"color\":{\"send\":\"#435f7a\",\"replies\":\"#f5f5f5\"},\"animal\":{\"scrollEnd\":1000},\"class_undefined\":\"undefined\",\"img_single_user\":\"/images/users.png\",\"img_group_user\":\"/images/group.png\",\"mood_message_request\":\"User not share information\",\"mood_message_responsive\":\"xxxxxxxxxxxxxxxxxxxxxxxxxxxxx\",\"page_size_number\":20,\"status_single\":\"single\",\"status_hidden_name\":\"hidden\",\"status_hidden_name_replace\":\"offline\"}', '2017-12-29 04:17:51', '2017-12-29 04:17:51');
INSERT INTO `contacts` VALUES ('17', '18', 'hfhf766943', 'hfhf766943 xxx-xx', 'xxx-xx', null, null, null, null, '0', '0', null, null, null, '{\"color\":{\"send\":\"#435f7a\",\"replies\":\"#f5f5f5\"},\"animal\":{\"scrollEnd\":1000},\"class_undefined\":\"undefined\",\"img_single_user\":\"/images/users.png\",\"img_group_user\":\"/images/group.png\",\"mood_message_request\":\"User not share information\",\"mood_message_responsive\":\"xxxxxxxxxxxxxxxxxxxxxxxxxxxxx\",\"page_size_number\":20,\"status_single\":\"single\",\"status_hidden_name\":\"hidden\",\"status_hidden_name_replace\":\"offline\"}', '2017-12-29 04:36:09', '2017-12-29 04:36:09');
INSERT INTO `contacts` VALUES ('18', '19', 'ngocbuiquang', 'ngocbuiquang xxx-xx', 'xxx-xx', null, null, null, null, '0', '0', null, null, null, '{\"color\":{\"send\":\"#435f7a\",\"replies\":\"#f5f5f5\"},\"animal\":{\"scrollEnd\":1000},\"class_undefined\":\"undefined\",\"img_single_user\":\"/images/users.png\",\"img_group_user\":\"/images/group.png\",\"mood_message_request\":\"User not share information\",\"mood_message_responsive\":\"xxxxxxxxxxxxxxxxxxxxxxxxxxxxx\",\"page_size_number\":20,\"status_single\":\"single\",\"status_hidden_name\":\"hidden\",\"status_hidden_name_replace\":\"offline\"}', '2017-12-29 07:38:10', '2017-12-29 07:38:10');

-- ----------------------------
-- Table structure for conversation
-- ----------------------------
DROP TABLE IF EXISTS `conversation`;
CREATE TABLE `conversation` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(40) DEFAULT NULL,
  `creator_id` int(11) NOT NULL,
  `channel_id` varchar(45) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `is_deleted` tinyint(1) DEFAULT '0',
  `deleted_users_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of conversation
-- ----------------------------
INSERT INTO `conversation` VALUES ('1', 'cncnccnc', '12', 'r3f32ew33', '2017-12-01 19:07:02', '2017-12-01 19:07:02', '0', null);
INSERT INTO `conversation` VALUES ('2', 'nc', '2', 'ccccccc3t', '2017-12-01 19:07:02', '2017-12-01 19:07:02', '0', null);
INSERT INTO `conversation` VALUES ('3', 'ncncnc', '2', '44534533h', '2017-12-01 19:07:02', '2017-12-01 19:07:02', '0', null);
INSERT INTO `conversation` VALUES ('4', 'hrjrjr', '12', '53636433y', '2017-12-01 19:07:36', '2017-12-01 19:07:36', '0', null);
INSERT INTO `conversation` VALUES ('5', 'jrjfm,h', '6', '54yrnf23xx', '2017-12-01 19:07:36', '2017-12-01 19:07:36', '0', null);
INSERT INTO `conversation` VALUES ('6', '6666666', '4', '666666', '2018-01-02 10:52:11', '2018-01-02 10:52:11', '0', null);

-- ----------------------------
-- Table structure for deleted_conversations
-- ----------------------------
DROP TABLE IF EXISTS `deleted_conversations`;
CREATE TABLE `deleted_conversations` (
  `id` int(11) NOT NULL,
  `conversation_id` int(11) NOT NULL,
  `users_id` int(11) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `is_deleted` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `conversationId_user_UNIQUE` (`conversation_id`,`users_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of deleted_conversations
-- ----------------------------

-- ----------------------------
-- Table structure for deleted_messages
-- ----------------------------
DROP TABLE IF EXISTS `deleted_messages`;
CREATE TABLE `deleted_messages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `messages_id` int(11) NOT NULL,
  `users_id` int(11) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `is_deleted` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of deleted_messages
-- ----------------------------
INSERT INTO `deleted_messages` VALUES ('1', '2', '6', '2017-12-25 13:24:53', '2017-12-25 13:24:53', '1');
INSERT INTO `deleted_messages` VALUES ('2', '3', '12', '2017-12-25 14:07:46', '2017-12-25 14:07:46', '1');
INSERT INTO `deleted_messages` VALUES ('3', '4', '12', '2017-12-25 15:38:25', '2017-12-25 15:38:25', '1');

-- ----------------------------
-- Table structure for devices
-- ----------------------------
DROP TABLE IF EXISTS `devices`;
CREATE TABLE `devices` (
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

-- ----------------------------
-- Records of devices
-- ----------------------------

-- ----------------------------
-- Table structure for groupmembers
-- ----------------------------
DROP TABLE IF EXISTS `groupmembers`;
CREATE TABLE `groupmembers` (
  `user_id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL,
  `last_id` int(11) NOT NULL,
  PRIMARY KEY (`user_id`,`group_id`),
  UNIQUE KEY `group_id_user_last_reports_UNIQUE` (`group_id`,`user_id`,`last_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of groupmembers
-- ----------------------------

-- ----------------------------
-- Table structure for groups
-- ----------------------------
DROP TABLE IF EXISTS `groups`;
CREATE TABLE `groups` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(256) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of groups
-- ----------------------------

-- ----------------------------
-- Table structure for messages
-- ----------------------------
DROP TABLE IF EXISTS `messages`;
CREATE TABLE `messages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `conversation_id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `participants_id` tinytext NOT NULL,
  `message_type` enum('text','image','vedio','audio') DEFAULT NULL,
  `message` varchar(255) DEFAULT NULL,
  `attachment_thumb_url` varchar(255) DEFAULT NULL,
  `attachment_url` varchar(255) DEFAULT NULL,
  `guid` enum('group','single') DEFAULT NULL,
  `is_single_group` tinyint(1) DEFAULT '0',
  `is_deleted` varchar(45) DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=92 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of messages
-- ----------------------------
INSERT INTO `messages` VALUES ('1', '3', '12', '5', 'text', ' gddgd ge g  g', null, null, 'group', '1', '0', '2017-12-25 09:38:50', '2017-12-25 09:38:50');
INSERT INTO `messages` VALUES ('2', '3', '6', '6', 'text', 'http://emilcarlsson.se/assets/donnapaulsen.png\" alt=\"\"></div>\'', null, null, 'group', '1', '0', '2017-12-25 09:37:06', '2017-12-25 09:37:06');
INSERT INTO `messages` VALUES ('4', '3', '12', '6', 'text', 'e mới đẩy phần fix 118 lên a xem giúp e nhé, hnay e xin phép về sớm 30p', null, null, 'group', '1', '0', '2017-12-25 13:06:05', '2017-12-25 13:06:05');
INSERT INTO `messages` VALUES ('5', '3', '12', '3', 'text', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', null, null, 'group', '0', '1', '2017-12-25 13:08:03', '2017-12-25 13:08:03');
INSERT INTO `messages` VALUES ('6', '2', '12', '3', 'text', 'b gd g g', null, null, 'single', '0', '0', '2017-12-25 13:08:29', '2017-12-25 13:08:29');
INSERT INTO `messages` VALUES ('7', '2', '3', '12', 'text', '34535', null, null, 'single', '0', '0', '2017-12-25 13:08:37', '2017-12-25 13:08:37');
INSERT INTO `messages` VALUES ('8', '3', '6', '12', 'text', 'gdgdgdd gdgd5634', null, null, 'group', '1', '0', '2017-12-25 12:57:12', '2017-12-25 12:57:12');
INSERT INTO `messages` VALUES ('9', '3', '6', '12', 'text', 'his.convertHtmlToPlainText(objElement.message) + \'</p></div></div></li>\';', null, null, 'group', '0', '0', '2017-12-26 08:45:31', '2017-12-26 08:45:31');
INSERT INTO `messages` VALUES ('10', '3', '12', '11', 'text', 'his.supportHtmlTextAppend(objElement, reqOption);', null, null, 'group', '1', '0', '2017-12-26 08:46:35', '2017-12-26 08:46:35');
INSERT INTO `messages` VALUES ('11', '3', '12', '5,6,8,2,7', 'text', 'jhkbh', null, null, 'group', '1', '0', '2017-12-27 01:37:44', '2017-12-27 01:37:44');
INSERT INTO `messages` VALUES ('12', '3', '12', '5,6,8,2,7', 'text', 'lkgoik', null, null, 'group', '1', '0', '2017-12-27 01:37:46', '2017-12-27 01:37:46');
INSERT INTO `messages` VALUES ('13', '4', '12', '6', 'text', 'hbkhblkjnlk bouygou', null, null, 'single', '0', '0', '2017-12-27 01:38:02', '2017-12-27 01:38:02');
INSERT INTO `messages` VALUES ('14', '4', '12', '6', 'text', 'uuiguir89 ig rtub786t8i', null, null, 'single', '0', '0', '2017-12-27 01:38:06', '2017-12-27 01:38:06');
INSERT INTO `messages` VALUES ('15', '3', '12', '5,6,8,2,7', 'text', ']\\]\\]\\]\\', null, null, 'group', '1', '0', '2017-12-27 02:21:14', '2017-12-27 02:21:14');
INSERT INTO `messages` VALUES ('16', '3', '12', '5,6,8,2,7', 'text', 'gdrghd', null, null, 'group', '1', '0', '2017-12-27 03:58:34', '2017-12-27 03:58:34');
INSERT INTO `messages` VALUES ('17', '3', '6', '2,5,7,8,12', 'text', 'gdgdg', null, null, 'group', '1', '0', '2017-12-27 03:58:39', '2017-12-27 03:58:39');
INSERT INTO `messages` VALUES ('18', '3', '6', '2,5,7,8,12', 'text', 'sggs', null, null, 'group', '1', '0', '2017-12-27 03:59:51', '2017-12-27 03:59:51');
INSERT INTO `messages` VALUES ('19', '3', '12', '5,6,8,2,7', 'text', 'gsfgsg', null, null, 'group', '1', '0', '2017-12-27 07:26:58', '2017-12-27 07:26:58');
INSERT INTO `messages` VALUES ('20', '3', '12', '5,6,8,2,7', 'text', 'pij pgsj[psj[pgj', null, null, 'group', '1', '0', '2017-12-27 07:30:59', '2017-12-27 07:30:59');
INSERT INTO `messages` VALUES ('21', '3', '12', '5,6,8,2,7', 'text', 's [pgo[spg', null, null, 'group', '1', '0', '2017-12-27 07:31:01', '2017-12-27 07:31:01');
INSERT INTO `messages` VALUES ('22', '3', '6', '2,5,7,8,12', 'text', 'pnsoijsjijo jkm jijwiw', null, null, 'group', '1', '0', '2017-12-27 07:31:25', '2017-12-27 07:31:25');
INSERT INTO `messages` VALUES ('23', '1', '12', '5', 'text', 'sdgs', null, null, 'single', '0', '0', '2017-12-27 08:27:30', '2017-12-27 08:27:30');
INSERT INTO `messages` VALUES ('24', '3', '12', '5,6,8,2,7', 'text', 'jjsgoi sjoisjgois josigjo igoej', null, null, 'group', '1', '0', '2017-12-29 01:59:15', '2017-12-29 01:59:15');
INSERT INTO `messages` VALUES ('25', '3', '12', '5,6,8,2,7', 'text', 'pwiojoew jw', null, null, 'group', '1', '0', '2017-12-29 01:59:16', '2017-12-29 01:59:16');
INSERT INTO `messages` VALUES ('26', '3', '12', '5,6,8,2,7', 'text', 'tw tjpwtijpwtjwoptjowtujo0w twwj', null, null, 'group', '1', '0', '2017-12-29 01:59:19', '2017-12-29 01:59:19');
INSERT INTO `messages` VALUES ('27', '3', '12', '5,6,8,2,7', 'text', 'wptokwt', null, null, 'group', '1', '0', '2017-12-29 01:59:20', '2017-12-29 01:59:20');
INSERT INTO `messages` VALUES ('28', '3', '12', '5,6,8,2,7', 'text', 't[ wtw', null, null, 'group', '1', '0', '2017-12-29 01:59:21', '2017-12-29 01:59:21');
INSERT INTO `messages` VALUES ('29', '3', '6', '2,5,7,8,12', 'text', 'slj;lsueor ielfnsklfsftusewy hskngsng siusyhngksyhafor', null, null, 'group', '1', '0', '2017-12-29 01:59:56', '2017-12-29 01:59:56');
INSERT INTO `messages` VALUES ('30', '3', '6', '2,5,7,8,12', 'text', 'n pewtjoiwut08w hrwntglkwgoiwughwnkopgypo', null, null, 'group', '1', '0', '2017-12-29 02:00:06', '2017-12-29 02:00:06');
INSERT INTO `messages` VALUES ('31', '3', '12', '5,6,8,2,7', 'text', ';ewthpniwenm;lewtnwk hwpero kjngo ow ingl', null, null, 'group', '1', '0', '2017-12-29 02:00:27', '2017-12-29 02:00:27');
INSERT INTO `messages` VALUES ('32', '3', '12', '5,6,8,2,7', 'text', 'lkhglknwgkjgy oin,lgmjlhjgkjng', null, null, 'group', '1', '0', '2017-12-29 02:00:30', '2017-12-29 02:00:30');
INSERT INTO `messages` VALUES ('33', '3', '12', '5,6,8,2,7', 'text', '] shgkjsgolkshg ksljnmnsgksjoiutyg hoswh ouhtoiewu hlkwbgwjg siwugh knwg', null, null, 'group', '1', '0', '2017-12-29 02:00:34', '2017-12-29 02:00:34');
INSERT INTO `messages` VALUES ('34', '3', '5', '12,6,8,2,7', 'text', 'j;sktsgns8togj slm sgjnspgu-s0g slgs;lngs,gsotgs jglkns,gsgsgusg', null, null, 'group', '1', '0', '2017-12-29 02:03:35', '2017-12-29 02:03:35');
INSERT INTO `messages` VALUES ('35', '3', '5', '12,6,8,2,7', 'text', 'sgjslg sjog8su gskjngskgsg9sgsjgn jslgnsgksnjgs89ggknsjgsg\'gsg', null, null, 'group', '1', '0', '2017-12-29 02:03:40', '2017-12-29 02:03:40');
INSERT INTO `messages` VALUES ('36', '3', '5', '12,6,8,2,7', 'text', 'sgsgmslg sj0g9sgjsg', null, null, 'group', '1', '0', '2017-12-29 02:03:42', '2017-12-29 02:03:42');
INSERT INTO `messages` VALUES ('37', '3', '5', '12,6,8,2,7', 'text', 'sgsgsogs8g ss', null, null, 'group', '1', '0', '2017-12-29 02:03:43', '2017-12-29 02:03:43');
INSERT INTO `messages` VALUES ('38', '3', '5', '12,6,8,2,7', 'text', 'g sgls', null, null, 'group', '1', '0', '2017-12-29 02:03:43', '2017-12-29 02:03:43');
INSERT INTO `messages` VALUES ('39', '3', '5', '12,6,8,2,7', 'text', 'g sgsgsgsgsgs spgs90g sgjslnmg sg sgu sgusgpsoijgopsug98su gsjgopsig98s ]', null, null, 'group', '1', '0', '2017-12-29 02:03:49', '2017-12-29 02:03:49');
INSERT INTO `messages` VALUES ('40', '3', '5', '12,6,8,2,7', 'text', 'gs lhopswtgny w', null, null, 'group', '1', '0', '2017-12-29 02:04:35', '2017-12-29 02:04:35');
INSERT INTO `messages` VALUES ('41', '3', '12', '5,6,8,2,7', 'text', ';ljn stsot9suj s;lmsjlgks gs90 igksmgksmgks', null, null, 'group', '1', '0', '2017-12-29 02:04:56', '2017-12-29 02:04:56');
INSERT INTO `messages` VALUES ('42', '3', '12', '5,6,8,2,7', 'text', 'gskj nlgs8gusoglkns,gswgsyhpogsh;g', null, null, 'group', '1', '0', '2017-12-29 02:05:20', '2017-12-29 02:05:20');
INSERT INTO `messages` VALUES ('43', '3', '5', '12,6,8,2,7', 'text', 'uojlk4jmt98ugdnjmssk sg skgsg90s0gisgsg', null, null, 'group', '1', '0', '2017-12-29 02:05:34', '2017-12-29 02:05:34');
INSERT INTO `messages` VALUES ('44', '3', '5', '12,6,8,2,7', 'text', '89uiogj slsg-s90g-9si', null, null, 'group', '1', '0', '2017-12-29 02:05:55', '2017-12-29 02:05:55');
INSERT INTO `messages` VALUES ('45', '3', '5', '12,6,8,2,7', 'text', 'gsgsgsg sgss g', null, null, 'group', '1', '0', '2017-12-29 02:06:02', '2017-12-29 02:06:02');
INSERT INTO `messages` VALUES ('46', '3', '6', '2,5,7,8,12', 'text', '9395909350 930395i03950395039', null, null, 'group', '1', '0', '2017-12-29 02:06:18', '2017-12-29 02:06:18');
INSERT INTO `messages` VALUES ('47', '3', '6', '2,5,7,8,12', 'text', 't wetw7580w tjwgewgter09850 94p5y6k4jo64', null, null, 'group', '1', '0', '2017-12-29 02:06:28', '2017-12-29 02:06:28');
INSERT INTO `messages` VALUES ('48', '3', '6', '2,5,7,8,12', 'text', 'g987u945ui696406i4p64;646', null, null, 'group', '1', '0', '2017-12-29 02:06:39', '2017-12-29 02:06:39');
INSERT INTO `messages` VALUES ('49', '3', '5', '12,6,8,2,7', 'text', 'ihto ikt59345934053 435t3534343 9999999999999999999999999999', null, null, 'group', '1', '0', '2017-12-29 02:08:49', '2017-12-29 02:08:49');
INSERT INTO `messages` VALUES ('50', '3', '5', '12,6,8,2,7', 'text', '99999999999999999999999999999999999999', null, null, 'group', '1', '0', '2017-12-29 02:10:19', '2017-12-29 02:10:19');
INSERT INTO `messages` VALUES ('51', '3', '5', '12,6,8,2,7', 'text', '1111111111111111111111111111111111111111111', null, null, 'group', '1', '0', '2017-12-29 02:14:29', '2017-12-29 02:14:29');
INSERT INTO `messages` VALUES ('52', '3', '5', '12,6,8,2,7', 'text', '00000000000000000000000000000', null, null, 'group', '1', '0', '2017-12-29 02:30:22', '2017-12-29 02:30:22');
INSERT INTO `messages` VALUES ('53', '3', '5', '12,6,8,2,7', 'text', '32542353643643', null, null, 'group', '1', '0', '2017-12-29 02:35:33', '2017-12-29 02:35:33');
INSERT INTO `messages` VALUES ('54', '3', '6', '2,5,7,8,12', 'text', '343234464646475879797', null, null, 'group', '1', '0', '2017-12-29 02:35:47', '2017-12-29 02:35:47');
INSERT INTO `messages` VALUES ('55', '3', '12', '5,6,8,2,7', 'text', 'srlgj sowghj ;lkmb,lm bnsd908uw[pgmbd', null, null, 'group', '1', '0', '2017-12-29 02:39:41', '2017-12-29 02:39:41');
INSERT INTO `messages` VALUES ('56', '3', '12', '5,6,8,2,7', 'text', ';no38606 gmg[lkmi609 345to3n gdbknd o3639 u', null, null, 'group', '1', '0', '2017-12-29 02:39:55', '2017-12-29 02:39:55');
INSERT INTO `messages` VALUES ('57', '3', '12', '5,6,8,2,7', 'text', 'de5e54453534', null, null, 'group', '1', '0', '2017-12-29 02:42:19', '2017-12-29 02:42:19');
INSERT INTO `messages` VALUES ('58', '3', '12', '5,6,8,2,7', 'text', 'gddgd', null, null, 'group', '1', '0', '2017-12-29 02:49:04', '2017-12-29 02:49:04');
INSERT INTO `messages` VALUES ('59', '3', '12', '5,6,8,2,7', 'text', 'gdg564', null, null, 'group', '1', '0', '2017-12-29 02:49:07', '2017-12-29 02:49:07');
INSERT INTO `messages` VALUES ('60', '3', '5', '12,6,8,2,7', 'text', '434646', null, null, 'group', '1', '0', '2017-12-29 02:49:22', '2017-12-29 02:49:22');
INSERT INTO `messages` VALUES ('61', '3', '5', '12,6,8,2,7', 'text', '65476464645', null, null, 'group', '1', '0', '2017-12-29 02:49:36', '2017-12-29 02:49:36');
INSERT INTO `messages` VALUES ('62', '3', '12', '5,6,8,2,7', 'text', '454546443535', null, null, 'group', '1', '0', '2017-12-29 02:52:59', '2017-12-29 02:52:59');
INSERT INTO `messages` VALUES ('63', '3', '5', '12,6,8,2,7', 'text', '111111111111111', null, null, 'group', '1', '0', '2017-12-29 02:53:42', '2017-12-29 02:53:42');
INSERT INTO `messages` VALUES ('64', '3', '12', '5,6,8,2,7', 'text', 'dfgdgdgdgdg dgdgdgd gd', null, null, 'group', '1', '0', '2017-12-29 03:19:41', '2017-12-29 03:19:41');
INSERT INTO `messages` VALUES ('65', '3', '12', '5,6,8,2,7', 'text', '245665656565656', null, null, 'group', '1', '0', '2017-12-29 03:20:54', '2017-12-29 03:20:54');
INSERT INTO `messages` VALUES ('66', '3', '12', '5,6,8,2,7', 'text', '545454545', null, null, 'group', '1', '0', '2017-12-29 03:22:33', '2017-12-29 03:22:33');
INSERT INTO `messages` VALUES ('67', '3', '12', '5,6,8,2,7', 'text', 'lkjn;lkg; l3wpoi5u[ wmg\'dgg', null, null, 'group', '1', '0', '2017-12-29 03:25:03', '2017-12-29 03:25:03');
INSERT INTO `messages` VALUES ('68', '3', '12', '5,6,8,2,7', 'text', 'fslknfgs;lkbgspwtyw[gns,mgf;slgsoghs', null, null, 'group', '1', '0', '2017-12-29 03:25:15', '2017-12-29 03:25:15');
INSERT INTO `messages` VALUES ('69', '3', '12', '5,6,8,2,7', 'text', 'rgduhgdlgdpo ghspgs;lmgkss', null, null, 'group', '1', '0', '2017-12-29 07:43:28', '2017-12-29 07:43:28');
INSERT INTO `messages` VALUES ('70', '3', '12', '5,6,8,2,7', 'text', '\\gsglshj gpsjgpsnyg90 sgjs;gsbuyog', null, null, 'group', '1', '0', '2017-12-29 07:43:31', '2017-12-29 07:43:31');
INSERT INTO `messages` VALUES ('71', '3', '5', '12,6,8,2,7', 'text', 'lhwpnt8uywpngs;gknswotuspgjs;gjsonughspogns;\'', null, null, 'group', '1', '0', '2017-12-29 07:43:49', '2017-12-29 07:43:49');
INSERT INTO `messages` VALUES ('72', '3', '5', '12,6,8,2,7', 'text', ']s eposiopgsijgsgs gosughsegojsg', null, null, 'group', '1', '0', '2017-12-29 07:43:51', '2017-12-29 07:43:51');
INSERT INTO `messages` VALUES ('73', '3', '12', '5,6,8,2,7', 'text', 'g drgjsps[gjsnt8ug s0ojslgksg8', null, null, 'group', '1', '0', '2017-12-29 07:52:44', '2017-12-29 07:52:44');
INSERT INTO `messages` VALUES ('74', '1', '5', '12', 'text', 's,.lef psitpswintjpew50jlmsnfksjnfghsjslenpgo0y6- wogjsoingsoh', null, null, 'single', '0', '0', '2017-12-29 07:53:20', '2017-12-29 07:53:20');
INSERT INTO `messages` VALUES ('75', '1', '12', '5', 'text', 'j slknltnpeijpw4i5to j;lfknslknfsofisuofij slklklknj', null, null, 'single', '0', '0', '2017-12-29 07:54:21', '2017-12-29 07:54:21');
INSERT INTO `messages` VALUES ('76', '1', '5', '12', 'text', '57686868686868686', null, null, 'single', '0', '0', '2017-12-29 08:07:06', '2017-12-29 08:07:06');
INSERT INTO `messages` VALUES ('77', '1', '12', '5', 'text', 'hdthdhdh', null, null, 'single', '0', '0', '2017-12-29 08:07:16', '2017-12-29 08:07:16');
INSERT INTO `messages` VALUES ('78', '1', '5', '12', 'text', 'dgd gkd;g,d;gdgd', null, null, 'single', '0', '0', '2017-12-29 08:07:32', '2017-12-29 08:07:32');
INSERT INTO `messages` VALUES ('79', '1', '5', '12', 'text', 'gd', null, null, 'single', '0', '0', '2017-12-29 08:07:32', '2017-12-29 08:07:32');
INSERT INTO `messages` VALUES ('80', '1', '5', '12', 'text', 'gd gdgdgdgdg,d,gd;lgd', null, null, 'single', '0', '0', '2017-12-29 08:07:35', '2017-12-29 08:07:35');
INSERT INTO `messages` VALUES ('81', '1', '5', '12', 'text', 'gdg;dg;dgk;dlgmdmgdgdgd', null, null, 'single', '0', '0', '2017-12-29 08:07:37', '2017-12-29 08:07:37');
INSERT INTO `messages` VALUES ('82', '1', '5', '12', 'text', 'gdgdgdg', null, null, 'single', '0', '0', '2017-12-29 08:07:38', '2017-12-29 08:07:38');
INSERT INTO `messages` VALUES ('83', '1', '5', '12', 'text', 'feslkf bseklht;wnrslewfrk;lsejbiyhfrpsonfrslefs', null, null, 'single', '0', '0', '2017-12-29 08:17:18', '2017-12-29 08:17:18');
INSERT INTO `messages` VALUES ('84', '1', '5', '12', 'text', 'gdfg dgd[mrityj;dlgknldkjgbpdugdopgdg', null, null, 'single', '0', '0', '2017-12-29 08:17:31', '2017-12-29 08:17:31');
INSERT INTO `messages` VALUES ('85', '3', '12', '5,6,8,2,7', 'text', '\'[l],h d', null, null, 'group', '1', '0', '2017-12-29 08:18:23', '2017-12-29 08:18:23');
INSERT INTO `messages` VALUES ('86', '3', '12', '5,6,8,2,7', 'text', 'gd;\'mk;yknryj3n[5 t\'mg;lejtgope e[4tpoj;ege;rhe[t', null, null, 'group', '1', '0', '2017-12-29 08:18:27', '2017-12-29 08:18:27');
INSERT INTO `messages` VALUES ('87', '3', '12', '5,6,8,2,7', 'text', '\\', null, null, 'group', '1', '0', '2017-12-29 08:18:27', '2017-12-29 08:18:27');
INSERT INTO `messages` VALUES ('88', '3', '12', '5,6,8,2,7', 'text', 'mh n;riu 0-[5p4k t;lmrglkhghnegmd.ngliu opej5;,tntgprgheop ghnrlgn ree', null, null, 'group', '1', '0', '2017-12-29 08:18:31', '2017-12-29 08:18:31');
INSERT INTO `messages` VALUES ('89', '3', '12', '5,6,8,2,7', 'text', 'elktgjm elteoueljtmelgkne;teitop440jmke,mge,kng eit3eo5tu3lgm elgmnel i he9t8u 3;lt3m,tg to3itjol3jt3jt;l3nt3thpo3tuo3jtol3j4ti3hjoti u3p0o5tu3op jtp3otjpo3 jtp3u p3tpo3 tp3o tujp3tujp pto po3tp otp ptop tpo ptop 3o                                        ', null, null, 'group', '1', '0', '2017-12-29 08:19:10', '2017-12-29 08:19:10');
INSERT INTO `messages` VALUES ('90', '3', '12', '5,6,8,2,7', 'text', 'f slgj sg', null, null, 'group', '1', '0', '2017-12-29 09:37:45', '2017-12-29 09:37:45');
INSERT INTO `messages` VALUES ('91', '3', '12', '5,6,8,2,7', 'text', 'kj\n\n\n\n\n\n\n\n\n\n\nlksjlskgls', null, null, 'group', '1', '0', '2017-12-29 09:38:09', '2017-12-29 09:38:09');

-- ----------------------------
-- Table structure for participants
-- ----------------------------
DROP TABLE IF EXISTS `participants`;
CREATE TABLE `participants` (
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
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of participants
-- ----------------------------
INSERT INTO `participants` VALUES ('1', '1', '12', 'single', '0', '0', '2017-12-01 19:08:00', '2017-12-01 19:08:00');
INSERT INTO `participants` VALUES ('4', '2', '2', 'single', '1', '0', '2017-12-01 19:08:59', '2017-12-01 19:08:59');
INSERT INTO `participants` VALUES ('5', '3', '12', 'group', '0', '0', '2017-12-01 19:08:59', '2017-12-01 19:08:59');
INSERT INTO `participants` VALUES ('6', '4', '12', 'single', '0', '0', '2017-12-01 19:13:15', '2017-12-01 19:13:15');
INSERT INTO `participants` VALUES ('7', '4', '6', 'single', '0', '0', '2017-12-01 19:13:47', '2017-12-01 19:13:47');
INSERT INTO `participants` VALUES ('8', '1', '5', 'single', '0', '0', '2017-12-02 13:21:55', '2017-12-02 13:21:55');
INSERT INTO `participants` VALUES ('9', '3', '5', 'group', '0', '0', '2017-12-02 13:22:57', '2017-12-02 13:22:57');
INSERT INTO `participants` VALUES ('10', '3', '6', 'group', '0', '0', '2017-12-02 13:22:57', '2017-12-02 13:22:57');
INSERT INTO `participants` VALUES ('11', '2', '12', 'single', '1', '0', '2017-12-02 13:23:34', '2017-12-02 13:23:34');
INSERT INTO `participants` VALUES ('12', '3', '8', 'group', '0', '0', '2017-12-14 12:41:50', '2017-12-14 12:41:50');
INSERT INTO `participants` VALUES ('13', '3', '2', 'group', '0', '0', '2017-12-19 09:38:41', '2017-12-19 09:38:41');
INSERT INTO `participants` VALUES ('33', '6', '12', 'single', '1', '0', '2017-12-19 15:36:46', '2017-12-19 15:36:46');
INSERT INTO `participants` VALUES ('34', '6', '4', 'single', '1', '0', '2017-12-19 15:37:51', '2017-12-19 15:37:51');
INSERT INTO `participants` VALUES ('42', '3', '7', 'group', '0', '0', '2017-12-20 10:25:28', '2017-12-20 10:25:28');

-- ----------------------------
-- Table structure for product_counts
-- ----------------------------
DROP TABLE IF EXISTS `product_counts`;
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
  KEY `product_counts_product_id_foreign` (`product_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of product_counts
-- ----------------------------

-- ----------------------------
-- Table structure for reports
-- ----------------------------
DROP TABLE IF EXISTS `reports`;
CREATE TABLE `reports` (
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

-- ----------------------------
-- Records of reports
-- ----------------------------

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
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
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES ('1', '989815069', 'buingoc1192@4efw.ew', '$2a$10$5GKfCX9ZmOInk8PMp4tYB.7/zCpHxet5tJ.0ie7aow.ACQV8aspJK', null, '0', '0', '0', '2017-11-30 22:10:55', '2017-11-29 18:59:17', '2017-11-29 18:59:17');
INSERT INTO `users` VALUES ('2', '9898150692', 'bqngoc110@fsfsf.fgf', '$2a$10$92N7a1eXoJpbvQfnJZ9FOukBRP8dltocDXhq.fAYCp1fWC6nw61Ba', null, '0', '0', '0', '2017-12-04 01:23:18', '2017-11-29 19:03:06', '2017-11-29 19:03:06');
INSERT INTO `users` VALUES ('3', '98981506912', 'buingoc119@hotmail.comw', '$2a$10$Cm3mNIrptlKZcq8lDrCYAeZ/aQKY8zgxSQ0DZ/zLHcXOkuxFqufmG', null, '0', '0', '0', '0000-00-00 00:00:00', '2017-11-29 19:04:54', '2017-11-29 19:04:54');
INSERT INTO `users` VALUES ('4', '989811506921', 'buingoc1191', '$2a$10$92N7a1eXoJpbvQfnJZ9FOukBRP8dltocDXhq.fAYCp1fWC6nw61Ba', null, '0', '0', '0', '2017-12-13 10:50:47', '2017-11-29 19:05:28', '2017-11-29 19:05:28');
INSERT INTO `users` VALUES ('5', '9894515069', 'bqngoc1191', '$2a$10$92N7a1eXoJpbvQfnJZ9FOukBRP8dltocDXhq.fAYCp1fWC6nw61Ba', null, '0', '0', '0', '2017-12-29 09:02:37', '2017-11-29 19:07:13', '2017-11-29 19:07:13');
INSERT INTO `users` VALUES ('6', '989231815069', 'buingoc119', '$2a$10$92N7a1eXoJpbvQfnJZ9FOukBRP8dltocDXhq.fAYCp1fWC6nw61Ba', null, '0', '0', '0', '2017-12-13 10:50:52', '2017-11-29 19:09:07', '2017-11-29 19:09:07');
INSERT INTO `users` VALUES ('7', '933815069', 'buineewoc119@hotmail.com', '$2a$10$2WNNLFsyVdBqJjPdT2JFWOsgT8e8AVYpt0dtVIEOqz32mU1iBAYVC', null, '0', '0', '0', '0000-00-00 00:00:00', '2017-11-29 19:17:17', '2017-11-29 19:17:17');
INSERT INTO `users` VALUES ('8', '98981321069', 'buisgoc119@hotms.com', '$2a$10$sQTyyzZ2w2wSkPB0oam82uxDATxgea62ITEowRkUw8.MtP336UGtq', null, '0', '0', '0', '0000-00-00 00:00:00', '2017-11-29 19:17:39', '2017-11-29 19:17:39');
INSERT INTO `users` VALUES ('9', '98912315069', 'buingo232c119@ho33email.com', '$2a$10$kzAiNk8wsP5TtDNll6YoJOB393mnYIss7b/Ax5Snim9Gv9BszFIiC', null, '0', '0', '0', '0000-00-00 00:00:00', '2017-11-29 19:18:26', '2017-11-29 19:18:26');
INSERT INTO `users` VALUES ('10', '989815034369', 'BuiNgoce@grgwee.ewe', '$2a$10$PWBePR13Uki2Y1eO59zGte..TH3DMvVy1bLzBMtMw.ZvsDJLcrCgy', null, '0', '0', '0', '0000-00-00 00:00:00', '2017-11-29 19:19:35', '2017-11-29 19:19:35');
INSERT INTO `users` VALUES ('11', '989815064912', 'buingoc11911', '$2a$10$dOfQmospk54U2kTtFRyXLOlYgXDsD37nJlteBAFtAObQyuDbbEZcS', null, '0', '0', '0', '2017-12-13 10:49:28', '2017-11-30 15:11:51', '2017-11-30 15:11:51');
INSERT INTO `users` VALUES ('12', '989815063439', 'bqngoc119', '$2a$10$92N7a1eXoJpbvQfnJZ9FOukBRP8dltocDXhq.fAYCp1fWC6nw61Ba', null, '0', '0', '0', '2017-12-01 19:23:37', '2017-12-01 12:23:12', '2017-12-01 12:23:12');
INSERT INTO `users` VALUES ('13', '0989815069', 'ngoctbhy@gmail.com', '$2a$10$EuLqiyU7DxiTaEzDQFUEXusyGCguo7glWKjUfsodxVoARG9XqyOgK', null, '0', '0', '0', '0000-00-00 00:00:00', '2017-12-29 04:09:23', '2017-12-29 04:09:23');
INSERT INTO `users` VALUES ('14', '989506933', 'bgoc119@hotmail.com', '$2a$10$ZnIdvl1JJA3lSOHf5SyKEOx9f2KIoAZoK.B4plozJQxPESYiefCQK', null, '0', '0', '0', '0000-00-00 00:00:00', '2017-12-29 04:11:13', '2017-12-29 04:11:13');
INSERT INTO `users` VALUES ('15', '98495687069', 'bgoc119@hoail.com', '$2a$10$j2nJ6s4S7OuZr96ouCNSCek489htuy8sq4bYRAJGo4CaHUJrX3QGK', null, '0', '0', '0', '0000-00-00 00:00:00', '2017-12-29 04:12:30', '2017-12-29 04:12:30');
INSERT INTO `users` VALUES ('17', '9898150694435', 'BuiNgoc123@hremr.com', '$2a$10$o6eQzAI0WKu5IfFFk2Oa.eggfAZMiXm9x/e8SfGjq3BGt9qIEDHba', null, '0', '0', '0', '0000-00-00 00:00:00', '2017-12-29 04:17:51', '2017-12-29 04:17:51');
INSERT INTO `users` VALUES ('18', '989459415069', 'hfhf766943@fgsgjl.dss', '$2a$10$PadLTyXsbdA0VBNPTpYJ3eDQ3LMfzowT.6FiEk3baAJ/cMp8Kr7OW', null, '0', '0', '0', '0000-00-00 00:00:00', '2017-12-29 04:36:09', '2017-12-29 04:36:09');
INSERT INTO `users` VALUES ('19', '9898135669', 'ngocbu@ng3.sd', '$2a$10$Pop.sa3pfG/GtyufQSbFgeU3r7PlZXRYlKTpKnUBiHbbOXvuuvGMe', null, '0', '0', '0', '0000-00-00 00:00:00', '2017-12-29 07:38:10', '2017-12-29 07:38:10');
DROP TRIGGER IF EXISTS `messages_BEFORE_INSERT`;
DELIMITER ;;
CREATE TRIGGER `messages_BEFORE_INSERT` BEFORE INSERT ON `messages` FOR EACH ROW BEGIN
	CASE new.guid
		WHEN 'single' THEN
			SET NEW.is_single_group = 0;
		WHEN 'group' THEN
			SET NEW.is_single_group = 1;
		ELSE
			BEGIN
			END;
	END CASE;
END
;;
DELIMITER ;
DROP TRIGGER IF EXISTS `after_insert_type_single_goup`;
DELIMITER ;;
CREATE TRIGGER `after_insert_type_single_goup` BEFORE INSERT ON `participants` FOR EACH ROW BEGIN
	CASE new.type
		WHEN 'single' THEN 
			SET NEW.is_accept_single = 1, new.is_accept_group = 0;
		WHEN 'group' THEN 
			SET NEW.is_accept_single = 0;
		ELSE 
			begin end;
	END CASE;

END
;;
DELIMITER ;
DROP TRIGGER IF EXISTS `participants_BEFORE_UPDATE`;
DELIMITER ;;
CREATE TRIGGER `participants_BEFORE_UPDATE` BEFORE UPDATE ON `participants` FOR EACH ROW BEGIN

END
;;
DELIMITER ;
DROP TRIGGER IF EXISTS `participants_AFTER_UPDATE`;
DELIMITER ;;
CREATE TRIGGER `participants_AFTER_UPDATE` AFTER UPDATE ON `participants` FOR EACH ROW BEGIN

END
;;
DELIMITER ;
DROP TRIGGER IF EXISTS `participants_BEFORE_DELETE`;
DELIMITER ;;
CREATE TRIGGER `participants_BEFORE_DELETE` BEFORE DELETE ON `participants` FOR EACH ROW BEGIN

END
;;
DELIMITER ;
DROP TRIGGER IF EXISTS `participants_AFTER_DELETE`;
DELIMITER ;;
CREATE TRIGGER `participants_AFTER_DELETE` AFTER DELETE ON `participants` FOR EACH ROW BEGIN

END
;;
DELIMITER ;
