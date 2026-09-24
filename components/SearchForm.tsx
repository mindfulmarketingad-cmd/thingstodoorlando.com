import { SearchIcon } from "./Icons";

/**
 * Plain GET form so search works without JavaScript. /search redirects
 * ?q= to the clean /search/[query] URL.
 */
export default function SearchForm({
  compact = false,
  defaultValue = "",
  id = "site-search",
  placeholder = "Search attractions, tours or areas like Kissimmee",
}: {
  compact?: boolean;
  defaultValue?: string;
  id?: string;
  placeholder?: string;
}) {
  return (
    <form action="/search" method="get" role="search" className={`search-form${compact ? " is-compact" : ""}`}>
      <SearchIcon size={20} />
      <label htmlFor={id} className="sr-only">
        Search things to do in Orlando
      </label>
      <input
        id={id}
        name="q"
        type="search"
        placeholder={placeholder}
        defaultValue={defaultValue}
        maxLength={80}
        autoComplete="off"
        enterKeyHint="search"
        required
      />
      <button type="submit" className="btn btn-primary">
        <SearchIcon size={18} />
        <span>Search</span>
      </button>
    </form>
  );
}
