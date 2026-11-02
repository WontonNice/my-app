(function(root){
  function resolveMathQuestionLink(assessments,sectionFor,questionId,assessmentId){
    if(!questionId)return null;
    const matches=assessments.filter(item=>sectionFor(item.id)?.questions?.some(question=>question.id===questionId));
    const assessment=matches.find(item=>item.id===assessmentId)??matches[0];
    return assessment?{assessmentId:assessment.id,questionId}:null;
  }
  if(typeof module!=='undefined')module.exports={resolveMathQuestionLink};
  else root.resolveMathQuestionLink=resolveMathQuestionLink;
})(typeof window==='undefined'?globalThis:window);
