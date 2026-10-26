import type { ReactNode } from 'react';
import { usePracticeCatalog } from './usePracticeCatalog';
import { InequalityPractice } from './InequalityPractice';
export function CatalogPracticePlayer({onClose,renderOverview}:{onClose?:()=>void;renderOverview?:(overview:ReactNode)=>ReactNode}) {
  const {catalog,error,loading,reload}=usePracticeCatalog();
  if(!catalog){const message=<div className="math-study-resource-status" role={error?'alert':'status'}>{loading?'Loading practice modules…':error}{error&&<button onClick={()=>void reload()}>Try again</button>}{onClose&&<button onClick={onClose}>Close</button>}</div>;return renderOverview?renderOverview(message):message;}
  return <InequalityPractice catalog={catalog} onClose={onClose} renderOverview={renderOverview}/>;
}
