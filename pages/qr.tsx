import { Building } from "@/api/building/findAll";
import { findOne } from "@/api/building/findOne";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { styled } from "styled-components";

export default function QR() {
  const [building, setBuilding] = useState<Building>();

  const router = useRouter();

  const { id } = router.query;

  useEffect(() => {
    findOne(id as string).then((res) => {
      setBuilding(res.data);
    });
  }, [id]);

  return (
    <>
      <Wrapper>
        <Container>
          <Image
            style={{
              marginBottom: 80,
              width: 300,
            }}
            src="/images/logo.svg"
            alt={"Logo"}
          />
          <Box>
            <Title>
              <S>{building?.name}</S> 건물에 오신 것을 환영합니다
            </Title>

            <QRCode value={id as string} />
          </Box>
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

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 500;
  color: #000;
  text-align: center;
`;

const S = styled.p`
  color: #ff442b;
  font-size: 48px;
  font-weight: bold;
`;

const Image = styled.img``;

const Box = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  align-items: center;
  padding: 20px;
  border-radius: 16px;
  border: 5px solid #ff442b;
`;
