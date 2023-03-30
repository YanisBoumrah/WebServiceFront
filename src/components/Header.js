import React from "react";
import { IoMdAdd } from "react-icons/io";
import styled from "styled-components";
import img from "../img/dela3a.png"




const HeaderContainer = styled.header`
  background-color: #009879;
  color: white;
  padding: 20px 0;
  font-size: 1.5em;
  text-align: center;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const Img = styled.img`

`;


const Header = () => {
  return (
  <HeaderContainer>
  <Img src={img} ></Img>
  Watermelon DB
  </HeaderContainer>
  
  )
};

export default Header;
