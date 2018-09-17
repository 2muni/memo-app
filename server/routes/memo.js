import express from 'express';
import Memo from '../models/memo';
import mongoose from 'mongoose';

const router = express.Router();

// WRITE MEMO
/*
    WRITE MEMO: POST /api/memo
    BODY SAMPLE: { contents: "sample "}
    ERROR CODES
        1: NOT LOGGED IN
        2: CONTENTS IS NOT STRING
        3: EMPTY CONTENTS
*/
router.post('/', (req, res) => {
  // CHECK LOGIN STATUS
  // 세션확인 (로그인 여부 확인)
  if (typeof req.session.loginInfo === 'undefined') {
    return res.status(403).json({
      error: "NOT LOGGED IN",
      code: 1
    });
  }

  // CHECK CONTENTS VALID
  // 입력받은 콘텐츠의 데이터 타입이 문자열이 아닐 경우
  if (typeof req.body.contents !== 'string') {
    return res.status(400).json({
      error: "CONTENTS IS NOT STRING",
      code: 2
    });
  }

  // 입력받은 콘텐츠가 비어있는 경우
  if (req.body.contents === "") {
    return res.status(400).json({
      error: "EMPTY CONTENTS",
      code: 3
    });
  }

  // CREATE NEW MEMO
  // 위의 결격사항이 없을 경우 뉴 모델을 통하여 DB에 저장
  let memo = new Memo({
    writer: req.session.loginInfo.username,
    contents: req.body.contents
  });

  // SAVE IN DATABASE
  memo.save(err => {
    if (err) throw err;
    return res.json({ success: true });
  });
});

// GET MEMO LIST
/*
    READ MEMO: GET /api/memo
*/
router.get('/', (req, res) => {
  Memo.find() // 인자가 들어오지 않으면 -> 모든 도큐먼트를 조회
    .sort({ "_id": -1 }) // 1: 오름차순, -1: 내림차순 (최근것 부터 오래된 순으로 조회)
    .limit(6) // 무한 스크롤링을 구현하는데, 그 단위는 6개의 도큐먼트씩
    .exec((err, memos) => { // find().exec(): 쿼리를 프로미스를 만들기 위해 붙이는 메소드
      if (err) throw err;
      res.json(memos);
    });
});

// MODIFY MEMO
router.put('/:id', (req, res) => {

});

// DELETE MEMO
router.delete('/:id', (req, res) => {

});

export default router;