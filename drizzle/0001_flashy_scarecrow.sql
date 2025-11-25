CREATE TABLE `certifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`badgeName` varchar(255) NOT NULL,
	`pillarId` int NOT NULL,
	`vosRole` varchar(50) NOT NULL,
	`certificateUrl` text,
	`awardedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `certifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `maturityAssessments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`level` int NOT NULL,
	`assessmentData` json,
	`assessedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `maturityAssessments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pillars` (
	`id` int AUTO_INCREMENT NOT NULL,
	`pillarNumber` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`targetMaturityLevel` int NOT NULL,
	`duration` varchar(50),
	`content` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `pillars_id` PRIMARY KEY(`id`),
	CONSTRAINT `pillars_pillarNumber_unique` UNIQUE(`pillarNumber`)
);
--> statement-breakpoint
CREATE TABLE `progress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`pillarId` int NOT NULL,
	`status` enum('not_started','in_progress','completed') NOT NULL DEFAULT 'not_started',
	`completionPercentage` int NOT NULL DEFAULT 0,
	`lastAccessed` timestamp NOT NULL DEFAULT (now()),
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `progress_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quizQuestions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`pillarId` int NOT NULL,
	`questionNumber` int NOT NULL,
	`questionType` enum('multiple_choice','scenario_based') NOT NULL,
	`category` varchar(100) NOT NULL,
	`questionText` text NOT NULL,
	`options` json,
	`correctAnswer` varchar(10) NOT NULL,
	`points` int NOT NULL DEFAULT 4,
	`feedback` json,
	`roleAdaptations` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `quizQuestions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quizResults` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`pillarId` int NOT NULL,
	`score` int NOT NULL,
	`categoryScores` json,
	`answers` json,
	`feedback` json,
	`passed` boolean NOT NULL DEFAULT false,
	`attemptNumber` int NOT NULL DEFAULT 1,
	`completedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `quizResults_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `resources` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`resourceType` enum('kpi_sheet','template','framework','guide','playbook') NOT NULL,
	`fileUrl` text NOT NULL,
	`pillarId` int,
	`vosRole` varchar(50),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `resources_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `vosRole` enum('Sales','CS','Marketing','Product','Executive','VE');--> statement-breakpoint
ALTER TABLE `users` ADD `maturityLevel` int DEFAULT 0 NOT NULL;