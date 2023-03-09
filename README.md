# DiseasesWIKI - AWS Lambda function

## Usage
1. Test in a local environment with the command `npm run local`.
2. Create a bundle for AWS lambda function with the command `npm run build:getAll` or `npm run build:getOne`, `npm run build:img`. 
3. Update to AWS lambda function using `./dist/index.zip`.
4. Image files can be uploaded to path `/uploadimgs` on local environment.
5. Content type of image files is multipart/mixed and require this fields => ```{file : file, title : text, season : text, category1 : text, category2 : text, created_at : text, } ```

## API
`BASE_URL=https://lgd0lbex7b.execute-api.ap-northeast-2.amazonaws.com/default`

>[GET] /getAllDiseasesData
> 
> queryString(option) : comp=f 붙여서 요청하면 compress 하지 않은 데이터로 response
> ```
> response {
> statusCode : 200,
> data : [
> {doc1},
> {doc2},
> ...
>     ]
> }



> [GET] /getDiseasesData
> 
> queryString(require) : docId=63f5eaaf07db3388454113e6 해당하는 Id 의 document response
> ```
> response {
>   "_id": "63f5eaaf07db3388454113e6",
>   "disease_name": "요로감염증\n(urinary tract infection, UTI)",
>   "category": "신장비뇨기계질환",
>   "definition": "요로감염증은 비뇨기 계통의 감염입니다. 일반적으로 소변은 어떠한 오염도 없이 요로를 통해 이동하게 되는데 몸 밖에 있는 세균이 비뇨기계통으로 들어와 감염과 염증 등의 문제를 일으키는 것을 말합니다. 누구나 요로감   염에 걸릴 수 있지만 여성에게 더 흔합니다. 여성의 요도가 더 짧고 대장균이 흔한 항문에 더 가깝기 때문입니다.",
>   "cause_symptom": "요도와 방광에 들어가 염증과 감염을 일으키는 미생물(주로 박테리아)에 의해 발생합니다. UTI는 요도와 방광에서 가장 흔하게 발생하지만 박테리아는 요도를 타고 올라가 신장을 감염 시킬 수 있습니다. 방광염 환자의 90% 이상이 장에서 주로 발견되는 세균인 대장균에 의해 발생합니다. \n옆구리, 복부 또는 골반 부위의 통증, 소변이 자주 마렵고 급하게 마려우며 요실금이 생길 수 있습니다. 소변을 볼 때에 통증이 있을 수 있고 소변에 피가 나오거나 비장상적인 소변색(탁한 색)과 강한 냄새가 동반된 소변이 나타날 수 있습니다.",
>   "care": "충분한 수분 섭취로 요로에서 박테리아를 제거하는 것을 도울 수 있습니다. 그리고 배변 후 항상 앞에서 닦는 개인 위생을 실천하거나 요로가 짧은 여성들의 경우에는 월경주기에 패드와 탐폰을 자주 교체하는 것과 여성용 탈취제를 사용하지 않는 것도 UTI 예방에 도움이 될 수 있습니다. 의료기관을 방문한다면 항생제를 사용하여 요로감염증을 치료하게 됩니다."
> }

> [GET] /getSeasonImages
> 
> 현재 날짜 month 기준으로 4~5월은 '봄' 6~8월은 '여름' 9~10월은 '가을' 11~3월은 '겨울' 로 잡아서 계절내용을 포함한 전체 이미지 랜덤 3개 
> ```
> response {
>   "data": [
>       {
>       "_id": "640941e7c0094b1772439365",
>       "title": "웃는 집에 복이 온다",
>       "filename": "202001_모바일웹진_01본문_2꼭지.jpg",
>       "created_at": "202001",
>       "season": "겨울",
>       "category1": "건강증진",
>       "category2": "-",
>       "url": "https://storage.googleapis.com/diseaseswiki.appspot.com/202001_%E1%84%86%E1%85%A9%E1%84%87%E1%85%A1%E1%84%8B%E1%85%B5%E1%86%AF%E1%84%8B%E1%85%B0%E1%86%B8%E1%84%8C%E1%85%B5%E1%86%AB_01%E1%84%87%E1%85%A9%E1%86%AB%E1%84%86%E1%85%AE%E1%86%AB_2%E1%84%81%E1%85%A9%E1%86%A8%E1%84%8C%E1%85%B5.jpg?GoogleAccessId=firebase-adminsdk-go0ee%40diseaseswiki.iam.gserviceaccount.com&Expires=3356656591&Signature=h9a%2Fi47mqEoye4y0hLVlSfwh2Sx8SMATTdSEJT5kD13b0lyQFBNxQlF773VnI3hHSau6mQG2aREGEnFxI9QG%2FqMhcRXg8dW5LUPwUJ0klcl3ZtZvqHc7PUoA9Tj8k3AZezJVHObO%2FeJKnrP50F87M5PA%2F22yMb%2BEmVwFa8xxiNSCxCf8XaSMXr8SqGu7oEyrZD5PwT5Ed%2BQiMx1Yv1KxK0TSL1faNT3temqig0LzcacaGwKWHK2k5771Osq73BjJjJeldpMxgxZUZNMGx%2ByQu1FGhE4Hp1jKrRTo7Ql1ONWSoueIIETdSOo1Xy0SpdH3qjhdJf8FkT7nVZoJqb9pWg%3D%3D"
>       }, ....
>   ]
> }
