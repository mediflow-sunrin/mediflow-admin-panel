import Link from "next/link";
import { styled } from "styled-components";

export default function Header() {
  return (
    <>
      <Wrapper>
        <Container>
          <Link href={"/"}>
            <Image src="/images/logo.svg" alt={"Logo"} />
          </Link>
          <Link
            href={"/login"}
            onClick={() => localStorage.removeItem("token")}
          >
            <Text>로그아웃</Text>
          </Link>
        </Container>
      </Wrapper>
    </>
  );
}

const Wrapper = styled.div`
  width: 100%;
  height: 60px;

  position: fixed;
  top: 0%;
  left: 0%;
`;

const Container = styled.div`
  width: 1300px;
  height: 100%;

  margin: 0 auto;

  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Image = styled.img`
  height: 24px;
`;

const Text = styled.p`
  font-size: 16px;
  font-weight: 700;
  color: #000000;
`;
