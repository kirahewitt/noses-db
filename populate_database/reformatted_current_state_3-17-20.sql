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
VALUES ('ABC123','G','Jackson 5 Rookery'),('PB','G','Piedras Blancas'),('VAFB','G','Vandenberg Air Force Base');
UNLOCK TABLES;

--
-- Table structure for table `Beach`
--

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
VALUES ('ACL','x','x','x','ABC123'),('ACU','x','x','x','ABC123'),('ALL','x','x','x','ABC123'),('ALLn','x','x','x','ABC123'),('ALLs','x','x','x','ABC123'),('ALU','x','x','x','ABC123'),('DCC','x','x','x','ABC123'),('DCL','x','x','x','ABC123'),('DCU','x','x','x','ABC123'),('LTC','x','x','x','ABC123'),('LTL','x','x','x','ABC123'),('LTU','x','x','x','ABC123'),('VAFB','x','x','x','ABC123'),('VP3DC','x','x','x','ABC123'),('VP3L','x','x','x','ABC123'),('VP3U','x','x','x','ABC123');
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
-- Dumping data for table `BeachSection`
--

LOCK TABLES `BeachSection` WRITE;
UNLOCK TABLES;


--
-- Table structure for table `Seasons`
--

DROP TABLE IF EXISTS `Seasons`;
CREATE TABLE `Seasons` (
  `Year` int(11) NOT NULL,
  `StartMonth` date NOT NULL,
  `EndMonth` date NOT NULL,
  `isCurrent` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`Year`)
);

--
-- Dumping data for table `Seasons`
--

LOCK TABLES `Seasons` WRITE;
INSERT INTO `Seasons` (`Year`, `StartMonth`, `EndMonth`, `isCurrent`) 
VALUES (2018,'2017-12-01','2018-08-31',0),(2019,'2018-12-01','2019-08-31',0);
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
-- Dumping data for table `Marks`
--

LOCK TABLES `Marks` WRITE;
INSERT INTO `Marks` (`MarkID`, `Mark`, `MarkPosition`, `markDate`, `Year`, `ObservationID`, `MarkSeal`) 
VALUES (1,'WP772','R','2017-12-30',2018,3,NULL),(2,'1X',NULL,'2017-12-30',2018,4,NULL),(3,'2X',NULL,'2017-12-30',2018,5,NULL),(4,'3X',NULL,'2017-12-31',2018,6,NULL),(5,'4X',NULL,'2017-12-31',2018,7,NULL),(6,'6X',NULL,'2018-01-02',2018,9,NULL),(7,'7X',NULL,'2018-01-02',2018,10,NULL),(8,'PBX1','B','2018-01-04',2018,11,NULL),(9,'8X',NULL,'2018-01-04',2018,12,NULL),(10,'9X',NULL,'2018-01-04',2018,13,NULL),(11,'IWOM1','B','2019-01-02',2019,14,NULL),(12,'IWOM2','B','2019-01-03',2019,15,NULL),(13,'IWOM3','R','2019-01-04',2019,16,NULL),(14,'IWOM4','B','2019-01-04',2019,17,NULL),(15,'IW_M_','B','2019-01-04',2019,19,NULL),(16,'IWO__','R','2019-01-04',2019,20,NULL),(17,'IWOM_','B','2019-01-04',2019,21,NULL);
UNLOCK TABLES;


--
-- Table structure for table `Observers`
--

DROP TABLE IF EXISTS `Observers`;
CREATE TABLE `Observers` (
  `ObsID` int(11) NOT NULL AUTO_INCREMENT,
  `FirstName` varchar(30) DEFAULT NULL,
  `LastName` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`ObsID`)
);

--
-- Dumping data for table `Observers`
--

LOCK TABLES `Observers` WRITE;
INSERT INTO `Observers` (`ObsID`, `FirstName`, `LastName`) 
VALUES (1,'Ilya','Minarov'),
       (2,'Ian','O\'Rourke'),(3,'C','C'),(4,'J','D');
UNLOCK TABLES;


--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
CREATE TABLE `Users` (
  `UserID` int(11) NOT NULL AUTO_INCREMENT,
  `Username` varchar(30) NOT NULL,
  `Password` varchar(30) NOT NULL,
  `Initials` varchar(30) NOT NULL,
  `isAdmin` tinyint(1) NOT NULL,
  `Affiliation` varchar(30) NOT NULL,
  `Email` varchar(30) DEFAULT NULL,
  `ObsID` int(11) NOT NULL,
  `isVerifiedByAdmin` tinyint(1) NOT NULL,
  PRIMARY KEY (`UserID`),
  UNIQUE KEY `ObsID` (`ObsID`),
  UNIQUE KEY `Email` (`Email`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`ObsID`) REFERENCES `Observers` (`ObsID`)
);

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
INSERT INTO `Users` (`UserID`, `Username`, `Password`, `Initials`, `isAdmin`, `Affiliation`, `Email`, `ObsID`, `isVerifiedByAdmin`) 
VALUES (1,'iorourke@calpoly.edu','password','IR',3,'iorourke@calpoly.edu','iorourke@calpoly.edu',2, 1),
       (2,'iminarov@calpoly.edu','password','IM',3,'iminarov@calpoly.edu','iminarov@calpoly.edu',1, 1),
       (3,'kihewitt@calpoly.edu','password','KH',3,'kihewitt@calpoly.edu','kihewitt@calpoly.edu',3, 1);
UNLOCK TABLES;



--
-- Table structure for table `Observations`
--

DROP TABLE IF EXISTS `Observations`;
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
);

--
-- Dumping data for table `Observations`
--

LOCK TABLES `Observations` WRITE;
INSERT INTO `Observations` (`ObservationID`, `ObserverID`, `Sex`, `Date`, `MoltPercent`, `Comments`, `AgeClass`, `Year`, `SLOCode`, `isApproved`, `LastSeenPup`, `FirstSeenWeaner`, `WeanDateRange`, `EnteredInAno`, `isProcedure`, `isDeprecated`, `DateObservationAddedToDB`) VALUES (1,2,'M','2017-11-13',NULL,'asdf','A',2018,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(2,3,'M','2017-11-13',NULL,'asdf','A',2018,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(3,3,'M','2017-12-30',NULL,'asdf','SA2',2018,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(4,3,'M','2017-12-30',NULL,'asdf','5',2018,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(5,3,NULL,'2017-12-30',NULL,'asdf','5',2018,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(6,3,NULL,'2017-12-31',NULL,'asdf','7',2018,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(7,3,NULL,'2017-12-31',NULL,'asdf','7',2018,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(8,3,'M','2018-01-02',NULL,'asdf','SA2',2018,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(9,3,NULL,'2018-01-02',NULL,'asdf','10',2018,'DCL',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(10,3,NULL,'2018-01-02',NULL,'asdf','5',2018,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(11,3,'M','2018-01-04',NULL,'asdf','A',2018,'DCL',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(12,3,NULL,'2018-01-04',NULL,'asdf','10',2018,'DCL',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(13,3,NULL,'2018-01-04',NULL,'asdf','14',2018,'DCL',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(14,2,'M','2019-01-02',30,'first sight pup','P',2019,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(15,2,'F','2019-01-03',50,'first sight adult female','AF',2019,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(16,2,'M','2019-01-04',NULL,'NULL','SA3',2019,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(17,2,'F','2019-01-04',NULL,'NULL','AF',2019,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(18,4,'M','2019-01-04',NULL,'resight pup','P',2019,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(19,4,'F','2019-01-04',NULL,'resight adult female 1','AF',2019,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(20,4,'M','2019-01-04',NULL,'resight male sa3','SA3',2019,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(21,4,'M','2019-01-04',NULL,'resight adule female 2','SA3',2019,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(22,3,'M','2017-11-13',NULL,'asdf','A',2018,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(23,3,'M','2017-12-30',NULL,'asdf','SA2',2018,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(24,3,'M','2017-12-30',NULL,'asdf','A',2018,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(25,3,NULL,'2017-12-30',NULL,'asdf','A',2018,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(26,3,NULL,'2017-12-31',NULL,'asdf','A',2018,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(27,3,NULL,'2017-12-31',NULL,'asdf','A',2018,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(28,3,'M','2018-01-02',NULL,'asdf','SA2',2018,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(29,3,NULL,'2018-01-02',NULL,'asdf','A',2018,'DCL',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(30,3,NULL,'2018-01-02',NULL,'asdf','A',2018,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(31,3,'M','2018-01-04',NULL,'asdf','A',2018,'DCL',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(32,3,NULL,'2018-01-04',NULL,'asdf','A',2018,'DCL',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(33,3,NULL,'2018-01-04',NULL,'asdf','A',2018,'DCL',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(34,2,'M','2019-01-02',30,'first sight pup','P',2019,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(35,2,'F','2019-01-03',50,'first sight adult female','A',2019,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(36,2,'M','2019-01-04',NULL,'NULL','SA3',2019,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(37,2,'F','2019-01-04',NULL,'NULL','A',2019,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(38,4,'M','2019-01-04',NULL,'resight pup','P',2019,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(39,4,'F','2019-01-04',NULL,'resight adult female 1','A',2019,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(40,4,'M','2019-01-04',NULL,'resight male sa3','SA3',2019,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(41,4,'M','2019-01-04',NULL,'resight adule female 2','SA3',2019,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(42,3,'M','2017-11-13',NULL,'asdf','Aweijfoweijf',2018,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(43,3,'M','2017-12-30',NULL,'asdf','SA2',2018,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(44,3,'M','2017-12-30',NULL,'asdf','A',2018,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(45,3,NULL,'2017-12-30',NULL,'asdf','A',2018,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(46,3,NULL,'2017-12-31',NULL,'asdf','A',2018,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(47,3,NULL,'2017-12-31',NULL,'asdf','A',2018,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(48,3,'M','2018-01-02',NULL,'asdf','SA2',2018,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(49,3,NULL,'2018-01-02',NULL,'asdf','A',2018,'DCL',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(50,3,NULL,'2018-01-02',NULL,'asdf','A',2018,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(51,3,'M','2018-01-04',NULL,'asdf','A',2018,'DCL',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(52,3,NULL,'2018-01-04',NULL,'asdf','A',2018,'DCL',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(53,3,NULL,'2018-01-04',NULL,'asdf','A',2018,'DCL',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(54,2,'M','2019-01-02',30,'first sight pup','P',2019,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(55,2,'F','2019-01-03',50,'first sight adult female','A',2019,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(56,2,'M','2019-01-04',NULL,'NULL','SA3',2019,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(57,2,'F','2019-01-04',NULL,'NULL','A',2019,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(58,4,'M','2019-01-04',NULL,'resight pup','P',2019,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(59,4,'F','2019-01-04',NULL,'resight adult female 1','A',2019,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(60,4,'M','2019-01-04',NULL,'resight male sa3','SA3',2019,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(61,4,'M','2019-01-04',NULL,'resight adule female 2','SA3',2019,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(62,3,'M','2017-11-13',NULL,'test123','A',2018,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(63,3,'M','2017-12-30',NULL,'asdf','SA2',2018,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(64,3,'M','2017-12-30',NULL,'asdf','A',2018,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(65,3,NULL,'2017-12-30',NULL,'asdf','A',2018,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(66,3,NULL,'2017-12-31',NULL,'asdf','A',2018,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(67,3,NULL,'2017-12-31',NULL,'asdf','A',2018,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(68,3,'M','2018-01-02',NULL,'asdf','SA2',2018,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(69,3,NULL,'2018-01-02',NULL,'asdf','A',2018,'DCL',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(70,3,NULL,'2018-01-02',NULL,'asdf','A',2018,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(71,3,'M','2018-01-04',NULL,'asdf','A',2018,'DCL',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(72,3,NULL,'2018-01-04',NULL,'asdf','A',2018,'DCL',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(73,3,NULL,'2018-01-04',NULL,'asdf','A',2018,'DCL',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(74,2,'M','2019-01-02',30,'first sight pup','P',2019,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(75,2,'F','2019-01-03',50,'first sight adult female','A',2019,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(76,2,'M','2019-01-04',NULL,'NULL','SA3',2019,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(77,2,'F','2019-01-04',NULL,'NULL','A',2019,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(78,4,'M','2019-01-04',NULL,'resight pup','P',2019,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(79,4,'F','2019-01-04',NULL,'resight adult female 1','A',2019,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(80,4,'M','2019-01-04',NULL,'resight male sa3','SA3',2019,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(81,4,'M','2019-01-04',NULL,'resight adule female 2','SA3',2019,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(82,3,'M','2017-11-13',NULL,'HELP1','A',2018,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(83,3,'M','2017-12-30',NULL,'HELP2','SA2',2018,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(84,3,'M','2017-12-30',NULL,'HELP3','A',2018,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(85,3,NULL,'2017-12-30',NULL,'HELP4','A',2018,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(86,3,NULL,'2017-12-31',NULL,'HELP5','A',2018,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(87,3,NULL,'2017-12-31',NULL,'HELP6','A',2018,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(88,3,'M','2018-01-02',NULL,'HELP7','SA2',2018,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(89,3,NULL,'2018-01-02',NULL,'HELP8','A',2018,'DCL',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(90,3,NULL,'2018-01-02',NULL,'HELP9','A',2018,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(91,3,'M','2018-01-04',NULL,'HELP10','A',2018,'DCL',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(92,3,NULL,'2018-01-04',NULL,'HELP11','A',2018,'DCL',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(93,3,NULL,'2018-01-04',NULL,'HELP12','A',2018,'DCL',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(94,2,'M','2019-01-02',30,'first sight pup','P',2019,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(95,2,'F','2019-01-03',50,'first sight adult female','A',2019,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(96,2,'M','2019-01-04',NULL,'NULL','SA3',2019,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(97,2,'F','2019-01-04',NULL,'NULL','A',2019,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(98,4,'M','2019-01-04',NULL,'resight pup','P',2019,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(99,4,'F','2019-01-04',NULL,'resight adult female 1','A',2019,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(100,4,'M','2019-01-04',NULL,'resight male sa3','SA3',2019,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(101,4,'M','2019-01-04',NULL,'resight adule female 2','SA3',2019,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(102,3,'F','2017-11-13',NULL,'HELP1','A',2018,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(103,3,'M','2017-12-30',NULL,'HELP2','SA2',2018,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(104,3,'M','2017-12-30',NULL,'HELP3','A',2018,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(105,3,NULL,'2017-12-30',NULL,'HELP4','A',2018,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(106,3,NULL,'2017-12-31',NULL,'HELP5','A',2018,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(107,3,NULL,'2017-12-31',NULL,'HELP6','A',2018,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(108,3,'M','2018-01-02',NULL,'HELP7','SA2',2018,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(109,3,NULL,'2018-01-02',NULL,'HELP8','A',2018,'DCL',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(110,3,NULL,'2018-01-02',NULL,'HELP9','A',2018,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(111,3,'M','2018-01-04',NULL,'HELP10','A',2018,'DCL',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(112,3,NULL,'2018-01-04',NULL,'HELP11','A',2018,'DCL',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(113,3,NULL,'2018-01-04',NULL,'HELP12','A',2018,'DCL',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(114,2,'M','2019-01-02',30,'first sight pup','P',2019,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(115,2,'F','2019-01-03',50,'first sight adult female','A',2019,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(116,2,'M','2019-01-04',NULL,'NULL','SA3',2019,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(117,2,'F','2019-01-04',NULL,'NULL','A',2019,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(118,4,'M','2019-01-04',NULL,'resight pup','P',2019,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(119,4,'F','2019-01-04',NULL,'resight adult female 1','A',2019,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(120,4,'M','2019-01-04',NULL,'resight male sa3','SA3',2019,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(121,4,'M','2019-01-04',NULL,'resight adule female 2','SA3',2019,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 10:56:48'),(122,3,'M','2017-11-13',NULL,'HELP1','A',2018,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 11:02:35'),(123,3,'M','2017-12-30',NULL,'HELP2','SA2',2018,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 11:02:35'),(124,3,'M','2017-12-30',NULL,'HELP3','A',2018,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 11:02:35'),(125,3,NULL,'2017-12-30',NULL,'HELP4','A',2018,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 11:02:35'),(126,3,NULL,'2017-12-31',NULL,'HELP5','A',2018,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 11:02:35'),(127,3,NULL,'2017-12-31',NULL,'HELP6','A',2018,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 11:02:35'),(128,3,'M','2018-01-02',NULL,'HELP7','SA2',2018,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 11:02:35'),(129,3,NULL,'2018-01-02',NULL,'HELP8','A',2018,'DCL',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 11:02:35'),(130,3,NULL,'2018-01-02',NULL,'HELP9','A',2018,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 11:02:35'),(131,3,'M','2018-01-04',NULL,'HELP10','A',2018,'DCL',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 11:02:35'),(132,3,NULL,'2018-01-04',NULL,'HELP11','A',2018,'DCL',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 11:02:35'),(133,3,NULL,'2018-01-04',NULL,'HELP12','A',2018,'DCL',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 11:02:35'),(134,2,'M','2019-01-02',30,'first sight pup','P',2019,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 11:02:35'),(135,2,'F','2019-01-03',50,'first sight adult female','A',2019,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 11:02:35'),(136,2,'M','2019-01-04',NULL,'NULL','SA3',2019,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 11:02:35'),(137,2,'F','2019-01-04',NULL,'NULL','A',2019,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 11:02:35'),(138,4,'M','2019-01-04',NULL,'resight pup','P',2019,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 11:02:35'),(139,4,'F','2019-01-04',NULL,'resight adult female 1','A',2019,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 11:02:35'),(140,4,'M','2019-01-04',NULL,'resight male sa3','SA3',2019,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 11:02:35'),(141,4,'M','2019-01-04',NULL,'resight adule female 2','SA3',2019,'DCC',0,NULL,NULL,NULL,NULL,0,0,'2020-03-17 11:02:35');
UNLOCK TABLES;



--
-- Table structure for table `ObsUpload`
--

DROP TABLE IF EXISTS `ObsUpload`;
CREATE TABLE `ObsUpload` (
  `UploadID` int(11) NOT NULL,
  PRIMARY KEY (`UploadID`)
);






--
-- Table structure for table `UploadContainingObs`
--

DROP TABLE IF EXISTS `UploadContainingObs`;
CREATE TABLE `UploadContainingObs` (
  `UploadID` int(11) DEFAULT NULL,
  `ObservationID` int(11) NOT NULL,
  PRIMARY KEY (`ObservationID`),
  KEY `uploadContainingObs_ibfk_1` (`UploadID`),
  CONSTRAINT `uploadContainingObs_ibfk_1` FOREIGN KEY (`UploadID`) REFERENCES `ObsUpload` (`UploadID`),
  CONSTRAINT `uploadContainingObs_ibfk_2` FOREIGN KEY (`ObservationID`) REFERENCES `Observations` (`ObservationID`)
);







--
-- Table structure for table `FieldLeaderForObs`
--

DROP TABLE IF EXISTS `FieldLeaderForObs`;
CREATE TABLE `FieldLeaderForObs` (
  `ObservationID` int(11) DEFAULT NULL,
  `UserID` int(11) DEFAULT NULL,
  KEY `FieldLeaderForObs_ibfk_1` (`ObservationID`),
  KEY `FieldLeaderForObs_ibfk_2` (`UserID`),
  CONSTRAINT `FieldLeaderForObs_ibfk_1` FOREIGN KEY (`ObservationID`) REFERENCES `Observations` (`ObservationID`),
  CONSTRAINT `FieldLeaderForObs_ibfk_2` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`)
);

--
-- Dumping data for table `FieldLeaderForObs`
--

LOCK TABLES `FieldLeaderForObs` WRITE;
UNLOCK TABLES;






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
-- Dumping data for table `ObserveMarks`
--

LOCK TABLES `ObserveMarks` WRITE;
INSERT INTO `ObserveMarks` (`ObservationID`, `MarkID`) 
VALUES (3,1),(23,1),(43,1),(63,1),(83,1),(103,1),(123,1),(4,2),(24,2),(44,2),(64,2),(84,2),(104,2),(124,2),(5,3),(25,3),(45,3),(65,3),(85,3),(105,3),(125,3),(6,4),(26,4),(46,4),(66,4),(86,4),(106,4),(126,4),(7,5),(27,5),(47,5),(67,5),(87,5),(107,5),(127,5),(9,6),(29,6),(49,6),(69,6),(89,6),(109,6),(129,6),(10,7),(30,7),(50,7),(70,7),(90,7),(110,7),(130,7),(11,8),(31,8),(51,8),(71,8),(91,8),(111,8),(131,8),(12,9),(32,9),(52,9),(72,9),(92,9),(112,9),(132,9),(13,10),(33,10),(53,10),(73,10),(93,10),(113,10),(133,10),(14,11),(18,11),(34,11),(38,11),(54,11),(58,11),(74,11),(78,11),(94,11),(98,11),(114,11),(118,11),(134,11),(138,11),(15,12),(35,12),(55,12),(75,12),(95,12),(115,12),(135,12),(16,13),(36,13),(56,13),(76,13),(96,13),(116,13),(136,13),(17,14),(37,14),(57,14),(77,14),(97,14),(117,14),(137,14),(19,15),(39,15),(59,15),(79,15),(99,15),(119,15),(139,15),(20,16),(40,16),(60,16),(80,16),(100,16),(120,16),(140,16),(21,17),(41,17),(61,17),(81,17),(101,17),(121,17),(141,17);
UNLOCK TABLES;






--
-- Table structure for table `Measurements`
--

DROP TABLE IF EXISTS `Measurements`;
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
);

--
-- Dumping data for table `Measurements`
--

LOCK TABLES `Measurements` WRITE;
INSERT INTO `Measurements` (`MeasurementID`, `ObservationID`, `AuxillaryGirth`, `AnimalMass`, `TotalMass`, `CurvilinearLength`, `StandardLength`) VALUES (1,14,3.00,4.00,5.00,2.00,1.00),(2,15,4.00,5.00,6.00,3.00,2.00),(3,34,3.00,4.00,5.00,2.00,1.00),(4,35,4.00,5.00,6.00,3.00,2.00),(5,54,3.00,4.00,5.00,2.00,1.00),(6,55,4.00,5.00,6.00,3.00,2.00),(7,74,3.00,4.00,5.00,2.00,1.00),(8,75,4.00,5.00,6.00,3.00,2.00),(9,94,3.00,4.00,5.00,2.00,1.00),(10,95,4.00,5.00,6.00,3.00,2.00),(11,114,3.00,4.00,5.00,2.00,1.00),(12,115,4.00,5.00,6.00,3.00,2.00),(13,134,3.00,4.00,5.00,2.00,1.00),(14,135,4.00,5.00,6.00,3.00,2.00);
UNLOCK TABLES;







--
-- Table structure for table `Tags`
--

DROP TABLE IF EXISTS `Tags`;
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
);

--
-- Dumping data for table `Tags`
--

LOCK TABLES `Tags` WRITE;
INSERT INTO `Tags` (`TagNumber`, `TagColor`, `TagPosition`, `TagDate`, `TagSeal`, `isLost`) VALUES ('IWOT1','unknown','B','2019-01-02',14,0),('IWOT2','unknown','B','2019-01-02',14,0),('IWOT3','unknown','B','2019-01-03',15,0),('IWOT4','unknown','R','2019-01-04',16,0),('IWOT5','unknown','B','2019-01-04',17,0),('W16_','unknown',NULL,'2017-11-13',2,0),('WP772','unknown','R','2017-12-30',3,0);
UNLOCK TABLES;







--
-- Table structure for table `Seals`
--

DROP TABLE IF EXISTS `Seals`;
CREATE TABLE `Seals` (
  `SealID` int(11) NOT NULL AUTO_INCREMENT,
  `ObservationID` int(11) NOT NULL,
  `Sex` varchar(1) DEFAULT NULL,
  `isDeprecated` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`SealID`),
  KEY `ObservationID` (`ObservationID`),
  CONSTRAINT `seals_ibfk_1` FOREIGN KEY (`ObservationID`) REFERENCES `Observations` (`ObservationID`)
);

--
-- Dumping data for table `Seals`
--

LOCK TABLES `Seals` WRITE;
INSERT INTO `Seals` (`SealID`, `ObservationID`, `Sex`, `isDeprecated`) VALUES (1,2,'M',0),(2,3,'M',0),(3,4,'M',0),(4,5,NULL,0),(5,6,NULL,0),(6,7,NULL,0),(7,9,NULL,0),(8,10,NULL,0),(9,11,'M',0),(10,12,NULL,0),(11,13,NULL,0),(12,14,'M',0),(13,15,'F',0),(14,16,'M',0),(15,17,'F',0),(16,19,'F',0),(17,20,'M',0),(18,21,'M',0);
UNLOCK TABLES;







--
-- Table structure for table `SealPictures`
--

DROP TABLE IF EXISTS `SealPictures`;
CREATE TABLE `SealPictures` (
  `SealID` int(11) DEFAULT NULL,
  `ObsID` int(11) DEFAULT NULL,
  `PictureURL` varchar(50) NOT NULL,
  PRIMARY KEY (`PictureURL`),
  KEY `obsPictures_ibfk_1` (`ObsID`),
  KEY `sealPictures_ibfk_1` (`SealID`),
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
-- Dumping data for table `ObserveSeal`
--

LOCK TABLES `ObserveSeal` WRITE;
INSERT INTO `ObserveSeal` (`ObservationID`, `SealID`) VALUES (2,1),(22,1),(42,1),(62,1),(82,1),(102,1),(122,1),(3,2),(8,2),(23,2),(28,2),(43,2),(48,2),(63,2),(68,2),(83,2),(88,2),(103,2),(108,2),(123,2),(128,2),(4,3),(24,3),(44,3),(64,3),(84,3),(104,3),(124,3),(5,4),(25,4),(45,4),(65,4),(85,4),(105,4),(125,4),(6,5),(26,5),(46,5),(66,5),(86,5),(106,5),(126,5),(7,6),(27,6),(47,6),(67,6),(87,6),(107,6),(127,6),(9,7),(29,7),(49,7),(69,7),(89,7),(109,7),(129,7),(10,8),(30,8),(50,8),(70,8),(90,8),(110,8),(130,8),(11,9),(31,9),(51,9),(71,9),(91,9),(111,9),(131,9),(12,10),(32,10),(52,10),(72,10),(92,10),(112,10),(132,10),(13,11),(33,11),(53,11),(73,11),(93,11),(113,11),(133,11),(14,12),(18,12),(34,12),(38,12),(54,12),(58,12),(74,12),(78,12),(94,12),(98,12),(114,12),(118,12),(134,12),(138,12),(15,13),(35,13),(55,13),(75,13),(95,13),(115,13),(135,13),(16,14),(36,14),(56,14),(76,14),(96,14),(116,14),(136,14),(17,15),(37,15),(57,15),(77,15),(97,15),(117,15),(137,15),(19,16),(39,16),(59,16),(79,16),(99,16),(119,16),(139,16),(20,17),(40,17),(60,17),(80,17),(100,17),(120,17),(140,17),(21,18),(41,18),(61,18),(81,18),(101,18),(121,18),(141,18);
UNLOCK TABLES;






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
-- Dumping data for table `ObserveTags`
--

LOCK TABLES `ObserveTags` WRITE;
INSERT INTO `ObserveTags` (`OTAG_ID`, `ObservationID`, `TagNumber`) 
VALUES (1,2,'W16_'),(2,3,'WP772'),(3,8,'WP772'),(4,14,'IWOT1'),(5,14,'IWOT2'),(6,15,'IWOT3'),(7,16,'IWOT4'),(8,17,'IWOT5'),(9,22,'W16_'),(10,23,'WP772'),(11,28,'WP772'),(12,34,'IWOT1'),(13,34,'IWOT2'),(14,35,'IWOT3'),(15,36,'IWOT4'),(16,37,'IWOT5'),(17,42,'W16_'),(18,43,'WP772'),(19,48,'WP772'),(20,54,'IWOT1'),(21,54,'IWOT2'),(22,55,'IWOT3'),(23,56,'IWOT4'),(24,57,'IWOT5'),(25,62,'W16_'),(26,63,'WP772'),(27,68,'WP772'),(28,74,'IWOT1'),(29,74,'IWOT2'),(30,75,'IWOT3'),(31,76,'IWOT4'),(32,77,'IWOT5'),(33,82,'W16_'),(34,83,'WP772'),(35,88,'WP772'),(36,94,'IWOT1'),(37,94,'IWOT2'),(38,95,'IWOT3'),(39,96,'IWOT4'),(40,97,'IWOT5'),(41,102,'W16_'),(42,103,'WP772'),(43,108,'WP772'),(44,114,'IWOT1'),(45,114,'IWOT2'),(46,115,'IWOT3'),(47,116,'IWOT4'),(48,117,'IWOT5'),(49,122,'W16_'),(50,123,'WP772'),(51,128,'WP772'),(52,134,'IWOT1'),(53,134,'IWOT2'),(54,135,'IWOT3'),(55,136,'IWOT4'),(56,137,'IWOT5');
UNLOCK TABLES;



--
-- Table structure for table `StagedObservations`
--

DROP TABLE IF EXISTS `StagedObservations`;
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
);









