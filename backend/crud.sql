-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 22, 2024 at 01:07 PM
-- Server version: 10.4.18-MariaDB
-- PHP Version: 8.0.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `crud`
--

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `pid` int(11) NOT NULL,
  `uid` int(11) NOT NULL,
  `product` varchar(255) NOT NULL,
  `isactive` enum('y','n') DEFAULT 'y'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`pid`, `uid`, `product`, `isactive`) VALUES
(1, 1, 'Product A', 'y'),
(2, 2, 'Product B', 'y'),
(3, 1, 'Product C', 'y'),
(4, 4, 'Product D', 'n'),
(5, 3, 'Product E', 'y'),
(6, 4, 'Product F', 'y'),
(7, 3, 'Product G', 'y'),
(8, 3, 'Product H', 'n'),
(9, 1, 'Product I', 'n'),
(10, 2, 'Product J', 'n'),
(11, 2, 'Product K', 'y'),
(12, 4, 'Product L', 'y');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `uid` int(11) NOT NULL,
  `firstname` varchar(20) NOT NULL,
  `lastname` varchar(20) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`uid`, `firstname`, `lastname`, `email`, `password`, `created_at`) VALUES
(1, 'Biplab', 'Tarafder', 'test01.trial@gmail.com', '$2a$12$iKFUoTlO3Cx4F0Tu/nkU/OB9oh6ntQY3b/ghEjFQUfFWHthkM0.mW', '2024-01-19 09:34:11'),
(2, 'Arnab', 'Mondal', 'test02.trial@gmail.com', '$2a$12$iM5PZwh2HjuFJqKtkWqIQOjuYOd8.ZpG5uIs.gmsMrrOLV7k3.gvS', '2024-01-19 11:14:41'),
(3, 'test', 'trial', 'test03.trial@gmail.com', '$2a$12$tiT.gO6lxOwEzTcTnxd7M.fFSAIR886MFZfDEWmqM1w5cGBJe8Gv.', '2024-01-19 11:18:34'),
(4, 'hello', 'world', 'test04.trial@gmail.com', '$2a$12$/DMCVSeXnPCquHEbM9GoWeNOmic.HmRwgHkkR4ZoPHH709dXoJYlO', '2024-01-19 11:25:29');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`pid`),
  ADD KEY `uid` (`uid`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`uid`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `pid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `uid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `users` (`uid`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
