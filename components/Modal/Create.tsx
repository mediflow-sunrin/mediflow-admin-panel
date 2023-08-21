import { styled } from "styled-components";
import Default from "./Default";
import { useRef, useState } from "react";
import { uploadImage } from "@/api/building/image";
import { create } from "@/api/building/create";
import { useRouter } from "next/router";

type Props = {
  close: () => void;
};

export default function Create({ close }: Props) {
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedFloor, setSelectedFloor] = useState(0);
  const [floors, setFloors] = useState<Array<string | null>>([null]);

  const phoneRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  function phoneValidate() {
    const regExp = /^\d{2,3}-\d{3,4}-\d{4}$/;
    return regExp.test(phone);
  }

  function addFloor() {
    setFloors([...floors, null]);
    setSelectedFloor(floors.length);
  }

  function uploadImageHandler(file: FormData) {
    uploadImage(file).then((res) => {
      setFloors((prev) => {
        const newFloors = [...prev];
        newFloors[selectedFloor] = res.data.location;
        return newFloors;
      });
    });
  }

  function createHandler() {
    const floorLength = floors.reduce((acc, cur) => {
      return acc + (cur ? 1 : 0);
    }, 0);

    setFloors((prev) => {
      const newFloors = [...prev];
      newFloors.length = floorLength;
      return newFloors;
    });

    create({
      name,
      address,
      contact: phone,
      exit: floors as string[],
    }).then((res) => {
      if (res.status === 201) {
        close();
        router.reload();
      } else {
        setError("건물 생성에 실패했습니다.");
      }
    });
  }

  return (
    <>
      <Default close={close}>
        <Wrapper
          onSubmit={(e) => {
            e.preventDefault();

            setError(null);

            if (!phoneValidate()) {
              phoneRef.current?.focus();
              setError("연락처 형식을 올바르게 입력해주세요.");
              return;
            }

            createHandler();
          }}
        >
          <Row
            style={{
              justifyContent: "space-between",
            }}
          >
            <Title>건물 생성</Title>
            <Button>
              <Image src="/images/pencil.svg" alt="pencil" />
            </Button>
          </Row>
          <Column>
            <Row>
              <Label>이름</Label>
              <Input
                name="이름"
                placeholder="예) 선린인터넷고등학교"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
                required
              />
            </Row>
            <Row>
              <Label>주소</Label>
              <Input
                name="주소"
                placeholder="예) 서울특별시 용산구 원효로97길 33-4"
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                }}
                required
              />
            </Row>
            <Row>
              <Label>연락처</Label>
              <Input
                name="연락처"
                placeholder="예) 02-713-6211"
                value={phone}
                ref={phoneRef}
                onChange={(e) => {
                  setPhone(e.target.value);
                }}
                required
              />
            </Row>

            {error && (
              <Row>
                <Image src="/images/warning.svg" alt="warning" />
                <ErrorText>{error}</ErrorText>
              </Row>
            )}
          </Column>
          <Column
            style={{
              alignItems: "center",
            }}
          >
            <Row
              style={{
                overflowX: "auto",
                justifyContent: "flex-start",
              }}
            >
              {floors.map((floor, index) => (
                <FloorButton
                  key={index}
                  onClick={() => setSelectedFloor(index)}
                  selected={index === selectedFloor}
                  type="button"
                >
                  {index + 1}F
                </FloorButton>
              ))}
              <FloorButton
                style={{
                  padding: "8px 12px",
                }}
                onClick={addFloor}
                type="button"
              >
                +
              </FloorButton>
            </Row>
            <ImageWrapper>
              <input
                id="file"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const formData = new FormData();
                  formData.append("file", file);
                  uploadImageHandler(formData);
                }}
                style={{
                  display: "none",
                }}
              />
              {!floors[selectedFloor] ? (
                <Button as="label" htmlFor="file">
                  <Image src="/images/plus.svg" alt="plus" />
                </Button>
              ) : (
                <Image
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                  src={floors[selectedFloor] as string}
                  alt="floor"
                />
              )}
            </ImageWrapper>
          </Column>
        </Wrapper>
      </Default>
    </>
  );
}

const Wrapper = styled.form`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  color: #000;
`;

const Row = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  width: 100%;
  justify-content: center;
`;

const Label = styled.p`
  width: 80px;
  font-size: 16px;
  font-weight: bold;
  color: #000;
`;

const Input = styled.input`
  width: 100%;
  height: 40px;
  border-radius: 8px;
  padding: 0 10px;
  font-size: 16px;
  font-weight: bold;
  background-color: #e8e8e8;

  &::placeholder {
    color: #a8a8a8;
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Button = styled.button`
  border-radius: 1000px;
  border: 1px solid #000;
  padding: 10px;
  background-color: #fff;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background-color: #000;
    color: #fff;

    img {
      filter: invert(0);
    }
  }

  img {
    width: 24px;
    transition: all 0.2s ease-in-out;
    filter: invert(1);
  }
`;

const Image = styled.img``;

const ErrorText = styled.p`
  font-size: 16px;
  font-weight: 600;
  color: #cc3300;
`;

const FloorButton = styled.button<{ selected?: boolean }>`
  border-radius: 1000px;
  border: 1px solid #000;
  padding: 8px 18px;
  font-size: 16px;
  font-weight: bold;
  color: ${(props) => (props.selected ? "#fff" : "#000")};
  background-color: ${(props) => (props.selected ? "#000" : "#fff")};

  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: #000;
    color: #fff;
  }
`;

const ImageWrapper = styled.div`
  width: 100%;
  height: 200px;

  border: 1px solid #000;
  border-radius: 8px;
  background-color: #fff;

  display: flex;
  align-items: center;
  justify-content: center;
`;
