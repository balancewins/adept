import { memo, useCallback, useEffect, useMemo, useRef } from "react";
import { getCheckedCompanies, getCompanies } from "./selectors";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  clearSlice,
  getCompaniesList,
  handleChangeDeleteCompanies,
  toggleCheckAll,
} from "./companies-list-slice";
import { ICompany } from "./types";
import { Company } from "./components";
import "./companies-list.css";

export const CompaniesList = memo(() => {
  const dispatch = useAppDispatch();
  const companies: ICompany[] = useAppSelector(getCompanies);
  const checked: string[] = useAppSelector(getCheckedCompanies);
  const tableRef = useRef<HTMLTableElement>(null);

  useEffect(() => {
    getNextCompany();
    tableRef?.current &&
      tableRef.current.addEventListener("scroll", handleScroll);

    return () => {
      dispatch(clearSlice());
      tableRef.current?.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const getNextCompany = useCallback(() => dispatch(getCompaniesList()), []);

  const handleScroll = useCallback((): void => {
    if (tableRef?.current) {
      if (
        tableRef.current.scrollTop + tableRef.current.clientHeight >=
        tableRef.current.scrollHeight - 20
      ) {
        getNextCompany();
      }
    }
  }, []);

  const isAllChecked: boolean = useMemo(
    () => checked.length === companies.length,
    [checked.length, companies.length],
  );

  const deleteAllCompanies = (): void => {
    dispatch(handleChangeDeleteCompanies(checked));
    getNextCompany();
  };

  return (
    <table ref={tableRef}>
      <thead>
        <tr>
          <th>
            <input
              id={"checkAll"}
              type={"checkbox"}
              checked={isAllChecked}
              onChange={() => dispatch(toggleCheckAll())}
            />
          </th>
          <th>Организация</th>
          <th>Адрес</th>
          <th>
            <button disabled={!checked.length} onClick={deleteAllCompanies}>
              Удалить выбранное
            </button>
          </th>
        </tr>
      </thead>
      <tbody>
        {companies.map((company: ICompany) => (
          <Company key={company.id} company={company} />
        ))}
      </tbody>
    </table>
  );
});
