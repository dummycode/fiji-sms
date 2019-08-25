CREATE TABLE contact (
	`id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(256) NOT NULL,
  `phone_number` VARCHAR(256) NOT NULL,
	`created_at` DATETIME(3) NOT NULL,
	`deleted_at` DATETIME(3),
	PRIMARY KEY (id)
);

CREATE TABLE user (
	`id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(256) NOT NULL,
  `password` VARCHAR(256) NOT NULL,
  `email` VARCHAR(256),
	`created_at` DATETIME(3) NOT NULL,
	`deleted_at` DATETIME(3),
	PRIMARY KEY (id)
);

CREATE TABLE message (
	`id` INT NOT NULL AUTO_INCREMENT,
  `content` VARCHAR(160) NOT NULL,
	`created_at` DATETIME(3) NOT NULL,
	`deleted_at` DATETIME(3),
	PRIMARY KEY (id)
);
