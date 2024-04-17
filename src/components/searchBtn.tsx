import { IconButton, InputAdornment, TextField, useTheme } from "@mui/material";
import searchBtnIcon from "../Assets/Icons/Vector.svg"
import React from "react"; // Assurez-vous d'importer l'ic
// import SearchIcon from "@mui/icons-material/Search";

const SearchBtn = (props: any) => {
  const theme = useTheme();
  return (
    <div className="">
      <TextField
        sx={{
          "&":{
            width: "100%",
            // [theme.breakpoints.only("sm")]: {
            //   width: "50%",
            // },
            // [theme.breakpoints.only("md")]: {
            //   width: "40%",
            // }
          },
          "& input":{
            fontSize: "14px",
            padding: "10px 20px",
            color: "#1D1D1B"
          },
          "&:focus":{
            borderColor: "#0000 !important"
          }
        }}
        onChange={(e)=>props.handleSearch(e.target.value)}
        placeholder={props.placeholder}
        InputProps={{
          endAdornment: (
            <InputAdornment position="start">
              <IconButton>
                <img src={searchBtnIcon} alt="" />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </div>
  );
};

export default SearchBtn;
