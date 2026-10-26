import { useCallback, useEffect, useState } from 'react';
import type { PracticeCatalog } from '../../../../server/src/shared/practiceCatalog';
import { requestApi, createAuthHeaders } from '../../lib/api';
import { getActiveSession } from '../../lib/sessionCache';
async function fetchCatalog() {
  const session=await getActiveSession();if(!session)throw new Error('Sign in to load practice resources.');
  return requestApi<{catalog:PracticeCatalog}>('/api/infinite-practice/catalog',{headers:createAuthHeaders(session.access_token)});
}

export function usePracticeCatalog() {
  const [catalog,setCatalog]=useState<PracticeCatalog|null>(null),[error,setError]=useState(''),[loading,setLoading]=useState(true);
  const reload=useCallback(async()=>{
    setLoading(true);setError('');
    try{const next=await fetchCatalog();setCatalog(next.catalog);return next.catalog;}
    catch(error){setError(error instanceof Error?error.message:'Practice resources could not be loaded.');}finally{setLoading(false);}
  },[]);
  useEffect(()=>{let active=true;void fetchCatalog().then(next=>{if(active)setCatalog(next.catalog);}).catch(error=>{if(active)setError(error instanceof Error?error.message:'Practice resources could not be loaded.');}).finally(()=>{if(active)setLoading(false);});return()=>{active=false;};},[]);
  return {catalog,error,loading,reload};
}
