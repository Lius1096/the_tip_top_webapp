import { Button } from "@mui/material";
import React from "react";

const HomeButton = (props: {
  title: string;
  type?: any;
  bg: string;
  color: string;
  fontSize: string;
  handleValue?: any;
}) => {
  return (
    <Button
      className={`xl:rounded-lg xl:py-3 whitespace-nowrap px-4 lg:rounded-md py-3 cursor-pointer font-extrabold xl:px-8 text-xs lg:text-sm xl:text-lg ${props.color} ${props.bg} ${props.fontSize}`}
    >
      {props.title}
    </Button>
  );
};

export default HomeButton;
