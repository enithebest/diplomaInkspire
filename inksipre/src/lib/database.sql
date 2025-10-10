create database `ganhas20_Inkspire`;
use `ganhas20_Inkspire`;

-- USERS
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255),
  full_name VARCHAR(255),
  role ENUM('user','admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ADDRESSES
CREATE TABLE IF NOT EXISTS addresses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  full_name VARCHAR(255),
  line1 VARCHAR(255),
  line2 VARCHAR(255),
  city VARCHAR(100),
  region VARCHAR(100),
  postal_code VARCHAR(50),
  country CHAR(2),
  phone VARCHAR(50),
  is_default_shipping TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- PRODUCTS
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  base_price DECIMAL(10,2) DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PRODUCT VARIANTS (e.g., size, color)
CREATE TABLE IF NOT EXISTS product_variants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  sku VARCHAR(100),
  option_values JSON, -- {"size":"M","color":"Black"}
  price DECIMAL(10,2) DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- CUSTOMISATION (design placement and settings)
CREATE TABLE IF NOT EXISTS customisation (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  variant_id INT NULL,
  order_item_id INT NULL,
  rotation DECIMAL(5,2) DEFAULT 0.00,
  scale DECIMAL(5,2) DEFAULT 1.00,
  position_x DECIMAL(6,2) DEFAULT 0.00,
  position_y DECIMAL(6,2) DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE SET NULL
);

-- UPLOADS (user design images)
CREATE TABLE IF NOT EXISTS uploads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  customisation_id INT NULL,
  image_url VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (customisation_id) REFERENCES customisation(id) ON DELETE SET NULL
);

-- ORDERS
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  total_price DECIMAL(10,2) DEFAULT 0.00,
  status ENUM('pending', 'paid', 'shipped') DEFAULT 'pending',
  shipping_address_id INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (shipping_address_id) REFERENCES addresses(id) ON DELETE SET NULL
);

-- ORDER ITEMS
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  variant_id INT NULL,
  upload_id INT NULL,
  quantity INT DEFAULT 1,
  unit_price DECIMAL(10,2) DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE SET NULL,
  FOREIGN KEY (upload_id) REFERENCES uploads(id) ON DELETE SET NULL
);

-- PAYMENTS
CREATE TABLE IF NOT EXISTS payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  provider VARCHAR(100) NOT NULL,
  provider_payment_id VARCHAR(255),
  amount DECIMAL(10,2) NOT NULL,
  status ENUM('pending','paid','failed') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- Link order_items to customisation (1:1)
ALTER TABLE customisation
  ADD CONSTRAINT fk_customisation_order_item
  FOREIGN KEY (order_item_id) REFERENCES order_items(id) ON DELETE SET NULL;


