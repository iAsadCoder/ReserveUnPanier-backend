-- MySQL dump 10.13  Distrib 8.3.0, for macos14.2 (x86_64)
--
-- Host: localhost    Database: 2Good2Waste
-- ------------------------------------------------------
-- Server version	8.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin_actions`
--

DROP TABLE IF EXISTS `admin_actions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin_actions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `admin_id` int NOT NULL,
  `action` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `target_id` int DEFAULT NULL,
  `target_type` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `status` tinyint NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin_actions`
--

LOCK TABLES `admin_actions` WRITE;
/*!40000 ALTER TABLE `admin_actions` DISABLE KEYS */;
INSERT INTO `admin_actions` VALUES (1,1,'approve',1,'vendor',1,'2024-07-15 23:02:51'),(2,2,'reject',3,'mystery_box',2,'2024-07-15 23:02:51'),(3,1,'edit',2,'vendor',1,'2024-07-15 23:02:51'),(4,3,'delete',5,'coupon',1,'2024-07-15 23:02:51'),(5,2,'create',NULL,'banner',1,'2024-07-15 23:02:51');
/*!40000 ALTER TABLE `admin_actions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `admins`
--

DROP TABLE IF EXISTS `admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admins` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone_number` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `profile_image` blob,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admins`
--

LOCK TABLES `admins` WRITE;
/*!40000 ALTER TABLE `admins` DISABLE KEYS */;
INSERT INTO `admins` VALUES (1,'Ike','Admin One','admin1@example.com','1111111111','$2b$10$0FDCfFcyavrxgoDMQqvGbOaREahvBWYgHcDAdkNEaILZmnUCdhuXu',NULL,'2024-07-15 21:51:50','2024-07-15 21:51:50'),(2,'admin2','Admin Two','admin2@example.com','2222222222','$2b$10$0FDCfFcyavrxgoDMQqvGbOaREahvBWYgHcDAdkNEaILZmnUCdhuXu',NULL,'2024-07-15 21:51:50','2024-07-15 21:51:50'),(3,'admin3','Admin Three','admin3@example.com','3333333333','$2b$10$rWqPtTPMMKbn2Lnl2G6Z9.sQPoiVEmD06kD59f6l92DxPuOe6eIcG',NULL,'2024-07-15 21:51:50','2024-07-15 21:51:50');
/*!40000 ALTER TABLE `admins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `banners`
--

DROP TABLE IF EXISTS `banners`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `banners` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `image_url` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `status` tinyint NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `banners`
--

LOCK TABLES `banners` WRITE;
/*!40000 ALTER TABLE `banners` DISABLE KEYS */;
INSERT INTO `banners` VALUES (1,'Summer Sale','banner.jpg',1,'2024-07-23 04:07:07','2024-07-23 04:11:12'),(2,'New Promotion','banner.jpg',1,'2024-07-23 04:08:33','2024-07-23 04:11:18');
/*!40000 ALTER TABLE `banners` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `countries`
--

DROP TABLE IF EXISTS `countries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `countries` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `country_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `country_code` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `flag_image` blob,
  `emoji` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `currency` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `currency_code` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` tinyint NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=192 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `countries`
--

LOCK TABLES `countries` WRITE;
/*!40000 ALTER TABLE `countries` DISABLE KEYS */;
INSERT INTO `countries` VALUES (1,'Afghanistan','AF',NULL,'🇦🇫','Afghan Afghani','AFN',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(2,'Albania','AL',NULL,'🇦🇱','Albanian Lek','ALL',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(3,'Algeria','DZ',NULL,'🇩🇿','Algerian Dinar','DZD',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(4,'Andorra','AD',NULL,'🇦🇩','Euro','EUR',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(5,'Angola','AO',NULL,'🇦🇴','Angolan Kwanza','AOA',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(6,'Antigua and Barbuda','AG',NULL,'🇦🇬','East Caribbean Dollar','XCD',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(7,'Argentina','AR',NULL,'🇦🇷','Argentine Peso','ARS',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(8,'Armenia','AM',NULL,'🇦🇲','Armenian Dram','AMD',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(9,'Australia','AU',NULL,'🇦🇺','Australian Dollar','AUD',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(10,'Austria','AT',NULL,'🇦🇹','Euro','EUR',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(11,'Azerbaijan','AZ',NULL,'🇦🇿','Azerbaijani Manat','AZN',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(12,'Bahamas','BS',NULL,'🇧🇸','Bahamian Dollar','BSD',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(13,'Bahrain','BH',NULL,'🇧🇭','Bahraini Dinar','BHD',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(14,'Bangladesh','BD',NULL,'🇧🇩','Bangladeshi Taka','BDT',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(15,'Barbados','BB',NULL,'🇧🇧','Barbadian Dollar','BBD',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(16,'Belarus','BY',NULL,'🇧🇾','Belarusian Ruble','BYN',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(17,'Belgium','BE',NULL,'🇧🇪','Euro','EUR',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(18,'Belize','BZ',NULL,'🇧🇿','Belize Dollar','BZD',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(19,'Benin','BJ',NULL,'🇧🇯','West African CFA Franc','XOF',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(20,'Bhutan','BT',NULL,'🇧🇹','Bhutanese Ngultrum','BTN',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(21,'Bolivia','BO',NULL,'🇧🇴','Bolivian Boliviano','BOB',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(22,'Bosnia and Herzegovina','BA',NULL,'🇧🇦','Bosnia-Herzegovina Convertible Mark','BAM',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(23,'Botswana','BW',NULL,'🇧🇼','Botswana Pula','BWP',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(24,'Brazil','BR',NULL,'🇧🇷','Brazilian Real','BRL',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(25,'Brunei','BN',NULL,'🇧🇳','Brunei Dollar','BND',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(26,'Bulgaria','BG',NULL,'🇧🇬','Bulgarian Lev','BGN',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(27,'Burkina Faso','BF',NULL,'🇧🇫','West African CFA Franc','XOF',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(28,'Burundi','BI',NULL,'🇧🇮','Burundian Franc','BIF',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(29,'Cabo Verde','CV',NULL,'🇨🇻','Cape Verdean Escudo','CVE',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(30,'Cambodia','KH',NULL,'🇰🇭','Cambodian Riel','KHR',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(31,'Cameroon','CM',NULL,'🇨🇲','Central African CFA Franc','XAF',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(32,'Canada','CA',NULL,'🇨🇦','Canadian Dollar','CAD',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(33,'Central African Republic','CF',NULL,'🇨🇫','Central African CFA Franc','XAF',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(34,'Chad','TD',NULL,'🇹🇩','Chadian Franc','CDF',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(35,'Chile','CL',NULL,'🇨🇱','Chilean Peso','CLP',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(36,'China','CN',NULL,'🇨🇳','Chinese Yuan','CNY',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(37,'Colombia','CO',NULL,'🇨🇴','Colombian Peso','COP',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(38,'Comoros','KM',NULL,'🇰🇲','Comorian Franc','KMF',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(39,'Congo, Democratic Republic of the','CD',NULL,'🇨🇩','Congolese Franc','CDF',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(40,'Congo, Republic of the','CG',NULL,'🇨🇬','Central African CFA Franc','XAF',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(41,'Costa Rica','CR',NULL,'🇨🇷','Costa Rican Colón','CRC',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(42,'Croatia','HR',NULL,'🇭🇷','Croatian Kuna','HRK',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(43,'Cuba','CU',NULL,'🇨🇺','Cuban Peso','CUP',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(44,'Cyprus','CY',NULL,'🇨🇾','Euro','EUR',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(45,'Czech Republic','CZ',NULL,'🇨🇿','Czech Koruna','CZK',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(46,'Denmark','DK',NULL,'🇩🇰','Danish Krone','DKK',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(47,'Djibouti','DJ',NULL,'🇩🇯','Djiboutian Franc','DJF',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(48,'Dominica','DM',NULL,'🇩🇲','East Caribbean Dollar','XCD',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(49,'Dominican Republic','DO',NULL,'🇩🇴','Dominican Peso','DOP',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(50,'Ecuador','EC',NULL,'🇪🇨','United States Dollar','USD',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(51,'Egypt','EG',NULL,'🇪🇬','Egyptian Pound','EGP',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(52,'El Salvador','SV',NULL,'🇸🇻','United States Dollar','USD',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(53,'Equatorial Guinea','GQ',NULL,'🇬🇶','Central African CFA Franc','XAF',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(54,'Eritrea','ER',NULL,'🇪🇷','Eritrean Nakfa','ERN',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(55,'Estonia','EE',NULL,'🇪🇪','Euro','EUR',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(56,'Eswatini','SZ',NULL,'🇸🇿','Swazi Lilangeni','SZL',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(57,'Ethiopia','ET',NULL,'🇪🇹','Ethiopian Birr','ETB',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(58,'Fiji','FJ',NULL,'🇫🇯','Fijian Dollar','FJD',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(59,'Finland','FI',NULL,'🇫🇮','Euro','EUR',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(60,'France','FR',NULL,'🇫🇷','Euro','EUR',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(61,'Gabon','GA',NULL,'🇬🇦','Gabonese CFA Franc','XAF',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(62,'Gambia','GM',NULL,'🇬🇲','Gambian Dalasi','GMD',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(63,'Georgia','GE',NULL,'🇬🇪','Georgian Lari','GEL',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(64,'Germany','DE',NULL,'🇩🇪','Euro','EUR',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(65,'Ghana','GH',NULL,'🇬🇭','Ghanaian Cedi','GHS',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(66,'Greece','GR',NULL,'🇬🇷','Euro','EUR',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(67,'Grenada','GD',NULL,'🇬🇩','East Caribbean Dollar','XCD',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(68,'Guatemala','GT',NULL,'🇬🇹','Guatemalan Quetzal','GTQ',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(69,'Guinea','GN',NULL,'🇬🇳','Guinean Franc','GNF',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(70,'Guinea-Bissau','GW',NULL,'🇬🇼','West African CFA Franc','XOF',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(71,'Guyana','GY',NULL,'🇬🇾','Guyanese Dollar','GYD',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(72,'Haiti','HT',NULL,'🇭🇹','Haitian Gourde','HTG',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(73,'Honduras','HN',NULL,'🇭🇳','Honduran Lempira','HNL',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(74,'Hungary','HU',NULL,'🇭🇺','Hungarian Forint','HUF',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(75,'Iceland','IS',NULL,'🇮🇸','Icelandic Króna','ISK',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(76,'India','IN',NULL,'🇮🇳','Indian Rupee','INR',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(77,'Indonesia','ID',NULL,'🇮🇩','Indonesian Rupiah','IDR',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(78,'Iran','IR',NULL,'🇮🇷','Iranian Rial','IRR',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(79,'Iraq','IQ',NULL,'🇮🇶','Iraqi Dinar','IQD',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(80,'Ireland','IE',NULL,'🇮🇪','Euro','EUR',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(81,'Israel','IL',NULL,'🇮🇱','Israeli New Shekel','ILS',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(82,'Italy','IT',NULL,'🇮🇹','Euro','EUR',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(83,'Jamaica','JM',NULL,'🇯🇲','Jamaican Dollar','JMD',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(84,'Japan','JP',NULL,'🇯🇵','Japanese Yen','JPY',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(85,'Jordan','JO',NULL,'🇯🇴','Jordanian Dinar','JOD',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(86,'Kazakhstan','KZ',NULL,'🇰🇿','Kazakhstani Tenge','KZT',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(87,'Kenya','KE',NULL,'🇰🇪','Kenyan Shilling','KES',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(88,'Kiribati','KI',NULL,'🇰🇮','Australian Dollar','AUD',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(89,'Kuwait','KW',NULL,'🇰🇼','Kuwaiti Dinar','KWD',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(90,'Kyrgyzstan','KG',NULL,'🇰🇬','Kyrgyzstani Som','KGS',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(91,'Laos','LA',NULL,'🇱🇦','Lao Kip','LAK',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(92,'Latvia','LV',NULL,'🇱🇻','Euro','EUR',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(93,'Lebanon','LB',NULL,'🇱🇧','Lebanese Pound','LBP',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(94,'Lesotho','LS',NULL,'🇱🇸','Lesotho Loti','LSL',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(95,'Liberia','LR',NULL,'🇱🇷','Liberian Dollar','LRD',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(96,'Libya','LY',NULL,'🇱🇾','Libyan Dinar','LYD',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(97,'Liechtenstein','LI',NULL,'🇱🇮','Swiss Franc','CHF',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(98,'Lithuania','LT',NULL,'🇱🇹','Euro','EUR',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(99,'Luxembourg','LU',NULL,'🇱🇺','Euro','EUR',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(100,'Madagascar','MG',NULL,'🇲🇬','Malagasy Ariary','MGA',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(101,'Malawi','MW',NULL,'🇲🇼','Malawian Kwacha','MWK',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(102,'Malaysia','MY',NULL,'🇲🇾','Malaysian Ringgit','MYR',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(103,'Maldives','MV',NULL,'🇲🇻','Maldivian Rufiyaa','MVR',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(104,'Mali','ML',NULL,'🇲🇱','West African CFA Franc','XOF',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(105,'Malta','MT',NULL,'🇲🇹','Euro','EUR',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(106,'Marshall Islands','MH',NULL,'🇲🇭','United States Dollar','USD',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(107,'Mauritania','MR',NULL,'🇲🇷','Mauritanian Ouguiya','MRU',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(108,'Mauritius','MU',NULL,'🇲🇺','Mauritian Rupee','MUR',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(109,'Mexico','MX',NULL,'🇲🇽','Mexican Peso','MXN',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(110,'Micronesia','FM',NULL,'🇫🇲','United States Dollar','USD',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(111,'Moldova','MD',NULL,'🇲🇩','Moldovan Leu','MDL',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(112,'Monaco','MC',NULL,'🇲🇨','Euro','EUR',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(113,'Mongolia','MN',NULL,'🇲🇳','Mongolian Tögrög','MNT',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(114,'Montenegro','ME',NULL,'🇲🇪','Euro','EUR',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(115,'Morocco','MA',NULL,'🇲🇦','Moroccan Dirham','MAD',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(116,'Mozambique','MZ',NULL,'🇲🇿','Mozambican Metical','MZN',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(117,'Myanmar','MM',NULL,'🇲🇲','Myanmar Kyat','MMK',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(118,'Namibia','NA',NULL,'🇳🇦','Namibian Dollar','NAD',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(119,'Nauru','NR',NULL,'🇳🇷','Australian Dollar','AUD',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(120,'Nepal','NP',NULL,'🇳🇵','Nepalese Rupee','NPR',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(121,'Netherlands','NL',NULL,'🇳🇱','Euro','EUR',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(122,'New Zealand','NZ',NULL,'🇳🇿','New Zealand Dollar','NZD',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(123,'Nicaragua','NI',NULL,'🇳🇮','Nicaraguan Córdoba','NIO',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(124,'Niger','NE',NULL,'🇳🇪','West African CFA Franc','XOF',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(125,'Nigeria','NG',NULL,'🇳🇬','Nigerian Naira','NGN',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(126,'North Macedonia','MK',NULL,'🇲🇰','Macedonian Denar','MKD',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(127,'Norway','NO',NULL,'🇳🇴','Norwegian Krone','NOK',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(128,'Oman','OM',NULL,'🇴🇲','Omani Rial','OMR',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(129,'Pakistan','PK',NULL,'🇵🇰','Pakistani Rupee','PKR',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(130,'Palau','PW',NULL,'🇵🇼','United States Dollar','USD',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(131,'Panama','PA',NULL,'🇵🇦','Panamanian Balboa','PAB',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(132,'Papua New Guinea','PG',NULL,'🇵🇬','Papua New Guinean Kina','PGK',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(133,'Paraguay','PY',NULL,'🇵🇾','Paraguayan Guaraní','PYG',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(134,'Peru','PE',NULL,'🇵🇪','Peruvian Sol','PEN',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(135,'Philippines','PH',NULL,'🇵🇭','Philippine Peso','PHP',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(136,'Poland','PL',NULL,'🇵🇱','Polish Zloty','PLN',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(137,'Portugal','PT',NULL,'🇵🇹','Euro','EUR',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(138,'Qatar','QA',NULL,'🇶🇦','Qatari Rial','QAR',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(139,'Romania','RO',NULL,'🇷🇴','Romanian Leu','RON',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(140,'Russia','RU',NULL,'🇷🇺','Russian Ruble','RUB',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(141,'Rwanda','RW',NULL,'🇷🇼','Rwandan Franc','RWF',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(142,'Saint Kitts and Nevis','KN',NULL,'🇰🇳','East Caribbean Dollar','XCD',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(143,'Saint Lucia','LC',NULL,'🇱🇨','East Caribbean Dollar','XCD',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(144,'Saint Vincent and the Grenadines','VC',NULL,'🇻🇨','East Caribbean Dollar','XCD',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(145,'Samoa','WS',NULL,'🇼🇸','Samoan Tala','WST',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(146,'San Marino','SM',NULL,'🇸🇲','Euro','EUR',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(147,'Saudi Arabia','SA',NULL,'🇸🇦','Saudi Riyal','SAR',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(148,'Senegal','SN',NULL,'🇸🇳','West African CFA Franc','XOF',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(149,'Serbia','RS',NULL,'🇷🇸','Serbian Dinar','RSD',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(150,'Seychelles','SC',NULL,'🇸🇨','Seychellois Rupee','SCR',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(151,'Sierra Leone','SL',NULL,'🇸🇱','Sierra Leonean Leone','SLL',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(152,'Singapore','SG',NULL,'🇸🇬','Singapore Dollar','SGD',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(153,'Slovakia','SK',NULL,'🇸🇰','Euro','EUR',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(154,'Slovenia','SI',NULL,'🇸🇮','Euro','EUR',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(155,'Solomon Islands','SB',NULL,'🇸🇧','Solomon Islands Dollar','AUD',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(156,'Somalia','SO',NULL,'🇸🇴','Somali Shilling','SOS',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(157,'South Africa','ZA',NULL,'🇿🇦','South African Rand','ZAR',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(158,'South Korea','KR',NULL,'🇰🇷','South Korean Won','KRW',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(159,'South Sudan','SS',NULL,'🇸🇸','South Sudanese Pound','SSP',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(160,'Spain','ES',NULL,'🇪🇸','Euro','EUR',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(161,'Sri Lanka','LK',NULL,'🇱🇰','Sri Lankan Rupee','LKR',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(162,'Sudan','SD',NULL,'🇸🇩','Sudanese Pound','SDG',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(163,'Suriname','SR',NULL,'🇸🇷','Surinamese Dollar','SRD',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(164,'Sweden','SE',NULL,'🇸🇪','Swedish Krona','SEK',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(165,'Switzerland','CH',NULL,'🇨🇭','Swiss Franc','CHF',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(166,'Syria','SY',NULL,'🇸🇾','Syrian Pound','SYP',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(167,'Taiwan','TW',NULL,'🇹🇼','New Taiwan Dollar','TWD',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(168,'Tajikistan','TJ',NULL,'🇹🇯','Tajikistani Somoni','TJS',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(169,'Tanzania','TZ',NULL,'🇹🇿','Tanzanian Shilling','TZS',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(170,'Thailand','TH',NULL,'🇹🇭','Thai Baht','THB',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(171,'Togo','TG',NULL,'🇹🇬','West African CFA Franc','XOF',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(172,'Tonga','TO',NULL,'🇹🇴','Tongan Paʻanga','TOP',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(173,'Trinidad and Tobago','TT',NULL,'🇹🇹','Trinidad and Tobago Dollar','TTD',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(174,'Tunisia','TN',NULL,'🇹🇳','Tunisian Dinar','TND',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(175,'Turkey','TR',NULL,'🇹🇷','Turkish Lira','TRY',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(176,'Turkmenistan','TM',NULL,'🇹🇲','Turkmenistani Manat','TMT',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(177,'Tuvalu','TV',NULL,'🇹🇻','Australian Dollar','AUD',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(178,'Uganda','UG',NULL,'🇺🇬','Ugandan Shilling','UGX',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(179,'Ukraine','UA',NULL,'🇺🇦','Ukrainian Hryvnia','UAH',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(180,'United Arab Emirates','AE',NULL,'🇦🇪','United Arab Emirates Dirham','AED',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(181,'United Kingdom','GB',NULL,'🇬🇧','Pound Sterling','GBP',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(182,'United States','US',NULL,'🇺🇸','United States Dollar','USD',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(183,'Uruguay','UY',NULL,'🇺🇾','Uruguayan Peso','UYU',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(184,'Uzbekistan','UZ',NULL,'🇺🇿','Uzbekistani Som','UZS',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(185,'Vanuatu','VU',NULL,'🇻🇺','Vanuatu Vatu','VUV',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(186,'Vatican City','VA',NULL,'🇻🇦','Euro','EUR',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(187,'Venezuela','VE',NULL,'🇻🇪','Venezuelan Bolívar','VES',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(188,'Vietnam','VN',NULL,'🇻🇳','Vietnamese Dong','VND',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(189,'Yemen','YE',NULL,'🇾🇪','Yemeni Rial','YER',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(190,'Zambia','ZM',NULL,'🇿🇲','Zambian Kwacha','ZMW',1,'2024-07-15 21:35:18','2024-07-15 21:35:18'),(191,'Zimbabwe','ZW',NULL,'🇿🇼','Zimbabwean Dollar','ZWL',1,'2024-07-15 21:35:18','2024-07-15 21:35:18');
/*!40000 ALTER TABLE `countries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coupons`
--

DROP TABLE IF EXISTS `coupons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `coupons` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `discount` decimal(5,2) NOT NULL,
  `status` tinyint NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `expiry_date` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coupons`
--

LOCK TABLES `coupons` WRITE;
/*!40000 ALTER TABLE `coupons` DISABLE KEYS */;
INSERT INTO `coupons` VALUES (1,'REEE',5.00,1,'2024-07-15 23:03:32','2024-07-23 02:14:22','2024-07-26'),(3,'FREESHIP',5.00,1,'2024-07-15 23:03:32','2024-07-15 23:03:32',NULL),(4,'DISCOUNT15',15.00,0,'2024-07-15 23:03:32','2024-07-15 23:03:32',NULL),(5,'SPRINGSALE',25.00,1,'2024-07-15 23:03:32','2024-07-15 23:03:32',NULL);
/*!40000 ALTER TABLE `coupons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mystery_boxes`
--

DROP TABLE IF EXISTS `mystery_boxes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mystery_boxes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `vendor_id` bigint unsigned NOT NULL,
  `title` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `collection_time` time NOT NULL,
  `quantity` int NOT NULL,
  `status` tinyint NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `days_available` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `vendor_id` (`vendor_id`),
  CONSTRAINT `mystery_boxes_ibfk_1` FOREIGN KEY (`vendor_id`) REFERENCES `vendors` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mystery_boxes`
--

LOCK TABLES `mystery_boxes` WRITE;
/*!40000 ALTER TABLE `mystery_boxes` DISABLE KEYS */;
INSERT INTO `mystery_boxes` VALUES (1,1,'Mystery Box A',10.00,'A delightful selection of goodies.','10:00:00',100,1,'2024-07-15 21:53:58','2024-07-15 21:53:58','Monday,Tuesday,Wednesday'),(2,1,'Mystery Box B',15.00,'Special treats for food lovers.','12:00:00',50,0,'2024-07-15 21:53:58','2024-07-15 21:53:58','Monday,Tuesday'),(3,2,'Mystery Box C',20.00,'Surprise items from our bakery.','14:00:00',75,0,'2024-07-15 21:53:58','2024-07-15 21:53:58','Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday'),(4,10,'Restaurent Mystery Box',20.00,'A delightful selection of cuisine.','10:00:00',20,1,'2024-07-15 21:53:58','2024-07-15 21:53:58',NULL),(5,11,'Bakery Mystery Box',15.00,'Special treats for food lovers.','12:00:00',50,1,'2024-07-15 21:53:58','2024-07-15 21:53:58',NULL),(6,9,'Market Mystery Box',20.00,'Surprise items from our store.','14:00:00',75,1,'2024-07-15 21:53:58','2024-07-15 21:53:58',NULL);
/*!40000 ALTER TABLE `mystery_boxes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `customer_id` bigint unsigned NOT NULL,
  `mystery_box_id` bigint unsigned NOT NULL,
  `quantity` int NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('pending','completed','failed','approved') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `customer_id` (`customer_id`),
  KEY `mystery_box_id` (`mystery_box_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `users` (`id`),
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`mystery_box_id`) REFERENCES `mystery_boxes` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,1,1,2,40.00,'Order for two mystery boxes from Vendor A','pending','2024-07-15 22:58:56','2024-07-15 22:58:56'),(2,2,2,1,25.00,'Single mystery box order from Vendor B','completed','2024-07-15 22:58:56','2024-07-15 22:58:56'),(3,3,3,3,60.00,'Order for three mystery boxes from Vendor C','failed','2024-07-15 22:58:56','2024-07-15 22:58:56'),(4,1,2,1,25.00,'First mystery box from Vendor B','completed','2024-07-15 22:58:56','2024-07-15 22:58:56'),(5,2,1,5,100.00,'Five mystery boxes from Vendor A','pending','2024-07-15 22:58:56','2024-07-15 22:58:56'),(9,4,1,2,20.00,'ABC','completed','2024-07-24 05:17:23','2024-07-24 05:17:23'),(10,4,1,2,20.00,'ABC','completed','2024-07-24 20:50:03','2024-07-24 20:50:03');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sales`
--

DROP TABLE IF EXISTS `sales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sales` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `mystery_box_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `quantity_sold` int NOT NULL,
  `sold_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `mystery_box_id` (`mystery_box_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `sales_ibfk_1` FOREIGN KEY (`mystery_box_id`) REFERENCES `mystery_boxes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `sales_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sales`
--

LOCK TABLES `sales` WRITE;
/*!40000 ALTER TABLE `sales` DISABLE KEYS */;
INSERT INTO `sales` VALUES (13,1,1,2,'2024-07-16 11:30:25'),(14,2,1,1,'2024-07-16 11:30:25'),(15,1,3,3,'2024-07-16 11:30:25'),(16,3,1,1,'2024-07-16 11:30:25'),(17,2,2,5,'2024-07-16 11:30:25'),(18,2,3,2,'2024-07-16 11:30:25'),(19,1,4,2,'2024-07-24 20:50:03');
/*!40000 ALTER TABLE `sales` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transactions`
--

DROP TABLE IF EXISTS `transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transactions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `vendor_id` bigint unsigned NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `transaction_type` enum('credit','debit') COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `vendor_id` (`vendor_id`),
  CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`vendor_id`) REFERENCES `vendors` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transactions`
--

LOCK TABLES `transactions` WRITE;
/*!40000 ALTER TABLE `transactions` DISABLE KEYS */;
INSERT INTO `transactions` VALUES (1,1,20.00,'credit','2024-07-15 22:58:31'),(2,1,20.00,'debit','2024-07-15 22:58:31'),(3,2,200.00,'credit','2024-07-15 22:58:31'),(4,3,75.00,'debit','2024-07-15 22:58:31'),(5,1,20.00,'credit','2024-07-15 22:58:31'),(6,1,20.00,'credit','2024-07-24 20:50:03');
/*!40000 ALTER TABLE `transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone_number` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `profile_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `country_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `country_id` (`country_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`country_id`) REFERENCES `countries` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'johndoe','John Doe','johndoe@crystal.com','11111','$2b$10$0FDCfFcyavrxgoDMQqvGbOaREahvBWYgHcDAdkNEaILZmnUCdhuXu',NULL,1,'2024-07-15 21:43:51','2024-07-21 00:28:54'),(2,'janedoe','Jane Doe','jane@crystal.com','22222','1234',NULL,2,'2024-07-15 21:43:51','2024-07-21 00:28:20'),(3,'alicejohnson','Alice Johnson','alice.johnson@example.com','1122334455','$2b$10$0FDCfFcyavrxgoDMQqvGbOaREahvBWYgHcDAdkNEaILZmnUCdhuXu',NULL,3,'2024-07-15 21:43:51','2024-07-15 21:43:51'),(4,'iabc','abc','abc@aa.com','55555','$2b$10$jlOYSNQQcy8YSramRsk/e.a.n2cNFxBzbY3Z6/K1TOiUWHrOdPI5y',NULL,1,'2024-07-19 11:08:35','2024-07-19 11:08:35'),(5,'iabc2','abc5','abc@aa5.com','555559','$2b$10$ldNbM.jwk4Jsn9Wd6i60V.yB9avyAg/sqaJhpgwEoh3H1RQkixyk.',NULL,5,'2024-07-19 11:10:31','2024-07-19 12:36:09'),(10,'iabc2','abc2','abc@aa2.com','555552','1234',NULL,1,'2024-07-20 22:17:44','2024-07-20 22:17:44'),(11,'iabc2','abc2','abc@aa2.com','555552','$2b$10$HihdDXm93rdtvLAA7k0Fq.qXTGqfVVjRX1e958Co.fB81PbL8SmiO',NULL,1,'2024-07-21 00:44:59','2024-07-21 00:44:59'),(12,'iPAven','Paa raa','ipaaa@gmail.com','44444','$2b$10$EeBT53e197uXhzkn4I6Pp.KvTGE8k3Z2LorVFrpQJPOlXI.KC0Vc.',NULL,3,'2024-07-21 00:45:42','2024-07-21 02:58:32'),(13,'1111','raa raa raaa','ipaaa@gmail.com','44444','$2b$10$yx.IB1wvlup/M4uYpyMK6e6EfB.8/GBOnclrgiEAcoIzcZZ4sQgdO','1721571275327.jpeg',3,'2024-07-21 01:46:07','2024-07-21 14:14:35'),(14,'iFavan','Rock leee','icaven@gmail.com','33333333','$2b$10$0FDCfFcyavrxgoDMQqvGbOaREahvBWYgHcDAdkNEaILZmnUCdhuXu','1721570948074.jpeg',4,'2024-07-21 14:09:08','2024-07-21 14:09:08');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vendor_ratings`
--

DROP TABLE IF EXISTS `vendor_ratings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vendor_ratings` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `vendor_id` bigint unsigned NOT NULL,
  `customer_id` bigint unsigned NOT NULL,
  `rating` decimal(2,1) NOT NULL,
  `comment` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `vendor_id` (`vendor_id`),
  KEY `customer_id` (`customer_id`),
  CONSTRAINT `vendor_ratings_ibfk_1` FOREIGN KEY (`vendor_id`) REFERENCES `vendors` (`id`) ON DELETE CASCADE,
  CONSTRAINT `vendor_ratings_ibfk_2` FOREIGN KEY (`customer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `vendor_ratings_chk_1` CHECK (((`rating` >= 0) and (`rating` <= 5)))
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vendor_ratings`
--

LOCK TABLES `vendor_ratings` WRITE;
/*!40000 ALTER TABLE `vendor_ratings` DISABLE KEYS */;
INSERT INTO `vendor_ratings` VALUES (1,1,1,4.5,'Great service and delicious food!','2024-07-16 00:18:43'),(4,3,3,4.0,'Good selection of items, will come back!','2024-07-16 00:18:43'),(6,3,1,4.8,'Excellent quality and friendly staff.','2024-07-16 00:18:43'),(14,2,2,5.0,'Will definitely come back!','2024-07-16 11:25:00'),(15,2,2,5.0,'yes!','2024-07-16 11:25:23');
/*!40000 ALTER TABLE `vendor_ratings` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `after_rating_insert` AFTER INSERT ON `vendor_ratings` FOR EACH ROW BEGIN
    UPDATE vendors
    SET accumulated_rating = (
        SELECT AVG(r.rating)
        FROM vendor_ratings r
        WHERE r.vendor_id = NEW.vendor_id
    )
    WHERE id = NEW.vendor_id;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `after_rating_delete` AFTER DELETE ON `vendor_ratings` FOR EACH ROW BEGIN
    UPDATE vendors
    SET accumulated_rating = (
        SELECT AVG(r.rating)
        FROM vendor_ratings r
        WHERE r.vendor_id = OLD.vendor_id
    )
    WHERE id = OLD.vendor_id;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `vendor_restocks`
--

DROP TABLE IF EXISTS `vendor_restocks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vendor_restocks` (
  `vendor_id` bigint unsigned NOT NULL,
  `mystery_box_id` bigint unsigned NOT NULL,
  `restock_quantity` int NOT NULL,
  PRIMARY KEY (`vendor_id`,`mystery_box_id`),
  KEY `mystery_box_id` (`mystery_box_id`),
  CONSTRAINT `vendor_restocks_ibfk_1` FOREIGN KEY (`vendor_id`) REFERENCES `vendors` (`id`) ON DELETE CASCADE,
  CONSTRAINT `vendor_restocks_ibfk_2` FOREIGN KEY (`mystery_box_id`) REFERENCES `mystery_boxes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vendor_restocks`
--

LOCK TABLES `vendor_restocks` WRITE;
/*!40000 ALTER TABLE `vendor_restocks` DISABLE KEYS */;
INSERT INTO `vendor_restocks` VALUES (1,1,3),(1,2,10),(2,3,20),(3,2,15);
/*!40000 ALTER TABLE `vendor_restocks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vendor_types`
--

DROP TABLE IF EXISTS `vendor_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vendor_types` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `type_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vendor_types`
--

LOCK TABLES `vendor_types` WRITE;
/*!40000 ALTER TABLE `vendor_types` DISABLE KEYS */;
INSERT INTO `vendor_types` VALUES (1,'Restaurant'),(2,'Bakery'),(3,'Supermarket');
/*!40000 ALTER TABLE `vendor_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vendors`
--

DROP TABLE IF EXISTS `vendors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vendors` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone_number` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `banner_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `country_id` bigint unsigned NOT NULL,
  `vendor_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` tinyint NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `accumulated_rating` decimal(3,2) DEFAULT NULL,
  `vendor_type` bigint unsigned DEFAULT NULL,
  `available_balance` decimal(10,2) DEFAULT '0.00',
  `total_earnings` decimal(10,2) DEFAULT '0.00',
  `featured` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `country_id` (`country_id`),
  KEY `fk_vendor_type` (`vendor_type`),
  KEY `fk_vendor_user` (`user_id`),
  CONSTRAINT `fk_vendor_type` FOREIGN KEY (`vendor_type`) REFERENCES `vendor_types` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_vendor_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `vendors_ibfk_1` FOREIGN KEY (`country_id`) REFERENCES `countries` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vendors`
--

LOCK TABLES `vendors` WRITE;
/*!40000 ALTER TABLE `vendors` DISABLE KEYS */;
INSERT INTO `vendors` VALUES (1,1,'bobsburgers','Bob\'s Burgers','bob@example.com','1231231234','password123',NULL,1,'Bob\'s Burgers','123 Burger St',NULL,1,'2024-07-15 21:51:01','2024-07-15 21:51:01',4.50,1,0.00,0.00,0),(2,3,'sallysweets','Sally\'s Sweets','sally@example.com','4564564567','password123',NULL,2,'Sally\'s Sweets','456 Candy Ln',NULL,1,'2024-07-15 21:51:01','2024-07-15 21:51:01',5.00,2,0.00,0.00,0),(3,1,'mikesmeals','Mike\'s Meals','mike@example.com','7897897890','password123',NULL,3,'Mike\'s Meals','789 Dinner Dr',NULL,1,'2024-07-15 21:51:01','2024-07-15 21:51:01',4.40,3,0.00,0.00,0),(4,1,'icosco','Cosco Cash & Carry','coscomart@cosco.com','123-456-7890','hashed_password_here','aaa',182,'Cosco Cash & Carry','123 Main St, Santa Ana, CA 92660','aaaa',1,'2024-07-22 00:05:17','2024-07-22 00:05:17',4.50,3,0.00,0.00,0),(5,1,'iwallmart','Wallmart SuperStore','wallmart@wallmart.com','111-777-8888','1234','aaa',182,'Cosco Cash & Carry','123 Main St, Santa Ana, CA 92660','aaaa',1,'2024-07-22 00:14:41','2024-07-22 00:14:41',4.50,3,0.00,0.00,0),(6,1,'iBestway','Bestway Supermarket','bestway@bestway.com','123-456-7890','1234','aaa',182,'Bestway Supermarket','3109 Graham Rd, Falls Church, VA 22042, United States','aaaa',1,'2024-07-22 00:20:37','2024-07-22 00:20:37',4.50,1,0.00,0.00,0),(7,1,'Taphouse','Corktown Taphouse','corktowntaphouse@gmail.com','(919) 263-5906','1234','aaa',182,'Corktown Taphouse','1611 Michigan Avenue\r\nDetroit, MI 48216','aaaa',1,'2024-07-22 00:33:06','2024-07-22 00:33:06',4.50,1,0.00,0.00,0),(8,1,'DowntownNashville','Downtown Nashville Restaurant','DowntownNashville@gmail.com','615-291-8600','1234','aaa',182,'Downtown Nashville Restaurant','201 8th Avenue South Nashville, TN 37203','aaaa',1,'2024-07-22 00:36:20','2024-07-22 00:36:20',4.50,1,0.00,0.00,0),(9,1,'iKreyol','Kreyol Market','kreyolmarket@gmail.com','123-456-7890','1234','marketlogo',60,'Kreyol Market','123 Main St,France','marketImage',1,'2024-07-22 01:24:25','2024-07-22 01:24:25',4.00,3,0.00,0.00,0),(10,1,'ioley','Restaurant oley','oley@gmail.com','111-222-3333','1234','resLogo',60,'Restaurant oley','333 Main St, France','resImage',1,'2024-07-22 01:28:54','2024-07-22 01:28:54',4.50,1,0.00,0.00,0),(11,1,'ibakshop','The Bakery Shop','thebakeryshop@gmail.com','777-888-9999','1234','bakLogo',60,'The Bakery Shop','777 Main St, Santa Ana France','bakImage',1,'2024-07-22 02:04:03','2024-07-22 02:04:03',4.50,2,0.00,0.00,0),(18,3,'john doe','John Doe','john@example.com','+1234567890','$2b$10$CesYAaNY7OImlIh88NsbmOTLqBRMmv2eYgNom11AydinjvAGOsD3y','http://example.com/banner.jpg',1,'John\'s Cafe','123 Main Street, Anytown','http://example.com/vendor.jpg',0,NULL,'2024-07-24 03:55:02',NULL,1,0.00,0.00,0),(19,3,'john_doe','John Doe','john@example.com','+1234567890','$2b$10$tAcFAVqgsqFe01BnKjhq2eDVigmfWThskKmQqhUlogOb.kYBU3xZG','http://example.com/banner.jpg',1,'John\'s Cafe','123 Main Street, Anytown','http://example.com/vendor.jpg',0,NULL,NULL,NULL,1,0.00,0.00,0);
/*!40000 ALTER TABLE `vendors` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-07-27  5:39:23
