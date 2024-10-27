import { RootState } from "../../store/store";

export const getCompanies = ({ companiesList: state }: RootState) =>
  state.companies;

export const getCheckedCompanies = ({ companiesList: state }: RootState) =>
  state.checked;
