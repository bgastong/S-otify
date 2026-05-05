import { useCallback, useRef, useState } from 'react';

// Hook reutilizable para estandarizar loading/error en tareas async.
function useAsyncStatus(initialLoading = false) {
  const [loading, setLoading] = useState(initialLoading);
  const [error, setError] = useState(null);
  const taskIdRef = useRef(0);

  const runTask = useCallback(async (task, fallbackMessage = 'Ocurrio un error.') => {
    const currentTaskId = taskIdRef.current + 1;
    taskIdRef.current = currentTaskId;
    setLoading(true);
    if (currentTaskId === taskIdRef.current) {
      setError(null);
    }
    try {
      return await task();
    } catch (err) {
      if (currentTaskId === taskIdRef.current) {
        setError(fallbackMessage || err?.message || 'Ocurrio un error.');
      }
      return undefined;
    } finally {
      if (currentTaskId === taskIdRef.current) {
        setLoading(false);
      }
    }
  }, []);

  return { loading, error, setError, runTask };
}

export default useAsyncStatus;