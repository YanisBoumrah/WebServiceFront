import React from "react";
import styled from "styled-components";

const FooterContainer = styled.footer`
  background-color: #009879;
  color: white;
  padding: 20px 0;
  font-size: 1em;
  text-align: center;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  z-index: 100;
`;

const Footer = () => {
  return (
    <FooterContainer>
      Watermelon DB &copy; {new Date().getFullYear()} - Created by Yanis Boumrah
      and Yanis Bouzelha
    </FooterContainer>
  );
};

export default Footer;
