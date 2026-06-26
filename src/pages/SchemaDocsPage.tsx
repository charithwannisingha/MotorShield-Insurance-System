// This file documents the MySQL Database Schema for the Motor Insurance System
// This is referenced in the codebase as documentation, not rendered as a page.

/**
 * ================================================================
 * MOTOR INSURANCE MANAGEMENT SYSTEM — MySQL Database Schema
 * Sri Lanka Context | Currency: LKR | Timezone: Asia/Colombo
 * ================================================================
 *
 * -- ─────────────────────────────────────────────────────────────
 * -- TABLE: users
 * -- ─────────────────────────────────────────────────────────────
 * CREATE TABLE users (
 *   id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 *   name          VARCHAR(150) NOT NULL,
 *   email         VARCHAR(150) NOT NULL UNIQUE,
 *   password      VARCHAR(255) NOT NULL,                  -- bcrypt hashed
 *   role          ENUM('admin','customer') NOT NULL DEFAULT 'customer',
 *   nic           VARCHAR(12) NOT NULL UNIQUE,             -- 9+V/X or 12 digits
 *   phone         VARCHAR(15) NOT NULL,                   -- 07X-XXXXXXX / +94
 *   address       TEXT,
 *   date_of_birth DATE,
 *   is_active     TINYINT(1) NOT NULL DEFAULT 1,
 *   created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 *   updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 *   deleted_at    TIMESTAMP NULL,                          -- soft delete
 *   INDEX idx_users_role (role),
 *   INDEX idx_users_nic  (nic)
 * ) ENGINE=InnoDB CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
 *
 * -- ─────────────────────────────────────────────────────────────
 * -- TABLE: vehicles
 * -- ─────────────────────────────────────────────────────────────
 * CREATE TABLE vehicles (
 *   id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 *   customer_id         BIGINT UNSIGNED NOT NULL,
 *   registration_number VARCHAR(20) NOT NULL UNIQUE,      -- WP ABC-1234 / 300-1234
 *   make                VARCHAR(80) NOT NULL,
 *   model               VARCHAR(80) NOT NULL,
 *   year                YEAR NOT NULL,
 *   color               VARCHAR(40),
 *   engine_number       VARCHAR(50) UNIQUE,
 *   chassis_number      VARCHAR(50) UNIQUE,
 *   vehicle_type        ENUM('car','motorcycle','van','lorry','bus','three_wheeler','suv') NOT NULL,
 *   engine_capacity     VARCHAR(20),                       -- '1800cc', 'Electric'
 *   seating_capacity    TINYINT UNSIGNED DEFAULT 5,
 *   fuel_type           ENUM('petrol','diesel','electric','hybrid') DEFAULT 'petrol',
 *   is_active           TINYINT(1) NOT NULL DEFAULT 1,
 *   created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 *   updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 *   deleted_at          TIMESTAMP NULL,
 *   FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE RESTRICT,
 *   INDEX idx_vehicles_customer (customer_id),
 *   INDEX idx_vehicles_reg_no   (registration_number)
 * ) ENGINE=InnoDB CHARSET=utf8mb4;
 *
 * -- ─────────────────────────────────────────────────────────────
 * -- TABLE: policies
 * -- ─────────────────────────────────────────────────────────────
 * CREATE TABLE policies (
 *   id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 *   policy_number   VARCHAR(30) NOT NULL UNIQUE,           -- MSL-2024-001
 *   customer_id     BIGINT UNSIGNED NOT NULL,
 *   vehicle_id      BIGINT UNSIGNED NOT NULL,
 *   coverage_type   ENUM('comprehensive','third_party','third_party_fire_theft') NOT NULL,
 *   status          ENUM('active','expired','pending','cancelled') NOT NULL DEFAULT 'pending',
 *   start_date      DATE NOT NULL,
 *   end_date        DATE NOT NULL,
 *   premium_amount  DECIMAL(12,2) NOT NULL,                -- LKR
 *   sum_insured     DECIMAL(14,2) NOT NULL,                -- LKR
 *   excess_amount   DECIMAL(10,2) DEFAULT 0.00,            -- LKR
 *   agent_name      VARCHAR(150),
 *   notes           TEXT,
 *   renewed_at      TIMESTAMP NULL,
 *   created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 *   updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 *   deleted_at      TIMESTAMP NULL,
 *   FOREIGN KEY (customer_id) REFERENCES users(id)    ON DELETE RESTRICT,
 *   FOREIGN KEY (vehicle_id)  REFERENCES vehicles(id) ON DELETE RESTRICT,
 *   INDEX idx_policies_customer (customer_id),
 *   INDEX idx_policies_vehicle  (vehicle_id),
 *   INDEX idx_policies_status   (status),
 *   INDEX idx_policies_end_date (end_date)
 * ) ENGINE=InnoDB CHARSET=utf8mb4;
 *
 * -- ─────────────────────────────────────────────────────────────
 * -- TABLE: payments
 * -- ─────────────────────────────────────────────────────────────
 * CREATE TABLE payments (
 *   id               BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 *   payment_number   VARCHAR(30) NOT NULL UNIQUE,          -- REC-2024-001
 *   policy_id        BIGINT UNSIGNED NOT NULL,
 *   amount           DECIMAL(12,2) NOT NULL,               -- LKR
 *   payment_date     DATE NULL,
 *   due_date         DATE NOT NULL,
 *   status           ENUM('paid','pending','overdue','partial') NOT NULL DEFAULT 'pending',
 *   payment_method   ENUM('cash','bank_transfer','cheque') NOT NULL DEFAULT 'cash',
 *   reference_number VARCHAR(80),
 *   received_by      VARCHAR(150),
 *   notes            TEXT,
 *   created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 *   updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 *   FOREIGN KEY (policy_id) REFERENCES policies(id) ON DELETE RESTRICT,
 *   INDEX idx_payments_policy  (policy_id),
 *   INDEX idx_payments_status  (status),
 *   INDEX idx_payments_due     (due_date)
 * ) ENGINE=InnoDB CHARSET=utf8mb4;
 *
 * -- ─────────────────────────────────────────────────────────────
 * -- TABLE: claims
 * -- ─────────────────────────────────────────────────────────────
 * CREATE TABLE claims (
 *   id                   BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 *   claim_number         VARCHAR(30) NOT NULL UNIQUE,      -- CLM-2024-001
 *   policy_id            BIGINT UNSIGNED NOT NULL,
 *   vehicle_id           BIGINT UNSIGNED NOT NULL,
 *   incident_date        DATE NOT NULL,
 *   incident_location    VARCHAR(255) NOT NULL,
 *   incident_description TEXT NOT NULL,
 *   claim_type           ENUM('accident','theft','fire','natural_disaster','vandalism','other') NOT NULL,
 *   estimated_damage     DECIMAL(14,2) NOT NULL,           -- LKR
 *   approved_amount      DECIMAL(14,2) NULL,               -- LKR
 *   status               ENUM('submitted','under_review','approved','rejected','settled') NOT NULL DEFAULT 'submitted',
 *   submitted_at         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 *   reviewed_at          TIMESTAMP NULL,
 *   settled_at           TIMESTAMP NULL,
 *   assigned_to          VARCHAR(150),
 *   review_notes         TEXT,
 *   created_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 *   updated_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 *   FOREIGN KEY (policy_id)  REFERENCES policies(id)  ON DELETE RESTRICT,
 *   FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)  ON DELETE RESTRICT,
 *   INDEX idx_claims_policy  (policy_id),
 *   INDEX idx_claims_status  (status),
 *   INDEX idx_claims_date    (incident_date)
 * ) ENGINE=InnoDB CHARSET=utf8mb4;
 *
 * -- ─────────────────────────────────────────────────────────────
 * -- TABLE: claim_documents
 * -- ─────────────────────────────────────────────────────────────
 * CREATE TABLE claim_documents (
 *   id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 *   claim_id    BIGINT UNSIGNED NOT NULL,
 *   file_name   VARCHAR(255) NOT NULL,
 *   file_path   VARCHAR(500) NOT NULL,
 *   file_type   VARCHAR(100),
 *   file_size   INT UNSIGNED,
 *   uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 *   FOREIGN KEY (claim_id) REFERENCES claims(id) ON DELETE CASCADE,
 *   INDEX idx_documents_claim (claim_id)
 * ) ENGINE=InnoDB CHARSET=utf8mb4;
 *
 * -- ─────────────────────────────────────────────────────────────
 * -- TABLE: notifications
 * -- ─────────────────────────────────────────────────────────────
 * CREATE TABLE notifications (
 *   id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 *   user_id     BIGINT UNSIGNED NULL,                      -- NULL = all users
 *   title       VARCHAR(255) NOT NULL,
 *   message     TEXT NOT NULL,
 *   type        ENUM('info','success','warning','error') DEFAULT 'info',
 *   is_read     TINYINT(1) DEFAULT 0,
 *   created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 *   FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
 *   INDEX idx_notifications_user (user_id),
 *   INDEX idx_notifications_read (is_read)
 * ) ENGINE=InnoDB CHARSET=utf8mb4;
 *
 * -- ─────────────────────────────────────────────────────────────
 * -- TABLE: audit_logs
 * -- ─────────────────────────────────────────────────────────────
 * CREATE TABLE audit_logs (
 *   id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 *   user_id      BIGINT UNSIGNED NULL,
 *   action       VARCHAR(100) NOT NULL,                    -- 'policy.created', 'claim.approved'
 *   model_type   VARCHAR(100),                             -- 'App\Models\Policy'
 *   model_id     BIGINT UNSIGNED NULL,
 *   description  TEXT,
 *   ip_address   VARCHAR(45),
 *   user_agent   TEXT,
 *   created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 *   FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
 *   INDEX idx_audit_user   (user_id),
 *   INDEX idx_audit_action (action),
 *   INDEX idx_audit_model  (model_type, model_id)
 * ) ENGINE=InnoDB CHARSET=utf8mb4;
 */

export {};
