import express from "express";
import {
    createReview,
    deleteReview,
    getReview,
    getReviews,
    updateReview,
    getReviewsByProductId,
    getUserReviews
} from "../controllers/review.js";
import { checkReviewOwnership, verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

//CREATE
router.post("/create", createReview);

//UPDATE
router.put("/:id", checkReviewOwnership, updateReview);

//DELETE
router.delete("/:id", checkReviewOwnership, deleteReview);

//GET
router.get("/:id", getReview);

//GET ALL
router.get("/", getReviews);

//GET Reviews BY Product ID (아직 안됌)
router.get("/review/:productid", getReviewsByProductId);

// 로그인한 사용자가 작성한 리뷰 가져오기
router.get("/user", verifyToken, getUserReviews);


export default router;
