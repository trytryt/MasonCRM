-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 18, 2024 at 03:30 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `customersdb`
--
CREATE DATABASE IF NOT EXISTS `customersdb` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `customersdb`;

-- --------------------------------------------------------

--
-- Table structure for table `chomarim`
--

CREATE TABLE `chomarim` (
  `chomarimId` int(11) NOT NULL,
  `customerId` int(11) DEFAULT NULL,
  `expenseTypeId` int(11) DEFAULT NULL,
  `chomarimCategory` enum('ChomerLavan','KablanMishne','ChomerShachor', 'Sapak') NOT NULL,
  `amount` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `chomarim`
--

INSERT INTO `chomarim` (`chomarimId`, `customerId`, `expenseTypeId`, `chomarimCategory`, `amount`) VALUES
(1, 1, 1, 'chomerShachor', 700.00),
(2, 3, 1, 'chomerLavan', 800.00),
(3, 2, 1, 'kablanMishne', 300.00),
(4, 3, 1, 'chomerLavan', 400.00),
(5, 2, 1, '', 0.00),
(6, 2, 1, '', 0.00),
(7, 2, 1, '', 0.00),
(8, 2, 1, '', 0.00),
(9, 2, 1, '', 0.00),
(10, 2, 1, '', 0.00);

-- --------------------------------------------------------

--
-- Table structure for table `customer`
--

CREATE TABLE `customer` (
  `customerId` int(11) NOT NULL,
  `userId` int(11) DEFAULT NULL,
  `name` varchar(20) NOT NULL,
  `adress` varchar(40) NOT NULL,
  `phoneNumber` varchar(10) NOT NULL,
  `customerStatus` tinyint(1) NOT NULL DEAFULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customer`
--

INSERT INTO `customer` (`customerId`, `userId`, `name`, `adress`, `phoneNumber`) VALUES
(1, 1, 'choen', 'bnei brak', '0556667777'),
(2, 1, 'Moshe', 'jerusalem', '0556668888'),
(3, 1, 'levi 2', 'jerusalem 2', '0556668822'),
(5, 3, 'lakoach', 'yaffo', '0556664488'),
(6, 1, 'Aviv', 'Petch Tikva', '0554487585'),
(7, 1, 'Ami', 'Park', '0548789865'),
(8, 1, 'Ariel', 'sabonim', '0554442211'),
(9, 1, 'Gadi', 'Nof Ayalon', '0552222365'),
(10, 1, 'Shimon', 'Rosh Pinah', '0055888745');

-- --------------------------------------------------------

--
-- Table structure for table `documents`
--

CREATE TABLE `documents` (
  `documentId` int(11) NOT NULL,
  `customerId` int(11) NOT NULL,
  `documentName` varchar(255) NOT NULL,
  `filePath` varchar(255) NOT NULL,
  `uploadDate` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `expensetypes`
--

CREATE TABLE `expensetypes` (
  `expenseTypeId` int(11) NOT NULL,
  `expenseTypeName` varchar(70) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `expensetypes`
--

INSERT INTO `expensetypes` (`expenseTypeId`, `expenseTypeName`) VALUES
(1, 'someType');

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `paymentId` int(11) NOT NULL,
  `customerId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `amount` int(10) NOT NULL,
  `paymentDate` date NOT NULL,
  `isPaid` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`paymentId`, `customerId`, `userId`, `amount`, `paymentDate`, `isPaid`) VALUES
(1, 1, 1, 2000, '2024-12-03', 0),
(3, 3, 1, 5000, '2024-12-18', 1),
(5, 2, 3, 6000, '2024-12-18', 1),
(6, 3, 1, 5000, '2024-12-17', 1),
(7, 3, 1, 7010, '2024-12-17', 1),
(8, 3, 1, 7010, '2024-12-17', 1),
(9, 3, 1, 7510, '2024-12-17', 1),
(10, 2, 1, 7452, '2024-12-17', 1),
(11, 2, 1, 2400, '2024-12-17', 1);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `userId` int(11) NOT NULL,
  `userName` varchar(15) NOT NULL,
  `password` varchar(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`userId`, `userName`, `password`) VALUES
(1, 'yosi', '$2a$10$2s8LfaGWkakofBVECCbQceMrhEWx7VkVGue9bMMxi8C3qpq3X8LOW'),
(2, 'YosefAmrani1', 'YosefAmrani1'),
(3, 'Danss', 'Fuxss');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `chomarim`
--
ALTER TABLE `chomarim`
  ADD PRIMARY KEY (`chomarimId`),
  ADD KEY `fk_customer` (`customerId`),
  ADD KEY `fk_expenseTypes` (`expenseTypeId`);

--
-- Indexes for table `customer`
--
ALTER TABLE `customer`
  ADD PRIMARY KEY (`customerId`),
  ADD KEY `FK_customer_rseId` (`userId`);

--
-- Indexes for table `documents`
--
ALTER TABLE `documents`
  ADD PRIMARY KEY (`documentId`),
  ADD KEY `customerId` (`customerId`);

--
-- Indexes for table `expensetypes`
--
ALTER TABLE `expensetypes`
  ADD PRIMARY KEY (`expenseTypeId`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`paymentId`),
  ADD KEY `transactionId` (`customerId`),
  ADD KEY `fk_userId` (`userId`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`userId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `chomarim`
--
ALTER TABLE `chomarim`
  MODIFY `chomarimId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `customer`
--
ALTER TABLE `customer`
  MODIFY `customerId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `documents`
--
ALTER TABLE `documents`
  MODIFY `documentId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `expensetypes`
--
ALTER TABLE `expensetypes`
  MODIFY `expenseTypeId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `paymentId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `userId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `chomarim`
--
ALTER TABLE `chomarim`
  ADD CONSTRAINT `fk_customer` FOREIGN KEY (`customerId`) REFERENCES `customer` (`customerId`),
  ADD CONSTRAINT `fk_expenseTypes` FOREIGN KEY (`expenseTypeId`) REFERENCES `expensetypes` (`expenseTypeId`);

--
-- Constraints for table `customer`
--
ALTER TABLE `customer`
  ADD CONSTRAINT `FK_customer_rseId` FOREIGN KEY (`userId`) REFERENCES `user` (`userId`) ON DELETE CASCADE;

--
-- Constraints for table `documents`
--
ALTER TABLE `documents`
  ADD CONSTRAINT `documents_ibfk_1` FOREIGN KEY (`customerId`) REFERENCES `customer` (`customerId`);

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `fk_customer_payment` FOREIGN KEY (`customerId`) REFERENCES `customer` (`customerId`),
  ADD CONSTRAINT `fk_userId` FOREIGN KEY (`userId`) REFERENCES `user` (`userId`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
