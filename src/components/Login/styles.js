import styled from "styled-components";

export const Row = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Column = styled.div`
  flex-basis: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const OptionButton = styled.button`
  margin-bottom: 0.5rem;
  background: transparent;
  color: dodgerblue;
  border: none;
  text-align: left;
  cursor: pointer;
`;

export const CenterHorizontally = styled.div`
  display: flex;
  justify-content: center;
`;

export const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: -1rem;
`;
