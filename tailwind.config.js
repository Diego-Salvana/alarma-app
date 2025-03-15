import PrimeUI from 'tailwindcss-primeui';

/** @type {import('tailwindcss').Config} */
export const content = ["./src/**/*.{html,ts}"];
export const theme = {
  extend: {},
};
export const plugins = [PrimeUI];
export const darkMode = ['selector', '[class~="my-app-dark"]'];
