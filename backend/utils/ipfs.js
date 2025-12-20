const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_API_KEY = process.env.PINATA_SECRET_API_KEY;
const PINATA_GATEWAY_URL = 'https://gateway.pinata.cloud/ipfs/';

const addFileToIPFS = async (fileContent) => {
    try {
        const data = typeof fileContent === 'string' ? JSON.parse(fileContent) : fileContent;
        const res = await axios.post(
            "https://api.pinata.cloud/pinning/pinJSONToIPFS",
            data,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'pinata_api_key': PINATA_API_KEY,
                    'pinata_secret_api_key': PINATA_SECRET_API_KEY,
                },
            }
        );
        return res.data.IpfsHash;
    } catch (error) {
        console.error('Error adding file to Pinata IPFS:', error.response ? error.response.data : error.message);
        throw error;
    }
};

const getFileFromIPFS = async (cid) => {
    try {
        const res = await axios.get(`${PINATA_GATEWAY_URL}${cid}`);
        return res.data;
    } catch (error) {
        console.error('Error getting file from Pinata IPFS:', error.response ? error.response.data : error.message);
        throw error;
    }
};

module.exports = { addFileToIPFS, getFileFromIPFS };
