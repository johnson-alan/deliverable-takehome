import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useIsFetching } from "@tanstack/react-query";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { SearchContext } from "@/lib/contexts/SearchContext";

const AISearchInput = () => {
  const isFetching = useIsFetching();
  const router = useRouter();

  const { setSearch, search } = useContext(SearchContext);

  const [inputValue, setInputValue] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  }

  useEffect(() => {
    setInputValue(search);
  }, [search]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const search = (event.currentTarget.elements[0] as HTMLInputElement).value;
    router.push(`/movies?limit=25&page=0`);
    setSearch(search);
  }

  const onChange = (event: React.ChangeEvent<HTMLFormElement>) => {
    if (event.target.value === '') setSearch('');
  }

  return (
    <form className="flex w-full max-w-2xl items-center space-x-2" onSubmit={handleSubmit} onChange={onChange} >
      <Input
        type="search"
        placeholder="Search Movies"
        value={inputValue}
        disabled={!!isFetching}
        onChange={handleChange}
      />
      <Button type="submit" className="bg-white text-gray-900 hover:bg-yellow-400 hover:drop-shadow-md group sm:basis-28" disabled={!!isFetching}>
        {isFetching
          ? <div className="animate-spin-slow rounded-full border-t-4 border-t-slate-900 w-4 h-4"></div>
          : (
            <>
              <MagnifyingGlassIcon className="mr-0 sm:mr-2 h-4 w-4 transform transition-transform group-hover:scale-125" />
              <span className="hidden sm:inline">Search</span>
            </>
          )
        }
      </Button>
    </form>
  );
}

export default AISearchInput;
