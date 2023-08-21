import { login } from "@/api/auth/login";
import { useRouter } from "next/router";
import { useState } from "react";
import { styled } from "styled-components";

export default function Login() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  function loginHandler() {
    setError(null);
    login({ id, password }).then((res) => {
      if (res.status === 201) {
        router.push("/");
      } else {
        setError((res as any).message);
      }
    });
  }

  return (
    <>
      <Wrapper>
        <Container
          style={{
            gap: 32,
          }}
          as={"form"}
          onSubmit={(e) => {
            e.preventDefault();
            loginHandler();
          }}
        >
          <Column
            style={{
              gap: 8,
            }}
          >
            <Image src="/images/logo.svg" alt={"Logo"} />
            <Text>어드민 로그인</Text>
          </Column>
          <Column
            style={{
              gap: 8,
            }}
          >
            <Input
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="아이디를 입력해주세요"
            />
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={"password"}
              placeholder="비밀번호를 입력해주세요"
            />
          </Column>
          <Column style={{ gap: 8, alignItems: "center" }}>
            <Button>로그인하기</Button>
            {error && <Error>[ ! ] {error}</Error>}
          </Column>
        </Container>
      </Wrapper>
    </>
  );
}

const Wrapper = styled.div`
  width: 100%;
  height: 100vh;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

const Container = styled(Column)`
  max-width: 380px;
  width: 80%;
`;

const Image = styled.img`
  width: 254px;
`;

const Text = styled.p`
  color: "#5E5E5E";
  font-weight: 600;
`;

const Input = styled.input`
  width: 100%;
  height: 48px;
  background-color: #e8e8e8;
  padding: 0 20px;
  border-radius: 4px;

  font-size: 14px;

  &::placeholder {
    color: "#AFAFAF";
  }
`;

const Button = styled.button`
  width: 100%;
  height: 48px;
  border-radius: 4px;

  background: var(
    --gradiant,
    linear-gradient(120deg, #ff442b 0%, #ff442b 0.01%, #f73 100%)
  );
  font-size: 18px;
  color: #fff;
  font-weight: 700;
`;

const Error = styled.p`
  color: #ff0000;
  font-size: 14px;
  font-weight: 700;
`;
