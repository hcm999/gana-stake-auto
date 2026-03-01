-- 地址表
CREATE TABLE IF NOT EXISTS stake_addresses (
    id SERIAL PRIMARY KEY,
    address VARCHAR(42) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 质押记录表
CREATE TABLE IF NOT EXISTS stake_records (
    id SERIAL PRIMARY KEY,
    address VARCHAR(42) NOT NULL,
    amount DECIMAL(20,8) NOT NULL,
    stake_time INTEGER NOT NULL,
    stake_index INTEGER NOT NULL,
    is_redeemed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(address, stake_time)
);

CREATE INDEX IF NOT EXISTS idx_stake_records_address ON stake_records(address);
CREATE INDEX IF NOT EXISTS idx_stake_records_stake_time ON stake_records(stake_time);
CREATE INDEX IF NOT EXISTS idx_stake_records_is_redeemed ON stake_records(is_redeemed);

-- 统计数据表
CREATE TABLE IF NOT EXISTS stake_stats (
    id SERIAL PRIMARY KEY,
    date DATE UNIQUE NOT NULL,
    total_staked DECIMAL(20,8) DEFAULT 0,
    total_staked_1d DECIMAL(20,8) DEFAULT 0,
    total_staked_15d DECIMAL(20,8) DEFAULT 0,
    total_staked_30d DECIMAL(20,8) DEFAULT 0,
    count_1d INTEGER DEFAULT 0,
    count_15d INTEGER DEFAULT 0,
    count_30d INTEGER DEFAULT 0,
    unlock_2d DECIMAL(20,8) DEFAULT 0,
    unlock_7d DECIMAL(20,8) DEFAULT 0,
    unlock_15d DECIMAL(20,8) DEFAULT 0,
    lp_withdrawable DECIMAL(20,8) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 插入示例地址
INSERT INTO stake_addresses (address) VALUES
('0x72212F35aC448FE7763aA1BFdb360193Fa098E52'),
('0x27551c8b615a5e0d6faaf5cbfee72cbdd8ebfd4d'),
('0xfd600aeab3aecf1908021c84a936cb77cdb419c3')
ON CONFLICT (address) DO NOTHING;
