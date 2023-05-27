import express from "express";
import multer from "multer";
import { BlockUser, GetUsers, Login, Logout, MakeAdmin, NewUser, RemoveAdmin, ResetPassword, SendPasswordResetMail, SendVerifyEmail, SignUp, UnBlockUser, UpdateLeadFieldRoles, UpdateProfile, UpdateUser, VerifyEmail, updatePassword } from "../controllers/user.controller";
import { isAdmin, isAuthenticatedUser, } from "../middlewares/auth.middleware";

const router = express.Router()
const upload = multer({ storage: multer.diskStorage({ destination: "/tmp/" }) })

router.post("/signup", upload.single("dp"), SignUp)
router.route("/users")
    .get(isAuthenticatedUser, isAdmin, GetUsers)
    .post(isAuthenticatedUser, isAdmin, upload.single("dp"), NewUser)
router.route("/users/:id")
    .put(isAuthenticatedUser, isAdmin, upload.single("dp"), UpdateUser)
router.patch("/make-admin/user/:id", isAuthenticatedUser, isAdmin, MakeAdmin)
router.patch("/block/user/:id", isAuthenticatedUser, isAdmin, BlockUser)
router.patch("/unblock/user/:id", isAuthenticatedUser, isAdmin, UnBlockUser)
router.patch("/remove-admin/user/:id", isAuthenticatedUser, isAdmin, RemoveAdmin)
router.patch("/update-lead-field-roles/user/:id", isAuthenticatedUser, isAdmin, UpdateLeadFieldRoles)
router.post("/login", Login)
router.post("/logout", Logout)
router.route("/profile")
    .put(isAuthenticatedUser, upload.single("dp"), UpdateProfile)
router.route("/password/update").patch(isAuthenticatedUser, updatePassword)
router.post("/email/verify", isAuthenticatedUser, SendVerifyEmail)
router.patch("/email/verify/:token", VerifyEmail)
router.post("/password/reset", SendPasswordResetMail)
router.patch("/password/reset/:token", ResetPassword)


export default router;