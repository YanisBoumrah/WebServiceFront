import React from "react";
import styled from "styled-components";

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

const Header = () => {
  return <HeaderContainer>Watermelon DB</HeaderContainer>;
};

export default Header;
