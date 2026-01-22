/**
 * Utility to calculate potential APY based on reward rate
 * @param {number} rewardRatePerSec - The contract reward rate
 * @param {number} totalStaked - Total tokens in pool
 * @returns {string} - APY Percentage
 */
function calculateAPY(rewardRatePerSec, totalStaked) {
    const secondsPerYear = 31536000;
    if (totalStaked === 0) return "0%";
    
    const yearlyRewards = rewardRatePerSec * secondsPerYear;
    const apy = (yearlyRewards / totalStaked) * 100;
    
    return apy.toFixed(2) + "%";
}

module.exports = { calculateAPY };
