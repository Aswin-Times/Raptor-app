CREATE TABLE `chatMessages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`incidentId` int NOT NULL,
	`role` enum('user','assistant') NOT NULL,
	`content` text NOT NULL,
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `chatMessages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `emergencyContacts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`state` varchar(50) NOT NULL,
	`serviceType` enum('ambulance','police','fire','trauma_centre') NOT NULL,
	`name` varchar(255) NOT NULL,
	`phone` varchar(20) NOT NULL,
	`distance` decimal(5,2),
	`eta` varchar(50),
	`level` varchar(50),
	`differentiator` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `emergencyContacts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `incidents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`triageLevel` enum('CRITICAL','SERIOUS','MINOR') NOT NULL,
	`location` text,
	`latitude` decimal(10,8),
	`longitude` decimal(11,8),
	`injuryDescription` text,
	`incidentSummary` text,
	`language` varchar(10) DEFAULT 'en',
	`dispatchSubmitted` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `incidents_id` PRIMARY KEY(`id`)
);
