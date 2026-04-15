-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 13, 2026 at 07:11 AM
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
  `is_active` tinyint(4) DEFAULT 1,
  `is_delete` tinyint(4) DEFAULT 0,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_category`
--

CREATE TABLE `tbl_category` (
  `id` bigint(20) NOT NULL,
  `parent_category_id` bigint(20) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `image_url` text DEFAULT NULL,
  `is_active` tinyint(4) DEFAULT 1,
  `is_delete` tinyint(4) DEFAULT 0,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
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
(11, 3, 'Clothing', 'uploads/kids_clothing.jpg', 1, 0, '2026-04-10 18:02:24', '2026-04-10 18:02:24');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_cms`
--

CREATE TABLE `tbl_cms` (
  `id` bigint(20) NOT NULL,
  `tag_name` varchar(50) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `is_delete` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_color`
--

CREATE TABLE `tbl_color` (
  `id` bigint(20) NOT NULL,
  `name` varchar(64) DEFAULT NULL,
  `is_active` tinyint(4) DEFAULT 1,
  `is_delete` tinyint(4) DEFAULT 0,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_contact_us`
--

CREATE TABLE `tbl_contact_us` (
  `id` bigint(20) NOT NULL,
  `title` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `message` varchar(100) DEFAULT NULL,
  `status` enum('pending','approved','resolved') DEFAULT NULL,
  `resolved_at` timestamp NULL DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `is_delete` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_faq`
--

CREATE TABLE `tbl_faq` (
  `id` bigint(20) NOT NULL,
  `question` varchar(100) DEFAULT NULL,
  `answer` varchar(100) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `is_delete` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_measurement`
--

CREATE TABLE `tbl_measurement` (
  `id` bigint(20) NOT NULL,
  `name` varchar(128) DEFAULT NULL,
  `is_active` tinyint(4) DEFAULT 1,
  `is_delete` tinyint(4) DEFAULT 0,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_orders`
--

CREATE TABLE `tbl_orders` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `payment_id` bigint(20) DEFAULT NULL,
  `order_code` varchar(100) DEFAULT NULL,
  `order_date` datetime DEFAULT NULL,
  `subtotal` decimal(10,2) DEFAULT NULL,
  `tax` decimal(10,2) DEFAULT NULL,
  `discount` decimal(10,2) DEFAULT NULL,
  `total` decimal(10,2) DEFAULT NULL,
  `latitude` varchar(100) DEFAULT NULL,
  `longitude` varchar(100) DEFAULT NULL,
  `location` varchar(100) DEFAULT NULL,
  `total_amount` decimal(10,2) DEFAULT NULL,
  `payment_mode` enum('cash_on_delivery','card','upi') DEFAULT NULL,
  `order_status` enum('placed','delivered','cancelled') DEFAULT NULL,
  `is_active` tinyint(4) DEFAULT 1,
  `is_delete` tinyint(4) DEFAULT 0,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_orders`
--

INSERT INTO `tbl_orders` (`id`, `user_id`, `payment_id`, `order_code`, `order_date`, `subtotal`, `tax`, `discount`, `total`, `latitude`, `longitude`, `location`, `total_amount`, `payment_mode`, `order_status`, `is_active`, `is_delete`, `created_at`, `updated_at`) VALUES
(1, 13, NULL, 'ORD001', '2026-04-10 18:39:43', 25000.00, 2500.00, 1000.00, 26500.00, '19.07609000000000', '72.87770000000000', 'Mumbai', 26500.00, 'upi', 'placed', 1, 0, '2026-04-10 18:39:43', '2026-04-10 18:39:43'),
(2, 14, NULL, 'ORD002', '2026-04-10 18:39:43', 18000.00, 1800.00, 500.00, 19300.00, '19.21833000000000', '72.97808900000000', 'Thane', 19300.00, 'card', 'delivered', 1, 0, '2026-04-10 18:39:43', '2026-04-10 18:39:43'),
(3, 13, NULL, 'ORD003', '2026-04-10 18:39:43', 30000.00, 3000.00, 2000.00, 31000.00, '19.03300000000000', '72.85670000000000', 'Navi Mumbai', 31000.00, 'cash_on_delivery', 'placed', 1, 0, '2026-04-10 18:39:43', '2026-04-10 18:39:43');

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
  `is_active` tinyint(4) DEFAULT 1,
  `is_delete` tinyint(4) DEFAULT 0,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_otp`
--

CREATE TABLE `tbl_otp` (
  `id` bigint(20) NOT NULL,
  `country_code` varchar(10) DEFAULT NULL,
  `mobile_number` varchar(20) DEFAULT NULL,
  `email` varchar(256) DEFAULT NULL,
  `otp` varchar(6) DEFAULT NULL,
  `expires_at` datetime DEFAULT NULL,
  `otp_purpose` enum('signup','forgot_password') DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `is_delete` tinyint(1) DEFAULT 0,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_otp`
--

INSERT INTO `tbl_otp` (`id`, `country_code`, `mobile_number`, `email`, `otp`, `expires_at`, `otp_purpose`, `is_active`, `is_delete`, `created_at`, `updated_at`) VALUES
(1, '+91', '95104479522', NULL, '1234', '2026-04-10 09:17:41', 'signup', 0, 1, '2026-04-10 05:12:41', '2026-04-10 05:25:56'),
(2, '+91', '95104479522', NULL, '1234', '2026-04-10 05:47:47', 'signup', 1, 1, '2026-04-10 05:42:47', '2026-04-10 09:50:36'),
(3, '+91', '95104479522', NULL, '1234', '2026-04-10 09:55:36', 'signup', 1, 0, '2026-04-10 09:50:36', '2026-04-10 09:50:36'),
(4, '+91', '95104479545', NULL, '1234', '2026-04-10 09:55:47', 'signup', 0, 1, '2026-04-10 09:50:47', '2026-04-10 09:53:01'),
(5, '+91', '95104479545', NULL, '1234', '2026-04-11 20:29:20', 'signup', 1, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(6, '+91', '8817728171', NULL, '1234', '2026-04-13 13:14:59', 'signup', 0, 1, '0000-00-00 00:00:00', '2026-04-12 13:18:11'),
(7, NULL, NULL, 'sahilmansursi883@gmail.com', '1234', '2026-04-12 13:23:28', 'forgot_password', 1, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(8, '+91', '95104479521', NULL, '1234', '2026-04-12 13:23:36', 'signup', 1, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_payment`
--

CREATE TABLE `tbl_payment` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `card_holder_name` varchar(100) DEFAULT NULL,
  `card_number` varchar(100) DEFAULT NULL,
  `card_expiry_date` varchar(100) DEFAULT NULL,
  `payment_mode` enum('card','upi') DEFAULT NULL,
  `upi_id` varchar(100) DEFAULT NULL,
  `is_active` tinyint(4) DEFAULT 1,
  `is_delete` tinyint(4) DEFAULT 0,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_platform_offer`
--

CREATE TABLE `tbl_platform_offer` (
  `id` bigint(20) NOT NULL,
  `image` text DEFAULT NULL,
  `discount_type` enum('F','P') DEFAULT NULL,
  `discount_amount` decimal(10,2) DEFAULT NULL,
  `is_active` tinyint(4) DEFAULT 1,
  `is_delete` tinyint(4) DEFAULT 0,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
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
  `name` varchar(100) DEFAULT NULL,
  `description` varchar(100) DEFAULT NULL,
  `additional_info` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`additional_info`)),
  `base_price` decimal(10,2) DEFAULT NULL,
  `is_active` tinyint(4) DEFAULT 1,
  `is_delete` tinyint(4) DEFAULT 0,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_product`
--

INSERT INTO `tbl_product` (`id`, `store_id`, `category_id`, `name`, `description`, `additional_info`, `base_price`, `is_active`, `is_delete`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 'Luxury Sofa', 'Comfortable 3-seater sofa', NULL, 25000.00, 1, 0, '2026-04-10 18:03:52', '2026-04-10 18:03:52'),
(2, 1, 1, 'Dining Table', '6-seater dining table', NULL, 18000.00, 1, 0, '2026-04-10 18:03:52', '2026-04-10 18:03:52'),
(3, 2, 1, 'Wooden Bed', 'King size wooden bed', NULL, 30000.00, 1, 0, '2026-04-10 18:03:52', '2026-04-10 18:03:52'),
(4, 3, 1, 'Office Chair', 'Ergonomic office chair', NULL, 7000.00, 1, 0, '2026-04-10 18:03:52', '2026-04-10 18:03:52');

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
  `is_active` tinyint(4) DEFAULT 1,
  `is_delete` tinyint(4) DEFAULT 0,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_product_discount`
--

INSERT INTO `tbl_product_discount` (`id`, `product_id`, `discount_type`, `discount_value`, `start_date`, `end_date`, `is_active`, `is_delete`, `created_at`, `updated_at`) VALUES
(1, 1, 'percentage', 10.00, '2026-04-10 18:04:18', '2026-04-20 18:04:18', 1, 0, '2026-04-10 18:04:18', '2026-04-10 18:04:18'),
(2, 2, 'flat', 2000.00, '2026-04-10 18:04:18', '2026-04-15 18:04:18', 1, 0, '2026-04-10 18:04:18', '2026-04-10 18:04:18'),
(3, 3, 'percentage', 15.00, '2026-04-10 18:04:18', '2026-04-17 18:04:18', 1, 0, '2026-04-10 18:04:18', '2026-04-10 18:04:18'),
(4, 4, 'flat', 500.00, '2026-04-10 18:04:18', '2026-04-13 18:04:18', 1, 0, '2026-04-10 18:04:18', '2026-04-10 18:04:18');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_product_favourites`
--

CREATE TABLE `tbl_product_favourites` (
  `id` bigint(20) NOT NULL,
  `product_id` bigint(20) DEFAULT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `is_active` tinyint(4) DEFAULT 1,
  `is_delete` tinyint(4) DEFAULT 0,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_product_image`
--

CREATE TABLE `tbl_product_image` (
  `id` bigint(20) NOT NULL,
  `product_id` bigint(20) DEFAULT NULL,
  `image_url` varchar(100) DEFAULT NULL,
  `is_active` tinyint(4) DEFAULT 1,
  `is_delete` tinyint(4) DEFAULT 0,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_product_image`
--

INSERT INTO `tbl_product_image` (`id`, `product_id`, `image_url`, `is_active`, `is_delete`, `created_at`, `updated_at`) VALUES
(1, 1, 'uploads/sofa1.jpg', 1, 0, '2026-04-10 18:04:01', '2026-04-10 18:04:01'),
(2, 1, 'uploads/sofa2.jpg', 1, 0, '2026-04-10 18:04:01', '2026-04-10 18:04:01'),
(3, 2, 'uploads/dining1.jpg', 1, 0, '2026-04-10 18:04:01', '2026-04-10 18:04:01'),
(4, 3, 'uploads/bed1.jpg', 1, 0, '2026-04-10 18:04:01', '2026-04-10 18:04:01'),
(5, 4, 'uploads/chair1.jpg', 1, 0, '2026-04-10 18:04:01', '2026-04-10 18:04:01');

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
  `is_active` tinyint(4) DEFAULT 1,
  `is_delete` tinyint(4) DEFAULT 0,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_product_rating`
--

INSERT INTO `tbl_product_rating` (`id`, `product_id`, `user_id`, `rating`, `review`, `is_active`, `is_delete`, `created_at`, `updated_at`) VALUES
(1, 1, 13, 5, 'Super comfortable sofa!', 1, 0, '2026-04-10 18:04:09', '2026-04-10 18:04:09'),
(2, 1, 14, 4, 'Good quality', 1, 0, '2026-04-10 18:04:09', '2026-04-10 18:04:09'),
(3, 2, 13, 4, 'Nice dining table', 1, 0, '2026-04-10 18:04:09', '2026-04-10 18:04:09'),
(4, 3, 14, 5, 'Strong and durable bed', 1, 0, '2026-04-10 18:04:09', '2026-04-10 18:04:09'),
(5, 4, 13, 3, 'Okay chair', 1, 0, '2026-04-10 18:04:09', '2026-04-10 18:04:09');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_product_return`
--

CREATE TABLE `tbl_product_return` (
  `id` bigint(20) NOT NULL,
  `order_item_id` bigint(20) DEFAULT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `return_reason` enum('defective','damaged','wrong_item','wrong_size','wrong_color','wrong_price','other') DEFAULT NULL,
  `return_description` varchar(100) DEFAULT NULL,
  `return_status` enum('pending','approved','rejected') DEFAULT NULL,
  `is_active` tinyint(4) DEFAULT 1,
  `is_delete` tinyint(4) DEFAULT 0,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
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
  `value` varchar(100) DEFAULT NULL,
  `is_active` tinyint(4) DEFAULT 1,
  `is_delete` tinyint(4) DEFAULT 0,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `is_active` tinyint(4) DEFAULT 1,
  `is_delete` tinyint(4) DEFAULT 0,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_report`
--

CREATE TABLE `tbl_report` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `report_reason` enum('spam','fraud','abuse','other') DEFAULT NULL,
  `report_description` varchar(100) DEFAULT NULL,
  `is_active` tinyint(4) DEFAULT 1,
  `is_delete` tinyint(4) DEFAULT 0,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_report_images`
--

CREATE TABLE `tbl_report_images` (
  `id` bigint(20) NOT NULL,
  `report_id` bigint(20) DEFAULT NULL,
  `image_url` varchar(100) DEFAULT NULL,
  `is_active` tinyint(4) DEFAULT 1,
  `is_delete` tinyint(4) DEFAULT 0,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_size`
--

CREATE TABLE `tbl_size` (
  `id` bigint(20) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `is_active` tinyint(4) DEFAULT 1,
  `is_delete` tinyint(4) DEFAULT 0,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_store`
--

CREATE TABLE `tbl_store` (
  `id` bigint(20) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `description` varchar(100) DEFAULT NULL,
  `image_url` varchar(100) DEFAULT NULL,
  `latitude` varchar(100) DEFAULT NULL,
  `longitude` varchar(100) DEFAULT NULL,
  `is_active` tinyint(4) DEFAULT 1,
  `is_delete` tinyint(4) DEFAULT 0,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_store`
--

INSERT INTO `tbl_store` (`id`, `name`, `description`, `image_url`, `latitude`, `longitude`, `is_active`, `is_delete`, `created_at`, `updated_at`) VALUES
(1, 'Urban Furniture', 'Modern home furniture store', 'uploads/store1.jpg', '19.07609000000000', '72.87770000000000', 1, 0, '2026-04-10 17:55:31', '2026-04-10 17:55:31'),
(2, 'Classic Wood', 'Premium wooden furniture', 'uploads/store2.jpg', '19.21833000000000', '72.97808900000000', 1, 0, '2026-04-10 17:55:31', '2026-04-10 17:55:31'),
(3, 'Home Comforts', 'Affordable home essentials', 'uploads/store3.jpg', '19.03300000000000', '72.85670000000000', 1, 0, '2026-04-10 17:55:31', '2026-04-10 17:55:31');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_store_offer`
--

CREATE TABLE `tbl_store_offer` (
  `id` bigint(20) NOT NULL,
  `store_id` bigint(20) DEFAULT NULL,
  `image_url` varchar(100) DEFAULT NULL,
  `offer_type` enum('flat','percentage') DEFAULT NULL,
  `offer_value` decimal(10,2) DEFAULT NULL,
  `start_date` datetime DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  `is_active` tinyint(4) DEFAULT 1,
  `is_delete` tinyint(4) DEFAULT 0,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
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
  `is_active` tinyint(4) DEFAULT 1,
  `is_delete` tinyint(4) DEFAULT 0,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_store_rating`
--

INSERT INTO `tbl_store_rating` (`id`, `store_id`, `user_id`, `rating`, `review`, `is_active`, `is_delete`, `created_at`, `updated_at`) VALUES
(1, 1, 13, 5, 'Excellent quality furniture', 1, 0, '2026-04-10 17:55:44', '2026-04-10 17:55:44'),
(2, 1, 14, 4, 'Good but slightly expensive', 1, 0, '2026-04-10 17:55:44', '2026-04-10 17:55:44'),
(3, 2, 13, 4, 'Nice wooden finish', 1, 0, '2026-04-10 17:55:44', '2026-04-10 17:55:44'),
(4, 3, 14, 3, 'Average products', 1, 0, '2026-04-10 17:55:44', '2026-04-10 17:55:44');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_type`
--

CREATE TABLE `tbl_type` (
  `id` bigint(20) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `is_active` tinyint(4) DEFAULT 1,
  `is_delete` tinyint(4) DEFAULT 0,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `is_verified` tinyint(4) DEFAULT 0,
  `is_active` tinyint(4) DEFAULT 1,
  `is_delete` tinyint(4) DEFAULT 0,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_user`
--

INSERT INTO `tbl_user` (`id`, `name`, `email`, `password`, `country_code`, `mobile_number`, `profile_image`, `login_type`, `social_id`, `language`, `is_verified`, `is_active`, `is_delete`, `created_at`, `updated_at`) VALUES
(1, NULL, 'sahilmansuri@gmail.com', NULL, '+91', '9510447055', NULL, NULL, NULL, NULL, 0, 1, 0, '2026-04-09 10:37:43', '2026-04-09 10:37:43'),
(2, NULL, NULL, NULL, '+91', '9510447055', NULL, 'S', NULL, NULL, 0, 1, 0, '2026-04-09 11:26:46', '2026-04-09 11:26:46'),
(3, NULL, NULL, NULL, NULL, NULL, 'sahil.jpg', 'G', 'social_id123', NULL, 0, 1, 0, '2026-04-09 13:31:14', '2026-04-10 04:50:10'),
(4, 'sahil', 'sahilmansuri881@gmail.com', NULL, '+91', '9510447056', NULL, 'G', 'social_id1234', NULL, 0, 1, 0, '2026-04-09 11:34:26', '2026-04-09 11:34:26'),
(5, 'sahil', 'sahilmansuri883@gmail.com', NULL, '+91', '9510447052', NULL, 'G', 'social_id12345', NULL, 1, 1, 0, '2026-04-09 11:35:48', '2026-04-09 11:35:48'),
(6, 'sahil', 'sahilmansursi883@gmail.com', '9ed4c6cff352bc50a18c2ad17a539724', '+91', '9510447952', NULL, 'S', NULL, NULL, 1, 1, 0, '2026-04-09 11:50:53', '2026-04-09 14:02:41'),
(7, 'sahil', 'sahilmansursi883@gmail.com', '9ed4c6cff352bc50a18c2ad17a539724', '+91', '9510447952', NULL, 'S', NULL, NULL, 1, 1, 0, '2026-04-09 11:58:24', '2026-04-09 14:02:41'),
(8, 'sahil', 'sahilmansursi8833@gmail.com', '1006f0ae5a7ece19828a67ac62288e05', '+91', '95104479521', NULL, 'S', NULL, NULL, 1, 1, 0, '2026-04-09 12:22:45', '2026-04-09 12:22:45'),
(13, 'sahil', 'sahilmansursi@gmail.com', '1006f0ae5a7ece19828a67ac62288e05', '+91', '95104479522', NULL, 'S', NULL, NULL, 1, 1, 0, '2026-04-10 05:25:56', '2026-04-10 05:25:56'),
(14, 'sahil', 'sahilmansursi56@gmail.com', '1006f0ae5a7ece19828a67ac62288e05', '+91', '95104479545', NULL, 'S', NULL, NULL, 1, 1, 0, '2026-04-10 09:53:01', '2026-04-10 09:53:01'),
(16, 'sahil', 'sahhhhhhhil@gmail.com', '1006f0ae5a7ece19828a67ac62288e05', '+91', '8817728171', NULL, 'S', NULL, NULL, 1, 1, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_user_address`
--

CREATE TABLE `tbl_user_address` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `company_name` varchar(100) DEFAULT NULL,
  `address_line_1` varchar(100) DEFAULT NULL,
  `address_line_2` varchar(100) DEFAULT NULL,
  `latitude` varchar(100) DEFAULT NULL,
  `longitude` varchar(100) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `postal_code` varchar(100) DEFAULT NULL,
  `is_default` tinyint(1) DEFAULT 0,
  `is_active` tinyint(4) DEFAULT 1,
  `is_delete` tinyint(4) DEFAULT 0,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_user_address`
--

INSERT INTO `tbl_user_address` (`id`, `user_id`, `name`, `company_name`, `address_line_1`, `address_line_2`, `latitude`, `longitude`, `city`, `state`, `country`, `postal_code`, `is_default`, `is_active`, `is_delete`, `created_at`, `updated_at`) VALUES
(1, 1, 'sahilmasnuri', 'null', 'null', 'null', 'null', 'null', 'sahilasici', 'sacbakjc', 'sacbakj', '+811', 0, 1, 0, '2026-04-12 14:46:50', '2026-04-12 14:46:50'),
(2, 1, 'sahilmasnuri', 'null', 'null', 'null', 'null', 'null', 'sahilasici', 'sacbakjc', 'sacbakj', '+811', 0, 1, 0, '2026-04-12 14:47:24', '2026-04-12 14:47:24');

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
  `device_name` varchar(100) DEFAULT NULL,
  `device_model` varchar(100) DEFAULT NULL,
  `os_version` varchar(100) DEFAULT NULL,
  `uuid` varchar(100) DEFAULT NULL,
  `ip` varchar(100) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `is_delete` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_user_device`
--

INSERT INTO `tbl_user_device` (`id`, `user_id`, `token`, `device_token`, `device_type`, `device_name`, `device_model`, `os_version`, `uuid`, `ip`, `is_active`, `is_delete`, `created_at`, `updated_at`) VALUES
(1, 14, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNCwiaWQiOjE0LCJuYW1lIjoic2FoaWwiLCJlbWFpbCI6InNhaGlsbWFuc3Vyc2k1NkBnbWFpbC5jb20iLCJtb2JpbGVfbnVtYmVyIjoiOTUxMDQ0Nzk1NDUiLCJjb3VudHJ5X2NvZGUiOiIrOTEiLCJsb2dpbl90eXBlIjoiUyIsInNvY2lhbF9pZCI6bnVsbCwiaXNfdmVyaWZpZWQiOjEsInJvbGUiOm51bGwsImlhdCI6MTc3NTgxNDc4MSwiZXhwIjoxODA3MzUwNzgxfQ.oRnaA3nx6hL0VXaB5KygaIPWaQHPVYo3e7YlvWeu_tI', 'fcm_or_apns_token_here', 'A', 'Samsung S23', 'SM-S911B', 'Android 14', '2f6c1c7a-9b8d-4c7e-a44f-1e2c3d4e5f67', '192.168.1.10', 1, 0, '2026-04-10 09:53:01', '2026-04-10 09:54:11'),
(2, 16, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNiwiaWQiOjE2LCJuYW1lIjoic2FoaWwiLCJlbWFpbCI6InNhaGhoaGhoaGlsQGdtYWlsLmNvbSIsIm1vYmlsZV9udW1iZXIiOiI4ODE3NzI4MTcxIiwiY291bnRyeV9jb2RlIjoiKzkxIiwibG9naW5fdHlwZSI6IlMiLCJzb2NpYWxfaWQiOm51bGwsImlzX3ZlcmlmaWVkIjoxLCJyb2xlIjpudWxsLCJpYXQiOjE3NzU5ODAwOTEsImV4cCI6MTgwNzUxNjA5MX0.hjeVT8VZQv6TRLBYVwceHizZ-x-GBJ6tgI5-PfAKtbs', 'fcm_or_apns_token_here', 'A', 'Samsung S23', 'SM-S911B', 'Android 14', '2f6c1c7a-9b8d-4c7e-a44f-1e2c3d4e5f67', '192.168.1.10', 1, 0, '2026-04-12 07:48:11', '2026-04-12 07:48:11');

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
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_color`
--
ALTER TABLE `tbl_color`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_contact_us`
--
ALTER TABLE `tbl_contact_us`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_faq`
--
ALTER TABLE `tbl_faq`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_measurement`
--
ALTER TABLE `tbl_measurement`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_orders`
--
ALTER TABLE `tbl_orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `payment_id` (`payment_id`);

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
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_payment`
--
ALTER TABLE `tbl_payment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

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
  ADD KEY `category_id` (`category_id`);

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
  ADD PRIMARY KEY (`id`);

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
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_user_address`
--
ALTER TABLE `tbl_user_address`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `tbl_user_device`
--
ALTER TABLE `tbl_user_device`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tbl_cart`
--
ALTER TABLE `tbl_cart`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_category`
--
ALTER TABLE `tbl_category`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `tbl_cms`
--
ALTER TABLE `tbl_cms`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_color`
--
ALTER TABLE `tbl_color`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

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
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_orders`
--
ALTER TABLE `tbl_orders`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tbl_order_items`
--
ALTER TABLE `tbl_order_items`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tbl_otp`
--
ALTER TABLE `tbl_otp`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `tbl_payment`
--
ALTER TABLE `tbl_payment`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_platform_offer`
--
ALTER TABLE `tbl_platform_offer`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `tbl_product`
--
ALTER TABLE `tbl_product`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `tbl_product_discount`
--
ALTER TABLE `tbl_product_discount`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `tbl_product_favourites`
--
ALTER TABLE `tbl_product_favourites`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_product_image`
--
ALTER TABLE `tbl_product_image`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `tbl_product_rating`
--
ALTER TABLE `tbl_product_rating`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `tbl_product_return`
--
ALTER TABLE `tbl_product_return`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_product_size_chart`
--
ALTER TABLE `tbl_product_size_chart`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_product_variant`
--
ALTER TABLE `tbl_product_variant`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

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
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_store`
--
ALTER TABLE `tbl_store`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tbl_store_offer`
--
ALTER TABLE `tbl_store_offer`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_store_rating`
--
ALTER TABLE `tbl_store_rating`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `tbl_type`
--
ALTER TABLE `tbl_type`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_user`
--
ALTER TABLE `tbl_user`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `tbl_user_address`
--
ALTER TABLE `tbl_user_address`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `tbl_user_device`
--
ALTER TABLE `tbl_user_device`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

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
