INSERT INTO freezers (code, name) VALUES ("ABCD", "New freezer");

INSERT INTO members (member_id, freezer_code, nickname, is_deleted) VALUES ("A", "ABCD", "T1", 0);
INSERT INTO members (member_id, freezer_code, nickname, is_deleted) VALUES ("B", "ABCD", "T2", 0);
INSERT INTO members (member_id, freezer_code, nickname, is_deleted) VALUES ("C", "ABCD", "T3", 0);

INSERT INTO products (product_id, freezer_code, name, category, quantity, unit) VALUES (1, "ABCD", "Japko", "fruit", 1, "pcs");
INSERT INTO products (product_id, freezer_code, name, category, quantity, unit) VALUES (2, "ABCD", "Grucha", "fruit", 3, "pcs");

INSERT INTO product_owners (product_id, member_id) VALUES (1, "A");
INSERT INTO product_owners (product_id, member_id) VALUES (1, "B");
INSERT INTO product_owners (product_id, member_id) VALUES (2, "C");
