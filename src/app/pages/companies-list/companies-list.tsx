import {
  FC,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { getCheckedCompanies, getCompanies, getLimit } from "./selectors";
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

export const CompaniesList: FC = memo(() => {
  const dispatch = useAppDispatch();
  const companies = useAppSelector(getCompanies);
  const checked = useAppSelector(getCheckedCompanies);
  const limit = useAppSelector(getLimit);
  const [visibleLimit, setVisibleLimit] = useState<number>(5 * limit);
  const tableRef = useRef<HTMLTableElement>(null);

  useEffect(() => {
    getNextCompany();
    tableRef.current?.addEventListener("scroll", handleDownScroll);

    return () => {
      dispatch(clearSlice());
      tableRef.current?.removeEventListener("scroll", handleDownScroll);
    };
  }, []);

  useEffect(() => {
    tableRef.current?.addEventListener("scroll", handleUpScroll);

    return () => {
      tableRef.current?.removeEventListener("scroll", handleUpScroll);
    };
  }, [companies.length]);

  const getNextCompany = useCallback(() => dispatch(getCompaniesList()), []);

  const handleDownScroll = useCallback((): void => {
    if (tableRef?.current) {
      const el: HTMLTableElement = tableRef.current;

      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 20) {
        getNextCompany();
        setVisibleLimit(200);
      }
    }
  }, [companies.length]);

  const handleUpScroll = useCallback((): void => {
    if (tableRef?.current) {
      if (
        tableRef.current.scrollTop < 200 &&
        companies.length >= visibleLimit
      ) {
        setVisibleLimit((prevState) => prevState + limit);
      }
    }
  }, [companies.length, limit, visibleLimit]);

  /* Поскольку по ТЗ требовалось сделать оптимизацию на большие таблицы без использования сторонних библиотек,
   * придумал подобный трюк. В противном случае использовал бы react-window для виртуализации длинных списков.
   * https://react-window.vercel.app/ */
  const visibleCompanies: ICompany[] = useMemo(
    () =>
      companies.length >= visibleLimit
        ? companies.slice(-visibleLimit)
        : companies,
    [companies.length, visibleLimit],
  );

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
        {visibleCompanies.map((company: ICompany) => (
          <Company key={company.id} company={company} />
        ))}
      </tbody>
    </table>
  );
});
