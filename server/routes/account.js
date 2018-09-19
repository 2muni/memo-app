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
  const usernameRegex = /^[a-z0-9]+$/;

  if (!usernameRegex.test(req.body.username)) {
    return res.status(400).json({ // HTTP 요청에 대한 리스폰스 (json 형식으로)
      error: "BAD USERNAME",
      code: 1
    });
  }

  // CHECK PASS LENGTH
  // 비밀번호 유형 검사 (4보다 작거나, 들어온 비밀번호의 값이 문자열이 아닐 경우)
  if (req.body.password.length < 4 || typeof req.body.password !== "string") {
    return res.status(400).json({
      error: "BAD PASSWORD",
      code: 2
    });
  }

  // CHECK USER EXISTANCE
  // 기존에 존재하는 username 이 있는지 DB 에서 확인
  Account.findOne({ username: req.body.username }, (err, exists) => { //Model.findOne 메소드
    if (err) throw err;
    if (exists) {
      return res.status(409).json({
        error: "USERNAME EXISTS",
        code: 3
      });
    }

    // CREATE ACCOUNT
    // 위의 코드 1~3 의 결격 사항이 없을 경우 db에 저장
    // hasher 를 이용해 비밀번호 보안
    hasher({ password: req.body.password }, (err, pass, salt, hash) => {
      const account = new Account({
        username: req.body.username,
        password: hash,
        salt: salt
      });
      account.save(err => {
        if (err) throw err;
        return res.json({ success: true });
      });
    });
  });
});

/*
    ACCOUNT SIGNIN: POST /api/account/signin
    BODY SAMPLE: { "username": "test", "password": "test" }
    ERROR CODES:
        1: PASSWORD IS NOT STRING
        2: THERE IS NO USER
        3: PASSWORD IS NOT CORRECT
*/
router.post('/signin', (req, res) => {
  // 비밀번호 데이터 타입 검사 (문자열인지 아닌지)
  if(typeof req.body.password !== "string") {
    return res.status(401).json({
      error: "PASSWORD IS NOT STRING",
      code: 1
    });
  }

  // FIND THE USER BY USERNAME
  // Model.findOne 메소드로 username이 같은 DB 검색 (첫번째 인자: Query)
  Account.findOne({ username: req.body.username }, (err, account) => {
    if(err) throw err;

    // CHECK ACCOUNT EXISTANCY
    // 검색 결과가 존재하지 않는 경우
    if(!account) {
      return res.status(401).json({
        error: "THERE IS NO USER",
        code: 2
      });
    }

    // CHECK WHETER THE PASSWORD IS VALID
    // 유저검색 결과가 있으면 검사 salt값으로 해쉬
    const validate = hasher({ password: req.body.password, salt: account.salt }, (err, pass, salt, hash) => {
      if(hash === account.password) {
        const session = req.session;
        session.loginInfo = {
          _id: account._id,
          username: account.username
        }

        // RETURN SUCCESS
        return res.json({
          success: true
        });
      }else {
        // 다른 경우
        return res.status(401).json({
          error: "PASSWORD IS NOT CORRECT",
          code: 3
        });
      }
    });
  });
});

/*
    GET CURRENT USER INFO GET /api/account/getInfo
    ERROR CODES:
        1: THERE IS NO LOGIN DATA
*/
router.get('/getinfo', (req, res) => {
  if(typeof req.session.loginInfo === "undefined") {
    return res.status(401).json({
      error: "THERE IS NO LOGIN DATA",
      code: 1
    });
  }

  res.json({ info: req.session.loginInfo });
});

/*
    LOGOUT: POST /api/account/logout
*/
router.post('/logout', (req, res) => {
  // req.session.destroy() 메소드로 세션을 파괴
  req.session.destroy(err => { if(err) throw err; });
  return res.json({ sucess: true });
});

/*
    SEARCH USER: GET /api/account/search/:username
*/
router.get('/search/:username', (req, res) => {
  // SEARCH USERNAMES THAT STARTS WITH GIVEN KEYWORD USING REGEX
  var re = new RegExp('^' + req.params.username);
  Account.find({username: {$regex: re}}, {_id: false, username: true})
  .limit(5)
  .sort({username: 1})
  .exec((err, accounts) => {
      if(err) throw err;
      res.json(accounts);
  });
});

// EMPTY SEARCH REQUEST: GET /api/account/search
router.get('/search', (req, res) => {
  res.json([]);
});


export default router;