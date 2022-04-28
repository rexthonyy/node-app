module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        gray: "#d3d3d3",
        darkgray: "#878788",
        lightgrey: "#f5f5f5",
        primarygreen: "#1aa865",
        lightgreen: "#34c581",
        tint: "#1dbf732e",
        darkergray: "#a7a9b9",
        lightBlack: "#212521"
      },
      fontSize: {
        md: "16px",
        hd: "13px"
      },
      boxShadow: {
        shadowInput: "2px 2px 4px 2px #d3d3d3"
      }
    }
  },
  plugins: [require("tw-elements/dist/plugin")]
}
