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
/*
    READ ADDITIONAL (OLD/NEW) MEMO: GET /api/memo/:listType/:id
*/
router.get('/:listType/:id', (req, res) => {
  let listType = req.params.listType;
  let id = req.params.id;

  // CHECK LIST TYPE VALIDITY
  // url 을 통해 들어온 listType 파라메터가 old/new 둘 다 아닐경우
  if (listType !== 'old' && listType !== 'new') {
    return res.status(400).json({
      error: "INVALID LISTTYPE",
      code: 1
    });
  }

  // CHECK MEMO ID VALIDITY
  // 들어온 id 값이 mongodb 형식인지 조회
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      error: "INVALID ID",
      code: 2
    });
  }

  let objId = new mongoose.Types.ObjectId(req.params.id);

  if (listType === 'new') {
    // GET NEWER MEMO
    Memo.find({ _id: { $gt: objId } })
      .sort({ _id: -1 }) //내림차순
      .limit(6)
      .exec((err, memos) => {
        if (err) throw err;
        return res.json(memos);
      });
  } else {
    // GET OLDER MEMO
    Memo.find({ _id: { $lt: objId } })
      .sort({ _id: -1 }) //오름차순이 아닌 내림차순이어야함. 정렬하는 순서는 같다 (home에서 보여질 때)
      .limit(6)
      .exec((err, memos) => {
        if (err) throw err;
        return res.json(memos);
      });
  }
});

// MODIFY MEMO
/*
    MODIFY MEMO: PUT /api/memo/:id
    BODY SAMPLE: { contents: "sample "}
    ERROR CODES
        1: INVALID ID,
        2: CONTENTS IS NOT STRING
        3: EMPTY CONTENTS
        4: NOT LOGGED IN
        5: NO RESOURCE
        6: PERMISSION FAILURE
*/
router.put('/:id', (req, res) => {

  // CHECK MEMO ID VALIDITY
  // url 파라메터 값으로 전달받은 id값이 몽고db 형식인지 검사
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      error: "INVALID ID",
      code: 1
    });
  }

  // CHECK CONTENTS VALID
  // 수정할 내용이 문자열이 아닌 경우
  if (typeof req.body.contents !== 'string') {
    return res.status(400).json({
      error: "CONTENTS IS NOT STRING",
      code: 2
    });
  }

  // 수정할 내용이 비어있는 경우
  if (req.body.contents === "") {
    return res.status(400).json({
      error: "EMPTY CONTENTS",
      code: 3
    });
  }

  // CHECK LOGIN STATUS
  // 세션을 통해 로그인 여부 확인
  if (typeof req.session.loginInfo === 'undefined') {
    return res.status(403).json({
      error: "NOT LOGGED IN",
      code: 4
    });
  }

  // FIND MEMO
  // id 로 도큐먼트 조회
  Memo.findById(req.params.id, (err, memo) => {
    if (err) throw err;

    // IF MEMO DOES NOT EXIST
    // id는 몽고db 형식이지만 메모가 없을 경우
    if (!memo) {
      return res.status(404).json({
        error: "NO RESOURCE",
        code: 5
      });
    }

    // IF EXISTS, CHECK WRITER
    // 검색된 메모의 작성자와 로그인된 데이터가 다른 경우 - 권한 없음
    if (memo.writer != req.session.loginInfo.username) {
      return res.status(403).json({
        error: "PERMISSION FAILURE",
        code: 6
      });
    }

    // MODIFY AND SAVE IN DATABASE
    // 결격사항이 없을 경우 메모를 수정하고 DB 에 저장
    memo.contents = req.body.contents;
    memo.date.edited = new Date();
    memo.is_edited = true;

    memo.save((err, memo) => {
      if (err) throw err;
      return res.json({
        success: true,
        memo
      });
    });

  });
});

// DELETE MEMO
/*
    DELETE MEMO: DELETE /api/memo/:id
    ERROR CODES
        1: INVALID ID
        2: NOT LOGGED IN
        3: NO RESOURCE
        4: PERMISSION FAILURE
*/
router.delete('/:id', (req, res) => {

  // CHECK MEMO ID VALIDITY
  // url 파라메터로 전달받은 id 가 mongodb id 형식에 맞는지 검사
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      error: "INVALID ID",
      code: 1
    });
  }

  // CHECK LOGIN STATUS
  // 세션을 통해 로그인 여부 확인
  if (typeof req.session.loginInfo === 'undefined') {
    return res.status(403).json({
      error: "NOT LOGGED IN",
      code: 2
    });
  }

  // FIND MEMO AND CHECK FOR WRITER
  // 몽구스 Model.findById 로 메모 조회 - 첫 번째 인자: 찾을 도큐먼트의 _id값
  Memo.findById(req.params.id, (err, memo) => {
    if (err) throw err;
    // _id 형식은 몽고db 형식이지만, 해당하는 메모가 없을 경우
    if (!memo) {
      return res.status(404).json({
        error: "NO RESOURCE",
        code: 3
      });
    }
    // 해당 메모의 작성자와 세션에 로그인된 유저가 다를 경우
    if (memo.writer != req.session.loginInfo.username) {
      return res.status(403).json({
        error: "PERMISSION FAILURE",
        code: 4
      });
    }

    // REMOVE THE MEMO
    // 위의 모든 결격사항이 없을 경우 메모를 삭제
    Memo.remove({ _id: req.params.id }, err => {
      if (err) throw err;
      res.json({ success: true });
    });
  });
});


export default router;