import { nextRequest } from "./requests";

export const getKnowledgeBase = async (page: number, limit: number) => {
  try {
    return nextRequest(`knowledgebase/listKnowledgeBases`, "get", { page, limit });
  } catch (e) {
    return e;
  }
};
