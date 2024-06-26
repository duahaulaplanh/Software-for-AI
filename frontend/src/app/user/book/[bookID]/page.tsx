import Image from "next/image";
import Link from "next/link";
import BorrowForm from "@/components/user/borrow-form";
import { Ratings } from "@/components/ui/ratings";
import { STIX_Two_Text, Nunito, Playfair_Display } from "next/font/google";
import { cn } from "@/lib/utils";
import { auth } from "@/lib/auth";
import { GetBookByID, GetBookReviews, GetLibraryByID, GetUserInfo, GetUserLibrary } from "@/lib/api";

import { Review } from "@/components/user/review";
import ReviewForm from "@/components/user/review-form";
import { BookReview } from "@/lib/interface";

const stix = STIX_Two_Text({
  weight: "600",
  subsets: ["latin"],
});

const nunito = Nunito({
  subsets: ["latin"]
});

const playfair = Playfair_Display({
  weight: "500",
  subsets: ["latin"],
  style: "italic"
})

type Props = {
  params: { bookID: string };
};

function LinkField({
  label,
  value,
  href,
}: {
  label: string,
  value: string,
  href: string,
}) {
  return (
    <div className="space-y-3">
      <h2 className="text-slate-700 text-base">
        {label}
      </h2>
      <div>
        <Link
          className={cn(nunito.className, "text-muted-foreground text-pretty hover:underline underline-offset-8")}
          href={href}
        >
          <span>{value}</span>
        </Link>
      </div>
    </div >
  )
}

function TextField({ label, value }: { label: string, value: string }) {
  return (
    <div className="space-y-3">
      <h2 className="text-slate-700 text-base">
        {label}
      </h2>
      <p className={cn(nunito.className, "text-muted-foreground text-pretty text-justify")}>
        {value}
      </p>
    </div>
  )
}

/** Generate Metadata for book page based on book title */
export async function generateMetadata({ params }: Props) {
  const book = await GetBookByID(params.bookID);
  return { title: `Thư viện Bobo | ${book.title}` }
}

export default async function Page({ params }: Props) {
  const data = (await auth())?.user;
  const book = await GetBookByID(params.bookID);
  const lib = await GetLibraryByID(book.libraryID);
  const libs = await GetUserLibrary(data.jwt)
  const reviews = await GetBookReviews(params.bookID);
  const user = await GetUserInfo(data.jwt);

  return (
    <div className="space-y-12">
      <div className="lg:-space-y-[90px]">
        <div className='lg:grid lg:grid-flow-col lg:grid-cols-2 gap-x-6'>
          <div className="flex items-center justify-center">
            <div
              className="overflow-hidden flex rounded-r-xl shadow-[-4px_4px_rgba(150,150,150,_0.3),_-8px_8px_rgba(150,150,150,_0.25),_-12px_12px_rgba(150,150,150,_0.2),_-16px_16px_rgba(150,150,150,_0.15),_-20px_20px_rgba(150,150,150,_0.1),_-24px_24px_rgba(150,150,150,_0.05)]"
              style={{ width: "300px", height: "450px" }}
              key={book._id}
            >
              <Image
                src={book.imageUrl}
                alt={book.title}
                height={200}
                width={300}
                className="object-cover transition-all"
              />
            </div>
          </div>
          <div className="flex flex-col py-6 h-full justify-between">
            <div className="flex flex-col space-y-4 lg:space-y-6">
              {book.series != null &&
                <div className="text-slate-600">
                  <div className="grid grid-cols-1 grid-flow-row">
                    {book.series.map((series) => (
                      <Link
                        key={series}
                        href={`/user/explore/series/${series}`}
                        className={cn(playfair.className, "text-xl hover:text-primary")}
                      >
                        {series}
                      </Link>
                    ))}
                  </div>
                </div>
              }
              <h1 className={cn("text-4xl lg:text-5xl text-wrap", stix.className)}>
                {book.title}
              </h1>
              <div className={cn("flex items-center gap-x-20 text-base text-wrap h-fit", nunito.className)}>
                <div className="flex flex-wrap gap-4 items-center">
                  {book.author.map((author) => (
                    <Link
                      key={author}
                      className="hover:underline underline-offset-8 cursor-pointer"
                      href={`/user/explore/author/${author}`}
                    >
                      {author}
                    </Link>
                  ))}
                </div>
                <span className="text-slate-500">
                  {book.numPages} trang
                </span>
              </div>
              {/* <div className="flex items-center space-x-5"> */}
              {/* <Ratings
                  rating={book.avgRating}
                  totalStars={5}
                  variant="yellow"
                  className="flex"
                  size={25}
                  disabled={true}
                />
                <span className={cn("text-lg", nunito.className)}>{book.avgRating}/5</span> */}
              {/* <span className="text-sm text-muted-foreground">{book.numOfRating} ratings</span> */}
              {/* </div> */}
              <div className="flex flex-wrap gap-4 items-center">
                {book.genres.map((genre) => (
                  <Link
                    key={genre}
                    className="text-sm underline-offset-4 lg:text-base lg:underline-offset-8 text-muted-foreground hover:text-primary  underline cursor-pointer"
                    href={`/user/explore/genre/${genre}`}
                  >
                    {genre}
                  </Link>
                ))}
              </div>
            </div>
            <div className="pt-6">
              <BorrowForm
                book={book}
                libs={libs}
                libID={lib._id}
                libFee={lib.lateFeePerDay}
                libDate={lib.maxBorrowDays}
                userID={user?.id}
                token={data.jwt}
              />
            </div>
          </div>
        </div>
        <div className="bg-white px-12 pb-12 pt-12 lg:pt-32 rounded-2xl shadow-[rgba(50,50,93,0.08)_0px_0px_12px_-2px,_rgba(0,0,0,0.08)_0px_3px_7px_-3px]">
          <div className="lg:grid lg:grid-cols-2 justify-between w-full lg:gap-24 flex flex-col gap-y-10">
            <div className="lg:col-start-1">
              <TextField
                label="Mô tả"
                value={book.description == null ? "Không có" : book.description}
              />
            </div>
            <div className="lg:grid lg:grid-cols-2 lg:gap-10 flex flex-col gap-y-10 justify-between">
              <LinkField
                label="Thư viện"
                value={lib.name}
                href={`/user/explore/library/${lib._id}`}
              />
              <TextField
                label="Địa chỉ"
                value={lib.address}
              />
              <LinkField
                label="Nhà xuất bản"
                value={book.publisher}
                href={`/user/explore/publisher/${book.publisher}`}
              />
              <TextField
                label="Ngày xuất bản"
                value={book.publishDate}
              />
              <LinkField
                label="Ngôn ngữ"
                value={book.language}
                href={`/user/explore/language/${book.language}`}
              />
              <TextField
                label="Số lượng hiện tại"
                value={`${book.currentNum} cuốn`}
              />
            </div>
          </div>
        </div>
      </div >
      <div className={cn("space-y-4", nunito.className)}>
        <span className="text-lg font-bold" >
          Đánh giá trải nghiệm của bạn
        </span>
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-3 md:col-span-1  bg-white p-6 rounded-2xl shadow-[rgba(50,50,93,0.08)_0px_0px_12px_-2px,_rgba(0,0,0,0.08)_0px_3px_7px_-3px]">
            <div className="flex flex-col h-full space-y-3 justify-center items-center ">
              <span className="text-2xl font-bold">{book.avgRating} / 5</span>
              <Ratings
                rating={book.avgRating}
                totalStars={5}
                variant="yellow"
                className="flex"
                size={20}
                disabled={true}
              />
              <span className="text-sm text-muted-foreground">({book.numOfRating} đánh giá)</span>
              {/* <div className="w-[70%]">
                <RatingBar />
              </div> */}
            </div>
          </div>
          <div className="col-span-3 md:col-span-2 p-6 bg-white rounded-2xl shadow-[rgba(50,50,93,0.08)_0px_0px_12px_-2px,_rgba(0,0,0,0.08)_0px_3px_7px_-3px]">
            <ReviewForm
              bookID={book._id}
              userID={user?.id}
            />
          </div>
        </div>
      </div>

      <div className={cn("space-y-4", nunito.className)}>
        <span className="text-lg font-bold" >
          Bạn đọc nhận xét
        </span>
        <div className="flex flex-col space-y-6">
          {reviews.reverse().map((review: BookReview) => (
            <Review
              avt={review.info.avatarUrl}
              name={review.info.name}
              content={review.review.content}
              rating={review.review.rating}
              reviewDate={review.review.reviewDate}
              key={review.review._id}
            />
          ))}
        </div>
      </div>
    </div >
  );
}