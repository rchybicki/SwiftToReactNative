import { useState, useCallback } from 'react';
import { ScreenState } from '../models/types';

export function useLoadableState<T>() {
  const [state, setState] = useState<ScreenState<T>>({ status: 'loading' });

  const setLoading = useCallback(() => {
    setState({ status: 'loading' });
  }, []);

  const setLoaded = useCallback((data: T) => {
    setState({ status: 'loaded', data });
  }, []);

  const setError = useCallback((error: Error, cachedData?: T) => {
    setState({ status: 'error', error, data: cachedData });
  }, []);

  // Convert error state back to loaded (with cached data)
  const clearError = useCallback(() => {
    if (state.status !== 'error') {
      return;
    }

    if (state.data) {
      setState({ status: 'loaded', data: state.data });
    } else {
      setState({ status: 'loading' });
    }
  }, [state]);

  return {
    state,
    setLoading,
    setLoaded,
    setError,
    clearError,
    isLoading: state.status === 'loading',
    isError: state.status === 'error',
    data: state.status === 'loaded' ? state.data : state.status === 'error' ? state.data : undefined,
    error: state.status === 'error' ? state.error : undefined,
  };
}
