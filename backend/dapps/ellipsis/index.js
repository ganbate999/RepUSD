const { getEllipsisPools } = require('./helpers');

const fetchUserEllipsisPoolInfo = async(address) => {
    let info = await getEllipsisPools(address);
    return info;
}

async function getEllipsisReputation(address) {
    let rows = await fetchUserEllipsisPoolInfo(address);
    return rows;
}

module.exports = { fetchUserEllipsisPoolInfo, getEllipsisReputation };