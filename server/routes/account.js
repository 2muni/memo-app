import express from 'express';
import Account from '../models/account';
import bkfd2Password from 'pbkdf2-password';

const hasher = bkfd2Password();
const router = express.Router();


/*
    ACCOUNT SIGNUP: POST /api/account/signup
    BODY SAMPLE: { "username": "test", "password": "test" }
    ERROR CODES:
        1: BAD USERNAME
        2: BAD PASSWORD
        3: USERNAM EXISTS
*/
router.post('/signup', (req, res) => {
  // CHECK USERNAME FORMAT
  // 유저네임으로 사용할 수 있는 문자는 영어와 숫자 뿐
  let usernameRegex = /^[a-z0-9]+$/;

  if(!usernameRegex.test(req.body.username)) {
      return res.status(400).json({ // HTTP 요청에 대한 리스폰스 (json 형식으로)
          error: "BAD USERNAME",
          code: 1
      });
  }

  // CHECK PASS LENGTH
  // 비밀번호 유형 검사 (4보다 작거나, 들어온 비밀번호의 값이 문자열이 아닐 경우)
  if(req.body.password.length < 4 || typeof req.body.password !== "string") {
      return res.status(400).json({
          error: "BAD PASSWORD",
          code: 2
      });
  }

  // CHECK USER EXISTANCE
  // 기존에 존재하는 username 이 있는지 DB 에서 확인
  Account.findOne({ username: req.body.username }, (err, exists) => { //Model.findOne 메소드
      if (err) throw err;
      if(exists){
          return res.status(409).json({
              error: "USERNAME EXISTS",
              code: 3
          });
      }

      // CREATE ACCOUNT
      // 위의 코드 1~3 의 결격 사항이 없을 경우 db에 저장
      // hasher 를 이용해 비밀번호 보안
      hasher({password:req.body.password}, function(err, pass, salt, hash){
        let account = new Account({
            username: req.body.username,
            password: hash,
            salt: salt
        });
        account.save( err => {
            if(err) throw err;
            return res.json({ success: true });
        });
      });
  });
});

router.post('/signin', (req, res) => {
  res.json({ success: true });
});

router.get('/getinfo', (req, res) => {
  res.json({ info: null });
});

router.post('/logout', (req, res) => {
  return res.json({ success: true });
});

export default router;