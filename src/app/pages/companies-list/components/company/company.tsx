import { FC, memo, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../../../hooks";
import { getCheckedCompanies, getCompanies } from "../../selectors";
import {
  getCompaniesList,
  handleChangeCheck,
  handleChangeDeleteCompanies,
} from "../../companies-list-slice";
import { ICompany } from "../../types";

type Props = {
  company: ICompany;
};

export const Company: FC<Props> = memo(({ company }) => {
  const dispatch = useAppDispatch();
  const checked: string[] = useAppSelector(getCheckedCompanies);
  const companies: ICompany[] = useAppSelector(getCompanies);

  const isChecked: boolean = useMemo(
    () => !!checked.find((id) => id === company.id),
    [checked],
  );

  const deleteCompany = (): void => {
    dispatch(handleChangeDeleteCompanies([company.id]));
    if (companies.length === 1) {
      dispatch(getCompaniesList());
    }
  };

  return (
    <tr>
      <td>
        <input
          type={"checkbox"}
          checked={isChecked}
          onChange={() => dispatch(handleChangeCheck(company.id))}
        />
      </td>
      <td>{company.name}</td>
      <td>{company.address}</td>
      <td>
        <button onClick={deleteCompany}>Удалить</button>
      </td>
    </tr>
  );
});
