import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ICompany } from "./types";

interface ICompanyListState {
  allCompanies: ICompany[];
  companies: ICompany[];
  checked: string[];
  limit: number;
  offset: number;
}

export const initialState: ICompanyListState = {
  // Фейковые данные организаций
  allCompanies: Array.from({ length: 15000 }, (_, i: number) => {
    return {
      id: i.toString(),
      name: `Компания ${i}`,
      address: `Адрес компании ${i}`,
    };
  }),
  companies: [],
  checked: [],
  limit: 40,
  offset: 0,
};

export const companiesListSlice = createSlice({
  name: "companyList",
  initialState,
  reducers: {
    getCompaniesList: (state) => {
      state.companies = [
        ...state.companies,
        ...state.allCompanies.slice(
          state.offset * state.limit,
          (state.offset + 1) * state.limit,
        ),
      ];
      state.offset += 1;
    },
    handleChangeCheck: (state, action: PayloadAction<string>) => {
      if (state.checked.find((id: string) => id === action.payload)) {
        state.checked = state.checked.filter(
          (id: string) => id !== action.payload,
        );
      } else {
        state.checked = [...state.checked, action.payload];
      }
    },
    toggleCheckAll: (state) => {
      state.checked =
        state.checked.length === state.companies.length
          ? []
          : state.companies.map((company: ICompany) => company.id);
    },
    editCompany: (state, action: PayloadAction<ICompany>) => {
      const index: number = state.companies.findIndex(
        (company: ICompany) => company.id === action.payload.id,
      );

      if (index !== -1) {
        state.companies = [
          ...state.companies.slice(0, index),
          {
            ...action.payload,
          },
          ...state.companies.slice(index + 1),
        ];
      }
    },
    handleChangeDeleteCompanies: (state, action: PayloadAction<string[]>) => {
      state.companies = state.companies.filter(
        (company: ICompany) => !action.payload.includes(company.id),
      );
    },
    clearSlice: (state) => {
      state.companies = [];
      state.limit = 40;
      state.offset = 0;
    },
  },
});

export const {
  editCompany,
  handleChangeCheck,
  handleChangeDeleteCompanies,
  toggleCheckAll,
  getCompaniesList,
  clearSlice,
} = companiesListSlice.actions;

export default companiesListSlice.reducer;
