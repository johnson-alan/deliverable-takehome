import { ReactNode, createContext, useReducer } from 'react'

enum actions {
  SET_SEARCH = 'SET_SEARCH',
};

type Action = {
  type: actions.SET_SEARCH
  search: string
};

type ProviderProps = { children: ReactNode };

type State = { search: string };
const initialState = { search: '' };

const SearchReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case actions.SET_SEARCH:
      return { search: action.search };
    default:
      return state;
  }
}

interface Context {
  search: string
  setSearch: (search: string) => void
};

let value: Context = {
  search: '',
  setSearch: () => {},
};

const SearchContext = createContext<Context>(value)

const SearchProvider = ({ children }: ProviderProps) => {
  const [state, dispatch] = useReducer(SearchReducer, initialState);
  value = {
    search: state.search,
    setSearch: (search: string) => dispatch({ type: actions.SET_SEARCH, search }),
  };
  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
}

export { SearchContext, SearchProvider };
