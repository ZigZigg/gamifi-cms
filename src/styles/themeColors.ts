// themeColors.ts

export const colors = {
  light: {
    colorPrimary: '#FF891D',
    colorError: '#EC4F43',
    colorText: 'black',
  },
  dark: {
    colorPrimary: '#00b96b',
    colorError: '#FF0000',
    colorText: 'white',
  },
};

export const themeAntd = (theme: 'light' | 'dark') => {
  return {
    token: {
      fontFamily: 'Pretendard, sans-serif',
      colorPrimary: colors[theme].colorPrimary,
      colorError: colors[theme].colorError,
      colorText: colors[theme].colorText,
    },
    theme: {
      extend: {
        colors: {
          'primery-700': '#243c5a',
          main: '#D4D4D4',
          'body-text': '#5A5B5E',
        },
      },
    },

    components: {
      Button: {
        controlHeightLG: 44,
        controlHeight: 40,
        controlHeightSM: 36,
      },
      Select: {
        controlHeightLG: 44,
        controlHeight: 36,
        borderRadius: 8,
      },
      Input: {
        controlHeightLG: 44,
        controlHeight: 36,
      },
      DatePicker: {
        controlHeightLG: 44,
        controlHeight: 36,
      },
      Dropdown: {
        paddingXXS: 8,
      },
      // AutoComplete: {
      //   controlHeightLG: 44,
      // },
    },
  };
};
