import { createContext, useContext, useEffect, useReducer } from "react";
import PageReducer from "../reducers/PageReducer";

const initialState = {
  link: {
    title: "",
    path: "",
  },
  subLink: { title: "", path: "" },
  formData: null,
  openFor: null,
} as any;

export const PageContext = createContext(initialState);

export const PageProvider = ({ children }: any) => {
  const [state, dispatch]: any = useReducer(PageReducer, initialState);

  const setPageTitle = (title: any) => {
    dispatch({ type: "SET_PAGE_TITLE", payload: title } as any);
  };
  const setPageData = (pageData: any) => {
    dispatch({ type: "SET_PAGE_DATA", payload: pageData } as any);
  };

  return (
    <PageContext.Provider
      value={
        {
          link: state?.link,
          subLink: state?.subLink,
          formData: state?.formData,
          openFor: state?.openFor,
          setPageTitle,
          setPageData,
        } as any
      }
    >
      {children}
    </PageContext.Provider>
  );
};

export default PageContext;

export function usePage() {
  const context = useContext(PageContext);

  if (context === undefined) {
    return Error("usePage must be used within an NetWorth Provider");
  }
  return context;
}
