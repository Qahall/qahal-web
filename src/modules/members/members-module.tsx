import { useState } from "react";
import MembersFilters, { Schema } from "./components/members-filters";
import MembersTable from "./components/members-table";

export function MembersModule() {
  const [filters, setFilters] = useState<Schema | null>(null);

  return (
    <>
      <MembersFilters setFilters={setFilters} />
      <MembersTable filters={filters}/>
    </>
  );
}
