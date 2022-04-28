export default function PageReducer(state: any, action: any) {
  switch (action.type) {
    case "SET_PAGE_TITLE":
      return {
        ...state,
        pageTitle: action.payload,
      };
    case "SET_PAGE_DATA":
      return {
        ...state,
        link: action.payload.link,
        subLink: action.payload.subLink,
        formData: action.payload.formData,
        openFor: action.payload.openFor,
      };
  }
}
