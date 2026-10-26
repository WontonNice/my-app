import { Router } from "express";
import { handleMathCatalogRequest } from "../lib/mathCommandCatalogService";
import { persistMathCommandContext } from "../lib/mathCommandPersistence";
import type { MathQuestionPerformance } from "../shared/mathCommandTypes";

export function createMathCommandCatalogRouter(performanceProvider?:()=>Promise<Record<string,MathQuestionPerformance>>) {
  const router=Router();
  const paths=new Set(["/overview","/catalog","/player-queue","/duplicates","/export","/bulk-preview","/bulk-apply","/bulk-undo","/preferences"]);
  router.use(async(request,response,next)=>{
    if(!paths.has(request.path)&&!request.path.startsWith("/catalog/"))return next();
    if(!response.locals.user||!["teacher","admin"].includes(String(response.locals.user.app_metadata.role))){response.status(403).json({message:"Teacher access is required."});return;}
    let performance:Record<string,MathQuestionPerformance>|undefined;
    if(performanceProvider&&request.method==="GET"&&["/catalog","/player-queue","/export"].includes(request.path))performance=await performanceProvider();
    const result=handleMathCatalogRequest({method:request.method,pathname:request.path,body:request.body,query:request.query,actor:response.locals.user.id,performance});
    await persistMathCommandContext();
    if(result===undefined)return next();response.json(result);
  });
  return router;
}
