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
  if(typeof req.session.loginInfo === 'undefined') {
      return res.status(403).json({
          error: "NOT LOGGED IN",
          code: 1
      });
  }

  // CHECK CONTENTS VALID
  // 입력받은 콘텐츠의 데이터 타입이 문자열이 아닐 경우
  if(typeof req.body.contents !== 'string') {
      return res.status(400).json({
          error: "CONTENTS IS NOT STRING",
          code: 2
      });
  }

  // 입력받은 콘텐츠가 비어있는 경우
  if(req.body.contents === "") {
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
  memo.save( err => {
      if(err) throw err;
      return res.json({ success: true });
  });
});
 
// MODIFY MEMO
router.put('/:id', (req, res) => {
 
});
 
// DELETE MEMO
router.delete('/:id', (req, res) => {
 
});
 
// GET MEMO LIST
router.get('/', (req, res) => {
 
});
 
export default router;