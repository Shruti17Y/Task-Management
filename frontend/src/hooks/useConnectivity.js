import { useState, useEffect, useCallback } from 'react';
import { taskService } from '../services/taskService';

export const useConnectivity = () => {
  const [connStatus, setConnStatus] = useState('checking'); // 'checking' | 'online' | 'offline'
  const [latency, setLatency] = useState(null);
  const [dbDetails, setDbDetails] = useState(null);

  const checkConnectivity = useCallback(async () => {
    const startTime = Date.now();
    try {
      const data = await taskService.checkHealth();
      const endTime = Date.now();
      setLatency(endTime - startTime);
      setDbDetails(data);
      setConnStatus('online');
    } catch {
      setLatency(null);
      setDbDetails(null);
      setConnStatus('offline');
    }
  }, []);

  useEffect(() => {
    checkConnectivity();
  }, [checkConnectivity]);

  return {
    connStatus,
    latency,
    dbDetails,
    checkConnectivity,
  };
};
export default useConnectivity;
