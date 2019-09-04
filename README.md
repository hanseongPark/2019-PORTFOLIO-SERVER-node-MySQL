## 프로젝트명 [Health Scheduler]
> 아름다운 몸을 가꾸기 위하여 개인의 식단, 영양소, 운동 등의 정보를 관리할 수 있는 웹 어플리케이션입니다.

<img width="960" alt="mainPage" src="https://user-images.githubusercontent.com/54668871/64224247-ca7b9080-cf11-11e9-9937-342484afc4a0.png">

> http://13.125.218.219/

>현재 네이버 아이디로 로그인은 검수가 완료되지 않아 개발 상태입니다. 카카오 로그인은 정상적으로 이용할 수 있습니다. 테스터 로그인을 사용할 경우 미리 저장된 데이터를 사용하며 좀 더 수월한 웹사이트 기능을 사용할 수 있습니다.

## 제작 동기
> 현대에서 데이터 관리의 중요성은 경영, 인사, 스포츠, 심지어 게임에서까지 그 중요성이 입증되었습니다. 아름다운 몸매를 원하는 사람들에게도 이는 예외가 아닙니다. 다양한 웹사이트에서 영양소, 식단관리를 할 수 있지만, 정작 가장 중요한 운동 볼륨, 계획 관리 사이트는 없었습니다. 운동 관리를 포함한 다목적 스케쥴러를 만드는 것이 이 프로젝트의 제작 동기입니다.

## 개발 tool
> node.js, express.js, MySql, sequelize.js, passport.js, redis, AWS...

## 설치 방법

> Git 저장소의 소스코드를 복제한 후 의존 모듈을 설치합니다.

```sh
npm i
```

> 이후 .env 파일에 db 이름과 비밀번호, naver, kakao RESTful API 아이디와 비밀번호를 작성합니다.

```sh
npm run dev
```

> 개발 환경 실행 후 http://localhost:8001 로 접속합니다.

## 사용 예제

![detailPage](https://user-images.githubusercontent.com/54668871/64224258-d7987f80-cf11-11e9-9ab8-0d0007091aed.png)


> 본인의 나이, 체중, 키 등 다양한 정보를 분석하여 사용자의 목표에 맞는 하루 칼로리와 영양성분을 계산할 수 있습니다.

> 이후 산출된 영양성분을 바탕으로 식단관리를 하며 하루 달성치를 시각적으로 파악할 수 있습니다.

> 사용자의 운동 정보를 입력하여 시간에 따른 퍼포먼스의 증감과 운동 총 볼륨의 변화를 시각적으로 확인할 수 있습니다.

## 정보

> 박한성 – hsung90123@naver.com

[https://github.com/hanseongPark/2019-PORTFOLIO-SERVER-node-MySQL](https://github.com/hanseongPark/2019-PORTFOLIO-SERVER-node-MySQL)
