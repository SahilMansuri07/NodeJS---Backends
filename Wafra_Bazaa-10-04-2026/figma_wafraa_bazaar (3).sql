-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 16, 2026 at 01:17 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `figma_wafraa_bazaar`
--

-- --------------------------------------------------------

--
-- Table structure for table `tbl_cart`
--

CREATE TABLE `tbl_cart` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `variant_id` bigint(20) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `is_delete` tinyint(1) DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_cart`
--

INSERT INTO `tbl_cart` (`id`, `user_id`, `variant_id`, `quantity`, `is_active`, `is_delete`, `created_at`, `updated_at`) VALUES
(2, 14, 33, 2, 1, 0, '2026-04-13 11:10:00', '2026-04-13 11:10:00'),
(3, 16, 36, 1, 0, 1, '2026-04-13 11:10:00', '2026-04-13 17:23:27'),
(11, 16, 6, 1, 0, 1, '2026-04-13 15:08:54', '2026-04-13 17:23:27'),
(12, 16, 6, 1, 0, 1, '2026-04-13 19:08:16', '2026-04-13 19:08:19'),
(13, 16, 6, 1, 0, 1, '2026-04-13 19:08:57', '2026-04-13 19:08:59'),
(14, 16, 6, 1, 0, 1, '2026-04-13 19:09:17', '2026-04-13 19:09:19'),
(15, 16, 6, 1, 0, 1, '2026-04-14 10:16:55', '2026-04-14 10:16:57'),
(16, 16, 6, 1, 0, 1, '2026-04-14 10:17:39', '2026-04-14 10:17:41'),
(17, 16, 6, 1, 0, 1, '2026-04-14 10:18:41', '2026-04-14 10:18:43'),
(18, 16, 6, 1, 0, 1, '2026-04-14 10:19:32', '2026-04-14 10:19:34'),
(19, 16, 6, 1, 0, 1, '2026-04-14 10:21:14', '2026-04-14 10:21:17'),
(20, 16, 6, 1, 0, 1, '2026-04-14 10:22:57', '2026-04-14 10:23:00'),
(21, 16, 6, 1, 0, 1, '2026-04-14 10:25:02', '2026-04-14 10:25:05'),
(22, 16, 6, 1, 0, 1, '2026-04-14 11:01:59', '2026-04-14 11:02:01'),
(23, 36, NULL, 1, 1, 0, '2026-04-16 10:36:53', '2026-04-16 10:36:53'),
(24, 36, NULL, 1, 1, 0, '2026-04-16 10:37:35', '2026-04-16 10:37:35'),
(25, 36, NULL, 1, 1, 0, '2026-04-16 10:38:00', '2026-04-16 10:38:00'),
(28, 36, 6, 3, 1, 0, '2026-04-16 10:43:09', '2026-04-16 10:43:09');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_category`
--

CREATE TABLE `tbl_category` (
  `id` bigint(20) NOT NULL,
  `parent_category_id` bigint(20) DEFAULT NULL,
  `name` varchar(64) DEFAULT NULL,
  `image_url` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `is_delete` tinyint(1) DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_category`
--

INSERT INTO `tbl_category` (`id`, `parent_category_id`, `name`, `image_url`, `is_active`, `is_delete`, `created_at`, `updated_at`) VALUES
(1, NULL, 'Men', 'uploads/men.jpg', 1, 0, '2026-04-10 18:02:24', '2026-04-10 18:02:24'),
(2, NULL, 'Women', 'uploads/women.jpg', 1, 0, '2026-04-10 18:02:24', '2026-04-10 18:02:24'),
(3, NULL, 'Kids', 'uploads/kids.jpg', 1, 0, '2026-04-10 18:02:24', '2026-04-10 18:02:24'),
(4, 1, 'Shirts', 'uploads/men_shirts.jpg', 1, 0, '2026-04-10 18:02:24', '2026-04-10 18:02:24'),
(5, 1, 'T-Shirts', 'uploads/men_tshirts.jpg', 1, 0, '2026-04-10 18:02:24', '2026-04-10 18:02:24'),
(6, 1, 'Jeans', 'uploads/men_jeans.jpg', 1, 0, '2026-04-10 18:02:24', '2026-04-10 18:02:24'),
(7, 2, 'Dresses', 'uploads/women_dresses.jpg', 1, 0, '2026-04-10 18:02:24', '2026-04-10 18:02:24'),
(8, 2, 'Kurtis', 'uploads/women_kurtis.jpg', 1, 0, '2026-04-10 18:02:24', '2026-04-10 18:02:24'),
(9, 2, 'Tops', 'uploads/women_tops.jpg', 1, 0, '2026-04-10 18:02:24', '2026-04-10 18:02:24'),
(10, 3, 'Toys', 'uploads/kids_toys.jpg', 1, 0, '2026-04-10 18:02:24', '2026-04-10 18:02:24'),
(11, 3, 'Clothing', 'uploads/kids_clothing.jpg', 1, 0, '2026-04-10 18:02:24', '2026-04-10 18:02:24'),
(12, 2, 'Abayas', 'uploads/women_abayas.jpg', 1, 0, '2026-04-13 10:35:00', '2026-04-13 10:35:00'),
(13, 2, 'Kaftans', 'uploads/women_kaftans.jpg', 1, 0, '2026-04-13 10:35:00', '2026-04-13 10:35:00'),
(14, 2, 'Modest Wear', 'uploads/women_modest_wear.jpg', 1, 0, '2026-04-13 10:35:00', '2026-04-13 10:35:00'),
(15, 1, 'Polo Shirts', 'uploads/men_polo.jpg', 1, 0, '2026-04-13 10:35:00', '2026-04-13 10:35:00'),
(16, 1, 'Formal Shirts', 'uploads/men_formal_shirts.jpg', 1, 0, '2026-04-13 10:35:00', '2026-04-13 10:35:00'),
(17, 3, 'Kids Tops', 'uploads/kids_tops.jpg', 1, 0, '2026-04-13 10:35:00', '2026-04-13 10:35:00'),
(18, 3, 'Kids Ethnic', 'uploads/kids_ethnic.jpg', 1, 0, '2026-04-13 10:35:00', '2026-04-13 10:35:00');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_cms`
--

CREATE TABLE `tbl_cms` (
  `id` bigint(20) NOT NULL,
  `tag_name` varchar(64) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `is_delete` tinyint(1) DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_color`
--

CREATE TABLE `tbl_color` (
  `id` bigint(20) NOT NULL,
  `name` varchar(64) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `is_delete` tinyint(1) DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_color`
--

INSERT INTO `tbl_color` (`id`, `name`, `is_active`, `is_delete`, `created_at`, `updated_at`) VALUES
(1, 'Black', 1, 0, '2026-04-13 10:00:00', '2026-04-13 10:00:00'),
(2, 'Navy', 1, 0, '2026-04-13 10:00:00', '2026-04-13 10:00:00'),
(3, 'Beige', 1, 0, '2026-04-13 10:00:00', '2026-04-13 10:00:00'),
(4, 'White', 1, 0, '2026-04-13 10:00:00', '2026-04-13 10:00:00'),
(5, 'Olive', 1, 0, '2026-04-13 10:00:00', '2026-04-13 10:00:00'),
(6, 'Maroon', 1, 0, '2026-04-13 10:00:00', '2026-04-13 10:00:00'),
(7, 'Sky Blue', 1, 0, '2026-04-13 10:00:00', '2026-04-13 10:00:00'),
(8, 'Pink', 1, 0, '2026-04-13 10:00:00', '2026-04-13 10:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_contact_us`
--

CREATE TABLE `tbl_contact_us` (
  `id` bigint(20) NOT NULL,
  `title` varchar(64) DEFAULT NULL,
  `email` varchar(256) DEFAULT NULL,
  `message` varchar(128) DEFAULT NULL,
  `status` enum('pending','approved','resolved') DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `is_delete` tinyint(1) DEFAULT 0,
  `resolved_at` timestamp NULL DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_faq`
--

CREATE TABLE `tbl_faq` (
  `id` bigint(20) NOT NULL,
  `question` varchar(64) DEFAULT NULL,
  `answer` varchar(128) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `is_delete` tinyint(1) DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_faq`
--

INSERT INTO `tbl_faq` (`id`, `question`, `answer`, `is_active`, `is_delete`, `created_at`, `updated_at`) VALUES
(1, 'How can I place an order?', 'Browse products, add them to cart, and complete checkout from your cart page.', 1, 0, '2026-04-13 10:00:00', '2026-04-13 10:00:00'),
(2, 'Can I track my order?', 'Yes. Open your order history to view the latest order status and updates.', 1, 0, '2026-04-13 10:00:00', '2026-04-13 10:00:00'),
(3, 'How do I cancel an order?', 'You can cancel eligible orders from the order details screen before dispatch.', 1, 0, '2026-04-13 10:00:00', '2026-04-13 10:00:00'),
(4, 'What payment methods are supported?', 'The app supports card, wallet, and other payment methods configured by the store.', 1, 0, '2026-04-13 10:00:00', '2026-04-13 10:00:00'),
(5, 'How do I contact support?', 'Use the contact us section in the app to send your question to the support team.', 1, 0, '2026-04-13 10:00:00', '2026-04-13 10:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_measurement`
--

CREATE TABLE `tbl_measurement` (
  `id` bigint(20) NOT NULL,
  `name` varchar(64) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `is_delete` tinyint(1) DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_measurement`
--

INSERT INTO `tbl_measurement` (`id`, `name`, `is_active`, `is_delete`, `created_at`, `updated_at`) VALUES
(1, 'Length', 1, 0, '2026-04-13 10:00:00', '2026-04-13 10:00:00'),
(2, 'Width', 1, 0, '2026-04-13 10:00:00', '2026-04-13 10:00:00'),
(3, 'Sleeve Length', 1, 0, '2026-04-13 10:00:00', '2026-04-13 10:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_notification`
--

CREATE TABLE `tbl_notification` (
  `id` bigint(20) NOT NULL,
  `sender_id` bigint(20) DEFAULT NULL,
  `receiver_id` bigint(20) DEFAULT NULL,
  `title` varchar(64) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `is_delete` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_notification`
--

INSERT INTO `tbl_notification` (`id`, `sender_id`, `receiver_id`, `title`, `description`, `is_read`, `is_active`, `is_delete`, `created_at`, `updated_at`) VALUES
(6, NULL, 16, 'Order Placed', 'Your order ORD-1776142505435-221 has been placed successfully.', 1, 1, 0, '2026-04-14 04:55:05', '2026-04-14 05:32:05'),
(7, NULL, 16, 'Order Placed', 'Your order ORD-1776144721919-553 has been placed successfully.', 1, 1, 0, '2026-04-14 05:32:01', '2026-04-14 05:32:05'),
(8, NULL, 16, 'Order Cancelled', 'Your order ORD-1776081207109-688 has been cancelled successfully.', 1, 1, 0, '2026-04-14 06:33:39', '2026-04-14 06:34:02');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_orders`
--

CREATE TABLE `tbl_orders` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `payment_id` bigint(20) DEFAULT NULL,
  `order_code` varchar(64) DEFAULT NULL,
  `order_date` datetime DEFAULT NULL,
  `subtotal` decimal(10,2) DEFAULT NULL,
  `tax` decimal(10,2) DEFAULT NULL,
  `discount` decimal(10,2) DEFAULT NULL,
  `total` decimal(10,2) DEFAULT NULL,
  `latitude` varchar(32) DEFAULT NULL,
  `longitude` varchar(32) DEFAULT NULL,
  `location` varchar(64) DEFAULT NULL,
  `total_amount` decimal(10,2) DEFAULT NULL,
  `payment_mode` enum('cash_on_delivery','card','upi') DEFAULT NULL,
  `order_status` enum('placed','delivered','cancelled') DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `is_delete` tinyint(1) DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_orders`
--

INSERT INTO `tbl_orders` (`id`, `user_id`, `payment_id`, `order_code`, `order_date`, `subtotal`, `tax`, `discount`, `total`, `latitude`, `longitude`, `location`, `total_amount`, `payment_mode`, `order_status`, `is_active`, `is_delete`, `created_at`, `updated_at`) VALUES
(2, 14, NULL, 'ORD002', '2026-04-10 18:39:43', 18000.00, 1800.00, 500.00, 19300.00, '19.21833000000000', '72.97808900000000', 'Thane', 19300.00, 'card', 'delivered', 1, 0, '2026-04-10 18:39:43', '2026-04-10 18:39:43'),
(5, 14, NULL, 'ORDA14001', '2026-04-13 11:00:00', 760.00, 76.00, 30.00, 806.00, '19.07609000000000', '72.87770000000000', 'Mumbai', 806.00, 'card', 'placed', 1, 0, '2026-04-13 11:00:00', '2026-04-13 11:00:00'),
(6, 16, NULL, 'ORDA16001', '2026-04-13 11:00:00', 700.00, 70.00, 25.00, 745.00, '19.07609000000000', '72.87770000000000', 'Mumbai', 745.00, 'cash_on_delivery', 'placed', 1, 0, '2026-04-13 11:00:00', '2026-04-13 11:00:00'),
(7, 16, NULL, 'ORD-1776081086687-932', '2026-04-13 17:21:26', 150.00, 7.50, 10.00, 147.50, '25.2048', '55.2708', 'Dubai, UAE', 147.50, 'card', 'placed', 1, 0, '2026-04-13 17:21:26', '2026-04-13 17:21:26'),
(8, 16, NULL, 'ORD-1776081207109-688', '2026-04-13 17:23:27', 150.00, 7.50, 10.00, 147.50, '25.2048', '55.2708', 'Dubai, UAE', 147.50, 'card', 'cancelled', 1, 0, '2026-04-13 17:23:27', '2026-04-14 12:03:39'),
(9, 16, NULL, 'ORD-1776087499182-535', '2026-04-13 19:08:19', 150.00, 7.50, 10.00, 147.50, '25.2048', '55.2708', 'Dubai, UAE', 147.50, 'card', 'placed', 1, 0, '2026-04-13 19:08:19', '2026-04-13 19:08:19'),
(10, 16, NULL, 'ORD-1776087539667-672', '2026-04-13 19:08:59', 150.00, 7.50, 10.00, 147.50, '25.2048', '55.2708', 'Dubai, UAE', 147.50, 'card', 'placed', 1, 0, '2026-04-13 19:08:59', '2026-04-13 19:08:59'),
(11, 16, NULL, 'ORD-1776087559201-694', '2026-04-13 19:09:19', 150.00, 7.50, 10.00, 147.50, '25.2048', '55.2708', 'Dubai, UAE', 147.50, 'card', 'placed', 1, 0, '2026-04-13 19:09:19', '2026-04-13 19:09:19'),
(12, 16, NULL, 'ORD-1776142017931-6', '2026-04-14 10:16:57', 150.00, 7.50, 10.00, 147.50, '25.2048', '55.2708', 'Dubai, UAE', 147.50, 'card', 'placed', 1, 0, '2026-04-14 10:16:57', '2026-04-14 10:16:57'),
(13, 16, NULL, 'ORD-1776142061939-147', '2026-04-14 10:17:41', 150.00, 7.50, 10.00, 147.50, '25.2048', '55.2708', 'Dubai, UAE', 147.50, 'card', 'placed', 1, 0, '2026-04-14 10:17:41', '2026-04-14 10:17:41'),
(14, 16, NULL, 'ORD-1776142123796-192', '2026-04-14 10:18:43', 150.00, 7.50, 10.00, 147.50, '25.2048', '55.2708', 'Dubai, UAE', 147.50, 'card', 'placed', 1, 0, '2026-04-14 10:18:43', '2026-04-14 10:18:43'),
(15, 16, NULL, 'ORD-1776142174080-695', '2026-04-14 10:19:34', 150.00, 7.50, 10.00, 147.50, '25.2048', '55.2708', 'Dubai, UAE', 147.50, 'card', 'placed', 1, 0, '2026-04-14 10:19:34', '2026-04-14 10:19:34'),
(16, 16, NULL, 'ORD-1776142277469-337', '2026-04-14 10:21:17', 150.00, 7.50, 10.00, 147.50, '25.2048', '55.2708', 'Dubai, UAE', 147.50, 'card', 'placed', 1, 0, '2026-04-14 10:21:17', '2026-04-14 10:21:17'),
(17, 16, NULL, 'ORD-1776142380573-510', '2026-04-14 10:23:00', 150.00, 7.50, 10.00, 147.50, '25.2048', '55.2708', 'Dubai, UAE', 147.50, 'card', 'placed', 1, 0, '2026-04-14 10:23:00', '2026-04-14 10:23:00'),
(18, 16, NULL, 'ORD-1776142505435-221', '2026-04-14 10:25:05', 150.00, 7.50, 10.00, 147.50, '25.2048', '55.2708', 'Dubai, UAE', 147.50, 'card', 'placed', 1, 0, '2026-04-14 10:25:05', '2026-04-14 10:25:05'),
(19, 16, NULL, 'ORD-1776144721919-553', '2026-04-14 11:02:01', 150.00, 7.50, 10.00, 147.50, '25.2048', '55.2708', 'Dubai, UAE', 147.50, 'card', 'placed', 1, 0, '2026-04-14 11:02:01', '2026-04-14 11:02:01');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_order_items`
--

CREATE TABLE `tbl_order_items` (
  `id` bigint(20) NOT NULL,
  `order_id` bigint(20) DEFAULT NULL,
  `variant_id` bigint(20) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `is_delete` tinyint(1) DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_order_items`
--

INSERT INTO `tbl_order_items` (`id`, `order_id`, `variant_id`, `quantity`, `price`, `is_active`, `is_delete`, `created_at`, `updated_at`) VALUES
(3, 5, 27, 2, 550.00, 1, 0, '2026-04-13 11:05:00', '2026-04-13 11:05:00'),
(4, 6, 14, 1, 320.00, 1, 0, '2026-04-13 11:05:00', '2026-04-13 11:05:00'),
(5, 8, 36, 1, 0.00, 1, 0, '2026-04-13 17:23:27', '2026-04-13 17:23:27'),
(6, 8, 6, 1, 0.00, 1, 0, '2026-04-13 17:23:27', '2026-04-13 17:23:27'),
(7, 9, 6, 1, 0.00, 1, 0, '2026-04-13 19:08:19', '2026-04-13 19:08:19'),
(8, 10, 6, 1, 0.00, 1, 0, '2026-04-13 19:08:59', '2026-04-13 19:08:59'),
(9, 11, 6, 1, 0.00, 1, 0, '2026-04-13 19:09:19', '2026-04-13 19:09:19'),
(10, 12, 6, 1, 0.00, 1, 0, '2026-04-14 10:16:57', '2026-04-14 10:16:57'),
(11, 13, 6, 1, 0.00, 1, 0, '2026-04-14 10:17:41', '2026-04-14 10:17:41'),
(12, 14, 6, 1, 0.00, 1, 0, '2026-04-14 10:18:43', '2026-04-14 10:18:43'),
(13, 15, 6, 1, 0.00, 1, 0, '2026-04-14 10:19:34', '2026-04-14 10:19:34'),
(14, 16, 6, 1, 0.00, 1, 0, '2026-04-14 10:21:17', '2026-04-14 10:21:17'),
(15, 17, 6, 1, 0.00, 1, 0, '2026-04-14 10:23:00', '2026-04-14 10:23:00'),
(16, 18, 6, 1, 0.00, 1, 0, '2026-04-14 10:25:05', '2026-04-14 10:25:05'),
(17, 19, 6, 1, 0.00, 1, 0, '2026-04-14 11:02:01', '2026-04-14 11:02:01');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_otp`
--

CREATE TABLE `tbl_otp` (
  `id` bigint(20) NOT NULL,
  `country_code` varchar(8) DEFAULT NULL,
  `mobile_number` varchar(16) DEFAULT NULL,
  `email` varchar(256) DEFAULT NULL,
  `otp` varchar(8) DEFAULT NULL,
  `otp_purpose` enum('signup','forgot_password') DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `is_delete` tinyint(1) DEFAULT 0,
  `expires_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_otp`
--

INSERT INTO `tbl_otp` (`id`, `country_code`, `mobile_number`, `email`, `otp`, `otp_purpose`, `is_active`, `is_delete`, `expires_at`, `created_at`, `updated_at`) VALUES
(1, '+91', '95104479522', NULL, '1234', 'signup', 0, 1, '2026-04-10 09:17:41', '2026-04-10 05:12:41', '2026-04-10 05:25:56'),
(2, '+91', '95104479522', NULL, '1234', 'signup', 1, 1, '2026-04-10 05:47:47', '2026-04-10 05:42:47', '2026-04-10 09:50:36'),
(3, '+91', '95104479522', NULL, '1234', 'signup', 1, 0, '2026-04-10 09:55:36', '2026-04-10 09:50:36', '2026-04-10 09:50:36'),
(4, '+91', '95104479545', NULL, '1234', 'signup', 0, 1, '2026-04-10 09:55:47', '2026-04-10 09:50:47', '2026-04-10 09:53:01'),
(5, '+91', '95104479545', NULL, '1234', 'signup', 1, 0, '2026-04-11 20:29:20', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(6, '+91', '8817728171', NULL, '1234', 'signup', 0, 1, '2026-04-13 13:14:59', '0000-00-00 00:00:00', '2026-04-12 13:18:11'),
(7, NULL, NULL, 'sahilmansursi883@gmail.com', '1234', 'forgot_password', 1, 0, '2026-04-12 13:23:28', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(8, '+91', '95104479521', NULL, '1234', 'signup', 1, 0, '2026-04-12 13:23:36', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(9, '+91', '8817728171', NULL, '1234', 'signup', 1, 0, '2026-04-15 14:30:26', '2026-04-15 14:25:26', '2026-04-15 14:25:26'),
(10, '+91', '8817728171123', NULL, '1234', 'signup', 1, 1, '2026-04-15 14:33:07', '2026-04-15 14:28:07', '2026-04-15 14:50:04'),
(11, '+91', '8817728171123', NULL, '1234', 'signup', 1, 0, '2026-04-15 14:55:04', '2026-04-15 14:50:04', '2026-04-15 15:09:25'),
(12, '+91', '88177281515151515171', NULL, '1234', 'signup', 1, 0, '2026-04-15 15:55:53', '2026-04-15 15:50:53', '2026-04-15 15:50:53'),
(13, '+91', '123456770', NULL, '1234', 'signup', 0, 1, '2026-04-15 16:01:04', '2026-04-15 15:56:04', '2026-04-15 16:00:13'),
(14, '+91', '123456771', NULL, '1234', 'signup', 0, 1, '2026-04-15 17:43:08', '2026-04-15 17:38:08', '2026-04-15 17:38:15'),
(15, '+91', '123456772', NULL, '1234', 'signup', 0, 1, '2026-04-15 17:45:29', '2026-04-15 17:40:29', '2026-04-15 17:40:32'),
(16, '+91', '123456773', NULL, '1234', 'signup', 0, 1, '2026-04-15 17:46:32', '2026-04-15 17:41:32', '2026-04-15 17:41:37'),
(17, '+91', '123456773', NULL, '1234', 'signup', 1, 0, '2026-04-15 17:59:35', '2026-04-15 17:54:35', '2026-04-15 17:54:35'),
(18, '+91', '123456774', NULL, '1234', 'signup', 0, 1, '2026-04-15 17:59:45', '2026-04-15 17:54:45', '2026-04-15 17:54:47'),
(19, '+91', '123456775', NULL, '1234', 'signup', 0, 1, '2026-04-15 18:03:55', '2026-04-15 17:58:55', '2026-04-15 17:59:12'),
(20, '+91', '123456776', NULL, '1234', 'signup', 0, 1, '2026-04-15 18:06:30', '2026-04-15 18:01:30', '2026-04-15 18:01:38'),
(21, '+91', '123456776', NULL, '1234', 'signup', 0, 1, '2026-04-15 18:10:06', '2026-04-15 18:05:06', '2026-04-15 18:05:11'),
(22, '+91', '123456776', NULL, '1234', 'signup', 0, 1, '2026-04-15 18:14:29', '2026-04-15 18:09:29', '2026-04-15 18:09:34'),
(23, '+91', '123456776', NULL, '1234', 'signup', 0, 1, '2026-04-15 18:15:20', '2026-04-15 18:10:20', '2026-04-15 18:10:24'),
(24, '+91', '123456776', NULL, '1234', 'signup', 0, 1, '2026-04-15 18:19:32', '2026-04-15 18:14:32', '2026-04-15 18:14:35'),
(25, '+91', '123456779', NULL, '1234', 'signup', 0, 1, '2026-04-15 19:13:21', '2026-04-15 19:08:21', '2026-04-15 19:08:25'),
(26, '+91', '123456780', NULL, '1234', 'signup', 0, 1, '2026-04-15 19:23:57', '2026-04-15 19:18:57', '2026-04-15 19:19:10'),
(27, '+91', '123456781', NULL, '1234', 'signup', 0, 1, '2026-04-15 19:24:49', '2026-04-15 19:19:49', '2026-04-15 19:19:53'),
(28, '+91', '123456786', NULL, '1234', 'signup', 0, 1, '2026-04-16 10:35:34', '2026-04-16 10:30:34', '2026-04-16 10:30:43'),
(29, '+91', '123456776', NULL, '1234', 'signup', 1, 1, '2026-04-16 12:05:27', '2026-04-16 12:00:27', '2026-04-16 13:28:36'),
(30, '+91', '123456776', NULL, '1234', 'signup', 1, 1, '2026-04-16 13:33:36', '2026-04-16 13:28:36', '2026-04-16 16:05:45'),
(31, '+91', '123456776', NULL, '1234', 'signup', 1, 0, '2026-04-16 16:10:45', '2026-04-16 16:05:45', '2026-04-16 16:05:45'),
(32, '+91', '123456777', NULL, '1234', 'signup', 1, 0, '2026-04-16 16:12:05', '2026-04-16 16:07:05', '2026-04-16 16:07:05');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_payment`
--

CREATE TABLE `tbl_payment` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `card_holder_name` varchar(64) DEFAULT NULL,
  `card_number` varchar(32) DEFAULT NULL,
  `card_expiry_date` datetime DEFAULT NULL,
  `payment_mode` enum('card','upi') DEFAULT NULL,
  `upi_id` varchar(64) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `is_delete` tinyint(1) DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_payment`
--

INSERT INTO `tbl_payment` (`id`, `user_id`, `card_holder_name`, `card_number`, `card_expiry_date`, `payment_mode`, `upi_id`, `is_active`, `is_delete`, `created_at`, `updated_at`) VALUES
(1, 16, 'sahilmansuri', 'H23HRNRK567', '2027-04-13 00:00:00', 'card', NULL, 1, 0, '2026-04-13 16:02:44', '2026-04-13 16:02:44'),
(2, 16, 'sahilmansuri', 'H23HRNRK567', '2027-04-13 00:00:00', 'card', NULL, 1, 0, '2026-04-13 16:02:54', '2026-04-13 16:02:54'),
(3, 16, 'sahilmansuri', 'H23HRNRK567', '2027-04-13 00:00:00', 'card', NULL, 1, 0, '2026-04-13 16:04:17', '2026-04-13 16:04:17');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_platform_offer`
--

CREATE TABLE `tbl_platform_offer` (
  `id` bigint(20) NOT NULL,
  `image` text DEFAULT NULL,
  `discount_type` enum('F','P') DEFAULT NULL,
  `discount_amount` decimal(10,2) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `is_delete` tinyint(1) DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_platform_offer`
--

INSERT INTO `tbl_platform_offer` (`id`, `image`, `discount_type`, `discount_amount`, `is_active`, `is_delete`, `created_at`, `updated_at`) VALUES
(1, 'uploads/banner1.jpg', 'P', 10.00, 1, 0, '2026-04-10 17:30:58', '2026-04-10 17:30:58'),
(2, 'uploads/banner2.jpg', 'F', 200.00, 1, 0, '2026-04-10 17:30:58', '2026-04-10 17:30:58'),
(3, 'uploads/banner3.jpg', 'P', 25.50, 1, 0, '2026-04-10 17:30:58', '2026-04-10 17:30:58'),
(4, 'uploads/banner4.jpg', 'F', 150.00, 0, 0, '2026-04-10 17:30:58', '2026-04-10 17:30:58'),
(5, 'uploads/banner5.jpg', 'P', 5.00, 1, 1, '2026-04-10 17:30:58', '2026-04-10 17:30:58');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_product`
--

CREATE TABLE `tbl_product` (
  `id` bigint(20) NOT NULL,
  `store_id` bigint(20) DEFAULT NULL,
  `category_id` bigint(20) DEFAULT NULL,
  `name` varchar(64) DEFAULT NULL,
  `description` varchar(128) DEFAULT NULL,
  `additional_info` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`additional_info`)),
  `base_price` decimal(10,2) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `is_delete` tinyint(1) DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_product`
--

INSERT INTO `tbl_product` (`id`, `store_id`, `category_id`, `name`, `description`, `additional_info`, `base_price`, `is_active`, `is_delete`, `created_at`, `updated_at`) VALUES
(5, 2, 7, 'Jilabiya Black Polyester Abaya', 'Flowy black abaya with soft premium drape', '{\"fabric\":\"Polyester\",\"fit\":\"Relaxed\",\"care\":\"Machine wash cold\",\"country_of_origin\":\"UAE\"}', 400.00, 1, 0, '2026-04-13 10:05:00', '2026-04-13 10:05:00'),
(6, 2, 7, 'Floral Embroidered Abaya', 'Classic abaya with subtle floral embroidery', '{\"fabric\":\"Nida\",\"fit\":\"Regular\",\"care\":\"Dry clean preferred\",\"country_of_origin\":\"UAE\"}', 520.00, 1, 0, '2026-04-13 10:05:00', '2026-04-13 10:05:00'),
(7, 2, 7, 'Evening Kaftan Dress', 'Elegant kaftan for evening events', '{\"fabric\":\"Chiffon\",\"fit\":\"Flowy\",\"care\":\"Hand wash\",\"country_of_origin\":\"India\"}', 650.00, 1, 0, '2026-04-13 10:05:00', '2026-04-13 10:05:00'),
(8, 1, 8, 'Cotton Kurti Blue', 'Daily wear breathable cotton kurti', '{\"fabric\":\"Cotton\",\"fit\":\"Straight\",\"care\":\"Machine wash\",\"country_of_origin\":\"India\"}', 320.00, 1, 0, '2026-04-13 10:05:00', '2026-04-13 10:05:00'),
(9, 1, 8, 'Rayon Kurti Pink', 'Comfort rayon kurti with light print', '{\"fabric\":\"Rayon\",\"fit\":\"Regular\",\"care\":\"Machine wash\",\"country_of_origin\":\"India\"}', 360.00, 1, 0, '2026-04-13 10:05:00', '2026-04-13 10:05:00'),
(10, 1, 9, 'Linen Top Beige', 'Soft linen top for everyday style', '{\"fabric\":\"Linen Blend\",\"fit\":\"Slim\",\"care\":\"Machine wash\",\"country_of_origin\":\"India\"}', 280.00, 1, 0, '2026-04-13 10:05:00', '2026-04-13 10:05:00'),
(11, 1, 9, 'Satin Top Black', 'Party wear satin top with smooth finish', '{\"fabric\":\"Satin\",\"fit\":\"Regular\",\"care\":\"Hand wash\",\"country_of_origin\":\"China\"}', 420.00, 1, 0, '2026-04-13 10:05:00', '2026-04-13 10:05:00'),
(12, 3, 4, 'Mens Oxford Shirt White', 'Formal oxford shirt with modern cut', '{\"fabric\":\"Cotton\",\"fit\":\"Tailored\",\"care\":\"Machine wash\",\"country_of_origin\":\"Bangladesh\"}', 550.00, 1, 0, '2026-04-13 10:05:00', '2026-04-13 10:05:00'),
(13, 3, 5, 'Mens Graphic T-Shirt Olive', 'Casual printed tee for daily wear', '{\"fabric\":\"Cotton\",\"fit\":\"Regular\",\"care\":\"Machine wash\",\"country_of_origin\":\"India\"}', 240.00, 1, 0, '2026-04-13 10:05:00', '2026-04-13 10:05:00'),
(14, 3, 5, 'Mens Polo T-Shirt Navy', 'Pique polo t-shirt with soft collar', '{\"fabric\":\"Cotton Pique\",\"fit\":\"Regular\",\"care\":\"Machine wash\",\"country_of_origin\":\"India\"}', 340.00, 1, 0, '2026-04-13 10:05:00', '2026-04-13 10:05:00'),
(15, 1, 11, 'Kids Cartoon T-Shirt Yellow', 'Soft cotton t-shirt with cartoon print', '{\"fabric\":\"Cotton\",\"fit\":\"Comfort\",\"care\":\"Machine wash\",\"country_of_origin\":\"India\"}', 180.00, 1, 0, '2026-04-13 10:05:00', '2026-04-13 10:05:00'),
(16, 1, 11, 'Kids Denim Shirt Blue', 'Lightweight denim shirt for kids', '{\"fabric\":\"Denim\",\"fit\":\"Regular\",\"care\":\"Machine wash\",\"country_of_origin\":\"India\"}', 300.00, 1, 0, '2026-04-13 10:05:00', '2026-04-13 10:05:00');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_product_discount`
--

CREATE TABLE `tbl_product_discount` (
  `id` bigint(20) NOT NULL,
  `product_id` bigint(20) DEFAULT NULL,
  `discount_type` enum('flat','percentage') DEFAULT NULL,
  `discount_value` decimal(10,2) DEFAULT NULL,
  `start_date` datetime DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `is_delete` tinyint(1) DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_product_discount`
--

INSERT INTO `tbl_product_discount` (`id`, `product_id`, `discount_type`, `discount_value`, `start_date`, `end_date`, `is_active`, `is_delete`, `created_at`, `updated_at`) VALUES
(5, 5, 'percentage', 10.00, '2026-04-13 00:00:00', '2026-05-13 23:59:59', 1, 0, '2026-04-13 10:15:00', '2026-04-13 10:15:00'),
(6, 6, 'flat', 40.00, '2026-04-13 00:00:00', '2026-05-01 23:59:59', 1, 0, '2026-04-13 10:15:00', '2026-04-13 10:15:00'),
(7, 8, 'percentage', 15.00, '2026-04-13 00:00:00', '2026-04-30 23:59:59', 1, 0, '2026-04-13 10:15:00', '2026-04-13 10:15:00'),
(8, 10, 'flat', 25.00, '2026-04-13 00:00:00', '2026-04-28 23:59:59', 1, 0, '2026-04-13 10:15:00', '2026-04-13 10:15:00'),
(9, 12, 'percentage', 12.00, '2026-04-13 00:00:00', '2026-05-10 23:59:59', 1, 0, '2026-04-13 10:15:00', '2026-04-13 10:15:00'),
(10, 14, 'percentage', 8.00, '2026-04-13 00:00:00', '2026-05-05 23:59:59', 1, 0, '2026-04-13 10:15:00', '2026-04-13 10:15:00');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_product_favourites`
--

CREATE TABLE `tbl_product_favourites` (
  `id` bigint(20) NOT NULL,
  `product_id` bigint(20) DEFAULT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `is_delete` tinyint(1) DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_product_favourites`
--

INSERT INTO `tbl_product_favourites` (`id`, `product_id`, `user_id`, `is_active`, `is_delete`, `created_at`, `updated_at`) VALUES
(1, 6, 16, 1, 0, '2026-04-13 18:47:22', '2026-04-13 18:47:29');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_product_image`
--

CREATE TABLE `tbl_product_image` (
  `id` bigint(20) NOT NULL,
  `product_id` bigint(20) DEFAULT NULL,
  `image_url` varchar(256) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `is_delete` tinyint(1) DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_product_image`
--

INSERT INTO `tbl_product_image` (`id`, `product_id`, `image_url`, `is_active`, `is_delete`, `created_at`, `updated_at`) VALUES
(6, 5, 'uploads/products/abaya_black_1.jpg', 1, 0, '2026-04-13 10:10:00', '2026-04-13 10:10:00'),
(7, 5, 'uploads/products/abaya_black_2.jpg', 1, 0, '2026-04-13 10:10:00', '2026-04-13 10:10:00'),
(8, 5, 'uploads/products/abaya_black_3.jpg', 1, 0, '2026-04-13 10:10:00', '2026-04-13 10:10:00'),
(9, 6, 'uploads/products/abaya_floral_1.jpg', 1, 0, '2026-04-13 10:10:00', '2026-04-13 10:10:00'),
(10, 6, 'uploads/products/abaya_floral_2.jpg', 1, 0, '2026-04-13 10:10:00', '2026-04-13 10:10:00'),
(11, 7, 'uploads/products/kaftan_evening_1.jpg', 1, 0, '2026-04-13 10:10:00', '2026-04-13 10:10:00'),
(12, 7, 'uploads/products/kaftan_evening_2.jpg', 1, 0, '2026-04-13 10:10:00', '2026-04-13 10:10:00'),
(13, 8, 'uploads/products/kurti_blue_1.jpg', 1, 0, '2026-04-13 10:10:00', '2026-04-13 10:10:00'),
(14, 8, 'uploads/products/kurti_blue_2.jpg', 1, 0, '2026-04-13 10:10:00', '2026-04-13 10:10:00'),
(15, 9, 'uploads/products/kurti_pink_1.jpg', 1, 0, '2026-04-13 10:10:00', '2026-04-13 10:10:00'),
(16, 10, 'uploads/products/top_linen_beige_1.jpg', 1, 0, '2026-04-13 10:10:00', '2026-04-13 10:10:00'),
(17, 11, 'uploads/products/top_satin_black_1.jpg', 1, 0, '2026-04-13 10:10:00', '2026-04-13 10:10:00'),
(18, 12, 'uploads/products/mens_oxford_white_1.jpg', 1, 0, '2026-04-13 10:10:00', '2026-04-13 10:10:00'),
(19, 13, 'uploads/products/mens_graphic_olive_1.jpg', 1, 0, '2026-04-13 10:10:00', '2026-04-13 10:10:00'),
(20, 14, 'uploads/products/mens_polo_navy_1.jpg', 1, 0, '2026-04-13 10:10:00', '2026-04-13 10:10:00'),
(21, 15, 'uploads/products/kids_cartoon_yellow_1.jpg', 1, 0, '2026-04-13 10:10:00', '2026-04-13 10:10:00'),
(22, 16, 'uploads/products/kids_denim_blue_1.jpg', 1, 0, '2026-04-13 10:10:00', '2026-04-13 10:10:00');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_product_rating`
--

CREATE TABLE `tbl_product_rating` (
  `id` bigint(20) NOT NULL,
  `product_id` bigint(20) DEFAULT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `rating` int(11) DEFAULT NULL,
  `review` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `is_delete` tinyint(1) DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_product_rating`
--

INSERT INTO `tbl_product_rating` (`id`, `product_id`, `user_id`, `rating`, `review`, `is_active`, `is_delete`, `created_at`, `updated_at`) VALUES
(7, 5, 14, 4, 'Good fabric and elegant style', 1, 0, '2026-04-13 10:20:00', '2026-04-13 10:20:00'),
(9, 7, 14, 4, 'Perfect for evening events', 1, 0, '2026-04-13 10:20:00', '2026-04-13 10:20:00'),
(10, 8, 16, 4, 'Comfortable daily wear kurti', 1, 0, '2026-04-13 10:20:00', '2026-04-13 10:20:00'),
(12, 10, 14, 5, 'Very soft and stylish top', 1, 0, '2026-04-13 10:20:00', '2026-04-13 10:20:00'),
(13, 11, 16, 4, 'Nice satin finish for parties', 1, 0, '2026-04-13 10:20:00', '2026-04-13 10:20:00'),
(15, 13, 14, 4, 'Good t-shirt print and comfort', 1, 0, '2026-04-13 10:20:00', '2026-04-13 10:20:00'),
(16, 14, 16, 4, 'Polo feels premium and breathable', 1, 0, '2026-04-13 10:20:00', '2026-04-13 10:20:00'),
(18, 16, 14, 4, 'Nice kids denim shirt', 1, 0, '2026-04-13 10:20:00', '2026-04-13 10:20:00'),
(19, 6, 16, 4, 'veri nice', 1, 0, '2026-04-13 18:36:50', '2026-04-13 18:36:50');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_product_return`
--

CREATE TABLE `tbl_product_return` (
  `id` bigint(20) NOT NULL,
  `order_item_id` bigint(20) DEFAULT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `return_reason` enum('defective','damaged','wrong_item','wrong_size','wrong_color','wrong_price','other') DEFAULT NULL,
  `return_description` varchar(128) DEFAULT NULL,
  `return_status` enum('pending','approved','rejected') DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `is_delete` tinyint(1) DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_product_size_chart`
--

CREATE TABLE `tbl_product_size_chart` (
  `id` bigint(20) NOT NULL,
  `product_id` bigint(20) DEFAULT NULL,
  `size_id` bigint(20) DEFAULT NULL,
  `measurement_id` bigint(20) DEFAULT NULL,
  `value` varchar(16) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `is_delete` tinyint(1) DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_product_size_chart`
--

INSERT INTO `tbl_product_size_chart` (`id`, `product_id`, `size_id`, `measurement_id`, `value`, `is_active`, `is_delete`, `created_at`, `updated_at`) VALUES
(1, 5, 6, 1, '52', 1, 0, '2026-04-13 10:30:00', '2026-04-13 10:30:00'),
(2, 5, 6, 2, '22', 1, 0, '2026-04-13 10:30:00', '2026-04-13 10:30:00'),
(3, 5, 6, 3, '26', 1, 0, '2026-04-13 10:30:00', '2026-04-13 10:30:00'),
(4, 5, 7, 1, '54', 1, 0, '2026-04-13 10:30:00', '2026-04-13 10:30:00'),
(5, 5, 7, 2, '24', 1, 0, '2026-04-13 10:30:00', '2026-04-13 10:30:00'),
(6, 5, 7, 3, '27', 1, 0, '2026-04-13 10:30:00', '2026-04-13 10:30:00'),
(7, 5, 8, 1, '56', 1, 0, '2026-04-13 10:30:00', '2026-04-13 10:30:00'),
(8, 5, 8, 2, '26', 1, 0, '2026-04-13 10:30:00', '2026-04-13 10:30:00'),
(9, 5, 8, 3, '28', 1, 0, '2026-04-13 10:30:00', '2026-04-13 10:30:00'),
(10, 5, 9, 1, '58', 1, 0, '2026-04-13 10:30:00', '2026-04-13 10:30:00'),
(11, 5, 9, 2, '28', 1, 0, '2026-04-13 10:30:00', '2026-04-13 10:30:00'),
(12, 5, 9, 3, '29', 1, 0, '2026-04-13 10:30:00', '2026-04-13 10:30:00'),
(13, 5, 10, 1, '60', 1, 0, '2026-04-13 10:30:00', '2026-04-13 10:30:00'),
(14, 5, 10, 2, '30', 1, 0, '2026-04-13 10:30:00', '2026-04-13 10:30:00'),
(15, 5, 10, 3, '30', 1, 0, '2026-04-13 10:30:00', '2026-04-13 10:30:00'),
(16, 6, 6, 1, '52', 1, 0, '2026-04-13 10:30:00', '2026-04-13 10:30:00'),
(17, 6, 6, 2, '23', 1, 0, '2026-04-13 10:30:00', '2026-04-13 10:30:00'),
(18, 6, 6, 3, '26', 1, 0, '2026-04-13 10:30:00', '2026-04-13 10:30:00'),
(19, 6, 7, 1, '54', 1, 0, '2026-04-13 10:30:00', '2026-04-13 10:30:00'),
(20, 6, 7, 2, '25', 1, 0, '2026-04-13 10:30:00', '2026-04-13 10:30:00'),
(21, 6, 7, 3, '27', 1, 0, '2026-04-13 10:30:00', '2026-04-13 10:30:00'),
(22, 6, 8, 1, '56', 1, 0, '2026-04-13 10:30:00', '2026-04-13 10:30:00'),
(23, 6, 8, 2, '27', 1, 0, '2026-04-13 10:30:00', '2026-04-13 10:30:00'),
(24, 6, 8, 3, '28', 1, 0, '2026-04-13 10:30:00', '2026-04-13 10:30:00');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_product_variant`
--

CREATE TABLE `tbl_product_variant` (
  `id` bigint(20) NOT NULL,
  `product_id` bigint(20) DEFAULT NULL,
  `size_id` bigint(20) DEFAULT NULL,
  `color_id` bigint(20) DEFAULT NULL,
  `type_id` bigint(20) DEFAULT NULL,
  `stock` int(11) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `is_delete` tinyint(1) DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_product_variant`
--

INSERT INTO `tbl_product_variant` (`id`, `product_id`, `size_id`, `color_id`, `type_id`, `stock`, `price`, `is_active`, `is_delete`, `created_at`, `updated_at`) VALUES
(1, 5, 6, 1, 2, 20, 400.00, 1, 0, '2026-04-13 10:25:00', '2026-04-13 10:25:00'),
(2, 5, 7, 1, 2, 18, 400.00, 1, 0, '2026-04-13 10:25:00', '2026-04-13 10:25:00'),
(3, 5, 8, 1, 2, 16, 400.00, 1, 0, '2026-04-13 10:25:00', '2026-04-13 10:25:00'),
(4, 5, 9, 1, 2, 12, 400.00, 1, 0, '2026-04-13 10:25:00', '2026-04-13 10:25:00'),
(5, 5, 10, 1, 2, 10, 400.00, 1, 0, '2026-04-13 10:25:00', '2026-04-13 10:25:00'),
(6, 6, 6, 1, 1, 3, 520.00, 1, 0, '2026-04-13 10:25:00', '2026-04-14 11:02:01'),
(7, 6, 7, 1, 1, 15, 520.00, 1, 0, '2026-04-13 10:25:00', '2026-04-13 10:25:00'),
(8, 6, 8, 6, 1, 12, 520.00, 1, 0, '2026-04-13 10:25:00', '2026-04-13 10:25:00'),
(9, 6, 9, 6, 1, 10, 520.00, 1, 0, '2026-04-13 10:25:00', '2026-04-13 10:25:00'),
(10, 7, 3, 3, 2, 8, 650.00, 1, 0, '2026-04-13 10:25:00', '2026-04-13 10:25:00'),
(11, 7, 4, 3, 2, 8, 650.00, 1, 0, '2026-04-13 10:25:00', '2026-04-13 10:25:00'),
(12, 7, 5, 2, 2, 6, 650.00, 1, 0, '2026-04-13 10:25:00', '2026-04-13 10:25:00'),
(13, 8, 2, 7, 3, 22, 320.00, 1, 0, '2026-04-13 10:25:00', '2026-04-13 10:25:00'),
(14, 8, 3, 7, 3, 20, 320.00, 1, 0, '2026-04-13 10:25:00', '2026-04-13 10:25:00'),
(15, 8, 4, 7, 3, 18, 320.00, 1, 0, '2026-04-13 10:25:00', '2026-04-13 10:25:00'),
(16, 8, 5, 6, 3, 12, 320.00, 1, 0, '2026-04-13 10:25:00', '2026-04-13 10:25:00'),
(17, 9, 2, 8, 3, 18, 360.00, 1, 0, '2026-04-13 10:25:00', '2026-04-13 10:25:00'),
(18, 9, 3, 8, 3, 16, 360.00, 1, 0, '2026-04-13 10:25:00', '2026-04-13 10:25:00'),
(19, 9, 4, 8, 3, 12, 360.00, 1, 0, '2026-04-13 10:25:00', '2026-04-13 10:25:00'),
(20, 10, 2, 3, 3, 25, 280.00, 1, 0, '2026-04-13 10:25:00', '2026-04-13 10:25:00'),
(21, 10, 3, 3, 3, 24, 280.00, 1, 0, '2026-04-13 10:25:00', '2026-04-13 10:25:00'),
(22, 10, 4, 4, 3, 20, 280.00, 1, 0, '2026-04-13 10:25:00', '2026-04-13 10:25:00'),
(23, 11, 2, 1, 1, 14, 420.00, 1, 0, '2026-04-13 10:25:00', '2026-04-13 10:25:00'),
(24, 11, 3, 1, 1, 14, 420.00, 1, 0, '2026-04-13 10:25:00', '2026-04-13 10:25:00'),
(25, 11, 4, 1, 1, 10, 420.00, 1, 0, '2026-04-13 10:25:00', '2026-04-13 10:25:00'),
(26, 12, 3, 4, 4, 20, 550.00, 1, 0, '2026-04-13 10:25:00', '2026-04-13 10:25:00'),
(27, 12, 4, 4, 4, 20, 550.00, 1, 0, '2026-04-13 10:25:00', '2026-04-13 10:25:00'),
(28, 12, 5, 4, 4, 15, 550.00, 1, 0, '2026-04-13 10:25:00', '2026-04-13 10:25:00'),
(29, 13, 2, 5, 3, 28, 240.00, 1, 0, '2026-04-13 10:25:00', '2026-04-13 10:25:00'),
(30, 13, 3, 5, 3, 28, 240.00, 1, 0, '2026-04-13 10:25:00', '2026-04-13 10:25:00'),
(31, 13, 4, 5, 3, 22, 240.00, 1, 0, '2026-04-13 10:25:00', '2026-04-13 10:25:00'),
(32, 14, 3, 2, 1, 24, 340.00, 1, 0, '2026-04-13 10:25:00', '2026-04-13 10:25:00'),
(33, 14, 4, 2, 1, 24, 340.00, 1, 0, '2026-04-13 10:25:00', '2026-04-13 10:25:00'),
(34, 14, 5, 2, 1, 16, 340.00, 1, 0, '2026-04-13 10:25:00', '2026-04-13 10:25:00'),
(35, 15, 1, 4, 3, 30, 180.00, 1, 0, '2026-04-13 10:25:00', '2026-04-13 10:25:00'),
(36, 15, 2, 4, 3, 27, 180.00, 1, 0, '2026-04-13 10:25:00', '2026-04-13 17:23:27'),
(37, 15, 3, 4, 3, 24, 180.00, 1, 0, '2026-04-13 10:25:00', '2026-04-13 10:25:00'),
(38, 16, 1, 7, 1, 18, 300.00, 1, 0, '2026-04-13 10:25:00', '2026-04-13 10:25:00'),
(39, 16, 2, 7, 1, 18, 300.00, 1, 0, '2026-04-13 10:25:00', '2026-04-13 10:25:00'),
(40, 16, 3, 7, 1, 14, 300.00, 1, 0, '2026-04-13 10:25:00', '2026-04-13 10:25:00');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_report`
--

CREATE TABLE `tbl_report` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `report_reason` enum('spam','fraud','abuse','other') DEFAULT NULL,
  `report_description` varchar(128) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `is_delete` tinyint(1) DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_report_images`
--

CREATE TABLE `tbl_report_images` (
  `id` bigint(20) NOT NULL,
  `report_id` bigint(20) DEFAULT NULL,
  `image_url` varchar(256) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `is_delete` tinyint(1) DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_size`
--

CREATE TABLE `tbl_size` (
  `id` bigint(20) NOT NULL,
  `name` varchar(64) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `is_delete` tinyint(1) DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_size`
--

INSERT INTO `tbl_size` (`id`, `name`, `is_active`, `is_delete`, `created_at`, `updated_at`) VALUES
(1, 'XS', 1, 0, '2026-04-13 10:00:00', '2026-04-13 10:00:00'),
(2, 'S', 1, 0, '2026-04-13 10:00:00', '2026-04-13 10:00:00'),
(3, 'M', 1, 0, '2026-04-13 10:00:00', '2026-04-13 10:00:00'),
(4, 'L', 1, 0, '2026-04-13 10:00:00', '2026-04-13 10:00:00'),
(5, 'XL', 1, 0, '2026-04-13 10:00:00', '2026-04-13 10:00:00'),
(6, '52', 1, 0, '2026-04-13 10:00:00', '2026-04-13 10:00:00'),
(7, '54', 1, 0, '2026-04-13 10:00:00', '2026-04-13 10:00:00'),
(8, '56', 1, 0, '2026-04-13 10:00:00', '2026-04-13 10:00:00'),
(9, '58', 1, 0, '2026-04-13 10:00:00', '2026-04-13 10:00:00'),
(10, '60', 1, 0, '2026-04-13 10:00:00', '2026-04-13 10:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_store`
--

CREATE TABLE `tbl_store` (
  `id` bigint(20) NOT NULL,
  `name` varchar(64) DEFAULT NULL,
  `description` varchar(128) DEFAULT NULL,
  `image_url` varchar(256) DEFAULT NULL,
  `latitude` varchar(32) DEFAULT NULL,
  `longitude` varchar(32) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `is_delete` tinyint(1) DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_store`
--

INSERT INTO `tbl_store` (`id`, `name`, `description`, `image_url`, `latitude`, `longitude`, `is_active`, `is_delete`, `created_at`, `updated_at`) VALUES
(1, 'Urban Furniture', 'Modern home furniture store', 'uploads/store1.jpg', '19.07609000000000', '72.87770000000000', 1, 0, '2026-04-10 17:55:31', '2026-04-10 17:55:31'),
(2, 'Classic Wood', 'Premium wooden furniture', 'uploads/store2.jpg', '19.21833000000000', '72.97808900000000', 1, 0, '2026-04-10 17:55:31', '2026-04-10 17:55:31'),
(3, 'Home Comforts', 'Affordable home essentials', 'uploads/store3.jpg', '19.03300000000000', '72.85670000000000', 1, 0, '2026-04-10 17:55:31', '2026-04-10 17:55:31'),
(4, 'Nora Fashion House', 'Premium abaya and modest wear collection', 'uploads/store4.jpg', '23.0225', '72.5714', 1, 0, '2026-04-13 11:08:05', '2026-04-13 11:08:05'),
(5, 'Skyline Modest', 'Modern kaftans, jilabiyas, and daily essentials', 'uploads/store5.jpg', '25.2048', '55.2708', 1, 0, '2026-04-13 11:08:05', '2026-04-13 11:08:05'),
(6, 'Rose Boutique', 'Designer women wear with quality fabric', 'uploads/store6.jpg', '24.7136', '46.6753', 1, 0, '2026-04-13 11:08:05', '2026-04-13 11:08:05'),
(7, 'Urban Threads', 'Casual and formal outfits for men and women', 'uploads/store7.jpg', '21.1702', '72.8311', 1, 0, '2026-04-13 11:08:05', '2026-04-13 11:08:05'),
(8, 'Little Trends', 'Kids fashion and seasonal clothing', 'uploads/store8.jpg', '19.0760', '72.8777', 1, 0, '2026-04-13 11:08:05', '2026-04-13 11:08:05');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_store_offer`
--

CREATE TABLE `tbl_store_offer` (
  `id` bigint(20) NOT NULL,
  `store_id` bigint(20) DEFAULT NULL,
  `image_url` varchar(256) DEFAULT NULL,
  `offer_type` enum('flat','percentage') DEFAULT NULL,
  `offer_value` decimal(10,2) DEFAULT NULL,
  `start_date` datetime DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `is_delete` tinyint(1) DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_store_rating`
--

CREATE TABLE `tbl_store_rating` (
  `id` bigint(20) NOT NULL,
  `store_id` bigint(20) DEFAULT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `rating` int(11) DEFAULT NULL,
  `review` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `is_delete` tinyint(1) DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_store_rating`
--

INSERT INTO `tbl_store_rating` (`id`, `store_id`, `user_id`, `rating`, `review`, `is_active`, `is_delete`, `created_at`, `updated_at`) VALUES
(2, 1, 14, 4, 'Good but slightly expensive', 1, 0, '2026-04-10 17:55:44', '2026-04-10 17:55:44'),
(4, 3, 14, 3, 'Average products', 1, 0, '2026-04-10 17:55:44', '2026-04-10 17:55:44'),
(6, 4, 14, 4, 'Good collection and delivery', 1, 0, '2026-04-13 11:08:14', '2026-04-13 11:08:14'),
(8, 6, 14, 5, 'Premium feel and elegant styles', 1, 0, '2026-04-13 11:08:14', '2026-04-13 11:08:14'),
(9, 7, 16, 4, 'Good price range for daily wear', 1, 0, '2026-04-13 11:08:14', '2026-04-13 11:08:14');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_type`
--

CREATE TABLE `tbl_type` (
  `id` bigint(20) NOT NULL,
  `name` varchar(64) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `is_delete` tinyint(1) DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_type`
--

INSERT INTO `tbl_type` (`id`, `name`, `is_active`, `is_delete`, `created_at`, `updated_at`) VALUES
(1, 'Regular', 1, 0, '2026-04-13 10:00:00', '2026-04-13 10:00:00'),
(2, 'Premium', 1, 0, '2026-04-13 10:00:00', '2026-04-13 10:00:00'),
(3, 'Casual', 1, 0, '2026-04-13 10:00:00', '2026-04-13 10:00:00'),
(4, 'Formal', 1, 0, '2026-04-13 10:00:00', '2026-04-13 10:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_user`
--

CREATE TABLE `tbl_user` (
  `id` bigint(20) NOT NULL,
  `name` varchar(64) DEFAULT NULL,
  `email` varchar(256) DEFAULT NULL,
  `password` varchar(256) DEFAULT NULL,
  `country_code` varchar(8) DEFAULT NULL,
  `mobile_number` varchar(16) DEFAULT NULL,
  `profile_image` varchar(256) DEFAULT NULL,
  `login_type` enum('G','A','F','S') DEFAULT NULL,
  `social_id` varchar(256) DEFAULT NULL,
  `language` enum('eng','hin','guj','chi') DEFAULT NULL,
  `is_verified` tinyint(1) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `is_delete` tinyint(1) DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_user`
--

INSERT INTO `tbl_user` (`id`, `name`, `email`, `password`, `country_code`, `mobile_number`, `profile_image`, `login_type`, `social_id`, `language`, `is_verified`, `is_active`, `is_delete`, `created_at`, `updated_at`) VALUES
(14, 'sahil', 'sahilmansursi56@gmail.com', '1006f0ae5a7ece19828a67ac62288e05', '+91', '95104479545', NULL, 'S', NULL, NULL, 1, 1, 0, '2026-04-10 09:53:01', '2026-04-10 09:53:01'),
(16, 'sahilmansuri123', 'sahilmansuri881.@gmail.com', 'b14edeb5554474240d4e6497b973f2fa', '+91', '9510447055', NULL, 'S', NULL, 'hin', 1, 1, 0, '0000-00-00 00:00:00', '2026-04-14 11:27:27'),
(17, 'sahil', 'sahilmansursi88313@gmail.com', NULL, '+91', '9510447942', NULL, 'G', 'sahil@1233', NULL, 1, 1, 0, '2026-04-14 13:36:31', '2026-04-14 13:36:31'),
(18, 'sahil', 'sahilmansursi818313@gmail.com', NULL, '+91', '9510447042', NULL, 'G', 'sahil@123355', NULL, 1, 1, 0, '2026-04-14 13:38:10', '2026-04-14 13:38:10'),
(19, 'sahil', 'sahhhhhhhilhahahahahahlllsddddddddddasa@gmail.com', '1006f0ae5a7ece19828a67ac62288e05', '+91', '8817728171123', NULL, 'S', NULL, NULL, 1, 1, 0, '2026-04-15 14:50:09', '2026-04-15 14:50:09'),
(22, 'sahil', 'sahilmansursi8hsh18313@gmail.com', '1006f0ae5a7ece19828a67ac62288e05', '+91', '123456770', NULL, 'S', NULL, NULL, 1, 1, 0, '2026-04-15 16:00:13', '2026-04-15 16:00:13'),
(23, 'sahil', 'sahilmansursi8hswh18313@gmail.com', '1006f0ae5a7ece19828a67ac62288e05', '+91', '123456771', NULL, 'S', NULL, NULL, 1, 1, 0, '2026-04-15 17:38:15', '2026-04-15 17:38:15'),
(24, 'sahil', 'sahilmansursi8hswh18313w@gmail.com', '1006f0ae5a7ece19828a67ac62288e05', '+91', '123456772', NULL, 'S', NULL, NULL, 1, 1, 0, '2026-04-15 17:40:32', '2026-04-15 17:40:32'),
(25, 'sahil', 'sahilmansursi8hswhs18313w@gmail.com', '1006f0ae5a7ece19828a67ac62288e05', '+91', '123456773', NULL, 'S', NULL, NULL, 1, 1, 0, '2026-04-15 17:41:37', '2026-04-15 17:41:37'),
(26, 'sahil', 'sahilmansursid8hswhs18313w@gmail.com', '1006f0ae5a7ece19828a67ac62288e05', '+91', '123456774', NULL, 'S', NULL, NULL, 1, 1, 0, '2026-04-15 17:54:47', '2026-04-15 17:54:47'),
(27, 'sahil', 'sahilmansursids18313w@gmail.com', '1006f0ae5a7ece19828a67ac62288e05', '+91', '123456775', NULL, 'S', NULL, NULL, 1, 1, 0, '2026-04-15 17:59:12', '2026-04-15 17:59:12'),
(28, 'sahil', 'sahilmansurs18313w@gmail.com', '1006f0ae5a7ece19828a67ac62288e05', '+91', '123456776', NULL, 'S', NULL, NULL, 1, 1, 0, '2026-04-15 18:01:38', '2026-04-15 18:01:38'),
(29, 'sahil', 'sahilmansurs18313w@gmail.com', '1006f0ae5a7ece19828a67ac62288e05', '+91', '123456776', NULL, 'S', NULL, NULL, 1, 1, 0, '2026-04-15 18:05:11', '2026-04-15 18:05:11'),
(30, 'sahil', 'sahilmansurs18313w@gmail.com', '1006f0ae5a7ece19828a67ac62288e05', '+91', '123456776', NULL, 'S', NULL, NULL, 1, 1, 0, '2026-04-15 18:09:34', '2026-04-15 18:09:34'),
(31, 'sahil', 'sahilmansurs18313w@gmail.com', '1006f0ae5a7ece19828a67ac62288e05', '+91', '123456776', NULL, 'S', NULL, NULL, 1, 1, 0, '2026-04-15 18:10:24', '2026-04-15 18:10:24'),
(32, 'sahil', 'sahilmansurs18313w@gmail.com', '1006f0ae5a7ece19828a67ac62288e05', '+91', '123456776', NULL, 'S', NULL, NULL, 1, 1, 0, '2026-04-15 18:14:35', '2026-04-15 18:14:35'),
(33, 'sahil', 'sahilmansurs18313ew@gmail.com', '1006f0ae5a7ece19828a67ac62288e05', '+91', '123456779', NULL, 'S', NULL, NULL, 1, 1, 0, '2026-04-15 19:08:25', '2026-04-15 19:08:25'),
(34, 'sahil', 'sahilmansurs1@gmail.com', '1006f0ae5a7ece19828a67ac62288e05', '+91', '123456780', NULL, 'S', NULL, NULL, 1, 1, 0, '2026-04-15 19:19:10', '2026-04-15 19:19:10'),
(35, 'sahil', 'sahilmansurs12@gmail.com', '1006f0ae5a7ece19828a67ac62288e05', '+91', '123456781', NULL, 'S', NULL, NULL, 1, 1, 0, '2026-04-15 19:19:53', '2026-04-15 19:19:53'),
(36, 'sahil', 'sahilmansurs123@gmail.com', '1006f0ae5a7ece19828a67ac62288e05', '+91', '123456786', NULL, 'S', NULL, NULL, 1, 1, 0, '2026-04-16 10:30:43', '2026-04-16 10:30:43'),
(37, 'sahil', 'sahilmansurs1234@gmail.com', '1006f0ae5a7ece19828a67ac62288e05', '+91', '123456776', NULL, 'S', NULL, NULL, 1, 1, 0, '2026-04-16 12:00:34', '2026-04-16 12:00:34'),
(38, 'sahil', 'sahilmansursi1234@gmail.com', '1006f0ae5a7ece19828a67ac62288e05', '+91', '123456776', NULL, 'S', NULL, NULL, 1, 1, 0, '2026-04-16 13:28:37', '2026-04-16 13:28:37'),
(39, 'sahil', 'sahilmansursi1234@gmail.com', '1006f0ae5a7ece19828a67ac62288e05', '+91', '123456776', NULL, 'S', NULL, NULL, 1, 1, 0, '2026-04-16 13:28:51', '2026-04-16 13:28:51'),
(40, 'sahil', 'sahilmansursi1234@gmail.com', '1006f0ae5a7ece19828a67ac62288e05', '+91', '123456776', NULL, 'S', NULL, NULL, 1, 1, 0, '2026-04-16 13:28:58', '2026-04-16 13:28:58'),
(41, 'sahil', 'sahilmansursi1234@gmail.com', '1006f0ae5a7ece19828a67ac62288e05', '+91', '123456776', NULL, 'S', NULL, NULL, 1, 1, 0, '2026-04-16 13:29:23', '2026-04-16 13:29:23'),
(42, 'sahil', 'sahilmansursi1234@gmail.com', '1006f0ae5a7ece19828a67ac62288e05', '+91', '123456776', NULL, 'S', NULL, NULL, 1, 1, 0, '2026-04-16 13:29:49', '2026-04-16 13:29:49'),
(43, 'sahil', 'sahilmansursi1234@gmail.com', '1006f0ae5a7ece19828a67ac62288e05', '+91', '123456776', NULL, 'S', NULL, NULL, 1, 1, 0, '2026-04-16 16:06:06', '2026-04-16 16:06:06'),
(44, 'sahil', 'sahilmansursi1234@gmail.com', '1006f0ae5a7ece19828a67ac62288e05', '+91', '123456776', NULL, 'S', NULL, NULL, 1, 1, 0, '2026-04-16 16:06:48', '2026-04-16 16:06:48'),
(45, 'sahil', 'sahilmansursi1234@gmail.com', '1006f0ae5a7ece19828a67ac62288e05', '+91', '123456777', NULL, 'S', NULL, NULL, 1, 1, 0, '2026-04-16 16:07:11', '2026-04-16 16:07:11');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_user_address`
--

CREATE TABLE `tbl_user_address` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `name` varchar(64) DEFAULT NULL,
  `company_name` varchar(64) DEFAULT NULL,
  `address_line_1` varchar(128) DEFAULT NULL,
  `address_line_2` varchar(128) DEFAULT NULL,
  `latitude` varchar(32) DEFAULT NULL,
  `longitude` varchar(32) DEFAULT NULL,
  `city` varchar(64) DEFAULT NULL,
  `state` varchar(64) DEFAULT NULL,
  `country` varchar(64) DEFAULT NULL,
  `postal_code` varchar(16) DEFAULT NULL,
  `is_default` tinyint(1) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `is_delete` tinyint(1) DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_user_address`
--

INSERT INTO `tbl_user_address` (`id`, `user_id`, `name`, `company_name`, `address_line_1`, `address_line_2`, `latitude`, `longitude`, `city`, `state`, `country`, `postal_code`, `is_default`, `is_active`, `is_delete`, `created_at`, `updated_at`) VALUES
(3, 16, 'Sahil Mansuri', 'Wafra Bazaar', '12 Palm Street', 'Near City Mall', '23.0226', '72.5718', 'Ahmedabad', 'Gujarat', 'India', '380001', 0, 1, 0, '2026-04-14 11:43:22', '2026-04-15 11:50:59'),
(4, 16, 'Sahil Patel', 'Wafra Bazaar', '44 Lake View Road', 'Opposite Metro Station', '22.3072', '73.1812', 'Vadodara', 'Gujarat', 'India', '390001', 0, 1, 0, '2026-04-14 11:43:22', '2026-04-14 11:43:22'),
(5, 16, 'Sahil Mansuri', 'Wafra Bazaar', 'Flat 302, Palm Residency', 'Near City Mall', '23.0225', '72.5714', 'Ahmedabad', 'Gujarat', 'India', '380015', 0, 0, 1, '2026-04-14 11:43:22', '2026-04-14 11:55:50'),
(6, 18, 'Ahmed Al-Mansoori', 'Wafra Trading LLC', 'Building 12, Street 8', 'Floor 3, Office 305', '25.2048', '55.2708', 'Dubai', 'Dubai', 'United Arab Emirates', '00000', 0, 1, 0, '2026-04-15 13:52:42', '2026-04-15 13:53:59'),
(8, 18, 'Ahmed Al-Mansoori', 'Wafra Trading LLC', 'Building 12, Street 8', 'Floor 3, Office 305', '25.2048', '55.2708', 'Dubai', 'Dubai', 'United Arab Emirates', '00000', 0, 1, 0, '2026-04-15 13:54:36', '2026-04-15 14:06:23'),
(9, 18, 'Ahmed Al-Mansoori', 'Wafra Trading LLC', 'Building 12, Street 8', 'Floor 3, Office 305', '25.2048', '55.2708', 'Dubai', 'Dubai', 'United Arab Emirates', '00000', 0, 1, 0, '2026-04-15 14:06:23', '2026-04-15 14:06:30'),
(10, 18, 'Ahmed Al-Mansoori', 'Wafra Trading LLC', 'Building 12, Street 8', 'Floor 3, Office 305', '25.2048', '55.27081', 'Dubai', 'Dubai', 'United Arab Emirates', '00000', 1, 1, 0, '2026-04-15 14:06:30', '2026-04-15 14:06:30');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_user_device`
--

CREATE TABLE `tbl_user_device` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `token` text DEFAULT NULL,
  `device_token` text DEFAULT NULL,
  `device_type` enum('A','W','I') DEFAULT NULL,
  `device_name` varchar(64) DEFAULT NULL,
  `device_model` varchar(64) DEFAULT NULL,
  `os_version` varchar(64) DEFAULT NULL,
  `uuid` varchar(64) DEFAULT NULL,
  `ip` varchar(64) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `is_delete` tinyint(1) DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_user_device`
--

INSERT INTO `tbl_user_device` (`id`, `user_id`, `token`, `device_token`, `device_type`, `device_name`, `device_model`, `os_version`, `uuid`, `ip`, `is_active`, `is_delete`, `created_at`, `updated_at`) VALUES
(1, 14, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNCwiaWQiOjE0LCJuYW1lIjoic2FoaWwiLCJlbWFpbCI6InNhaGlsbWFuc3Vyc2k1NkBnbWFpbC5jb20iLCJtb2JpbGVfbnVtYmVyIjoiOTUxMDQ0Nzk1NDUiLCJjb3VudHJ5X2NvZGUiOiIrOTEiLCJsb2dpbl90eXBlIjoiUyIsInNvY2lhbF9pZCI6bnVsbCwiaXNfdmVyaWZpZWQiOjEsInJvbGUiOm51bGwsImlhdCI6MTc3NTgxNDc4MSwiZXhwIjoxODA3MzUwNzgxfQ.oRnaA3nx6hL0VXaB5KygaIPWaQHPVYo3e7YlvWeu_tI', 'fcm_or_apns_token_here', 'A', 'Samsung S23', 'SM-S911B', 'Android 14', '2f6c1c7a-9b8d-4c7e-a44f-1e2c3d4e5f67', '192.168.1.10', 1, 0, '2026-04-10 15:23:01', '2026-04-10 15:24:11'),
(2, 16, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTYsIm5hbWUiOiJzYWhpbCIsImVtYWlsIjoic2FoaGhoaGhoaWxAZ21haWwuY29tIiwibW9iaWxlX251bWJlciI6Ijg4MTc3MjgxNzEiLCJjb3VudHJ5X2NvZGUiOiIrOTEiLCJsb2dpbl90eXBlIjoiUyIsInNvY2lhbF9pZCI6bnVsbCwiaXNfdmVyaWZpZWQiOjEsInJvbGUiOm51bGwsImlhdCI6MTc3NjA2ODIyNiwiZXhwIjoxODA3NjA0MjI2fQ.9n8LdbdKzryA8tWR9C0_snJkrUx09so84JLpyjC71D0', 'fcm_or_apns_token_here', 'A', 'Samsung S23', 'SM-S911B', 'Android 14', '2f6c1c7a-9b8d-4c7e-a44f-1e2c3d4e5f67', '192.168.1.10', 1, 0, '2026-04-12 13:18:11', '2026-04-13 13:47:06'),
(3, 18, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTgsIm5hbWUiOiJzYWhpbCIsImVtYWlsIjoic2FoaWxtYW5zdXJzaTgxODMxM0BnbWFpbC5jb20iLCJtb2JpbGVfbnVtYmVyIjoiOTUxMDQ0NzA0MiIsImNvdW50cnlfY29kZSI6Iis5MSIsImxvZ2luX3R5cGUiOiJHIiwic29jaWFsX2lkIjoic2FoaWxAMTIzMzU1IiwiaXNfdmVyaWZpZWQiOjEsInJvbGUiOm51bGwsImlhdCI6MTc3NjE1NDA5MCwiZXhwIjoxODA3NjkwMDkwfQ.FXDu60rwOITfTm5UcegSk6h2raPg5KR-KbUm2L_wAr4', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 0, '2026-04-14 13:38:10', '2026-04-14 13:38:10'),
(5, 22, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjIsIm5hbWUiOiJzYWhpbCIsImVtYWlsIjoic2FoaWxtYW5zdXJzaThoc2gxODMxM0BnbWFpbC5jb20iLCJtb2JpbGVfbnVtYmVyIjoiMTIzNDU2NzcwIiwiY291bnRyeV9jb2RlIjoiKzkxIiwibG9naW5fdHlwZSI6IlMiLCJzb2NpYWxfaWQiOm51bGwsImlzX3ZlcmlmaWVkIjoxLCJyb2xlIjpudWxsLCJpYXQiOjE3NzYyNDkwMTMsImV4cCI6MTgwNzc4NTAxM30.knaij6r4OeSZIq7_DfRSxF3gI4l4fLag7laLhNUWtgI', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 0, '2026-04-15 16:00:13', '2026-04-15 16:00:13'),
(6, 23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsIm5hbWUiOiJzYWhpbCIsImVtYWlsIjoic2FoaWxtYW5zdXJzaThoc3doMTgzMTNAZ21haWwuY29tIiwibW9iaWxlX251bWJlciI6IjEyMzQ1Njc3MSIsImNvdW50cnlfY29kZSI6Iis5MSIsImxvZ2luX3R5cGUiOiJTIiwic29jaWFsX2lkIjpudWxsLCJpc192ZXJpZmllZCI6MSwicm9sZSI6bnVsbCwiaWF0IjoxNzc2MjU0ODk1LCJleHAiOjE4MDc3OTA4OTV9.GgpoWLXwSFtTcRFRR3QBqQ4VFkzhrAK7s1H4vxUKQZc', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 0, '2026-04-15 17:38:15', '2026-04-15 17:38:15'),
(7, 24, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjQsIm5hbWUiOiJzYWhpbCIsImVtYWlsIjoic2FoaWxtYW5zdXJzaThoc3doMTgzMTN3QGdtYWlsLmNvbSIsIm1vYmlsZV9udW1iZXIiOiIxMjM0NTY3NzIiLCJjb3VudHJ5X2NvZGUiOiIrOTEiLCJsb2dpbl90eXBlIjoiUyIsInNvY2lhbF9pZCI6bnVsbCwiaXNfdmVyaWZpZWQiOjEsInJvbGUiOm51bGwsImlhdCI6MTc3NjI1NTAzMiwiZXhwIjoxODA3NzkxMDMyfQ.nFpceXbChuY0tCP-vtRWHH0L8kBrUTm1qcZ3R6UI8XE', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 0, '2026-04-15 17:40:32', '2026-04-15 17:40:32'),
(8, 25, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjUsIm5hbWUiOiJzYWhpbCIsImVtYWlsIjoic2FoaWxtYW5zdXJzaThoc3doczE4MzEzd0BnbWFpbC5jb20iLCJtb2JpbGVfbnVtYmVyIjoiMTIzNDU2NzczIiwiY291bnRyeV9jb2RlIjoiKzkxIiwibG9naW5fdHlwZSI6IlMiLCJzb2NpYWxfaWQiOm51bGwsImlzX3ZlcmlmaWVkIjoxLCJyb2xlIjpudWxsLCJpYXQiOjE3NzYyNTUwOTcsImV4cCI6MTgwNzc5MTA5N30.SI4wxqxv6leQo-RjmG_rOq0F8JGpgVdQK3JMEbVpHDU', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 0, '2026-04-15 17:41:37', '2026-04-15 17:41:37'),
(9, 26, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjYsIm5hbWUiOiJzYWhpbCIsImVtYWlsIjoic2FoaWxtYW5zdXJzaWQ4aHN3aHMxODMxM3dAZ21haWwuY29tIiwibW9iaWxlX251bWJlciI6IjEyMzQ1Njc3NCIsImNvdW50cnlfY29kZSI6Iis5MSIsImxvZ2luX3R5cGUiOiJTIiwic29jaWFsX2lkIjpudWxsLCJpc192ZXJpZmllZCI6MSwiaWF0IjoxNzc2MjU1ODg3LCJleHAiOjE4MDc3OTE4ODd9.ehfVj0x_33jc7ZgiN7EgTFwcw99rkJRZBUjaHp5VdtA', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 0, '2026-04-15 17:54:47', '2026-04-15 17:54:47'),
(10, 27, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjcsIm5hbWUiOiJzYWhpbCIsImVtYWlsIjoic2FoaWxtYW5zdXJzaWRzMTgzMTN3QGdtYWlsLmNvbSIsIm1vYmlsZV9udW1iZXIiOiIxMjM0NTY3NzUiLCJjb3VudHJ5X2NvZGUiOiIrOTEiLCJsb2dpbl90eXBlIjoiUyIsInNvY2lhbF9pZCI6bnVsbCwiaXNfdmVyaWZpZWQiOjEsImlhdCI6MTc3NjI1NjE1MiwiZXhwIjoxODA3NzkyMTUyfQ.hpkBuT-SUMPRoVQERGQme9tRziHezhTWWup9ALVgjXI', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 0, '2026-04-15 17:59:12', '2026-04-15 17:59:12'),
(11, 28, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjgsIm5hbWUiOiJzYWhpbCIsImVtYWlsIjoic2FoaWxtYW5zdXJzMTgzMTN3QGdtYWlsLmNvbSIsIm1vYmlsZV9udW1iZXIiOiIxMjM0NTY3NzYiLCJjb3VudHJ5X2NvZGUiOiIrOTEiLCJsb2dpbl90eXBlIjoiUyIsInNvY2lhbF9pZCI6bnVsbCwiaXNfdmVyaWZpZWQiOjEsImlhdCI6MTc3NjI1NjI5OCwiZXhwIjoxODA3NzkyMjk4fQ.OkSzV0GY8BarggxPmOY_AbTwoQN9MCZ9tG0ggsKMiTE', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 0, '2026-04-15 18:01:38', '2026-04-15 18:01:38'),
(12, 29, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjksIm5hbWUiOiJzYWhpbCIsImVtYWlsIjoic2FoaWxtYW5zdXJzMTgzMTN3QGdtYWlsLmNvbSIsIm1vYmlsZV9udW1iZXIiOiIxMjM0NTY3NzYiLCJjb3VudHJ5X2NvZGUiOiIrOTEiLCJsb2dpbl90eXBlIjoiUyIsInNvY2lhbF9pZCI6bnVsbCwiaXNfdmVyaWZpZWQiOjEsImlhdCI6MTc3NjI1NjUxMSwiZXhwIjoxODA3NzkyNTExfQ.9OQL3mVyUIdnmkFBP8_hApwPLWCjVSMIlMVOnSEkWio', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 0, '2026-04-15 18:05:11', '2026-04-15 18:05:11'),
(13, 30, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzAsIm5hbWUiOiJzYWhpbCIsImVtYWlsIjoic2FoaWxtYW5zdXJzMTgzMTN3QGdtYWlsLmNvbSIsIm1vYmlsZV9udW1iZXIiOiIxMjM0NTY3NzYiLCJjb3VudHJ5X2NvZGUiOiIrOTEiLCJsb2dpbl90eXBlIjoiUyIsInNvY2lhbF9pZCI6bnVsbCwiaXNfdmVyaWZpZWQiOjEsImlhdCI6MTc3NjI1Njc3NCwiZXhwIjoxODA3NzkyNzc0fQ.wAY7vYYit14Di1O6ek6MVohP4-IuoQRKzPyVMxpDCv8', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 0, '2026-04-15 18:09:34', '2026-04-15 18:09:34'),
(14, 31, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzEsIm5hbWUiOiJzYWhpbCIsImVtYWlsIjoic2FoaWxtYW5zdXJzMTgzMTN3QGdtYWlsLmNvbSIsIm1vYmlsZV9udW1iZXIiOiIxMjM0NTY3NzYiLCJjb3VudHJ5X2NvZGUiOiIrOTEiLCJsb2dpbl90eXBlIjoiUyIsInNvY2lhbF9pZCI6bnVsbCwiaXNfdmVyaWZpZWQiOjEsImlhdCI6MTc3NjI1NjgyNCwiZXhwIjoxODA3NzkyODI0fQ.KbNK5AxNndEpfkwg1I4AIdAR8CANxxg_FGGM_yuFwSc', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 0, '2026-04-15 18:10:24', '2026-04-15 18:10:24'),
(15, 35, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzUsIm5hbWUiOiJzYWhpbCIsImVtYWlsIjoic2FoaWxtYW5zdXJzMTJAZ21haWwuY29tIiwibW9iaWxlX251bWJlciI6IjEyMzQ1Njc4MSIsImNvdW50cnlfY29kZSI6Iis5MSIsImxvZ2luX3R5cGUiOiJTIiwic29jaWFsX2lkIjpudWxsLCJpc192ZXJpZmllZCI6MSwiaWF0IjoxNzc2MjYwOTkzLCJleHAiOjE4MDc3OTY5OTN9.nwqHB6f_RCc2UkKPpxDhT2EDaEVMfAUHEaKjdI7n0yk', 'fcm_or_apns_token_here', 'A', 'Samsung S23', 'SM-S911B', 'Android 14', '2f6c1c7a-9b8d-4c7e-a44f-1e2c3d4e5f67', '192.168.1.10', 1, 0, '2026-04-15 19:19:53', '2026-04-15 19:19:53'),
(16, 36, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzYsIm5hbWUiOiJzYWhpbCIsImVtYWlsIjoic2FoaWxtYW5zdXJzMTIzQGdtYWlsLmNvbSIsIm1vYmlsZV9udW1iZXIiOiIxMjM0NTY3ODYiLCJjb3VudHJ5X2NvZGUiOiIrOTEiLCJsb2dpbl90eXBlIjoiUyIsInNvY2lhbF9pZCI6bnVsbCwiaXNfdmVyaWZpZWQiOjEsImlhdCI6MTc3NjMxNTY0MywiZXhwIjoxODA3ODUxNjQzfQ.8K7_gjaf8GzsdOCCaTN6NL94KVaj3Jpj6teoqsdSWOo', 'fcm_or_apns_token_here', 'A', 'Samsung S23', 'SM-S911B', 'Android 14', '2f6c1c7a-9b8d-4c7e-a44f-1e2c3d4e5f67', '192.168.1.10', 1, 0, '2026-04-16 10:30:43', '2026-04-16 10:30:43'),
(17, 37, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzcsIm5hbWUiOiJzYWhpbCIsImVtYWlsIjoic2FoaWxtYW5zdXJzMTIzNEBnbWFpbC5jb20iLCJtb2JpbGVfbnVtYmVyIjoiMTIzNDU2Nzc2IiwiY291bnRyeV9jb2RlIjoiKzkxIiwibG9naW5fdHlwZSI6IlMiLCJzb2NpYWxfaWQiOm51bGwsImlzX3ZlcmlmaWVkIjoxLCJpYXQiOjE3NzYzMjEwMzQsImV4cCI6MTgwNzg1NzAzNH0.H-ZTI6hVL2DsGkwxOwpDnVbaQV3hyA8e0x9UsCV3X1s', 'fcm_or_apns_token_here', 'A', 'Samsung S23', 'SM-S911B', 'Android 14', '2f6c1c7a-9b8d-4c7e-a44f-1e2c3d4e5f67', '192.168.1.10', 1, 0, '2026-04-16 12:00:34', '2026-04-16 12:00:34'),
(18, 42, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDIsIm5hbWUiOiJzYWhpbCIsImVtYWlsIjoic2FoaWxtYW5zdXJzaTEyMzRAZ21haWwuY29tIiwibW9iaWxlX251bWJlciI6IjEyMzQ1Njc3NiIsImNvdW50cnlfY29kZSI6Iis5MSIsImxvZ2luX3R5cGUiOiJTIiwic29jaWFsX2lkIjpudWxsLCJpc192ZXJpZmllZCI6MSwiaWF0IjoxNzc2MzI2Mzg5LCJleHAiOjE4MDc4NjIzODl9.6fjaoq9gfPTdBXbUZU2NOPyTGnzTJV-4CvuUll51Qb4', 'fcm_or_apns_token_here', 'A', 'Samsung S23', 'SM-S911B', 'Android 14', '2f6c1c7a-9b8d-4c7e-a44f-1e2c3d4e5f67', '192.168.1.10', 1, 0, '2026-04-16 13:29:49', '2026-04-16 13:29:49'),
(19, 43, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDMsIm5hbWUiOiJzYWhpbCIsImVtYWlsIjoic2FoaWxtYW5zdXJzaTEyMzRAZ21haWwuY29tIiwibW9iaWxlX251bWJlciI6IjEyMzQ1Njc3NiIsImNvdW50cnlfY29kZSI6Iis5MSIsImxvZ2luX3R5cGUiOiJTIiwic29jaWFsX2lkIjpudWxsLCJpc192ZXJpZmllZCI6MSwiaWF0IjoxNzc2MzM1NzY2LCJleHAiOjE4MDc4NzE3NjZ9.iiyN5w3t-tHl72oyT8zBPDRijzwcFMKi6_0Vey0FHmk', 'fcm_or_apns_token_here', 'A', 'Samsung S23', 'SM-S911B', 'Android 14', '2f6c1c7a-9b8d-4c7e-a44f-1e2c3d4e5f67', '192.168.1.10', 1, 0, '2026-04-16 16:06:06', '2026-04-16 16:06:06'),
(20, 44, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDQsIm5hbWUiOiJzYWhpbCIsImVtYWlsIjoic2FoaWxtYW5zdXJzaTEyMzRAZ21haWwuY29tIiwibW9iaWxlX251bWJlciI6IjEyMzQ1Njc3NiIsImNvdW50cnlfY29kZSI6Iis5MSIsImxvZ2luX3R5cGUiOiJTIiwic29jaWFsX2lkIjpudWxsLCJpc192ZXJpZmllZCI6MSwiaWF0IjoxNzc2MzM1ODA4LCJleHAiOjE4MDc4NzE4MDh9.JdUpisTeUwOzSLSA4sZ9Mcj974fiuiARp0mfNvWm8wk', 'fcm_or_apns_token_here', 'A', 'Samsung S23', 'SM-S911B', 'Android 14', '2f6c1c7a-9b8d-4c7e-a44f-1e2c3d4e5f67', '192.168.1.10', 1, 0, '2026-04-16 16:06:48', '2026-04-16 16:06:48'),
(21, 45, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDUsIm5hbWUiOiJzYWhpbCIsImVtYWlsIjoic2FoaWxtYW5zdXJzaTEyMzRAZ21haWwuY29tIiwibW9iaWxlX251bWJlciI6IjEyMzQ1Njc3NyIsImNvdW50cnlfY29kZSI6Iis5MSIsImxvZ2luX3R5cGUiOiJTIiwic29jaWFsX2lkIjpudWxsLCJpc192ZXJpZmllZCI6MSwiaWF0IjoxNzc2MzM1ODMxLCJleHAiOjE4MDc4NzE4MzF9.WHQR-2qS8zCc5IunCwgToloJ82JCAbtH19eoE4i-emk', 'fcm_or_apns_token_here', 'A', 'Samsung S23', 'SM-S911B', 'Android 14', '2f6c1c7a-9b8d-4c7e-a44f-1e2c3d4e5f67', '192.168.1.10', 1, 0, '2026-04-16 16:07:11', '2026-04-16 16:07:11');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tbl_cart`
--
ALTER TABLE `tbl_cart`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `variant_id` (`variant_id`);

--
-- Indexes for table `tbl_category`
--
ALTER TABLE `tbl_category`
  ADD PRIMARY KEY (`id`),
  ADD KEY `parent_category_id` (`parent_category_id`);

--
-- Indexes for table `tbl_cms`
--
ALTER TABLE `tbl_cms`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tag_name` (`tag_name`);

--
-- Indexes for table `tbl_color`
--
ALTER TABLE `tbl_color`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_contact_us`
--
ALTER TABLE `tbl_contact_us`
  ADD PRIMARY KEY (`id`),
  ADD KEY `email` (`email`);

--
-- Indexes for table `tbl_faq`
--
ALTER TABLE `tbl_faq`
  ADD PRIMARY KEY (`id`),
  ADD KEY `question` (`question`);

--
-- Indexes for table `tbl_measurement`
--
ALTER TABLE `tbl_measurement`
  ADD PRIMARY KEY (`id`),
  ADD KEY `name` (`name`);

--
-- Indexes for table `tbl_notification`
--
ALTER TABLE `tbl_notification`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_reciverUser` (`receiver_id`),
  ADD KEY `title` (`title`);

--
-- Indexes for table `tbl_orders`
--
ALTER TABLE `tbl_orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `payment_id` (`payment_id`),
  ADD KEY `order_code` (`order_code`,`order_date`,`latitude`,`longitude`,`location`);

--
-- Indexes for table `tbl_order_items`
--
ALTER TABLE `tbl_order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `variant_id` (`variant_id`);

--
-- Indexes for table `tbl_otp`
--
ALTER TABLE `tbl_otp`
  ADD PRIMARY KEY (`id`),
  ADD KEY `country_code` (`country_code`),
  ADD KEY `mobile_number` (`mobile_number`),
  ADD KEY `email` (`email`),
  ADD KEY `otp` (`otp`);

--
-- Indexes for table `tbl_payment`
--
ALTER TABLE `tbl_payment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `upi_id` (`upi_id`);

--
-- Indexes for table `tbl_platform_offer`
--
ALTER TABLE `tbl_platform_offer`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_product`
--
ALTER TABLE `tbl_product`
  ADD PRIMARY KEY (`id`),
  ADD KEY `store_id` (`store_id`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `name` (`name`);

--
-- Indexes for table `tbl_product_discount`
--
ALTER TABLE `tbl_product_discount`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `tbl_product_favourites`
--
ALTER TABLE `tbl_product_favourites`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `tbl_product_image`
--
ALTER TABLE `tbl_product_image`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `tbl_product_rating`
--
ALTER TABLE `tbl_product_rating`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `tbl_product_return`
--
ALTER TABLE `tbl_product_return`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_item_id` (`order_item_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `tbl_product_size_chart`
--
ALTER TABLE `tbl_product_size_chart`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `size_id` (`size_id`),
  ADD KEY `measurement_id` (`measurement_id`);

--
-- Indexes for table `tbl_product_variant`
--
ALTER TABLE `tbl_product_variant`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `size_id` (`size_id`),
  ADD KEY `color_id` (`color_id`),
  ADD KEY `type_id` (`type_id`);

--
-- Indexes for table `tbl_report`
--
ALTER TABLE `tbl_report`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `tbl_report_images`
--
ALTER TABLE `tbl_report_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `report_id` (`report_id`);

--
-- Indexes for table `tbl_size`
--
ALTER TABLE `tbl_size`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_store`
--
ALTER TABLE `tbl_store`
  ADD PRIMARY KEY (`id`),
  ADD KEY `latitude` (`latitude`,`longitude`);

--
-- Indexes for table `tbl_store_offer`
--
ALTER TABLE `tbl_store_offer`
  ADD PRIMARY KEY (`id`),
  ADD KEY `store_id` (`store_id`);

--
-- Indexes for table `tbl_store_rating`
--
ALTER TABLE `tbl_store_rating`
  ADD PRIMARY KEY (`id`),
  ADD KEY `store_id` (`store_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `tbl_type`
--
ALTER TABLE `tbl_type`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_user`
--
ALTER TABLE `tbl_user`
  ADD PRIMARY KEY (`id`),
  ADD KEY `email` (`email`),
  ADD KEY `password` (`password`),
  ADD KEY `country_code` (`country_code`,`mobile_number`),
  ADD KEY `social_id` (`social_id`);

--
-- Indexes for table `tbl_user_address`
--
ALTER TABLE `tbl_user_address`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `latitude` (`latitude`,`longitude`);

--
-- Indexes for table `tbl_user_device`
--
ALTER TABLE `tbl_user_device`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `token` (`token`(768));

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tbl_cart`
--
ALTER TABLE `tbl_cart`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `tbl_category`
--
ALTER TABLE `tbl_category`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `tbl_cms`
--
ALTER TABLE `tbl_cms`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_color`
--
ALTER TABLE `tbl_color`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `tbl_contact_us`
--
ALTER TABLE `tbl_contact_us`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_faq`
--
ALTER TABLE `tbl_faq`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_measurement`
--
ALTER TABLE `tbl_measurement`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tbl_notification`
--
ALTER TABLE `tbl_notification`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `tbl_orders`
--
ALTER TABLE `tbl_orders`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `tbl_order_items`
--
ALTER TABLE `tbl_order_items`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `tbl_otp`
--
ALTER TABLE `tbl_otp`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `tbl_payment`
--
ALTER TABLE `tbl_payment`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tbl_platform_offer`
--
ALTER TABLE `tbl_platform_offer`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `tbl_product`
--
ALTER TABLE `tbl_product`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `tbl_product_discount`
--
ALTER TABLE `tbl_product_discount`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `tbl_product_favourites`
--
ALTER TABLE `tbl_product_favourites`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tbl_product_image`
--
ALTER TABLE `tbl_product_image`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `tbl_product_rating`
--
ALTER TABLE `tbl_product_rating`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `tbl_product_return`
--
ALTER TABLE `tbl_product_return`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_product_size_chart`
--
ALTER TABLE `tbl_product_size_chart`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `tbl_product_variant`
--
ALTER TABLE `tbl_product_variant`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `tbl_report`
--
ALTER TABLE `tbl_report`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_report_images`
--
ALTER TABLE `tbl_report_images`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_size`
--
ALTER TABLE `tbl_size`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `tbl_store`
--
ALTER TABLE `tbl_store`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `tbl_store_offer`
--
ALTER TABLE `tbl_store_offer`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_store_rating`
--
ALTER TABLE `tbl_store_rating`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `tbl_type`
--
ALTER TABLE `tbl_type`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `tbl_user`
--
ALTER TABLE `tbl_user`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT for table `tbl_user_address`
--
ALTER TABLE `tbl_user_address`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `tbl_user_device`
--
ALTER TABLE `tbl_user_device`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tbl_cart`
--
ALTER TABLE `tbl_cart`
  ADD CONSTRAINT `tbl_cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `tbl_user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tbl_cart_ibfk_2` FOREIGN KEY (`variant_id`) REFERENCES `tbl_product_variant` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tbl_category`
--
ALTER TABLE `tbl_category`
  ADD CONSTRAINT `tbl_category_ibfk_1` FOREIGN KEY (`parent_category_id`) REFERENCES `tbl_category` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `tbl_notification`
--
ALTER TABLE `tbl_notification`
  ADD CONSTRAINT `fk_reciverUser` FOREIGN KEY (`receiver_id`) REFERENCES `tbl_user` (`id`) ON DELETE SET NULL ON UPDATE SET NULL;

--
-- Constraints for table `tbl_orders`
--
ALTER TABLE `tbl_orders`
  ADD CONSTRAINT `tbl_orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `tbl_user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tbl_orders_ibfk_2` FOREIGN KEY (`payment_id`) REFERENCES `tbl_payment` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tbl_order_items`
--
ALTER TABLE `tbl_order_items`
  ADD CONSTRAINT `tbl_order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `tbl_orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tbl_order_items_ibfk_2` FOREIGN KEY (`variant_id`) REFERENCES `tbl_product_variant` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tbl_payment`
--
ALTER TABLE `tbl_payment`
  ADD CONSTRAINT `tbl_payment_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `tbl_user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tbl_product`
--
ALTER TABLE `tbl_product`
  ADD CONSTRAINT `tbl_product_ibfk_1` FOREIGN KEY (`store_id`) REFERENCES `tbl_store` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tbl_product_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `tbl_category` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tbl_product_discount`
--
ALTER TABLE `tbl_product_discount`
  ADD CONSTRAINT `tbl_product_discount_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `tbl_product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tbl_product_favourites`
--
ALTER TABLE `tbl_product_favourites`
  ADD CONSTRAINT `tbl_product_favourites_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `tbl_product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tbl_product_favourites_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `tbl_user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tbl_product_image`
--
ALTER TABLE `tbl_product_image`
  ADD CONSTRAINT `tbl_product_image_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `tbl_product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tbl_product_rating`
--
ALTER TABLE `tbl_product_rating`
  ADD CONSTRAINT `tbl_product_rating_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `tbl_product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tbl_product_rating_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `tbl_user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tbl_product_return`
--
ALTER TABLE `tbl_product_return`
  ADD CONSTRAINT `tbl_product_return_ibfk_1` FOREIGN KEY (`order_item_id`) REFERENCES `tbl_order_items` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tbl_product_return_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `tbl_user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tbl_product_size_chart`
--
ALTER TABLE `tbl_product_size_chart`
  ADD CONSTRAINT `tbl_product_size_chart_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `tbl_product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tbl_product_size_chart_ibfk_2` FOREIGN KEY (`size_id`) REFERENCES `tbl_size` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tbl_product_size_chart_ibfk_3` FOREIGN KEY (`measurement_id`) REFERENCES `tbl_measurement` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tbl_product_variant`
--
ALTER TABLE `tbl_product_variant`
  ADD CONSTRAINT `tbl_product_variant_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `tbl_product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tbl_product_variant_ibfk_2` FOREIGN KEY (`size_id`) REFERENCES `tbl_size` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tbl_product_variant_ibfk_3` FOREIGN KEY (`color_id`) REFERENCES `tbl_color` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tbl_product_variant_ibfk_4` FOREIGN KEY (`type_id`) REFERENCES `tbl_type` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tbl_report`
--
ALTER TABLE `tbl_report`
  ADD CONSTRAINT `tbl_report_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `tbl_user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tbl_report_images`
--
ALTER TABLE `tbl_report_images`
  ADD CONSTRAINT `tbl_report_images_ibfk_1` FOREIGN KEY (`report_id`) REFERENCES `tbl_report` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tbl_store_offer`
--
ALTER TABLE `tbl_store_offer`
  ADD CONSTRAINT `tbl_store_offer_ibfk_1` FOREIGN KEY (`store_id`) REFERENCES `tbl_store` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tbl_store_rating`
--
ALTER TABLE `tbl_store_rating`
  ADD CONSTRAINT `tbl_store_rating_ibfk_1` FOREIGN KEY (`store_id`) REFERENCES `tbl_store` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tbl_store_rating_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `tbl_user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tbl_user_address`
--
ALTER TABLE `tbl_user_address`
  ADD CONSTRAINT `tbl_user_address_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `tbl_user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tbl_user_device`
--
ALTER TABLE `tbl_user_device`
  ADD CONSTRAINT `tbl_user_device_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `tbl_user` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
