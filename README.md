# AWS Lambda function

## Usage
1. Test in a local environment with the command `npm run local`.
2. Create a bundle for AWS lambda function with the command `npm run build:getAll` or `npm run build:getOne`. 
3. Update to AWS lambda function using `./dist/index.zip`.
4. Image files can be uploaded to path `/uploadimgs` on local environment.
5. Content type of image files is multipart/mixed and require this fields => ```{file : file, title : text, season : text, category1 : text, category2 : text, created_at : text, } ```
