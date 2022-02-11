CREATE DATABASE  IF NOT EXISTS `sealDB` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `sealDB`;
-- MySQL dump 10.13  Distrib 8.0.28, for macos11 (x86_64)
--
-- Host: database-this-is-the-last-time.cvrgneqrnjcb.us-east-2.rds.amazonaws.com    Database: sealDB
-- ------------------------------------------------------
-- Server version	5.7.33-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
-- SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
-- SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

-- SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '';

--
-- Table structure for table `Beach`
--

DROP TABLE IF EXISTS `Beach`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Beach` (
  `SLOCode` varchar(30) NOT NULL,
  `USCCCode` varchar(30) NOT NULL,
  `Name` varchar(30) NOT NULL,
  `Description` varchar(240) NOT NULL,
  `Code` varchar(30) NOT NULL,
  PRIMARY KEY (`SLOCode`),
  KEY `Code` (`Code`),
  CONSTRAINT `beach_ibfk_1` FOREIGN KEY (`Code`) REFERENCES `Rookery` (`Code`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `BeachSection`
--

DROP TABLE IF EXISTS `BeachSection`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `BeachSection` (
  `Code` varchar(30) NOT NULL,
  `Description` varchar(240) NOT NULL,
  `SLOCode` varchar(30) NOT NULL,
  PRIMARY KEY (`Code`),
  KEY `SLOCode` (`SLOCode`),
  CONSTRAINT `beachsection_ibfk_1` FOREIGN KEY (`SLOCode`) REFERENCES `Beach` (`SLOCode`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `FieldLeaderForObs`
--

DROP TABLE IF EXISTS `FieldLeaderForObs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `FieldLeaderForObs` (
  `ObservationID` int(11) DEFAULT NULL,
  `UserID` int(11) DEFAULT NULL,
  KEY `FieldLeaderForObs_ibfk_1` (`ObservationID`),
  KEY `FieldLeaderForObs_ibfk_2` (`UserID`),
  CONSTRAINT `FieldLeaderForObs_ibfk_1` FOREIGN KEY (`ObservationID`) REFERENCES `Observations` (`ObservationID`),
  CONSTRAINT `FieldLeaderForObs_ibfk_2` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Image`
--

DROP TABLE IF EXISTS `Image`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Image` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pictureData` longblob,
  `caption` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Image_for_UserAccount`
--

DROP TABLE IF EXISTS `Image_for_UserAccount`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Image_for_UserAccount` (
  `imageId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  PRIMARY KEY (`imageId`,`userId`),
  KEY `fk_userId_idx` (`userId`),
  CONSTRAINT `fk_imageId` FOREIGN KEY (`imageId`) REFERENCES `Image` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_userId` FOREIGN KEY (`userId`) REFERENCES `Users` (`UserID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Marks`
--

DROP TABLE IF EXISTS `Marks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Marks` (
  `MarkID` int(11) NOT NULL AUTO_INCREMENT,
  `Mark` varchar(30) NOT NULL,
  `MarkPosition` varchar(30) DEFAULT NULL,
  `markDate` date NOT NULL,
  `Year` int(11) NOT NULL,
  `ObservationID` int(11) NOT NULL,
  `MarkSeal` int(11) DEFAULT NULL,
  PRIMARY KEY (`MarkID`,`Mark`,`Year`),
  KEY `Year` (`Year`),
  CONSTRAINT `marks_ibfk_1` FOREIGN KEY (`Year`) REFERENCES `Seasons` (`Year`)
) ENGINE=InnoDB AUTO_INCREMENT=967 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Measurements`
--

DROP TABLE IF EXISTS `Measurements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Measurements` (
  `MeasurementID` int(11) NOT NULL AUTO_INCREMENT,
  `ObservationID` int(11) NOT NULL,
  `AuxillaryGirth` double(12,2) DEFAULT NULL,
  `AnimalMass` double(12,2) DEFAULT NULL,
  `TotalMass` double(12,2) DEFAULT NULL,
  `CurvilinearLength` double(12,2) DEFAULT NULL,
  `StandardLength` double(12,2) DEFAULT NULL,
  PRIMARY KEY (`MeasurementID`),
  KEY `ObservationID` (`ObservationID`),
  CONSTRAINT `measurements_ibfk_1` FOREIGN KEY (`ObservationID`) REFERENCES `Observations` (`ObservationID`)
) ENGINE=InnoDB AUTO_INCREMENT=100 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ObsUpload`
--

DROP TABLE IF EXISTS `ObsUpload`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ObsUpload` (
  `UploadID` int(11) NOT NULL,
  PRIMARY KEY (`UploadID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Observations`
--

DROP TABLE IF EXISTS `Observations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Observations` (
  `ObservationID` int(11) NOT NULL AUTO_INCREMENT,
  `ObserverID` int(11) NOT NULL,
  `Sex` varchar(1) DEFAULT NULL,
  `Date` date NOT NULL,
  `MoltPercent` int(11) DEFAULT NULL,
  `Comments` varchar(240) DEFAULT NULL,
  `AgeClass` varchar(30) DEFAULT NULL,
  `Year` int(11) DEFAULT NULL,
  `SLOCode` varchar(30) NOT NULL,
  `isApproved` int(11) NOT NULL DEFAULT '0',
  `LastSeenPup` datetime DEFAULT NULL,
  `FirstSeenWeaner` datetime DEFAULT NULL,
  `WeanDateRange` varchar(45) DEFAULT NULL,
  `EnteredInAno` tinyint(1) DEFAULT '0',
  `isProcedure` tinyint(1) DEFAULT '0',
  `isDeprecated` tinyint(1) DEFAULT '0',
  `DateObservationAddedToDB` datetime DEFAULT CURRENT_TIMESTAMP,
  `haremCount` int(11) DEFAULT NULL,
  PRIMARY KEY (`ObservationID`),
  KEY `ObserverID` (`ObserverID`),
  KEY `SLOCode` (`SLOCode`),
  KEY `observations_ibfk_3` (`Year`),
  CONSTRAINT `observations_ibfk_1` FOREIGN KEY (`ObserverID`) REFERENCES `Observers` (`ObsID`),
  CONSTRAINT `observations_ibfk_2` FOREIGN KEY (`SLOCode`) REFERENCES `Beach` (`SLOCode`),
  CONSTRAINT `observations_ibfk_3` FOREIGN KEY (`Year`) REFERENCES `Seasons` (`Year`)
) ENGINE=InnoDB AUTO_INCREMENT=4059 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ObserveMarks`
--

DROP TABLE IF EXISTS `ObserveMarks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ObserveMarks` (
  `ObservationID` int(11) NOT NULL,
  `MarkID` int(11) NOT NULL,
  PRIMARY KEY (`ObservationID`),
  KEY `MarkID` (`MarkID`),
  CONSTRAINT `observemarks_ibfk_1` FOREIGN KEY (`ObservationID`) REFERENCES `Observations` (`ObservationID`),
  CONSTRAINT `observemarks_ibfk_2` FOREIGN KEY (`MarkID`) REFERENCES `Marks` (`MarkID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ObserveSeal`
--

DROP TABLE IF EXISTS `ObserveSeal`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ObserveSeal` (
  `ObservationID` int(11) NOT NULL,
  `SealID` int(11) NOT NULL,
  PRIMARY KEY (`ObservationID`),
  KEY `SealID` (`SealID`),
  CONSTRAINT `observeseal_ibfk_1` FOREIGN KEY (`ObservationID`) REFERENCES `Observations` (`ObservationID`),
  CONSTRAINT `observeseal_ibfk_2` FOREIGN KEY (`SealID`) REFERENCES `Seals` (`SealID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ObserveTags`
--

DROP TABLE IF EXISTS `ObserveTags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ObserveTags` (
  `OTAG_ID` int(11) NOT NULL AUTO_INCREMENT,
  `ObservationID` int(11) NOT NULL,
  `TagNumber` varchar(30) NOT NULL,
  PRIMARY KEY (`OTAG_ID`),
  KEY `TagNumber` (`TagNumber`),
  KEY `ObservationID` (`ObservationID`),
  CONSTRAINT `observetags_ibfk_1` FOREIGN KEY (`TagNumber`) REFERENCES `Tags` (`TagNumber`),
  CONSTRAINT `observetags_ibfk_2` FOREIGN KEY (`ObservationID`) REFERENCES `Observations` (`ObservationID`)
) ENGINE=InnoDB AUTO_INCREMENT=2187 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Observers`
--

DROP TABLE IF EXISTS `Observers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Observers` (
  `ObsID` int(11) NOT NULL AUTO_INCREMENT,
  `FirstName` varchar(30) DEFAULT NULL,
  `LastName` varchar(30) DEFAULT NULL,
  `isVerifiedByAdmin` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`ObsID`)
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Rookery`
--

DROP TABLE IF EXISTS `Rookery`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Rookery` (
  `Code` varchar(30) NOT NULL,
  `TagColor` varchar(30) NOT NULL,
  `Name` varchar(30) NOT NULL,
  PRIMARY KEY (`Code`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `SealPictures`
--

DROP TABLE IF EXISTS `SealPictures`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SealPictures` (
  `SealID` int(11) DEFAULT NULL,
  `ObsID` int(11) DEFAULT NULL,
  `PictureURL` varchar(50) NOT NULL,
  PRIMARY KEY (`PictureURL`),
  KEY `obsPictures_ibfk_1` (`ObsID`),
  KEY `sealPictures_ibfk_1` (`SealID`),
  CONSTRAINT `obsPictures_ibfk_1` FOREIGN KEY (`ObsID`) REFERENCES `Observations` (`ObservationID`),
  CONSTRAINT `sealPictures_ibfk_1` FOREIGN KEY (`SealID`) REFERENCES `Seals` (`SealID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Seals`
--

DROP TABLE IF EXISTS `Seals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Seals` (
  `SealID` int(11) NOT NULL AUTO_INCREMENT,
  `ObservationID` int(11) NOT NULL,
  `Sex` varchar(1) DEFAULT NULL,
  `isDeprecated` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`SealID`),
  KEY `ObservationID` (`ObservationID`),
  CONSTRAINT `seals_ibfk_1` FOREIGN KEY (`ObservationID`) REFERENCES `Observations` (`ObservationID`)
) ENGINE=InnoDB AUTO_INCREMENT=2105 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Seasons`
--

DROP TABLE IF EXISTS `Seasons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Seasons` (
  `Year` int(11) NOT NULL,
  `StartMonth` date NOT NULL,
  `EndMonth` date NOT NULL,
  `isCurrent` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`Year`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `StagedObservations`
--

DROP TABLE IF EXISTS `StagedObservations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `StagedObservations` (
  `StagedID` int(11) NOT NULL,
  `ObsID` int(11) NOT NULL,
  `MoltPercent` int(11) NOT NULL,
  `Comments` varchar(240) NOT NULL,
  `Date` date NOT NULL,
  `Sex` varchar(1) NOT NULL,
  `AgeClass` varchar(30) NOT NULL,
  KEY `stagedobservations_ibfk_1` (`ObsID`),
  CONSTRAINT `stagedobservations_ibfk_1` FOREIGN KEY (`ObsID`) REFERENCES `Observers` (`ObsID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Tags`
--

DROP TABLE IF EXISTS `Tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Tags` (
  `TagNumber` varchar(30) NOT NULL,
  `TagColor` varchar(30) NOT NULL,
  `TagPosition` varchar(30) DEFAULT NULL,
  `TagDate` date NOT NULL,
  `TagSeal` int(11) DEFAULT NULL,
  `isLost` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`TagNumber`),
  KEY `ObservationID` (`TagSeal`),
  CONSTRAINT `tags_ibfk_1` FOREIGN KEY (`TagSeal`) REFERENCES `Observations` (`ObservationID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `UploadContainingObs`
--

DROP TABLE IF EXISTS `UploadContainingObs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `UploadContainingObs` (
  `UploadID` int(11) DEFAULT NULL,
  `ObservationID` int(11) NOT NULL,
  PRIMARY KEY (`ObservationID`),
  KEY `uploadContainingObs_ibfk_1` (`UploadID`),
  CONSTRAINT `uploadContainingObs_ibfk_1` FOREIGN KEY (`UploadID`) REFERENCES `ObsUpload` (`UploadID`),
  CONSTRAINT `uploadContainingObs_ibfk_2` FOREIGN KEY (`ObservationID`) REFERENCES `Observations` (`ObservationID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Users` (
  `UserID` int(11) NOT NULL AUTO_INCREMENT,
  `Username` varchar(30) NOT NULL,
  `Password` varchar(100) NOT NULL,
  `Initials` varchar(30) NOT NULL,
  `isAdmin` tinyint(1) NOT NULL,
  `Affiliation` varchar(30) NOT NULL,
  `Email` varchar(30) DEFAULT NULL,
  `ObsID` int(11) NOT NULL,
  `isVerifiedByAdmin` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`UserID`),
  UNIQUE KEY `Email` (`Email`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
-- SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-02-10 10:28:30
