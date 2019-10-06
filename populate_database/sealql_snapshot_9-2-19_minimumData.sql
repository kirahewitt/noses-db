DROP database `sealDB`;
CREATE DATABASE  IF NOT EXISTS `sealDB`;
USE `sealDB`;


--
-- Table structure for table `Rookery`
--

DROP TABLE IF EXISTS `Rookery`;
CREATE TABLE `Rookery` (
  `Code` varchar(30) NOT NULL,
  `TagColor` varchar(30) NOT NULL,
  `Name` varchar(30) NOT NULL,
  PRIMARY KEY (`Code`)
);

--
-- Dumping data for table `Rookery`
--

LOCK TABLES `Rookery` WRITE;
INSERT INTO `Rookery` (`Code`, `TagColor`, `Name`) 
VALUES ('ABC123','G','Jackson 5 Rookery'),
       ('VAFB', 'G', 'Vandenberg Air Force Base'),
       ('PB','G','Piedras Blancas');
UNLOCK TABLES;


DROP TABLE IF EXISTS `Beach`;
CREATE TABLE `Beach` (
  `SLOCode` varchar(30) NOT NULL,
  `USCCCode` varchar(30) NOT NULL,
  `Name` varchar(30) NOT NULL,
  `Description` varchar(240) NOT NULL,
  `Code` varchar(30) NOT NULL,
  PRIMARY KEY (`SLOCode`),
  KEY `Code` (`Code`),
  CONSTRAINT `beach_ibfk_1` FOREIGN KEY (`Code`) REFERENCES `Rookery` (`Code`)
);

--
-- Dumping data for table `Beach`
--

LOCK TABLES `Beach` WRITE;
INSERT INTO `Beach` (`SLOCode`, `USCCCode`, `Name`, `Description`, `Code`) 
VALUES ('ACL','x','x','x','ABC123'),
       ('ACU','x','x','x','ABC123'),
       ('ALL','x','x','x','ABC123'),
       ('ALLn','x','x','x','ABC123'),
       ('ALLs','x','x','x','ABC123'),
       ('ALU','x','x','x','ABC123'),
       ('DCC','x','x','x','ABC123'),
       ('DCL','x','x','x','ABC123'),
       ('DCU','x','x','x','ABC123'),
       ('LTC','x','x','x','ABC123'),
       ('LTL','x','x','x','ABC123'),
       ('LTU','x','x','x','ABC123'),
       ('VAFB','x','x','x','ABC123'),
       ('VP3DC','x','x','x','ABC123'),
       ('VP3L','x','x','x','ABC123'),
       ('VP3U','x','x','x','ABC123');
UNLOCK TABLES;

--
-- Table structure for table `BeachSection`
--

DROP TABLE IF EXISTS `BeachSection`;
CREATE TABLE `BeachSection` (
  `Code` varchar(30) NOT NULL,
  `Description` varchar(240) NOT NULL,
  `SLOCode` varchar(30) NOT NULL,
  PRIMARY KEY (`Code`),
  KEY `SLOCode` (`SLOCode`),
  CONSTRAINT `beachsection_ibfk_1` FOREIGN KEY (`SLOCode`) REFERENCES `Beach` (`SLOCode`)
);

--
-- Table structure for table `Seasons`
--

DROP TABLE IF EXISTS `Seasons`;
CREATE TABLE `Seasons` (
  `Year` int(11) NOT NULL,
  `StartMonth` date NOT NULL,
  `EndMonth` date NOT NULL,
  `isCurrent` bool DEFAULT false,
  PRIMARY KEY (`Year`)
);

--
-- Dumping data for table `Seasons`
--

LOCK TABLES `Seasons` WRITE;
INSERT INTO `Seasons` (`Year`, `StartMonth`, `EndMonth`) 
VALUES (2018,'2017-12-01','2018-08-31'),
       (2019,'2018-12-01','2019-08-31');
UNLOCK TABLES;

--
-- Table structure for table `Marks`
--

DROP TABLE IF EXISTS `Marks`;
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
);

--
-- Table structure for table `Observers`
--

DROP TABLE IF EXISTS `Observers`;
CREATE TABLE `Observers` (
  `ObsID` int AUTO_INCREMENT,
  `FirstName` varchar(30) DEFAULT NULL,
  `LastName` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`ObsID`)
);

--
-- Dumping data for table `Observers`
--

LOCK TABLES `Observers` WRITE;
INSERT INTO `Observers` (`FirstName`, `LastName`) 
VALUES ('Ilya','Minarov'),
       ('Ian','O\'Rourke');
UNLOCK TABLES;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
CREATE TABLE `Users` (
  `UserID` int auto_increment,
  `Username` varchar(30) NOT NULL,
  `Password` varchar(30) NOT NULL,
  `Initials` varchar(30) NOT NULL,
  `PermissionsLevel` tinyint(1) NOT NULL,
  `Affiliation` varchar(30) NOT NULL,
  `Email` varchar(30) UNIQUE DEFAULT NULL,
  `ObsID` int UNIQUE NOT NULL,
  PRIMARY KEY (`UserID`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`ObsID`) REFERENCES `Observers` (`ObsID`)
);

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
INSERT INTO `Users` (`Username`, `Password`, `Initials`, `PermissionsLevel`, `Affiliation`, `Email`, `ObsID`) 
VALUES ('iorourke@calpoly.edu','password', 'IR', 3,'iorourke@calpoly.edu','iorourke@calpoly.edu', 2),
       ('iminarov@calpoly.edu','password', 'IM', 3,'iminarov@calpoly.edu','iminarov@calpoly.edu', 1);
UNLOCK TABLES;


-- --
-- -- Table structure for table `Events`
-- --
-- 
-- DROP TABLE IF EXISTS `Events`;
-- CREATE TABLE `Events` (
--   `EventID` int(11) NOT NULL AUTO_INCREMENT,
--   `EventTypeName` varchar(30) NOT NULL,
--   `Description` varchar(240) NOT NULL,
--   `LoginID` varchar(30) NOT NULL,
--   `Year` int(11) NOT NULL,
--   PRIMARY KEY (`EventID`),
--   KEY `LoginID` (`LoginID`),
--   KEY `Year` (`Year`),
--   CONSTRAINT `events_ibfk_1` FOREIGN KEY (`LoginID`) REFERENCES `Users` (`LoginID`),
--   CONSTRAINT `events_ibfk_2` FOREIGN KEY (`Year`) REFERENCES `Seasons` (`Year`)
-- );

--
-- Table structure for table `Observations`
--


DROP TABLE IF EXISTS `Observations`;
CREATE TABLE `Observations` (
  `ObservationID` int(11) NOT NULL AUTO_INCREMENT,
  `ObserverID` int NOT NULL,
  `Sex` varchar(1) DEFAULT NULL,
  `Date` date NOT NULL,
  `MoltPercent` int(11) DEFAULT NULL,
  `Comments` varchar(240) DEFAULT NULL,
  `AgeClass` VARCHAR(30) NULL DEFAULT NULL,
  `Year` int(11) DEFAULT NULL,
  `SLOCode` varchar(30) NOT NULL,
  `isApproved` int(11) NOT NULL DEFAULT '0',
  `LastSeenPup` datetime DEFAULT NULL,
  `FirstSeenWeaner` datetime DEFAULT NULL,
  `WeanDateRange` varchar(45) DEFAULT NULL,
  `EnteredInAno` bool DEFAULT FALSE,
  `isProcedure` bool DEFAULT FALSE,
  `isDeprecated` bool DEFAULT FALSE,
  PRIMARY KEY (`ObservationID`),
  KEY `ObserverID` (`ObserverID`),
  KEY `SLOCode` (`SLOCode`),
  KEY `observations_ibfk_3` (`Year`),
  CONSTRAINT `observations_ibfk_1` FOREIGN KEY (`ObserverID`) REFERENCES `Observers` (`ObsID`),
  CONSTRAINT `observations_ibfk_2` FOREIGN KEY (`SLOCode`) REFERENCES `Beach` (`SLOCode`),
  CONSTRAINT `observations_ibfk_3` FOREIGN KEY (`Year`) REFERENCES `Seasons` (`Year`)
);

DROP TABLE IF EXISTS `ObsUpload`;
CREATE TABLE `ObsUpload` (
    `UploadID` int,
	PRIMARY KEY (`UploadID`)
);

DROP TABLE IF EXISTS `UploadContainingObs`;
CREATE TABLE `UploadContainingObs` (
    `UploadID` int,
    `ObservationID` int,
	PRIMARY KEY (`ObservationID`),
    CONSTRAINT `uploadContainingObs_ibfk_1` FOREIGN KEY (`UploadID`) REFERENCES `ObsUpload` (`UploadID`),
	CONSTRAINT `uploadContainingObs_ibfk_2` FOREIGN KEY (`ObservationID`) REFERENCES `Observations` (`ObservationID`)
);



DROP TABLE IF EXISTS `FieldLeaderForObs`;
CREATE TABLE `FieldLeaderForObs` (
	`ObservationID` int,
    `UserID` int,
    CONSTRAINT `FieldLeaderForObs_ibfk_1` FOREIGN KEY (`ObservationID`) REFERENCES `Observations` (`ObservationID`),
	CONSTRAINT `FieldLeaderForObs_ibfk_2` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`)
);

--
-- Table structure for table `ObserveMarks`
--

DROP TABLE IF EXISTS `ObserveMarks`;
CREATE TABLE `ObserveMarks` (
  `ObservationID` int(11) NOT NULL,
  `MarkID` int(11) NOT NULL,
  PRIMARY KEY (`ObservationID`),
  KEY `MarkID` (`MarkID`),
  CONSTRAINT `observemarks_ibfk_1` FOREIGN KEY (`ObservationID`) REFERENCES `Observations` (`ObservationID`),
  CONSTRAINT `observemarks_ibfk_2` FOREIGN KEY (`MarkID`) REFERENCES `Marks` (`MarkID`)
);

--
-- Table structure for table `Measurements`
--

DROP TABLE IF EXISTS `Measurements`;
CREATE TABLE `Measurements` (
  `MeasurementID` int(11) NOT NULL AUTO_INCREMENT,
  `ObservationID` int(11) NOT NULL,
  `AuxillaryGirth` DOUBLE(12,2) NULL DEFAULT NULL,
  `AnimalMass` DOUBLE(12,2) NULL DEFAULT NULL,
  `TotalMass` DOUBLE(12,2) NULL DEFAULT NULL,
  `CurvilinearLength` DOUBLE(12,2) NULL DEFAULT NULL,
  `StandardLength` DOUBLE(12,2) NULL DEFAULT NULL,
  PRIMARY KEY (`MeasurementID`),
  KEY `ObservationID` (`ObservationID`),
  CONSTRAINT `measurements_ibfk_1` FOREIGN KEY (`ObservationID`) REFERENCES `Observations` (`ObservationID`)
);

--
-- Table structure for table `Tags`
--

DROP TABLE IF EXISTS `Tags`;
CREATE TABLE `Tags` (
  `TagNumber` varchar(30) NOT NULL,
  `TagColor` varchar(30) NOT NULL,
  `TagPosition` varchar(30) DEFAULT NULL,
  `TagDate` date NOT NULL,
  `ObservationID` int(11) DEFAULT NULL,
  `isLost` bool DEFAULT false,
  PRIMARY KEY (`TagNumber`),
  KEY `ObservationID` (`ObservationID`),
  CONSTRAINT `tags_ibfk_1` FOREIGN KEY (`ObservationID`) REFERENCES `Observations` (`ObservationID`)
);

--
-- Table structure for table `Seals`
--

DROP TABLE IF EXISTS `Seals`;
CREATE TABLE `Seals` (
  `SealID` int(11) NOT NULL AUTO_INCREMENT,
  `ObservationID` int(11) NOT NULL,
  `Sex` varchar(1) DEFAULT NULL,
  `isDeprecated` bool DEFAULT FALSE,
  PRIMARY KEY (`SealID`),
  KEY `ObservationID` (`ObservationID`),
  CONSTRAINT `seals_ibfk_1` FOREIGN KEY (`ObservationID`) REFERENCES `Observations` (`ObservationID`)
);

#Do we need this table?

DROP TABLE IF EXISTS `Pictures`;
CREATE TABLE `SealPictures` (
  `SealID` int(11) DEFAULT NULL,
  `ObsID` int(11) DEFAULT NULL,
  `PictureURL` varchar(50) NOT NULL,
  PRIMARY KEY (`PictureURL`),
  CONSTRAINT `obsPictures_ibfk_1` FOREIGN KEY (`ObsID`) REFERENCES `Observations` (`ObservationID`),
  CONSTRAINT `sealPictures_ibfk_1` FOREIGN KEY (`SealID`) REFERENCES `Seals` (`SealID`)
);

--
-- Table structure for table `ObserveSeal`
--

DROP TABLE IF EXISTS `ObserveSeal`;
CREATE TABLE `ObserveSeal` (
  `ObservationID` int(11) NOT NULL,
  `SealID` int(11) NOT NULL,
  PRIMARY KEY (`ObservationID`),
  KEY `SealID` (`SealID`),
  CONSTRAINT `observeseal_ibfk_1` FOREIGN KEY (`ObservationID`) REFERENCES `Observations` (`ObservationID`),
  CONSTRAINT `observeseal_ibfk_2` FOREIGN KEY (`SealID`) REFERENCES `Seals` (`SealID`)
);

--
-- Table structure for table `ObserveTags`
--

DROP TABLE IF EXISTS `ObserveTags`;
CREATE TABLE `ObserveTags` (
  `OTAG_ID` int(11) NOT NULL AUTO_INCREMENT,
  `ObservationID` int(11) NOT NULL,
  `TagNumber` varchar(30) NOT NULL,
  PRIMARY KEY (`OTAG_ID`),
  KEY `TagNumber` (`TagNumber`),
  KEY `ObservationID` (`ObservationID`),
  CONSTRAINT `observetags_ibfk_1` FOREIGN KEY (`TagNumber`) REFERENCES `Tags` (`TagNumber`),
  CONSTRAINT `observetags_ibfk_2` FOREIGN KEY (`ObservationID`) REFERENCES `Observations` (`ObservationID`)
);

--
-- Table structure for table `StagedObservations`
--

DROP TABLE IF EXISTS `StagedObservations`;
CREATE TABLE `StagedObservations` (
  `StagedID` int(11) NOT NULL,
  `ObsID` int NOT NULL,
  `MoltPercent` int(11) NOT NULL,
  `Comments` varchar(240) NOT NULL,
  `Date` date NOT NULL,
  `Sex` varchar(1) NOT NULL,
  `AgeClass` varchar(30) NOT NULL,
  CONSTRAINT `stagedobservations_ibfk_1` FOREIGN KEY (`ObsID`) REFERENCES `Observers` (`ObsID`)
);
