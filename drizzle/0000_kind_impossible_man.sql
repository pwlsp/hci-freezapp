CREATE TABLE `freezers` (
	`code` text NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `freezers_code_unique` ON `freezers` (`code`);--> statement-breakpoint
CREATE TABLE `members` (
	`member_id` text PRIMARY KEY NOT NULL,
	`freezer_code` text NOT NULL,
	`nickname` text NOT NULL,
	`is_deleted` integer,
	FOREIGN KEY (`freezer_code`) REFERENCES `freezers`(`code`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `uq-constraint-nickname-freezer_code` ON `members` (`member_id`,`freezer_code`);--> statement-breakpoint
CREATE TABLE `product_owners` (
	`product_id` integer NOT NULL,
	`member_id` text NOT NULL,
	PRIMARY KEY(`product_id`, `member_id`),
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`member_id`) REFERENCES `members`(`member_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`freezer_code` text NOT NULL,
	`name` text NOT NULL,
	`expiration_date` integer,
	`category` text,
	`quantity` integer NOT NULL,
	`unit` text NOT NULL,
	FOREIGN KEY (`freezer_code`) REFERENCES `freezers`(`code`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "ck-check-negative-quantity" CHECK("products"."quantity" >= 0)
);
