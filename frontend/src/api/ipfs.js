import axios from "axios";

const PINATA_BASE_URL = "https://api.pinata.cloud";

function getHeaders() {
  const token = import.meta.env.VITE_PINATA_JWT;
  if (!token) {
    throw new Error("Missing VITE_PINATA_JWT");
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function uploadFileToIPFS(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "pinataMetadata",
    JSON.stringify({
      name: file.name ?? `upload-${Date.now()}`,
    })
  );
  formData.append(
    "pinataOptions",
    JSON.stringify({
      cidVersion: 1,
    })
  );

  const response = await axios.post(
    `${PINATA_BASE_URL}/pinning/pinFileToIPFS`,
    formData,
    {
      headers: getHeaders(),
    }
  );

  return response.data.IpfsHash;
}

export async function uploadJSONToIPFS(data) {
  const response = await axios.post(
    `${PINATA_BASE_URL}/pinning/pinJSONToIPFS`,
    {
      pinataContent: data,
      pinataMetadata: {
        name: `order-${Date.now()}`,
      },
      pinataOptions: {
        cidVersion: 1,
      },
    },
    {
      headers: {
        ...getHeaders(),
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.IpfsHash;
}

