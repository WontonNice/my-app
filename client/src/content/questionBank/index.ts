import data from "../../../../server/data/question-bank.json";
import { bankCatalog, bankPassage, bankPassageSet, bankTopicCatalog, type QuestionBank } from "../../../../server/src/shared/questionBank";

// Editor-validated JSON may infer absent wrong-choice labels as optional
// undefined properties across items, although JSON itself only stores strings.
export const questionBank = data as unknown as QuestionBank;
export const questionBankCatalog = bankCatalog(questionBank);
export const getTopicBankSets = (topic: string) => bankTopicCatalog(questionBank, topic);
const sets = new Map(questionBank.sets.map(set => [set.id, bankPassageSet(questionBank, set.id)!]));
export const getBankSet = (id: string) => sets.get(id);
export const getBankPassage = (id: string) => {
  const q = questionBank.questions.find(q => q.id === id);
  return q ? bankPassage(q) : undefined;
};
