-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 08, 2026 at 03:22 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";
SET FOREIGN_KEY_CHECKS = 0;


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `figma_foodcort`
--

-- --------------------------------------------------------

--
-- Table structure for table `tbl_cart`
--

CREATE TABLE `tbl_cart` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `item_id` bigint(20) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_cart_ingredients`
--

CREATE TABLE `tbl_cart_ingredients` (
  `id` bigint(20) NOT NULL,
  `cart_id` bigint(20) NOT NULL,
  `ingredient_id` bigint(20) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_category`
--

CREATE TABLE `tbl_category` (
  `id` bigint(20) NOT NULL,
  `name` varchar(128) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_category`
--

INSERT INTO `tbl_category` (`id`, `name`, `image`, `is_active`, `is_deleted`, `created_at`, `updated_at`) VALUES
(1, 'Hamburger', 'Hamburger.jpg', 1, 0, '2026-04-06 17:33:00', '2026-04-06 17:33:00'),
(2, 'Pizza', 'Pizza.png', 1, 0, '2026-04-06 17:33:00', '2026-04-06 17:33:00'),
(3, 'Cokkies', 'Cokkies.jpg\r\n', 1, 0, '2026-04-06 17:33:32', '2026-04-06 17:33:32'),
(4, 'Sandwitch', 'Sandwitch.jpg', 1, 0, '2026-04-06 17:33:32', '2026-04-06 17:33:32');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_favorites`
--

CREATE TABLE `tbl_favorites` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `item_id` bigint(20) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_ingredients`
--

CREATE TABLE `tbl_ingredients` (
  `id` bigint(20) NOT NULL,
  `name` varchar(32) NOT NULL,
  `unit_type` enum('grm','slice','glove') NOT NULL,
  `image` varchar(64) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `is_delete` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_ingredients`
--

INSERT INTO `tbl_ingredients` (`id`, `name`, `unit_type`, `image`, `is_active`, `is_delete`, `created_at`, `updated_at`) VALUES
(1, 'Tomato', 'grm', 'tomato.png', 1, 0, '2026-04-06 12:05:51', '2026-04-06 12:05:51'),
(2, 'Onion', 'grm', 'onion.png', 1, 0, '2026-04-06 12:05:51', '2026-04-06 12:05:51'),
(3, 'Cheese', 'slice', 'cheese.png', 1, 0, '2026-04-06 12:05:51', '2026-04-06 12:05:51'),
(4, 'Chicken', 'grm', 'chicken.png', 1, 0, '2026-04-06 12:05:51', '2026-04-06 12:05:51'),
(5, 'Prawns', 'grm', 'prawns.png', 1, 0, '2026-04-06 12:05:51', '2026-04-06 12:05:51'),
(6, 'Bread', 'slice', 'bread.png', 1, 0, '2026-04-06 12:05:51', '2026-04-06 12:05:51'),
(7, 'Bacon', 'grm', 'bacon.png', 1, 0, '2026-04-06 12:05:51', '2026-04-06 12:05:51'),
(8, 'Lettuce', 'grm', 'lettuce.png', 1, 0, '2026-04-06 12:05:51', '2026-04-06 12:05:51'),
(9, 'Garlic', 'glove', 'garlic.png', 1, 0, '2026-04-06 12:05:51', '2026-04-06 12:05:51'),
(10, 'Butter', 'grm', 'butter.png', 1, 0, '2026-04-06 12:05:51', '2026-04-06 12:05:51');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_items_ingredients`
--

CREATE TABLE `tbl_items_ingredients` (
  `id` bigint(20) NOT NULL,
  `item_id` bigint(20) NOT NULL,
  `ingrediants_id` bigint(20) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `is_delete` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_item_rating`
--

CREATE TABLE `tbl_item_rating` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `item_id` bigint(20) NOT NULL,
  `rating` decimal(2,1) NOT NULL,
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `is_delete` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_notifications`
--

CREATE TABLE `tbl_notifications` (
  `id` bigint(20) NOT NULL,
  `sender_id` bigint(20) NOT NULL,
  `receiver_id` bigint(20) NOT NULL,
  `title` varchar(64) NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_orders`
--

CREATE TABLE `tbl_orders` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `delivery_person_id` bigint(20) DEFAULT NULL,
  `payment_id` bigint(20) DEFAULT NULL,
  `order_number` varchar(64) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `discount` decimal(10,2) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `address` text NOT NULL,
  `latitude` decimal(10,8) NOT NULL,
  `longitude` decimal(11,8) NOT NULL,
  `status` enum('pending','confirmed','preparing','delivered','cancelled') NOT NULL DEFAULT 'pending',
  `payment_method` enum('COD','card','UPI') NOT NULL COMMENT '"Cash On Delivery" , "Credit/Debit Cards" , "UPI IDs"',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_order_items`
--

CREATE TABLE `tbl_order_items` (
  `id` bigint(20) NOT NULL,
  `order_id` bigint(20) NOT NULL,
  `item_id` bigint(20) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `price` decimal(10,2) NOT NULL,
  `address` text NOT NULL,
  `latitude` decimal(10,8) NOT NULL,
  `longitude` decimal(11,8) NOT NULL,
  `notes` text DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_order_item_ingredients`
--

CREATE TABLE `tbl_order_item_ingredients` (
  `id` bigint(20) NOT NULL,
  `order_item_id` bigint(20) NOT NULL,
  `ingredient_id` bigint(20) NOT NULL,
  `ingredient_name` varchar(128) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_otp`
--

CREATE TABLE `tbl_otp` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `mobile` varchar(16) DEFAULT NULL,
  `email` varchar(256) DEFAULT NULL,
  `purpose` enum('signup','forgotpassword') DEFAULT NULL,
  `otp` varchar(10) DEFAULT NULL,
  `country_code` varchar(10) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `is_delete` tinyint(1) DEFAULT 0,
  `expires_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_otp`
--

INSERT INTO `tbl_otp` (`id`, `user_id`, `mobile`, `email`, `purpose`, `otp`, `country_code`, `is_active`, `is_delete`, `expires_at`, `created_at`, `updated_at`) VALUES
(0, 15, NULL, 'user1@gmail.com', 'signup', '123456', NULL, 1, 0, '2026-04-08 11:37:53', '2026-04-08 06:02:53', '2026-04-08 06:02:53'),
(1, 9, '9510447055', '', 'signup', '123456', '+91', 0, 0, '2026-04-06 15:51:05', '2026-04-06 10:16:05', '2026-04-06 10:28:56'),
(2, 10, '9510447056', '', 'signup', '123456', '+91', 1, 0, '2026-04-06 15:54:10', '2026-04-06 10:19:10', '2026-04-06 10:19:10'),
(3, 12, '9510447010', 'testsimple@gmail.com', 'signup', '123456', '+91', 0, 0, '2026-04-06 16:06:31', '2026-04-06 10:31:31', '2026-04-06 10:34:15'),
(4, 13, '9510447011', 'testsimple1@gmail.com', 'signup', '123456', '+91', 0, 0, '2026-04-06 16:11:59', '2026-04-06 10:36:59', '2026-04-06 11:23:17'),
(7, 13, '9510447011', '', 'signup', '123456', '+91', 0, 0, '2026-04-06 16:18:22', '2026-04-06 10:43:22', '2026-04-06 11:27:44'),
(8, 13, '9510447011', NULL, 'forgotpassword', '123456', '+91', 0, 0, '2026-04-06 16:27:49', '2026-04-06 10:52:49', '2026-04-06 11:23:17'),
(9, 15, '9510447020', 'testsimple12@gmail.com', 'signup', '123456', '+91', 0, 0, '2026-04-06 17:15:38', '2026-04-06 11:28:38', '2026-04-06 11:36:09'),
(10, 16, '9510447032', 'testsimple1245@gmail.com', 'signup', '123456', '+91', 1, 0, '2026-04-06 18:55:58', '2026-04-06 13:20:58', '2026-04-06 13:20:58');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_payment_methods`
--

CREATE TABLE `tbl_payment_methods` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `UPI_id` varchar(128) DEFAULT NULL,
  `payment_method` varchar(64) NOT NULL,
  `card_number` varchar(20) DEFAULT NULL,
  `holder_name` varchar(128) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0,
  `expiry_date` date DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_restaurant`
--

CREATE TABLE `tbl_restaurant` (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `address` text DEFAULT NULL,
  `email` varchar(64) NOT NULL,
  `country_code` varchar(8) NOT NULL,
  `mobile_number` varchar(16) NOT NULL,
  `lat` decimal(10,8) DEFAULT NULL,
  `long` decimal(11,8) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `is_delete` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_restaurant`
--

INSERT INTO `tbl_restaurant` (`id`, `name`, `address`, `email`, `country_code`, `mobile_number`, `lat`, `long`, `is_active`, `is_delete`, `created_at`, `updated_at`) VALUES
(6, 'Spice Garden', 'CG Road, Ahmedabad', 'spicegarden@foodcart.com', '+91', '9876500001', 23.02579000, 72.58727000, 1, 0, '2026-04-06 12:39:59', '2026-04-06 12:39:59'),
(7, 'Urban Tandoor', 'Satellite, Ahmedabad', 'urbantandoor@foodcart.com', '+91', '9876500002', 23.01263000, 72.52065000, 1, 0, '2026-04-06 12:39:59', '2026-04-06 12:39:59'),
(8, 'Royal Biryani House', 'Prahlad Nagar, Ahmedabad', 'royalbiryani@foodcart.com', '+91', '9876500003', 23.01095000, 72.51091000, 1, 0, '2026-04-06 12:39:59', '2026-04-06 12:39:59'),
(9, 'Pizza Junction', 'Vastrapur Lake Road, Ahmedabad', 'pizzajunction@foodcart.com', '+91', '9876500004', 23.03955000, 72.52931000, 1, 0, '2026-04-06 12:39:59', '2026-04-06 12:39:59'),
(10, 'Burger Point', 'Maninagar, Ahmedabad', 'burgerpoint@foodcart.com', '+91', '9876500005', 22.99598000, 72.60379000, 1, 0, '2026-04-06 12:39:59', '2026-04-06 12:39:59');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_restaurant_items`
--

CREATE TABLE `tbl_restaurant_items` (
  `id` bigint(20) NOT NULL,
  `restorant_id` bigint(20) NOT NULL,
  `category_id` bigint(20) DEFAULT NULL,
  `name` varchar(64) NOT NULL,
  `item_image` varchar(128) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `calories` varchar(32) DEFAULT NULL,
  `descrition` text DEFAULT NULL,
  `preparation_time` time DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `is_delete` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_restaurant_items`
--

INSERT INTO `tbl_restaurant_items` (`id`, `restorant_id`, `category_id`, `name`, `item_image`, `price`, `calories`, `descrition`, `preparation_time`, `is_active`, `is_delete`, `created_at`, `updated_at`) VALUES
(22, 6, 1, 'Classic Chicken Burger', 'classic_chicken_burger.jpg', 149.00, '520 kcal', 'Juicy chicken patty with lettuce and mayo', '00:12:00', 1, 0, '2026-04-06 12:41:23', '2026-04-06 12:41:23'),
(23, 6, 1, 'Cheese Burst Burger', 'cheese_burst_burger.jpg', 179.00, '610 kcal', 'Double cheese burger with crispy onion rings', '00:14:00', 1, 0, '2026-04-06 12:41:23', '2026-04-06 12:41:23'),
(24, 7, 2, 'Farmhouse Pizza', 'farmhouse_pizza.jpg', 299.00, '780 kcal', 'Loaded with capsicum, onion, tomato and olives', '00:18:00', 1, 0, '2026-04-06 12:41:23', '2026-04-06 12:41:23'),
(25, 7, 2, 'Margherita Pizza', 'margherita_pizza.jpg', 239.00, '690 kcal', 'Classic cheese and tomato pizza', '00:15:00', 1, 0, '2026-04-06 12:41:23', '2026-04-06 12:41:23'),
(26, 8, 3, 'Choco Chip Cookies', 'choco_chip_cookies.jpg', 129.00, '340 kcal', 'Fresh baked cookies with chocolate chips', '00:10:00', 1, 0, '2026-04-06 12:41:23', '2026-04-06 12:41:23'),
(27, 8, 3, 'Oatmeal Raisin Cookies', 'oatmeal_raisin_cookies.jpg', 119.00, '310 kcal', 'Healthy oatmeal cookies with raisins', '00:11:00', 1, 0, '2026-04-06 12:41:23', '2026-04-06 12:41:23'),
(28, 9, 4, 'Veg Grilled Sandwich', 'veg_grilled_sandwich.jpg', 139.00, '430 kcal', 'Grilled sandwich with mixed vegetables and cheese', '00:10:00', 1, 0, '2026-04-06 12:41:23', '2026-04-06 12:41:23'),
(29, 9, 4, 'Paneer Tikka Sandwich', 'paneer_tikka_sandwich.jpg', 169.00, '490 kcal', 'Toasted sandwich with paneer tikka filling', '00:12:00', 1, 0, '2026-04-06 12:41:23', '2026-04-06 12:41:23'),
(30, 10, 1, 'Mexican Burger', 'mexican_burger.jpg', 189.00, '570 kcal', 'Spicy mexican style burger with jalapenos', '00:13:00', 1, 0, '2026-04-06 12:41:23', '2026-04-06 12:41:23'),
(31, 10, 2, 'BBQ Paneer Pizza', 'bbq_paneer_pizza.jpg', 329.00, '820 kcal', 'Smoky BBQ paneer pizza with onion and capsicum', '00:19:00', 1, 0, '2026-04-06 12:41:23', '2026-04-06 12:41:23');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_restaurant_rating`
--

CREATE TABLE `tbl_restaurant_rating` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `restorant_id` bigint(20) NOT NULL,
  `reviews` decimal(2,1) NOT NULL,
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `is_delete` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_user`
--

CREATE TABLE `tbl_user` (
  `id` bigint(20) NOT NULL,
  `address_id` bigint(20) DEFAULT NULL,
  `role` enum('user','rider') NOT NULL DEFAULT 'user',
  `username` varchar(64) DEFAULT NULL,
  `profile_pic` varchar(256) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `language` enum('en','bh','chin','deut') NOT NULL COMMENT '"en" for English, "bh" for Bahasa Indonesia, "chin" for Chinese, "deut" for deutsch',
  `country_code` varchar(8) DEFAULT NULL,
  `mobile_number` varchar(16) DEFAULT NULL,
  `login_type` enum('g','f','s') DEFAULT NULL COMMENT 'g="google" f="facebook" s="simple"',
  `social_id` varchar(255) DEFAULT NULL,
  `is_mobile_verified` tinyint(1) DEFAULT 0,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `is_delete` tinyint(1) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_user`
--

INSERT INTO `tbl_user` (`id`, `address_id`, `role`, `username`, `profile_pic`, `email`, `password`, `language`, `country_code`, `mobile_number`, `login_type`, `social_id`, `is_mobile_verified`, `latitude`, `longitude`, `is_active`, `is_delete`, `created_at`, `updated_at`) VALUES
(15, NULL, 'user', 'user1', '', 'user1@gmail.com', '5a8ebb2f22716cbbaabfe2f4f35192cb', 'en', NULL, NULL, 's', NULL, 0, NULL, NULL, 1, 0, '2026-04-08 11:32:53', '2026-04-08 11:32:53'),
(16, NULL, 'user', NULL, '', 'user1@gmail.com', NULL, '', NULL, NULL, NULL, NULL, 0, NULL, NULL, 1, 0, '2026-04-08 11:42:36', '2026-04-08 11:42:36');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_user_addresses`
--

CREATE TABLE `tbl_user_addresses` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `address` text NOT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `is_delete` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_user_device`
--

CREATE TABLE `tbl_user_device` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `token` text DEFAULT NULL,
  `device_token` text DEFAULT NULL,
  `device_type` varchar(50) DEFAULT NULL,
  `device_name` varchar(100) DEFAULT NULL,
  `device_model` varchar(100) DEFAULT NULL,
  `os_version` varchar(50) DEFAULT NULL,
  `uuid` varchar(255) DEFAULT NULL,
  `ip` varchar(50) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `is_delete` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_user_device`
--

INSERT INTO `tbl_user_device` (`id`, `user_id`, `token`, `device_token`, `device_type`, `device_name`, `device_model`, `os_version`, `uuid`, `ip`, `is_active`, `is_delete`, `created_at`, `updated_at`) VALUES
(1, 15, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTUsImVtYWlsIjoidGVzdHNpbXBsZTEyQGdtYWlsLmNvbSIsIm1vYmlsZV9udW1iZXIiOiI5NTEwNDQ3MDIwIiwiaWF0IjoxNzc1NDc1MzY5LCJleHAiOjE4MDcwMTEzNjl9.06wALDoWMe3FmA5Lmr1DVxebYIuXM7P_uCQu59D_A7o', 'b2953581e65a496898e8c178e3a496f2', 'Android', 'OnePlus 11 - 737', 'OnePlus 11', '13.0', 'uuid123', '192.168.1.53', 1, 0, '2026-04-06 11:36:09', '2026-04-06 11:36:09'),
(2, 15, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTUsImVtYWlsIjoidGVzdHNpbXBsZTEyQGdtYWlsLmNvbSIsIm1vYmlsZV9udW1iZXIiOiI5NTEwNDQ3MDIwIiwiaWF0IjoxNzc1NDc1OTI2LCJleHAiOjE4MDcwMTE5MjZ9.EgAcmfFqu69w-1fa9gUkzIQ1mZmVxYBnkoTz2WAJeJA', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 0, '2026-04-06 11:45:26', '2026-04-06 11:45:26'),
(3, 15, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTUsImVtYWlsIjoidGVzdHNpbXBsZTEyQGdtYWlsLmNvbSIsIm1vYmlsZV9udW1iZXIiOiI5NTEwNDQ3MDIwIiwiaWF0IjoxNzc1NDc2Mjc4LCJleHAiOjE4MDcwMTIyNzh9.RzYwi1r-cPgYw0r8QPYsXUr41vMiXjXV0s-e6jRUYaE', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 0, '2026-04-06 11:51:18', '2026-04-06 11:51:18'),
(4, 15, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTUsImVtYWlsIjoidGVzdHNpbXBsZTEyQGdtYWlsLmNvbSIsIm1vYmlsZV9udW1iZXIiOiI5NTEwNDQ3MDIwIiwiaWF0IjoxNzc1NDc2NDcxLCJleHAiOjE4MDcwMTI0NzF9.al0jHwzD40isuRQQd5sExvUk-POtrIZ1CzLER20YFhg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, '2026-04-06 11:54:31', '2026-04-06 11:58:03'),
(5, 15, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTUsImVtYWlsIjoidGVzdHNpbXBsZTEyQGdtYWlsLmNvbSIsIm1vYmlsZV9udW1iZXIiOiI5NTEwNDQ3MDIwIiwiaWF0IjoxNzc1NDgwMjQzLCJleHAiOjE4MDcwMTYyNDN9.UvAdMX2nmNCa0nxs7T7SXfin_CzG9ZtNutFZrAFdxcw', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 0, '2026-04-06 12:57:23', '2026-04-06 12:57:23'),
(6, 15, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTUsImVtYWlsIjoidGVzdHNpbXBsZTEyQGdtYWlsLmNvbSIsIm1vYmlsZV9udW1iZXIiOiI5NTEwNDQ3MDIwIiwiaWF0IjoxNzc1NDgwMjQ2LCJleHAiOjE4MDcwMTYyNDZ9.wBmqu8xjXUdYtI7jaQ4fhpZt57Ba5n3mvt4kQanlIKw', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 0, '2026-04-06 12:57:26', '2026-04-06 12:57:26');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_user_permissions`
--

CREATE TABLE `tbl_user_permissions` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `location` tinyint(1) NOT NULL DEFAULT 0,
  `payment` tinyint(1) NOT NULL DEFAULT 0,
  `tracking` tinyint(1) NOT NULL DEFAULT 0,
  `complete_order` tinyint(1) NOT NULL DEFAULT 0,
  `notification` tinyint(1) NOT NULL DEFAULT 0,
  `face_id` tinyint(1) NOT NULL DEFAULT 0,
  `remember_pass` tinyint(1) NOT NULL DEFAULT 0,
  `touch_id` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_vouchers`
--

CREATE TABLE `tbl_vouchers` (
  `id` bigint(20) NOT NULL,
  `voucher_code` varchar(64) NOT NULL,
  `voucher_name` varchar(128) NOT NULL,
  `discount_type` enum('percentage','flat','buy_get') NOT NULL,
  `valid_from` datetime NOT NULL,
  `valid_until` datetime NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `buy_item` int(11) DEFAULT NULL,
  `get_item` int(11) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_voucher_redemptions`
--

CREATE TABLE `tbl_voucher_redemptions` (
  `id` bigint(20) NOT NULL,
  `voucher_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `redemption_date` datetime NOT NULL DEFAULT current_timestamp(),
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tbl_cart`
--
ALTER TABLE `tbl_cart`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_tbl_cart_user` (`user_id`),
  ADD KEY `fk_tbl_cart_item` (`item_id`);

--
-- Indexes for table `tbl_cart_ingredients`
--
ALTER TABLE `tbl_cart_ingredients`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_tbl_cart_ingredients_cart` (`cart_id`),
  ADD KEY `fk_tbl_cart_ingredients_ingredient` (`ingredient_id`);

--
-- Indexes for table `tbl_category`
--
ALTER TABLE `tbl_category`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_favorites`
--
ALTER TABLE `tbl_favorites`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_tbl_favorites_user` (`user_id`),
  ADD KEY `fk_tbl_favorites_item` (`item_id`);

--
-- Indexes for table `tbl_ingredients`
--
ALTER TABLE `tbl_ingredients`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_items_ingredients`
--
ALTER TABLE `tbl_items_ingredients`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_tbl_items_ingrediants_item` (`item_id`),
  ADD KEY `fk_tbl_items_ingrediants_ingrediant` (`ingrediants_id`);

--
-- Indexes for table `tbl_item_rating`
--
ALTER TABLE `tbl_item_rating`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_tbl_item_rating_user` (`user_id`),
  ADD KEY `fk_tbl_item_rating_item` (`item_id`);

--
-- Indexes for table `tbl_notifications`
--
ALTER TABLE `tbl_notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_tbl_notifications_sender` (`sender_id`),
  ADD KEY `fk_tbl_notifications_receiver` (`receiver_id`);

--
-- Indexes for table `tbl_order_items`
--
ALTER TABLE `tbl_order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_tbl_order_items_order` (`order_id`),
  ADD KEY `fk_tbl_order_items_item` (`item_id`);

--
-- Indexes for table `tbl_order_item_ingredients`
--
ALTER TABLE `tbl_order_item_ingredients`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_tbl_order_item_ingredients_order_item` (`order_item_id`),
  ADD KEY `fk_tbl_order_item_ingredients_ingredient` (`ingredient_id`);

--
-- Indexes for table `tbl_otp`
--
ALTER TABLE `tbl_otp`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tbl_otp_ibfk_1` (`user_id`);

--
-- Indexes for table `tbl_payment_methods`
--
ALTER TABLE `tbl_payment_methods`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_tbl_payment_methods_user` (`user_id`);

--
-- Indexes for table `tbl_restaurant`
--
ALTER TABLE `tbl_restaurant`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_restaurant_items`
--
ALTER TABLE `tbl_restaurant_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_restorant_id` (`restorant_id`),
  ADD KEY `fk_category_id` (`category_id`);

--
-- Indexes for table `tbl_restaurant_rating`
--
ALTER TABLE `tbl_restaurant_rating`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_tbl_restorant_rating_user` (`user_id`),
  ADD KEY `fk_tbl_restorant_rating_restorant` (`restorant_id`);

--
-- Indexes for table `tbl_orders`
--
ALTER TABLE `tbl_orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_tbl_orders_user` (`user_id`),
  ADD KEY `fk_tbl_orders_delivery_person` (`delivery_person_id`),
  ADD KEY `fk_tbl_orders_payment` (`payment_id`);

--
-- Indexes for table `tbl_user`
--
ALTER TABLE `tbl_user`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_address_id` (`address_id`);

--
-- Indexes for table `tbl_user_addresses`
--
ALTER TABLE `tbl_user_addresses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_user_id` (`user_id`);

--
-- Indexes for table `tbl_user_device`
--
ALTER TABLE `tbl_user_device`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_userq_id` (`user_id`);

--
-- Indexes for table `tbl_user_permissions`
--
ALTER TABLE `tbl_user_permissions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_vouchers`
--
ALTER TABLE `tbl_vouchers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_voucher_redemptions`
--
ALTER TABLE `tbl_voucher_redemptions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_tbl_voucher_redemptions_voucher` (`voucher_id`),
  ADD KEY `fk_tbl_voucher_redemptions_user` (`user_id`);

--
-- AUTO_INCREMENT for table `tbl_orders`
--
ALTER TABLE `tbl_orders`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_otp`
--
ALTER TABLE `tbl_otp`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_payment_methods`
--
ALTER TABLE `tbl_payment_methods`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_restaurant_rating`
--
ALTER TABLE `tbl_restaurant_rating`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_user`
--
ALTER TABLE `tbl_user`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `tbl_user_addresses`
--
ALTER TABLE `tbl_user_addresses`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_user_device`
--
ALTER TABLE `tbl_user_device`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `tbl_user_permissions`
--
ALTER TABLE `tbl_user_permissions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_vouchers`
--
ALTER TABLE `tbl_vouchers`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_voucher_redemptions`
--
ALTER TABLE `tbl_voucher_redemptions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--
ALTER TABLE `tbl_orders`
  ADD CONSTRAINT `fk_tbl_orders_user` FOREIGN KEY (`user_id`) REFERENCES `tbl_user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_tbl_orders_delivery_person` FOREIGN KEY (`delivery_person_id`) REFERENCES `tbl_user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_tbl_orders_payment` FOREIGN KEY (`payment_id`) REFERENCES `tbl_payment_methods` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `tbl_user`
  ADD CONSTRAINT `fk_tbl_user_address` FOREIGN KEY (`address_id`) REFERENCES `tbl_user_addresses` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `tbl_user_addresses`
  ADD CONSTRAINT `fk_tbl_user_addresses_user` FOREIGN KEY (`user_id`) REFERENCES `tbl_user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `tbl_user_device`
  ADD CONSTRAINT `fk_tbl_user_device_user` FOREIGN KEY (`user_id`) REFERENCES `tbl_user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `tbl_user_permissions`
  ADD CONSTRAINT `fk_tbl_user_permissions_user` FOREIGN KEY (`user_id`) REFERENCES `tbl_user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `tbl_voucher_redemptions`
  ADD CONSTRAINT `fk_tbl_voucher_redemptions_voucher` FOREIGN KEY (`voucher_id`) REFERENCES `tbl_vouchers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_tbl_voucher_redemptions_user` FOREIGN KEY (`user_id`) REFERENCES `tbl_user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `tbl_otp`
  ADD CONSTRAINT `fk_tbl_otp_user` FOREIGN KEY (`user_id`) REFERENCES `tbl_user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `tbl_payment_methods`
  ADD CONSTRAINT `fk_tbl_payment_methods_user` FOREIGN KEY (`user_id`) REFERENCES `tbl_user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `tbl_restaurant_items`
  ADD CONSTRAINT `fk_tbl_restaurant_items_restaurant` FOREIGN KEY (`restorant_id`) REFERENCES `tbl_restaurant` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_tbl_restaurant_items_category` FOREIGN KEY (`category_id`) REFERENCES `tbl_category` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `tbl_restaurant_rating`
  ADD CONSTRAINT `fk_tbl_restaurant_rating_user` FOREIGN KEY (`user_id`) REFERENCES `tbl_user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_tbl_restaurant_rating_restaurant` FOREIGN KEY (`restorant_id`) REFERENCES `tbl_restaurant` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- AUTO_INCREMENT for table `tbl_cart`
--
ALTER TABLE `tbl_cart`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_cart_ingredients`
--
ALTER TABLE `tbl_cart_ingredients`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_category`
--
ALTER TABLE `tbl_category`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_favorites`
--
ALTER TABLE `tbl_favorites`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_ingredients`
--
ALTER TABLE `tbl_ingredients`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_items_ingredients`
--
ALTER TABLE `tbl_items_ingredients`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_item_rating`
--
ALTER TABLE `tbl_item_rating`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_notifications`
--
ALTER TABLE `tbl_notifications`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_order_items`
--
ALTER TABLE `tbl_order_items`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_order_item_ingredients`
--
ALTER TABLE `tbl_order_item_ingredients`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_restaurant`
--
ALTER TABLE `tbl_restaurant`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_restaurant_items`
--
ALTER TABLE `tbl_restaurant_items`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

SET FOREIGN_KEY_CHECKS = 1;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
