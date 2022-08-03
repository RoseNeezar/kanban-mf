module.exports = {
  purge: ["./src/**/*.tsx"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            color: "inherit",
            " p": {
              color: "inherit",
            },
            "h1, h2, h3, h4, h5, h6": {
              color: "inherit",
            },
            strong: {
              color: "inherit",
              fontWeight: "bold",
            },
          },
        },
      },
      gridTemplateColumns: {
        fit: "repeat(auto-fit, 18rem)",
        calendar: "repeat(7, 1fr)",
      },
      gridTemplateRows: {
        min: "min-content",
      },
      height: {
        big: "90%",
        full: "100%",
      },
      colors: {
        "dark-main": "#18191A",
        "dark-second": "#242526",
        "dark-third": "#3A3B3C",
        "dark-txt": "#B8BBBF",
        blue: {
          100: "#cce4f6",
          200: "#99c9ed",
          300: "#66afe5",
          400: "#3394dc",
          500: "#0079d3",
          600: "#0061a9",
          700: "#00497f",
          800: "#003054",
          900: "#00182a",
        },
      },
    },
  },

  variants: {
    extend: {},
  },
  plugins: [],
};
