CREATE TABLE contact (
	`contact_id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(256) NOT NULL,
  `phone_number` VARCHAR(256) NOT NULL,
	`created_at` DATETIME(3) NOT NULL,
	`deleted_at` DATETIME(3) DEFAULT NULL,
	PRIMARY KEY (contact_id)
);

CREATE TABLE user (
	`user_id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(256) NOT NULL,
  `password` VARCHAR(256) NOT NULL,
  `email` VARCHAR(256),
  `is_admin` BOOLEAN NOT NULL,
	`created_at` DATETIME(3) NOT NULL,
	`deleted_at` DATETIME(3) DEFAULT NULL,
	PRIMARY KEY (user_id)
);

CREATE TABLE message (
	`message_id` INT NOT NULL AUTO_INCREMENT,
  `content` VARCHAR(160) NOT NULL,
  `created_by` INT NOT NULL,
	`created_at` DATETIME(3) NOT NULL,
	`deleted_at` DATETIME(3) DEFAULT NULL,
	CONSTRAINT fk_creator FOREIGN KEY (created_by) REFERENCES user(user_id) ON UPDATE CASCADE,
	PRIMARY KEY (message_id)
);

CREATE TABLE contact_group (
	`contact_group_id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(256) NOT NULL,
	`created_at` DATETIME(3) NOT NULL,
	`deleted_at` DATETIME(3) DEFAULT NULL,
	PRIMARY KEY (contact_group_id)
);

CREATE TABLE group_membership (
	`group_membership_id` INT NOT NULL AUTO_INCREMENT,
	`contact_group_id` INT NOT NULL,
	`contact_id` INT NOT NULL,
	`created_at` DATETIME(3) NOT NULL,
	`deleted_at` DATETIME(3) DEFAULT NULL,
	CONSTRAINT fk_contact_group FOREIGN KEY (contact_group_id) REFERENCES contact_group(contact_group_id) ON UPDATE CASCADE,
	CONSTRAINT fk_contact FOREIGN KEY (contact_id) REFERENCES contact(contact_id) ON UPDATE CASCADE,
	PRIMARY KEY (group_membership_id)
);
