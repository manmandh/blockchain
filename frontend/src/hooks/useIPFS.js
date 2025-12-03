import { useCallback, useState } from "react";
import { uploadFileToIPFS, uploadJSONToIPFS } from "../api/ipfs";

export function useIPFS() {
  const [isUploading, setIsUploading] = useState(false);
  const [lastCid, setLastCid] = useState(null);

  const uploadFile = useCallback(async (file) => {
    setIsUploading(true);
    try {
      const cid = await uploadFileToIPFS(file);
      setLastCid(cid);
      return cid;
    } finally {
      setIsUploading(false);
    }
  }, []);

  const uploadJSON = useCallback(async (payload) => {
    setIsUploading(true);
    try {
      const cid = await uploadJSONToIPFS(payload);
      setLastCid(cid);
      return cid;
    } finally {
      setIsUploading(false);
    }
  }, []);

  return {
    isUploading,
    uploadFile,
    uploadJSON,
    lastCid,
  };
}

