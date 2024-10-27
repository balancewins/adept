import {
  ChangeEvent,
  KeyboardEvent,
  FC,
  memo,
  useMemo,
  useState,
  KeyboardEventHandler,
  MouseEventHandler,
  MouseEvent,
} from "react";
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
  const checked = useAppSelector(getCheckedCompanies);
  const companies = useAppSelector(getCompanies);
  const [name, setName] = useState<string>(company.name);
  const [address, setAddress] = useState<string>(company.address);

  const isChecked: boolean = useMemo(
    () => !!checked.find((id) => id === company.id),
    [checked],
  );

  const deleteCompany: MouseEventHandler<HTMLButtonElement> = (
    e: MouseEvent<HTMLButtonElement>,
  ): void => {
    e.preventDefault();
    dispatch(handleChangeDeleteCompanies([company.id]));
    if (companies.length === 1) {
      dispatch(getCompaniesList());
    }
  };

  // Для оптимизации сохранение в store по enter, а не при каждом изменении value в input
  const saveCompany: KeyboardEventHandler<HTMLInputElement> = (
    e: KeyboardEvent<HTMLInputElement>,
  ): void => {
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
          onKeyDown={saveCompany}
        />
      </td>
      <td>
        <input
          value={address}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setAddress(e.target.value)
          }
          onKeyDown={saveCompany}
        />
      </td>
      <td>
        <button onClick={deleteCompany}>Удалить</button>
      </td>
    </tr>
  );
});
