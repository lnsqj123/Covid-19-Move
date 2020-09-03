import {
  DefaultTheme,
  ThemeProvider as OriginalThemeProvider,
} from 'styled-components/native';
import React, { useState } from 'react';
import PropTypes from "prop-types";
import createCtx from "./createCtx";

const [useCtx, Provider] = createCtx();

var ThemeType = {
  LIGHT: 'LIGHT',
  DARK: 'DARK',
}

const createTheme = (type = ThemeType.LIGHT) => {
  switch (type) {
    case ThemeType.DARK:
      return '#151A25';
    case ThemeType.LIGHT:
    default:
      return '#ffffff';
  }
};

export const defaultThemeType = ThemeType.LIGHT;


function ThemeProvider({ children, initialThemeType = defaultThemeType }) {
  const [themeType, setThemeType] = useState(initialThemeType);
  const changeThemeType = () => {
    const newThemeType =
      themeType === ThemeType.LIGHT ? ThemeType.DARK : ThemeType.LIGHT;
    setThemeType(newThemeType);
  };
  const theme = createTheme(themeType);

  return (
    <Provider
      value={{
        changeThemeType,
        themeType,
        theme,
      }}
    >
      <OriginalThemeProvider theme={theme}>{children}</OriginalThemeProvider>
    </Provider>
  );
}

ThemeProvider.propTypes = {
  children: PropTypes.element,
  initialThemeType: PropTypes.oneOf([
    'LIGHT',
    'DARK',
  ])
}

export { useCtx as useThemeContext, ThemeProvider };
