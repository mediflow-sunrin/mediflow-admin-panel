import { styled } from "styled-components";

type Props = {
  children?: React.ReactNode;
  maxWidth?: number;
  close: () => void;
};

export default function Default({ children, maxWidth, close }: Props) {
  return (
    <>
      <Wrapper onClick={close}>
        <Container maxWidth={maxWidth} onClick={(e) => e.stopPropagation()}>
          {children}
        </Container>
      </Wrapper>
    </>
  );
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  position: fixed;
  top: 0;
  left: 0;

  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
`;

const Container = styled.div<{ maxWidth?: number }>`
  max-width: ${(props) => props.maxWidth ?? 500}px;
  width: 80%;

  border-radius: 16px;
  background-color: #fff;

  padding: 20px;
`;
