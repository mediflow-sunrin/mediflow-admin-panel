import { useEffect, useState } from "react";
import { styled } from "styled-components";
import Modal from "./Modal";
import { Building } from "@/api/building/findAll";

type Props = {
  building: Building;
};

export default function Card({ building }: Props) {
  const [modal, setModal] = useState(false);

  return (
    <>
      <Wrapper onClick={() => setModal(true)}>
        <Image src={building.exit[0]} alt="cover" />
        <ContentWrapper>
          <Title>{building.name}</Title>
          <SubTitle>{building.address}</SubTitle>
        </ContentWrapper>
      </Wrapper>
      {modal && (
        <Modal.Manage
          building={building}
          close={() => setModal(false)}
        ></Modal.Manage>
      )}
    </>
  );
}

const Wrapper = styled.button`
  width: 300px;

  border-radius: 8px;
  background-color: white;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
`;

const Image = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 8px 8px 0 0;
`;

const ContentWrapper = styled.div`
  width: 100%;
  padding: 10px;
`;

const Title = styled.h1`
  font-size: 18px;
  font-weight: bold;
  color: #000;
  text-align: left;
`;

const SubTitle = styled.p`
  font-size: 14px;
  font-weight: 500;
  color: #a2a2a2;
  text-align: left;
`;
