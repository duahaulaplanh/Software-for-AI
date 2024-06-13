import type { Book } from "@/lib/interface";
import BookImage from "./book-image";
import { cn } from "@/lib/utils";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    book: Book,
    width: string,
    height: string,
    classNameImage: string,
}

export default function BookCard({
    book,
    width,
    height,
    classNameImage,
    className
}: Props) {
    return (
        <figure
            key={book._id}
            className={cn("space-y-3", className)}>
            <BookImage
                book={book}
                style={{ width: width, height: height }}
                className={classNameImage}
            />
            <figcaption
                className="pt-2 space-y-2 text-wrap"
                style={{ width: width }}
            >
                <h3 className="text-base font-[650] text-pretty text-center line-clamp-2 w-full">
                    {book.title}
                </h3>
                <div className="text-[13px] space-y-1">
                    <div className="font-semibold text-muted-foreground text-pretty text-center">
                        <ul className="space-y-1">
                            {book.author.map((author) => (
                                <li key={author}>{author}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </figcaption>
        </figure>
    )
}