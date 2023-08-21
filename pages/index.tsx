import { Building, findAll } from "@/api/building/findAll";
import Card from "@/components/Card";
import Container from "@/components/Container";
import Create from "@/components/Modal/Create";
import { useEffect, useState } from "react";
import styled from "styled-components";

export default function Index() {
  const [modal, setModal] = useState(false);
  const [building, setBuilding] = useState<Building[]>();

  useEffect(() => {
    findAll().then((res) => {
      setBuilding(res);
    });
  }, []);

  // console.log(building);

  return (
    <>
      <Container>
        <Wrapper>
          <Row>
            <Title>건물 관리</Title>
            <Button onClick={() => setModal(true)}>
              <Image src="/images/pencil.svg" alt="pencil" />
              추가하기
            </Button>
          </Row>
          <Wrap>
            {building?.map((v) => (
              <Card key={v.id} building={v} />
            ))}
          </Wrap>
        </Wrapper>
      </Container>
      {modal && (
        <Create
          close={() => {
            setModal(false);
          }}
        />
      )}
    </>
  );
}

const Wrapper = styled.div`
  width: 100%;
  padding-top: 60px;

  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Title = styled.h1`
  font-size: 36px;
  font-weight: bold;
  color: #000;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const Wrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`;

const Button = styled.button`
  border-radius: 1000px;
  border: 1px solid #000;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  color: #000;
  background-color: #fff;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: #000;
    color: #fff;

    img {
      filter: invert(0);
    }
  }

  display: flex;
  gap: 8px;
  align-items: center;

  img {
    width: 20px;
    transition: all 0.2s ease-in-out;
    filter: invert(1);
  }
`;

const Image = styled.img``;
