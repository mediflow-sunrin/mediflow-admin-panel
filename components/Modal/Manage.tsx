import { styled } from "styled-components";
import Default from "./Default";
import { useEffect, useState } from "react";
import {
  Alert,
  AlertType,
  Building as BuildingType,
} from "@/api/building/findAll";
import {
  socket,
  subscribeToAlerts,
  unsubscribeToAlerts,
} from "@/api/alert/index";
import { useRouter } from "next/router";
import { findAll } from "@/api/alert/findAll";
import Link from "next/link";
import { update } from "@/api/user/update";
import { update as buildingUpdate } from "@/api/building/update";

type Props = {
  close: () => void;
};

enum ManageType {
  BUILDING,
  NOTIFICATION,
  USER,
}

type UserProps = {
  building: BuildingType;
};

function User({ building }: UserProps) {
  const router = useRouter();

  function removeHandler(id: string) {
    update(id, { building: null });

    router.reload();
  }

  return (
    <>
      <UserWrapper>
        {building?.users?.map((v) => (
          <UserRow key={v.id}>
            <UserName>{v.name}</UserName>
            <Buttons>
              <ManageButton onClick={() => removeHandler(v.id)}>
                삭제
              </ManageButton>
            </Buttons>
          </UserRow>
        ))}
      </UserWrapper>
    </>
  );
}

const UserWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const UserRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 10px;
  border-radius: 10px;
  background-color: #fff3f3;
`;

const UserName = styled.h1`
  font-size: 18px;
  font-weight: bold;
  color: #000;
`;

const Buttons = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const ManageButton = styled.button`
  padding: 4px 12px;
  border-radius: 1000px;

  font-size: 14px;
  font-weight: bold;
  color: #fff;
  background-color: #cc3300;
`;

function CreateAlert({ close, buildingId }: Props & { buildingId: number }) {
  const [type, setType] = useState(AlertType.DANGER);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    console.log(type);
  }, [type]);

  function createHandler() {
    setError(null);

    if (!title) {
      setError("제목을 입력해주세요.");
      return;
    }

    if (!message) {
      setError("내용을 입력해주세요.");
      return;
    }

    socket.emit("createAlert", {
      type,
      title,
      message,
      buildingId,
    });

    // router.reload();
    close();
  }

  return (
    <>
      <Default close={close}>
        <NotificationWrapper
          as="form"
          onSubmit={(e) => {
            e.preventDefault();

            createHandler();
          }}
        >
          <NotificationRow>
            <NotificationTitle>알림 생성</NotificationTitle>
            <Button>
              <Image
                style={{
                  filter: "invert(1)",
                  width: "24px",
                  height: "24px",
                }}
                src="/images/pencil.svg"
                alt="pencil"
              />
            </Button>
          </NotificationRow>
          <Column>
            <CreateAlertRow>
              <CreateAlertTitle>유형</CreateAlertTitle>
              <Input
                as={"select"}
                value={type}
                defaultValue={AlertType.DANGER}
                onChange={(e) => setType(parseInt(e.target.value) as AlertType)}
                placeholder={"유형을 선택해주세요."}
              >
                <option value={AlertType.DANGER}>재난알림</option>
                <option value={AlertType.INFO}>공지사항</option>
              </Input>
            </CreateAlertRow>
            <CreateAlertRow>
              <CreateAlertTitle>제목</CreateAlertTitle>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={"제목을 입력해주세요."}
              />
            </CreateAlertRow>
            <CreateAlertRow>
              <CreateAlertTitle>내용</CreateAlertTitle>
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={"내용을 입력해주세요."}
              />
            </CreateAlertRow>

            {error && (
              <Row>
                <Image src="/images/warning.svg" alt="warning" />
                <ErrorText>{error}</ErrorText>
              </Row>
            )}
          </Column>
        </NotificationWrapper>
      </Default>
    </>
  );
}

const ErrorText = styled.p`
  font-size: 16px;
  font-weight: 600;
  color: #cc3300;
`;

const CreateAlertRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const CreateAlertTitle = styled.h1`
  width: 80px;
  font-size: 16px;
  font-weight: bold;
  color: #000;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
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

function Notification({ buildingId }: { buildingId: number }) {
  const [notification, setNotification] = useState<Alert[]>();
  const [modal, setModal] = useState(false);

  useEffect(() => {
    findAll(buildingId).then((res) => {
      setNotification(res);
    });
  }, [buildingId]);

  useEffect(() => {
    function handleNewAlert(alert: Alert & { buildingId: string }) {
      if (alert.buildingId == buildingId.toString()) {
        setNotification((prev) => [alert, ...(prev ?? [])]);
      }
    }

    subscribeToAlerts(handleNewAlert);

    return () => {
      unsubscribeToAlerts(handleNewAlert);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log(notification);

  return (
    <>
      <NotificationWrapper>
        <NotificationRow>
          <NotificationTitle>알림 목록</NotificationTitle>
          <Button onClick={() => setModal(true)}>
            <Image
              style={{
                filter: "invert(1)",
                width: "24px",
                height: "24px",
              }}
              src="/images/pencil.svg"
              alt="pencil"
            />
          </Button>
        </NotificationRow>
        <NotificationContentColumn>
          {notification?.map((v) => (
            <NotificationContentWrapper type={v.type} key={v.id}>
              <NotificationContentRow>
                <NotificationContentTitle type={v.type}>
                  {v.title}
                </NotificationContentTitle>
                <NotificationContentDesc>
                  {Math.floor(
                    (new Date().getTime() - new Date(v.createdAt).getTime()) /
                      1000 /
                      60
                  )}
                  분전
                </NotificationContentDesc>
              </NotificationContentRow>
              <NotificationContent>{v.message}</NotificationContent>
            </NotificationContentWrapper>
          ))}
        </NotificationContentColumn>
      </NotificationWrapper>
      {modal && (
        <CreateAlert buildingId={buildingId} close={() => setModal(false)} />
      )}
    </>
  );
}

const NotificationWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const NotificationRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const NotificationTitle = styled.h1`
  font-size: 20px;
  font-weight: bold;
`;

const NotificationContentColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 400px;
  overflow-y: auto;
`;

const NotificationContentWrapper = styled.div<{ type?: AlertType }>`
  width: 100%;
  padding: 10px;
  border-radius: 10px;
  background-color: ${(props) =>
    props.type === AlertType.DANGER ? "#fff3f3" : "#DEEBC3"};
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const NotificationContentRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const NotificationContentTitle = styled.h1<{ type?: AlertType }>`
  font-size: 16px;
  font-weight: bold;
  color: ${(props) =>
    props.type === AlertType.DANGER ? "#ed7070" : "#38D16F"};
`;

const NotificationContentDesc = styled.p`
  font-size: 14px;
  font-weight: 500;
  color: #a2a2a2;
`;

const NotificationContent = styled.p`
  font-size: 14px;
  font-weight: 500;
  color: #000000;
`;

type BuildingProps = {
  building: BuildingType;
};

function Building({ building }: BuildingProps) {
  const [name, setName] = useState(building.name);
  const [address, setAddress] = useState(building.address);
  const [phone, setPhone] = useState(building.contact);

  const router = useRouter();

  function submitHandler() {
    buildingUpdate(building.id.toString(), {
      name,
      address,
      contact: phone,
    });

    router.reload();
  }

  return (
    <>
      <BuildingWrapper>
        <BuildingRow>
          <BuildingTitle>건물 수정</BuildingTitle>
          <Button onClick={submitHandler}>
            <Image
              style={{
                filter: "invert(1)",
                width: "24px",
                height: "24px",
              }}
              src="/images/pencil.svg"
              alt="pencil"
            />
          </Button>
        </BuildingRow>
        <BuildingContentColumn>
          <CreateAlertRow>
            <CreateAlertTitle>이름</CreateAlertTitle>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={"예) 선린인터넷고등학교"}
            />
          </CreateAlertRow>
          <CreateAlertRow>
            <CreateAlertTitle>주소</CreateAlertTitle>
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={"예) 서울특별시 용산구 원효로97길 33-4"}
            />
          </CreateAlertRow>
          <CreateAlertRow>
            <CreateAlertTitle>연락처</CreateAlertTitle>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={"예) 02-713-6211"}
            />
          </CreateAlertRow>
        </BuildingContentColumn>
      </BuildingWrapper>
    </>
  );
}

const BuildingWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const BuildingRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const BuildingTitle = styled.h1`
  font-size: 20px;
  font-weight: bold;
`;

const BuildingContentColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export default function Manage({
  close,
  building,
}: Props & { building: BuildingType }) {
  const [type, setType] = useState(ManageType.BUILDING);

  return (
    <>
      <Default close={close} maxWidth={800}>
        <Wrapper>
          <Row
            style={{
              justifyContent: "space-between",
            }}
          >
            <Row>
              <Button
                onClick={() => {
                  setType(ManageType.BUILDING);
                }}
                selected={type === ManageType.BUILDING}
              >
                건물 관리
              </Button>
              <Button
                onClick={() => {
                  setType(ManageType.NOTIFICATION);
                }}
                selected={type === ManageType.NOTIFICATION}
              >
                알림 관리
              </Button>
              <Button
                onClick={() => {
                  setType(ManageType.USER);
                }}
                selected={type === ManageType.USER}
              >
                이용객 관리
              </Button>
            </Row>
            <Link
              href={{
                pathname: "/qr",
                query: {
                  id: building.id,
                },
              }}
            >
              <Image src="/images/qr.svg" alt="pencil" />
            </Link>
          </Row>
          {type === ManageType.BUILDING && <Building building={building} />}
          {type === ManageType.NOTIFICATION && (
            <Notification buildingId={building.id} />
          )}
          {type === ManageType.USER && <User building={building} />}
        </Wrapper>
      </Default>
    </>
  );
}

const Wrapper = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Row = styled.div`
  width: 100%;
  display: flex;
  align-items: center;

  gap: 10px;
`;

const Button = styled.button<{ selected?: boolean }>`
  height: 29px;
  font-size: ${(props) => (props.selected ? "24px" : "18px")};
  font-weight: bold;
  color: ${(props) => (props.selected ? "#000000" : "#8a8a8a")};
  transition: 0.2s;
`;

const Image = styled.img``;
