import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: '只支持POST' });
  }

  const auth = req.headers.authorization;
  if (auth !== 'Bearer admin9120') {
    return res.status(401).json({ error: '未授权' });
  }

  try {
    const { records, allRecords, addresses, stats } = req.body;

    if (addresses && addresses.length > 0) {
      for (const addr of addresses) {
        await sql`
          INSERT INTO stake_addresses (address) 
          VALUES (${addr}) 
          ON CONFLICT (address) DO NOTHING
        `;
      }
    }

    if (allRecords && allRecords.length > 0) {
      for (const record of allRecords) {
        await sql`
          INSERT INTO stake_records (
            address, amount, stake_time, stake_index, is_redeemed
          ) VALUES (
            ${record.address}, ${record.amount}, ${record.stakeTime}, 
            ${record.stakeIndex}, ${record.isRedeemed || false}
          )
          ON CONFLICT (address, stake_time) 
          DO UPDATE SET 
            is_redeemed = EXCLUDED.is_redeemed,
            updated_at = CURRENT_TIMESTAMP
        `;
      }
    }

    if (stats) {
      await sql`
        INSERT INTO stake_stats (
          date, total_staked, total_staked_1d, total_staked_15d, total_staked_30d,
          count_1d, count_15d, count_30d, unlock_2d, unlock_7d, unlock_15d, lp_withdrawable
        ) VALUES (
          CURRENT_DATE,
          ${stats.totalStaked || 0},
          ${stats.totalStaked1d || 0},
          ${stats.totalStaked15d || 0},
          ${stats.totalStaked30d || 0},
          ${stats.count1d || 0},
          ${stats.count15d || 0},
          ${stats.count30d || 0},
          ${stats.unlock2d || 0},
          ${stats.unlock7d || 0},
          ${stats.unlock15d || 0},
          ${stats.lpWithdrawable || 0}
        )
        ON CONFLICT (date) DO UPDATE SET
          total_staked = EXCLUDED.total_staked,
          total_staked_1d = EXCLUDED.total_staked_1d,
          total_staked_15d = EXCLUDED.total_staked_15d,
          total_staked_30d = EXCLUDED.total_staked_30d,
          count_1d = EXCLUDED.count_1d,
          count_15d = EXCLUDED.count_15d,
          count_30d = EXCLUDED.count_30d,
          unlock_2d = EXCLUDED.unlock_2d,
          unlock_7d = EXCLUDED.unlock_7d,
          unlock_15d = EXCLUDED.unlock_15d,
          lp_withdrawable = EXCLUDED.lp_withdrawable,
          updated_at = CURRENT_TIMESTAMP
      `;
    }

    res.json({ 
      success: true, 
      message: '上传成功',
      recordCount: allRecords?.length || 0,
      timestamp: Date.now()
    });

  } catch (error) {
    console.error('上传失败:', error);
    res.status(500).json({ error: error.message });
  }
}
