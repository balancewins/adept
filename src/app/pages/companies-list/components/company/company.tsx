import { ChangeEvent, KeyboardEvent, FC, memo, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../hooks";
import { getCheckedCompanies, getCompanies } from "../../selectors";
import {
  editCompany,
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
  const [name, setName] = useState<string>(company.name);
  const [address, setAddress] = useState<string>(company.address);

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

  // Для оптимизации сохранение в store по enter, а не при каждом изменении в input
  const saveCompany = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      dispatch(editCompany({ id: company.id, name, address }));
    }
  };

  return (
    <tr style={{ backgroundColor: isChecked ? "lightblue" : "white" }}>
      <td>
        <input
          type={"checkbox"}
          checked={isChecked}
          onChange={() => dispatch(handleChangeCheck(company.id))}
        />
      </td>
      <td>
        <input
          value={name}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setName(e.target.value)
          }
          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => saveCompany(e)}
        />
      </td>
      <td>
        <input
          value={address}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setAddress(e.target.value)
          }
          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => saveCompany(e)}
        />
      </td>
      <td>
        <button onClick={deleteCompany}>Удалить</button>
      </td>
    </tr>
  );
});
