import { useContext } from "react";
import { useRouter } from "next/router";
import { PersonIcon } from '@radix-ui/react-icons'

import AISearchInput from "@/components/AISearchInput";

import { SearchContext } from "@/lib/contexts/SearchContext";

const Logo = () => {
  const router = useRouter();
  const { setSearch } = useContext(SearchContext);

  const handleClick = () => {
    setSearch('');
    router.push('/movies?limit=25&page=0');
  };

  return (
    <div className="basis-1/12 flex">
      <div onClick={handleClick} className='rounded-md bg-yellow-400 flex items-center justify-center grow-0 cursor-pointer group'>
        <h1 className="text-base md:text-2xl font-bold text-center px-2 py-2 md:py-1 transform transition-transform group-hover:scale-110">AIMDb</h1>
      </div>
    </div>
  )
};

const ProfileButtonStub = () => (
  <div className="basis-1/12 flex justify-end">
    <div className="rounded-full bg-white h-10 w-10 flex items-center justify-center hover:bg-yellow-400 cursor-not-allowed group">
      <PersonIcon className="h-4 w-4 transform transition-transform group-hover:scale-125 "/>
    </div>
  </div>
);

const SiteHeader = () => (
  <header
    className="flex flex-grow-0 flex-shrink-0 justify-between items-center py-2 bg-gray-900 border-b w-full z-10 px-6 gap-4"
  >
    <Logo />
    <AISearchInput />
    <ProfileButtonStub />
  </header>
);

export default SiteHeader;
