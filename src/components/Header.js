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
const ContentContainer = styled.div`
display: flex;
align-items: center;
margin-left: 60px;
`

const Img = styled.img`
width: 30px;
height: 40px;
margin-right: 10px;
`

const Header = () => {
  return (
  <HeaderContainer>
  <ContentContainer>
  <Img src={img} ></Img>
  Watermelon DB
  </ContentContainer>
  </HeaderContainer>
  
  )
};

export default Header;
