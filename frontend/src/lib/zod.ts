import { ZodRawShape, z } from "zod"

export const LoginSchema = z.object({
  username: z
    .string()
    .min(4, { message: "Tên đăng nhập phải có ít nhất 4 ký tự" }),
  password: z
    .string()
}).superRefine(({ username }, ctx) => {
  if (username.includes(" ")) {
    ctx.addIssue({
      code: "custom",
      message: "Tên tài khoản không được có khoảng trắng",
      path: ["username"]
    })
  }
})

const SignUpSchema = z.object({
  username: z
    .string({required_error: "Tên đăng nhập là bắt buộc"})
    .min(4, { message: "Tên đăng nhập phải có ít nhất 4 ký tự" }),
  password: z
    .string({ required_error: "Mật khẩu là bắt buộc" })
    .min(8, { message: "Mật khẩu phải có ít nhất 8 ký tự" }),
  confirmPassword: z
    .string({ required_error: "Nhập lại mật khẩu là bắt buộc" }),
  name: z
    .string({ required_error: "Tên là bắt buộc"})
    .min(1, { message: "Họ tên không để trống" }),
  email: z
    .string({required_error: "Email là bắt buộc"})
    .email("Đây là email không hợp lệ"),
  address: z
    .string()
});

export function MergeSignUp(schema: ZodRawShape) {
  return SignUpSchema
    .extend(schema)
    .superRefine(({ password, confirmPassword, username }, ctx) => {
      if (password != confirmPassword) {
        ctx.addIssue({
          code: "custom",
          message: "Mật khẩu không khớp",
          path: ["confirmPassword"]
        })
      }

      if (username.includes(" ")) {
        ctx.addIssue({
          code: "custom",
          message: "Tên tài khoản không được có khoảng cách",
          path: ["username"]
        })
      }
    });
}

export const UserSignUpSchema = MergeSignUp({
  birthday: z
    .date( {required_error: "Ngày sinh là bắt buộc"} ),
})

export const LibrarySignUpSchema = MergeSignUp({
  maxBorrowDays: z.number().min(1, {message: "Số ngày mượn tối đa phải ít nhất là 1"}),
  lateFreePerDay: z.number().min(1, {message: "Số tiền phạt trễ ít nhất là 1 nghìn đồng"}),
})

export const InfoLibrarySchema = z.object({
    name: z.string(),
    address: z.string(),
    description: z.string(),
    maxBorrowDays: z.number(),
    lateFeePerDay: z.number(),
    username: z.string(),
}).superRefine(({ username }, ctx) => {
  if (username.includes(" ")) {
    ctx.addIssue({
      code: "custom",
      message: "Tên tài khoản không được có khoảng cách",
      path:["username"]
    })
  }
})

export const InfoUserSchema = z.object({
  name: z.string(),
  email: z.string(),
  dateOfBirth: z.string(),
  address: z.string(),
})

export const UserPasswordSchema = z.object({
  password: z
    .string({ required_error: "Mật khẩu là bắt buộc" }),
  confirmPassword: z
    .string({ required_error: "Nhập lại mật khẩu là bắt buộc" }),
  newPassword: z
    .string({ required_error: "Mật khẩu mới là bắt buộc" })
    .min(8, { message: "Mật khẩu phải có ít nhất 8 ký tự" }),
}).superRefine(({ newPassword, confirmPassword }, ctx) => {
  if (newPassword != confirmPassword) {
    ctx.addIssue({
      code: "custom",
      message: "Mật khẩu không khớp",
      path: ["confirmPassword"]
    })
  }
});

export const AddBookSchema = z.object({
  title: z.string(),
  author: z.string(),
  genres: z.string(),
  description: z.string(),
  publisher: z.string(),
  publishDate: z.string(),
  numPages: z.number(), 
  totalNum: z.number(), 
  language: z.string(),
  coverImage: z.array(z.instanceof(File))
});
