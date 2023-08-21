import { styled } from "styled-components";

type Props = {
  children?: React.ReactNode;
};

export default function Container({ children }: Props) {
  return (
    <>
      <Wrapper>
        <Content>{children}</Content>
      </Wrapper>
    </>
  );
}

const Wrapper = styled.div`
  width: 100%;
  padding-top: 60px;
`;

const Content = styled.div`
  width: 1300px;
  margin: 0 auto;
`;
